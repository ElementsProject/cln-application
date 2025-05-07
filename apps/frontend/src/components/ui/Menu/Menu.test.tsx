import { screen } from '@testing-library/react';
import { renderWithProviders } from '../../../utilities/test-utilities/mockStore';
import { mockAppStore } from '../../../utilities/test-utilities/mockData';
import Menu from './Menu';

describe('Menu component ', () => {
  beforeEach(() => {});

  it('should be in the document', async () => {
    await renderWithProviders(<Menu />, { preloadedState: mockAppStore, initialRoute: ['/cln'] })
    expect(screen.getByTestId('menu')).toBeInTheDocument();
  });
});
