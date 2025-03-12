import React, { useReducer } from 'react';
import { ApplicationActions } from '../utilities/constants';
import logger from '../services/logger.service';
import { GLNodeCapacity, GLNodeInfo, LSPList } from '../types/greenlight.type';

interface GLState {
  nodeInfo: GLNodeInfo;
  nodeCapacity: GLNodeCapacity;
  lspList: LSPList;
}

const defaultGLState: GLState = {
  nodeInfo: {isLoading: true, alias: '', version: '', error: null },
  nodeCapacity: {isLoading: true, inbound: 0, outbound: 0, error: null },
  lspList: { isLoading: true, glLSPS: [], error: null }
};

const glReducer = (state, action) => {
  logger.info('GL State: ', state);
  switch (action.type) {
    case ApplicationActions.SET_GL_NODE_INFO:
      return { ...state, nodeInfo: action.payload };
    case ApplicationActions.SET_GL_NODE_CAPACITY:
      return { ...state, nodeCapacity: action.payload };
    case ApplicationActions.SET_LSP_LIST:
      return { ...state, lspList: action.payload };
    case ApplicationActions.CLEAR_CONTEXT:
      return defaultGLState;
    default:
      return state;
  }
};

const GLContext = React.createContext({
  ...defaultGLState,
  setNodeInfo: (info: GLNodeInfo) => { },
  setNodeCapacity: (capacity: GLNodeCapacity) => { },
  setLSPList: (lsps: LSPList) => { },
  clearStore: () => { },
});

const GLProvider: React.PropsWithChildren<any> = (props) => {
  const [glState, dispatchGLAction] = useReducer(glReducer, defaultGLState);

  const setNodeInfoHandler = (info: GLNodeInfo) => {
    dispatchGLAction({ type: ApplicationActions.SET_GL_NODE_INFO, payload: info });
  };

  const setNodeCapacityHandler = (capacity: GLNodeCapacity) => {
    dispatchGLAction({ type: ApplicationActions.SET_GL_NODE_CAPACITY, payload: capacity });
  };

  const setLSPListHandler = (lsps: LSPList) => {
    dispatchGLAction({ type: ApplicationActions.SET_LSP_LIST, payload: lsps });
  };

  const clearContextHandler = () => {
    dispatchGLAction({ type: ApplicationActions.CLEAR_CONTEXT });
  };

  const glContext = {
    ...glState,
    setNodeInfo: setNodeInfoHandler,
    setNodeCapacity: setNodeCapacityHandler,
    setLSPList: setLSPListHandler,
    clearStore: clearContextHandler,
  };

  return <GLContext.Provider value={glContext}>{props.children}</GLContext.Provider>;

};

export { GLProvider, GLContext };
