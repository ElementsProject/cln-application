import { screen } from '@testing-library/react';
import { mockAppStore } from '../../../utilities/test-utilities/mockData';
import { renderWithProviders } from '../../../utilities/test-utilities/mockStore';
import ChannelsCard from './ChannelsCard';

describe('ChannelsCard component ', () => {
  it('should be in the document', async () => {
    await renderWithProviders(<ChannelsCard />, { preloadedState: mockAppStore, initialRoute: ['/cln'] });
    expect(screen.getByTestId('channels-card')).not.toBeEmptyDOMElement();
  });
});
