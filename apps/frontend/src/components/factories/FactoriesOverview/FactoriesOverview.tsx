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
  const countActive: any = useMotionValue(0);
  const roundedActive: any = useTransform(countActive, Math.round);

  useEffect(() => {
    const anim = animate(countTotal, counts.total, { duration: COUNTUP_DURATION });
    return anim.stop;
  }, [counts.total, countTotal]);

  useEffect(() => {
    const anim = animate(countActive, counts.active, { duration: COUNTUP_DURATION });
    return anim.stop;
  }, [counts.active, countActive]);

  return (
    <Row className='mx-1 align-items-stretch'>
      <Col xs={12} lg={3} className='d-lg-flex d-xl-flex mb-4'>
        <Card className='card overview-balance-card w-100' data-testid='factories-total-card'>
          <Card.Body className='d-flex align-items-center'>
            <Row className='flex-fill'>
              <Col xs={8} data-testid='factories-total-col'>
                <div className='fs-6 fw-bold'>Total Factories</div>
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
      <Col xs={12} lg={9} className='mb-4'>
        <Card className='inner-box-shadow h-100' data-testid='factories-counts-card'>
          <Card.Body className='px-4'>
            <Row className='h-100'>
              <Col xs={6} md={3} className='d-flex align-items-center justify-content-start'>
                <div>
                  <div className='text-light-white'>Active</div>
                  <div className='fs-4 fw-bold text-dark-primary'>
                    {isAuthenticated && isLoading ?
                      <Spinner animation='grow' variant='primary' /> :
                      error ?
                        <Alert className='py-0 px-1 fs-7' variant='danger'>{error}</Alert> :
                        <motion.div>{roundedActive}</motion.div>
                    }
                  </div>
                </div>
              </Col>
              <Col xs={6} md={3} className='d-flex align-items-center justify-content-start'>
                <div>
                  <div className='text-light-white'>Initializing</div>
                  <div className='fs-4 fw-bold text-dark-primary'>{counts.init}</div>
                </div>
              </Col>
              <Col xs={6} md={3} className='d-flex align-items-center justify-content-start'>
                <div>
                  <div className='text-light-white'>Dying</div>
                  <div className='fs-4 fw-bold text-warning'>{counts.dying}</div>
                </div>
              </Col>
              <Col xs={6} md={3} className='d-flex align-items-center justify-content-start'>
                <div>
                  <div className='text-light-white'>Expired</div>
                  <div className='fs-4 fw-bold text-danger'>{counts.expired}</div>
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
