import { render, screen } from '@testing-library/react';
import BTCTransaction from './BTCTransaction';

describe('BTCTransaction component ', () => {
  beforeEach(
    () => render(<BTCTransaction transaction={
      {
        account: 'mockAccount1',
        type: 'onchain_fee',
        credit_msat: '1000',
        debit_msat: '2000',
        currency: 'BTC',
        timestamp: 1624000000,
        tag: 'mockTag',
        txid: 'mockTxId',
        blockheight: 123456,
        outpoint: 'mockOutpoint',
        origin: 'mockOrigin',
        payment_id: 'mockPaymentId',
        description: 'mockDescription',
        fees_msat: '3000',
        is_rebalance: false,
        part_id: 123
      }} />)
  );

  it('should be in the document', () => {
    expect(screen.getByTestId('transaction')).toBeInTheDocument();
  });
});
