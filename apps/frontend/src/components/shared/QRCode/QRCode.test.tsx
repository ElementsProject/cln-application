import { render, screen } from '@testing-library/react';
import QRCodeComponent from './QRCode';

describe('QRCodeComponent component ', () => {
  beforeEach(() => render(<QRCodeComponent />));

  it('should be in the document', () => {
    expect(screen.getByTestId('qr-code-component')).toBeInTheDocument();
  });

});
