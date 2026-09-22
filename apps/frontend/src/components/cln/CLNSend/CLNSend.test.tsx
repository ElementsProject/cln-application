import { fireEvent, screen, waitFor, act } from '@testing-library/react';
import { APP_ANIMATION_DURATION } from '../../../utilities/constants';
import { mockAppStore, mockFetchInvoice } from '../../../utilities/test-utilities/mockData';
import { spyOnCLNSendPayment, spyOnDecode } from '../../../utilities/test-utilities/mockService';
import { CLNService } from '../../../services/http.service';
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

  it('should not pay an offer invoice whose amount differs from the requested amount', async () => {
    spyOnDecode();
    jest.spyOn(CLNService, 'fetchInvoice').mockImplementation(async () => ({ ...mockFetchInvoice, changes: { amount_msat: 200000 } }));
    const sendPaymentSpy = spyOnCLNSendPayment();
    await renderWithProviders(<CLNSend />, { preloadedState: mockAppStore, initialRoute: ['/cln'] });
    await act(async () => jest.advanceTimersByTime(APP_ANIMATION_DURATION * 1000));

    fireEvent.click(screen.getByTestId('send-button'));
    await waitFor(() => {
      act(() => fireEvent.click(screen.getByLabelText('Offer')));
      act(() => fireEvent.change(screen.getByTestId('address-input'), { target: { value: 'lno12345' } }));
    });
    await waitFor(() => {
      expect(screen.getByTestId('amount-input')).toBeInTheDocument();
    });
    act(() => fireEvent.change(screen.getByTestId('amount-input'), { target: { value: '100' } }));
    await act(async () => fireEvent.submit(screen.getByTestId('cln-send')));

    await waitFor(() => {
      expect(screen.getByTestId('status-alert-message')).toHaveTextContent(/200 sats instead of 100 sats\. payment not sent/i);
    });
    expect(sendPaymentSpy).not.toHaveBeenCalled();
  });
});
