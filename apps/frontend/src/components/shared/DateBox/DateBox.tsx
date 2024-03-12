import React from 'react';

import './DateBox.scss';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Tooltip from 'react-bootstrap/Tooltip';
import { convertIntoDateFormat } from '../../../utilities/data-formatters';

const DateBox = props => {

  return (
    <OverlayTrigger
      placement='top'
      delay={{ show: 250, hide: 250 }}
      overlay={(props.showTooltip ? <Tooltip data-testid='tooltip'>{props.dataType}</Tooltip> : <></>)}
      >
      <div className={props.className} data-testid='overlay-trigger'>
        {convertIntoDateFormat(props.dataValue)}
      </div>
    </OverlayTrigger>
  );
};

export default DateBox;
