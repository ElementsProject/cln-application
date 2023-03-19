import { render, screen } from '@testing-library/react';
import CLNTransaction from './CLNTransaction';

describe('CLNTransaction component ', () => {
  beforeEach(() => render(<CLNTransaction />));

  it('should be in the document', () => {
    // expect(screen.getByTestId('header-context')).toBeInTheDocument();
  });

});
