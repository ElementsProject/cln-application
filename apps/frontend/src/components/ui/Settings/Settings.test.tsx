import { render, screen } from '@testing-library/react';
import Settings from './Settings';

describe('Settings component ', () => {
  beforeEach(() => render(<Settings />));

  it('should be in the document', () => {
    expect(screen.getByTestId('settings')).toBeInTheDocument();
  });

});
