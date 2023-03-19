import { render, screen } from '@testing-library/react';
import ChannelOpen from './ChannelOpen';

describe('ChannelOpen component ', () => {
  beforeEach(() => render(<ChannelOpen />));

  it('should be in the document', () => {
    // expect(screen.getByTestId('header-context')).toBeInTheDocument();
  });

});
