import { act, screen } from '@testing-library/react';
import BTCWallet from './BTCWallet';
import { renderWithMockCLNContext, getMockCLNStoreData, getMockRootStoreData } from '../../../utilities/test-utilities';
import { APP_ANIMATION_DURATION } from '../../../utilities/constants';
import { useLocation, useNavigate } from 'react-router-dom';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: jest.fn(),
  useNavigate: jest.fn(),
}));

describe('BTCWallet component ', () => {
  let providerRootProps;
  let providerCLNProps;

  beforeEach(() => {
    providerRootProps = JSON.parse(JSON.stringify(getMockRootStoreData()));
    providerCLNProps = JSON.parse(JSON.stringify(getMockCLNStoreData()));
    (useLocation as jest.Mock).mockImplementation(() => ({
      pathname: '/cln',
      search: '',
      hash: '',
      state: null,
      key: '5nvxpbdafa',
    }));
    (useNavigate as jest.Mock).mockImplementation(() => jest.fn());
  });

  it('should be in the document', () => {
    providerCLNProps.walletBalances.isLoading = false;
    renderWithMockCLNContext(providerRootProps, providerCLNProps, <BTCWallet />);
    expect(screen.getByTestId('btc-wallet')).toBeInTheDocument();
    expect(screen.queryByTestId('btc-wallet-spinner')).not.toBeInTheDocument();
    expect(screen.queryByTestId("btc-wallet-error")).not.toBeInTheDocument();
  });

  it('when loading wallet balance it shows spinner', () => {
    providerCLNProps.walletBalances.isLoading = true;
    renderWithMockCLNContext(providerRootProps, providerCLNProps, <BTCWallet />);
    expect(screen.getByTestId('btc-wallet-spinner')).toBeInTheDocument();
  })

  it('if error occurs, show error', () => {
    providerCLNProps.walletBalances.error = "error message!";
    renderWithMockCLNContext(providerRootProps, providerCLNProps, <BTCWallet />);
    expect(screen.getByTestId("btc-wallet-error")).toBeInTheDocument();
  })

  it('if has btc spendable balance, show it', async () => {
    providerRootProps.appConfig.uiConfig.unit = 'BTC';
    jest.useFakeTimers();
    renderWithMockCLNContext(providerRootProps, providerCLNProps, <BTCWallet />);
    await act(async () => jest.advanceTimersByTime(APP_ANIMATION_DURATION * 1000));
    const currencyBox = await screen.findByTestId('currency-box-finished-text');
    expect(currencyBox).toBeInTheDocument();
    expect(currencyBox).toHaveTextContent('0.74100');
  })

});
