import { render, screen } from '@testing-library/react';
import Greenlight from './GLHome';

describe('Greenlight component ', () => {
  beforeEach(() => render(<Greenlight />));

  it('should be in the document', () => {
    expect(screen.getByTestId('greenlight-container')).not.toBeEmptyDOMElement()
  });
});
