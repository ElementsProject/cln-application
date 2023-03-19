import { render, screen } from '@testing-library/react';
import BTCTransactionsList from './BTCTransactionsList';

describe('BTCTransactionsList component ', () => {
  beforeEach(() => render(<BTCTransactionsList />));

  it('should be in the document', () => {
    // expect(screen.getByTestId('header-context')).toBeInTheDocument();
  });

});
