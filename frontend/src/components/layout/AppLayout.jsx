import { Outlet } from 'react-router-dom';
import { useEffect } from 'react';
import Sidebar from './Sidebar';
import BottomNav from './BottomNav';
import { useExpenses } from '../../contexts/ExpensesContext';

/**
 * Shell shared by all authenticated pages.
 * - Desktop: left sidebar + scrollable main content
 * - Mobile: full-width main + fixed bottom navigation
 *
 * Fetches the expense list once on mount so all child pages have data immediately.
 */
export default function AppLayout() {
  const { fetchExpenses } = useExpenses();

  useEffect(() => {
    fetchExpenses();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="flex h-dvh bg-gray-50">
      {/* Sidebar — hidden on mobile, visible from sm breakpoint */}
      <Sidebar />

      {/* Page content — padded bottom on mobile to clear the bottom nav */}
      <main className="flex-1 overflow-y-auto pb-20 sm:pb-0">
        <Outlet />
      </main>

      {/* Bottom nav — visible on mobile, hidden from sm breakpoint */}
      <BottomNav />
    </div>
  );
}
