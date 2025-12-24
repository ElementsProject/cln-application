import './CLNWallet.scss';
import { useState, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, Col, ButtonGroup, Spinner, Alert, Tab, Nav } from 'react-bootstrap';
const CLNTransactionsList = lazy(() => import('../CLNTransactionsList/CLNTransactionsList'));
const CLNOffersList = lazy(() => import('../CLNOffersList/CLNOffersList'));
import { LightningWalletSVG } from '../../../svgs/LightningWallet';
import { WithdrawSVG } from '../../../svgs/Withdraw';
import { DepositSVG } from '../../../svgs/Deposit';
import CurrencyBox from '../../shared/CurrencyBox/CurrencyBox';
import { SCROLL_PAGE_SIZE, TRANSITION_DURATION } from '../../../utilities/constants';
import { useDispatch, useSelector } from 'react-redux';
import { selectIsAuthenticated, selectWalletBalances } from '../../../store/rootSelectors';
import { Loading } from '../../ui/Loading/Loading';
import { RefreshSVG } from '../../../svgs/Refresh';
import { resetListLightningTransactions, resetListOffers, setListLightningTransactions, setListLightningTransactionsLoading, setListOffers, setListOffersLoading } from '../../../store/clnSlice';
import { CLNService } from '../../../services/http.service';
import { ListLightningTransactions, ListOffers } from '../../../types/cln.type';
import { convertArrayToLightningTransactionsObj, convertArrayToOffersObj } from '../../../services/data-transform.service';

const CLNWallet = (props) => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const walletBalances = useSelector(selectWalletBalances);
  const [selectedTab, setSelectedTab] = useState('transactions');

  const refreshHandler = async (calledBy) => {
    console.warn(calledBy);
    if(calledBy === 'OFFERS') {
      dispatch(setListOffersLoading(true));
      dispatch(resetListOffers());
      
      try {
        const offset = 0;
        const listOffersRes: any = await CLNService.listOffers(offset);
        
        if (listOffersRes.error) {
          dispatch(setListOffers({ 
            error: listOffersRes.error 
          } as ListOffers));
          return;
        }

        const latestOffers = convertArrayToOffersObj(listOffersRes.rows);
        dispatch(setListOffers({ 
          offers: latestOffers,
          page: 1,
          hasMore: latestOffers.length >= SCROLL_PAGE_SIZE,
          isLoading: false,
          error: undefined
        } as ListOffers));
        
      } catch (error: any) {
        dispatch(setListOffers({ 
          error: error.message || 'Failed to load offers'
        } as ListOffers));
      } finally {
        dispatch(setListOffersLoading(false));
      }
    } else {
      dispatch(setListLightningTransactionsLoading(true));
      dispatch(resetListLightningTransactions());
      try {
        const offset = 0;
        const listClnTransactionsRes: any = await CLNService.listLightningTransactions(offset);
        
        if (listClnTransactionsRes.error) {
          dispatch(setListLightningTransactions({ 
            error: listClnTransactionsRes.error 
          } as ListLightningTransactions));
          return;
        }

        const latestClnTransactions = convertArrayToLightningTransactionsObj(listClnTransactionsRes.rows);
        dispatch(setListLightningTransactions({ 
          clnTransactions: latestClnTransactions,
          page: 1,
          hasMore: latestClnTransactions.length >= SCROLL_PAGE_SIZE,
          isLoading: false,
          error: undefined
        } as ListLightningTransactions));
      } catch (error: any) {
        dispatch(setListLightningTransactions({ 
          error: error.message || 'Failed to load transactions'
        } as ListLightningTransactions));
      } finally {
        dispatch(setListLightningTransactionsLoading(false));
      }
    }
  }

  return (
    <Card className="h-100 d-flex align-items-stretch" data-testid="cln-wallet">
      <Card.Body className="d-flex align-items-stretch flex-column p-0">
        <Card className="bg-primary wallet-card" data-testid='cln-wallet-balance-card'>
          <Card.Body>
            <Col xs={12} className="ps-2 pt-2 d-flex align-items-center justify-content-start">
              <LightningWalletSVG svgClassName="me-4" className="fill-contrast" />
              <div>
                <div className='fs-6 fw-bold'>Lightning Wallet</div>
                { isAuthenticated && walletBalances.isLoading ? 
                    <Spinner animation='grow' variant='secondary' data-testid='cln-wallet-spinner'/> : 
                  walletBalances.error ? 
                    <Alert className='py-0 px-1 fs-7' variant='danger' data-testid='cln-wallet-error'>{walletBalances.error}</Alert> : 
                    <CurrencyBox value={walletBalances.clnLocalBalance} shorten={false} rootClasses='d-inline-flex flex-column' currencyClasses='lh-1 fs-4 fw-bold' unitClasses='fs-7 fw-bold' data-testid='cln-wallet-currency-box'></CurrencyBox>
                }
              </div>
            </Col>
          </Card.Body>
          <ButtonGroup className="sticky-bottom btn-group-action">
            <button
              className="btn-actions btn-primary"
              onClick={() => props.onActionClick('send')}
              data-testid="send-button"
            >
              <WithdrawSVG className="me-2" />
              Send
            </button>
            <button
              className="btn-actions btn-primary"
              onClick={() => props.onActionClick('receive')}
              data-testid="receive-button"
            >
              <DepositSVG className="me-2" />
              Receive
            </button>
          </ButtonGroup>
        </Card>
        <Card.Body className="px-4 list-scroll-container">
          <Tab.Container
            id="cln-transactions-tab-id"
            activeKey={selectedTab}
            onSelect={selTab => setSelectedTab(selTab || 'transactions')}
          >
            <Nav className="flex-row cln-transactions-tabs">
              <Nav.Item>
                <Nav.Link eventKey="transactions">
                  <span>Transactions
                    <span className="ms-2 span-refresh" onClick={() => refreshHandler('CLNTXS')} >
                      <RefreshSVG />
                    </span>
                  </span>
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="offers">
                  <span>Offers
                    <span className="ms-2 span-refresh" onClick={() => refreshHandler('OFFERS')} >
                      <RefreshSVG />
                    </span>
                  </span>
                </Nav.Link>
              </Nav.Item>
            </Nav>
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedTab}
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: TRANSITION_DURATION }}
                className="h-100 d-flex flex-column align-items-stretch"
              >
                <Tab.Content className="h-100 d-flex flex-column">
                  <Tab.Pane className="h-100 list-scroll-container" eventKey="transactions">
                    <Suspense fallback={<Loading />}>
                      <CLNTransactionsList />
                    </Suspense>
                  </Tab.Pane>
                  <Tab.Pane className="h-100 list-scroll-container" eventKey="offers">
                    <Suspense fallback={<Loading />}>
                      <CLNOffersList />
                    </Suspense>
                  </Tab.Pane>
                </Tab.Content>
              </motion.div>
            </AnimatePresence>
          </Tab.Container>
        </Card.Body>
      </Card.Body>
    </Card>
  );
};

export default CLNWallet;
