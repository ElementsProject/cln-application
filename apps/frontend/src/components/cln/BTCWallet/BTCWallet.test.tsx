import { act, screen } from '@testing-library/react';
import BTCWallet from './BTCWallet';
import { renderWithMockContext, getMockStoreData } from '../../../utilities/test-utilities';
import { APP_ANIMATION_DURATION } from '../../../utilities/constants';

describe('BTCWallet component ', () => {
  let providerProps;
  beforeEach(() => providerProps = JSON.parse(JSON.stringify(getMockStoreData())));

  it('should be in the document', () => {
    providerProps.walletBalances.isLoading = false;
    renderWithMockContext(<BTCWallet />, { providerProps });
    expect(screen.getByTestId('btc-wallet')).toBeInTheDocument();
    expect(screen.queryByTestId('btc-wallet-spinner')).not.toBeInTheDocument();
    expect(screen.queryByTestId("btc-wallet-error")).not.toBeInTheDocument();
  });

  it('when loading wallet balance it shows spinner', () => {
    providerProps.walletBalances.isLoading = true;
    renderWithMockContext(<BTCWallet />, { providerProps });
    expect(screen.getByTestId('btc-wallet-spinner')).toBeInTheDocument();
  })

  it('if error occurs, show error', () => {
    providerProps.walletBalances.error = "error message!";
    renderWithMockContext(<BTCWallet />, { providerProps });
    expect(screen.getByTestId("btc-wallet-error")).toBeInTheDocument();
  })

  it('if has btc spendable balance, show it', async () => {
    providerProps.appConfig.unit = 'BTC';
    jest.useFakeTimers();
    renderWithMockContext(<BTCWallet />, { providerProps });
    await act(async () => jest.advanceTimersByTime(APP_ANIMATION_DURATION * 1000));
    const currencyBox = await screen.findByTestId('currency-box-finished-text');
    expect(currencyBox).toBeInTheDocument();
    expect(currencyBox).toHaveTextContent('0.13378');
  })

});
