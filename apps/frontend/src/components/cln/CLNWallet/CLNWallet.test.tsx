import { act, screen } from '@testing-library/react';
import CLNWallet from './CLNWallet';
import { renderWithMockContext, getMockStoreData } from '../../../utilities/test-utilities';
import { APP_ANIMATION_DURATION } from '../../../utilities/constants';

describe('CLNWallet component ', () => {
  let providerProps;
  beforeEach(() => providerProps = JSON.parse(JSON.stringify(getMockStoreData())));
  
  it('should be in the document', () => {
    providerProps.walletBalances.isLoading = false;
    renderWithMockContext(<CLNWallet />, { providerProps });
    expect(screen.getByTestId('cln-wallet')).toBeInTheDocument();
    expect(screen.queryByTestId('cln-wallet-spinner')).not.toBeInTheDocument();
    expect(screen.queryByTestId("cln-wallet-error")).not.toBeInTheDocument();
  });

  it('when loading wallet balance it shows spinner', () => {
    providerProps.walletBalances.isLoading = true;
    renderWithMockContext(<CLNWallet />, { providerProps });
    expect(screen.getByTestId('cln-wallet-spinner')).toBeInTheDocument();
  })

  it('if error occurs, show error', () => {
    providerProps.walletBalances.error = "error message!";
    renderWithMockContext(<CLNWallet />, { providerProps });
    expect(screen.getByTestId("cln-wallet-error")).toBeInTheDocument();
  })

  it('if has lightning spendable balance, show it', async () => {
    providerProps.appConfig.unit = 'BTC';
    jest.useFakeTimers();
    renderWithMockContext(<CLNWallet />, { providerProps });
    await act(async () => jest.advanceTimersByTime(APP_ANIMATION_DURATION * 1000));
    const currencyBox = await screen.findByTestId('currency-box-finished-text');
    expect(currencyBox).toBeInTheDocument();
    expect(currencyBox).toHaveTextContent('.13378');
  })

});
