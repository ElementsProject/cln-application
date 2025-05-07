import { fireEvent, screen, waitFor } from '@testing-library/react';
import { mockAppStore } from '../../../utilities/test-utilities/mockData';
import { renderWithProviders } from '../../../utilities/test-utilities/mockStore';
import BTCTransaction from './BTCTransaction';

describe('BTCTransaction component ', () => {
  it('should be in the document', async () => {
    await renderWithProviders(<BTCTransaction />, { preloadedState: mockAppStore, initialRoute: ['/cln'] });

    // Initial state
    expect(screen.getByTestId('btc-transactions-list')).toBeInTheDocument();

    // Click to expand
    const expandDiv = screen.getByTestId('btc-transaction-header');
    fireEvent.click(expandDiv);
    await waitFor(() => {
      expect(screen.getByTestId('withdraw-header')).toBeInTheDocument();
      expect(screen.getByTestId('withdraw-amount')).toBeInTheDocument();
    });
  });
});
