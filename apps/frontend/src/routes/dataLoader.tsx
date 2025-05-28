import { LoaderFunctionArgs } from "react-router-dom";
import { BookkeeperService, CLNService, RootService } from "../services/http.service";
import { appStore } from "../store/appStore";
import { AppState } from "../store/store.type";

export async function rootLoader({ request }: LoaderFunctionArgs) {
  const state = appStore.getState() as AppState;
  if (state.root.authStatus.isAuthenticated) {
    const [connectwalletData, rootData] = await Promise.all([
      RootService.getConnectWallet(),
      RootService.fetchRootData()
    ]);
    return { ...rootData, connectWallet: connectwalletData };
  }
  return null
}

export async function clnLoader({ request }: LoaderFunctionArgs) {
  const state = appStore.getState() as AppState;
  if (state.root.authStatus.isAuthenticated) {
    const clnData = await CLNService.fetchCLNData();
    return clnData;
  }
  return null;
}

export async function bkprLoader({ request }: LoaderFunctionArgs) {
  const state = appStore.getState() as AppState;
  if (state.root.authStatus.isAuthenticated) {
    const bkprData = await BookkeeperService.fetchBKPRData();
    return bkprData;
  }
  return null;
}
