import { fireEvent, screen, waitFor, within } from '@testing-library/react';
import { renderWithProviders } from '../../../../utilities/test-utilities/mockStore';
import { mockBKPRAccountEvents, mockAppStore } from '../../../../utilities/test-utilities/mockData';
import AccountEventsTable from './AccountEventsTable';

jest.mock('react-perfect-scrollbar', () => ({ children }) => <div>{children}</div>);

describe('Account Events Table component ', () => {
  beforeEach(() => {
    global.ResizeObserver = jest.fn().mockImplementation(() => ({
      observe: jest.fn(),
      unobserve: jest.fn(),
      disconnect: jest.fn(),
    }));
  });

  it('should render the dashboard container', async () => {
    await renderWithProviders(<AccountEventsTable periods={mockBKPRAccountEvents.periods} />, {
      preloadedState: mockAppStore,
      initialRoute: ['/bookkeeper/accountevents'],
    });
    expect(await screen.findByTestId('account-events-table-container')).toBeInTheDocument();
  });

  it('renders AccountEventsTable with correct data', async () => {
    await renderWithProviders(<AccountEventsTable periods={mockBKPRAccountEvents.periods} />, {
      preloadedState: mockAppStore,
      initialRoute: ['/bookkeeper/accountevents'],
      useRouter: false,
    });

    expect(screen.getByText('2025-04-20')).toBeInTheDocument();
    expect(screen.getAllByText('wallet')).toHaveLength(2); //short_channel_id and account
    expect(screen.getByText('n/a')).toBeInTheDocument();
  });

  it('should render all periods as expanded by default', async () => {
    await renderWithProviders(<AccountEventsTable periods={mockBKPRAccountEvents.periods} />, {
      preloadedState: mockAppStore,
      initialRoute: ['/bookkeeper/accountevents'],
      useRouter: false,
    });

    mockBKPRAccountEvents.periods.forEach(period => {
      expect(screen.getByText(period.period_key)).toBeInTheDocument();
      period.accounts.forEach(account => {
        expect(screen.getByText("Short Channel ID")).toBeInTheDocument();
        expect(screen.getByText(account.remote_alias)).toBeInTheDocument();
      });
    });
  });

  it('should collapse and expand a row on toggle click', async () => {
    await renderWithProviders(<AccountEventsTable periods={mockBKPRAccountEvents.periods} />, {
      preloadedState: mockAppStore,
      initialRoute: ['/bookkeeper/accountevents'],
      useRouter: false,
    });

    const periodKey = mockBKPRAccountEvents.periods[0].period_key;

    const periodRow = screen.getByText(periodKey).closest('tr');
    expect(periodRow).not.toBeNull();
    const toggleButton = within(periodRow!).getByRole('button');

    //check that the row is expanded
    await waitFor(() => {
      expect(screen.getByText('Short Channel ID')).toBeVisible();
    });

    //collapse
    fireEvent.click(toggleButton);

    await waitFor(() => {
      const content = screen.queryByText('Short Channel ID');
      expect(content).not.toBeVisible();
    });

    //expand
    fireEvent.click(toggleButton);

    await waitFor(() => {
      expect(screen.getByText('Short Channel ID')).toBeVisible();
    });
  });  

  it('should correctly render balance percentage values', async () => {
    await renderWithProviders(<AccountEventsTable periods={mockBKPRAccountEvents.periods} />, {
      preloadedState: mockAppStore,
      initialRoute: ['/bookkeeper/accountevents'],
      useRouter: false,
    });

    const { balance_msat } = mockBKPRAccountEvents.periods[0].accounts[0];
    const { total_balance_across_accounts } = mockBKPRAccountEvents.periods[0];
    const expectedPercentage =
      ((balance_msat / total_balance_across_accounts) * 100).toFixed(2) + '%';

    expect(screen.getByText(expectedPercentage)).toBeInTheDocument();
  });
});
