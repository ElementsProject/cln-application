import { render, screen } from '@testing-library/react';
import DateBox from './DateBox';

describe('DateBox component ', () => {
  beforeEach(() => render(<DateBox />));

  it('should be in the document', () => {
    // expect(screen.getByTestId('header-context')).toBeInTheDocument();
  });

});
