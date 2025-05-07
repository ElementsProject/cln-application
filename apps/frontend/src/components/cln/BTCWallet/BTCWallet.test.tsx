import { screen, within } from '@testing-library/react';
import { act } from 'react';
import { APP_ANIMATION_DURATION, Units } from '../../../utilities/constants';
import { mockAppConfig, mockAppStore, mockBKPRStoreData, mockCLNStoreData, mockRootStoreData, mockUIConfig } from '../../../utilities/test-utilities/mockData';
import { renderWithProviders } from '../../../utilities/test-utilities/mockStore';
import BTCWallet from './BTCWallet';

describe('BTCWallet component ', () => {
  it('should be in the document', async () => {
    await renderWithProviders(<BTCWallet />, { preloadedState: mockAppStore, initialRoute: ['/cln'] });
    expect(screen.getByTestId('btc-wallet')).toBeInTheDocument();
    expect(screen.queryByTestId('btc-wallet-spinner')).not.toBeInTheDocument();
    expect(screen.queryByTestId('btc-wallet-error')).not.toBeInTheDocument();
  });

  it('when loading wallet balance it shows spinner', async () => {
    const customMockStore = {
      root: {
        ...mockRootStoreData,
        walletBalances: {
          isLoading: true
        }
      },
      cln: mockCLNStoreData,
      bkpr: mockBKPRStoreData
    };
    await renderWithProviders(<BTCWallet />, { preloadedState: customMockStore, initialRoute: ['/cln'] });
    expect(screen.getByTestId('btc-wallet-spinner')).toBeInTheDocument();
  });

  it('if error occurs, show error', async () => {
    const customMockStore = {
      root: {
        ...mockRootStoreData,
        walletBalances: {
          isLoading: false,
          error: 'error message!'
        }
      },
      cln: mockCLNStoreData,
      bkpr: mockBKPRStoreData
    };
    await renderWithProviders(<BTCWallet />, { preloadedState: customMockStore, initialRoute: ['/cln'] });
    expect(screen.getByTestId("btc-wallet-error")).toBeInTheDocument();
  })

  it('if has btc spendable balance, show it', async () => {
    jest.useFakeTimers();
    const customMockStore = {
      root: {
        ...mockRootStoreData,
        appConfig: {
          ...mockAppConfig,
          uiConfig: {
            ...mockUIConfig,
            unit: Units.BTC
          }
        }
      },
      cln: mockCLNStoreData,
      bkpr: mockBKPRStoreData
    };
    await renderWithProviders(<BTCWallet />, { preloadedState: customMockStore, initialRoute: ['/cln'] });
    await act(async () => jest.advanceTimersByTime(APP_ANIMATION_DURATION * 1000));
    const btcWalletCard = screen.getByTestId('btc-wallet-balance-card');
    const currencyBox = await within(btcWalletCard).getByTestId('currency-box-finished-text');
    expect(currencyBox).toBeInTheDocument();
    expect(currencyBox).toHaveTextContent('0.74100');
  });
});
