import { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import AuthWrapper from '../components/ui/AuthWrapper/AuthWrapper';
import { Loading } from '../components/ui/Loading/Loading';

const App = lazy(() => import('../components/App/App'));
const CLNHome = lazy(() => import('../components/cln/CLNHome/CLNHome'));
const Bookkeeper = lazy(() => import('../components/bookkeeper/BkprRoot/BkprRoot'));
const Greenlight = lazy(() => import('../components/greenlight/GLRoot/GLRoot'));

export const rootRouteConfig = [
  {
    path: '/',
    element: (
      <AuthWrapper>
        <Suspense fallback={<Loading />}>
          <App />
        </Suspense>
      </AuthWrapper>
    ),
    children: [
      {
        path: 'cln',
        element: (
          <Suspense fallback={<Loading />}>
            <CLNHome />
          </Suspense>
        ),
        children: [
          {
            path: 'bookkeeper',
            element: (
              <Suspense fallback={<Loading />}>
                <Bookkeeper />
              </Suspense>
            ),
          },
        ],
      },
      {
        path: 'gl',
        element: (
          <Suspense fallback={<Loading />}>
            <Greenlight />
          </Suspense>
        ),
      },
    ],
  },
];

export const rootRouter = createBrowserRouter(rootRouteConfig);
