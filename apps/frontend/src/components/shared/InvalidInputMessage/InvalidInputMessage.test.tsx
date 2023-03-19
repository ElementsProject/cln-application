import { render, screen } from '@testing-library/react';
import InvalidInputMessage from './InvalidInputMessage';

describe('InvalidInputMessage component ', () => {
  beforeEach(() => render(<InvalidInputMessage />));

  it('should be in the document', () => {
    // expect(screen.getByTestId('header-context')).toBeInTheDocument();
  });

});
