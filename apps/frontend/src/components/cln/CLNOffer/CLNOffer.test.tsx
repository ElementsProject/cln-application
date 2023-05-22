import { render, screen } from '@testing-library/react';
import CLNOffer from './CLNOffer';

describe('CLNOffer component ', () => {
  beforeEach(() => render(<CLNOffer />));

  it('should be in the document', () => {
    // expect(screen.getByTestId('header-context')).toBeInTheDocument();
  });

});
