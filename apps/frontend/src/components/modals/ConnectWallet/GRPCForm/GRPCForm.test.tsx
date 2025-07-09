import React, { act } from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { renderWithProviders } from '../../../../utilities/test-utilities/mockStore';
import { mockBKPRStoreData, mockCLNStoreData, mockConnectWallet, mockRootStoreData, mockShowModals } from '../../../../utilities/test-utilities/mockData';
import ConnectWallet from '../ConnectWallet';
import * as dataFormatUtils from '../../../../utilities/data-formatters';

describe('GRPCForm Component', () => {
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

  it('renders without crashing', async () => {
    await renderWithProviders(<ConnectWallet />, { preloadedState: customMockStore });
    fireEvent.click(screen.getByTestId('network-toggle'));
    const grpcItem = screen.getAllByTestId('network-item')[4];
    await act(async () => {
      fireEvent.click(grpcItem);
    });
    expect(screen.getByTestId('grpc-form')).toBeInTheDocument();
    expect(screen.getByTestId('grpc-host')).toBeInTheDocument();
  });

  it('displays correct values for gRPC network', async () => {
    await renderWithProviders(<ConnectWallet />, { preloadedState: customMockStore });
    fireEvent.click(screen.getByTestId('network-toggle'));
    const grpcItem = screen.getAllByTestId('network-item')[4];
    await act(async () => {
      fireEvent.click(grpcItem);
    });
    expect(screen.getByTestId('grpc-host')).toHaveValue(mockConnectWallet.LIGHTNING_GRPC_HOST);
    expect(screen.getByTestId('grpc-port')).toHaveValue(mockConnectWallet.LIGHTNING_GRPC_PORT.toString());
    expect(screen.getByTestId('node-pubkey')).toHaveValue(mockConnectWallet.NODE_PUBKEY);
    expect(screen.getByTestId('proto-path')).toHaveValue(decodeURIComponent(mockConnectWallet.LIGHTNING_GRPC_PROTO_PATH));
    expect(screen.getByTestId('grpc-tls-certs')).toHaveValue(mockConnectWallet.LIGHTNING_GRPC_TLS_CERTS);
  });

  it('displays Tor host when network is gRPC (Tor)', async () => {
    await renderWithProviders(<ConnectWallet />, { preloadedState: customMockStore });
    fireEvent.click(screen.getByTestId('network-toggle'));
    const grpcItem = screen.getAllByTestId('network-item')[5];
    await act(async () => {
      fireEvent.click(grpcItem);
    });
    expect(screen.getByTestId('grpc-host')).toHaveValue(mockConnectWallet.LIGHTNING_GRPC_TOR_HOST);
  });

  it('copies field values to clipboard when clicked', async () => {
    const copyTextToClipboard = jest.spyOn(dataFormatUtils, 'copyTextToClipboard');
    await renderWithProviders(<ConnectWallet />, { preloadedState: customMockStore });
    fireEvent.click(screen.getByTestId('network-toggle'));
    const grpcItem = screen.getAllByTestId('network-item')[4];
    await act(async () => {
      fireEvent.click(grpcItem);
    });

    const fieldsToTest = [
      { id: 'gRPC Host', testId: 'grpc-host', expected: mockConnectWallet.LIGHTNING_GRPC_HOST },
      { id: 'gRPC Port', testId: 'grpc-port', expected: mockConnectWallet.LIGHTNING_GRPC_PORT.toString() },
      { id: 'Node Public Key', testId: 'node-pubkey', expected: mockConnectWallet.NODE_PUBKEY },
      { id: 'Proto Path', testId: 'proto-path', expected: decodeURIComponent(mockConnectWallet.LIGHTNING_GRPC_PROTO_PATH) },
      { id: 'gRPC TLS Certs', testId: 'grpc-tls-certs', expected: mockConnectWallet.LIGHTNING_GRPC_TLS_CERTS }
    ];
    for (const [i, field] of fieldsToTest.entries()) {
      await act(async () => {
        fireEvent.click(screen.getByTestId(field.testId));
      });
      expect(copyTextToClipboard).toHaveBeenNthCalledWith(i + 1, field.expected);
    }
  });

  it('toggles between encoded and decoded certs when gRPC TLS Certs is clicked', async () => {
    const copyTextToClipboard = jest.spyOn(dataFormatUtils, 'copyTextToClipboard');
    const decodeCombinedCerts = jest.spyOn(dataFormatUtils, 'decodeCombinedCerts');
    const decodedGRPCCerts = `{\n"clientKey": "\n-----BEGIN PRIVATE KEY-----\ngRPCClientKeyValueToBeBase64Encoded\n-----END PRIVATE KEY-----\n",\n"clientCert": "\n-----BEGIN CERTIFICATE-----\ngRPCClientCertValueToBeBase64Encoded\n-----END CERTIFICATE-----\n",\n"caCert": "\n-----BEGIN CERTIFICATE-----\ngRPCCaCertValueToBeBase64Encoded\n-----END CERTIFICATE-----\n"\n}`;
    await renderWithProviders(<ConnectWallet />, { preloadedState: customMockStore });
    fireEvent.click(screen.getByTestId('network-toggle'));
    const grpcItem = screen.getAllByTestId('network-item')[4];
    await act(async () => {
      fireEvent.click(grpcItem);
    });

    await act(async () => {
      fireEvent.click(screen.getByTestId('grpc-tls-certs'));
    });
    expect(copyTextToClipboard).toHaveBeenCalledWith(mockConnectWallet.LIGHTNING_GRPC_TLS_CERTS);

    await act(async () => {
      fireEvent.click(screen.getByTestId('grpc-tls-certs'));
    });
    expect(decodeCombinedCerts).toHaveBeenCalledWith(mockConnectWallet.LIGHTNING_GRPC_TLS_CERTS);
    expect(copyTextToClipboard).toHaveBeenNthCalledWith(2, decodedGRPCCerts);
  });

  it('dispatches success toast when copy is successful', async () => {
    const { getActions } = await renderWithProviders(<ConnectWallet />, { preloadedState: customMockStore });
    fireEvent.click(screen.getByTestId('network-toggle'));
    const grpcItem = screen.getAllByTestId('network-item')[4];
    await act(async () => {
      fireEvent.click(grpcItem);
    });

    await act(async () => {
      fireEvent.click(screen.getByTestId('grpc-host'));
    });
    
    await waitFor(() => {
      expect(getActions().some(action =>
        action.type === 'root/setShowToast' &&
        action.payload.message === 'gRPC Host Copied Successfully!'
      )).toBe(true);
    });
  });
});
