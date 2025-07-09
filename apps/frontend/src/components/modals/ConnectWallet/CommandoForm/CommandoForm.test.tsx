import React, { act } from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { CLNService } from '../../../../services/http.service';
import { mockBKPRStoreData, mockCLNStoreData, mockConnectWallet, mockRootStoreData, mockShowModals } from '../../../../utilities/test-utilities/mockData';
import { renderWithProviders } from '../../../../utilities/test-utilities/mockStore';
import * as dataFormatUtils from '../../../../utilities/data-formatters';
import ConnectWallet from '../ConnectWallet';
import { spyOnCreateInvoiceRune } from '../../../../utilities/test-utilities/mockService';

describe('CommandoForm Component', () => {
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
  const customMockStoreWithoutWSS = {
    root: {
      ...mockRootStoreData,
      showModals: {
        ...mockShowModals,
        connectWalletModal: true,
      },
      connectWallet: { ...mockConnectWallet, LIGHTNING_WS_PROTOCOL: 'ws' }
    },
    cln: mockCLNStoreData,
    bkpr: mockBKPRStoreData
  };

  it('renders without crashing', async () => {
    await renderWithProviders(<ConnectWallet />, { preloadedState: customMockStore });
    expect(screen.getByTestId('ws-protocol')).toBeInTheDocument();
  });

  it('displays correct values for Commando network', async () => {
    await renderWithProviders(<ConnectWallet />, { preloadedState: customMockStore });
    expect(screen.getByTestId('ws-protocol')).toHaveValue(mockConnectWallet.LIGHTNING_WS_PROTOCOL);
    expect(screen.getByTestId('ws-host')).toHaveValue(mockConnectWallet.LIGHTNING_HOST);
    expect(screen.getByTestId('ws-port')).toHaveValue(mockConnectWallet.LIGHTNING_WS_PORT.toString());
    expect(screen.getByTestId('node-pubkey')).toHaveValue(mockConnectWallet.NODE_PUBKEY);
    expect(screen.getByTestId('rune')).toHaveValue(mockConnectWallet.ADMIN_RUNE);
    expect(screen.getByTestId('invoice-rune')).toHaveValue(mockConnectWallet.INVOICE_RUNE);
    expect(screen.getByTestId('wss-tls-certs')).toHaveValue(mockConnectWallet.LIGHTNING_WS_TLS_CERTS);
  });

  it('displays Tor host when network is Commando (Tor)', async () => {
    await renderWithProviders(<ConnectWallet />, { preloadedState: customMockStore });
    await act(async () => {
      fireEvent.click(screen.getByTestId('network-toggle'));
    });
    const commandoTorSelect = screen.getAllByTestId('network-item')[1];
    await act(async () => {
      fireEvent.click(commandoTorSelect);
    });
    expect(screen.getByTestId('ws-host')).toHaveValue(mockConnectWallet.LIGHTNING_TOR_HOST);
  });

  it('copies field values to clipboard when clicked', async () => {
    const copyTextToClipboard = jest.spyOn(dataFormatUtils, 'copyTextToClipboard');
    await renderWithProviders(<ConnectWallet />, { preloadedState: customMockStore });
    const fieldsToTest = [
      { id: 'WS Protocol', testId: 'ws-protocol', expected: mockConnectWallet.LIGHTNING_WS_PROTOCOL },
      { id: 'WS Host', testId: 'ws-host', expected: mockConnectWallet.LIGHTNING_HOST },
      { id: 'WS Port', testId: 'ws-port', expected: mockConnectWallet.LIGHTNING_WS_PORT.toString() },
      { id: 'Node Public Key', testId: 'node-pubkey', expected: mockConnectWallet.NODE_PUBKEY },
      { id: 'Rune', testId: 'rune', expected: mockConnectWallet.ADMIN_RUNE },
      { id: 'Invoice Rune', testId: 'invoice-rune', expected: mockConnectWallet.INVOICE_RUNE },
      { id: 'WSS TLS Certs', testId: 'wss-tls-certs', expected: mockConnectWallet.LIGHTNING_WS_TLS_CERTS }
    ];
    for (const [i, field] of fieldsToTest.entries()) {
      await act(async () => {
        fireEvent.click(screen.getByTestId(field.testId));
      });
      expect(copyTextToClipboard).toHaveBeenNthCalledWith(i + 1, field.expected);
    }
  });

  it('toggles between encoded and decoded certs when WSS TLS Certs is clicked', async () => {
    const copyTextToClipboard = jest.spyOn(dataFormatUtils, 'copyTextToClipboard');
    const decodeCombinedCertsUtil = jest.spyOn(dataFormatUtils, 'decodeCombinedCerts');
    const decodedWSSCerts = `{\n"clientKey": "\n-----BEGIN PRIVATE KEY-----\nWSSClientKeyValueToBeBase64Encoded\n-----END PRIVATE KEY-----\n",\n"clientCert": "\n-----BEGIN CERTIFICATE-----\nWSSClientCertValueToBeBase64Encoded\n-----END CERTIFICATE-----\n",\n"caCert": "\n-----BEGIN CERTIFICATE-----\nWSSCaCertValueToBeBase64Encoded\n-----END CERTIFICATE-----\n"\n}`;
    await renderWithProviders(<ConnectWallet />, { preloadedState: customMockStore });
    await act(async () => {
      fireEvent.click(screen.getByTestId('wss-tls-certs'));
    });
    expect(copyTextToClipboard).toHaveBeenCalledWith(mockConnectWallet.LIGHTNING_WS_TLS_CERTS);

    await act(async () => {
      fireEvent.click(screen.getByTestId('wss-tls-certs'));
    });
    expect(decodeCombinedCertsUtil).toHaveBeenCalledWith(mockConnectWallet.LIGHTNING_WS_TLS_CERTS);
    expect(copyTextToClipboard).toHaveBeenNthCalledWith(2, decodedWSSCerts);
  });

  it('shows AddSVG, calls createInvoiceRune and loading spinner', async () => {
    spyOnCreateInvoiceRune();
    await renderWithProviders(<ConnectWallet />, { preloadedState: customMockStoreWithoutInvoiceRune });
    
    const button = screen.getByTestId('invoice-rune-button');
    expect(button.querySelector('svg')).toBeInTheDocument();
    await act(async () => {
      fireEvent.click(button);
    });
    expect(CLNService.createInvoiceRune).toHaveBeenCalled();
    expect(screen.getByTestId('invoice-rune-spinner')).toBeInTheDocument();
  });

  it('shows CopySVG and calls copyHandler when invoice rune exists', async () => {
    const copyTextToClipboard = jest.spyOn(dataFormatUtils, 'copyTextToClipboard');
    await renderWithProviders(<ConnectWallet />, { preloadedState: customMockStore });
    const button = screen.getByTestId('invoice-rune-button');
    expect(button.querySelector('svg')).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(button);
    });
    expect(copyTextToClipboard).toHaveBeenCalledWith(mockConnectWallet.INVOICE_RUNE);
  });

  it('does not show WSS TLS Certs when protocol is not wss', async () => {
    await renderWithProviders(<ConnectWallet />, { preloadedState: customMockStoreWithoutWSS });
    expect(screen.queryByTestId('wss-tls-certs')).not.toBeInTheDocument();
  });

  it('handles error when creating invoice rune fails', async () => {
    const errorMessage = 'Unknown';
    spyOnCreateInvoiceRune(errorMessage);
    const { getActions } = await renderWithProviders(<ConnectWallet />, { preloadedState: customMockStoreWithoutInvoiceRune });
    await act(() => {
      fireEvent.click(screen.getByTestId('invoice-rune-button'));
    });
    await waitFor(() => {
      expect(getActions().some(action =>
        action.type === 'root/setShowToast' &&
        action.payload.message === 'Error Creating Invoice Rune: ' + errorMessage
      )).toBe(true);
    });
  });
});
