import { fireEvent, screen, waitFor, within, act } from '@testing-library/react';
import { renderWithProviders } from '../../../../utilities/test-utilities/mockStore';
import { mockBKPRAccountEvents, mockAppStore } from '../../../../utilities/test-utilities/mockData';
import AccountEventsTable from './AccountEventsTable';

jest.mock('react-perfect-scrollbar', () => ({ children }: any) => <div>{children}</div>);

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
    expect(await screen.findByTestId('account-events-table')).toBeInTheDocument();
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

    // Verify expanded content is in the document (even if animation hasn't completed)
    await waitFor(() => {
      const expandedHeaders = screen.getAllByText('Short Channel ID');
      expect(expandedHeaders.length).toBeGreaterThan(0);
      expect(expandedHeaders[0]).toBeInTheDocument();
    });

    // Collapse
    await act(async () => {
      fireEvent.click(toggleButton);
      jest.advanceTimersByTime(1000);
    });

    // After collapse, the child row should have collapsed styling or be removed
    await waitFor(() => {
      const childRows = document.querySelectorAll('.expandable-child-row');
      if (childRows.length > 0) {
        const childRow = childRows[0] as HTMLElement;
        // Check if row is collapsed (has collapsed class or opacity 0)
        const styles = window.getComputedStyle(childRow);
        const isCollapsed = styles.opacity === '0' || childRow.style.opacity === '0';
        expect(isCollapsed).toBe(true);
      }
    });

    // Expand again
    await act(async () => {
      fireEvent.click(toggleButton);
      jest.advanceTimersByTime(1000);
    });

    // Verify content is back in document
    await waitFor(() => {
      const expandedHeaders = screen.getAllByText('Short Channel ID');
      expect(expandedHeaders[0]).toBeInTheDocument();
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
