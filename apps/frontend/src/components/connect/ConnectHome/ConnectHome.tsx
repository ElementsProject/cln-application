import './ConnectHome.scss';
import { Row, Col } from 'react-bootstrap';
import Header from '../../ui/Header/Header';
import ConnectList from '../ConnectList/ConnectList';

function ConnectHome() {
  return (
    <div className='connect-container' data-testid='connect-container'>
      <Header />
      <Row className='px-3'>
        <Col xs={12} className='cards-container'>
          <ConnectList />
        </Col>
      </Row>
    </div>
  );
}

export default ConnectHome;
