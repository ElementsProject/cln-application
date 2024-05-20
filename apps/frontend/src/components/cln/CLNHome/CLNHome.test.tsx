import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import CLNHome from './CLNHome';

describe('CLNHome component ', () => {
  beforeEach(() => render(<CLNHome />));

  it('should be in the document', () => {
    expect(screen.getByTestId('cln-container')).not.toBeEmptyDOMElement()
  });
});
