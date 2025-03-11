import { act, fireEvent, screen } from '@testing-library/react';
import ConnectWallet from './ConnectWallet';
import { renderWithMockContext, getMockStoreData } from '../../../utilities/test-utilities';
import { APP_ANIMATION_DURATION } from '../../../utilities/constants';

describe('ConnectWallet component ', () => {
  let providerProps;
  beforeEach(() => {
    providerProps = JSON.parse(JSON.stringify(getMockStoreData('showModals', { connectWalletModal: true })));
    jest.useFakeTimers();
  });

  it('renders with initial state', async () => {
    providerProps.showModals.connectWalletModal = true;
    renderWithMockContext(<ConnectWallet />, { providerProps });
    await act(async () => jest.advanceTimersByTime(APP_ANIMATION_DURATION * 1000));
    expect(screen.getByTestId('connect-wallet')).toBeInTheDocument();
    expect(screen.getByText('LN Message')).toBeInTheDocument();
    expect(screen.getByTestId('port')).toHaveValue('5001');
    expect(screen.getByTestId('host')).toHaveValue('user.local');
    expect(screen.getByTestId('rune')).toHaveValue('mRXhnFyVWrRQChA9eJ01RQT9W502daqrP0JA4BiHHw89MCZGb3IgQXBwbGljYXRpb24j');
    expect(screen.getByTestId('connect-url')).toHaveValue(
      'ln-message://user.local:5001?rune=mRXhnFyVWrRQChA9eJ01RQT9W502daqrP0JA4BiHHw89MCZGb3IgQXBwbGljYXRpb24j&invoiceRune=aHFhnFyVWrRQChA9eJ01RQT9W502daqrP0JA4BiHHw89MCZGb3IgQXBwbGljYXRpb2==',
    );
    expect(screen.getByTestId('invoice-rune')).toHaveValue('aHFhnFyVWrRQChA9eJ01RQT9W502daqrP0JA4BiHHw89MCZGb3IgQXBwbGljYXRpb2==');
    expect(screen.queryByTestId('invoice-rune-spinner')).not.toBeInTheDocument();
  });

  it('hide ConnectWallet modal if AppContext says to hide it', async () => {
    providerProps.showModals.connectWalletModal = false;
    renderWithMockContext(<ConnectWallet />, { providerProps });
    await act(async () => jest.advanceTimersByTime(APP_ANIMATION_DURATION * 1000));
    expect(screen.queryByTestId('connect-wallet')).not.toBeInTheDocument();
  });

  it('updates selected network and input fields on network change to LN Message', async () => {
    providerProps.showModals.connectWalletModal = true;
    renderWithMockContext(<ConnectWallet />, { providerProps });
    await act(async () =>  jest.advanceTimersByTime(APP_ANIMATION_DURATION * 1000));
    await act(async () => fireEvent.click(screen.getByTestId('network-toggle')));
    const restNetworkItem = screen.getAllByTestId('network-item')[0];
    await act(async () => fireEvent.click(restNetworkItem));

    expect(screen.getByTestId('port')).toHaveValue('5001');
    expect(screen.getByTestId('host')).toHaveValue('user.local');
    expect(screen.getByTestId('rune')).toHaveValue('mRXhnFyVWrRQChA9eJ01RQT9W502daqrP0JA4BiHHw89MCZGb3IgQXBwbGljYXRpb24j');
    expect(screen.queryByTestId('client-cert')).not.toBeInTheDocument();
    expect(screen.queryByTestId('ca-cert')).not.toBeInTheDocument();
    expect(screen.getByTestId('connect-url')).toHaveValue(
      'ln-message://user.local:5001?rune=mRXhnFyVWrRQChA9eJ01RQT9W502daqrP0JA4BiHHw89MCZGb3IgQXBwbGljYXRpb24j&invoiceRune=aHFhnFyVWrRQChA9eJ01RQT9W502daqrP0JA4BiHHw89MCZGb3IgQXBwbGljYXRpb2==',
    );
    expect(screen.getByTestId('invoice-rune')).toHaveValue('aHFhnFyVWrRQChA9eJ01RQT9W502daqrP0JA4BiHHw89MCZGb3IgQXBwbGljYXRpb2==');
  });

  it('updates selected network and input fields on network change to LN Message (Tor)', async () => {
    providerProps.showModals.connectWalletModal = true;
    renderWithMockContext(<ConnectWallet />, { providerProps });
    await act(async () =>  jest.advanceTimersByTime(APP_ANIMATION_DURATION * 1000));
    await act(async () => fireEvent.click(screen.getByTestId('network-toggle')));
    const restNetworkItem = screen.getAllByTestId('network-item')[1];
    await act(async () => fireEvent.click(restNetworkItem));

    expect(screen.getByTestId('port')).toHaveValue('5001');
    expect(screen.getByTestId('host')).toHaveValue('oqaer4kd7ufryngx6dsztovs4pnlmaouwmtkofjsd2m7pkq8wd.onion');
    expect(screen.getByTestId('rune')).toHaveValue('mRXhnFyVWrRQChA9eJ01RQT9W502daqrP0JA4BiHHw89MCZGb3IgQXBwbGljYXRpb24j');
    expect(screen.queryByTestId('client-cert')).not.toBeInTheDocument();
    expect(screen.queryByTestId('ca-cert')).not.toBeInTheDocument();
    expect(screen.getByTestId('connect-url')).toHaveValue(
      'ln-message://oqaer4kd7ufryngx6dsztovs4pnlmaouwmtkofjsd2m7pkq8wd.onion:5001?rune=mRXhnFyVWrRQChA9eJ01RQT9W502daqrP0JA4BiHHw89MCZGb3IgQXBwbGljYXRpb24j&invoiceRune=aHFhnFyVWrRQChA9eJ01RQT9W502daqrP0JA4BiHHw89MCZGb3IgQXBwbGljYXRpb2==',
    );
    expect(screen.getByTestId('invoice-rune')).toHaveValue('aHFhnFyVWrRQChA9eJ01RQT9W502daqrP0JA4BiHHw89MCZGb3IgQXBwbGljYXRpb2==');
  });

  it('updates selected network and input fields on network change to REST', async () => {
    providerProps.showModals.connectWalletModal = true;
    renderWithMockContext(<ConnectWallet />, { providerProps });
    await act(async () =>  jest.advanceTimersByTime(APP_ANIMATION_DURATION * 1000));
    await act(async () => fireEvent.click(screen.getByTestId('network-toggle')));
    const restNetworkItem = screen.getAllByTestId('network-item')[2];
    await act(async () => fireEvent.click(restNetworkItem));

    expect(screen.getAllByTestId('port')[1]).toHaveValue('3001');
    expect(screen.getByTestId('host')).toHaveValue('user.local');
    expect(screen.queryByTestId('client-key')).toBeInTheDocument();
    expect(screen.queryByTestId('client-cert')).toBeInTheDocument();
    expect(screen.queryByTestId('ca-cert')).toBeInTheDocument();
    expect(screen.getByTestId('connect-url')).toHaveValue(
      'clnrest://https://user.local:3001?rune=mRXhnFyVWrRQChA9eJ01RQT9W502daqrP0JA4BiHHw89MCZGb3IgQXBwbGljYXRpb24j&clientKey=ClientKey&clientCert=ClientCert&caCert=CACert',
    );
  });

  it('updates selected network and input fields on network change to REST (Tor)', async () => {
    providerProps.showModals.connectWalletModal = true;
    renderWithMockContext(<ConnectWallet />, { providerProps });
    await act(async () =>  jest.advanceTimersByTime(APP_ANIMATION_DURATION * 1000));
    await act(async () => fireEvent.click(screen.getByTestId('network-toggle')));
    const restNetworkItem = screen.getAllByTestId('network-item')[3];
    await act(async () => fireEvent.click(restNetworkItem));

    expect(screen.getAllByTestId('port')[1]).toHaveValue('3001');
    expect(screen.getByTestId('host')).toHaveValue('oqaer4kd7ufryngx6dsztovs4pnlmaouwmtkofjsd2m7pkq8wd.onion');
    expect(screen.queryByTestId('client-key')).toBeInTheDocument();
    expect(screen.queryByTestId('client-cert')).toBeInTheDocument();
    expect(screen.getByTestId('connect-url')).toHaveValue(
      'clnrest://https://oqaer4kd7ufryngx6dsztovs4pnlmaouwmtkofjsd2m7pkq8wd.onion:3001?rune=mRXhnFyVWrRQChA9eJ01RQT9W502daqrP0JA4BiHHw89MCZGb3IgQXBwbGljYXRpb24j&clientKey=ClientKey&clientCert=ClientCert&caCert=CACert',
    );
  });

  it('updates selected network and input fields on network change to gRPC', async () => {
    providerProps.showModals.connectWalletModal = true;
    renderWithMockContext(<ConnectWallet />, { providerProps });
    await act(async () =>  jest.advanceTimersByTime(APP_ANIMATION_DURATION * 1000));
    await act(async () => fireEvent.click(screen.getByTestId('network-toggle')));
    const restNetworkItem = screen.getAllByTestId('network-item')[4];
    await act(async () => fireEvent.click(restNetworkItem));

    expect(screen.getAllByTestId('port')[1]).toHaveValue('2106');
    expect(screen.getByTestId('host')).toHaveValue('user.local');
    expect(screen.queryByTestId('client-key')).not.toBeInTheDocument();
    expect(screen.queryByTestId('client-cert')).not.toBeInTheDocument();
    expect(screen.queryByTestId('ca-cert')).not.toBeInTheDocument();
    expect(screen.getByTestId('connect-url')).toHaveValue('cln-grpc://http://user.local:2106');
  });

  it('updates selected network and input fields on network change to gRPC (Tor)', async () => {
    providerProps.showModals.connectWalletModal = true;
    renderWithMockContext(<ConnectWallet />, { providerProps });
    await act(async () =>  jest.advanceTimersByTime(APP_ANIMATION_DURATION * 1000));
    await act(async () => fireEvent.click(screen.getByTestId('network-toggle')));
    const restNetworkItem = screen.getAllByTestId('network-item')[5];
    await act(async () => fireEvent.click(restNetworkItem));
    expect(screen.getAllByTestId('port')[1]).toHaveValue('2106');
    expect(screen.getByTestId('host')).toHaveValue('oqaer4kd7ufryngx6dsztovs4pnlmaouwmtkofjsd2m7pkq8wd.onion');
    expect(screen.queryByTestId('client-key')).not.toBeInTheDocument();
    expect(screen.queryByTestId('client-cert')).not.toBeInTheDocument();
    expect(screen.queryByTestId('ca-cert')).not.toBeInTheDocument();
    expect(screen.getByTestId('connect-url')).toHaveValue(
      'cln-grpc://http://oqaer4kd7ufryngx6dsztovs4pnlmaouwmtkofjsd2m7pkq8wd.onion:2106',
    );
  });

  it('when creating an invoice rune, display loading spinner', async () => {
    providerProps.showModals.connectWalletModal = true;
    providerProps.setShowToast = jest.fn();
    providerProps.walletConnect.INVOICE_RUNE = '';
    window.prompt = jest.fn();
    renderWithMockContext(<ConnectWallet />, { providerProps });

    await act(async () => jest.advanceTimersByTime(APP_ANIMATION_DURATION * 1000));
    fireEvent.click(screen.getByTestId('invoice-rune-button'));

    expect(screen.queryByTestId('invoice-rune-spinner')).toBeInTheDocument();
  });

  it('when invoice rune loading, buttons are disabled so additional runes are not created', async () => {
    providerProps.showModals.connectWalletModal = true;
    providerProps.setShowToast = jest.fn();
    providerProps.walletConnect.INVOICE_RUNE = '';
    window.prompt = jest.fn();
    renderWithMockContext(<ConnectWallet />, { providerProps });

    await act(async () => jest.advanceTimersByTime(APP_ANIMATION_DURATION * 1000));

    const invoiceRuneButton = screen.getByTestId('invoice-rune-button')
    fireEvent.click(invoiceRuneButton);

    const invoiceRuneField = screen.getByTestId('invoice-rune');
    expect(invoiceRuneField).toBeDisabled();

    fireEvent.click(invoiceRuneField);
    expect(providerProps.setShowToast).not.toHaveBeenCalled();

    fireEvent.click(invoiceRuneButton);
    expect(providerProps.setShowToast).not.toHaveBeenCalled();
  });

});
