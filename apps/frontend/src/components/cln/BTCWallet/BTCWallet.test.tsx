import { render, screen } from '@testing-library/react';
import BTCWallet from './BTCWallet';

describe('BTCWallet component ', () => {
  beforeEach(() => render(<BTCWallet />));

  it('should be in the document', () => {
    // expect(screen.getByTestId('header-context')).toBeInTheDocument();
  });

});
