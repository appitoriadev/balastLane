import { NavLink } from 'react-router-dom';
import Icon from '../ui/Icon';

const NAV_ITEMS = [
  { to: '/dashboard', icon: 'home', label: 'Home'     },
  { to: '/expenses',  icon: 'list', label: 'Expenses' },
  { to: '/profile',   icon: 'user', label: 'Profile'  },
];

/**
 * Fixed bottom navigation for mobile — hidden on sm+ screens.
 * The centre "Add" FAB navigates to /expenses where the modal can be triggered.
 */
export default function BottomNav() {
  return (
    <nav
      className="sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex items-center justify-around z-40"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      {/* Home */}
      <BottomNavItem to="/dashboard" icon="home" label="Home" />

      {/* Expenses */}
      <BottomNavItem to="/expenses" icon="list" label="Expenses" />

      {/* Centre FAB — links to expenses list */}
      <NavLink
        to="/expenses"
        aria-label="Add expense"
        className="relative -top-3 w-14 h-14 rounded-full bg-primary-500 flex items-center justify-center shadow-primary text-white"
      >
        <Icon name="plus" size={24} />
      </NavLink>

      {/* Profile */}
      <BottomNavItem to="/profile" icon="user" label="Profile" />

      {/* Spacer so items are evenly spaced around the FAB */}
      <div className="w-14" aria-hidden="true" />
    </nav>
  );
}

function BottomNavItem({ to, icon, label }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        [
          'flex flex-col items-center gap-1 flex-1 py-2 text-xs font-medium transition-colors',
          isActive ? 'text-primary-500' : 'text-gray-500',
        ].join(' ')
      }
    >
      {({ isActive }) => (
        <>
          <Icon name={icon} size={22} className={isActive ? 'text-primary-500' : 'text-gray-400'} />
          <span>{label}</span>
        </>
      )}
    </NavLink>
  );
}
