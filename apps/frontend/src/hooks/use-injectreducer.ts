import { useEffect } from 'react';
import { appStore } from '../store/appStore';
import { StoreWithManager } from '../store/store.type';

const injectedReducers: Record<string, boolean> = {};

export function useInjectReducer<Key extends string>(
  key: Key,
  reducer: any
) {
  useEffect(() => {
    const store = appStore as StoreWithManager;
    if (injectedReducers[key]) return;

    store.reducerManager.add(key, reducer);
    store.replaceReducer(store.reducerManager.reduce);
    injectedReducers[key] = true;
  }, [key, reducer]);
}
