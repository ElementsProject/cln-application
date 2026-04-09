import './Menu.scss';
import { Link, useLocation } from 'react-router-dom';
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

  return (
    <div className='d-flex align-items-center menu-nav' data-testid='menu'>
      {menuItems.map(item => {
        const Icon = item.icon;
        const isActive = location.pathname.includes(item.path);
        return (
          <Link
            key={item.path}
            to={isDisabled ? '#' : item.path}
            className={
              'btn btn-sm btn-rounded menu-nav-btn me-1 d-flex align-items-center' +
              (isActive ? ' menu-nav-btn-active' : '') +
              (isDisabled ? ' disabled' : '')
            }
            onClick={(e) => isDisabled && e.preventDefault()}
          >
            <Icon className={isDisabled ? 'svg-fill-disabled' : isActive ? '' : ''} />
            {!props.compact && <span className='ms-1'>{item.label}</span>}
          </Link>
        );
      })}
    </div>
  );
};

export default Menu;
