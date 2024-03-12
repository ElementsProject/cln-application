import { act, screen } from '@testing-library/react';
import Overview from './Overview';
import { mockStoreData, renderWithMockContext } from '../../../utilities/test-utilities';
import { APP_ANIMATION_DURATION } from '../../../utilities/constants';

describe('Overview component ', () => {
  let providerProps;

  beforeEach(() => {
    providerProps = JSON.parse(JSON.stringify(mockStoreData));
    jest.useFakeTimers();
  });

  it('if walletBalances loading, show spinners', () => {
    providerProps.walletBalances.isLoading = true;
    renderWithMockContext(<Overview />, { providerProps });
    expect(screen.getByTestId('overview-total-spinner'));
    expect(screen.getByTestId('overview-cln-local-balances-spinner'));
    expect(screen.getByTestId('overview-cln-remote-balances-spinner'));
  });

  it('if listPeers is loading, show spinner', () => {
    providerProps.listPeers.isLoading = true;
    renderWithMockContext(<Overview />, { providerProps });
    expect(screen.getByTestId('overview-peers-spinner'));
  })

  it('if channels are loading, show spinner', () => {
    providerProps.listChannels.isLoading = true;
    renderWithMockContext(<Overview />, { providerProps });
    expect(screen.getByTestId('overview-active-channels-spinner'));
  })

  it('if walletBalances error, show error', () => {
    providerProps.walletBalances.error = "error message!";
    renderWithMockContext(<Overview />, { providerProps });
    expect(screen.getByTestId('overview-total-error')).toBeInTheDocument();
    expect(screen.getByTestId('overview-cln-local-balances-error')).toBeInTheDocument();
    expect(screen.getByTestId('overview-cln-remote-balances-error')).toBeInTheDocument();
  })

  it('if listChannels error, show error', () => {
    providerProps.listChannels.error = "error message!";
    renderWithMockContext(<Overview />, { providerProps });
    expect(screen.getByTestId('overview-active-channels-error')).toBeInTheDocument();
  })

  it('if listPeers error, show error', () => {
    providerProps.listPeers.error = "error message!";
    renderWithMockContext(<Overview />, { providerProps });
    expect(screen.getByTestId('overview-peers-error')).toBeInTheDocument();
  })

  it('combine btcSpendableBalance and clnLocalBalance', async () => {
    renderWithMockContext(<Overview />, { providerProps });
    await act(async () => jest.advanceTimersByTime(APP_ANIMATION_DURATION * 1000));
    const currencyBox = await screen.findAllByTestId('currency-box-finished-text');
    expect(currencyBox[0]).toBeInTheDocument();
    expect(currencyBox[0]).toHaveTextContent('26,755,554');
  });

  it('check clnLocalBalance is proper balance when shortened', async () => {
    renderWithMockContext(<Overview />, { providerProps });
    await act(async () => jest.advanceTimersByTime(APP_ANIMATION_DURATION * 1000));
    const currencyBox = await screen.findAllByTestId('currency-box-finished-text');
    expect(currencyBox[1]).toBeInTheDocument();
    expect(currencyBox[1]).toHaveTextContent('13,377K');
  });

  it('check clnRemoteBalance is proper balance when not shortened', async () => {
    providerProps.walletBalances.clnRemoteBalance = 98765432;
    renderWithMockContext(<Overview />, { providerProps });
    await act(async () => jest.advanceTimersByTime(APP_ANIMATION_DURATION * 1000));
    const currencyBox = await screen.findAllByTestId('currency-box-finished-text');
    expect(currencyBox[2]).toBeInTheDocument();
    expect(currencyBox[2]).toHaveTextContent('98,765K');
  });

});
