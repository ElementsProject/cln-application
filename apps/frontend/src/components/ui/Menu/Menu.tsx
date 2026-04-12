import './Menu.scss';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated, selectNodeInfo } from '../../../store/rootSelectors';
import { selectHasFactoryPlugin } from '../../../store/nodesSelectors';
import { HomeSVG } from '../../../svgs/Home';
import { BookkeeperSVG } from '../../../svgs/Bookkeeper';
import { FactorySVG } from '../../../svgs/Factory';
import { ConnectSVG } from '../../../svgs/Connect';

const baseMenuItems = [
  { path: '/cln', label: 'Dashboard', icon: HomeSVG, requiresFactory: false },
  { path: '/bookkeeper', label: 'Bookkeeper', icon: BookkeeperSVG, requiresFactory: false },
  { path: '/factories', label: 'Factories', icon: FactorySVG, requiresFactory: true },
  { path: '/connect', label: 'Connect', icon: ConnectSVG, requiresFactory: true },
];

const Menu = props => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const nodeInfo = useSelector(selectNodeInfo);
  const hasFactoryPlugin = useSelector(selectHasFactoryPlugin);
  const location = useLocation();

  const isDisabled = !!(nodeInfo.error || (isAuthenticated && nodeInfo.isLoading));
  const menuItems = baseMenuItems.filter(item => !item.requiresFactory || hasFactoryPlugin);

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
