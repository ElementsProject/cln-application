import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { clearBKPRStore } from '../store/bkprSlice';
import { clearCLNStore } from '../store/clnSlice';
import { clearFactoriesStore } from '../store/factoriesSlice';
import { APP_WAIT_TIME } from '../utilities/constants';
import { useDispatch, useSelector } from 'react-redux';
import { BookkeeperService, CLNService, FactoriesService, NodesService, RootService } from '../services/http.service';
import { selectAuthStatus } from '../store/rootSelectors';
import logger from '../services/logger.service';

export function RootRouterReduxSync() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const authStatus = useSelector(selectAuthStatus);
  
  // Fetch node profiles and detect factory plugin once after auth
  useEffect(() => {
    if (!authStatus?.isAuthenticated || !authStatus?.isValidPassword) return;

    NodesService.fetchAndDispatchNodes();
    NodesService.detectFactoryPlugin();
  }, [authStatus?.isAuthenticated, authStatus?.isValidPassword]);

  // Handle polling
  useEffect(() => {
    if (!authStatus?.isAuthenticated || !authStatus?.isValidPassword) return;

    const interval = setInterval(async () => {
      if (document.visibilityState === 'visible' && authStatus?.isAuthenticated) {
        try {
          await RootService.refreshData();
          if (pathname.includes('/factories')) {
            await FactoriesService.fetchFactoriesData();
          }
        } catch (error) {
          logger.error('Error fetching root data:', error);
        }
      }
    }, APP_WAIT_TIME);

    return () => clearInterval(interval);
  }, [authStatus.isAuthenticated]);

  // Handle navigation for authenticated users
  useEffect(() => {
    const fetchRouteData = async () => {
      if (pathname.includes('/cln')) {
        try {
          await CLNService.fetchCLNData();
        } catch (error) {
          logger.error('Error fetching CLN data:', error);
        }
      }
      else if (pathname.includes('/bookkeeper')) {
        try {
          await BookkeeperService.fetchBKPRData();
        } catch (error) {
          logger.error('Error fetching BKPR data:', error);
        }
      }
      else if (pathname.includes('/factories')) {
        try {
          await FactoriesService.fetchFactoriesData();
        } catch (error) {
          logger.error('Error fetching factories data:', error);
        }
      }
    };
    const targetPath = pathname.includes('/bookkeeper') ? pathname
      : pathname.includes('/factories') ? pathname
      : pathname.includes('/connect') ? pathname
      : '/cln';
    fetchRouteData();
    if (pathname !== targetPath) {
      navigate(targetPath, { replace: true });
    }
  }, [authStatus, pathname, navigate]);

  // Clear store on route unmounting
  useEffect(() => {
    return () => {
      if (pathname.includes('/cln')) {
        dispatch(clearCLNStore());
      }
      else if (pathname.includes('/bookkeeper')) {
        dispatch(clearBKPRStore());
      }
      else if (pathname.includes('/factories')) {
        dispatch(clearFactoriesStore());
      }
    };
  }, [pathname, dispatch]);

  return null;
}
