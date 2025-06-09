import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import { createRootRouter } from './routes/router.config';
import { HttpService, RootService } from './services/http.service';
import logger from './services/logger.service';
import { appStore } from './store/appStore';
import { defaultRootState } from './store/rootSelectors';
import { setAuthStatus, setConfig, setFiatConfig, setShowModals } from './store/rootSlice';

export async function initializeAuth() {
  try {
    await HttpService.setCSRFToken();
    const data = await RootService.fetchAuthData();
    return data;
  } catch (error) {
    logger.error('Error fetching auth data:', error);
    return {config: defaultRootState.appConfig, authStatus: defaultRootState.authStatus, fiatConfig: defaultRootState.fiatConfig};
  }
}

async function bootstrapApp() {
  const { config, authStatus, fiatConfig } = await initializeAuth();

  if (!authStatus.isAuthenticated) {
    if (authStatus.isValidPassword) {
      appStore.dispatch(setShowModals({ ...defaultRootState.showModals, loginModal: true }));
    } else {
      appStore.dispatch(setShowModals({ ...defaultRootState.showModals, setPasswordModal: true }));
    }
  }

  appStore.dispatch(setAuthStatus(authStatus));
  appStore.dispatch(setConfig(config));
  appStore.dispatch(setFiatConfig(fiatConfig));
  
  const rootRouter = createRootRouter(); 
  const root = ReactDOM.createRoot(document.getElementById('root')!);
  root.render(
    <Provider store={appStore}>
      <RouterProvider router={rootRouter} />
    </Provider>
  );
}

bootstrapApp();