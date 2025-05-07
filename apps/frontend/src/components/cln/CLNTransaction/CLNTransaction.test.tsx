import { fireEvent, screen, waitFor } from '@testing-library/react';
import { mockAppStore } from '../../../utilities/test-utilities/mockData';
import { renderWithProviders } from '../../../utilities/test-utilities/mockStore';
import CLNTransaction from './CLNTransaction';

describe('CLNTransaction component ', () => {
  it('should be in the document', async () => {
    await renderWithProviders(<CLNTransaction />, { preloadedState: mockAppStore, initialRoute: ['/cln'] });

    // Initial state
    expect(screen.getByTestId('cln-transactions-list')).toBeInTheDocument();

    // Click to expand
    const expandDiv = screen.getByTestId('cln-transaction-header');
    fireEvent.click(expandDiv);
    await waitFor(() => {
      expect(screen.getByTestId('invoice-header')).toBeInTheDocument();
      expect(screen.queryByTestId('preimage')).not.toBeInTheDocument();
      expect(screen.queryByTestId('valid-till')).not.toBeInTheDocument();
    });
  });
});
