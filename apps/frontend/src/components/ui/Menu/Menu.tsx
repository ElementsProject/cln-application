import './Menu.scss';
import { Link, useLocation } from 'react-router-dom';
import Dropdown from 'react-bootstrap/Dropdown';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated, selectNodeInfo } from '../../../store/rootSelectors';
import { HomeSVG } from '../../../svgs/Home';
import { BookkeeperSVG } from '../../../svgs/Bookkeeper';
import { FactorySVG } from '../../../svgs/Factory';

const menuItems = [
  { path: '/cln', label: 'Dashboard', icon: HomeSVG },
  { path: '/bookkeeper', label: 'Bookkeeper', icon: BookkeeperSVG },
  { path: '/factories', label: 'Factories', icon: FactorySVG },
];

const Menu = props => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const nodeInfo = useSelector(selectNodeInfo);
  const location = useLocation();

  const isDisabled = !!(nodeInfo.error || (isAuthenticated && nodeInfo.isLoading));
  const currentItem = menuItems.find(item => location.pathname.includes(item.path)) || menuItems[0];
  const otherItems = menuItems.filter(item => item.path !== currentItem.path);
  const CurrentIcon = currentItem.icon;

  return (
    <Dropdown
      className={isDisabled ? 'me-2 menu-dropdown dropdown-disabled' : 'me-2 menu-dropdown'}
      data-testid="menu"
    >
      <Dropdown.Toggle
        variant={props.compact ? '' : 'primary'}
        disabled={isDisabled}
        className={
          props.compact
            ? 'd-flex align-items-center justify-content-between btn-rounded btn-compact btn-menu'
            : 'd-flex align-items-center justify-content-between btn-rounded btn-menu'
        }
      >
        <span className={props.compact ? '' : 'me-3'}>
          <span className={props.compact ? '' : 'me-2'}>{props.compact ? '' : currentItem.label}</span>
          <CurrentIcon className={isDisabled ? 'svg-fill-disabled' : ''} />
        </span>
      </Dropdown.Toggle>
      <Dropdown.Menu>
        {otherItems.map(item => {
          const Icon = item.icon;
          return (
            <Dropdown.Item key={item.path} as={Link} to={item.path}>
              <Icon className='me-2' />
              {item.label}
            </Dropdown.Item>
          );
        })}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default Menu;
