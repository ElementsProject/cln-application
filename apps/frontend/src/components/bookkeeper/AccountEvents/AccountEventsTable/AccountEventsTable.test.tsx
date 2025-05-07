import { screen } from '@testing-library/react';
import { renderWithProviders } from '../../../../utilities/test-utilities/mockStore';
import { mockBKPRAccountEvents, mockAppStore } from '../../../../utilities/test-utilities/mockData';
import AccountEventsTable from './AccountEventsTable';

describe.skip('Account Events Table component ', () => {
  it('should be in the document', async () => {
    await renderWithProviders(<AccountEventsTable periods={mockBKPRAccountEvents.periods} />, { preloadedState: mockAppStore, initialRoute: ['/bookkeeper/accountevents'] });
    expect(screen.getByTestId('account-events-table-container')).not.toBeEmptyDOMElement();
  });
});
