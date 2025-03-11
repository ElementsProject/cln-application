import { Card, Col, Placeholder, Row, Spinner } from "react-bootstrap";

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

export const EmptyCard = (props) => {
  return (
    <Card className='mt-5 cards-container inner-box-shadow p-5'>
      <Placeholder animation='glow'>
        <Placeholder xs={12} />
      </Placeholder>
      <Col xs={12} className='mt-3 d-flex justify-content-center'>Loading...</Col>
    </Card>
  );
}