import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { render, RenderOptions, RenderResult } from '@testing-library/react';
import { PropsWithChildren, act } from 'react';
import { Provider } from 'react-redux';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import rootReducer from '../../store/rootSlice';
import clnReducer from '../../store/clnSlice';
import bkprReducer from '../../store/bkprSlice';
import { rootRouteConfig } from '../../routes/router.config';
import { AppState, StoreWithManager } from '../../store/store.type';
import { mockAppStore } from './mockData';

interface ExtendedRenderOptions extends Omit<RenderOptions, 'queries'> {
  preloadedState?: AppState;
  initialRoute?: string[];
}

export function createMockStore(route: string, preloadedState?: AppState) {
  const reducers = {
    root: rootReducer,
    cln: clnReducer,
    bkpr: bkprReducer
  };
  try {
    const store = configureStore({
      reducer: combineReducers(reducers),
      preloadedState: preloadedState || mockAppStore,
      middleware: (getDefaultMiddleware) => 
        getDefaultMiddleware({
          serializableCheck: false,
          immutableCheck: false
        })
    }) as StoreWithManager;

    if (!store.getState || !store.dispatch) {
      throw new Error('Created store is invalid! Missing required methods');
    }
    
    const dispatchedActions: any[] = [];
    const originalDispatch = store.dispatch;
    store.dispatch = (action: any) => {
      dispatchedActions.push(action);
      return originalDispatch(action);
    };
    store.getActions = () => dispatchedActions;
    store.clearActions = () => {
      dispatchedActions.length = 0;
    };

    return store;
  } catch (error: any) {
    console.error('FULL STORE CREATION ERROR:', {
      error: error.message,
      stack: error.stack,
      reducers: Object.keys(reducers),
      stateKeys: Object.keys(preloadedState || mockAppStore)
    });
    throw new Error(`Store creation failed: ${error.message}`);
  }
}

interface RenderWithProvidersResult extends RenderResult {
  store: ReturnType<typeof createMockStore>;
}

export async function renderWithProviders(
  ui: React.ReactElement,
  {
    preloadedState,
    initialRoute = ['/'],
    ...renderOptions
  }: ExtendedRenderOptions = {}
) {
  const route = initialRoute[0] || '/';
  const store = createMockStore(route, preloadedState);
  const router = createMemoryRouter(rootRouteConfig, {
    initialEntries: initialRoute,
    future: {
      v7_relativeSplatPath: true,
      v7_normalizeFormMethod: true,
      v7_startTransition: true,
    } as any
  });
  const Wrapper = ({ children }: PropsWithChildren<{}>) => {
    return (
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    );
  };

  let result;
  await act(async () => {
    result = render(ui, { wrapper: Wrapper, ...renderOptions });
  });
  
  return { 
    store,
    router,
    ...result,
    getActions: () => store.getActions(),
    clearActions: () => store.clearActions()
  };
}

export type { AppState, ExtendedRenderOptions, RenderWithProvidersResult };
