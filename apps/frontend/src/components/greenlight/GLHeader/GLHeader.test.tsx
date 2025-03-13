import { render, screen } from '@testing-library/react';
import GLHeader from './GLHeader';

describe('GLHeader component ', () => {
  beforeEach(() => render(<GLHeader />));

  it('should be in the document', () => {
    expect(screen.getByTestId('header-context')).toBeInTheDocument();
  });
});
