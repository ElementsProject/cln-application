import { render, screen } from '@testing-library/react';
import BTCTransaction from './BTCTransaction';
import { mockTransaction } from '../../../utilities/test-utilities';

describe('BTCTransaction component ', () => {
  beforeEach(
    () => render(<BTCTransaction transaction={mockTransaction} />)
  );

  it('should be in the document', () => {
    expect(screen.getByTestId('transaction')).toBeInTheDocument();
  });
});
