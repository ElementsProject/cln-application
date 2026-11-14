import { fireEvent, screen, render } from '@testing-library/react';
import ChannelLabel from './ChannelLabel';
import { HttpService } from '../../../services/http.service';
jest.mock('../../../services/http.service', () => ({ HttpService: { clnCall: jest.fn() } }));
jest.mock('react-redux', () => ({ useDispatch: () => jest.fn() }));
const call = HttpService.clnCall as jest.Mock;
const channel = { channel_id: 'ab'.repeat(32), channel_label: 'Savings' };
beforeEach(() => call.mockReset());
test('clearing a private label saves an empty label and reports removal', async () => {
  call.mockResolvedValue({ channel_id: channel.channel_id, label: '' });
  render(<ChannelLabel channel={channel} />);
  fireEvent.change(screen.getByLabelText('Channel label'), { target: { value: '' } });
  fireEvent.click(screen.getByRole('button', { name: 'Save label' }));
  await screen.findByText('Channel label removed.');
  expect(call).toHaveBeenCalledWith('setchannellabel', {
    channel_id: channel.channel_id,
    label: '',
  });
});
test('save failure retains editable text and shows the reason', async () => {
  call.mockRejectedValue(new Error('permission denied'));
  render(<ChannelLabel channel={channel} />);
  fireEvent.change(screen.getByLabelText('Channel label'), { target: { value: 'New label' } });
  fireEvent.click(screen.getByRole('button', { name: 'Save label' }));
  await screen.findByText(/Could not save channel label: Error: permission denied/);
  expect(screen.getByLabelText('Channel label')).toHaveValue('New label');
});
