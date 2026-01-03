import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  FaUsers, 
  FaBuilding, 
  FaMoneyBillWave, 
  FaChartLine,
  FaEnvelope,
  FaArrowRight,
  FaArrowUp,
  FaArrowDown,
  FaBox,
  FaCalendarAlt
} from 'react-icons/fa';
import { dashboardAPI } from '../../services/apiService';
import { formatCurrency } from '../../utils/helpers';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await dashboardAPI.getStats();
        setStats(data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-amber-200 rounded-full animate-spin border-t-amber-500 mx-auto"></div>
            <div className="w-10 h-10 border-4 border-gray-200 rounded-full animate-spin border-t-gray-500 mx-auto absolute top-3 left-1/2 -translate-x-1/2" style={{ animationDirection: 'reverse' }}></div>
          </div>
          <p className="mt-4 text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Clients',
      value: stats?.overview?.totalClients || 0,
      icon: FaUsers,
      gradient: 'from-blue-500 to-cyan-500',
      bgGlow: 'shadow-blue-500/20',
      trend: '+12%',
      trendUp: true
    },
    {
      title: 'Active Properties',
      value: stats?.overview?.activeProperties || 0,
      icon: FaBuilding,
      gradient: 'from-green-500 to-emerald-500',
      bgGlow: 'shadow-green-500/20',
      trend: '+8%',
      trendUp: true
    },
    {
      title: 'Total Revenue',
      value: formatCurrency(stats?.overview?.totalRevenue || 0),
      icon: FaChartLine,
      gradient: 'from-amber-500 to-yellow-500',
      bgGlow: 'shadow-amber-500/20',
      trend: '+23%',
      trendUp: true
    },
    {
      title: 'Total Paid',
      value: formatCurrency(stats?.overview?.totalPaid || 0),
      icon: FaMoneyBillWave,
      gradient: 'from-purple-500 to-pink-500',
      bgGlow: 'shadow-purple-500/20',
      trend: '+15%',
      trendUp: true
    },
    {
      title: 'Remaining',
      value: formatCurrency(stats?.overview?.totalRemaining || 0),
      icon: FaMoneyBillWave,
      gradient: 'from-red-500 to-orange-500',
      bgGlow: 'shadow-red-500/20',
      trend: '-5%',
      trendUp: false
    },
    {
      title: 'Unread Messages',
      value: stats?.overview?.unreadMessages || 0,
      icon: FaEnvelope,
      gradient: 'from-indigo-500 to-violet-500',
      bgGlow: 'shadow-indigo-500/20',
      trend: 'New',
      trendUp: true
    },
  ];

  const quickLinks = [
    { icon: FaBox, label: 'Packages', path: '/admin/packages', color: 'from-amber-500 to-yellow-500' },
    { icon: FaUsers, label: 'Clients', path: '/admin/clients', color: 'from-blue-500 to-cyan-500' },
    { icon: FaBuilding, label: 'Properties', path: '/admin/properties', color: 'from-green-500 to-emerald-500' },
    { icon: FaCalendarAlt, label: 'Timeline', path: '/admin/timeline', color: 'from-purple-500 to-pink-500' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-300">Dashboard</span>
          </h1>
          <p className="text-gray-400">Here's what's happening with your business today.</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-gray-400 text-sm">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {quickLinks.map((link, index) => (
          <motion.div
            key={link.path}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Link
              to={link.path}
              className="group flex items-center gap-3 p-4 bg-gray-800/50 hover:bg-gray-800 rounded-xl border border-gray-700/50 hover:border-amber-500/30 transition-all duration-300"
            >
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${link.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <link.icon className="text-white" />
              </div>
              <span className="text-gray-300 group-hover:text-white font-medium transition-colors">{link.label}</span>
              <FaArrowRight className="ml-auto text-gray-600 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`group relative bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50 hover:border-amber-500/30 transition-all duration-500 hover:-translate-y-1 shadow-xl hover:shadow-2xl ${stat.bgGlow}`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <stat.icon className="text-2xl text-white" />
              </div>
              <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${stat.trendUp ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                {stat.trendUp ? <FaArrowUp className="text-[10px]" /> : <FaArrowDown className="text-[10px]" />}
                {stat.trend}
              </div>
            </div>
            <p className="text-gray-400 text-sm mb-1">{stat.title}</p>
            <p className="text-3xl font-bold text-white">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Payments */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <FaMoneyBillWave className="text-green-400" />
              Recent Payments
            </h2>
            <Link to="/admin/payments" className="text-amber-400 hover:text-amber-300 text-sm flex items-center gap-1">
              View All <FaArrowRight className="text-xs" />
            </Link>
          </div>
          <div className="space-y-4">
            {stats?.recentPayments?.length > 0 ? (
              stats.recentPayments.slice(0, 5).map((payment, index) => (
                <motion.div 
                  key={payment._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex justify-between items-center p-3 rounded-xl bg-gray-800/50 hover:bg-gray-700/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center text-white font-bold text-sm">
                      {payment.client?.name?.charAt(0) || 'C'}
                    </div>
                    <div>
                      <p className="text-white font-medium">{payment.client?.name || 'Unknown Client'}</p>
                      <p className="text-gray-400 text-xs">{payment.property?.address || 'N/A'}</p>
                    </div>
                  </div>
                  <p className="text-green-400 font-bold">{formatCurrency(payment.amount)}</p>
                </motion.div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-8">No recent payments</p>
            )}
          </div>
        </motion.div>

        {/* Recent Properties */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <FaBuilding className="text-blue-400" />
              Recent Properties
            </h2>
            <Link to="/admin/properties" className="text-amber-400 hover:text-amber-300 text-sm flex items-center gap-1">
              View All <FaArrowRight className="text-xs" />
            </Link>
          </div>
          <div className="space-y-4">
            {stats?.recentProperties?.length > 0 ? (
              stats.recentProperties.slice(0, 5).map((property, index) => (
                <motion.div 
                  key={property._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex justify-between items-center p-3 rounded-xl bg-gray-800/50 hover:bg-gray-700/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm">
                      {property.client?.name?.charAt(0) || 'P'}
                    </div>
                    <div>
                      <p className="text-white font-medium">{property.client?.name || 'Unknown'}</p>
                      <p className="text-gray-400 text-xs truncate max-w-[200px]">{property.address || 'N/A'}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    property.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                    property.status === 'in-progress' ? 'bg-blue-500/20 text-blue-400' :
                    'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {property.status?.replace('-', ' ') || 'pending'}
                  </span>
                </motion.div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-8">No recent properties</p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
