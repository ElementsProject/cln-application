import React, { act } from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { renderWithProviders } from '../../../../utilities/test-utilities/mockStore';
import { mockBKPRStoreData, mockCLNStoreData, mockConnectWallet, mockRootStoreData, mockShowModals } from '../../../../utilities/test-utilities/mockData';
import ConnectWallet from '../ConnectWallet';
import * as dataFormatUtils from '../../../../utilities/data-formatters';

describe('QRCodeLarge Component', () => {
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
  const customMockStoreWithoutHTTPS = {
    root: {
      ...mockRootStoreData,
      showModals: {
        ...mockShowModals,
        connectWalletModal: true,
      },
      connectWallet: { ...mockConnectWallet, LIGHTNING_REST_PROTOCOL: 'http' }
    },
    cln: mockCLNStoreData,
    bkpr: mockBKPRStoreData
  };

  it('renders without crashing', async () => {
    await renderWithProviders(<ConnectWallet />, { preloadedState: customMockStore });
    fireEvent.click(screen.getByTestId('network-toggle'));
    const restItem = screen.getAllByTestId('network-item')[2];
    await act(async () => {
      fireEvent.click(restItem);
    });
    expect(screen.getByTestId('rest-protocol')).toBeInTheDocument();
  });

  it('displays correct values for REST network', async () => {
    await renderWithProviders(<ConnectWallet />, { preloadedState: customMockStore });
    fireEvent.click(screen.getByTestId('network-toggle'));
    const restItem = screen.getAllByTestId('network-item')[2];
    await act(async () => {
      fireEvent.click(restItem);
    });
    expect(screen.getByTestId('rest-protocol')).toHaveValue(mockConnectWallet.LIGHTNING_REST_PROTOCOL);
    expect(screen.getByTestId('rest-host')).toHaveValue(mockConnectWallet.LIGHTNING_REST_HOST);
    expect(screen.getByTestId('rest-port')).toHaveValue(mockConnectWallet.LIGHTNING_REST_PORT.toString());
    expect(screen.getByTestId('rune')).toHaveValue(mockConnectWallet.ADMIN_RUNE);
    expect(screen.getByTestId('rest-tls-certs')).toHaveValue(mockConnectWallet.LIGHTNING_REST_TLS_CERTS);
  });

  it('displays Tor host when network is REST (Tor)', async () => {
    await renderWithProviders(<ConnectWallet />, { preloadedState: customMockStore });
    fireEvent.click(screen.getByTestId('network-toggle'));
    const restItem = screen.getAllByTestId('network-item')[3];
    await act(async () => {
      fireEvent.click(restItem);
    });
    expect(screen.getByTestId('rest-host')).toHaveValue(mockConnectWallet.LIGHTNING_REST_TOR_HOST);
  });

  it('copies field values to clipboard when clicked', async () => {
    const copyTextToClipboard = jest.spyOn(dataFormatUtils, 'copyTextToClipboard');
    await renderWithProviders(<ConnectWallet />, { preloadedState: customMockStore });
    fireEvent.click(screen.getByTestId('network-toggle'));
    const restItem = screen.getAllByTestId('network-item')[2];
    await act(async () => {
      fireEvent.click(restItem);
    });

    const fieldsToTest = [
      { id: 'REST Protocol', testId: 'rest-protocol', expected: mockConnectWallet.LIGHTNING_REST_PROTOCOL },
      { id: 'REST Host', testId: 'rest-host', expected: mockConnectWallet.LIGHTNING_REST_HOST },
      { id: 'REST Port', testId: 'rest-port', expected: mockConnectWallet.LIGHTNING_REST_PORT.toString() },
      { id: 'Rune', testId: 'rune', expected: mockConnectWallet.ADMIN_RUNE },
      { id: 'REST TLS Certs', testId: 'rest-tls-certs', expected: mockConnectWallet.LIGHTNING_REST_TLS_CERTS },
    ];
    for (const [i, field] of fieldsToTest.entries()) {
      await act(async () => {
        fireEvent.click(screen.getByTestId(field.testId));
      });
      expect(copyTextToClipboard).toHaveBeenNthCalledWith(i + 1, field.expected);
    }
  });

  it('toggles between encoded and decoded certs when REST TLS Certs is clicked', async () => {
    const copyTextToClipboard = jest.spyOn(dataFormatUtils, 'copyTextToClipboard');
    const decodeCombinedCerts = jest.spyOn(dataFormatUtils, 'decodeCombinedCerts');
    const decodedRESTCerts = `{\n"clientKey": "\n-----BEGIN PRIVATE KEY-----\nRESTClientKeyValueToBeBase64Encoded\n-----END PRIVATE KEY-----\n",\n"clientCert": "\n-----BEGIN CERTIFICATE-----\nRESTClientCertValueToBeBase64Encoded\n-----END CERTIFICATE-----\n",\n"caCert": "\n-----BEGIN CERTIFICATE-----\nRESTCaCertValueToBeBase64Encoded\n-----END CERTIFICATE-----\n"\n}`;
    await renderWithProviders(<ConnectWallet />, { preloadedState: customMockStore });
    fireEvent.click(screen.getByTestId('network-toggle'));
    const restItem = screen.getAllByTestId('network-item')[2];
    await act(async () => {
      fireEvent.click(restItem);
    });
    await act(async () => {
      fireEvent.click(screen.getByTestId('rest-tls-certs'));
    });
    expect(copyTextToClipboard).toHaveBeenCalledWith(mockConnectWallet.LIGHTNING_REST_TLS_CERTS);

    await act(async () => {
      fireEvent.click(screen.getByTestId('rest-tls-certs'));
    });
    expect(decodeCombinedCerts).toHaveBeenCalledWith(mockConnectWallet.LIGHTNING_REST_TLS_CERTS);
    expect(copyTextToClipboard).toHaveBeenNthCalledWith(2, decodedRESTCerts);
  });

  it('hides REST TLS Certs when protocol is http', async () => {
    await renderWithProviders(<ConnectWallet />, { preloadedState: customMockStoreWithoutHTTPS });
    fireEvent.click(screen.getByTestId('network-toggle'));
    const restItem = screen.getAllByTestId('network-item')[2];
    await act(async () => {
      fireEvent.click(restItem);
    });
    expect(screen.queryByTestId('rest-tls-certs')).not.toBeInTheDocument();
  });

  it('dispatches success toast when copy is successful', async () => {
    const { getActions } = await renderWithProviders(<ConnectWallet />, { preloadedState: customMockStoreWithoutHTTPS });
    fireEvent.click(screen.getByTestId('network-toggle'));
    const restItem = screen.getAllByTestId('network-item')[2];
    await act(async () => {
      fireEvent.click(restItem);
    });
    await act(async () => {
      fireEvent.click(screen.getByTestId('rest-host'));
    });  
    await waitFor(() => {
      expect(getActions().some(action =>
        action.type === 'root/setShowToast' &&
        action.payload.message === 'REST Host Copied Successfully!'
      )).toBe(true);
    });
  });

  it('shows correct tooltip text for TLS certs copy button', async () => {
    const { getActions } = await renderWithProviders(<ConnectWallet />, { preloadedState: customMockStore });
    fireEvent.click(screen.getByTestId('network-toggle'));
    const restItem = screen.getAllByTestId('network-item')[2];
    await act(async () => {
      fireEvent.click(restItem);
    });
    const restTlsCerts = screen.getByTestId('rest-tls-certs');
    await act(async () => {
      fireEvent.click(restTlsCerts);
    });
    await waitFor(() => {
      expect(getActions().some(action =>
        action.type === 'root/setShowToast' &&
        action.payload.message === 'Encoded REST Certs Copied Successfully!'
      )).toBe(true);
    });
    await act(async () => {
      fireEvent.click(restTlsCerts);
    });
    await waitFor(() => {
      expect(getActions().some(action =>
        action.type === 'root/setShowToast' &&
        action.payload.message === 'Decoded REST Certs Copied Successfully!'
      )).toBe(true);
    });
  });
});
