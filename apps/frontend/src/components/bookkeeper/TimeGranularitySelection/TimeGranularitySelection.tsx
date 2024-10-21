import PerfectScrollbar from 'react-perfect-scrollbar';
import { Col, Dropdown } from "react-bootstrap";
import { TimeGranularity } from "../../../utilities/constants";
import './TimeGranularitySelection.scss'
import { DropdownIcon } from '../../../svgs/DropdownIcon';

const TimeGranularitySelection = (props) => {
   const onTimeGranularityChanged = (timeGranularity) => {
     props.onTimeGranularityChanged(timeGranularity);
   };

  return (
    <>
      <Dropdown className={props.className} onSelect={onTimeGranularityChanged} data-testid='time-granularity-selection'>
        <Dropdown.Toggle variant='outline d-flex align-items-center gap-1'>
          <Col>
            <span className='dropdown-toggle-text'>{props.timeGranularity}</span>
          </Col>
          <DropdownIcon />
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <PerfectScrollbar className='ps-show-always'>
            <div className='time-granularity-scroller fs-7'>
              {Object.values(TimeGranularity).map((g, i) =>
                <Dropdown.Item className='d-flex justify-content-between align-items-center' as='div' eventKey={g} key={i}>
                  <Col xs={4}>
                    <span>{g}</span>
                  </Col>
                </Dropdown.Item>
              )}
            </div>
          </PerfectScrollbar>
        </Dropdown.Menu>
      </Dropdown>
    </>
  )
}

export default TimeGranularitySelection;
