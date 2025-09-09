import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import moment from 'moment';
import { Provider } from 'react-redux';
import DataFilterOptions from './DataFilterOptions';
import { TimeGranularity } from '../../../utilities/constants';
import { createMockStore } from '../../../utilities/test-utilities/mockStore';
import { mockAppStore } from '../../../utilities/test-utilities/mockData';
import { spyOnBKPRGetSatsFlow } from '../../../utilities/test-utilities/mockService';

describe('DataFilterOptions', () => {
  const mockChangeHandler = jest.fn();
  const defaultProps = { filter: 'satsflow', onShowZeroActivityChange: mockChangeHandler };
  const renderComponent = async () => {
    const store = createMockStore('/', mockAppStore);
    const component = render(
      <Provider store={store}>
        <DataFilterOptions {...defaultProps} />
      </Provider>
    );
    const tgSelect = screen.getByTestId('time-granularity-selection')
    await act(async () => {
      fireEvent.click(tgSelect);
    });
    await screen.getByTestId('time-granularity-menu');
    await act(async () => {
      fireEvent.click(screen.getByTestId('time-granularity-' + TimeGranularity.DAILY));
    });
    return component;
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders all filter controls', async () => {
    await renderComponent();

    expect(screen.getByText('Time Granularity')).toBeInTheDocument();
    expect(screen.getByTestId('time-granularity-group')).toBeInTheDocument();
    expect(screen.getByTestId('time-granularity-selection')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Start')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('End')).toBeInTheDocument();
    expect(screen.getByLabelText('Show Zero Activity')).toBeInTheDocument();
  });

  test('initializes with default values', async () => {
    await renderComponent();

    expect(screen.getByTestId('selected-time-granularity')).toHaveTextContent(TimeGranularity.DAILY);
    expect(screen.getByDisplayValue(moment().subtract(1, 'month').add(1, 'day').format('DD MMM, YYYY'))).toBeInTheDocument();
    expect(screen.getByDisplayValue(moment().format('DD MMM, YYYY'))).toBeInTheDocument();
    expect(screen.getByLabelText('Show Zero Activity')).not.toBeChecked();
  });

  test('changes time granularity and fetches data', async () => {
    const mockGetSatsFlow = spyOnBKPRGetSatsFlow();
    await renderComponent();

    const tgSelect = screen.getByTestId('time-granularity-selection')
    await act(async () => {
      fireEvent.click(tgSelect);
    });
    await screen.getByTestId('time-granularity-menu');
    await act(async () => {
      fireEvent.click(screen.getByTestId('time-granularity-' + TimeGranularity.MONTHLY));
    });
    expect(screen.getByTestId('selected-time-granularity')).toHaveTextContent(TimeGranularity.MONTHLY);
    expect(mockGetSatsFlow).toHaveBeenCalledWith(
      expect.any(Number),
      expect.any(Number)
    );
  });

  test('toggles show zero activity checkbox', async () => {
    await renderComponent();

    const checkbox = screen.getByTestId('show-zero-activity');
    expect(checkbox).not.toBeChecked();
    fireEvent.click(checkbox);

    expect(checkbox).toBeChecked();
    expect(mockChangeHandler).toHaveBeenCalledTimes(1);
    expect(mockChangeHandler).toHaveBeenCalledWith(true); 

    fireEvent.click(checkbox);

    expect(checkbox).not.toBeChecked();
    expect(mockChangeHandler).toHaveBeenCalledTimes(2);
    expect(mockChangeHandler).toHaveBeenCalledWith(false); 
  });

  test('calls transformDataRange when authenticated and dates change', async () => {
    const mockGetSatsFlow = spyOnBKPRGetSatsFlow();
    await renderComponent();
    await waitFor(() => {
      expect(mockGetSatsFlow).toHaveBeenCalled();
    });
  });

  test('handles date range changes', async () => {
    const mockNow = new Date('2025-05-03T00:00:00Z');
    const mockFetchData = spyOnBKPRGetSatsFlow();
    await renderComponent();
  
    const now = moment(mockNow).startOf('day');
    const newStartDate = now.clone().subtract(2, 'months').startOf('day').toDate();
    const newEndDate = now.clone().subtract(1, 'months').endOf('day').toDate();
  
    const startDateInput = screen.getByPlaceholderText('Start');
    fireEvent.change(startDateInput, {
      target: { value: moment(newStartDate).format('DD MMM, YYYY') }
    });
  
    const endDateInput = screen.getByPlaceholderText('End');
    fireEvent.change(endDateInput, {
      target: { value: moment(newEndDate).format('DD MMM, YYYY') }
    });
  
    expect(mockFetchData).toHaveBeenLastCalledWith(
      Math.floor(newStartDate.getTime() / 1000),
      Math.floor(newEndDate.getTime() / 1000)
    );
  });

});
