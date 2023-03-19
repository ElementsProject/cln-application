import { render, screen } from '@testing-library/react';
import ToastMessage from './ToastMessage';

describe('ToastMessage component ', () => {
  beforeEach(() => render(<ToastMessage />));

  it('should be in the document', () => {
    // expect(screen.getByTestId('header-context')).toBeInTheDocument();
  });

});
