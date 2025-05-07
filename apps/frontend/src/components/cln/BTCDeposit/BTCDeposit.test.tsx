import { fireEvent, screen, waitFor } from '@testing-library/react';
import { mockAppStore, mockNewAddr } from '../../../utilities/test-utilities/mockData';
import { spyOnBTCDeposit } from '../../../utilities/test-utilities/mockService';
import { renderWithProviders } from '../../../utilities/test-utilities/mockStore';
import BTCDeposit from './BTCDeposit';

describe('BTCDeposit component ', () => {
  it('should show deposit card when clicking deposit action from BTC card', async () => {
    spyOnBTCDeposit();
    await renderWithProviders(<BTCDeposit />, { preloadedState: mockAppStore, initialRoute: ['/cln'] });

    // Initial state
    expect(screen.getByTestId('btc-wallet-balance-card')).toBeInTheDocument();

    // Click the deposit button
    const depositButton = screen.getByTestId('deposit-button');
    fireEvent.click(depositButton);
    await waitFor(() => {
      expect(screen.getByTestId('btc-deposit')).toBeInTheDocument();
      expect(screen.getByTestId('qr-code-component')).toBeInTheDocument();
      expect(screen.getByTestId('qrcode-copy').getAttribute('placeholder')).toBe(mockNewAddr.bech32);
    });
  });
});
