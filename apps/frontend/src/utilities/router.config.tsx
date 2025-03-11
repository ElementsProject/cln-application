import { lazy, Suspense, useContext, useEffect } from 'react';
import { createBrowserRouter, useNavigate } from 'react-router-dom';
import { AppContext } from '../store/AppContext';

const App = lazy(() => import('../components/App/App'));
const CLNHome = lazy(() => import('../components/cln/CLNHome/CLNHome'));
const Bookkeeper = lazy(() => import('../components/bookkeeper/BkprRoot/BkprRoot'));
const Greenlight = lazy(() => import('../components/greenlight/GLRoot/GLRoot'));

const AuthWrapper = ({ children }) => {
  const appCtx = useContext(AppContext);
  const navigate = useNavigate();
  useEffect(() => {
    if (!appCtx.authStatus.isAuthenticated) {
      navigate('/');
    } else {
      if (appCtx.appConfig.serverConfig.lightningNodeType === 'GREENLIGHT') {
        navigate('/gl');
      } else {
        navigate('/cln');
      }
    }
  }, [appCtx, navigate]);
  return children;
};

export const rootRouteConfig = [
  {
    path: '/',
    element: (
      <AuthWrapper>
        <Suspense fallback={<div>Loading...</div>}>
          <App />
        </Suspense>
      </AuthWrapper>
    ),
    children: [
      {
        path: 'cln',
        element: (
          <AuthWrapper>
            <Suspense fallback={<div>Loading...</div>}>
              <CLNHome />
            </Suspense>
          </AuthWrapper>            
        ),
        children: [{ index: true, element: <CLNHome /> }],
      },
      {
        path: 'gl',
        element: (
          <AuthWrapper>
            <Suspense fallback={<div>Loading...</div>}>
              <Greenlight />
            </Suspense>
          </AuthWrapper>
        ),
      },
      {
        path: 'bookkeeper',
        element: (
          <AuthWrapper>
            <Suspense fallback={<div>Loading...</div>}>
              <Bookkeeper />
            </Suspense>
          </AuthWrapper>
        ),
      },
    ],
  },
];

export const rootRouter = createBrowserRouter(rootRouteConfig);
