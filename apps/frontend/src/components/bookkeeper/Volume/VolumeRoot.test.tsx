import { render, screen } from '@testing-library/react';
import VolumeRoot from './VolumeRoot';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

describe('Sats Flow component ', () => {
  beforeEach(() => render(<VolumeRoot />));

  it('should be in the document', () => {
    expect(screen.getByTestId('volume-container')).not.toBeEmptyDOMElement();
  });
});
