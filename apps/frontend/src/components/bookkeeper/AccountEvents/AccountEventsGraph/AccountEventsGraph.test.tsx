import { screen } from '@testing-library/react';
import { renderWithProviders } from '../../../../utilities/test-utilities/mockStore';
import { mockBKPRAccountEvents, mockAppStore } from '../../../../utilities/test-utilities/mockData';
import AccountEventsGraph from './AccountEventsGraph';

// Mock ResizeObserver which Recharts uses
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

jest.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: any) => <div className="recharts-wrapper">{children}</div>,
  BarChart: ({ children, data }: any) => (
    <div data-testid="bar-chart" data-item-count={data?.length}>
      {children}
    </div>
  ),
  Bar: ({ dataKey }: any) => <div data-testid={`bar-${dataKey}`} />,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  CartesianGrid: () => <div data-testid="cartesian-grid" />,
  Tooltip: () => <div data-testid="tooltip" />,
  Legend: () => <div data-testid="legend" />,
}));

describe('Account Events Graph component', () => {
  it('should render the graph container', async () => {
    await renderWithProviders(
      <AccountEventsGraph periods={mockBKPRAccountEvents.periods} />,
      {
        preloadedState: mockAppStore,
        initialRoute: ['/bookkeeper/accountevents'],
        useRouter: false,
      }
    );
    
    expect(screen.getByTestId('account-events-graph')).toBeInTheDocument();
  });

  it('should render the chart components', async () => {
    await renderWithProviders(
      <AccountEventsGraph periods={mockBKPRAccountEvents.periods} />,
      {
        preloadedState: mockAppStore,
        initialRoute: ['/bookkeeper/accountevents'],
        useRouter: false,
      }
    );

    // Verify the mocked Recharts components are rendered
    expect(screen.getByTestId('account-events-graph')).toBeInTheDocument();
    expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
    expect(screen.getByTestId('x-axis')).toBeInTheDocument();
    expect(screen.getByTestId('y-axis')).toBeInTheDocument();
    expect(screen.getByTestId('cartesian-grid')).toBeInTheDocument();
    expect(screen.getByTestId('tooltip')).toBeInTheDocument();
    expect(screen.getByTestId('legend')).toBeInTheDocument();
  });

  it('should render bars for each account', async () => {
    await renderWithProviders(
      <AccountEventsGraph periods={mockBKPRAccountEvents.periods} />,
      {
        preloadedState: mockAppStore,
        initialRoute: ['/bookkeeper/accountevents'],
        useRouter: false,
      }
    );

    // Get unique account names from mock data to verify bars are created
    const uniqueAccounts = Array.from(
      new Set(
        mockBKPRAccountEvents.periods.flatMap(period =>
          period.accounts.map(account => account.account)
        )
      )
    );

    // Verify a bar is rendered for each unique account
    uniqueAccounts.forEach(accountName => {
      expect(screen.getByTestId(`bar-${accountName}`)).toBeInTheDocument();
    });
  });

  it('should pass correct data to BarChart', async () => {
    await renderWithProviders(
      <AccountEventsGraph periods={mockBKPRAccountEvents.periods} />,
      {
        preloadedState: mockAppStore,
        initialRoute: ['/bookkeeper/accountevents'],
        useRouter: false,
      }
    );

    const barChart = screen.getByTestId('bar-chart');
    expect(barChart).toBeInTheDocument();
    
    // Verify data is passed (number of periods)
    const itemCount = barChart.getAttribute('data-item-count');
    expect(itemCount).toBe(String(mockBKPRAccountEvents.periods.length));
  });
});
