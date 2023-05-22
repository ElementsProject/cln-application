import './CLNWallet.scss';
import 'react-perfect-scrollbar/dist/css/styles.css';
import { useContext, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PerfectScrollbar from 'react-perfect-scrollbar';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Spinner from 'react-bootstrap/Spinner';
import Alert from 'react-bootstrap/Alert';
import Tab from 'react-bootstrap/Tab';
import Nav from 'react-bootstrap/Nav';

import { AppContext } from '../../../store/AppContext';
import { LightningWalletSVG } from '../../../svgs/LightningWallet';
import { WithdrawSVG } from '../../../svgs/Withdraw';
import { DepositSVG } from '../../../svgs/Deposit';
import CLNTransactionsList from '../CLNTransactionsList/CLNTransactionsList';
import CurrencyBox from '../../shared/CurrencyBox/CurrencyBox';
import { TRANSITION_DURATION } from '../../../utilities/constants';
import CLNOffersList from '../CLNOffersList/CLNOffersList';

const CLNWallet = (props) => {
  const appCtx = useContext(AppContext);
  const [selectedTab, setSelectedTab] = useState('transactions');

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
            <Tab.Container id='cln-transactions-tab-id' 
              activeKey={selectedTab}
              onSelect={(selTab) => setSelectedTab(selTab || 'transactions')}
              
              >
              <Nav className='flex-row cln-transactions-tabs'>
                <Nav.Item>
                  <Nav.Link eventKey='transactions'>Transactions</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey='offers'>Offers</Nav.Link>
                </Nav.Item>
              </Nav>
              <PerfectScrollbar className='ps-show-always'>
                <AnimatePresence mode='wait'>
                  <motion.div
                    key={selectedTab}
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: TRANSITION_DURATION }}
                    className='h-100 d-flex align-items-stretch'
                  >
                    <Tab.Content className='d-flex'>
                          <Tab.Pane className='list-scroll-container' eventKey='transactions'>
                              <CLNTransactionsList />
                          </Tab.Pane>
                          <Tab.Pane eventKey='offers'>
                            <CLNOffersList />
                          </Tab.Pane>
                    </Tab.Content>
                  </motion.div>
                </AnimatePresence>
              </PerfectScrollbar>
            </Tab.Container>
        </Card.Body>
      </Card.Body>
    </Card>
  );
}

export default CLNWallet;
