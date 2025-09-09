import { fireEvent, screen, waitFor, act } from '@testing-library/react';
import { APP_ANIMATION_DURATION } from '../../../utilities/constants';
import { mockAppStore } from '../../../utilities/test-utilities/mockData';
import { spyOnDecode } from '../../../utilities/test-utilities/mockService';
import { renderWithProviders } from '../../../utilities/test-utilities/mockStore';
import CLNSend from './CLNSend';

describe('CLNSend component ', () => {
  it('should show send card when clicking send action from CLN card', async () => {
    await renderWithProviders(<CLNSend />, { preloadedState: mockAppStore, initialRoute: ['/cln'] });
    await act(async () => jest.advanceTimersByTime(APP_ANIMATION_DURATION * 1000));
    
    // Initial state
    expect(screen.getByTestId('cln-wallet-balance-card')).toBeInTheDocument();

    // Click the deposit button
    const sendButton = screen.getByTestId('send-button');
    fireEvent.click(sendButton);
    await waitFor(() => {
      expect(screen.getByTestId('cln-send-card')).toBeInTheDocument();
      expect(screen.getByTestId('address-input')).toBeInTheDocument();
    });
  });

  it('should accept lowercase invoice', async () => {
    spyOnDecode();
    await renderWithProviders(<CLNSend />, { preloadedState: mockAppStore, initialRoute: ['/cln'] });
    await act(async () => jest.advanceTimersByTime(APP_ANIMATION_DURATION * 1000));

    // Load send card by clicking the send button on the wallet first
    expect(screen.getByTestId('cln-wallet-balance-card')).toBeInTheDocument();
    const sendButton = screen.getByTestId('send-button');
    fireEvent.click(sendButton);

    await waitFor(() => {
      const invoiceInput = screen.getByTestId('address-input');
      const testInvoice = 'lnb12345';
      fireEvent.change(invoiceInput, { target: { value: testInvoice } });
      expect(screen.queryByText('Invalid Invoice')).not.toBeInTheDocument();
    });
  });

  it('should accept UPPERCASE invoice', async () => {
    spyOnDecode();
    await renderWithProviders(<CLNSend />, { preloadedState: mockAppStore, initialRoute: ['/cln'] });
    await act(async () => jest.advanceTimersByTime(APP_ANIMATION_DURATION * 1000));

    // Load send card by clicking the send button on the wallet first
    expect(screen.getByTestId('cln-wallet-balance-card')).toBeInTheDocument();
    const sendButton = screen.getByTestId('send-button');
    fireEvent.click(sendButton);

    await waitFor(() => {
      const invoiceInput = screen.getByTestId('address-input');
      const testInvoice = 'LNB12345';
      fireEvent.change(invoiceInput, { target: { value: testInvoice } });
      expect(screen.queryByText('Invalid Invoice')).not.toBeInTheDocument();
    });
  });

  it('should accept lowercase offer', async () => {
    spyOnDecode();
    await renderWithProviders(<CLNSend />, { preloadedState: mockAppStore, initialRoute: ['/cln'] });
    await act(async () => jest.advanceTimersByTime(APP_ANIMATION_DURATION * 1000));

    // Load send card by clicking the send button on the wallet first
    expect(screen.getByTestId('cln-wallet-balance-card')).toBeInTheDocument();
    const sendButton = screen.getByTestId('send-button');
    fireEvent.click(sendButton);
    await waitFor(() => {
      // Load offers card
      const offerRadioButton = screen.getByLabelText('Offer');
      act(() => fireEvent.click(offerRadioButton));

      const offerInput = screen.getByTestId('address-input');
      const testOffer = 'lno12345';
      act(() => fireEvent.change(offerInput, { target: { value: testOffer } }));
      expect(offerRadioButton).toBeChecked();
      expect(screen.queryByText('Invalid Offer')).not.toBeInTheDocument();
    });
  });

  it('should accept UPPERCASE offer', async () => {
    spyOnDecode();
    await renderWithProviders(<CLNSend />, { preloadedState: mockAppStore, initialRoute: ['/cln'] });
    await act(async () => jest.advanceTimersByTime(APP_ANIMATION_DURATION * 1000));

    // Load send card by clicking the send button on the wallet first
    expect(screen.getByTestId('cln-wallet-balance-card')).toBeInTheDocument();
    const sendButton = screen.getByTestId('send-button');
    fireEvent.click(sendButton);
    await waitFor(() => {
      // Load offers card
      const offerRadioButton = screen.getByLabelText('Offer');
      act(() => fireEvent.click(offerRadioButton));

      const offerInput = screen.getByTestId('address-input');
      const testOffer = 'LNO12345';
      act(() => fireEvent.change(offerInput, { target: { value: testOffer } }));
      expect(offerRadioButton).toBeChecked();
      expect(screen.queryByText('Invalid Offer')).not.toBeInTheDocument();
    });
  });
});
