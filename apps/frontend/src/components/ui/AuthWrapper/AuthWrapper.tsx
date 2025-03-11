import { useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AppContext } from '../../../store/AppContext';

const AuthWrapper = ({ children }) => {
  const appCtx = useContext(AppContext);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (appCtx.authStatus.isLoading) {
      return;
    }
    
    if (!appCtx.authStatus.isAuthenticated) {
      navigate('/');
      return;
    }
    
    const { lightningNodeType } = appCtx.appConfig.serverConfig;
    
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
  }, [appCtx.authStatus, navigate, location.pathname, appCtx.appConfig.serverConfig.lightningNodeType, appCtx.appConfig.serverConfig]);

  return children;
};

export default AuthWrapper;
