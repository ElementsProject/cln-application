import { screen } from '@testing-library/react';
import { renderWithProviders } from '../../../utilities/test-utilities/mockStore';
import { mockAppStore } from '../../../utilities/test-utilities/mockData';
import Settings from './Settings';

describe('Settings component ', () => {
  beforeEach(() => {});

  it('should be in the document', async () => {
    await renderWithProviders(<Settings />, { preloadedState: mockAppStore, initialRoute: ['/cln'] })
    expect(screen.getByTestId('settings')).toBeInTheDocument();
  });
});
