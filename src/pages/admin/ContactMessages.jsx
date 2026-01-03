import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaEnvelope, FaEnvelopeOpen, FaTrash, FaPhone, FaUser, FaClock, FaReply, FaArchive, FaInbox, FaCheckCircle, FaEye } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { contactAPI } from '../../services/apiService';

const ContactMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, new, read, replied, archived
  const [selectedMessage, setSelectedMessage] = useState(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const data = await contactAPI.getAll();
      setMessages(data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    } catch (error) {
      toast.error('Failed to fetch messages');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await contactAPI.update(id, { status });
      toast.success(`Status updated to ${status}`);
      fetchMessages();
      if (selectedMessage?._id === id) {
        setSelectedMessage({ ...selectedMessage, status });
      }
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return;
    
    try {
      await contactAPI.delete(id);
      toast.success('Message deleted successfully!');
      fetchMessages();
      if (selectedMessage?._id === id) {
        setSelectedMessage(null);
      }
    } catch (error) {
      toast.error('Failed to delete message');
    }
  };

  const handleMarkAsRead = async (message) => {
    if (message.status === 'new') {
      await handleStatusChange(message._id, 'read');
    }
    setSelectedMessage(message);
  };

  const filteredMessages = messages.filter(msg => {
    if (filter === 'all') return true;
    return msg.status === filter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'new': return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      case 'read': return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
      case 'replied': return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'archived': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  const statusCounts = {
    all: messages.length,
    new: messages.filter(m => m.status === 'new').length,
    read: messages.filter(m => m.status === 'read').length,
    replied: messages.filter(m => m.status === 'replied').length,
    archived: messages.filter(m => m.status === 'archived').length
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
          Contact <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-300">Messages</span>
        </h1>
        <p className="text-gray-400">Manage website inquiries and messages</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: 'All', value: statusCounts.all, gradient: 'from-amber-500 to-yellow-500', icon: FaInbox },
          { label: 'New', value: statusCounts.new, gradient: 'from-blue-500 to-cyan-500', icon: FaEnvelope },
          { label: 'Read', value: statusCounts.read, gradient: 'from-gray-500 to-gray-600', icon: FaEye },
          { label: 'Replied', value: statusCounts.replied, gradient: 'from-green-500 to-emerald-500', icon: FaCheckCircle },
          { label: 'Archived', value: statusCounts.archived, gradient: 'from-yellow-500 to-orange-500', icon: FaArchive },
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

      {/* Filter Tabs */}
      <div className="flex gap-3 overflow-x-auto pb-2">
        {['all', 'new', 'read', 'replied', 'archived'].map((status) => (
          <motion.button
            key={status}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setFilter(status)}
            className={`px-5 py-2.5 rounded-xl whitespace-nowrap transition-all font-medium ${
              filter === status
                ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-gray-900 shadow-lg shadow-amber-500/20'
                : 'bg-gray-800/60 text-gray-400 hover:bg-gray-700/60 border border-gray-700/50'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)} ({statusCounts[status]})
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
            <p className="mt-4 text-gray-400">Loading messages...</p>
          </div>
        </div>
      ) : filteredMessages.length === 0 ? (
        <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-xl rounded-2xl border border-gray-700/50 text-center py-16">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center mx-auto mb-4">
            <FaEnvelope className="text-4xl text-gray-500" />
          </div>
          <p className="text-gray-400 text-lg">No messages found in this category</p>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Messages List */}
          <div className="lg:col-span-1 space-y-3 max-h-[calc(100vh-350px)] overflow-y-auto pr-2">
            {filteredMessages.map((message, index) => (
              <motion.div
                key={message._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.03 }}
                whileHover={{ scale: 1.02 }}
                onClick={() => handleMarkAsRead(message)}
                className={`bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-xl rounded-xl border p-4 cursor-pointer transition-all ${
                  selectedMessage?._id === message._id
                    ? 'border-amber-500/50 bg-amber-500/5'
                    : 'border-gray-700/50 hover:border-gray-600'
                } ${message.status === 'new' ? 'ring-1 ring-blue-500/30' : ''}`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {message.status === 'new' ? (
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                        <FaEnvelope className="text-white text-sm" />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-lg bg-gray-700/50 flex items-center justify-center">
                        <FaEnvelopeOpen className="text-gray-400 text-sm" />
                      </div>
                    )}
                    <h3 className="font-semibold text-white">{message.name}</h3>
                  </div>
                  <span className={`px-2 py-1 rounded-lg text-xs font-semibold border ${getStatusColor(message.status)}`}>
                    {message.status}
                  </span>
                </div>
                
                <p className="text-sm text-gray-400 mb-2 line-clamp-2 ml-10">{message.subject}</p>
                
                <div className="flex items-center gap-3 text-xs text-gray-500 ml-10">
                  <span className="flex items-center gap-1">
                    <FaClock />
                    {new Date(message.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Message Details */}
          <div className="lg:col-span-2">
            {selectedMessage ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-6"
              >
                {/* Header */}
                <div className="flex justify-between items-start mb-6 pb-6 border-b border-gray-700/50">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">{selectedMessage.subject}</h2>
                    <div className="flex flex-wrap items-center gap-4 text-gray-400">
                      <span className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-amber-500 to-yellow-400 flex items-center justify-center">
                          <FaUser className="text-gray-900 text-xs" />
                        </div>
                        {selectedMessage.name}
                      </span>
                      <span className="flex items-center gap-2">
                        <FaClock className="text-amber-500/50" />
                        {new Date(selectedMessage.createdAt).toLocaleString('en-US', {
                          dateStyle: 'medium',
                          timeStyle: 'short'
                        })}
                      </span>
                    </div>
                  </div>
                  <span className={`px-4 py-2 rounded-xl text-sm font-semibold border ${getStatusColor(selectedMessage.status)}`}>
                    {selectedMessage.status.toUpperCase()}
                  </span>
                </div>

                {/* Contact Info */}
                <div className="grid md:grid-cols-2 gap-4 mb-6 p-4 bg-gray-800/30 rounded-xl border border-gray-700/30">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Email</p>
                    <a
                      href={`mailto:${selectedMessage.email}`}
                      className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-300 hover:underline flex items-center gap-2 font-medium"
                    >
                      {selectedMessage.email}
                    </a>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Phone</p>
                    <a
                      href={`tel:${selectedMessage.phone}`}
                      className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-300 hover:underline flex items-center gap-2 font-medium"
                    >
                      <FaPhone className="text-amber-500 text-sm" /> {selectedMessage.phone}
                    </a>
                  </div>
                </div>

                {/* Message Content */}
                <div className="mb-6">
                  <h3 className="text-gray-400 text-sm font-semibold mb-3">Message</h3>
                  <div className="p-4 bg-gray-800/30 rounded-xl border border-gray-700/30">
                    <p className="text-white text-lg leading-relaxed whitespace-pre-wrap">
                      {selectedMessage.message}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-3 pt-6 border-t border-gray-700/50">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleStatusChange(selectedMessage._id, 'replied')}
                    disabled={selectedMessage.status === 'replied'}
                    className="px-5 py-2.5 bg-green-500/20 text-green-400 rounded-xl hover:bg-green-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium transition-all"
                  >
                    <FaReply /> Mark as Replied
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleStatusChange(selectedMessage._id, 'archived')}
                    disabled={selectedMessage.status === 'archived'}
                    className="px-5 py-2.5 bg-yellow-500/20 text-yellow-400 rounded-xl hover:bg-yellow-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium transition-all"
                  >
                    <FaArchive /> Archive
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleStatusChange(selectedMessage._id, 'new')}
                    disabled={selectedMessage.status === 'new'}
                    className="px-5 py-2.5 bg-blue-500/20 text-blue-400 rounded-xl hover:bg-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium transition-all"
                  >
                    <FaEnvelope /> Mark as Unread
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleDelete(selectedMessage._id)}
                    className="px-5 py-2.5 bg-red-500/20 text-red-400 rounded-xl hover:bg-red-500/30 ml-auto flex items-center gap-2 font-medium transition-all"
                  >
                    <FaTrash />
                    Delete
                  </motion.button>
                </div>
              </motion.div>
            ) : (
              <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-xl rounded-2xl border border-gray-700/50 h-full flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center mx-auto mb-4">
                    <FaEnvelope className="text-4xl text-gray-500" />
                  </div>
                  <p className="text-gray-400 text-lg">Select a message to view details</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactMessages;
