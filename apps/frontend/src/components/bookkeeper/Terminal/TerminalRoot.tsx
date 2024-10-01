import { useRef } from "react";
import { Card, Container, Row, Col } from "react-bootstrap";
import TerminalComponent from "./TerminalComponent/TerminalComponent";

const Terminal = (props) => {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={containerRef}>
      <Card className='inner-box-shadow'>
        <Card.Header className='p-2'>
          <Container fluid>
            <Row>
              <Col md={2}>
                <div className='fs-4 p-0 ps-3 mt-2 fw-bold'>
                  Terminal
                </div>
              </Col>
            </Row>
          </Container>
        </Card.Header>
        <Card.Body className='pb-4 ms-4 me-4 h-auto'>
          <TerminalComponent />
        </Card.Body>
      </Card>
    </div>
  )
};

export default Terminal;
