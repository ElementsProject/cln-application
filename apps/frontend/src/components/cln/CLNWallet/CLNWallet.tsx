import './CLNWallet.scss';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { Card, Col, ButtonGroup, Spinner, Alert, Tab, Nav } from 'react-bootstrap';

import { LightningWalletSVG } from '../../../svgs/LightningWallet';
import { WithdrawSVG } from '../../../svgs/Withdraw';
import { DepositSVG } from '../../../svgs/Deposit';
import CLNTransactionsList from '../CLNTransactionsList/CLNTransactionsList';
import CurrencyBox from '../../shared/CurrencyBox/CurrencyBox';
import { TRANSITION_DURATION } from '../../../utilities/constants';
import CLNOffersList from '../CLNOffersList/CLNOffersList';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated, selectWalletBalances } from '../../../store/rootSelectors';

const CLNWallet = (props) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const walletBalances = useSelector(selectWalletBalances);
  const [selectedTab, setSelectedTab] = useState('transactions');

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
                  <span>Transactions</span>
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="offers">
                  <span>Offers</span>
                </Nav.Link>
              </Nav.Item>
            </Nav>
            <PerfectScrollbar>
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
                      <CLNTransactionsList />
                    </Tab.Pane>
                    <Tab.Pane eventKey="offers">
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
};

export default CLNWallet;
