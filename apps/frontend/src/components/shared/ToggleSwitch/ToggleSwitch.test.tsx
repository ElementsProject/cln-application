import { render, screen } from '@testing-library/react';
import ToggleSwitch from './ToggleSwitch';

describe('ToggleSwitch component ', () => {
  beforeEach(() => render(<ToggleSwitch />));

  it('should be in the document', () => {
    // expect(screen.getByTestId('header-context')).toBeInTheDocument();
  });

});
