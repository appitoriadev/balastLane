import { NavLink, useNavigate } from 'react-router-dom';
import Icon from '../ui/Icon';
import Button from '../ui/Button';
import { useAuth } from '../../contexts/AuthContext';

const NAV_ITEMS = [
  { to: '/dashboard', icon: 'home',  label: 'Dashboard' },
  { to: '/expenses',  icon: 'list',  label: 'Expenses'  },
  { to: '/profile',   icon: 'user',  label: 'Profile'   },
];

/**
 * Left sidebar navigation — visible on sm+ screens, hidden on mobile.
 */
export default function Sidebar() {
  const { logout } = useAuth();
  const navigate   = useNavigate();

  return (
    <aside className="hidden sm:flex flex-col w-56 shrink-0 bg-white border-r border-gray-200 h-dvh sticky top-0 px-3 py-6 gap-1">
      {/* Logo */}
      <div className="flex items-center gap-3 px-3 mb-6">
        <div className="w-9 h-9 rounded-xl bg-primary-500 flex items-center justify-center shadow-primary shrink-0">
          <Icon name="wallet" size={18} className="text-white" />
        </div>
        <span className="text-sm font-semibold text-gray-900 leading-tight">
          Expense<br />Tracker
        </span>
      </div>

      {/* Add Expense CTA */}
      <Button
        onClick={() => navigate('/expenses')}
        fullWidth
        className="mb-4 justify-start pl-3 gap-2"
        size="sm"
      >
        <Icon name="plus" size={16} />
        Add Expense
      </Button>

      {/* Nav links */}
      <nav className="flex flex-col gap-0.5 flex-1">
        {NAV_ITEMS.map(({ to, icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              [
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150',
                isActive
                  ? 'bg-primary-50 text-primary-700 font-semibold'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
              ].join(' ')
            }
          >
            {({ isActive }) => (
              <>
                <Icon name={icon} size={17} className={isActive ? 'text-primary-700' : 'text-gray-500'} />
                {label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Sign out */}
      <button
        onClick={logout}
        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors duration-150 w-full text-left"
      >
        <Icon name="logout" size={17} className="text-gray-500" />
        Sign Out
      </button>
    </aside>
  );
}
