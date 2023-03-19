import { render, screen } from '@testing-library/react';
import CLNTransactionsList from './CLNTransactionsList';

describe('CLNTransactionsList component ', () => {
  beforeEach(() => render(<CLNTransactionsList />));

  it('should be in the document', () => {
    // expect(screen.getByTestId('header-context')).toBeInTheDocument();
  });

});
