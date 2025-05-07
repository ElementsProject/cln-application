import { fireEvent, screen, waitFor } from '@testing-library/react';
import { mockAppStore } from '../../../utilities/test-utilities/mockData';
import { renderWithProviders } from '../../../utilities/test-utilities/mockStore';
import ChannelOpen from './ChannelOpen';

describe('ChannelOpen component ', () => {
  it('should be in the document', async () => {
    await renderWithProviders(<ChannelOpen />, { preloadedState: mockAppStore, initialRoute: ['/cln'] });

    // Channels list rendered
    expect(screen.getByTestId('channels')).toBeInTheDocument();
    expect(screen.queryByTestId('channel-open-card')).not.toBeInTheDocument();

    // Click open channel
    const openChannelBtn = screen.getByTestId('button-open-channel');
    await fireEvent.click(openChannelBtn);
    await waitFor(() => {
      expect(screen.getByTestId('channel-open-card')).toBeInTheDocument();
    });
  });
});
