// Payments Management - Full CRUD with auto-calculations
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus, FaEdit, FaTrash, FaMoneyBillWave, FaReceipt, FaTimes, FaCalendarAlt, FaCreditCard, FaChartLine, FaCheckCircle, FaClock, FaTimesCircle } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { paymentsAPI, propertiesAPI, clientsAPI } from '../../services/apiService';

const PaymentsManagement = () => {
  const [payments, setPayments] = useState([]);
  const [properties, setProperties] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPayment, setEditingPayment] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [formData, setFormData] = useState({
    property: '',
    client: '',
    amount: '',
    paymentDate: new Date().toISOString().split('T')[0],
    paymentMethod: 'cash',
    status: 'completed',
    notes: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [paymentsData, propsData, clientsData] = await Promise.all([
        paymentsAPI.getAll(),
        propertiesAPI.getAll(),
        clientsAPI.getAll()
      ]);
      setPayments(paymentsData);
      setProperties(propsData);
      setClients(clientsData);
    } catch (error) {
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const paymentData = {
        ...formData,
        amount: Number(formData.amount)
      };

      if (editingPayment) {
        await paymentsAPI.update(editingPayment._id, paymentData);
        toast.success('Payment updated!');
      } else {
        await paymentsAPI.create(paymentData);
        toast.success('Payment recorded!');
      }

      fetchData();
      handleCloseModal();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this payment record?')) return;
    
    try {
      await paymentsAPI.delete(id);
      toast.success('Payment deleted!');
      fetchData();
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  const handleEdit = (payment) => {
    setEditingPayment(payment);
    setFormData({
      property: payment.property?._id || '',
      client: payment.client?._id || '',
      amount: payment.amount,
      paymentDate: new Date(payment.paymentDate).toISOString().split('T')[0],
      paymentMethod: payment.paymentMethod,
      status: payment.status,
      notes: payment.notes || ''
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingPayment(null);
    setFormData({
      property: '',
      client: '',
      amount: '',
      paymentDate: new Date().toISOString().split('T')[0],
      paymentMethod: 'cash',
      status: 'completed',
      notes: ''
    });
  };

  const filteredPayments = filterStatus === 'all' 
    ? payments 
    : payments.filter(p => p.status === filterStatus);

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'failed': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <FaCheckCircle className="text-green-400" />;
      case 'pending': return <FaClock className="text-yellow-400" />;
      case 'failed': return <FaTimesCircle className="text-red-400" />;
      default: return null;
    }
  };

  const totalAmount = payments.reduce((sum, p) => sum + p.amount, 0);
  const completedAmount = payments.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.amount, 0);
  const pendingAmount = payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Payments <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-300">Management</span>
          </h1>
          <p className="text-gray-400">Track and manage all financial transactions</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-yellow-400 text-gray-900 rounded-xl font-semibold shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 transition-all"
        >
          <FaPlus /> Record Payment
        </motion.button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Total Payments', value: totalAmount, icon: FaChartLine, gradient: 'from-amber-500 to-yellow-500', glow: 'shadow-amber-500/20' },
          { label: 'Completed', value: completedAmount, icon: FaCheckCircle, gradient: 'from-green-500 to-emerald-500', glow: 'shadow-green-500/20' },
          { label: 'Pending', value: pendingAmount, icon: FaClock, gradient: 'from-yellow-500 to-orange-500', glow: 'shadow-yellow-500/20' },
        ].map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className={`bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50 hover:border-amber-500/30 transition-all shadow-xl ${stat.glow}`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center`}>
                <stat.icon className="text-white text-xl" />
              </div>
            </div>
            <p className="text-gray-400 text-sm mb-1">{stat.label}</p>
            <p className="text-2xl font-bold text-white">{stat.value.toLocaleString()} EGP</p>
          </motion.div>
        ))}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {[
          { key: 'all', label: 'All', icon: null },
          { key: 'completed', label: 'Completed', icon: FaCheckCircle },
          { key: 'pending', label: 'Pending', icon: FaClock },
          { key: 'failed', label: 'Failed', icon: FaTimesCircle },
        ].map((status) => (
          <motion.button
            key={status.key}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setFilterStatus(status.key)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all whitespace-nowrap ${
              filterStatus === status.key
                ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-gray-900 shadow-lg shadow-amber-500/20'
                : 'bg-gray-800/50 text-gray-400 hover:bg-gray-800 hover:text-white border border-gray-700/50'
            }`}
          >
            {status.icon && <status.icon className="text-sm" />}
            {status.label}
          </motion.button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-amber-200 rounded-full animate-spin border-t-amber-500 mx-auto"></div>
              <div className="w-10 h-10 border-4 border-gray-200 rounded-full animate-spin border-t-gray-500 mx-auto absolute top-3 left-1/2 -translate-x-1/2" style={{ animationDirection: 'reverse' }}></div>
            </div>
            <p className="mt-4 text-gray-400">Loading payments...</p>
          </div>
        </div>
      ) : filteredPayments.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-2xl p-12 border border-gray-700/50 text-center"
        >
          <div className="w-20 h-20 rounded-full bg-gray-700/50 flex items-center justify-center mx-auto mb-4">
            <FaMoneyBillWave className="text-4xl text-gray-500" />
          </div>
          <p className="text-gray-400 text-lg">No payments found</p>
        </motion.div>
      ) : (
        <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-2xl border border-gray-700/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700/50">
                  <th className="text-left py-4 px-6 text-gray-400 font-semibold text-sm">Receipt</th>
                  <th className="text-left py-4 px-6 text-gray-400 font-semibold text-sm">Client</th>
                  <th className="text-left py-4 px-6 text-gray-400 font-semibold text-sm">Property</th>
                  <th className="text-left py-4 px-6 text-gray-400 font-semibold text-sm">Amount</th>
                  <th className="text-left py-4 px-6 text-gray-400 font-semibold text-sm">Date</th>
                  <th className="text-left py-4 px-6 text-gray-400 font-semibold text-sm">Method</th>
                  <th className="text-left py-4 px-6 text-gray-400 font-semibold text-sm">Status</th>
                  <th className="text-right py-4 px-6 text-gray-400 font-semibold text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPayments.map((payment, index) => (
                  <motion.tr
                    key={payment._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors group"
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-yellow-500/20 flex items-center justify-center">
                          <FaReceipt className="text-amber-400" />
                        </div>
                        <span className="text-white font-mono text-sm">{payment.receiptNumber}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-white font-medium">{payment.client?.name || 'N/A'}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-gray-400 text-sm truncate max-w-[200px] block">{payment.property?.address || 'N/A'}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400 font-bold text-lg">
                        {payment.amount.toLocaleString()} EGP
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-gray-300 text-sm">
                        {new Date(payment.paymentDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="px-3 py-1 rounded-lg bg-gray-700/50 text-gray-300 text-sm capitalize">
                        {payment.paymentMethod}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border w-fit ${getStatusColor(payment.status)}`}>
                        {getStatusIcon(payment.status)}
                        {payment.status}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex gap-2 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleEdit(payment)}
                          className="p-2.5 bg-blue-600/20 text-blue-400 rounded-lg hover:bg-blue-600 hover:text-white transition-all"
                        >
                          <FaEdit />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleDelete(payment._id)}
                          className="p-2.5 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600 hover:text-white transition-all"
                        >
                          <FaTrash />
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={handleCloseModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-700/50 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">
                  {editingPayment ? 'Edit Payment' : 'Record New Payment'}
                </h2>
                <button
                  onClick={handleCloseModal}
                  className="w-10 h-10 rounded-xl bg-gray-700/50 hover:bg-gray-700 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                >
                  <FaTimes />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-300 mb-2 font-medium">Client *</label>
                    <select
                      required
                      value={formData.client}
                      onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl focus:border-amber-500/50 focus:outline-none text-white cursor-pointer"
                    >
                      <option value="">Select Client</option>
                      {clients.map(client => (
                        <option key={client._id} value={client._id}>{client.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-2 font-medium">Property *</label>
                    <select
                      required
                      value={formData.property}
                      onChange={(e) => setFormData({ ...formData, property: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl focus:border-amber-500/50 focus:outline-none text-white cursor-pointer"
                    >
                      <option value="">Select Property</option>
                      {properties.map(prop => (
                        <option key={prop._id} value={prop._id}>{prop.address}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-gray-300 mb-2 font-medium">Amount (EGP) *</label>
                    <div className="relative">
                      <FaMoneyBillWave className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="number"
                        required
                        min="0"
                        value={formData.amount}
                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                        className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl focus:border-amber-500/50 focus:outline-none focus:ring-2 focus:ring-amber-500/20 text-white transition-all"
                        placeholder="10000"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-2 font-medium">Payment Date *</label>
                    <div className="relative">
                      <FaCalendarAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="date"
                        required
                        value={formData.paymentDate}
                        onChange={(e) => setFormData({ ...formData, paymentDate: e.target.value })}
                        className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl focus:border-amber-500/50 focus:outline-none text-white"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-2 font-medium">Method</label>
                    <div className="relative">
                      <FaCreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <select
                        value={formData.paymentMethod}
                        onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                        className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl focus:border-amber-500/50 focus:outline-none text-white cursor-pointer"
                      >
                        <option value="cash">Cash</option>
                        <option value="bank-transfer">Bank Transfer</option>
                        <option value="check">Check</option>
                        <option value="card">Card</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-gray-300 mb-2 font-medium">Status</label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { value: 'completed', label: 'Completed', icon: FaCheckCircle, color: 'green' },
                      { value: 'pending', label: 'Pending', icon: FaClock, color: 'yellow' },
                      { value: 'failed', label: 'Failed', icon: FaTimesCircle, color: 'red' },
                    ].map((status) => (
                      <button
                        key={status.value}
                        type="button"
                        onClick={() => setFormData({ ...formData, status: status.value })}
                        className={`flex items-center justify-center gap-2 py-3 rounded-xl border transition-all ${
                          formData.status === status.value
                            ? `bg-${status.color}-500/20 border-${status.color}-500/50 text-${status.color}-400`
                            : 'bg-gray-800/50 border-gray-600/50 text-gray-400 hover:border-gray-500'
                        }`}
                      >
                        <status.icon />
                        {status.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-gray-300 mb-2 font-medium">Notes</label>
                  <textarea
                    rows="3"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl focus:border-amber-500/50 focus:outline-none focus:ring-2 focus:ring-amber-500/20 text-white transition-all resize-none"
                    placeholder="Additional notes..."
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <motion.button 
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 py-3 bg-gradient-to-r from-amber-500 to-yellow-400 text-gray-900 rounded-xl font-bold shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 transition-all"
                  >
                    {editingPayment ? 'Update Payment' : 'Record Payment'}
                  </motion.button>
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleCloseModal}
                    className="flex-1 px-6 py-3 bg-gray-700 text-white rounded-xl hover:bg-gray-600 transition-colors font-medium"
                  >
                    Cancel
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PaymentsManagement;
