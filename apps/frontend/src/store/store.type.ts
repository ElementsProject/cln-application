import { EnhancedStore } from "@reduxjs/toolkit";
import { BKPRState } from "../types/bookkeeper.type";
import { CLNState } from "../types/cln.type";
import { FactoriesState } from "../types/factories.type";
import { NodesState } from "../types/node.type";
import { RootState } from "../types/root.type";

export type ReducerManager = {
  getReducerMap: () => Record<string, any>;
  reduce: (state: any, action: any) => any;
  add: (key: string, reducer: any) => void;
  remove: (key: string) => void;
};

export interface StoreWithManager extends EnhancedStore {
  reducerManager: ReducerManager;
  getActions: () => any[];
  clearActions: () => any;
}

export type AppState = {
  root: RootState;
  cln?: CLNState;
  bkpr?: BKPRState;
  factories?: FactoriesState;
  nodes?: NodesState;
};
