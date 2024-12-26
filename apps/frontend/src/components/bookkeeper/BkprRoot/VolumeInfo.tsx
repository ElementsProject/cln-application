import React from 'react';

import './VolumeInfo.scss';

interface VolumeInfoProps {
  bestRoute?: string;
  worstRoute?: string;
}

const VolumeInfo: React.FC<VolumeInfoProps> = ({ bestRoute, worstRoute }) => {
  return (
    <>
      <div className="mt-3 d-flex flex-column align-items-start">
        <span className="fs-7 text-dark">Route w/Most Traffic</span>
        <span className={`mt-1 fs-7 fw-bold best-channel`}>{bestRoute}</span>
      </div>
      <div className="mt-3 d-flex flex-column align-items-start">
        <span className="fs-7 text-dark">Route w/Least Traffic</span>
        <span className={`mt-1 fs-7 fw-bold worst-channel`}>{worstRoute}</span>
      </div>
    </>
  );
};

export default VolumeInfo;
