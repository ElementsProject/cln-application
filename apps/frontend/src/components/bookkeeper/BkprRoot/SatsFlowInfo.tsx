import React from 'react';

import './SatsFlowInfo.scss';

interface SatsFlowInfoProps {
  label: string;
  value: number;
}

const SatsFlowInfo: React.FC<SatsFlowInfoProps> = ({ label, value }) => {
  const getValueColor = () => {
    if (value > 0) return 'positive-value';
    if (value < 0) return 'negative-value';
    return 'text-primary';
  };

  return (
    <div className="mt-3 d-flex flex-column align-items-start">
      <span className="fs-7 text-dark">{label}</span>
      <span className={`fs-3 fw-bold ${getValueColor()}`}>{value}</span>
    </div>
  );
};

export default SatsFlowInfo;
