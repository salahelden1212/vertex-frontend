import { FaBars, FaSearch, FaTimes } from 'react-icons/fa';
import { useAuthStore } from '../../store/authStore';

const AdminNavbar = ({ toggleSidebar, sidebarOpen }) => {
  const { user } = useAuthStore();

  return (
    <header className="sticky top-0 z-30 h-16 bg-gray-900/80 backdrop-blur-xl border-b border-gray-700/50 flex items-center justify-between px-6">
      {/* Left Side */}
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-800/50 text-gray-400 hover:text-amber-400 hover:bg-gray-800 transition-all duration-300"
        >
          {sidebarOpen ? <FaTimes className="lg:hidden" /> : null}
          <FaBars className={sidebarOpen ? 'hidden lg:block' : ''} />
        </button>

        {/* Search Bar */}
        <div className="hidden md:flex items-center relative">
          <FaSearch className="absolute left-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search..."
            className="w-64 pl-11 pr-4 py-2.5 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 transition-all"
          />
        </div>
      </div>

      {/* Right Side - Profile Info Only */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-3 p-2 rounded-xl">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-400 flex items-center justify-center text-gray-900 font-bold text-sm">
            {user?.name?.charAt(0).toUpperCase() || 'A'}
          </div>
          <div className="hidden md:block text-right">
            <p className="text-white font-medium text-sm">{user?.name || 'Admin'}</p>
            <p className="text-gray-500 text-xs">{user?.role || 'Administrator'}</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminNavbar;
