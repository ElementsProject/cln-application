import './BTCWallet.scss';
import { lazy, Suspense } from 'react';
import { Spinner, Alert, Card, Col, ButtonGroup } from 'react-bootstrap';
const BTCTransactionsList = lazy(() => import('../BTCTransactionsList/BTCTransactionsList'));
import { BitcoinWalletSVG } from '../../../svgs/BitcoinWallet';
import { WithdrawSVG } from '../../../svgs/Withdraw';
import { DepositSVG } from '../../../svgs/Deposit';
import CurrencyBox from '../../shared/CurrencyBox/CurrencyBox';
import { useDispatch, useSelector } from 'react-redux';
import { selectIsAuthenticated, selectWalletBalances } from '../../../store/rootSelectors';
import { Loading } from '../../ui/Loading/Loading';
import { RefreshSVG } from '../../../svgs/Refresh';
import { resetListBitcoinTransactions, setListBitcoinTransactions, setListBitcoinTransactionsLoading } from '../../../store/clnSlice';
import { CLNService } from '../../../services/http.service';
import { ListBitcoinTransactions } from '../../../types/cln.type';
import { convertArrayToBTCTransactionsObj } from '../../../services/data-transform.service';
import { SCROLL_PAGE_SIZE } from '../../../utilities/constants';

const BTCWallet = (props) => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const walletBalances = useSelector(selectWalletBalances);

  const refreshHandler = async () => {
    dispatch(setListBitcoinTransactionsLoading(true));
    dispatch(resetListBitcoinTransactions());
    try {
      const offset = 0;
      const listBtcTransactionsRes: any = await CLNService.listBTCTransactions(offset);
      
      if (listBtcTransactionsRes.error) {
        dispatch(setListBitcoinTransactions({ 
          error: listBtcTransactionsRes.error 
        } as ListBitcoinTransactions));
        return;
      }

      const latestBtcTransactions = convertArrayToBTCTransactionsObj(listBtcTransactionsRes.rows);
      dispatch(setListBitcoinTransactions({ 
        btcTransactions: latestBtcTransactions,
        page: 1,
        hasMore: latestBtcTransactions.length >= SCROLL_PAGE_SIZE,
        isLoading: false,
        error: undefined
      } as ListBitcoinTransactions));
    } catch (error: any) {
      dispatch(setListBitcoinTransactions({ 
        error: error.message || 'Failed to load transactions'
      } as ListBitcoinTransactions));
    } finally {
      dispatch(setListBitcoinTransactionsLoading(false));
    }
  }

  return (
    <Card className="h-100 d-flex align-items-stretch" data-testid="btc-wallet">
      <Card.Body className="d-flex align-items-stretch flex-column p-0">
        <Card className="bg-primary wallet-card" data-testid="btc-wallet-balance-card">
          <Card.Body>
            <Col xs={12} className="ps-2 pt-2 d-flex align-items-center justify-content-start">
              <BitcoinWalletSVG svgClassName="me-4" className="fill-contrast" />
              <div>
                <div className='fs-6 fw-bold'>Bitcoin Wallet</div>
                { isAuthenticated && walletBalances.isLoading ? 
                    <Spinner animation='grow' variant='secondary' data-testid="btc-wallet-spinner"/> : 
                  walletBalances.error ? 
                    <Alert className='py-0 px-1 fs-7' variant='danger' data-testid="btc-wallet-error">{walletBalances.error}</Alert> : 
                    <CurrencyBox value={walletBalances.btcSpendableBalance} shorten={false} rootClasses='d-inline-flex flex-column' currencyClasses='lh-1 fs-4 fw-bold' unitClasses='fs-7 fw-bold'></CurrencyBox>
                }
                </div>
            </Col>
          </Card.Body>
          <ButtonGroup className="sticky-bottom btn-group-action">
            <button
              className="btn-actions btn-primary"
              onClick={() => props.onActionClick('withdraw')}
              data-testid='withdraw-button'
            >
              <WithdrawSVG className="me-2" />
              Withdraw
            </button>
            <button
              className="btn-actions btn-primary"
              onClick={() => props.onActionClick('deposit')}
              data-testid='deposit-button'
            >
              <DepositSVG className="me-2" />
              Deposit
            </button>
          </ButtonGroup>
        </Card>
        <Card.Body className="px-4 list-scroll-container">
          <div className="text-light btc-transactions-tabs">Transactions
            <span className="ms-2 span-refresh" onClick={refreshHandler} >
              <RefreshSVG />
            </span>
          </div>
          <Suspense fallback={<Loading />}>
            <BTCTransactionsList />
          </Suspense>
        </Card.Body>
      </Card.Body>
    </Card>
  );
};

export default BTCWallet;
