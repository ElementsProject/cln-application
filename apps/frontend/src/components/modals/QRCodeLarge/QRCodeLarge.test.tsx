import React, { act } from 'react';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import { mockBKPRStoreData, mockCLNStoreData, mockRootStoreData, mockShowModals } from '../../../utilities/test-utilities/mockData';
import { renderWithProviders } from '../../../utilities/test-utilities/mockStore';
import ConnectWallet from '../ConnectWallet/ConnectWallet';
import { APP_ANIMATION_DURATION } from '../../../utilities/constants';

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

  it('renders without crashing', async () => {
    await renderWithProviders(<ConnectWallet />, { preloadedState: customMockStore });
    const QRContainer = screen.getByTestId('qr-container');
    expect(QRContainer).toBeInTheDocument();
    const QRCanvas = QRContainer.querySelector('canvas');
    expect(QRCanvas).toBeInTheDocument();
    await act(async () => {
      if (QRCanvas) {
        fireEvent.click(QRCanvas);
      } else {
        fail('QR Canvas not found');
      }
    });
    await act(async () => jest.advanceTimersByTime(APP_ANIMATION_DURATION * 2 * 1000));
    expect(screen.getByTestId('qr-code-large')).toBeInTheDocument();
    const qrContainerLarge = screen.getByTestId('qr-container-large');
    const qrCanvasLarge = qrContainerLarge.querySelector('canvas');
    expect(qrCanvasLarge).toHaveAttribute('width', '440');
  });

  it('uses the correct connection URL for the QR code', async () => {
    await renderWithProviders(<ConnectWallet />, { preloadedState: customMockStore });
    const QRContainer = screen.getByTestId('qr-container');
    expect(QRContainer).toBeInTheDocument();
    const QRCanvas = QRContainer.querySelector('canvas');
    expect(QRCanvas).toBeInTheDocument();
    await act(async () => {
      if (QRCanvas) {
        fireEvent.click(QRCanvas);
      } else {
        fail('QR Canvas not found');
      }
    });
    await act(async () => jest.advanceTimersByTime(APP_ANIMATION_DURATION * 1000));
    const qrContainerLarge = screen.getByTestId('qr-container-large');
    const url = qrContainerLarge.getAttribute('data-key');
    expect(url).toContain(mockRootStoreData.connectionUrl);
  });

  it('dispatches correct action when close button is clicked', async () => {
    const { getActions } = await renderWithProviders(<ConnectWallet />, { preloadedState: customMockStore });
    const QRContainer = screen.getByTestId('qr-container');
    expect(QRContainer).toBeInTheDocument();
    const QRCanvas = QRContainer.querySelector('canvas');
    expect(QRCanvas).toBeInTheDocument();
    await act(async () => {
      if (QRCanvas) {
        fireEvent.click(QRCanvas);
      } else {
        fail('QR Canvas not found');
      }
    });
    await act(async () => jest.advanceTimersByTime(APP_ANIMATION_DURATION * 1000));

    const modalCloseButton = screen.getByTestId('modal-close');
    fireEvent.click(modalCloseButton);

    await waitFor(() => {
      expect(getActions().some(action =>
        action.type === 'root/setShowModals' &&
        action.payload.connectWalletModal === true &&
        action.payload.qrCodeLarge === false
      )).toBe(true);
    });
  });

});
