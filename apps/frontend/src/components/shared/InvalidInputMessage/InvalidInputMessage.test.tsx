import { render, screen } from '@testing-library/react';
import InvalidInputMessage from './InvalidInputMessage';

describe('InvalidInputMessage component ', () => {
  beforeEach(() => render(<InvalidInputMessage />));

  it('should be in the document', () => {
    render(<InvalidInputMessage message="my message!" />);
    expect(screen.getByText('my message!')).toBeInTheDocument();
  });

});
