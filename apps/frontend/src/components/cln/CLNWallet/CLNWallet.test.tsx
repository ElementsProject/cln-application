import { render, screen } from '@testing-library/react';
import CLNWallet from './CLNWallet';

describe('CLNWallet component ', () => {
  beforeEach(() => render(<CLNWallet />));

  it('should be in the document', () => {
    // expect(screen.getByTestId('header-context')).toBeInTheDocument();
  });

});
