import { useCallback, useContext, useEffect, useRef, useState } from "react"
import { AppContext } from "../../../store/AppContext"
import { VolumeData } from "../../../types/lightning-volume.type";
import useHttp from "../../../hooks/use-http";
import { Card, Container, Row, Col } from "react-bootstrap";
import VolumeGraph from "./VolumeGraph/VolumeGraph";

const VolumeRoot = (props) => {
  const appCtx = useContext(AppContext);
  const [containerWidth, setContainerWidth] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [volumeData, setVolumeData] = useState<VolumeData>({ forwards: [], totalOutboundSat: 0, totalFeeSat: 0 });
  const { getVolumeData } = useHttp();

  const updateWidth = () => {
    if (containerRef.current) {
      setContainerWidth(containerRef.current.getBoundingClientRect().width);
    }
  };

  const fetchVolumeData = useCallback(async () => {
    getVolumeData()
      .then((response: VolumeData) => {
        setVolumeData(response);
      })
      .catch(err => {
        console.error("fetchVolumeData error " + err);
      })
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  useEffect(() => {
    if (appCtx.authStatus.isAuthenticated) {
      fetchVolumeData();
    }
  }, [appCtx.authStatus.isAuthenticated, fetchVolumeData]);

  return (
    <div data-testid='volume-container' ref={containerRef}>
      <Card className='d-flex align-items-stretch inner-box-shadow'>
        <Card.Header className='p-2'>
          <Container fluid>
            <Row>
              <Col md={2}>
                <div className='fs-4 p-0 ps-3 mt-2 fw-bold'>
                  Volume
                </div>
              </Col>
            </Row>
          </Container>
        </Card.Header>
        <Card.Body className='pb-4 d-flex flex-column align-items-center'>
          <Row>
            <VolumeGraph volumeData={volumeData} width={containerWidth} />
          </Row>
        </Card.Body>
      </Card>
    </div>
  )

};

export default VolumeRoot;
