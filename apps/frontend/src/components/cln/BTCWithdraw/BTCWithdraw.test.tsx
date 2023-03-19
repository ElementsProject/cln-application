import { render, screen } from '@testing-library/react';
import BTCWithdraw from './BTCWithdraw';

describe('BTCWithdraw component ', () => {
  beforeEach(() => render(<BTCWithdraw />));

  it('should be in the document', () => {
    // expect(screen.getByTestId('header-context')).toBeInTheDocument();
  });

});
