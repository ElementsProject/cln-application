import { screen } from '@testing-library/react';
import { mockAppStore, mockBKPRSatsFlowEvents } from '../../../../utilities/test-utilities/mockData';
import { renderWithProviders } from '../../../../utilities/test-utilities/mockStore';
import SatsFlowGraph from './SatsFlowGraph';

describe('Sats Flow Graph component ', () => {
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

  it('should be in the document', async () => {
    await renderWithProviders(<SatsFlowGraph periods={mockBKPRSatsFlowEvents.periods} />, { preloadedState: mockAppStore, initialRoute: ['/bookkeeper/satsflow'] });
    expect(screen.getByTestId('sats-flow-graph')).not.toBeEmptyDOMElement();
  });
});
