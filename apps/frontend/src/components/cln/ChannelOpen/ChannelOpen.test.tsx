import { act, fireEvent, screen, waitFor } from '@testing-library/react';
import { CLNService } from '../../../services/http.service';
import { mockAppStore } from '../../../utilities/test-utilities/mockData';
import { renderWithProviders } from '../../../utilities/test-utilities/mockStore';
import ChannelOpen from './ChannelOpen';

const mockOnClose = jest.fn();

const renderChannelOpen = async () => {
  await act(async () => {
    renderWithProviders(<ChannelOpen onClose={mockOnClose} />, {
      preloadedState: mockAppStore,
      initialRoute: ['/cln'],
    });
  });

  const openChannelBtn = await screen.findByTestId('button-open-channel');
  await act(async () => {
    fireEvent.click(openChannelBtn);
  });

  await waitFor(() => {
    expect(screen.getByTestId('channel-open-card')).toBeInTheDocument();
  });
};

describe('ChannelOpen component', () => {
  beforeEach(async () => {
    jest.useFakeTimers({ advanceTimers: true });
    await renderChannelOpen();
  });

  afterEach(() => {
    mockOnClose.mockClear();
    jest.clearAllTimers();
    jest.useRealTimers();
  });
  
  it('should be in the document', async () => {
    expect(screen.getByTestId('channel-open-card')).toBeInTheDocument();
    expect(screen.getByTestId('pubkey')).toBeInTheDocument();
    expect(screen.getByTestId('amount')).toBeInTheDocument();
    expect(screen.getByTestId('show-custom-fee-rate')).toBeInTheDocument();
    expect(screen.getByTestId('show-custom-fee-rate')).not.toBeChecked();
  });

  it('should render the FeerateRange slider by default (custom fee rate hidden)', async () => {
    await waitFor(() => {
      expect(screen.getByTestId('pubkey')).toBeInTheDocument();
      expect(screen.getByTestId('feerate-range')).toBeInTheDocument();
    });
    expect(screen.queryByTestId('fee-rate-input')).not.toBeInTheDocument();
    expect(screen.queryByTestId('fee-rate-unit')).not.toBeInTheDocument();
  });

  it('should render the Announce toggle defaulting to on', () => {
    const switchEl = document.querySelector('.switch');
    expect(switchEl).toBeInTheDocument();
    expect(switchEl).toHaveAttribute('data-isswitchon', 'true');
  });

  it('should render the Open Channel submit button', () => {
    const submitBtn = screen.getByTestId('button-open-channel-submit');
    expect(submitBtn).toBeInTheDocument();
    expect(submitBtn).not.toBeDisabled();
    expect(submitBtn).toHaveTextContent('Open Channel');
  });

  it('should not submit and show no errors before form is touched', async () => {
    const mockOpenChannel = jest.spyOn(CLNService, 'openChannel').mockResolvedValue({ channel_id: 'abc123' });

    await act(async () => {
      fireEvent.click(screen.getByTestId('button-open-channel-submit'));
    });

    expect(mockOpenChannel).not.toHaveBeenCalled();
    mockOpenChannel.mockRestore();
  });

  it('should show invalid pubkey error when pubkey field is blurred with invalid value', async () => {
    fireEvent.change(screen.getByTestId('pubkey'), { target: { value: 'invalidpubkey' } });
    fireEvent.blur(screen.getByTestId('pubkey'));

    await waitFor(() => {
      expect(screen.getByText('Invalid Node ID')).toBeInTheDocument();
    });
  });

  it('should not show pubkey error when pubkey is valid', async () => {
    fireEvent.change(screen.getByTestId('pubkey'), { target: { value: 'pubkey@host:port' } });
    fireEvent.blur(screen.getByTestId('pubkey'));

    await waitFor(() => {
      expect(screen.queryByText('Invalid Node ID')).not.toBeInTheDocument();
    });
  });

  it('should show invalid amount error when amount is 0', async () => {
    fireEvent.change(screen.getByTestId('amount'), { target: { value: '0' } });
    fireEvent.blur(screen.getByTestId('amount'));

    await waitFor(() => {
      expect(screen.getByText('Amount should be greater than 0')).toBeInTheDocument();
    });
  });

  it('should show invalid fee rate error when custom fee rate is 0', async () => {
    await act(async () => {
      fireEvent.click(screen.getByTestId('show-custom-fee-rate'));
    });

    const feeRateInput = await screen.findByTestId('fee-rate-input');
    fireEvent.change(feeRateInput, { target: { value: '0' } });
    fireEvent.blur(feeRateInput);

    await waitFor(() => {
      expect(screen.getByText('Fee Rate should be greater than 0')).toBeInTheDocument();
    });
  });

  it('should toggle Announce off when switch is clicked', async () => {
    const switchEl = document.querySelector('.switch') as HTMLElement;
    expect(switchEl).toHaveAttribute('data-isswitchon', 'true');

    await act(async () => { fireEvent.click(switchEl); });

    await waitFor(() => {
      expect(switchEl).toHaveAttribute('data-isswitchon', 'false');
    });
  });

  it('should toggle Announce back on when switch is clicked twice', async () => {
    const switchEl = document.querySelector('.switch') as HTMLElement;

    await act(async () => { fireEvent.click(switchEl); });
    await act(async () => { fireEvent.click(switchEl); });

    await waitFor(() => {
      expect(switchEl).toHaveAttribute('data-isswitchon', 'true');
    });
  });

  it('should pass announce=false to openChannel when toggle is off', async () => {
    const mockOpenChannel = jest.spyOn(CLNService, 'openChannel').mockResolvedValue({ channel_id: 'abc123' });

    const switchEl = document.querySelector('.switch') as HTMLElement;
    await act(async () => { fireEvent.click(switchEl); });

    fireEvent.change(screen.getByTestId('pubkey'), { target: { value: 'pubkey@host:port' } });
    fireEvent.change(screen.getByTestId('amount'), { target: { value: '100000' } });

    await act(async () => {
      fireEvent.click(screen.getByTestId('button-open-channel-submit'));
    });

    await waitFor(() => {
      expect(mockOpenChannel).toHaveBeenCalledWith('pubkey@host:port', 100000, 'normal', false);
    });

    mockOpenChannel.mockRestore();
  });

  it('should show custom fee rate input when checkbox is checked', async () => {
    const customFeeRateCheckbox = screen.getByTestId('show-custom-fee-rate');
    expect(customFeeRateCheckbox).not.toBeChecked();

    await act(async () => {
      fireEvent.click(customFeeRateCheckbox);
    });

    await waitFor(() => {
      expect(customFeeRateCheckbox).toBeChecked();
      expect(screen.getByTestId('fee-rate-input')).toBeInTheDocument();
      expect(screen.getByTestId('fee-rate-unit')).toHaveTextContent('Sat/vB');
    });
  });

  it('should hide custom fee rate input and show slider when checkbox is unchecked again', async () => {
    const checkbox = screen.getByTestId('show-custom-fee-rate');

    await act(async () => { fireEvent.click(checkbox); });
    await waitFor(() => expect(screen.getByTestId('fee-rate-input')).toBeInTheDocument());

    await act(async () => { fireEvent.click(checkbox); });
    await waitFor(() => {
      expect(screen.queryByTestId('fee-rate-input')).not.toBeInTheDocument();
      expect(screen.getByTestId('feerate-range')).toBeInTheDocument();
    });
  });

  it('should use custom fee rate value suffixed with perkw on submit', async () => {
    const mockOpenChannel = jest.spyOn(CLNService, 'openChannel').mockResolvedValue({ channel_id: 'abc123' });

    fireEvent.change(screen.getByTestId('pubkey'), { target: { value: 'pubkey@host:port' } });
    fireEvent.change(screen.getByTestId('amount'), { target: { value: '100000' } });

    await act(async () => {
      fireEvent.click(screen.getByTestId('show-custom-fee-rate'));
    });

    const feeRateInput = await screen.findByTestId('fee-rate-input');
    fireEvent.change(feeRateInput, { target: { value: '500' } });

    await act(async () => {
      fireEvent.click(screen.getByTestId('button-open-channel-submit'));
    });

    await waitFor(() => {
      expect(mockOpenChannel).toHaveBeenCalledWith('pubkey@host:port', 100000, '500perkw', true);
    });

    mockOpenChannel.mockRestore();
  });

  it('should use slider fee rate when custom fee rate checkbox is unchecked', async () => {
    const mockOpenChannel = jest.spyOn(CLNService, 'openChannel').mockResolvedValue({ channel_id: 'abc123' });

    fireEvent.change(screen.getByTestId('pubkey'), { target: { value: 'pubkey@host:port' } });
    fireEvent.change(screen.getByTestId('amount'), { target: { value: '100000' } });

    await act(async () => {
      fireEvent.click(screen.getByTestId('button-open-channel-submit'));
    });

    await waitFor(() => {
      expect(mockOpenChannel).toHaveBeenCalledWith('pubkey@host:port', 100000, 'normal', true);
    });

    mockOpenChannel.mockRestore();
  });

  it('should disable submit button while submission is pending', async () => {
    jest.spyOn(CLNService, 'openChannel').mockImplementation(
      () => new Promise(() => {})
    );

    fireEvent.change(screen.getByTestId('pubkey'), { target: { value: 'pubkey@host:port' } });
    fireEvent.change(screen.getByTestId('amount'), { target: { value: '100000' } });

    await act(async () => {
      fireEvent.click(screen.getByTestId('button-open-channel-submit'));
    });

    await waitFor(() => {
      expect(screen.getByTestId('button-open-channel-submit')).toBeDisabled();
    });
  });

  it('should show success message after channel is opened', async () => {
    jest.spyOn(CLNService, 'openChannel').mockResolvedValue({ channel_id: 'abc123' });

    fireEvent.change(screen.getByTestId('pubkey'), { target: { value: 'pubkey@host:port' } });
    fireEvent.change(screen.getByTestId('amount'), { target: { value: '100000' } });

    await act(async () => {
      fireEvent.click(screen.getByTestId('button-open-channel-submit'));
    });

    await waitFor(() => {
      expect(screen.getByText(/channel opened with channel id abc123/i)).toBeInTheDocument();
    });
  });

  it('should show error message when openChannel fails', async () => {
    jest.spyOn(CLNService, 'openChannel').mockRejectedValue('Connection refused');

    fireEvent.change(screen.getByTestId('pubkey'), { target: { value: 'pubkey@host:port' } });
    fireEvent.change(screen.getByTestId('amount'), { target: { value: '100000' } });

    await act(async () => {
      fireEvent.click(screen.getByTestId('button-open-channel-submit'));
    });

    await waitFor(() => {
      expect(screen.getByText(/connection refused/i)).toBeInTheDocument();
    });
  });
});

