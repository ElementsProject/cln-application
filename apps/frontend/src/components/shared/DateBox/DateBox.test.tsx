import { fireEvent, render, screen } from '@testing-library/react';
import DateBox from './DateBox';
import { Invoice } from '../../../types/lightning-wallet.type';

const invoice: Invoice = {
  bolt11: 'lntb1p0j7ktppp5tulqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqdqrzjqwp5huanxycteeap7tuwenjkrajn8f4sa8m60pt4xp2cjmn8cn5s7zatmdgqz0p6atwvs5q00s3ucwechkntdjqx56m2v0csf30jn2k2grxkz4d9qyjhz2d0s3zfp9e69enq6045ga3x4etn2efmy2a5ajph973g679ujm55sl2zsjjmtqga3tvp',
  bolt12: 'lno1pqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqppqtyvc6csghpsu7zqutj7qcnva5up4uzl0pg2eq9tc4z9n8y92q3zv96gcmv4ezqcefvp4jk03mf85ypek7a4pagy6hqjsg467k049gx5czysxgm4hzcpjy7jls',
  description: 'A mock invoice',
  expires_at: 1709513229918,
  label: 'LABEL123',
  msatoshi: 50000,
  msatoshi_received: 50000,
  amount_msat: 50000,
  amount_received_msat: 50000,
  local_offer_id: 'local_offer_id_123',
  invreq_payer_note: 'invreq_payer_note',
  paid_at: 1709513229900,
  pay_index: 1,
  payment_hash: '638f4dbbe4e0dfd52ca385e5857c65407e4449fc1250b3b6d8483b6a885f9f5a',
  payment_preimage: '6dcd4ce23d88e2ee95838f7b014b6284a5b63e723ec47ca8c7e4c5d29dd3a2b3',
  status: 'paid'
};

describe('DateBox component ', () => {

  it('format date', () => {
    render(<DateBox dataValue={invoice.expires_at} dataType={'Created At'} showTooltip={false} />);
    const overlayTrigger = screen.getByTestId('overlay-trigger');

    expect(overlayTrigger).toHaveTextContent('26 Apr, 14:05');
  });

});
