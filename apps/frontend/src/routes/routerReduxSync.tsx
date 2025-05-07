import { useLoaderData } from 'react-router-dom';
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { clearBKPRStore, setAccountEvents, setSatsFlow, setVolume } from '../store/bkprSlice';
import { clearCLNStore, setFeeRate, setListBitcoinTransactions, setListInvoices, setListOffers, setListPayments } from '../store/clnSlice';
import { setListChannels, setListFunds, setListPeers, setNodeInfo, setConnectWallet } from '../store/rootSlice';
import { APP_WAIT_TIME } from '../utilities/constants';
import { useDispatch, useSelector } from 'react-redux';
import { RootService } from '../services/http.service';
import { RootLoaderData } from '../types/root.type';
import { CLNLoaderData } from '../types/cln.type';
import { BKPRLoaderData } from '../types/bookkeeper.type';
import { selectAuthStatus } from '../store/rootSelectors';

export function RootRouterReduxSync() {
  const navigate = useNavigate();
  const rootData = useLoaderData() as RootLoaderData;
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const authStatus = useSelector(selectAuthStatus);

  useEffect(() => {
    if (!rootData) return;

    if (authStatus.isAuthenticated && authStatus.isValidPassword) {
      if (rootData.nodeInfo) {
        dispatch(setNodeInfo(rootData.nodeInfo));
      }
      if (rootData.listChannels && rootData.listNodes) {
        dispatch(setListChannels({
          listChannels: rootData.listChannels,
          listNodes: rootData.listNodes
        }));
      }
      if (rootData.listPeers) {
        dispatch(setListPeers(rootData.listPeers));
      }
      if (rootData.listFunds) {
        dispatch(setListFunds(rootData.listFunds));
      }
      if (rootData.connectWallet) {
        dispatch(setConnectWallet(rootData.connectWallet));
      }
    }
  }, [authStatus.isAuthenticated, authStatus.isValidPassword, rootData, dispatch, pathname]);

  // Handle polling
  useEffect(() => {
    if (!authStatus?.isAuthenticated || !authStatus?.isValidPassword) return;

    const interval = setInterval(async () => {
      if (document.visibilityState === 'visible' && authStatus?.isAuthenticated) {
        try {
          const rootData = await RootService.fetchRootData();
          dispatch(setNodeInfo(rootData?.nodeInfo));
          dispatch(setListChannels({listChannels: rootData?.listChannels, listNodes: rootData?.listNodes}));
          dispatch(setListPeers(rootData?.listPeers));
          dispatch(setListFunds(rootData?.listFunds));
        } catch (error) {
          console.error('Error fetching root data:', error);
        }
      }
    }, APP_WAIT_TIME);

    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authStatus.isAuthenticated]);

  // Handle navigation for authenticated users
  useEffect(() => {
    const targetPath = pathname.includes('/bookkeeper') ? pathname : '/cln';
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
    };
  }, [pathname, dispatch]);

  return null;
}

export function CLNRouterReduxSync() {
  const clnData = useLoaderData() as CLNLoaderData;
  const dispatch = useDispatch();
  const authStatus = useSelector(selectAuthStatus);

  useEffect(() => {
    if (!clnData) return;
    if (authStatus.isAuthenticated && authStatus.isValidPassword) {
      if (clnData.listInvoices) {
        dispatch(setListInvoices(clnData.listInvoices));
      }
      if (clnData.listSendPays) {
        dispatch(setListPayments(clnData.listSendPays));
      }
      if (clnData.listOffers) {
        dispatch(setListOffers(clnData.listOffers));
      }
      if (clnData.listAccountEvents) {
        dispatch(setListBitcoinTransactions(clnData.listAccountEvents));
      }
      if (clnData.feeRates) {
        dispatch(setFeeRate(clnData.feeRates));
      }
    }
  }, [authStatus.isAuthenticated, authStatus.isValidPassword, clnData, dispatch]);

  return null;
}

export function BKPRRouterReduxSync() {
  const bkprData = useLoaderData() as BKPRLoaderData;
  const dispatch = useDispatch();
  const authStatus = useSelector(selectAuthStatus);

  useEffect(() => {
    if (!bkprData) return;
    if (authStatus.isAuthenticated && authStatus.isValidPassword) {
      if (bkprData.satsFlow) {
        dispatch(setSatsFlow({
          satsFlow: bkprData.satsFlow,
          timeGranularity: bkprData.timeGranularity,
          startTimestamp: bkprData.startTimestamp,
          endTimestamp: bkprData.endTimestamp
        }));
      }
      if (bkprData.accountEvents) {
        dispatch(setAccountEvents({
          accountEvents: bkprData.accountEvents,
          timeGranularity: bkprData.timeGranularity,
          startTimestamp: bkprData.startTimestamp,
          endTimestamp: bkprData.endTimestamp
        }));
      }
      if (bkprData.volume) {
        dispatch(setVolume({ volume: bkprData.volume }));
      }
    }
  }, [authStatus.isAuthenticated, authStatus.isValidPassword, bkprData, dispatch]);

  return null;
}
