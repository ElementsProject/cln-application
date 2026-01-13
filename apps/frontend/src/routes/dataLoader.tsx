import { LoaderFunctionArgs } from "react-router-dom";
import { BookkeeperService, CLNService, RootService } from "../services/http.service";
import { appStore } from "../store/appStore";
import { AppState } from "../store/store.type";

export async function rootLoader({}: LoaderFunctionArgs) {
  const state = appStore.getState() as AppState;
  if (state.root.authStatus.isAuthenticated) {
    const rootData = await RootService.fetchRootData();
    const refreshData = await RootService.refreshData();
    return [rootData, refreshData];
  }
  return null;
}

export async function clnLoader({}: LoaderFunctionArgs) {
  const state = appStore.getState() as AppState;
  if (state.root.authStatus.isAuthenticated) {
    const clnData = await CLNService.fetchCLNData();
    return clnData;
  }
  return null;
}

export async function bkprLoader({}: LoaderFunctionArgs) {
  const state = appStore.getState() as AppState;
  if (state.root.authStatus.isAuthenticated) {
    const bkprData = await BookkeeperService.fetchBKPRData();
    return bkprData;
  }
  return null;
}