describe('openChannel fee rate argument', () => {
  beforeEach(async () => {
    jest.useFakeTimers({ advanceTimers: true });
    await renderChannelOpen();
  });

  afterEach(() => {
    mockOnClose.mockClear();
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  const fillRequiredFields = () => {
    fireEvent.change(screen.getByTestId('pubkey'), { target: { value: 'pubkey@host:port' } });
    fireEvent.change(screen.getByTestId('amount'), { target: { value: '100000' } });
  };

  describe('when showCustomFeeRate is false (default)', () => {
    it('should call openChannel with selFeeRate "normal" by default', async () => {
      const mockOpenChannel = jest.spyOn(CLNService, 'openChannel').mockResolvedValue({ channel_id: 'abc123' });
      fillRequiredFields();

      await act(async () => {
        fireEvent.click(screen.getByTestId('button-open-channel-submit'));
      });

      await waitFor(() => {
        expect(mockOpenChannel).toHaveBeenCalledWith('pubkey@host:port', 100000, 'normal', true);
      });
      mockOpenChannel.mockRestore();
    });

    it('should call openChannel with selFeeRate "slow" when slider is set to slow', async () => {
      const mockOpenChannel = jest.spyOn(CLNService, 'openChannel').mockResolvedValue({ channel_id: 'abc123' });
      fillRequiredFields();

      fireEvent.change(screen.getByTestId('feerate-range'), { target: { value: '0' } });

      await act(async () => {
        fireEvent.click(screen.getByTestId('button-open-channel-submit'));
      });

      await waitFor(() => {
        expect(mockOpenChannel).toHaveBeenCalledWith('pubkey@host:port', 100000, 'slow', true);
      });
      mockOpenChannel.mockRestore();
    });

    it('should call openChannel with selFeeRate "urgent" when slider is set to urgent', async () => {
      const mockOpenChannel = jest.spyOn(CLNService, 'openChannel').mockResolvedValue({ channel_id: 'abc123' });
      fillRequiredFields();

      fireEvent.change(screen.getByTestId('feerate-range'), { target: { value: '2' } });

      await act(async () => {
        fireEvent.click(screen.getByTestId('button-open-channel-submit'));
      });

      await waitFor(() => {
        expect(mockOpenChannel).toHaveBeenCalledWith('pubkey@host:port', 100000, 'urgent', true);
      });
      mockOpenChannel.mockRestore();
    });
  });

  describe('when showCustomFeeRate is true', () => {
    it('should call openChannel with feeRateValue + "perkw"', async () => {
      const mockOpenChannel = jest.spyOn(CLNService, 'openChannel').mockResolvedValue({ channel_id: 'abc123' });
      fillRequiredFields();

      await act(async () => {
        fireEvent.click(screen.getByTestId('show-custom-fee-rate'));
      });

      const feeRateInput = await screen.findByTestId('fee-rate-input');
      fireEvent.change(feeRateInput, { target: { value: '500' } });

      await act(async () => {
        fireEvent.click(screen.getByTestId('button-open-channel-submit'));
      });

      await waitFor(() => {
        expect(mockOpenChannel).toHaveBeenCalledWith('pubkey@host:port', 100000, '500perkw', true);
      });
      mockOpenChannel.mockRestore();
    });

    it('should not call openChannel if custom fee rate value is empty', async () => {
      const mockOpenChannel = jest.spyOn(CLNService, 'openChannel').mockResolvedValue({ channel_id: 'abc123' });
      fillRequiredFields();

      await act(async () => {
        fireEvent.click(screen.getByTestId('show-custom-fee-rate'));
      });

      await act(async () => {
        fireEvent.click(screen.getByTestId('button-open-channel-submit'));
      });

      expect(mockOpenChannel).not.toHaveBeenCalled();
      mockOpenChannel.mockRestore();
    });

    it('should not use selFeeRate when showCustomFeeRate is true', async () => {
      const mockOpenChannel = jest.spyOn(CLNService, 'openChannel').mockResolvedValue({ channel_id: 'abc123' });
      fillRequiredFields();

      fireEvent.change(screen.getByTestId('feerate-range'), { target: { value: '2' } });

      await act(async () => {
        fireEvent.click(screen.getByTestId('show-custom-fee-rate'));
      });

      const feeRateInput = await screen.findByTestId('fee-rate-input');
      fireEvent.change(feeRateInput, { target: { value: '300' } });

      await act(async () => {
        fireEvent.click(screen.getByTestId('button-open-channel-submit'));
      });

      await waitFor(() => {
        expect(mockOpenChannel).toHaveBeenCalledWith('pubkey@host:port', 100000, '300perkw', true);
        expect(mockOpenChannel).not.toHaveBeenCalledWith(expect.anything(), expect.anything(), 'urgent', expect.anything());
      });
      mockOpenChannel.mockRestore();
    });
  });
});
