import React from 'react';

import './VolumeInfo.scss';

interface VolumeInfoProps {
  bestRoutingChannel: string;
  worstRoutingChannel: string;
}

const VolumeInfo: React.FC<VolumeInfoProps> = ({ bestRoutingChannel, worstRoutingChannel }) => {
  return (
    <>
      <div className="mt-3 d-flex flex-column align-items-start">
        <span className="fs-7 text-dark">Channel w/Most Traffic</span>
        <span className={`mt-1 fs-7 fw-bold best-channel`}>{bestRoutingChannel}</span>
      </div>
      <div className="mt-3 d-flex flex-column align-items-start">
        <span className="fs-7 text-dark">Channel w/Least Traffic</span>
        <span className={`mt-1 fs-7 fw-bold worst-channel`}>{worstRoutingChannel}</span>
      </div>
    </>
  );
};

export default VolumeInfo;
