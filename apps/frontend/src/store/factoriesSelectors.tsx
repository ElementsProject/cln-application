import { createSelector } from '@reduxjs/toolkit';
import { FactoriesState, FactoryCeremony, FactoryLifecycle } from '../types/factories.type';

export const defaultFactoriesState: FactoriesState = {
  factoryList: { isLoading: true, factories: [] },
  selectedFactory: null,
  actionStatus: { action: null, status: 'idle', message: '' },
};

const selectFactoriesState = (state: { factories: FactoriesState }) =>
  state.factories || defaultFactoriesState;

export const selectFactoryList = createSelector(
  selectFactoriesState,
  (f) => f.factoryList
);

export const selectFactories = createSelector(
  selectFactoryList,
  (fl) => fl.factories
);

export const selectFactoriesLoading = createSelector(
  selectFactoryList,
  (fl) => fl.isLoading
);

export const selectFactoriesError = createSelector(
  selectFactoryList,
  (fl) => fl.error
);

export const selectSelectedFactory = createSelector(
  selectFactoriesState,
  (f) => f.selectedFactory
);

export const selectActionStatus = createSelector(
  selectFactoriesState,
  (f) => f.actionStatus
);

export const selectFactoryCounts = createSelector(
  selectFactories,
  (factories) => ({
    total: factories.length,
    active: factories.filter(f => f.lifecycle === FactoryLifecycle.ACTIVE).length,
    init: factories.filter(f => f.lifecycle === FactoryLifecycle.INIT).length,
    dying: factories.filter(f => f.lifecycle === FactoryLifecycle.DYING).length,
    expired: factories.filter(f => f.lifecycle === FactoryLifecycle.EXPIRED).length,
    signed: factories.filter(f => f.ceremony === FactoryCeremony.COMPLETE).length,
    totalChannels: factories.reduce((sum, f) => sum + (f.n_channels || 0), 0),
  })
);
