import { render, screen } from '@testing-library/react';
import ChannelDetails from './ChannelDetails';

describe('ChannelDetails component ', () => {
  beforeEach(() => render(<ChannelDetails />));

  it('should be in the document', () => {
    // expect(screen.getByTestId('header-context')).toBeInTheDocument();
  });

});
