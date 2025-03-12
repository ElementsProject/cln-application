import { useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CLNProvider } from '../../../store/CLNContext';
import { RootContext } from '../../../store/RootContext';

const AuthWrapper = ({ children }) => {
  const rootCtx = useContext(RootContext);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (rootCtx.authStatus.isLoading) {
      navigate('/');
      return;
    }

    if (!rootCtx.authStatus.isAuthenticated) {
      navigate('/');
      return;
    }

    if (location.pathname === '/') {
      navigate('/cln');
      return;
    }
  }, [rootCtx.authStatus, navigate, location.pathname]);

  if (location.pathname.startsWith('/cln')) {
    return <CLNProvider><div data-testid='cln-provider'>{children}</div></CLNProvider>;
  }

  return children;
};

export default AuthWrapper;
