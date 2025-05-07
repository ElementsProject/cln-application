import './BkprHome.scss';
import { useLocation } from 'react-router-dom';
import { Row, Col } from 'react-bootstrap';
import RouteTransition from '../../ui/RouteTransition/RouteTransition';
import SatsFlowInfo from './SatsFlowInfo/SatsFlowInfo';
import VolumeInfo from './VolumeInfo/VolumeInfo';
import Overview from '../../cln/Overview/Overview';
import Header from '../../ui/Header/Header';
import AccountEventsInfo from './AccountEventsInfo/AccountEventsInfo';
import { useSelector } from 'react-redux';
import { useInjectReducer } from '../../../hooks/use-injectreducer';
import bkprReducer from '../../../store/bkprSlice';
import { selectNodeInfo } from '../../../store/rootSelectors';

const Bookkeeper = () => {
  useInjectReducer('bkpr', bkprReducer);
  const nodeInfo = useSelector(selectNodeInfo);
  const location = useLocation();
  
  if (nodeInfo.error) {
    return (
      <Row className='message invalid mt-10'>
        <Col xs={12} className='d-flex align-items-center justify-content-center'>
          {nodeInfo.error}
        </Col>
      </Row>
    );
  }

  return (
    <div data-testid='bookkeeper-dashboard-container' className='d-flex flex-column justify-content-stretch'>
      <Header />
      <RouteTransition />
      {location.pathname === '/bookkeeper' && (
        <>
        <Row>
          <Col className='mx-1'>
            <Overview />
          </Col>
        </Row>
        <Row className='px-3'>
          <Col xs={12} lg={6} className='cards-container' data-testid='account-event-info-container'>
            <AccountEventsInfo />
          </Col>
          <Col xs={12} lg={6} className='cards-container d-flex flex-column justify-content-between' data-testid='satsflow-volume-container'>
            <SatsFlowInfo />
            <VolumeInfo />
          </Col>
        </Row>
        </>
      )}
    </div>
  );
};

export default Bookkeeper;
