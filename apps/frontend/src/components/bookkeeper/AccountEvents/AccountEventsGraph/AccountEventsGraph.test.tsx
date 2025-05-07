import { screen } from '@testing-library/react';
import { renderWithProviders } from '../../../../utilities/test-utilities/mockStore';
import { mockBKPRAccountEvents, mockAppStore } from '../../../../utilities/test-utilities/mockData';
import AccountEventsGraph from './AccountEventsGraph';

describe('Account Events Graph component', () => {
  beforeEach(() => {
    class ResizeObserverMock {
      private callback: ResizeObserverCallback;
      constructor(callback: ResizeObserverCallback) {
        this.callback = callback;
      }
      observe = (target: Element) => {
        // Simulate dimensions
        this.callback(
          [
            {
              target,
              contentRect: {
                width: 500,
                height: 400,
                top: 0,
                left: 0,
                bottom: 400,
                right: 500,
                x: 0,
                y: 0,
                toJSON: () => {},
              },
            } as ResizeObserverEntry,
          ],
          this
        );
      };
      unobserve = jest.fn();
      disconnect = jest.fn();
    }
    global.ResizeObserver = ResizeObserverMock as unknown as typeof ResizeObserver;
    Object.defineProperty(HTMLElement.prototype, 'clientWidth', { configurable: true, value: 500 });
    Object.defineProperty(HTMLElement.prototype, 'clientHeight', { configurable: true, value: 400 });
  });

  it('should render the graph container', async () => {
    await renderWithProviders(
      <AccountEventsGraph periods={mockBKPRAccountEvents.periods} />,
      { preloadedState: mockAppStore, initialRoute: ['/bookkeeper/accountevents'] }
    );
    expect(screen.getByTestId('account-events-graph')).toBeInTheDocument();
  });

  it('should render the correct number of bars based on account names', async () => {
    await renderWithProviders( <AccountEventsGraph periods={mockBKPRAccountEvents.periods} />,
      { preloadedState: mockAppStore, initialRoute: ['/bookkeeper/accountevents'] }
    );
    const svg = screen.getByTestId('account-events-graph').querySelector('svg');
    const bars = svg?.querySelectorAll('rect');
    expect(bars?.length).toBeGreaterThan(0);
  });

  it('should render XAxis and YAxis labels formatted correctly', async () => {
    await renderWithProviders(
      <AccountEventsGraph periods={mockBKPRAccountEvents.periods} />,
      { preloadedState: mockAppStore, initialRoute: ['/bookkeeper/accountevents'] }
    );
    const rechartsWrapper = screen.getByTestId('account-events-graph');
    const svg = rechartsWrapper.querySelector('svg');
    const ticksGroup = svg?.querySelector('g.recharts-cartesian-axis-ticks');
    expect(ticksGroup).toBeInTheDocument();
    const tickTexts = ticksGroup?.querySelectorAll('text');
    expect(tickTexts?.length).toBeGreaterThan(0);
    const tickValues = Array.from(tickTexts || []).map(tick => tick.textContent);
    expect(tickValues).toContain(mockBKPRAccountEvents.periods[0].period_key);
  });

});
