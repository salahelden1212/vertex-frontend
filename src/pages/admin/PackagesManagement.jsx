import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus, FaEdit, FaTrash, FaStar, FaArrowUp, FaArrowDown, FaTimes, FaBox, FaTag, FaMoneyBillWave, FaCheckCircle, FaCrown, FaFire, FaGem } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { packagesAPI } from '../../services/apiService';

const PackagesManagement = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);
  const [formData, setFormData] = useState({
    name: { ar: '', en: '' },
    description: { ar: '', en: '' },
    priceBefore: '',
    priceAfter: '',
    features: [{ ar: '', en: '' }],
    badge: '',
    isActive: true
  });

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      const data = await packagesAPI.getAll();
      setPackages(data);
    } catch (error) {
      toast.error('Failed to fetch packages');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const packageData = {
        ...formData,
        priceBefore: Number(formData.priceBefore),
        priceAfter: Number(formData.priceAfter),
        features: formData.features.filter(f => f.ar.trim() !== '' && f.en.trim() !== '')
      };

      if (editingPackage) {
        await packagesAPI.update(editingPackage._id, packageData);
        toast.success('Package updated successfully!');
      } else {
        await packagesAPI.create(packageData);
        toast.success('Package created successfully!');
      }

      fetchPackages();
      handleCloseModal();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this package?')) return;
    
    try {
      await packagesAPI.delete(id);
      toast.success('Package deleted successfully!');
      fetchPackages();
    } catch (error) {
      toast.error('Failed to delete package');
    }
  };

  const handleReorder = async (id, direction) => {
    try {
      const index = packages.findIndex(p => p._id === id);
      if (index === -1) return;

      const newIndex = direction === 'up' ? index - 1 : index + 1;
      if (newIndex < 0 || newIndex >= packages.length) return;

      const reorderedPackages = [...packages];
      const [movedPackage] = reorderedPackages.splice(index, 1);
      reorderedPackages.splice(newIndex, 0, movedPackage);

      const orderData = reorderedPackages.map((pkg, idx) => ({
        id: pkg._id,
        order: idx
      }));

      await packagesAPI.reorder({ packages: orderData });
      setPackages(reorderedPackages);
      toast.success('Order updated!');
    } catch (error) {
      toast.error('Failed to reorder');
    }
  };

  const handleEdit = (pkg) => {
    setEditingPackage(pkg);
    setFormData({
      name: pkg.name,
      description: pkg.description,
      priceBefore: pkg.priceBefore,
      priceAfter: pkg.priceAfter,
      features: pkg.features.length > 0 ? pkg.features : [{ ar: '', en: '' }],
      badge: pkg.badge || '',
      isActive: pkg.isActive
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingPackage(null);
    setFormData({
      name: { ar: '', en: '' },
      description: { ar: '', en: '' },
      priceBefore: '',
      priceAfter: '',
      features: [{ ar: '', en: '' }],
      badge: '',
      isActive: true
    });
  };

  const addFeature = () => {
    setFormData({ ...formData, features: [...formData.features, { ar: '', en: '' }] });
  };

  const removeFeature = (index) => {
    const newFeatures = formData.features.filter((_, i) => i !== index);
    setFormData({ ...formData, features: newFeatures });
  };

  const updateFeature = (index, lang, value) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = { ...newFeatures[index], [lang]: value };
    setFormData({ ...formData, features: newFeatures });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Packages <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-300">Management</span>
          </h1>
          <p className="text-gray-400">Manage service packages and pricing</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-yellow-400 text-gray-900 rounded-xl font-semibold shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 transition-all"
        >
          <FaPlus />
          <span>Add Package</span>
        </motion.button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Packages', value: packages.length, gradient: 'from-amber-500 to-yellow-500', icon: FaBox },
          { label: 'Active', value: packages.filter(p => p.isActive).length, gradient: 'from-green-500 to-emerald-500', icon: FaCheckCircle },
          { label: 'VIP', value: packages.filter(p => p.badge === 'vip').length, gradient: 'from-purple-500 to-pink-500', icon: FaCrown },
          { label: 'Popular', value: packages.filter(p => p.badge === 'popular').length, gradient: 'from-blue-500 to-cyan-500', icon: FaFire },
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

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-amber-200 rounded-full animate-spin border-t-amber-500 mx-auto"></div>
              <div className="w-10 h-10 border-4 border-gray-200 rounded-full animate-spin border-t-gray-500 mx-auto absolute top-3 left-1/2 -translate-x-1/2" style={{ animationDirection: 'reverse' }}></div>
            </div>
            <p className="mt-4 text-gray-400">Loading packages...</p>
          </div>
        </div>
      ) : packages.length === 0 ? (
        <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-xl rounded-2xl border border-gray-700/50 text-center py-16">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center mx-auto mb-4">
            <FaBox className="text-4xl text-gray-500" />
          </div>
          <p className="text-gray-400 text-lg">No packages yet</p>
          <p className="text-gray-500 text-sm mt-2">Create your first package to get started</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {packages.map((pkg, index) => (
            <motion.div
              key={pkg._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-6 hover:border-amber-500/30 transition-all"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-400 flex items-center justify-center">
                      <FaGem className="text-gray-900 text-lg" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white">{pkg.name.en}</h3>
                      <span className="text-gray-500 text-sm">({pkg.name.ar})</span>
                    </div>
                    {pkg.badge !== 'none' && pkg.badge && (
                      <span className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${
                        pkg.badge === 'Popular' ? 'bg-blue-500/20 text-blue-400 border-blue-500/50' :
                        pkg.badge === 'vip' ? 'bg-purple-500/20 text-purple-400 border-purple-500/50' :
                        'bg-green-500/20 text-green-400 border-green-500/50'
                      }`}>
                        {pkg.badge.toUpperCase()}
                      </span>
                    )}
                    {!pkg.isActive && (
                      <span className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-500/20 text-red-400 border border-red-500/50">
                        INACTIVE
                      </span>
                    )}
                  </div>
                  
                  <p className="text-gray-400 mb-5 max-w-2xl">{pkg.description.en}</p>
                  
                  <div className="flex gap-8 mb-5">
                    <div className="p-3 bg-gray-800/30 rounded-xl">
                      <span className="text-gray-500 text-xs uppercase tracking-wider">Before</span>
                      <p className="text-gray-500 line-through text-lg font-medium">{pkg.priceBefore.toLocaleString()} EGP</p>
                    </div>
                    <div className="p-3 bg-gradient-to-br from-amber-500/10 to-yellow-500/10 rounded-xl border border-amber-500/20">
                      <span className="text-amber-400/70 text-xs uppercase tracking-wider">After</span>
                      <p className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-300 font-bold text-xl">{pkg.priceAfter.toLocaleString()} EGP</p>
                    </div>
                    <div className="p-3 bg-green-500/10 rounded-xl border border-green-500/20">
                      <span className="text-green-400/70 text-xs uppercase tracking-wider">Save</span>
                      <p className="text-green-400 font-bold text-lg">{(pkg.priceBefore - pkg.priceAfter).toLocaleString()} EGP</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-gray-400 text-sm font-semibold mb-3">Features:</p>
                    <div className="grid md:grid-cols-2 gap-2">
                      {pkg.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2.5 p-2 bg-gray-800/30 rounded-lg">
                          <FaStar className="text-amber-500 text-xs flex-shrink-0" />
                          <span className="text-gray-300 text-sm">{feature.en}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2 ml-4">
                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleReorder(pkg._id, 'up')}
                      disabled={index === 0}
                      className="p-2.5 bg-gray-700/50 rounded-xl hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                      title="Move Up"
                    >
                      <FaArrowUp className="text-gray-300" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleReorder(pkg._id, 'down')}
                      disabled={index === packages.length - 1}
                      className="p-2.5 bg-gray-700/50 rounded-xl hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                      title="Move Down"
                    >
                      <FaArrowDown className="text-gray-300" />
                    </motion.button>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleEdit(pkg)}
                    className="p-3 bg-blue-500/20 text-blue-400 rounded-xl hover:bg-blue-500/30 transition-all"
                    title="Edit"
                  >
                    <FaEdit />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleDelete(pkg._id)}
                    className="p-3 bg-red-500/20 text-red-400 rounded-xl hover:bg-red-500/30 transition-all"
                    title="Delete"
                  >
                    <FaTrash />
                  </motion.button>
                </div>
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
                  {editingPackage ? 'Edit Package' : 'Create New Package'}
                </h2>
                <button
                  onClick={handleCloseModal}
                  className="w-10 h-10 rounded-xl bg-gray-700/50 hover:bg-gray-700 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                >
                  <FaTimes />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* English Name */}
                <div>
                  <label className="block text-gray-300 mb-2 font-medium">Name (English)</label>
                  <input
                    type="text"
                    required
                    value={formData.name.en}
                    onChange={(e) => setFormData({ ...formData, name: { ...formData.name, en: e.target.value } })}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl focus:border-amber-500/50 focus:outline-none focus:ring-2 focus:ring-amber-500/20 text-white transition-all"
                    placeholder="Premium Package"
                  />
                </div>

                {/* Arabic Name */}
                <div>
                  <label className="block text-gray-300 mb-2 font-medium">Name (Arabic)</label>
                  <input
                    type="text"
                    required
                    value={formData.name.ar}
                    onChange={(e) => setFormData({ ...formData, name: { ...formData.name, ar: e.target.value } })}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl focus:border-amber-500/50 focus:outline-none focus:ring-2 focus:ring-amber-500/20 text-white text-right transition-all"
                    placeholder="باقة مميزة"
                    dir="rtl"
                  />
                </div>

                {/* English Description */}
                <div>
                  <label className="block text-gray-300 mb-2 font-medium">Description (English)</label>
                  <textarea
                    required
                    rows="3"
                    value={formData.description.en}
                    onChange={(e) => setFormData({ ...formData, description: { ...formData.description, en: e.target.value } })}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl focus:border-amber-500/50 focus:outline-none focus:ring-2 focus:ring-amber-500/20 text-white transition-all resize-none"
                    placeholder="Comprehensive finishing package..."
                  />
                </div>

                {/* Arabic Description */}
                <div>
                  <label className="block text-gray-300 mb-2 font-medium">Description (Arabic)</label>
                  <textarea
                    required
                    rows="3"
                    value={formData.description.ar}
                    onChange={(e) => setFormData({ ...formData, description: { ...formData.description, ar: e.target.value } })}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl focus:border-amber-500/50 focus:outline-none focus:ring-2 focus:ring-amber-500/20 text-white text-right transition-all resize-none"
                    placeholder="باقة تشطيبات شاملة..."
                    dir="rtl"
                  />
                </div>

                {/* Pricing */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-300 mb-2 font-medium">Price Before (EGP)</label>
                    <div className="relative">
                      <FaMoneyBillWave className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="number"
                        required
                        min="0"
                        value={formData.priceBefore}
                        onChange={(e) => setFormData({ ...formData, priceBefore: e.target.value })}
                        className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl focus:border-amber-500/50 focus:outline-none focus:ring-2 focus:ring-amber-500/20 text-white transition-all"
                        placeholder="8000"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-2 font-medium">Price After (EGP)</label>
                    <div className="relative">
                      <FaTag className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="number"
                        required
                        min="0"
                        value={formData.priceAfter}
                        onChange={(e) => setFormData({ ...formData, priceAfter: e.target.value })}
                        className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl focus:border-amber-500/50 focus:outline-none focus:ring-2 focus:ring-amber-500/20 text-white transition-all"
                        placeholder="6000"
                      />
                    </div>
                  </div>
                </div>

                {/* Badge */}
                <div>
                  <label className="block text-gray-300 mb-2 font-medium">Badge</label>
                  <select
                    value={formData.badge}
                    onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl focus:border-amber-500/50 focus:outline-none text-white cursor-pointer"
                  >
                    <option value="">None</option>
                    <option value="gold"> Gold</option>
                    <option value="vip"> VIP</option>
                    <option value="silver"> Silver</option>
                    <option value="commercial">Commercial</option>
                  </select>
                </div>

                {/* Features */}
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <label className="block text-gray-300 font-medium">Features</label>
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={addFeature}
                      className="text-amber-400 hover:text-amber-300 text-sm flex items-center gap-1 px-3 py-1.5 bg-amber-500/10 rounded-lg border border-amber-500/20"
                    >
                      <FaPlus /> Add Feature
                    </motion.button>
                  </div>
                  <div className="space-y-3">
                    {formData.features.map((feature, index) => (
                      <div key={index} className="p-4 bg-gray-800/30 rounded-xl border border-gray-700/30">
                        <div className="flex gap-2 mb-2">
                          <input
                            type="text"
                            value={feature.en}
                            onChange={(e) => updateFeature(index, 'en', e.target.value)}
                            className="flex-1 px-4 py-2.5 bg-gray-800/50 border border-gray-600/50 rounded-xl focus:border-amber-500/50 focus:outline-none text-white text-sm transition-all"
                            placeholder="Feature in English..."
                          />
                          {formData.features.length > 1 && (
                            <motion.button
                              type="button"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => removeFeature(index)}
                              className="px-3 py-2 bg-red-500/20 text-red-400 rounded-xl hover:bg-red-500/30 transition-all"
                            >
                              <FaTrash />
                            </motion.button>
                          )}
                        </div>
                        <input
                          type="text"
                          value={feature.ar}
                          onChange={(e) => updateFeature(index, 'ar', e.target.value)}
                          className="w-full px-4 py-2.5 bg-gray-800/50 border border-gray-600/50 rounded-xl focus:border-amber-500/50 focus:outline-none text-white text-sm text-right transition-all"
                          placeholder="الميزة بالعربية..."
                          dir="rtl"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Active Status */}
                <label className="flex items-center gap-3 p-4 bg-gray-800/30 rounded-xl cursor-pointer hover:bg-gray-800/50 transition-colors">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-5 h-5 rounded border-gray-600 bg-gray-700 text-amber-500 focus:ring-amber-500 focus:ring-offset-gray-800"
                  />
                  <span className="text-gray-300">Active (visible on website)</span>
                </label>

                {/* Buttons */}
                <div className="flex gap-4 pt-4">
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 py-3 bg-gradient-to-r from-amber-500 to-yellow-400 text-gray-900 rounded-xl font-bold shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 transition-all"
                  >
                    {editingPackage ? 'Update Package' : 'Create Package'}
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

export default PackagesManagement;
