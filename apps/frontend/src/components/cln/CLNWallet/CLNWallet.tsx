import './CLNWallet.scss';
import 'react-perfect-scrollbar/dist/css/styles.css';
import { useContext } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Spinner from 'react-bootstrap/Spinner';
import Alert from 'react-bootstrap/Alert';

import { AppContext } from '../../../store/AppContext';
import { LightningWalletSVG } from '../../../svgs/LightningWallet';
import { WithdrawSVG } from '../../../svgs/Withdraw';
import { DepositSVG } from '../../../svgs/Deposit';
import CLNTransactionsList from '../CLNTransactionsList/CLNTransactionsList';
import CurrencyBox from '../../shared/CurrencyBox/CurrencyBox';

const CLNWallet = (props) => {
  const appCtx = useContext(AppContext);
  
  return (
    <Card className='h-100 d-flex align-items-stretch'>
      <Card.Body className='d-flex align-items-stretch flex-column p-0'>
        <Card className='bg-primary wallet-card'>
          <Card.Body>
            <Col xs={12} className='ps-2 pt-2 d-flex align-items-center justify-content-start'>
              <LightningWalletSVG svgClassName='me-4' className='fill-contrast' />
              <div>
                <div className='fs-6 fw-bold'>Lightning Wallet</div>
                { appCtx.walletBalances.isLoading ? 
                    <Spinner animation='grow' variant='secondary' /> : 
                  appCtx.walletBalances.error ? 
                    <Alert className='py-0 px-1 fs-7' variant='danger'>{appCtx.walletBalances.error}</Alert> : 
                    <CurrencyBox value={appCtx.walletBalances.clnLocalBalance} shorten={false} rootClasses='d-inline-flex flex-column' currencyClasses='lh-1 fs-4 fw-bold' unitClasses='fs-7 fw-bold'></CurrencyBox>
                }
              </div>
            </Col>
          </Card.Body>
          <ButtonGroup className='sticky-bottom btn-group-action'>
            <button className='btn-actions btn-primary' onClick={() => props.onActionClick('send')}>
              <WithdrawSVG className='me-2' />
              Send
            </button>
            <button className='btn-actions btn-primary' onClick={() => props.onActionClick('receive')}>
              <DepositSVG className='me-2' />
              Receive
            </button>
          </ButtonGroup>
        </Card>
        <Card.Body className='px-4 list-scroll-container'>
          <div className='text-light'>Transactions</div>
          <PerfectScrollbar className='ps-show-always'>
            <CLNTransactionsList />
          </PerfectScrollbar>
        </Card.Body>
      </Card.Body>
    </Card>
  );
}

export default CLNWallet;
