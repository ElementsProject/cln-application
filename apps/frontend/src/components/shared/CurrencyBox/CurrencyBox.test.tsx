import { render, screen } from '@testing-library/react';
import CurrencyBox from './CurrencyBox';

describe('CurrencyBox component ', () => {
  beforeEach(() => render(<CurrencyBox />));

  it('should be in the document', () => {
    // expect(screen.getByTestId('header-context')).toBeInTheDocument();
  });

});
