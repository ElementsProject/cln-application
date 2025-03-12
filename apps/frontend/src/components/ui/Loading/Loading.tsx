import { Col, Row, Spinner } from "react-bootstrap";
import BTCCard from "../../cln/BTCCard/BTCCard";
import ChannelsCard from "../../cln/ChannelsCard/ChannelsCard";
import CLNCard from "../../cln/CLNCard/CLNCard";
import Overview from "../../cln/Overview/Overview";
import Header from "../Header/Header";

export const Loading = () => {
  return (
    <Row className='mt-10' data-testid='row-loading'>
      <Col xs={12} className='d-flex align-items-center justify-content-center'>
        <Spinner animation='grow' variant='primary' />
      </Col>
      <Col xs={12} className='d-flex align-items-center justify-content-center'>
        <div>Loading...</div>
      </Col>
    </Row>
  );
}

export const EmptyHome = (props) => {
  return (
    <>
      <div data-testid='row-loading'>
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