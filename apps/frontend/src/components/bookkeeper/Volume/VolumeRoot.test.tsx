import { screen } from '@testing-library/react';
import { mockAppStore } from '../../../utilities/test-utilities/mockData';
import { renderWithProviders } from '../../../utilities/test-utilities/mockStore';
import VolumeRoot from './VolumeRoot';

describe('Sats Flow component ', () => {
  beforeEach(() => {
    global.ResizeObserver = jest.fn().mockImplementation(() => ({
      observe: jest.fn(),
      unobserve: jest.fn(),
      disconnect: jest.fn(),
    }));
  });

  it('should be in the document', async () => {
    await renderWithProviders(<VolumeRoot />, { preloadedState: mockAppStore, initialRoute: ['/bookkeeper/volume'] });
    expect(screen.getByTestId('volume-container')).not.toBeEmptyDOMElement();
  });
});
