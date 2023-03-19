import { render, screen } from '@testing-library/react';
import StatusAlert from './StatusAlert';

describe('StatusAlert component ', () => {
  beforeEach(() => render(<StatusAlert />));

  it('should be in the document', () => {
    // expect(screen.getByTestId('header-context')).toBeInTheDocument();
  });

});
