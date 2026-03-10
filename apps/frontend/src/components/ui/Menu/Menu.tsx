import './Menu.scss';
import { Link, useLocation } from 'react-router-dom';
import Dropdown from 'react-bootstrap/Dropdown';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated, selectNodeInfo } from '../../../store/rootSelectors';
import { HomeSVG } from '../../../svgs/Home';
import { BookkeeperSVG } from '../../../svgs/Bookkeeper';

const Menu = props => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const nodeInfo = useSelector(selectNodeInfo);
  const location = useLocation();

  return (
    <Dropdown
      as={Link} to={location.pathname.includes('/bookkeeper') ? '/cln' : '/bookkeeper'}
      className={
        !!(nodeInfo.error || (isAuthenticated && nodeInfo.isLoading))
          ? 'me-2 menu-dropdown dropdown-disabled'
          : 'me-2 menu-dropdown'
      }
      data-testid="menu"
    >
      <Dropdown.Toggle
        variant={props.compact ? '' : 'primary'}
        disabled={!!(nodeInfo.error || (isAuthenticated && nodeInfo.isLoading))}
        className={
          props.compact
            ? 'd-flex align-items-center justify-content-between btn-rounded btn-compact btn-menu'
            : 'd-flex align-items-center justify-content-between btn-rounded btn-menu'
        }
      >
        <span className={props.compact ? '' : 'me-3'}>
          <span className={props.compact ? '' : 'me-2'}>{props.compact ? '' : location.pathname.includes('bookkeeper') ? 'Dashboard' : 'Bookkeeper'}</span>
          {location.pathname.includes('bookkeeper') ? <HomeSVG className={((!!nodeInfo.error || (isAuthenticated && nodeInfo.isLoading)) ? 'svg-fill-disabled' : '')} /> : <BookkeeperSVG className={((!!nodeInfo.error || (isAuthenticated && nodeInfo.isLoading)) ? 'svg-fill-disabled' : '')} />}
        </span>
      </Dropdown.Toggle>
    </Dropdown>
  );
};

export default Menu;
