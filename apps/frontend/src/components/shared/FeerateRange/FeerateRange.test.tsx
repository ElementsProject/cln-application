import { render, screen } from '@testing-library/react';
import FeerateRange from './FeerateRange';

describe('FeerateRange component ', () => {
  beforeEach(() => render(<FeerateRange />));

  it('should be in the document', () => {
    expect(screen.getByTestId('fee-rate-container')).toBeInTheDocument();
  });

});
