import { screen } from '@testing-library/react';
import { mockAppStore } from '../../../utilities/test-utilities/mockData';
import { renderWithProviders } from '../../../utilities/test-utilities/mockStore';
import BTCTransactionsList from './BTCTransactionsList';

describe('BTCTransactionsList component ', () => {
  it('should be in the document', async () => {
    await renderWithProviders(<BTCTransactionsList />, { preloadedState: mockAppStore, initialRoute: ['/cln'] });
    expect(screen.getByTestId('btc-transactions-list')).toBeInTheDocument();
  });
});
