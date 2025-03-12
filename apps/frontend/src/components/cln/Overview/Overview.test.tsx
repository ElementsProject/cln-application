import { act, screen } from '@testing-library/react';
import Overview from './Overview';
import { getMockCLNStoreData, getMockRootStoreData, renderWithMockCLNContext } from '../../../utilities/test-utilities';
import { APP_ANIMATION_DURATION } from '../../../utilities/constants';
import { useLocation, useNavigate } from 'react-router-dom';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: jest.fn(),
  useNavigate: jest.fn(),
}));

describe('Overview component ', () => {
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
    jest.useFakeTimers();
  });

  it('if walletBalances loading, show spinners', () => {
    providerCLNProps.walletBalances.isLoading = true;
    renderWithMockCLNContext(providerRootProps, providerCLNProps, <Overview />);
    expect(screen.getByTestId('overview-total-spinner'));
    expect(screen.getByTestId('overview-cln-local-balances-spinner'));
    expect(screen.getByTestId('overview-cln-remote-balances-spinner'));
  });

  it('if listPeers is loading, show spinner', () => {
    providerCLNProps.listPeers.isLoading = true;
    renderWithMockCLNContext(providerRootProps, providerCLNProps, <Overview />);
    expect(screen.getByTestId('overview-peers-spinner'));
  })

  it('if channels are loading, show spinner', () => {
    providerCLNProps.listChannels.isLoading = true;
    renderWithMockCLNContext(providerRootProps, providerCLNProps, <Overview />);
    expect(screen.getByTestId('overview-active-channels-spinner'));
  })

  it('if walletBalances error, show error', () => {
    providerCLNProps.walletBalances.error = "error message!";
    renderWithMockCLNContext(providerRootProps, providerCLNProps, <Overview />);
    expect(screen.getByTestId('overview-total-error')).toBeInTheDocument();
    expect(screen.getByTestId('overview-cln-local-balances-error')).toBeInTheDocument();
    expect(screen.getByTestId('overview-cln-remote-balances-error')).toBeInTheDocument();
  })

  it('if channels error, show error', () => {
    providerCLNProps.listChannels.error = "error message!";
    renderWithMockCLNContext(providerRootProps, providerCLNProps, <Overview />);
    expect(screen.getByTestId('overview-active-channels-error')).toBeInTheDocument();
  })

  it('if listPeers error, show error', () => {
    providerCLNProps.listPeers.error = "error message!";
    renderWithMockCLNContext(providerRootProps, providerCLNProps, <Overview />);
    expect(screen.getByTestId('overview-peers-error')).toBeInTheDocument();
  })

  it('combine btcSpendableBalance and clnLocalBalance', async () => {
    renderWithMockCLNContext(providerRootProps, providerCLNProps, <Overview />);
    await act(async () => jest.advanceTimersByTime(APP_ANIMATION_DURATION * 1000));
    const currencyBox = await screen.findAllByTestId('currency-box-finished-text');
    expect(currencyBox[0]).toBeInTheDocument();
    expect(currencyBox[0]).toHaveTextContent('75,257,668');
  });

  it('check clnLocalBalance is proper balance when shortened', async () => {
    renderWithMockCLNContext(providerRootProps, providerCLNProps, <Overview />);
    await act(async () => jest.advanceTimersByTime(APP_ANIMATION_DURATION * 1000));
    const currencyBox = await screen.findAllByTestId('currency-box-finished-text');
    expect(currencyBox[1]).toBeInTheDocument();
    expect(currencyBox[1]).toHaveTextContent('1,158K');
  });

  it('check clnRemoteBalance is proper balance when not shortened', async () => {
    providerCLNProps.walletBalances.clnRemoteBalance = 60342000;
    renderWithMockCLNContext(providerRootProps, providerCLNProps, <Overview />);
    await act(async () => jest.advanceTimersByTime(APP_ANIMATION_DURATION * 1000));
    const currencyBox = await screen.findAllByTestId('currency-box-finished-text');
    expect(currencyBox[2]).toBeInTheDocument();
    expect(currencyBox[2]).toHaveTextContent('60,342K');
  });

});
