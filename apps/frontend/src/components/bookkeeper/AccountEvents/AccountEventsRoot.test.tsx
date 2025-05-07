import { screen } from '@testing-library/react';
import { mockAppStore } from '../../../utilities/test-utilities/mockData';
import { spyOnBKPRGetAccountEvents, spyOnBKPRGetSatsFlow, spyOnBKPRGetVolume } from '../../../utilities/test-utilities/mockService';
import { renderWithProviders } from '../../../utilities/test-utilities/mockStore';
import AccountEventsRoot from './AccountEventsRoot';

describe('Account Events component', () => {
  beforeEach(() => {
    global.ResizeObserver = jest.fn().mockImplementation(() => ({
      observe: jest.fn(),
      unobserve: jest.fn(),
      disconnect: jest.fn(),
    }));
  });

  it('should be in the document', async () => {
    spyOnBKPRGetAccountEvents();
    spyOnBKPRGetSatsFlow();
    spyOnBKPRGetVolume();
    await renderWithProviders(<AccountEventsRoot />, { preloadedState: mockAppStore, initialRoute: ['/bookkeeper/accountevents'] });
    expect(screen.getByTestId('account-events-container')).not.toBeEmptyDOMElement();
  });
});
