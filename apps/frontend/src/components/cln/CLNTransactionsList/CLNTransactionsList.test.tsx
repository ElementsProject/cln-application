import { screen, within } from '@testing-library/react';
import { mockAppStore, mockBKPRStoreData, mockCLNStoreData, mockListChannels, mockRootStoreData, mockSelectedChannel } from '../../../utilities/test-utilities/mockData';
import { renderWithProviders } from '../../../utilities/test-utilities/mockStore';
import CLNTransactionsList from './CLNTransactionsList';

describe('CLNTransactionsList component ', () => {
  it('if it is loading show the spinner', async () => {
    const customMockStore = {
      root: mockRootStoreData,
      cln: {
        ...mockCLNStoreData,
        listLightningTransactions: {
          isLoading: true,
          page: 1,
          hasMore: true,
          clnTransactions: []
        }
      },
      bkpr: mockBKPRStoreData
    };
    await renderWithProviders(<CLNTransactionsList />, { preloadedState: customMockStore, initialRoute: ['/cln'] });
    expect(screen.getByTestId('cln-transactions-list-spinner')).toBeInTheDocument();
  });

  it('if it is not loading dont show the spinner', async () => {
    await renderWithProviders(<CLNTransactionsList />, { preloadedState: mockAppStore, initialRoute: ['/cln'] });
    expect(screen.queryByTestId('cln-transactions-list-spinner')).not.toBeInTheDocument();
  });

  it('if it has an error, show the error view', async () => {
    const customMockStore = {
      root: mockRootStoreData,
      cln: {
        ...mockCLNStoreData,
        listLightningTransactions: {
          isLoading: false,
          page: 1,
          hasMore: true,
          clnTransactions: [],
          error: 'error message'
        }
      },
      bkpr: mockBKPRStoreData
    };
    await renderWithProviders(<CLNTransactionsList />, { preloadedState: customMockStore, initialRoute: ['/cln'] });
    expect(screen.getByTestId('cln-transactions-list-error')).toBeInTheDocument();
  });

  it('if it has transactions, show the offers list', async () => {
    await renderWithProviders(<CLNTransactionsList />, { preloadedState: mockAppStore, initialRoute: ['/cln'] });
    const transactionsList = screen.getByTestId('cln-transactions-list');
    const transactionHeaders = within(transactionsList).getAllByTestId('cln-transaction-header');
    expect(transactionsList).toBeInTheDocument();
    expect(transactionHeaders.length).toBe(1);
  });

  it('if there are no channels, show the text encouraging opening a channel', async () => {
    const customMockStore = {
      root: {
        ...mockRootStoreData,
        listChannels: {
          ...mockListChannels,
          activeChannels: []
        }
      },
      cln: {
        ...mockCLNStoreData,
        listLightningTransactions: {
          isLoading: false,
          page: 1,
          hasMore: true,
          clnTransactions: []
        }
      },
      bkpr: mockBKPRStoreData
    };
    await renderWithProviders(<CLNTransactionsList />, { preloadedState: customMockStore, initialRoute: ['/cln'] });
    expect(screen.getByText('No channel found. Open channel to start!')).toBeInTheDocument();
  });

  it('if there are are active channels, show the text saying to use a channel', async () => {
    const customMockStore = {
      root: {
        ...mockRootStoreData,
        listChannels: {
          ...mockListChannels,
          activeChannels: [mockSelectedChannel]
        }
      },
      cln: {
        ...mockCLNStoreData,
        listLightningTransactions: {
          isLoading: false,
          page: 1,
          hasMore: true,
          clnTransactions: []
        }
      },
      bkpr: mockBKPRStoreData
    };
    await renderWithProviders(<CLNTransactionsList />, { preloadedState: customMockStore, initialRoute: ['/cln'] });
    expect(screen.getByText('No transaction found. Click send/receive to start!')).toBeInTheDocument();
  })

});
