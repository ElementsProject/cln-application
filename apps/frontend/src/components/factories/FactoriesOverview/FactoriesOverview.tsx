import { useEffect } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { Card, Col, Row, Spinner, Alert } from 'react-bootstrap';
import { COUNTUP_DURATION } from '../../../utilities/constants';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from '../../../store/rootSelectors';
import { selectFactoryCounts, selectFactoriesLoading, selectFactoriesError } from '../../../store/factoriesSelectors';
import { FactorySVG } from '../../../svgs/Factory';

const FactoriesOverview = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const counts = useSelector(selectFactoryCounts);
  const isLoading = useSelector(selectFactoriesLoading);
  const error = useSelector(selectFactoriesError);

  const countTotal: any = useMotionValue(0);
  const roundedTotal: any = useTransform(countTotal, Math.round);
  const countChannels: any = useMotionValue(0);
  const roundedChannels: any = useTransform(countChannels, Math.round);

  useEffect(() => {
    const anim = animate(countTotal, counts.total, { duration: COUNTUP_DURATION });
    return anim.stop;
  }, [counts.total, countTotal]);

  useEffect(() => {
    const anim = animate(countChannels, counts.totalChannels, { duration: COUNTUP_DURATION });
    return anim.stop;
  }, [counts.totalChannels, countChannels]);

  return (
    <Row className='mx-1 align-items-stretch'>
      <Col xs={6} lg={3} className='d-lg-flex d-xl-flex mb-4'>
        <Card className='card overview-balance-card w-100' data-testid='factories-total-card'>
          <Card.Body className='d-flex align-items-center'>
            <Row className='flex-fill'>
              <Col xs={8}>
                <div className='fs-6 fw-bold'>Factories</div>
                {isAuthenticated && isLoading ?
                  <Spinner animation='grow' variant='secondary' /> :
                  error ?
                    <Alert className='py-0 px-1 fs-7' variant='danger'>{error}</Alert> :
                    <motion.div className='fs-4 fw-bold text-dark-primary'>{roundedTotal}</motion.div>
                }
              </Col>
              <Col xs={4} className='d-flex align-items-center justify-content-end'>
                <FactorySVG />
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Col>
      <Col xs={6} lg={3} className='d-lg-flex d-xl-flex mb-4'>
        <Card className='card overview-balance-card w-100'>
          <Card.Body className='d-flex align-items-center'>
            <Row className='flex-fill'>
              <Col xs={12}>
                <div className='fs-6 fw-bold'>Channels</div>
                {isAuthenticated && isLoading ?
                  <Spinner animation='grow' variant='secondary' /> :
                  <motion.div className='fs-4 fw-bold text-dark-primary'>{roundedChannels}</motion.div>
                }
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Col>
      <Col xs={12} lg={6} className='mb-4'>
        <Card className='inner-box-shadow h-100'>
          <Card.Body className='px-4'>
            <Row className='h-100'>
              <Col xs={3} className='d-flex align-items-center justify-content-center'>
                <div className='text-center'>
                  <div className='fs-4 fw-bold text-success'>{counts.active}</div>
                  <div className='text-light-white fs-7'>Active</div>
                </div>
              </Col>
              <Col xs={3} className='d-flex align-items-center justify-content-center'>
                <div className='text-center'>
                  <div className='fs-4 fw-bold text-primary'>{counts.signed}</div>
                  <div className='text-light-white fs-7'>Signed</div>
                </div>
              </Col>
              <Col xs={3} className='d-flex align-items-center justify-content-center'>
                <div className='text-center'>
                  <div className='fs-4 fw-bold text-warning'>{counts.init}</div>
                  <div className='text-light-white fs-7'>Init</div>
                </div>
              </Col>
              <Col xs={3} className='d-flex align-items-center justify-content-center'>
                <div className='text-center'>
                  <div className={'fs-4 fw-bold ' + (counts.expired > 0 ? 'text-danger' : 'text-light')}>{counts.dying + counts.expired}</div>
                  <div className='text-light-white fs-7'>Dying/Exp</div>
                </div>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default FactoriesOverview;
