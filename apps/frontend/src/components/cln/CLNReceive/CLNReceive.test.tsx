import { render, screen } from '@testing-library/react';
import CLNReceive from './CLNReceive';

describe('CLNReceive component ', () => {
  beforeEach(() => render(<CLNReceive />));

  it('should be in the document', () => {
    expect(screen.getByTestId('cln-receive')).toBeInTheDocument();
  });

});
