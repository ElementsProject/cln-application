import './StatusAlert.scss';
import { motion } from 'framer-motion';
import { CallStatus, OPACITY_VARIANTS } from '../../../utilities/constants';
import Spinner from 'react-bootstrap/Spinner';

import { titleCase } from '../../../utilities/data-formatters';
import { InformationSVG } from '../../../svgs/Information';

const StatusAlert = props => {
  return (
    (props.responseStatus !== CallStatus.NONE) ?
      <motion.div 
        className={'w-100 d-flex align-items-start justify-content-start alert alert-' + (props.responseStatus === CallStatus.ERROR ? 'danger' : props.responseStatus === CallStatus.PENDING ? 'warning' : props.responseStatus === CallStatus.SUCCESS ? 'success' : '')}
        initial='hidden'
        animate='visible'
        exit='hidden'
        variants={OPACITY_VARIANTS}
        transition={{ ease: "easeOut", duration: 1 }}
      >
        {props.responseStatus === CallStatus.PENDING ? <Spinner className='me-2' variant='primary' size='sm' /> : <InformationSVG svgClassName='mt-2px information-svg' className={props.responseStatus === CallStatus.ERROR ? 'fill-danger' : 'fill-success'} />}
        {titleCase(props.responseMessage)}
      </motion.div>
    :
      <></>
  );
};

export default StatusAlert;
