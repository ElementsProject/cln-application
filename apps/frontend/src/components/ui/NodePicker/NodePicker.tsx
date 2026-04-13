import './NodePicker.scss';
import { Dropdown, Spinner, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { useInjectReducer } from '../../../hooks/use-injectreducer';
import nodesReducer from '../../../store/nodesSlice';
import { setIsSwitching, setIsDiscovering, setActiveProfileId, setNodeProfiles } from '../../../store/nodesSlice';
import { selectNodeProfiles, selectActiveProfile, selectIsSwitchingNode, selectHasMultipleNodes, selectActiveProfileId, selectIsConnected, selectIsDiscovering } from '../../../store/nodesSelectors';
import { selectNodeInfo } from '../../../store/rootSelectors';
import { NodesService, RootService, CLNService, BookkeeperService, FactoriesService } from '../../../services/http.service';
import { clearRootStore } from '../../../store/rootSlice';
import { clearCLNStore } from '../../../store/clnSlice';
import { clearBKPRStore } from '../../../store/bkprSlice';
import { clearFactoriesStore } from '../../../store/factoriesSlice';
import { appStore } from '../../../store/appStore';
import { truncatePubkey } from '../../../utilities/data-formatters';
import logger from '../../../services/logger.service';

const NodePicker = () => {
  useInjectReducer('nodes', nodesReducer);
  const { pathname } = useLocation();

  const profiles = useSelector(selectNodeProfiles);
  const activeProfile = useSelector(selectActiveProfile);
  const activeProfileId = useSelector(selectActiveProfileId);
  const isSwitching = useSelector(selectIsSwitchingNode);
  const isConnected = useSelector(selectIsConnected);
  const isDiscovering = useSelector(selectIsDiscovering);
  const hasMultipleNodes = useSelector(selectHasMultipleNodes);
  const nodeInfo = useSelector(selectNodeInfo);

  const handleSwitchNode = async (profileId: string) => {
    if (profileId === activeProfileId || isSwitching) return;

    try {
      appStore.dispatch(setIsSwitching(true));

      // Call switch endpoint
      const result = await NodesService.switchNode(profileId);

      // Clear all stores
      appStore.dispatch(clearRootStore());
      appStore.dispatch(clearCLNStore());
      appStore.dispatch(clearBKPRStore());
      appStore.dispatch(clearFactoriesStore());

      // Update active profile
      appStore.dispatch(setActiveProfileId(result.profile?.id || profileId));

      // Re-fetch root data (nodeInfo, balances, channels)
      await RootService.fetchRootData();
      await RootService.refreshData();

      // Re-fetch route-specific data immediately so the current page populates
      // without waiting up to 30s for the next poll tick
      if (pathname.includes('/bookkeeper')) {
        await BookkeeperService.fetchBKPRData();
      } else if (pathname.includes('/factories')) {
        await FactoriesService.fetchFactoriesData();
      } else {
        await CLNService.fetchCLNData();
      }

      // Re-fetch node profiles and detect factory plugin
      await NodesService.fetchAndDispatchNodes();
      await NodesService.detectFactoryPlugin();
    } catch (error) {
      logger.error('Failed to switch node:', error);
    } finally {
      appStore.dispatch(setIsSwitching(false));
    }
  };

  const handleDiscover = async () => {
    if (isDiscovering) return;
    try {
      appStore.dispatch(setIsDiscovering(true));
      const result = await NodesService.discoverNodes();
      if (result.profiles && result.profiles.length > 0) {
        // Re-fetch profile list
        await NodesService.fetchAndDispatchNodes();
        const nodeData = await NodesService.listNodes();
        // If not connected yet, auto-switch to the first discovered node
        if (!nodeData.activeProfileId && result.profiles.length > 0) {
          await handleSwitchNode(result.profiles[0].id);
        } else if (nodeData.activeProfileId && !nodeData.isConnected) {
          // Profile exists but not connected — reconnect
          await handleSwitchNode(nodeData.activeProfileId);
        }
      }
    } catch (error) {
      logger.error('Failed to discover nodes:', error);
    } finally {
      appStore.dispatch(setIsDiscovering(false));
    }
  };

  const getNetworkBadgeVariant = (network?: string) => {
    if (!network || network === 'bitcoin') return null;
    return network === 'regtest' ? 'danger' : 'warning';
  };

  // Determine display alias and status based on nodeInfo
  const displayAlias = activeProfile?.alias
    || nodeInfo.alias?.replace('--', '-').replace(/-\d+-.*$/, '')
    || activeProfile?.label
    || 'Node';
  const displayPubkey = activeProfile?.pubkey || nodeInfo.id || '';

  // Status dot logic
  const getStatusDot = () => {
    if (isSwitching || (nodeInfo.isLoading)) {
      return (
        <OverlayTrigger
          placement='auto'
          delay={{ show: 250, hide: 250 }}
          overlay={<Tooltip>{isSwitching ? 'Switching' : 'Loading'}</Tooltip>}
        >
          <span className='d-inline-block me-2 dot bg-warning'></span>
        </OverlayTrigger>
      );
    }
    if (nodeInfo.error) {
      return (
        <OverlayTrigger
          placement='auto'
          delay={{ show: 250, hide: 250 }}
          overlay={<Tooltip>Error</Tooltip>}
        >
          <span className='d-inline-block me-2 dot bg-danger'></span>
        </OverlayTrigger>
      );
    }
    return (
      <OverlayTrigger
        placement='auto'
        delay={{ show: 250, hide: 250 }}
        overlay={<Tooltip>Connected</Tooltip>}
      >
        <span className='d-inline-block me-2 dot bg-success'></span>
      </OverlayTrigger>
    );
  };

  // Determine if we're actually connected — nodeInfo having an id means commando works
  const actuallyConnected = isConnected || !!nodeInfo.id;

  // No connection and no profiles — show scan button
  if (!actuallyConnected && profiles.length === 0 && !nodeInfo.isLoading && !nodeInfo.error) {
    return (
      <span className='fs-7 d-flex align-items-center'>
        <OverlayTrigger placement='auto' delay={{ show: 250, hide: 250 }} overlay={<Tooltip>Disconnected</Tooltip>}>
          <span className='d-inline-block me-2 dot bg-danger'></span>
        </OverlayTrigger>
        <button
          className='btn btn-sm btn-outline-warning btn-rounded px-3'
          onClick={handleDiscover}
          disabled={isDiscovering}
        >
          {isDiscovering ? <><Spinner animation='border' size='sm' className='me-1' /> Scanning...</> : 'Scan for Nodes'}
        </button>
      </span>
    );
  }

  // Single node, no dropdown needed
  if (!hasMultipleNodes) {
    return (
      <span className='fs-7 d-flex align-items-center'>
        {getStatusDot()}
        {isSwitching ? (
          <>
            <Spinner animation='border' size='sm' className='me-2' />
            Switching...
          </>
        ) : nodeInfo.isLoading ? (
          'Loading...'
        ) : nodeInfo.error ? (
          'Error: ' + nodeInfo.error
        ) : (
          <>
            {displayAlias}
            {displayPubkey && (
              <span className='ms-1 opacity-75'>({truncatePubkey(displayPubkey)})</span>
            )}
            {nodeInfo.version && <span className='ms-1'>({nodeInfo.version})</span>}
          </>
        )}
      </span>
    );
  }

  // Multiple nodes: show dropdown
  return (
    <Dropdown className='node-picker d-inline-flex align-items-center'>
      <span className='d-flex align-items-center'>
        {getStatusDot()}
      </span>
      <Dropdown.Toggle variant='link' className='node-picker-toggle text-light p-0 fs-7'>
        {isSwitching ? (
          <>
            <Spinner animation='border' size='sm' className='me-1' />
            Switching...
          </>
        ) : nodeInfo.isLoading ? (
          'Loading...'
        ) : nodeInfo.error ? (
          'Error: ' + nodeInfo.error
        ) : (
          <>
            {displayAlias}
            {displayPubkey && (
              <span className='ms-1 opacity-75'>({truncatePubkey(displayPubkey)})</span>
            )}
          </>
        )}
      </Dropdown.Toggle>
      <Dropdown.Menu>
        {profiles.map((profile) => {
          const isActive = profile.id === activeProfileId;
          const badgeVariant = getNetworkBadgeVariant(profile.network);
          return (
            <Dropdown.Item
              key={profile.id}
              className='node-item'
              onClick={() => handleSwitchNode(profile.id)}
              active={isActive}
            >
              <span
                className='node-dot'
                style={{ backgroundColor: isActive ? '#33db95' : '#9f9f9f' }}
              ></span>
              <div className='node-details'>
                <div className='node-alias'>{profile.alias || profile.label}</div>
                <div className='node-pubkey'>{truncatePubkey(profile.pubkey)}</div>
              </div>
              {badgeVariant && (
                <span className={`node-network-badge badge bg-${badgeVariant} text-dark`}>
                  {profile.network}
                </span>
              )}
            </Dropdown.Item>
          );
        })}
        <Dropdown.Divider />
        <Dropdown.Item className='node-item' onClick={handleDiscover} disabled={isDiscovering}>
          {isDiscovering ? <><Spinner animation='border' size='sm' className='me-1' /> Scanning...</> : 'Rescan for Nodes'}
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default NodePicker;
