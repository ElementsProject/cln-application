import { screen } from '@testing-library/react';
import ChannelDetails from './ChannelDetails';
import { renderWithMockContext, getMockStoreData, mockSelectedChannel } from '../../../utilities/test-utilities';

describe('ChannelDetails component ', () => {
  let providerProps;
  beforeEach(() => providerProps = JSON.parse(JSON.stringify(getMockStoreData())));

  it('should be in the document', () => {
    renderWithMockContext(<ChannelDetails selChannel={mockSelectedChannel} />, { providerProps });
    expect(screen.getByTestId('channel-details')).toBeInTheDocument();
  });

});
