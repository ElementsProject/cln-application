import { fireEvent, screen, waitFor } from '@testing-library/react';
import { mockAppStore } from '../../../utilities/test-utilities/mockData';
import { renderWithProviders } from '../../../utilities/test-utilities/mockStore';
import ChannelDetails from './ChannelDetails';

describe('ChannelDetails component', () => {
  it('should be in the document', async () => {
    await renderWithProviders(<ChannelDetails />, { preloadedState: mockAppStore, initialRoute: ['/cln'] });

    // Channels list rendered
    expect(screen.getByTestId('channels')).toBeInTheDocument();
    expect(screen.queryByTestId('channel-details')).not.toBeInTheDocument();

    // Click an first channel
    const channelItems = screen.getAllByTestId('list-item-channel');
    fireEvent.click(channelItems[0]);

    await waitFor(() => {
      expect(screen.getByTestId('channel-details')).toBeInTheDocument();
      expect(screen.queryByTestId('channels')).not.toBeInTheDocument();
    });
  });
});
