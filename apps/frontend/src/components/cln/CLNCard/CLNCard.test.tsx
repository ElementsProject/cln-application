import { screen } from '@testing-library/react';
import { mockAppStore } from '../../../utilities/test-utilities/mockData';
import { renderWithProviders } from '../../../utilities/test-utilities/mockStore';
import CLNCard from './CLNCard';

describe('CLNCard component ', () => {
  it('should be in the document', async () => {
    await renderWithProviders(<CLNCard />, { preloadedState: mockAppStore, initialRoute: ['/cln'] });    
    expect(screen.getByTestId('cln-card')).not.toBeEmptyDOMElement();
  });
});
