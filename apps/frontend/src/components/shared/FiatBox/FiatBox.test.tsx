import { render, screen } from '@testing-library/react';
import FiatBox from './FiatBox';

describe('FiatBox component ', () => {
  beforeEach(() => render(<FiatBox />));

  it('should be in the document', () => {
    // expect(screen.getByTestId('header-context')).toBeInTheDocument();
  });

});
