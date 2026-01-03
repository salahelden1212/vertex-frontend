// Properties Management - Full CRUD with client linkage
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaHome, FaTimes, FaBuilding, FaMapMarkerAlt, FaRulerCombined, FaMoneyBillWave, FaUserTie, FaClipboardList, FaCalendarAlt, FaBox, FaClock } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { propertiesAPI, clientsAPI, packagesAPI } from '../../services/apiService';

const PropertiesManagement = () => {
  const [properties, setProperties] = useState([]);
  const [clients, setClients] = useState([]);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    client: '',
    propertyType: 'apartment',
    address: '',
    area: '',
    totalPrice: '',
    selectedPackage: '',
    status: 'pending',
    startDate: '',
    expectedEndDate: '',
    notes: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [propsData, clientsData, pkgsData] = await Promise.all([
        propertiesAPI.getAll(),
        clientsAPI.getAll(),
        packagesAPI.getAll()
      ]);
      setProperties(propsData);
      setClients(clientsData);
      setPackages(pkgsData);
    } catch (error) {
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const propertyData = {
        ...formData,
        area: Number(formData.area),
        totalPrice: Number(formData.totalPrice)
      };

      // Remove empty ObjectId fields to avoid validation error
      if (!propertyData.selectedPackage || propertyData.selectedPackage === '') {
        delete propertyData.selectedPackage;
      }

      if (editingProperty) {
        await propertiesAPI.update(editingProperty._id, propertyData);
        toast.success('Property updated!');
      } else {
        await propertiesAPI.create(propertyData);
        toast.success('Property created!');
      }

      fetchData();
      handleCloseModal();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this property? Related payments will also be affected.')) return;
    
    try {
      await propertiesAPI.delete(id);
      toast.success('Property deleted!');
      fetchData();
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  const handleEdit = (property) => {
    setEditingProperty(property);
    setFormData({
      client: property.client?._id || '',
      propertyType: property.propertyType,
      address: property.address || '',
      area: property.area,
      totalPrice: property.totalPrice,
      selectedPackage: property.selectedPackage?._id || '',
      status: property.status,
      startDate: property.startDate ? new Date(property.startDate).toISOString().split('T')[0] : '',
      expectedEndDate: property.expectedEndDate ? new Date(property.expectedEndDate).toISOString().split('T')[0] : '',
      notes: property.notes || ''
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingProperty(null);
    setFormData({
      client: '',
      propertyType: 'apartment',
      address: '',
      area: '',
      totalPrice: '',
      selectedPackage: '',
      status: 'pending',
      startDate: '',
      expectedEndDate: '',
      notes: ''
    });
  };

  const filteredProperties = properties.filter(prop =>
    prop.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prop.client?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'planning': return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      case 'in-progress': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'completed': return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'on-hold': return 'bg-red-500/20 text-red-400 border-red-500/50';
      case 'pending': return 'bg-purple-500/20 text-purple-400 border-purple-500/50';
      case 'cancelled': return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Properties <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-300">Management</span>
          </h1>
          <p className="text-gray-400">Manage units and projects with client linkage</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-yellow-400 text-gray-900 rounded-xl font-semibold shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 transition-all"
        >
          <FaPlus />
          <span>Add Property</span>
        </motion.button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Properties', value: properties.length, gradient: 'from-amber-500 to-yellow-500', icon: FaBuilding },
          { label: 'In Progress', value: properties.filter(p => p.status === 'in-progress').length, gradient: 'from-yellow-500 to-orange-500', icon: FaClock },
          { label: 'Completed', value: properties.filter(p => p.status === 'completed').length, gradient: 'from-green-500 to-emerald-500', icon: FaHome },
          { label: 'Pending', value: properties.filter(p => p.status === 'pending').length, gradient: 'from-purple-500 to-pink-500', icon: FaClipboardList },
        ].map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-xl rounded-xl p-4 border border-gray-700/50"
          >
            <div className="flex items-center justify-between mb-2">
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.gradient} flex items-center justify-center`}>
                <stat.icon className="text-white" />
              </div>
            </div>
            <p className="text-gray-400 text-sm">{stat.label}</p>
            <p className={`text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r ${stat.gradient}`}>{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Search */}
      <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-4">
        <div className="relative">
          <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by address or client name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl focus:border-amber-500/50 focus:outline-none focus:ring-2 focus:ring-amber-500/20 text-white transition-all"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-amber-200 rounded-full animate-spin border-t-amber-500 mx-auto"></div>
              <div className="w-10 h-10 border-4 border-gray-200 rounded-full animate-spin border-t-gray-500 mx-auto absolute top-3 left-1/2 -translate-x-1/2" style={{ animationDirection: 'reverse' }}></div>
            </div>
            <p className="mt-4 text-gray-400">Loading properties...</p>
          </div>
        </div>
      ) : filteredProperties.length === 0 ? (
        <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-xl rounded-2xl border border-gray-700/50 text-center py-16">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center mx-auto mb-4">
            <FaHome className="text-4xl text-gray-500" />
          </div>
          <p className="text-gray-400 text-lg">No properties found</p>
          <p className="text-gray-500 text-sm mt-2">Add your first property to get started</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map((property, index) => (
            <motion.div
              key={property._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-5 hover:border-amber-500/30 transition-all group"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-400 flex items-center justify-center flex-shrink-0">
                    <FaBuilding className="text-gray-900" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white mb-1">{property.address}</h3>
                    <p className="text-gray-400 text-sm flex items-center gap-1">
                      <FaUserTie className="text-amber-500/50" />
                      {property.client?.name}
                    </p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-lg text-xs font-semibold border ${getStatusColor(property.status)}`}>
                  {property.status}
                </span>
              </div>

              <div className="space-y-2.5 mb-4">
                <div className="flex justify-between items-center p-2 bg-gray-800/30 rounded-lg">
                  <span className="text-gray-400 text-sm flex items-center gap-2">
                    <FaHome className="text-gray-500" /> Type
                  </span>
                  <span className="text-white font-medium capitalize">{property.propertyType}</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-gray-800/30 rounded-lg">
                  <span className="text-gray-400 text-sm flex items-center gap-2">
                    <FaRulerCombined className="text-gray-500" /> Area
                  </span>
                  <span className="text-white font-medium">{property.area} m²</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-gray-800/30 rounded-lg">
                  <span className="text-gray-400 text-sm flex items-center gap-2">
                    <FaMoneyBillWave className="text-gray-500" /> Total
                  </span>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-300 font-bold">{property.totalPrice.toLocaleString()} EGP</span>
                </div>
              </div>

              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleEdit(property)}
                  className="flex-1 px-4 py-2.5 bg-blue-500/20 text-blue-400 rounded-xl hover:bg-blue-500/30 flex items-center justify-center gap-2 transition-all font-medium"
                >
                  <FaEdit /> Edit
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleDelete(property._id)}
                  className="px-4 py-2.5 bg-red-500/20 text-red-400 rounded-xl hover:bg-red-500/30 transition-all"
                >
                  <FaTrash />
                </motion.button>
              </div>
            </motion.div>
          ))}
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
              className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-gray-700/50 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">
                  {editingProperty ? 'Edit Property' : 'Add New Property'}
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
                    <div className="relative">
                      <FaUserTie className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <select
                        required
                        value={formData.client}
                        onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                        className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl focus:border-amber-500/50 focus:outline-none text-white cursor-pointer appearance-none"
                      >
                        <option value="">Select Client</option>
                        {clients.map(client => (
                          <option key={client._id} value={client._id}>{client.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-2 font-medium">Property Type</label>
                    <div className="relative">
                      <FaHome className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <select
                        value={formData.propertyType}
                        onChange={(e) => setFormData({ ...formData, propertyType: e.target.value })}
                        className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl focus:border-amber-500/50 focus:outline-none text-white cursor-pointer appearance-none"
                      >
                        <option value="apartment">Apartment</option>
                        <option value="villa">Villa</option>
                        <option value="office">Office</option>
                        <option value="showroom">Showroom</option>
                        <option value="commercial">Commercial</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-gray-300 mb-2 font-medium">Address *</label>
                  <div className="relative">
                    <FaMapMarkerAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      required
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl focus:border-amber-500/50 focus:outline-none focus:ring-2 focus:ring-amber-500/20 text-white transition-all"
                      placeholder="Riyadh, Al Olaya District"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-300 mb-2 font-medium">Area (m²) *</label>
                    <div className="relative">
                      <FaRulerCombined className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="number"
                        required
                        min="0"
                        value={formData.area}
                        onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                        className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl focus:border-amber-500/50 focus:outline-none focus:ring-2 focus:ring-amber-500/20 text-white transition-all"
                        placeholder="150"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-2 font-medium">Total Price (EGP) *</label>
                    <div className="relative">
                      <FaMoneyBillWave className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="number"
                        required
                        min="0"
                        value={formData.totalPrice}
                        onChange={(e) => setFormData({ ...formData, totalPrice: e.target.value })}
                        className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl focus:border-amber-500/50 focus:outline-none focus:ring-2 focus:ring-amber-500/20 text-white transition-all"
                        placeholder="100000"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-300 mb-2 font-medium">Package</label>
                    <div className="relative">
                      <FaBox className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <select
                        value={formData.selectedPackage}
                        onChange={(e) => setFormData({ ...formData, selectedPackage: e.target.value })}
                        className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl focus:border-amber-500/50 focus:outline-none text-white cursor-pointer appearance-none"
                      >
                        <option value="">None</option>
                        {packages.map(pkg => (
                          <option key={pkg._id} value={pkg._id}>{pkg.name.en}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-2 font-medium">Status</label>
                    <div className="relative">
                      <FaClipboardList className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <select
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl focus:border-amber-500/50 focus:outline-none text-white cursor-pointer appearance-none"
                      >
                        <option value="pending">Pending</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                        <option value="on-hold">On Hold</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-300 mb-2 font-medium">Start Date</label>
                    <div className="relative">
                      <FaCalendarAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                        className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl focus:border-amber-500/50 focus:outline-none text-white"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-2 font-medium">Expected End Date</label>
                    <div className="relative">
                      <FaCalendarAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="date"
                        value={formData.expectedEndDate}
                        onChange={(e) => setFormData({ ...formData, expectedEndDate: e.target.value })}
                        className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl focus:border-amber-500/50 focus:outline-none text-white"
                      />
                    </div>
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
                    {editingProperty ? 'Update Property' : 'Create Property'}
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

export default PropertiesManagement;
