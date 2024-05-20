import { render, screen } from '@testing-library/react';
import FiatSelection from './FiatSelection';

describe('FiatSelection component ', () => {
  beforeEach(() => render(<FiatSelection />));

  it('should be in the document', () => {
    expect(screen.getByTestId('fiat-selection')).toBeInTheDocument();
  });

});
