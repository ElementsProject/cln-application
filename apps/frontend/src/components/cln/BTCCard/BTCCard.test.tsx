import { screen } from '@testing-library/react';
import { mockAppStore } from '../../../utilities/test-utilities/mockData';
import { renderWithProviders } from '../../../utilities/test-utilities/mockStore';
import BTCCard from './BTCCard';

describe('BTCCard component ', () => {
  it('should be in the document', async () => {
    await renderWithProviders(<BTCCard />, { preloadedState: mockAppStore, initialRoute: ['/cln'] });
    expect(screen.getByTestId('btc-card')).not.toBeEmptyDOMElement();
  });
});
