import { screen } from '@testing-library/react';
import TerminalRoot from './TerminalRoot';
import { getMockStoreData, renderWithMockContext } from '../../../utilities/test-utilities';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

describe('Terminal component ', () => {
  let providerProps = JSON.parse(JSON.stringify(getMockStoreData()));
  
  beforeEach(() => {
    renderWithMockContext(<TerminalRoot />, { providerProps });
  });

  it('should be in the document', () => {
    expect(screen.getByTestId('terminal-container')).not.toBeEmptyDOMElement();
  });
});
