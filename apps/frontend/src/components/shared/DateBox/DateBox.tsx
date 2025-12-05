import './DateBox.scss';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { convertIntoDateFormat } from '../../../utilities/data-formatters';

const DateBox = props => {
  const content = (
    <div className={props.className} data-testid="overlay-trigger">
      {convertIntoDateFormat(props.dataValue)}
    </div>
  );

  if (!props.showTooltip) {
    return content;
  }

  return (
    <OverlayTrigger
      placement="top"
      delay={{ show: 250, hide: 250 }}
      overlay={<Tooltip data-testid="tooltip">{props.dataType}</Tooltip>}
    >
      {content}
    </OverlayTrigger>
  );
};

export default DateBox;
