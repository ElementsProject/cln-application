import { useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CLNProvider } from '../../../store/CLNContext';
import { GLProvider } from '../../../store/GLContext';
import { RootContext } from '../../../store/RootContext';

const AuthWrapper = ({ children }) => {
  const rootCtx = useContext(RootContext);
  const navigate = useNavigate();
  const location = useLocation();
  const { lightningNodeType } = rootCtx.appConfig.serverConfig;

  useEffect(() => {
    if (rootCtx.authStatus.isLoading) {
      return;
    }

    if (!rootCtx.authStatus.isAuthenticated) {
      navigate('/');
      return;
    }

    if (location.pathname === '/') {
      if (lightningNodeType === 'GREENLIGHT') {
        navigate('/gl');
      } else {
        navigate('/cln');
      }
      return;
    }

    if (lightningNodeType === 'GREENLIGHT' && location.pathname.startsWith('/cln')) {
      navigate('/gl');
      return;
    }

    if (lightningNodeType !== 'GREENLIGHT' && location.pathname.startsWith('/gl')) {
      navigate('/cln');
      return;
    }
  }, [rootCtx.authStatus, navigate, location.pathname, lightningNodeType]);


  if (lightningNodeType === 'GREENLIGHT' && location.pathname.startsWith('/gl')) {
    return <GLProvider><div data-testid='gl-provider'>{children}</div></GLProvider>;
  }

  if (lightningNodeType !== 'GREENLIGHT' && location.pathname.startsWith('/cln')) {
    return <CLNProvider><div data-testid='cln-provider'>{children}</div></CLNProvider>;
  }

  return children;
};

export default AuthWrapper;
