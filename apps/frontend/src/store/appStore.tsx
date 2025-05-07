import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './rootSlice';
import { StoreWithManager } from './store.type';
import { combineReducers } from "@reduxjs/toolkit";

export function createReducerManager(initialReducers: any) {
  const reducers = { ...initialReducers };
  let combinedReducer = combineReducers(reducers);

  return {
    getReducerMap: () => reducers,
    reduce: (state: any, action: any) => combinedReducer(state, action),
    add: (key: string, reducer: any) => {
      if (!key || reducers[key]) return;
      reducers[key] = reducer;
      combinedReducer = combineReducers(reducers);
    },
    remove: (key: string) => {
      if (!key || !reducers[key]) return;
      delete reducers[key];
      combinedReducer = combineReducers(reducers);
    },
  };
}

const reducerManager = createReducerManager({ root: rootReducer });

export const appStore = configureStore({
  reducer: reducerManager.reduce,
}) as StoreWithManager;

appStore.reducerManager = reducerManager;
