import { act } from 'react';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import ConnectWallet from './ConnectWallet';
import { mockBKPRStoreData, mockCLNStoreData, mockConnectWallet, mockRootStoreData, mockShowModals } from '../../../utilities/test-utilities/mockData';
import { renderWithProviders } from '../../../utilities/test-utilities/mockStore';
import * as dataFormatUtils from '../../../utilities/data-formatters';

describe('ConnectWallet component', () => {
  const customMockStore = {
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
  const customMockStoreWithoutInvoiceRune = {
    root: {
      ...mockRootStoreData,
      showModals: {
        ...mockShowModals,
        connectWalletModal: true,
      },
      connectWallet: { ...mockConnectWallet, INVOICE_RUNE: '' }
    },
    cln: mockCLNStoreData,
    bkpr: mockBKPRStoreData
  };

  it('renders the modal when showModals.connectWalletModal is true', async () => {
    await renderWithProviders(<ConnectWallet />, { preloadedState: customMockStore });
    expect(screen.getByTestId('connect-wallet')).toBeInTheDocument();
  });

  it('displays the correct initial network types based on connectWallet props', async () => {
    await renderWithProviders(<ConnectWallet />, { preloadedState: customMockStore });
    fireEvent.click(screen.getByTestId('network-toggle'));
    await waitFor(() => {
      const networkItems = screen.getAllByTestId('network-item');
      expect(networkItems).toHaveLength(6);
      expect(networkItems[0]).toHaveTextContent('Commando');
      expect(networkItems[1]).toHaveTextContent('Commando (Tor)');
      expect(networkItems[2]).toHaveTextContent('REST');
      expect(networkItems[3]).toHaveTextContent('REST (Tor)');
      expect(networkItems[4]).toHaveTextContent('gRPC');
      expect(networkItems[5]).toHaveTextContent('gRPC (Tor)');
    });
  });

  it('sets Commando as the default selected network', async () => {
    await renderWithProviders(<ConnectWallet />, { preloadedState: customMockStore });
    expect(screen.getByTestId('network-toggle')).toHaveTextContent('Commando');
  });

  it('updates the connection URL when network is changed', async () => {
    await renderWithProviders(<ConnectWallet />, { preloadedState: customMockStore });
    const initialUrl = screen.getByTestId('connect-url');
    expect(initialUrl).toHaveValue('commando+wss://'+ mockConnectWallet.LIGHTNING_HOST + ':' + mockConnectWallet.LIGHTNING_WS_PORT + '?pubkey=' + mockConnectWallet.NODE_PUBKEY + '&rune=' + mockConnectWallet.ADMIN_RUNE + '&invoiceRune=' + mockConnectWallet.INVOICE_RUNE + '&certs=' + mockConnectWallet.LIGHTNING_WS_TLS_CERTS);
    await act(async () => {
      fireEvent.click(screen.getByTestId('network-toggle'));
    });
    const restItem = screen.getAllByTestId('network-item')[2];
    await act(async () => {
      fireEvent.click(restItem);
    });
    const updatedUrl = screen.getByTestId('connect-url');
    expect(updatedUrl).toHaveValue('clnrest+https://' + mockConnectWallet.LIGHTNING_REST_HOST + ':' + mockConnectWallet.LIGHTNING_REST_PORT +'?rune=' + mockConnectWallet.ADMIN_RUNE + '&certs=' + mockConnectWallet.LIGHTNING_REST_TLS_CERTS);
  });

  it('copies the connection URL to clipboard when copy button is clicked', async () => {
    const copyTextToClipboard = jest.spyOn(dataFormatUtils, 'copyTextToClipboard');
    await renderWithProviders(<ConnectWallet />, { preloadedState: customMockStore });
    const copyClick = screen.getByTestId('connect-url-copy');
    await act(async () => {
      fireEvent.click(copyClick);
    });
    expect(copyTextToClipboard).toHaveBeenCalledWith('commando+wss://'+ mockConnectWallet.LIGHTNING_HOST + ':' + mockConnectWallet.LIGHTNING_WS_PORT + '?pubkey=' + mockConnectWallet.NODE_PUBKEY + '&rune=' + mockConnectWallet.ADMIN_RUNE + '&invoiceRune=' + mockConnectWallet.INVOICE_RUNE + '&certs=' + mockConnectWallet.LIGHTNING_WS_TLS_CERTS);
  });

  it('displays the correct form based on selected network', async () => {
    await renderWithProviders(<ConnectWallet />, { preloadedState: customMockStore });
    expect(screen.getByTestId('commando-form')).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('network-toggle'));
    const restItem = screen.getAllByTestId('network-item')[2];
    await act(async () => {
      fireEvent.click(restItem);
    });
    
    expect(screen.getByTestId('rest-form')).toBeInTheDocument();
    
    fireEvent.click(screen.getByTestId('network-toggle'));
    const grpcItem = screen.getAllByTestId('network-item')[4];
    await act(async () => {
      fireEvent.click(grpcItem);
    });
    
    expect(screen.getByTestId('grpc-form')).toBeInTheDocument();
  });

  it('displays QR code with correct value', async () => {
    await renderWithProviders(<ConnectWallet />, { preloadedState: customMockStore });
    const qrCode = document.querySelector('canvas');
    expect(qrCode).toBeInTheDocument();
  });

  it('handles dark mode styling correctly', async () => {
    await renderWithProviders(<ConnectWallet />, { preloadedState: customMockStore });
    const logoImg = screen.getByTestId('qr-cln-logo');
    expect(logoImg).toHaveAttribute('src', '/images/cln-logo-dark.png');
  });

  it('updates connection URL when invoice rune changes', async () => {
    await renderWithProviders(<ConnectWallet />, { preloadedState: customMockStore });
    
    const connectUrl = screen.getByTestId('connect-url');
    expect(connectUrl).toHaveValue('commando+wss://'+ mockConnectWallet.LIGHTNING_HOST + ':' + mockConnectWallet.LIGHTNING_WS_PORT + '?pubkey=' + mockConnectWallet.NODE_PUBKEY + '&rune=' + mockConnectWallet.ADMIN_RUNE + '&invoiceRune=' + mockConnectWallet.INVOICE_RUNE + '&certs=' + mockConnectWallet.LIGHTNING_WS_TLS_CERTS);
  });

  it('does not include invoice rune in URL when not available', async () => {
    await renderWithProviders(<ConnectWallet />, { preloadedState: customMockStoreWithoutInvoiceRune });
    const connectUrl = screen.getByTestId('connect-url');
    expect(connectUrl).not.toHaveValue(expect.stringContaining('&invoiceRune='));
  });

  it('closes the modal when close button is clicked', async () => {
    const { getActions } = await renderWithProviders(<ConnectWallet />, { preloadedState: customMockStore });
    const modalCloseButton = screen.getByTestId('modal-close');
    fireEvent.click(modalCloseButton);
    await waitFor(() => {
      expect(getActions().some(action =>
        action.type === 'root/setShowModals' &&
        action.payload.connectWalletModal === false &&
        action.payload.qrCodeLarge === false
      )).toBe(true);
    });
  });

  it('opens large QR Code on QR code click', async () => {
    const { getActions } = await renderWithProviders(<ConnectWallet />, { preloadedState: customMockStore });
    const QRContainer = screen.getByTestId('qr-container');
    const QRCanvas = QRContainer.querySelector('canvas');
    expect(QRCanvas).toBeInTheDocument();
    await act(async () => {
      if (QRCanvas) {
        fireEvent.click(QRCanvas);
      } else {
        fail('QR canvas not found');
      }
    });
    await waitFor(() => {
      expect(getActions().some(action =>
        action.type === 'root/setShowModals' &&
        action.payload.connectWalletModal === false &&
        action.payload.qrCodeLarge === true
      )).toBe(true);
    });
  });
});
