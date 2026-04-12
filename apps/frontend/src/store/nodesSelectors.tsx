import { createSelector } from '@reduxjs/toolkit';
import { NodesState } from '../types/node.type';

export const defaultNodesState: NodesState = {
  isLoading: true,
  profiles: [],
  activeProfileId: null,
  isConnected: false,
  hasFactoryPlugin: false,
  isSwitching: false,
  isDiscovering: false,
  error: null,
};

const selectNodesState = (state: { nodes: NodesState }) =>
  state.nodes || defaultNodesState;

export const selectNodeProfiles = createSelector(
  selectNodesState,
  (n) => n.profiles
);

export const selectActiveProfileId = createSelector(
  selectNodesState,
  (n) => n.activeProfileId
);

export const selectActiveProfile = createSelector(
  selectNodeProfiles,
  selectActiveProfileId,
  (profiles, activeId) => profiles.find((p) => p.id === activeId) || null
);

export const selectIsSwitchingNode = createSelector(
  selectNodesState,
  (n) => n.isSwitching
);

export const selectHasMultipleNodes = createSelector(
  selectNodeProfiles,
  (profiles) => profiles.length > 1
);

export const selectNodesError = createSelector(
  selectNodesState,
  (n) => n.error
);

export const selectNodesLoading = createSelector(
  selectNodesState,
  (n) => n.isLoading
);

export const selectIsConnected = createSelector(
  selectNodesState,
  (n) => n.isConnected
);

export const selectIsDiscovering = createSelector(
  selectNodesState,
  (n) => n.isDiscovering
);

export const selectHasFactoryPlugin = createSelector(
  selectNodesState,
  (n) => n.hasFactoryPlugin
);
