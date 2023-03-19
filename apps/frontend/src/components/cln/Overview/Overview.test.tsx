import { render, screen } from '@testing-library/react';
import Overview from './Overview';

describe('Overview component ', () => {
  beforeEach(() => render(<Overview />));

  it('should be in the document', () => {
    // expect(screen.getByTestId('header-context')).toBeInTheDocument();
  });

});
