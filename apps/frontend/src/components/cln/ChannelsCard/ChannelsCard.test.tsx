import { render, screen } from '@testing-library/react';
import ChannelsCard from './ChannelsCard';

describe('ChannelsCard component ', () => {
  beforeEach(() => render(<ChannelsCard />));

  it('should be in the document', () => {
    expect(screen.getByTestId('channels-card')).not.toBeEmptyDOMElement()
  });
});
