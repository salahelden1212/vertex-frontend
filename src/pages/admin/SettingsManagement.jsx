import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaSave, FaPhone, FaEnvelope, FaMapMarkerAlt, FaWhatsapp, FaFacebook, FaInstagram, FaTwitter, FaLinkedin, FaYoutube, FaGlobe, FaSearch, FaTags, FaCog } from 'react-icons/fa';
import { FaTiktok } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { settingsAPI } from '../../services/apiService';

const SettingsManagement = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    phone: '',
    email: '',
    whatsapp: '',
    address: { ar: '', en: '' },
    socialMedia: {
      facebook: '',
      instagram: '',
      twitter: '',
      linkedin: '',
      youtube: '',
      tiktok: ''
    },
    seo: {
      title: { ar: '', en: '' },
      description: { ar: '', en: '' },
      keywords: { ar: '', en: '' }
    }
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const data = await settingsAPI.get();
      if (data) {
        setFormData({
          phone: data.phone || '',
          email: data.email || '',
          whatsapp: data.whatsapp || '',
          address: data.address || { ar: '', en: '' },
          socialMedia: data.socialMedia || {
            facebook: '',
            instagram: '',
            twitter: '',
            linkedin: '',
            youtube: ''
          },
          seo: data.seo || {
            title: { ar: '', en: '' },
            description: { ar: '', en: '' },
            keywords: { ar: '', en: '' }
          }
        });
      }
    } catch (error) {
      toast.error('Failed to fetch settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await settingsAPI.update(formData);
      toast.success('Settings updated successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-amber-200 rounded-full animate-spin border-t-amber-500 mx-auto"></div>
            <div className="w-10 h-10 border-4 border-gray-200 rounded-full animate-spin border-t-gray-500 mx-auto absolute top-3 left-1/2 -translate-x-1/2" style={{ animationDirection: 'reverse' }}></div>
          </div>
          <p className="mt-4 text-gray-400">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Site <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-300">Settings</span>
          </h1>
          <p className="text-gray-400">Manage company contact information and settings</p>
        </div>
        <motion.button
          type="submit"
          form="settings-form"
          disabled={saving}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-yellow-400 text-gray-900 rounded-xl font-semibold shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FaSave />
          {saving ? 'Saving...' : 'Save Settings'}
        </motion.button>
      </div>

      <form id="settings-form" onSubmit={handleSubmit} className="space-y-8">
        {/* Contact Information */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-2xl p-8 border border-gray-700/50"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
              <FaPhone className="text-white text-xl" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Contact Information</h2>
              <p className="text-gray-400 text-sm">Phone, email, and address details</p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-300 mb-2 font-medium flex items-center gap-2">
                <FaPhone className="text-green-400" /> Phone Number
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl focus:border-amber-500/50 focus:outline-none focus:ring-2 focus:ring-amber-500/20 text-white transition-all"
                placeholder="+20 100 000 0000"
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2 font-medium flex items-center gap-2">
                <FaEnvelope className="text-blue-400" /> Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl focus:border-amber-500/50 focus:outline-none focus:ring-2 focus:ring-amber-500/20 text-white transition-all"
                placeholder="info@vertexfinish.com"
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2 font-medium flex items-center gap-2">
                <FaWhatsapp className="text-green-500" /> WhatsApp Number
              </label>
              <input
                type="tel"
                value={formData.whatsapp}
                onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl focus:border-amber-500/50 focus:outline-none focus:ring-2 focus:ring-amber-500/20 text-white transition-all"
                placeholder="+201000000000"
              />
              <p className="text-xs text-gray-500 mt-1">Format: +201000000000 (no spaces)</p>
            </div>

            <div>
              <label className="block text-gray-300 mb-2 font-medium flex items-center gap-2">
                <FaMapMarkerAlt className="text-red-400" /> Address (English)
              </label>
              <input
                type="text"
                value={formData.address.en}
                onChange={(e) => setFormData({ ...formData, address: { ...formData.address, en: e.target.value } })}
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl focus:border-amber-500/50 focus:outline-none focus:ring-2 focus:ring-amber-500/20 text-white transition-all"
                placeholder="Cairo, Egypt"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-gray-300 mb-2 font-medium flex items-center gap-2">
                <FaMapMarkerAlt className="text-red-400" /> Address (Arabic)
              </label>
              <input
                type="text"
                value={formData.address.ar}
                onChange={(e) => setFormData({ ...formData, address: { ...formData.address, ar: e.target.value } })}
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl focus:border-amber-500/50 focus:outline-none focus:ring-2 focus:ring-amber-500/20 text-white text-right transition-all"
                placeholder="القاهرة، مصر"
                dir="rtl"
              />
            </div>
          </div>
        </motion.div>

        {/* Social Media Links */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-2xl p-8 border border-gray-700/50"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <FaGlobe className="text-white text-xl" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Social Media Links</h2>
              <p className="text-gray-400 text-sm">Connect your social platforms</p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { key: 'facebook', icon: FaFacebook, color: 'text-blue-500', placeholder: 'https://facebook.com/vertexfinish' },
              { key: 'instagram', icon: FaInstagram, color: 'text-pink-500', placeholder: 'https://instagram.com/vertexfinish' },
              { key: 'twitter', icon: FaTwitter, color: 'text-blue-400', label: 'Twitter / X', placeholder: 'https://x.com/vertexfinish' },
              { key: 'linkedin', icon: FaLinkedin, color: 'text-blue-600', placeholder: 'https://linkedin.com/company/vertexfinish' },
              { key: 'youtube', icon: FaYoutube, color: 'text-red-500', placeholder: 'https://youtube.com/@vertexfinish' },
              { key: 'tiktok', icon: FaTiktok, color: 'text-white', placeholder: 'https://tiktok.com/@vertexfinish' },
            ].map((social) => (
              <div key={social.key}>
                <label className="block text-gray-300 mb-2 font-medium flex items-center gap-2">
                  <social.icon className={social.color} /> {social.label || social.key.charAt(0).toUpperCase() + social.key.slice(1)}
                </label>
                <input
                  type="url"
                  value={formData.socialMedia[social.key] || ''}
                  onChange={(e) => setFormData({ ...formData, socialMedia: { ...formData.socialMedia, [social.key]: e.target.value } })}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl focus:border-amber-500/50 focus:outline-none focus:ring-2 focus:ring-amber-500/20 text-white transition-all"
                  placeholder={social.placeholder}
                />
              </div>
            ))}
          </div>
        </motion.div>

        {/* SEO Settings */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-2xl p-8 border border-gray-700/50"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-500 flex items-center justify-center">
              <FaSearch className="text-white text-xl" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">SEO Settings</h2>
              <p className="text-gray-400 text-sm">Optimize for search engines</p>
            </div>
          </div>
          
          <div className="space-y-6">
            {/* Title */}
            <div>
              <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                <FaCog className="text-amber-400" /> Meta Title
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-400 mb-2 text-sm">English</label>
                  <input
                    type="text"
                    value={formData.seo.title.en}
                    onChange={(e) => setFormData({ ...formData, seo: { ...formData.seo, title: { ...formData.seo.title, en: e.target.value } } })}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl focus:border-amber-500/50 focus:outline-none focus:ring-2 focus:ring-amber-500/20 text-white transition-all"
                    placeholder="Vertex Finish - Premium Finishing Services"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 mb-2 text-sm text-right">العربية</label>
                  <input
                    type="text"
                    value={formData.seo.title.ar}
                    onChange={(e) => setFormData({ ...formData, seo: { ...formData.seo, title: { ...formData.seo.title, ar: e.target.value } } })}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl focus:border-amber-500/50 focus:outline-none focus:ring-2 focus:ring-amber-500/20 text-white text-right transition-all"
                    placeholder="فيرتكس فينيش - خدمات تشطيب مميزة"
                    dir="rtl"
                  />
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                <FaCog className="text-amber-400" /> Meta Description
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-400 mb-2 text-sm">English</label>
                  <textarea
                    rows="3"
                    value={formData.seo.description.en}
                    onChange={(e) => setFormData({ ...formData, seo: { ...formData.seo, description: { ...formData.seo.description, en: e.target.value } } })}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl focus:border-amber-500/50 focus:outline-none focus:ring-2 focus:ring-amber-500/20 text-white transition-all resize-none"
                    placeholder="Expert finishing services at the highest level..."
                  />
                </div>

                <div>
                  <label className="block text-gray-400 mb-2 text-sm text-right">العربية</label>
                  <textarea
                    rows="3"
                    value={formData.seo.description.ar}
                    onChange={(e) => setFormData({ ...formData, seo: { ...formData.seo, description: { ...formData.seo.description, ar: e.target.value } } })}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl focus:border-amber-500/50 focus:outline-none focus:ring-2 focus:ring-amber-500/20 text-white text-right transition-all resize-none"
                    placeholder="خدمات تشطيب احترافية على أعلى مستوى..."
                    dir="rtl"
                  />
                </div>
              </div>
            </div>

            {/* Keywords */}
            <div>
              <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                <FaTags className="text-amber-400" /> Keywords
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-400 mb-2 text-sm">English</label>
                  <input
                    type="text"
                    value={formData.seo.keywords.en}
                    onChange={(e) => setFormData({ ...formData, seo: { ...formData.seo, keywords: { ...formData.seo.keywords, en: e.target.value } } })}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl focus:border-amber-500/50 focus:outline-none focus:ring-2 focus:ring-amber-500/20 text-white transition-all"
                    placeholder="finishing, construction, interior, design"
                  />
                  <p className="text-xs text-gray-500 mt-2">Comma separated</p>
                </div>

                <div>
                  <label className="block text-gray-400 mb-2 text-sm text-right">العربية</label>
                  <input
                    type="text"
                    value={formData.seo.keywords.ar}
                    onChange={(e) => setFormData({ ...formData, seo: { ...formData.seo, keywords: { ...formData.seo.keywords, ar: e.target.value } } })}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl focus:border-amber-500/50 focus:outline-none focus:ring-2 focus:ring-amber-500/20 text-white text-right transition-all"
                    placeholder="تشطيبات، بناء، ديكور، تصميم"
                    dir="rtl"
                  />
                  <p className="text-xs text-gray-500 mt-2 text-right">مفصولة بفواصل</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Floating Save Button for Mobile */}
        <div className="md:hidden fixed bottom-6 right-6 z-50">
          <motion.button
            type="submit"
            disabled={saving}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-14 h-14 bg-gradient-to-r from-amber-500 to-yellow-400 text-gray-900 rounded-full shadow-lg shadow-amber-500/30 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaSave className="text-xl" />
          </motion.button>
        </div>
      </form>
    </div>
  );
};

export default SettingsManagement;
