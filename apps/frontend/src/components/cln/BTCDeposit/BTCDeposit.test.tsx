import { render, screen } from '@testing-library/react';
import BTCDeposit from './BTCDeposit';

describe('BTCDeposit component ', () => {
  beforeEach(() => render(<BTCDeposit />));

  it('should be in the document', () => {
    expect(screen.getByTestId('btc-deposit')).toBeInTheDocument();
  });

});
