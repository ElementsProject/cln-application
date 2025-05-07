import { fireEvent, screen, waitFor } from '@testing-library/react';
import { act } from 'react';
import { APP_ANIMATION_DURATION } from '../../../utilities/constants';
import { mockAppStore } from '../../../utilities/test-utilities/mockData';
import { renderWithProviders } from '../../../utilities/test-utilities/mockStore';
import CLNReceive from './CLNReceive';

describe('CLNReceive component ', () => {
  it('should show receive card when clicking receive action from wallet', async () => {
    await renderWithProviders(<CLNReceive />, { preloadedState: mockAppStore, initialRoute: ['/cln'] });
    await act(async () => jest.advanceTimersByTime(APP_ANIMATION_DURATION * 1000));
    
    // Initial state
    expect(screen.getByTestId('cln-wallet-balance-card')).toBeInTheDocument();

    // Click the receive button
    const receiveButton = screen.getByTestId('receive-button');
    fireEvent.click(receiveButton);
    await waitFor(() => {
      expect(screen.getByTestId('cln-receive')).toBeInTheDocument();
      expect(screen.getByTestId('button-generate')).toBeInTheDocument();
    });
  });
});
