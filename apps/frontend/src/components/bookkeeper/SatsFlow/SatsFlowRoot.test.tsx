import { screen } from '@testing-library/react';
import { mockAppStore } from '../../../utilities/test-utilities/mockData';
import { renderWithProviders } from '../../../utilities/test-utilities/mockStore';
import SatsFlowRoot from './SatsFlowRoot';

describe('Sats Flow component ', () => {
  beforeEach(() => {
    global.ResizeObserver = jest.fn().mockImplementation(() => ({
      observe: jest.fn(),
      unobserve: jest.fn(),
      disconnect: jest.fn(),
    }));
  });

  it('should be in the document', async () => {
    await renderWithProviders(<SatsFlowRoot />, { preloadedState: mockAppStore, initialRoute: ['/bookkeeper/satsflow'] });
    expect(screen.getByTestId('satsflow-container')).not.toBeEmptyDOMElement();
  });
});
