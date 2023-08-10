import { render, screen } from '@testing-library/react';
import Login from './Login';

describe('Login component ', () => {
  beforeEach(() => render(<Login />));

  it('should be in the document', () => {
    // expect(screen.getByTestId('header-context')).toBeInTheDocument();
  });

});
