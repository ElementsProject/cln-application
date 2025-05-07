import { screen } from '@testing-library/react';
import { renderWithProviders } from '../../utilities/test-utilities/mockStore';
import App from './App';
import { mockAppConfig, mockAppStore, mockBKPRStoreData, mockCLNStoreData, mockRootStoreData } from '../../utilities/test-utilities/mockData';
import { ApplicationModes, Units } from '../../utilities/constants';

describe('App component', () => {
  it('should render container element', async () => {
    await renderWithProviders(<App />, { preloadedState: mockAppStore });
    expect(screen.getByTestId('container')).toBeInTheDocument();
  });

  it('should set the container className based on isAuthenticated', async () => {
    const customMockStore = {
      root: {
        ...mockRootStoreData,
        authStatus: {
          isLoading: false,
          isAuthenticated: false,
          isValidPassword: false,
        }
      },
      cln: mockCLNStoreData,
      bkpr: mockBKPRStoreData
    };
    await renderWithProviders(<App />, { preloadedState: customMockStore });
    const container = screen.getByTestId('container');
    expect(container).toHaveClass('py-4 blurred-container');
  });

  it('should set body background color to dark when appMode is DARK', async () => {
    const customMockStore = {
      root: {
        ...mockRootStoreData,
        appConfig: {
          ...mockAppConfig,
          uiConfig: {
            fiatUnit: "CAD",
            appMode: ApplicationModes.DARK,
            unit: Units.SATS
          },
        }
      },
      cln: mockCLNStoreData,
      bkpr: mockBKPRStoreData
    };
    await renderWithProviders(<App />, { preloadedState: customMockStore });
    expect(document.body.style.backgroundColor).toBe('rgb(12, 12, 15)');
  });

  it('should set body background color to light when appMode is LIGHT', async () => {
    const customMockStore = {
      root: {
        ...mockRootStoreData,
        appConfig: {
          ...mockAppConfig,
          uiConfig: {
            fiatUnit: "CAD",
            appMode: ApplicationModes.LIGHT,
            unit: Units.SATS
          },
        }
      },
      cln: mockCLNStoreData,
      bkpr: mockBKPRStoreData
    };
    await renderWithProviders(<App />, { preloadedState: customMockStore });
    expect(document.body.style.backgroundColor).toBe('rgb(235, 239, 249)');
  });

  it('should set data-bs-theme attribute based on appMode', async () => {
    const customMockStore = {
      root: {
        ...mockRootStoreData,
        appConfig: {
          ...mockAppConfig,
          uiConfig: {
            fiatUnit: "CAD",
            appMode: ApplicationModes.LIGHT,
            unit: Units.SATS
          },
        }
      },
      cln: mockCLNStoreData,
      bkpr: mockBKPRStoreData
    };
    await renderWithProviders(<App />, { preloadedState: customMockStore });
    expect(document.body.getAttribute('data-bs-theme')).toBe('light');
  });

  it('should include subcomponents like ToastMessage and modals', async () => {
    await renderWithProviders(<App />, { preloadedState: mockAppStore });
    expect(document.querySelector('div.toast-container')).toBeInTheDocument();
    expect(document.querySelector('#root-container')).toBeInTheDocument();
  });

  it('should set data-screensize attribute based on current breakpoint', async () => {
    await renderWithProviders(<App />, { preloadedState: mockAppStore });
    const screenSizeAttr = document.body.getAttribute('data-screensize');
    expect(screenSizeAttr).toBeDefined();
    expect(typeof screenSizeAttr).toBe('string');
  });
});
