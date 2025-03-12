import React from 'react';

import './BTCWallet.scss';
import { useContext } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { Spinner, Alert, Card, Col, ButtonGroup } from 'react-bootstrap';

import { CLNContext } from '../../../store/CLNContext';
import { BitcoinWalletSVG } from '../../../svgs/BitcoinWallet';
import { WithdrawSVG } from '../../../svgs/Withdraw';
import { DepositSVG } from '../../../svgs/Deposit';
import CurrencyBox from '../../shared/CurrencyBox/CurrencyBox';
import BTCTransactionsList from '../BTCTransactionsList/BTCTransactionsList';
import { RootContext } from '../../../store/RootContext';

const BTCWallet = (props) => {
  const rootCtx = useContext(RootContext);
  const clnCtx = useContext(CLNContext);

  return (
    <Card className='h-100 d-flex align-items-stretch' data-testid="btc-wallet">
      <Card.Body className='d-flex align-items-stretch flex-column p-0'>
        <Card className='bg-primary wallet-card'>
          <Card.Body>
            <Col xs={12} className='ps-2 pt-2 d-flex align-items-center justify-content-start'>
              <BitcoinWalletSVG svgClassName='me-4' className='fill-contrast' />
              <div>
                <div className='fs-6 fw-bold'>Bitcoin Wallet</div>
                { rootCtx.authStatus.isAuthenticated && clnCtx.walletBalances.isLoading ? 
                    <Spinner animation='grow' variant='secondary' data-testid="btc-wallet-spinner"/> : 
                  clnCtx.walletBalances.error ? 
                    <Alert className='py-0 px-1 fs-7' variant='danger' data-testid="btc-wallet-error">{clnCtx.walletBalances.error}</Alert> : 
                    <CurrencyBox value={clnCtx.walletBalances.btcSpendableBalance} shorten={false} rootClasses='d-inline-flex flex-column' currencyClasses='lh-1 fs-4 fw-bold' unitClasses='fs-7 fw-bold'></CurrencyBox>
                }
                </div>
            </Col>
          </Card.Body>
          <ButtonGroup className='sticky-bottom btn-group-action'>
            <button className='btn-actions btn-primary' onClick={() => props.onActionClick('withdraw')}>
              <WithdrawSVG className='me-2' />
              Withdraw
            </button>
            <button className='btn-actions btn-primary' onClick={() => props.onActionClick('deposit')}>
              <DepositSVG className='me-2' />
              Deposit
            </button>
          </ButtonGroup>
        </Card>
        <Card.Body className='px-4 list-scroll-container'>
          <div className='text-light btc-transactions-tabs'>Transactions</div>
          <PerfectScrollbar>
            <BTCTransactionsList />
          </PerfectScrollbar>
        </Card.Body>
      </Card.Body>
    </Card>
  );
};

export default BTCWallet;
