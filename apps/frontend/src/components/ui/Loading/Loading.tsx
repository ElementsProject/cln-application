import { Col, Row, Spinner } from "react-bootstrap";

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
