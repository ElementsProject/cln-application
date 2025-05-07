import { act } from 'react';
import { fireEvent, screen } from '@testing-library/react';
import ConnectWallet from './ConnectWallet';
import { renderWithProviders } from '../../../utilities/test-utilities/mockStore';
import { mockBKPRStoreData, mockCLNStoreData, mockConnectWallet, mockInvoiceRune, mockRootStoreData, mockShowModals } from '../../../utilities/test-utilities/mockData';
import { spyOnCreateInvoiceRune } from '../../../utilities/test-utilities/mockService';

describe('ConnectWallet component ', () => {
  const customMockStore = {
    root: {
      ...mockRootStoreData,
      showModals: {
        ...mockShowModals,
        connectWalletModal: true,
      },
      connectWallet: { ...mockConnectWallet, INVOICE_RUNE: mockInvoiceRune.rune }
    },
    cln: mockCLNStoreData,
    bkpr: mockBKPRStoreData
  };
  const customMockStoreWithoutInvoiceRune = {
    root: {
      ...mockRootStoreData,
      showModals: {
        ...mockShowModals,
        connectWalletModal: true,
      }
    },
    cln: mockCLNStoreData,
    bkpr: mockBKPRStoreData
  };

  it('renders with initial state', async () => {
    await renderWithProviders(<ConnectWallet />, { preloadedState: customMockStore });
    expect(screen.getByTestId('connect-wallet')).toBeInTheDocument();
    expect(screen.getByText('LN Message')).toBeInTheDocument();
    expect(screen.getByTestId('port')).toHaveValue('5001');
    expect(screen.getByTestId('host')).toHaveValue('user.local');
    expect(screen.getByTestId('rune')).toHaveValue('mRXhnFyVWrRQChA9eJ01RQT9W502daqrP0JA4BiHHw89MCZGb3IgQXBwbGljYXRpb24j');
    expect(screen.getByTestId('invoice-rune')).toHaveValue('aHFhnFyVWrRQChA9eJ01RQT9W502daqrP0JA4BiHHw89MCZGb3IgQXBwbGljYXRpb2==');
    expect(screen.getByTestId('connect-url')).toHaveValue('ln-message://user.local:5001?rune=mRXhnFyVWrRQChA9eJ01RQT9W502daqrP0JA4BiHHw89MCZGb3IgQXBwbGljYXRpb24j&invoiceRune=aHFhnFyVWrRQChA9eJ01RQT9W502daqrP0JA4BiHHw89MCZGb3IgQXBwbGljYXRpb2==');
    expect(screen.queryByTestId('invoice-rune-spinner')).not.toBeInTheDocument();
  });

  it('updates selected network and input fields on network change to LN Message', async () => {
    await renderWithProviders(<ConnectWallet />, { preloadedState: customMockStore });
    const networkToggle = screen.getByTestId('network-toggle');
    fireEvent.click(networkToggle)
    const selNetworkItem = screen.getAllByTestId('network-item')[0];
    await act(async () => fireEvent.click(selNetworkItem));
    expect(screen.getByTestId('port')).toHaveValue('5001');
    expect(screen.getByTestId('host')).toHaveValue('user.local');
    expect(screen.getByTestId('rune')).toHaveValue('mRXhnFyVWrRQChA9eJ01RQT9W502daqrP0JA4BiHHw89MCZGb3IgQXBwbGljYXRpb24j');
    expect(screen.queryByTestId('client-cert')).not.toBeInTheDocument();
    expect(screen.queryByTestId('ca-cert')).not.toBeInTheDocument();
    expect(screen.getByTestId('invoice-rune')).toHaveValue('aHFhnFyVWrRQChA9eJ01RQT9W502daqrP0JA4BiHHw89MCZGb3IgQXBwbGljYXRpb2==');
    expect(screen.getByTestId('connect-url')).toHaveValue('ln-message://user.local:5001?rune=mRXhnFyVWrRQChA9eJ01RQT9W502daqrP0JA4BiHHw89MCZGb3IgQXBwbGljYXRpb24j&invoiceRune=aHFhnFyVWrRQChA9eJ01RQT9W502daqrP0JA4BiHHw89MCZGb3IgQXBwbGljYXRpb2==');
  });

  it('updates selected network and input fields on network change to LN Message (Tor)', async () => {
    await renderWithProviders(<ConnectWallet />, { preloadedState: customMockStore });
    await act(async () => fireEvent.click(screen.getByTestId('network-toggle')));
    const selNetworkItem = screen.getAllByTestId('network-item')[1];
    await act(async () => fireEvent.click(selNetworkItem));
    expect(screen.getByTestId('port')).toHaveValue('5001');
    expect(screen.getByTestId('host')).toHaveValue('oqaer4kd7ufryngx6dsztovs4pnlmaouwmtkofjsd2m7pkq8wd.onion');
    expect(screen.getByTestId('rune')).toHaveValue('mRXhnFyVWrRQChA9eJ01RQT9W502daqrP0JA4BiHHw89MCZGb3IgQXBwbGljYXRpb24j');
    expect(screen.queryByTestId('client-cert')).not.toBeInTheDocument();
    expect(screen.queryByTestId('ca-cert')).not.toBeInTheDocument();
    expect(screen.getByTestId('invoice-rune')).toHaveValue('aHFhnFyVWrRQChA9eJ01RQT9W502daqrP0JA4BiHHw89MCZGb3IgQXBwbGljYXRpb2==');
    expect(screen.getByTestId('connect-url')).toHaveValue('ln-message://oqaer4kd7ufryngx6dsztovs4pnlmaouwmtkofjsd2m7pkq8wd.onion:5001?rune=mRXhnFyVWrRQChA9eJ01RQT9W502daqrP0JA4BiHHw89MCZGb3IgQXBwbGljYXRpb24j&invoiceRune=aHFhnFyVWrRQChA9eJ01RQT9W502daqrP0JA4BiHHw89MCZGb3IgQXBwbGljYXRpb2==');
  });

  it('updates selected network and input fields on network change to REST', async () => {
    await renderWithProviders(<ConnectWallet />, { preloadedState: customMockStore });
    await act(async () => fireEvent.click(screen.getByTestId('network-toggle')));
    const selNetworkItem = screen.getAllByTestId('network-item')[2];
    await act(async () => fireEvent.click(selNetworkItem));
    expect(screen.getByTestId('port')).toHaveValue('3001');
    expect(screen.getByTestId('host')).toHaveValue('user.local');
    expect(screen.queryByTestId('client-cert')).toBeInTheDocument();
    expect(screen.queryByTestId('ca-cert')).toBeInTheDocument();
    expect(screen.queryByTestId('invoice-rune')).not.toBeInTheDocument();
    expect(screen.getByTestId('connect-url')).toHaveValue('clnrest://https://user.local:3001?rune=mRXhnFyVWrRQChA9eJ01RQT9W502daqrP0JA4BiHHw89MCZGb3IgQXBwbGljYXRpb24j&clientKey=ClientKey&clientCert=ClientCert&caCert=CACert');
  });

  it('updates selected network and input fields on network change to REST (Tor)', async () => {
    await renderWithProviders(<ConnectWallet />, { preloadedState: customMockStore });
    await act(async () => fireEvent.click(screen.getByTestId('network-toggle')));
    const selNetworkItem = screen.getAllByTestId('network-item')[3];
    await act(async () => fireEvent.click(selNetworkItem));
    expect(screen.getByTestId('port')).toHaveValue('3001');
    expect(screen.getByTestId('host')).toHaveValue('oqaer4kd7ufryngx6dsztovs4pnlmaouwmtkofjsd2m7pkq8wd.onion');
    expect(screen.queryByTestId('client-cert')).toBeInTheDocument();
    expect(screen.queryByTestId('ca-cert')).not.toBeInTheDocument();
    expect(screen.queryByTestId('invoice-rune')).not.toBeInTheDocument();
    expect(screen.getByTestId('connect-url')).toHaveValue('clnrest://https://oqaer4kd7ufryngx6dsztovs4pnlmaouwmtkofjsd2m7pkq8wd.onion:3001?rune=mRXhnFyVWrRQChA9eJ01RQT9W502daqrP0JA4BiHHw89MCZGb3IgQXBwbGljYXRpb24j&clientKey=ClientKey&clientCert=ClientCert&caCert=CACert');
  });

  it('updates selected network and input fields on network change to gRPC', async () => {
    await renderWithProviders(<ConnectWallet />, { preloadedState: customMockStore });
    await act(async () => fireEvent.click(screen.getByTestId('network-toggle')));
    const selNetworkItem = screen.getAllByTestId('network-item')[4];
    await act(async () => fireEvent.click(selNetworkItem));
    expect(screen.getByTestId('port')).toHaveValue('2106');
    expect(screen.getByTestId('host')).toHaveValue('user.local');
    expect(screen.getByTestId('client-key')).toHaveValue('ClientKey');
    expect(screen.getByTestId('client-cert')).toHaveValue('ClientCert');
    expect(screen.getByTestId('ca-cert')).toHaveValue('CACert');
    expect(screen.queryByTestId('invoice-rune')).not.toBeInTheDocument();
    expect(screen.getByTestId('connect-url')).toHaveValue('cln-grpc://https://user.local:2106?clientKey=ClientKey&clientCert=ClientCert&caCert=CACert');
  });

  it('updates selected network and input fields on network change to gRPC (Tor)', async () => {
    await renderWithProviders(<ConnectWallet />, { preloadedState: customMockStore });
    await act(async () => fireEvent.click(screen.getByTestId('network-toggle')));
    const selNetworkItem = screen.getAllByTestId('network-item')[5];
    await act(async () => fireEvent.click(selNetworkItem));
    expect(screen.getByTestId('port')).toHaveValue('2106');
    expect(screen.getByTestId('host')).toHaveValue('oqaer4kd7ufryngx6dsztovs4pnlmaouwmtkofjsd2m7pkq8wd.onion');
    expect(screen.getByTestId('client-key')).toHaveValue('ClientKey');
    expect(screen.getByTestId('client-cert')).toHaveValue('ClientCert');
    expect(screen.queryByTestId('ca-cert')).not.toBeInTheDocument();
    expect(screen.queryByTestId('invoice-rune')).not.toBeInTheDocument();
    expect(screen.getByTestId('connect-url')).toHaveValue('cln-grpc://https://oqaer4kd7ufryngx6dsztovs4pnlmaouwmtkofjsd2m7pkq8wd.onion:2106?clientKey=ClientKey&clientCert=ClientCert&caCert=CACert');
  });

  it('when creating an invoice rune, display loading spinner and disable button', async () => {
    jest.useFakeTimers();
    const mock = spyOnCreateInvoiceRune();
    await renderWithProviders(<ConnectWallet />, { preloadedState: customMockStoreWithoutInvoiceRune });
    await act(async () => fireEvent.click(screen.getByTestId('network-toggle')));
    const selNetworkItem = screen.getAllByTestId('network-item')[0];
    await act(async () => fireEvent.click(selNetworkItem));
    fireEvent.click(screen.getByTestId('invoice-rune'));
    expect(await screen.findByTestId('invoice-rune-spinner')).toBeInTheDocument();
    expect(screen.getByTestId('invoice-rune')).toBeDisabled();
  
    await act(async () => { jest.advanceTimersByTime(10) });
  
    expect(mock).toHaveBeenCalled();
    expect(screen.queryByTestId('invoice-rune-spinner')).not.toBeInTheDocument();
    expect(screen.getByTestId('invoice-rune')).not.toBeDisabled();
  });

});
