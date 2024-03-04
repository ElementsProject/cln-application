import { render, screen } from '@testing-library/react';
import CLNSend from './CLNSend';

describe('CLNSend component ', () => {
  beforeEach(() => render(<CLNSend />));

  it('should be in the document', () => {
    expect(screen.getByTestId('cln-send')).toBeInTheDocument();
  });

});
