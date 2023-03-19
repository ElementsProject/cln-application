import { render, screen } from '@testing-library/react';
import App from './App';

describe('App component ', () => {
  beforeEach(() => render(<App />));

  it('should be in the document', () => {
    expect(screen.getByTestId('container')).not.toBeEmptyDOMElement()
  });
});
