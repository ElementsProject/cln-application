import { screen, within, act } from '@testing-library/react';
import CLNWallet from './CLNWallet';
import { renderWithProviders } from '../../../utilities/test-utilities/mockStore';
import { APP_ANIMATION_DURATION, Units } from '../../../utilities/constants';
import { mockAppConfig, mockAppStore, mockBKPRStoreData, mockCLNStoreData, mockRootStoreData, mockUIConfig } from '../../../utilities/test-utilities/mockData';

describe('CLNWallet component ', () => {
  it('should be in the document', async () => {
    await renderWithProviders(<CLNWallet />, { preloadedState: mockAppStore, initialRoute: ['/cln'] });
    expect(screen.getByTestId('cln-wallet')).toBeInTheDocument();
    expect(screen.queryByTestId('cln-wallet-spinner')).not.toBeInTheDocument();
    expect(screen.queryByTestId('cln-wallet-error')).not.toBeInTheDocument();
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
    await renderWithProviders(<CLNWallet />, { preloadedState: customMockStore, initialRoute: ['/cln'] });
    expect(screen.getByTestId('cln-wallet-spinner')).toBeInTheDocument();
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
    await renderWithProviders(<CLNWallet />, { preloadedState: customMockStore, initialRoute: ['/cln'] });
    expect(screen.getByTestId("cln-wallet-error")).toBeInTheDocument();
  })

  it('if has lightning spendable balance, show it', async () => {
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
    await renderWithProviders(<CLNWallet />, { preloadedState: customMockStore, initialRoute: ['/cln'] });
    await act(async () => jest.advanceTimersByTime(APP_ANIMATION_DURATION * 1000));
    const clnWalletCard = screen.getByTestId('cln-wallet-balance-card');
    const currencyBox = await within(clnWalletCard).getByTestId('currency-box-finished-text');
    expect(currencyBox).toBeInTheDocument();
    expect(currencyBox).toHaveTextContent('0.74889');
  });
});
