import { render, screen } from '@testing-library/react';
import Header from './GLHeader';

describe('Header component ', () => {
  beforeEach(() => render(<Header />));

  it('should be in the document', () => {
    expect(screen.getByTestId('header-context')).toBeInTheDocument();
  });

  it('should be in the document', () => {
    expect(screen.getByTestId('header-context')).toBeInTheDocument();
  });
});
