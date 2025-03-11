import { Card, Col, Container, Placeholder, Row, Spinner } from "react-bootstrap";

export const Loading = () => {
  return (
    <Row className='mt-10'>
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
    <Container className={props.className} id='root-container' data-testid='container'>
      <Card className='cards-container inner-box-shadow p-4'>
        <Placeholder animation='glow'>
          <Placeholder xs={12} />
        </Placeholder>
        <Col xs={12} className='mt-3 d-flex justify-content-center'>Loading...</Col>
      </Card>
    </Container>
  );
}