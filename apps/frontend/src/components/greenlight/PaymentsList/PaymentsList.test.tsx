import { render, screen } from '@testing-library/react';
import PaymentsList from './PaymentsList';

describe('PaymentsList component ', () => {
  beforeEach(() => render(<PaymentsList />));

  it('should be in the document', () => {
    expect(screen.getByTestId('payments-list')).toBeInTheDocument();
  });

});
