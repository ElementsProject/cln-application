import { render, screen } from '@testing-library/react';
import Channels from './Channels';

describe('Channels component ', () => {
  beforeEach(() => render(<Channels />));

  it('should be in the document', () => {
    expect(screen.getByTestId('channels')).toBeInTheDocument();
  });

});
