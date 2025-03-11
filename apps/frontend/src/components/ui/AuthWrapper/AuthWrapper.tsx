import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../../store/AppContext";

const AuthWrapper = ({ children }) => {
  const appCtx = useContext(AppContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!appCtx.authStatus.isAuthenticated) {
      navigate('/');
    } else {
      const currentPath = window.location.pathname;
      if (currentPath === '/') {
        if (appCtx.appConfig.serverConfig.lightningNodeType === 'GREENLIGHT') {
          navigate('/gl');
        } else {
          navigate('/cln');
        }
      }
    }
  }, [appCtx, navigate]);

  return children;
};

export default AuthWrapper;
