import { render, screen } from '@testing-library/react';
import CLNOffersList from './CLNOffersList';

describe('CLNOffersList component ', () => {
  beforeEach(() => render(<CLNOffersList />));

  it('should be in the document', () => {
    // expect(screen.getByTestId('header-context')).toBeInTheDocument();
  });

});
