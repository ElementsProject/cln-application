import './CLNHome.scss';
import { Row, Col } from 'react-bootstrap';
import Overview from '../Overview/Overview';
import BTCCard from '../BTCCard/BTCCard';
import CLNCard from '../CLNCard/CLNCard';
import ChannelsCard from '../ChannelsCard/ChannelsCard';
import Header from '../../ui/Header/Header';
import { useSelector } from 'react-redux';
import { useInjectReducer } from '../../../hooks/use-injectreducer';
import clnReducer from '../../../store/clnSlice';
import { selectNodeInfo } from '../../../store/rootSelectors';

function CLNHome() {
  useInjectReducer('cln', clnReducer);
  const nodeInfo = useSelector(selectNodeInfo);

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
    <>
    <div data-testid='cln-container'>
      <Header />
      <Row>
        <Col className='mx-1'>
          <Overview />
        </Col>
      </Row>
      <Row className='px-3'>
        <Col xs={12} lg={4} className='cards-container'>
          <BTCCard />
        </Col>
        <Col xs={12} lg={4} className='cards-container'>
          <CLNCard />
        </Col>
        <Col xs={12} lg={4} className='cards-container'>
          <ChannelsCard />
        </Col>
      </Row>
    </div>
    </>
  );
}

export default CLNHome;
