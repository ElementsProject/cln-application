import { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { Loading } from '../components/ui/Loading/Loading';
import AccountEventsRoot from '../components/bookkeeper/AccountEvents/AccountEventsRoot';
import SatsFlowRoot from '../components/bookkeeper/SatsFlow/SatsFlowRoot';
import VolumeRoot from '../components/bookkeeper/Volume/VolumeRoot';
import { bkprLoader, clnLoader, rootLoader } from './dataLoader';
import { RootRouterReduxSync, CLNRouterReduxSync, BKPRRouterReduxSync } from './routerReduxSync';

const App = lazy(() => import('../components/App/App'));
const CLNHome = lazy(() => import('../components/cln/CLNHome/CLNHome'));
const Bookkeeper = lazy(() => import('../components/bookkeeper/BkprHome/BkprHome'));

export const rootRouteConfig = [
  {
    path: '/',
    element: (
      <Suspense fallback={<Loading />}>
          <App />
          <RootRouterReduxSync />
      </Suspense>
    ),
    HydrateFallback: () => <Loading />,
    loader: rootLoader,
    children: [
      {
        path: 'cln',
        element: (
          <Suspense fallback={<Loading />}>
            <CLNHome />
            <CLNRouterReduxSync />
          </Suspense>
        ),
        loader: clnLoader,
      },
      {
        path: 'bookkeeper',
        element: (
          <Suspense fallback={<Loading />}>
            <Bookkeeper />
            <BKPRRouterReduxSync />
          </Suspense>
        ),
        loader: bkprLoader,
        children: [
          {
            path: 'accountevents',
            element: (
              <Suspense fallback={<Loading />}>
                <AccountEventsRoot />
              </Suspense>
            ),
          },
          {
            path: 'satsflow',
            element: (
              <Suspense fallback={<Loading />}>
                <SatsFlowRoot />
              </Suspense>
            ),
          },
          {
            path: 'volume',
            element: (
              <Suspense fallback={<Loading />}>
                <VolumeRoot />
              </Suspense>
            ),
          },
        ],
      },
    ]
  }
];

export function createRootRouter() {
  return createBrowserRouter(rootRouteConfig, {
    future: {
      v7_relativeSplatPath: true,
      v7_normalizeFormMethod: true,
      v7_startTransition: true,
      v7_partialHydration: true,
    } as any
  });
}
