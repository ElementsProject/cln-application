import React from 'react';

import './DateBox.scss';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Tooltip from 'react-bootstrap/Tooltip';

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const DateBox = props => {

  const convertIntoDateFormat = () => {
    let newDate = new Date(props.dataValue * 1000);
    return newDate.getDate().toString().padStart(2, '0') + ' ' + MONTH_NAMES[newDate.getMonth()] + ', ' + newDate.getHours().toString().padStart(2, '0') + ':' + newDate.getMinutes().toString().padStart(2, '0');
  }

  return (
    <OverlayTrigger
      placement='top'
      delay={{ show: 250, hide: 250 }}
      overlay={(props.showTooltip ? <Tooltip>{props.dataType}</Tooltip> : <></>)}
      >
      <div className={props.className}>
        {convertIntoDateFormat()}
      </div>
    </OverlayTrigger>
  );
};

export default DateBox;
