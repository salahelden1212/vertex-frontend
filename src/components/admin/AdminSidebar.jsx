import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaTachometerAlt, 
  FaBox, 
  FaProjectDiagram, 
  FaUsers, 
  FaBuilding,
  FaMoneyBillWave,
  FaEnvelope,
  FaCog,
  FaSignOutAlt,
  FaTimes,
  FaChartLine,
  FaUserShield,
  FaCalendarAlt,
  FaChevronRight
} from 'react-icons/fa';
import { useAuthStore } from '../../store/authStore';

// Logo path
const logoDark = '/images/logo-dark.png';

const AdminSidebar = ({ isOpen, setIsOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuthStore();

  const menuItems = [
    { path: '/admin', icon: FaTachometerAlt, label: 'Dashboard', exact: true },
    { path: '/admin/packages', icon: FaBox, label: 'Packages' },
    { path: '/admin/projects', icon: FaProjectDiagram, label: 'Projects' },
    { path: '/admin/clients', icon: FaUsers, label: 'Clients' },
    { path: '/admin/properties', icon: FaBuilding, label: 'Properties' },
    { path: '/admin/payments', icon: FaMoneyBillWave, label: 'Payments' },
    { path: '/admin/reports', icon: FaChartLine, label: 'Reports' },
    { path: '/admin/timeline', icon: FaCalendarAlt, label: 'Timeline' },
    { path: '/admin/messages', icon: FaEnvelope, label: 'Messages' },
    { path: '/admin/users', icon: FaUserShield, label: 'Users' },
    { path: '/admin/settings', icon: FaCog, label: 'Settings' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const isActive = (path, exact = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay for mobile */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            />

            {/* Sidebar */}
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 h-full w-72 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 border-r border-gray-700/50 z-50 flex flex-col shadow-2xl"
            >
              {/* Logo */}
              <div className="p-6 border-b border-gray-700/50 flex items-center justify-between">
                <Link to="/admin" className="flex items-center gap-3">
                  <img 
                    src={logoDark} 
                    alt="Vertex" 
                    className="h-10 w-auto"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                  <div>
                    <span className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-300">VERTEX</span>
                    <span className="text-lg font-bold text-white ml-1">ADMIN</span>
                  </div>
                </Link>
                <button
                  onClick={() => setIsOpen(false)}
                  className="lg:hidden w-8 h-8 flex items-center justify-center rounded-lg bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700 transition-all"
                >
                  <FaTimes />
                </button>
              </div>

              {/* User Info */}
              {user && (
                <div className="p-4 mx-4 mt-4 bg-gray-800/50 rounded-xl border border-gray-700/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-yellow-400 flex items-center justify-center text-gray-900 font-bold">
                      {user.name?.charAt(0).toUpperCase() || 'A'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium truncate">{user.name || 'Admin'}</p>
                      <p className="text-gray-400 text-xs truncate">{user.email}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Menu */}
              <nav className="flex-1 overflow-y-auto p-4 mt-2">
                <ul className="space-y-1">
                  {menuItems.map((item) => {
                    const active = isActive(item.path, item.exact);
                    return (
                      <li key={item.path}>
                        <Link
                          to={item.path}
                          className={`group flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 ${
                            active
                              ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-gray-900 font-semibold shadow-lg shadow-amber-500/20'
                              : 'text-gray-400 hover:bg-gray-800/50 hover:text-white'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <item.icon className={`text-lg ${active ? 'text-gray-900' : 'text-gray-500 group-hover:text-amber-400'}`} />
                            <span>{item.label}</span>
                          </div>
                          {active && <FaChevronRight className="text-sm" />}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </nav>

              {/* Logout */}
              <div className="p-4 border-t border-gray-700/50">
                <button
                  onClick={handleLogout}
                  className="flex items-center justify-center gap-3 w-full px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-all duration-300"
                >
                  <FaSignOutAlt className="text-lg" />
                  <span className="font-medium">Logout</span>
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default AdminSidebar;
