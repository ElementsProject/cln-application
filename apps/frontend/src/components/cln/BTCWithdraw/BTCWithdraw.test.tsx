import { fireEvent, screen, waitFor } from '@testing-library/react';
import { mockAppStore } from '../../../utilities/test-utilities/mockData';
import { renderWithProviders } from '../../../utilities/test-utilities/mockStore';
import BTCWithdraw from './BTCWithdraw';

describe('BTCWithdraw component ', () => {
  it('should show withdraw card when clicking withdraw action from BTC card', async () => {
    await renderWithProviders(<BTCWithdraw />, { preloadedState: mockAppStore, initialRoute: ['/cln'] });

    // Initial state
    expect(screen.getByTestId('btc-wallet-balance-card')).toBeInTheDocument();

    // Click the withdraw button
    const withdrawButton = screen.getByTestId('withdraw-button');
    fireEvent.click(withdrawButton);
    await waitFor(() => {
      expect(screen.getByTestId('btc-withdraw')).toBeInTheDocument();
      expect(screen.getByTestId('button-withdraw')).toBeInTheDocument();
    });
  });
});
