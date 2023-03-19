import { render, screen } from '@testing-library/react';
import BTCTransaction from './BTCTransaction';

describe('BTCTransaction component ', () => {
  beforeEach(() => render(<BTCTransaction />));

  it('should be in the document', () => {
    // expect(screen.getByTestId('header-context')).toBeInTheDocument();
  });

});
