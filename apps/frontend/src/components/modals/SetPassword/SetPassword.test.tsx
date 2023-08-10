import { render, screen } from '@testing-library/react';
import SetPassword from './SetPassword';

describe('SetPassword component ', () => {
  beforeEach(() => render(<SetPassword />));

  it('should be in the document', () => {
    // expect(screen.getByTestId('header-context')).toBeInTheDocument();
  });

});
