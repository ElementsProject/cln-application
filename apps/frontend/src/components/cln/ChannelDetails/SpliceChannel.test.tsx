import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import SpliceChannel from './SpliceChannel';
import { HttpService } from '../../../services/http.service';
jest.mock('../../../services/http.service', () => ({ HttpService: { clnCall: jest.fn() } }));
const call = HttpService.clnCall as jest.Mock;
const channel = {
  channel_id: 'ab'.repeat(32),
  peer_id: '02' + 'cd'.repeat(32),
  funding_txid: 'ef'.repeat(32),
  state: 'CHANNELD_NORMAL',
  peer_connected: true,
};
beforeEach(() => {
  localStorage.clear();
  call.mockReset();
});
function review() {
  fireEvent.change(screen.getByLabelText('Amount in sats'), { target: { value: '1000000' } });
  fireEvent.click(screen.getByRole('button', { name: 'Review splice' }));
}
test('review does not mutate; confirmation submits once and survives remount', async () => {
  let finish: (value: any) => void = () => {};
  call.mockImplementation(
    () =>
      new Promise(resolve => {
        finish = resolve;
      }),
  );
  const view = render(<SpliceChannel channel={channel} />);
  review();
  expect(call).not.toHaveBeenCalled();
  const confirm = screen.getByRole('button', { name: 'Confirm splice' });
  fireEvent.click(confirm);
  fireEvent.click(confirm);
  expect(call).toHaveBeenCalledTimes(1);
  expect(call).toHaveBeenCalledWith('splicein', { channel: channel.channel_id, amount: '1000000' });
  finish({ txid: '12'.repeat(32) });
  await screen.findByText(/Broadcast; waiting for confirmations/);
  view.unmount();
  render(<SpliceChannel channel={channel} />);
  expect(screen.queryByRole('button', { name: 'Review splice' })).not.toBeInTheDocument();
  expect(call).toHaveBeenCalledTimes(1);
});
test('lost reply is retained and never automatically retried', async () => {
  call.mockRejectedValue(new Error('connection lost'));
  const view = render(<SpliceChannel channel={channel} />);
  review();
  fireEvent.click(screen.getByRole('button', { name: 'Confirm splice' }));
  await screen.findByText(/Error: connection lost/);
  view.unmount();
  render(<SpliceChannel channel={channel} />);
  expect(screen.getByText(/Error: connection lost/)).toBeInTheDocument();
  expect(screen.queryByRole('button', { name: 'Review splice' })).not.toBeInTheDocument();
  expect(call).toHaveBeenCalledTimes(1);
});
test('unreadable recovery record blocks a new submission without crashing', () => {
  localStorage.setItem('splice:' + channel.channel_id, '{broken');
  render(<SpliceChannel channel={channel} />);
  expect(screen.getByText(/saved splice record cannot be read/)).toBeInTheDocument();
  expect(call).not.toHaveBeenCalled();
});
test('storage failure prevents submission and reports it', async () => {
  render(<SpliceChannel channel={channel} />);
  review();
  const spy = jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
    throw Error('quota');
  });
  fireEvent.click(screen.getByRole('button', { name: 'Confirm splice' }));
  expect(screen.getByText(/No splice was submitted/)).toBeInTheDocument();
  expect(call).not.toHaveBeenCalled();
  spy.mockRestore();
});
test('disconnected channels and gRPC transport cannot submit', () => {
  const view = render(<SpliceChannel channel={{ ...channel, peer_connected: false }} />);
  fireEvent.change(screen.getByLabelText('Amount in sats'), { target: { value: '1' } });
  expect(screen.getByRole('button', { name: 'Review splice' })).toBeDisabled();
  view.rerender(<SpliceChannel channel={{ ...channel, splice_supported: false }} />);
  expect(
    screen.getByText(/unavailable through this application’s gRPC schema/),
  ).toBeInTheDocument();
  expect(call).not.toHaveBeenCalled();
});
