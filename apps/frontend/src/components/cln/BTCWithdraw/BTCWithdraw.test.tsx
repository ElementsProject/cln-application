import { act, fireEvent, screen, waitFor } from '@testing-library/react';
import { CLNService } from '../../../services/http.service';
import { mockAppStore } from '../../../utilities/test-utilities/mockData';
import { renderWithProviders } from '../../../utilities/test-utilities/mockStore';
import BTCWithdraw from './BTCWithdraw';

const mockOnClose = jest.fn();

const renderBTCWithdraw = async () => {
  await act(async () => {
    renderWithProviders(<BTCWithdraw onClose={mockOnClose} />, {
      preloadedState: mockAppStore,
      initialRoute: ['/cln'],
    });
  });

  const withdrawBtn = await screen.findByTestId('withdraw-button');
  await act(async () => {
    fireEvent.click(withdrawBtn);
  });

  await waitFor(() => {
    expect(screen.getByTestId('btc-withdraw-card')).toBeInTheDocument();
  });
};

describe('BTCWithdraw component', () => {

  beforeEach(async () => {
    jest.useFakeTimers({ advanceTimers: true });
    await renderBTCWithdraw();
  });

  afterEach(() => {
    mockOnClose.mockClear();
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  it('should render the withdraw card with all fields', () => {
    expect(screen.getByTestId('btc-withdraw-card')).toBeInTheDocument();
    expect(screen.getByLabelText('amount')).toBeInTheDocument();
    expect(screen.getByLabelText('address')).toBeInTheDocument();
    expect(screen.getByTestId('show-custom-fee-rate')).toBeInTheDocument();
    expect(screen.getByTestId('show-custom-fee-rate')).not.toBeChecked();
    expect(screen.getByTestId('button-withdraw')).toBeInTheDocument();
    expect(screen.getByTestId('button-withdraw')).not.toBeDisabled();
  });

  it('should render the FeerateRange slider by default with no custom fee rate input', async () => {
    await waitFor(() => {
      expect(screen.getByTestId('feerate-range')).toBeInTheDocument();
    });
    expect(screen.queryByLabelText('feeRate')).not.toBeInTheDocument();
    expect(screen.queryByTestId('fee-rate-unit')).not.toBeInTheDocument();
  });

  it('should show custom fee rate input when checkbox is checked', async () => {
    const checkbox = screen.getByTestId('show-custom-fee-rate');
    expect(checkbox).not.toBeChecked();

    await act(async () => {
      fireEvent.click(checkbox);
    });

    await waitFor(() => {
      expect(checkbox).toBeChecked();
      expect(screen.getByLabelText('feeRate')).toBeInTheDocument();
      expect(screen.getByTestId('fee-rate-unit')).toHaveTextContent('Sat/vB');
    });
  });

  it('should hide custom fee rate input and show slider when checkbox is unchecked again', async () => {
    const checkbox = screen.getByTestId('show-custom-fee-rate');

    await act(async () => { fireEvent.click(checkbox); });
    await waitFor(() => expect(screen.getByLabelText('feeRate')).toBeInTheDocument());

    await act(async () => { fireEvent.click(checkbox); });
    await waitFor(() => {
      expect(screen.queryByLabelText('feeRate')).not.toBeInTheDocument();
      expect(screen.getByTestId('feerate-range')).toBeInTheDocument();
    });
  });

  it('should not submit when form is empty', async () => {
    const mockBtcWithdraw = jest.spyOn(CLNService, 'btcWithdraw').mockResolvedValue({ txid: 'tx123' });

    await act(async () => {
      fireEvent.click(screen.getByTestId('button-withdraw'));
    });

    expect(mockBtcWithdraw).not.toHaveBeenCalled();
    mockBtcWithdraw.mockRestore();
  });

  it('should show invalid address error when address is blurred empty', async () => {
    fireEvent.change(screen.getByLabelText('address'), { target: { value: '' } });
    fireEvent.blur(screen.getByLabelText('address'));

    await waitFor(() => {
      expect(screen.getByText('Invalid Address')).toBeInTheDocument();
    });
  });

  it('should show invalid amount error when amount is 0', async () => {
    fireEvent.change(screen.getByLabelText('amount'), { target: { value: '0' } });
    fireEvent.blur(screen.getByLabelText('amount'));

    await waitFor(() => {
      expect(screen.getByText('Amount should be greater than 0')).toBeInTheDocument();
    });
  });

  it('should show invalid fee rate error when custom fee rate is 0', async () => {
    await act(async () => {
      fireEvent.click(screen.getByTestId('show-custom-fee-rate'));
    });

    const feeRateInput = await screen.findByLabelText('feeRate');
    fireEvent.change(feeRateInput, { target: { value: '0' } });
    fireEvent.blur(feeRateInput);

    await waitFor(() => {
      expect(screen.getByText('Fee Rate should be greater than 0')).toBeInTheDocument();
    });
  });

  it('should set amount to "All" when Send All is clicked', async () => {
    await act(async () => {
      fireEvent.click(screen.getByText('Send All'));
    });

    await waitFor(() => {
      expect(screen.getByLabelText('amount')).toHaveValue('All');
      expect(screen.getByLabelText('amount')).toBeDisabled();
    });
  });

  it('should clear amount when the close button on Send All is clicked', async () => {
    await act(async () => {
      fireEvent.click(screen.getByText('Send All'));
    });

    await waitFor(() => expect(screen.getByLabelText('amount')).toHaveValue('All'));

    await act(async () => {
      fireEvent.click(document.querySelector('.btn-addon-close') as HTMLElement);
    });

    await waitFor(() => {
      expect(screen.getByLabelText('amount')).toHaveValue(null);
    });
  });

  it('should disable submit button while submission is pending', async () => {
    jest.spyOn(CLNService, 'btcWithdraw').mockImplementation(() => new Promise(() => {}));

    fireEvent.change(screen.getByLabelText('amount'), { target: { value: '100000' } });
    fireEvent.change(screen.getByLabelText('address'), { target: { value: 'bc1qaddress' } });

    await act(async () => {
      fireEvent.click(screen.getByTestId('button-withdraw'));
    });

    await waitFor(() => {
      expect(screen.getByTestId('button-withdraw')).toBeDisabled();
    });
  });

  it('should show success message after withdraw', async () => {
    jest.spyOn(CLNService, 'btcWithdraw').mockResolvedValue({ txid: 'tx123' });

    fireEvent.change(screen.getByLabelText('amount'), { target: { value: '100000' } });
    fireEvent.change(screen.getByLabelText('address'), { target: { value: 'bc1qaddress' } });

    await act(async () => {
      fireEvent.click(screen.getByTestId('button-withdraw'));
    });

    await waitFor(() => {
      expect(screen.getByText(/transaction sent with transaction id tx123/i)).toBeInTheDocument();
    });
  });

  it('should show error message when btcWithdraw fails', async () => {
    jest.spyOn(CLNService, 'btcWithdraw').mockRejectedValue('Insufficient funds');

    fireEvent.change(screen.getByLabelText('amount'), { target: { value: '100000' } });
    fireEvent.change(screen.getByLabelText('address'), { target: { value: 'bc1qaddress' } });

    await act(async () => {
      fireEvent.click(screen.getByTestId('button-withdraw'));
    });

    await waitFor(() => {
      expect(screen.getByTestId('status-alert-message')).toHaveTextContent('Insufficient Funds');
    });
  });

  describe('btcWithdraw fee rate argument', () => {
    const fillRequiredFields = () => {
      fireEvent.change(screen.getByLabelText('amount'), { target: { value: '100000' } });
      fireEvent.change(screen.getByLabelText('address'), { target: { value: 'bc1qaddress' } });
    };

    describe('when showCustomFeeRate is false (default)', () => {
      it('should call btcWithdraw with selFeeRate "normal" by default', async () => {
        const mockBtcWithdraw = jest.spyOn(CLNService, 'btcWithdraw').mockResolvedValue({ txid: 'tx123' });
        fillRequiredFields();

        await act(async () => {
          fireEvent.click(screen.getByTestId('button-withdraw'));
        });

        await waitFor(() => {
          expect(mockBtcWithdraw).toHaveBeenCalledWith('bc1qaddress', '100000', 'normal');
        });
        mockBtcWithdraw.mockRestore();
      });

      it('should call btcWithdraw with selFeeRate "slow" when slider is set to slow', async () => {
        const mockBtcWithdraw = jest.spyOn(CLNService, 'btcWithdraw').mockResolvedValue({ txid: 'tx123' });
        fillRequiredFields();

        fireEvent.change(screen.getByTestId('feerate-range'), { target: { value: '0' } });

        await act(async () => {
          fireEvent.click(screen.getByTestId('button-withdraw'));
        });

        await waitFor(() => {
          expect(mockBtcWithdraw).toHaveBeenCalledWith('bc1qaddress', '100000', 'slow');
        });
        mockBtcWithdraw.mockRestore();
      });

      it('should call btcWithdraw with selFeeRate "urgent" when slider is set to urgent', async () => {
        const mockBtcWithdraw = jest.spyOn(CLNService, 'btcWithdraw').mockResolvedValue({ txid: 'tx123' });
        fillRequiredFields();

        fireEvent.change(screen.getByTestId('feerate-range'), { target: { value: '2' } });

        await act(async () => {
          fireEvent.click(screen.getByTestId('button-withdraw'));
        });

        await waitFor(() => {
          expect(mockBtcWithdraw).toHaveBeenCalledWith('bc1qaddress', '100000', 'urgent');
        });
        mockBtcWithdraw.mockRestore();
      });
    });

    describe('when showCustomFeeRate is true', () => {
      it('should call btcWithdraw with feeRateValue + "perkw"', async () => {
        const mockBtcWithdraw = jest.spyOn(CLNService, 'btcWithdraw').mockResolvedValue({ txid: 'tx123' });
        fillRequiredFields();

        await act(async () => {
          fireEvent.click(screen.getByTestId('show-custom-fee-rate'));
        });

        const feeRateInput = await screen.findByLabelText('feeRate');
        fireEvent.change(feeRateInput, { target: { value: '500' } });

        await act(async () => {
          fireEvent.click(screen.getByTestId('button-withdraw'));
        });

        await waitFor(() => {
          expect(mockBtcWithdraw).toHaveBeenCalledWith('bc1qaddress', '100000', '500perkw');
        });
        mockBtcWithdraw.mockRestore();
      });

      it('should not call btcWithdraw if custom fee rate value is empty', async () => {
        const mockBtcWithdraw = jest.spyOn(CLNService, 'btcWithdraw').mockResolvedValue({ txid: 'tx123' });
        fillRequiredFields();

        await act(async () => {
          fireEvent.click(screen.getByTestId('show-custom-fee-rate'));
        });

        await act(async () => {
          fireEvent.click(screen.getByTestId('button-withdraw'));
        });

        expect(mockBtcWithdraw).not.toHaveBeenCalled();
        mockBtcWithdraw.mockRestore();
      });

      it('should not use selFeeRate when showCustomFeeRate is true', async () => {
        const mockBtcWithdraw = jest.spyOn(CLNService, 'btcWithdraw').mockResolvedValue({ txid: 'tx123' });
        fillRequiredFields();

        fireEvent.change(screen.getByTestId('feerate-range'), { target: { value: '2' } });

        await act(async () => {
          fireEvent.click(screen.getByTestId('show-custom-fee-rate'));
        });

        const feeRateInput = await screen.findByLabelText('feeRate');
        fireEvent.change(feeRateInput, { target: { value: '300' } });

        await act(async () => {
          fireEvent.click(screen.getByTestId('button-withdraw'));
        });

        await waitFor(() => {
          expect(mockBtcWithdraw).toHaveBeenCalledWith('bc1qaddress', '100000', '300perkw');
          expect(mockBtcWithdraw).not.toHaveBeenCalledWith(expect.anything(), expect.anything(), 'urgent');
        });
        mockBtcWithdraw.mockRestore();
      });
    });
  });
});
