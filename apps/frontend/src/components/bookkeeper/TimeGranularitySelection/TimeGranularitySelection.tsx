import { useContext } from "react"
import { AppContext } from "../../../store/AppContext"
import PerfectScrollbar from 'react-perfect-scrollbar';
import { Col, Dropdown } from "react-bootstrap";
import { TimeGranularity } from "../../../utilities/constants";

const TimeGranularitySelection = (props) => {
   const onTimeGranularityChanged = (timeGranularity) => {
     props.onTimeGranularityChanged(timeGranularity);
   };

  return (
    <>
      <Dropdown className={props.className} onSelect={onTimeGranularityChanged} data-testid='time-granularity-selection'>
        <Dropdown.Toggle variant='outline border-gray-300 d-flex align-items-center'>
          <Col>
            {props.timeGranularity}
          </Col>
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
