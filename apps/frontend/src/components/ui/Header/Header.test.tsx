import { render, screen } from '@testing-library/react';
import Header from './Header';

describe('Header component ', () => {
  beforeEach(() => render(<Header />));

  it('should be in the document', () => {
    expect(screen.getByTestId('header-context')).toBeInTheDocument();
  });
});
