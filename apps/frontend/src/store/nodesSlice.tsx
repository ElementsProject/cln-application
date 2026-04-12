import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { NodeProfile, NodesState } from '../types/node.type';
import { defaultNodesState } from './nodesSelectors';

const nodesSlice = createSlice({
  name: 'nodes',
  initialState: defaultNodesState,
  reducers: {
    setNodeProfiles(state, action: PayloadAction<{ profiles: NodeProfile[]; activeProfileId?: string | null; isConnected?: boolean }>) {
      state.profiles = action.payload.profiles || [];
      if (action.payload.activeProfileId !== undefined) {
        state.activeProfileId = action.payload.activeProfileId;
      }
      if (action.payload.isConnected !== undefined) {
        state.isConnected = action.payload.isConnected;
      }
      state.isLoading = false;
      state.error = null;
    },
    setActiveProfileId(state, action: PayloadAction<string | null>) {
      state.activeProfileId = action.payload;
    },
    setIsSwitching(state, action: PayloadAction<boolean>) {
      state.isSwitching = action.payload;
    },
    setIsDiscovering(state, action: PayloadAction<boolean>) {
      state.isDiscovering = action.payload;
    },
    setHasFactoryPlugin(state, action: PayloadAction<boolean>) {
      state.hasFactoryPlugin = action.payload;
    },
    setNodesError(state, action: PayloadAction<any>) {
      state.error = action.payload;
      state.isLoading = false;
    },
    clearNodesStore() {
      return defaultNodesState;
    },
  },
});

export const {
  setNodeProfiles,
  setActiveProfileId,
  setIsSwitching,
  setIsDiscovering,
  setHasFactoryPlugin,
  setNodesError,
  clearNodesStore,
} = nodesSlice.actions;

export default nodesSlice.reducer;
