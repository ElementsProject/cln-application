import { screen, within } from '@testing-library/react';
import { act } from 'react';
import { APP_ANIMATION_DURATION, COUNTUP_DURATION, Units } from '../../../utilities/constants';
import { formatCurrency } from '../../../utilities/data-formatters';
import { mockAppStore, mockBKPRStoreData, mockCLNStoreData, mockListChannels, mockRootStoreData, mockWalletBalances } from '../../../utilities/test-utilities/mockData';
import { renderWithProviders } from '../../../utilities/test-utilities/mockStore';
import Overview from './Overview';

describe('Overview component ', () => {
  afterAll(() => {
    jest.useRealTimers();
  });

  it('if walletBalances loading, show spinners', async () => {
    const customMockStore = {
      root: {
        ...mockRootStoreData,
        walletBalances: {
          ...mockWalletBalances,
          isLoading: true
        }
      },
      cln: mockCLNStoreData,
      bkpr: mockBKPRStoreData
    };
    await renderWithProviders(<Overview />, { preloadedState: customMockStore, initialRoute: ['/cln'] });
    expect(screen.getByTestId('overview-total-spinner'));
    expect(screen.getByTestId('overview-cln-local-balances-spinner'));
    expect(screen.getByTestId('overview-cln-remote-balances-spinner'));
  });

  it('if number of peers and channels are loading, show spinner', async () => {
    const customMockStore = {
      root: {
        ...mockRootStoreData,
        listChannels: {
          ...mockListChannels,
          isLoading: true
        }
      },
      cln: mockCLNStoreData,
      bkpr: mockBKPRStoreData
    };
    await renderWithProviders(<Overview />, { preloadedState: customMockStore, initialRoute: ['/cln'] });
    expect(screen.getByTestId('overview-peers-spinner'));
    expect(screen.getByTestId('overview-active-channels-spinner'));
  });

  it('if walletBalances error, show error', async () => {
    const customMockStore = {
      root: {
        ...mockRootStoreData,
        walletBalances: {
          ...mockWalletBalances,
          error: 'error message'
        }
      },
      cln: mockCLNStoreData,
      bkpr: mockBKPRStoreData
    };    
    await renderWithProviders(<Overview />, { preloadedState: customMockStore, initialRoute: ['/cln'] });
    expect(screen.getByTestId('overview-total-error')).toBeInTheDocument();
    expect(screen.getByTestId('overview-cln-local-balances-error')).toBeInTheDocument();
    expect(screen.getByTestId('overview-cln-remote-balances-error')).toBeInTheDocument();
  });

  it('if peers and channels error, show error', async () => {
    const customMockStore = {
      root: {
        ...mockRootStoreData,
        listChannels: {
          ...mockListChannels,
          error: 'error message'
        }
      },
      cln: mockCLNStoreData,
      bkpr: mockBKPRStoreData
    };
    await renderWithProviders(<Overview />, { preloadedState: customMockStore, initialRoute: ['/cln'] });
    expect(screen.getByTestId('overview-peers-error')).toBeInTheDocument();
    expect(screen.getByTestId('overview-active-channels-error')).toBeInTheDocument();
  });

  it('combine btcSpendableBalance and clnLocalBalance', async () => {
    jest.useFakeTimers();
    await renderWithProviders(<Overview />, { preloadedState: mockAppStore, initialRoute: ['/cln'] });
    await act(async () => {
      jest.advanceTimersByTime(COUNTUP_DURATION * 1000);
    });
    await act(async () => {
      jest.advanceTimersByTime(APP_ANIMATION_DURATION * 1000);
    });
    const currencyBox = await screen.findAllByTestId('currency-box-finished-text');
    expect(currencyBox[0]).toBeInTheDocument();
    expect(currencyBox[0]).toHaveTextContent('148,988,500');
  });

  it('check clnLocalBalance is proper balance when shortened', async () => {
    jest.useFakeTimers();
    await renderWithProviders(<Overview />, { preloadedState: mockAppStore, initialRoute: ['/cln'] });
    await act(async () => {
      jest.advanceTimersByTime(COUNTUP_DURATION * 1000);
    });
    await act(async () => {
      jest.advanceTimersByTime(APP_ANIMATION_DURATION * 1000);
    });
    const currencyBox = await screen.findAllByTestId('currency-box-finished-text');
    expect(currencyBox[1]).toBeInTheDocument();
    expect(currencyBox[1]).toHaveTextContent('74,888K');
  });

  it('check clnRemoteBalance is proper balance when not shortened', async () => {
    jest.useFakeTimers();
    await renderWithProviders(<Overview />, { preloadedState: mockAppStore, initialRoute: ['/cln'] });
    await act(async () => {
      jest.advanceTimersByTime(COUNTUP_DURATION * 1000);
    });
    await act(async () => {
      jest.advanceTimersByTime(APP_ANIMATION_DURATION * 1000);
    });
    const maxReceiveAmount = await screen.getByTestId('max-receive-amount');
    const currencyBox = await within(maxReceiveAmount).getByTestId('currency-box-finished-text');
    expect(currencyBox).toBeInTheDocument();
    const formattedCurrencyValue = formatCurrency(mockAppStore.root.walletBalances.clnRemoteBalance, Units.SATS, Units.SATS, true, 5, 'string');
    expect(currencyBox).toHaveTextContent(formattedCurrencyValue.toString());
  });
});
