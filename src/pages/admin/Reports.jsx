import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaFileDownload, 
  FaChartLine, 
  FaMoneyBillWave, 
  FaExclamationTriangle, 
  FaUsers,
  FaCalendarAlt,
  FaFilePdf,
  FaFileExcel,
  FaChartBar,
  FaChartPie,
  FaArrowUp,
  FaArrowDown,
  FaPercentage,
  FaCoins,
  FaClock
} from 'react-icons/fa';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import toast from 'react-hot-toast';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { format } from 'date-fns';

const Reports = () => {
  const [reportType, setReportType] = useState('payments');
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reportsData, setReportsData] = useState(null);

  const COLORS = ['#D4AF37', '#4A90E2', '#50C878', '#FF6B6B', '#9B59B6'];

  useEffect(() => {
    // Set default dates (last 6 months)
    const end = new Date();
    const start = new Date();
    start.setMonth(start.getMonth() - 6);
    
    setStartDate(format(start, 'yyyy-MM-dd'));
    setEndDate(format(end, 'yyyy-MM-dd'));
  }, []);

  const fetchReport = async () => {
    if (!startDate || !endDate) {
      return toast.error('Please select date range');
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.get(
        `http://localhost:5000/api/reports/${reportType}?startDate=${startDate}&endDate=${endDate}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setReportsData(response.data.data);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch report');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (startDate && endDate) {
      fetchReport();
    }
  }, [reportType, startDate, endDate]);

  const exportToPDF = () => {
    const doc = new jsPDF();
    
    // Title
    doc.setFontSize(20);
    doc.text(`${reportType.toUpperCase()} REPORT`, 14, 22);
    
    // Date range
    doc.setFontSize(12);
    doc.text(`Period: ${startDate} to ${endDate}`, 14, 32);
    
    // Add data based on report type
    if (reportType === 'payments' && reportsData) {
      doc.autoTable({
        startY: 40,
        head: [['Month', 'Count', 'Amount (EGP)']],
        body: reportsData.monthlyBreakdown.map(item => [
          item.month,
          item.count,
          item.amount.toLocaleString()
        ])
      });
    } else if (reportType === 'overdue' && reportsData) {
      doc.autoTable({
        startY: 40,
        head: [['Property', 'Client', 'Remaining', 'Days Overdue']],
        body: reportsData.properties.slice(0, 20).map(item => [
          item.property.address,
          item.client.name,
          item.remaining.toLocaleString(),
          item.daysOverdue
        ])
      });
    } else if (reportType === 'profit' && reportsData) {
      doc.autoTable({
        startY: 40,
        head: [['Month', 'Revenue', 'Cost', 'Profit', 'Margin %']],
        body: reportsData.monthlyData.map(item => [
          item.month,
          item.revenue.toLocaleString(),
          item.cost.toLocaleString(),
          item.profit.toLocaleString(),
          item.profitMargin
        ])
      });
    }
    
    doc.save(`${reportType}-report-${Date.now()}.pdf`);
    toast.success('PDF exported successfully!');
  };

  const exportToExcel = () => {
    let dataToExport = [];
    
    if (reportType === 'payments' && reportsData) {
      dataToExport = reportsData.monthlyBreakdown.map(item => ({
        Month: item.month,
        Count: item.count,
        Amount: item.amount
      }));
    } else if (reportType === 'overdue' && reportsData) {
      dataToExport = reportsData.properties.map(item => ({
        Property: item.property.address,
        Client: item.client.name,
        'Total Price': item.totalPrice,
        Paid: item.paid,
        Remaining: item.remaining,
        'Due Date': format(new Date(item.dueDate), 'dd/MM/yyyy'),
        'Days Overdue': item.daysOverdue
      }));
    } else if (reportType === 'profit' && reportsData) {
      dataToExport = reportsData.monthlyData.map(item => ({
        Month: item.month,
        Revenue: item.revenue,
        Cost: item.cost,
        Profit: item.profit,
        'Profit Margin': item.profitMargin
      }));
    } else if (reportType === 'clients' && reportsData) {
      dataToExport = reportsData.clients.map(item => ({
        Client: item.client.name,
        Phone: item.client.phone,
        'Properties Count': item.propertiesCount,
        'Total Value': item.totalValue,
        'Total Paid': item.totalPaid,
        Remaining: item.remaining
      }));
    }
    
    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, reportType);
    XLSX.writeFile(wb, `${reportType}-report-${Date.now()}.xlsx`);
    toast.success('Excel exported successfully!');
  };

  const renderPaymentsReport = () => {
    if (!reportsData) return null;

    const methodsData = Object.entries(reportsData.paymentsByMethod).map(([key, value]) => ({
      name: key.replace('-', ' ').toUpperCase(),
      value: value.amount
    }));

    return (
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">Total Payments</p>
                <p className="text-3xl font-bold text-white mt-2">{reportsData.totalPayments}</p>
                <p className="text-green-400 text-sm mt-1 flex items-center gap-1">
                  <FaArrowUp className="text-xs" /> Active transactions
                </p>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500/20 to-yellow-500/10 flex items-center justify-center">
                <FaMoneyBillWave className="text-2xl text-amber-400" />
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">Total Amount</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-amber-400 to-yellow-300 bg-clip-text text-transparent mt-2">
                  {reportsData.totalAmount.toLocaleString()} EGP
                </p>
                <p className="text-gray-500 text-sm mt-1">Revenue collected</p>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500/20 to-emerald-500/10 flex items-center justify-center">
                <FaCoins className="text-2xl text-green-400" />
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">Average Payment</p>
                <p className="text-3xl font-bold text-blue-400 mt-2">
                  {(reportsData.totalAmount / reportsData.totalPayments).toFixed(0)} EGP
                </p>
                <p className="text-gray-500 text-sm mt-1">Per transaction</p>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/10 flex items-center justify-center">
                <FaChartLine className="text-2xl text-blue-400" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Line Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-yellow-500/10 flex items-center justify-center">
                <FaChartLine className="text-amber-400" />
              </div>
              <h3 className="text-xl font-bold text-white">Monthly Payments Trend</h3>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={reportsData.monthlyBreakdown}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #F59E0B', borderRadius: '12px' }}
                  labelStyle={{ color: '#fff' }}
                />
                <Legend />
                <Line type="monotone" dataKey="amount" stroke="#F59E0B" strokeWidth={3} dot={{ fill: '#F59E0B', strokeWidth: 2 }} />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Pie Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/10 flex items-center justify-center">
                <FaChartPie className="text-purple-400" />
              </div>
              <h3 className="text-xl font-bold text-white">Payment Methods Distribution</h3>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={methodsData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.name}: ${entry.value.toLocaleString()}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {methodsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#1C1C1C', border: '1px solid #D4AF37' }} />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>
        </div>
      </div>
    );
  };

  const renderOverdueReport = () => {
    if (!reportsData) return null;

    return (
      <div className="space-y-6">
        {/* Summary Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-red-900/30 to-gray-900/60 backdrop-blur-xl rounded-2xl p-6 border border-red-700/30"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium">Total Overdue Amount</p>
              <p className="text-4xl font-bold text-red-400 mt-2">
                {reportsData.totalOverdue.toLocaleString()} EGP
              </p>
              <p className="text-red-400/70 text-sm mt-2 flex items-center gap-2">
                <FaExclamationTriangle className="text-red-400" />
                {reportsData.count} properties with overdue payments
              </p>
            </div>
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500/20 to-red-600/10 flex items-center justify-center">
              <FaExclamationTriangle className="text-3xl text-red-400" />
            </div>
          </div>
        </motion.div>

        {/* Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-xl rounded-2xl border border-gray-700/50 overflow-hidden"
        >
          <div className="p-6 border-b border-gray-700/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500/20 to-red-600/10 flex items-center justify-center">
                <FaClock className="text-red-400" />
              </div>
              <h3 className="text-xl font-bold text-white">Overdue Properties</h3>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700/50 bg-gray-800/30">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Property</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Client</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300">Total</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300">Paid</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300">Remaining</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-300">Days Overdue</th>
                </tr>
              </thead>
              <tbody>
                {reportsData.properties.map((item, index) => (
                  <motion.tr
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors"
                  >
                    <td className="px-6 py-4 text-white font-medium">{item.property.address}</td>
                    <td className="px-6 py-4 text-gray-300">{item.client.name}</td>
                    <td className="px-6 py-4 text-right text-gray-300">{item.totalPrice.toLocaleString()}</td>
                    <td className="px-6 py-4 text-right text-green-400">{item.paid.toLocaleString()}</td>
                    <td className="px-6 py-4 text-right text-red-400 font-bold">{item.remaining.toLocaleString()}</td>
                    <td className="px-6 py-4 text-center">
                      <span className="bg-red-500/20 text-red-400 px-4 py-2 rounded-lg text-sm font-semibold border border-red-500/30">
                        {item.daysOverdue} days
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    );
  };

  const renderProfitReport = () => {
    if (!reportsData) return null;

    return (
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-yellow-500/10 flex items-center justify-center">
                <FaCoins className="text-amber-400" />
              </div>
              <p className="text-gray-400 text-sm font-medium">Total Revenue</p>
            </div>
            <p className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-yellow-300 bg-clip-text text-transparent">
              {reportsData.totalRevenue.toLocaleString()} EGP
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500/20 to-red-600/10 flex items-center justify-center">
                <FaArrowDown className="text-red-400" />
              </div>
              <p className="text-gray-400 text-sm font-medium">Total Cost</p>
            </div>
            <p className="text-2xl font-bold text-red-400">
              {reportsData.totalCost.toLocaleString()} EGP
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/10 flex items-center justify-center">
                <FaArrowUp className="text-green-400" />
              </div>
              <p className="text-gray-400 text-sm font-medium">Gross Profit</p>
            </div>
            <p className="text-2xl font-bold text-green-400">
              {reportsData.grossProfit.toLocaleString()} EGP
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/10 flex items-center justify-center">
                <FaPercentage className="text-blue-400" />
              </div>
              <p className="text-gray-400 text-sm font-medium">Profit Margin</p>
            </div>
            <p className="text-2xl font-bold text-blue-400">
              {reportsData.profitMargin}%
            </p>
          </motion.div>
        </div>

        {/* Bar Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-yellow-500/10 flex items-center justify-center">
              <FaChartBar className="text-amber-400" />
            </div>
            <h3 className="text-xl font-bold text-white">Monthly Profit Analysis</h3>
          </div>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={reportsData.monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="month" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #F59E0B', borderRadius: '12px' }}
                labelStyle={{ color: '#fff' }}
              />
              <Legend />
              <Bar dataKey="revenue" fill="#F59E0B" name="Revenue" radius={[4, 4, 0, 0]} />
              <Bar dataKey="cost" fill="#EF4444" name="Cost" radius={[4, 4, 0, 0]} />
              <Bar dataKey="profit" fill="#10B981" name="Profit" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    );
  };

  const renderClientsReport = () => {
    if (!reportsData) return null;

    return (
      <div className="space-y-6">
        {/* Summary Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium">Total Clients</p>
              <p className="text-4xl font-bold text-white mt-2">{reportsData.count}</p>
              <p className="text-amber-400 text-sm mt-2 flex items-center gap-2">
                <FaUsers className="text-amber-400" />
                Active client accounts
              </p>
            </div>
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500/20 to-yellow-500/10 flex items-center justify-center">
              <FaUsers className="text-3xl text-amber-400" />
            </div>
          </div>
        </motion.div>

        {/* Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-xl rounded-2xl border border-gray-700/50 overflow-hidden"
        >
          <div className="p-6 border-b border-gray-700/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-yellow-500/10 flex items-center justify-center">
                <FaUsers className="text-amber-400" />
              </div>
              <h3 className="text-xl font-bold text-white">Top Clients</h3>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700/50 bg-gray-800/30">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Client</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-300">Properties</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300">Total Value</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300">Paid</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300">Remaining</th>
                </tr>
              </thead>
              <tbody>
                {reportsData.clients.map((item, index) => (
                  <motion.tr
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-yellow-500/10 flex items-center justify-center">
                          <span className="text-amber-400 font-bold">{item.client.name.charAt(0)}</span>
                        </div>
                        <div>
                          <p className="text-white font-medium">{item.client.name}</p>
                          <p className="text-gray-400 text-sm">{item.client.phone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="bg-amber-500/20 text-amber-400 px-4 py-2 rounded-lg text-sm font-bold border border-amber-500/30">
                        {item.propertiesCount}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right text-white font-bold">{item.totalValue.toLocaleString()} EGP</td>
                    <td className="px-6 py-4 text-right text-green-400 font-medium">{item.totalPaid.toLocaleString()} EGP</td>
                    <td className="px-6 py-4 text-right text-gray-300">{item.remaining.toLocaleString()} EGP</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <div className="flex items-center gap-4 mb-2">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-yellow-400 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <FaChartBar className="text-2xl text-gray-900" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 bg-clip-text text-transparent">
                Financial Reports
              </h1>
              <p className="text-gray-400 mt-1">Generate and export detailed financial analytics</p>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={exportToPDF}
            disabled={!reportsData}
            className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-semibold flex items-center gap-2 shadow-lg shadow-red-500/20 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-xl hover:shadow-red-500/30 transition-all duration-300"
          >
            <FaFilePdf className="text-lg" />
            <span>Export PDF</span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={exportToExcel}
            disabled={!reportsData}
            className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold flex items-center gap-2 shadow-lg shadow-green-500/20 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-xl hover:shadow-green-500/30 transition-all duration-300"
          >
            <FaFileExcel className="text-lg" />
            <span>Export Excel</span>
          </motion.button>
        </div>
      </div>

      {/* Filters Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-yellow-500/10 flex items-center justify-center">
            <FaChartPie className="text-amber-400" />
          </div>
          <h2 className="text-xl font-bold text-white">Report Configuration</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-gray-300 mb-2 text-sm font-medium flex items-center gap-2">
              <FaChartLine className="text-amber-400" />
              Report Type
            </label>
            <div className="relative">
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="w-full px-4 py-3.5 bg-gray-800/50 border border-gray-600/50 rounded-xl focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 focus:outline-none text-white appearance-none cursor-pointer transition-all duration-300"
              >
                <option value="payments">💰 Payments Report</option>
                <option value="overdue">⚠️ Overdue Report</option>
                <option value="profit">📈 Profit Report</option>
                <option value="clients">👥 Clients Report</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-gray-300 mb-2 text-sm font-medium flex items-center gap-2">
              <FaCalendarAlt className="text-amber-400" />
              Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-4 py-3.5 bg-gray-800/50 border border-gray-600/50 rounded-xl focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 focus:outline-none text-white transition-all duration-300"
            />
          </div>
          
          <div>
            <label className="block text-gray-300 mb-2 text-sm font-medium flex items-center gap-2">
              <FaCalendarAlt className="text-amber-400" />
              End Date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-4 py-3.5 bg-gray-800/50 border border-gray-600/50 rounded-xl focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 focus:outline-none text-white transition-all duration-300"
            />
          </div>
        </div>
      </motion.div>

      {/* Report Content */}
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-20"
          >
            <div className="relative">
              <div className="w-16 h-16 rounded-full border-4 border-gray-700 border-t-amber-500 animate-spin"></div>
              <div className="absolute inset-0 w-16 h-16 rounded-full border-4 border-transparent border-b-yellow-400 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
            </div>
            <p className="text-gray-400 mt-4">Loading report data...</p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {reportType === 'payments' && renderPaymentsReport()}
            {reportType === 'overdue' && renderOverdueReport()}
            {reportType === 'profit' && renderProfitReport()}
            {reportType === 'clients' && renderClientsReport()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Reports;
