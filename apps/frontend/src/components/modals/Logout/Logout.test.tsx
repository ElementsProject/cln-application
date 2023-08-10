import { render, screen } from '@testing-library/react';
import Logout from './Logout';

describe('Logout component ', () => {
  beforeEach(() => render(<Logout />));

  it('should be in the document', () => {
    // expect(screen.getByTestId('header-context')).toBeInTheDocument();
  });

});
