import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, momentLocalizer, dateFnsLocalizer } from 'react-big-calendar';
import { Gantt, ViewMode } from 'gantt-task-react';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'gantt-task-react/dist/index.css';
import { tasksAPI, milestonesAPI, propertiesAPI } from '../../services/apiService';
import { 
  FaPlus, 
  FaCalendar, 
  FaTasks, 
  FaFlag, 
  FaEdit, 
  FaTrash, 
  FaCheck, 
  FaChevronLeft, 
  FaChevronRight,
  FaTimes,
  FaClock,
  FaListUl,
  FaChartGantt,
  FaRegCalendarAlt,
  FaBuilding,
  FaExclamationCircle,
  FaCheckCircle,
  FaSpinner
} from 'react-icons/fa';

// Initialize moment localizer (using default locale for proper number display)
const localizer = momentLocalizer(moment);

// Custom formats for calendar
const formats = {
  dateFormat: 'D',
  dayFormat: 'ddd D',
  weekdayFormat: 'dddd',
  monthHeaderFormat: 'MMMM YYYY',
  dayHeaderFormat: 'dddd، D MMMM YYYY',
  dayRangeHeaderFormat: ({ start, end }) =>
    `${moment(start).format('D MMMM')} - ${moment(end).format('D MMMM YYYY')}`,
};

export default function Timeline() {
  const [view, setView] = useState('calendar'); // 'calendar' or 'gantt'
  const [tasks, setTasks] = useState([]);
  const [milestones, setMilestones] = useState([]);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showMilestoneModal, setShowMilestoneModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [ganttViewMode, setGanttViewMode] = useState(ViewMode.Month);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const normalizeList = (res) => {
      if (!res) return [];
      if (Array.isArray(res)) return res;
      if (Array.isArray(res?.data)) return res.data;
      if (Array.isArray(res?.data?.data)) return res.data.data;
      return [];
    };

    try {
      setLoading(true);
      const [tasksRes, milestonesRes, propsRes] = await Promise.all([
        tasksAPI.getAll(),
        milestonesAPI.getAll(),
        propertiesAPI.getAll()
      ]);

      const tasksData = normalizeList(tasksRes);
      const milestonesData = normalizeList(milestonesRes);
      const propertiesData = normalizeList(propsRes);

      console.log('Tasks loaded:', tasksData);
      console.log('Milestones loaded:', milestonesData);
      console.log('Properties loaded:', propertiesData);

      setTasks(tasksData);
      setMilestones(milestonesData);
      setProperties(propertiesData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getProgressColor = (progress) => {
    if (progress < 30) return '#ef4444';
    if (progress < 70) return '#f59e0b';
    return '#10b981';
  };

  // Convert tasks and milestones to calendar events
  const calendarEvents = useMemo(() => {
    const toDate = (value) => {
      const date = value ? new Date(value) : null;
      return date && !isNaN(date) ? date : null;
    };

    const ensureEndAfterStart = (start, end) => {
      if (!start || !end) return null;
      if (end > start) return end;
      const bumped = new Date(end);
      bumped.setDate(bumped.getDate() + 1);
      return bumped;
    };

    const taskEvents = tasks.reduce((events, task) => {
      const start = toDate(task.startDate);
      const end = ensureEndAfterStart(start, toDate(task.endDate));
      if (!start || !end) return events;
      events.push({
        id: `task-${task._id}`,
        title: task.title,
        start,
        end,
        resource: { type: 'task', data: task },
        className: `event-${task.status}`
      });
      return events;
    }, []);

    const milestoneEvents = milestones.reduce((events, milestone) => {
      const date = toDate(milestone.date);
      if (!date) return events;
      events.push({
        id: `milestone-${milestone._id}`,
        title: `🎯 ${milestone.title}`,
        start: date,
        end: new Date(date.getTime() + 24 * 60 * 60 * 1000),
        resource: { type: 'milestone', data: milestone },
        allDay: true,
        className: milestone.isCompleted ? 'event-completed' : 'event-milestone'
      });
      return events;
    }, []);

    return [...taskEvents, ...milestoneEvents];
  }, [tasks, milestones]);

  // Convert tasks to Gantt format
  const ganttTasks = useMemo(() => {
    const toDate = (value) => {
      if (!value) return null;
      const date = new Date(value);
      return !isNaN(date.getTime()) ? date : null;
    };

    const result = [];
    let displayOrder = 0;

    for (const task of tasks) {
      const start = toDate(task.startDate);
      const endRaw = toDate(task.endDate);

      if (!start || !endRaw) {
        console.warn('Skipping task with invalid dates', task);
        continue;
      }

      // Ensure end is after start (at least 1 day)
      const end = endRaw > start ? endRaw : new Date(start.getTime() + 24 * 60 * 60 * 1000);

      result.push({
        start: new Date(start.getTime()),
        end: new Date(end.getTime()),
        name: task.title || 'مهمة بدون عنوان',
        id: task._id || `task-${displayOrder}`,
        type: 'task',
        progress: task.progress || 0,
        isDisabled: false,
        displayOrder: displayOrder++,
        styles: {
          progressColor: getProgressColor(task.progress),
          progressSelectedColor: getProgressColor(task.progress)
        }
      });
    }

    return result;
  }, [tasks]);

  const eventStyleGetter = (event) => {
    const colors = {
      'event-pending': { backgroundColor: '#94a3b8', color: 'white' },
      'event-in-progress': { backgroundColor: '#3b82f6', color: 'white' },
      'event-completed': { backgroundColor: '#10b981', color: 'white' },
      'event-on-hold': { backgroundColor: '#f59e0b', color: 'white' },
      'event-cancelled': { backgroundColor: '#ef4444', color: 'white' },
      'event-milestone': { backgroundColor: '#8b5cf6', color: 'white' }
    };

    return {
      style: colors[event.className] || {}
    };
  };

  const handleSelectEvent = (event) => {
    const { type, data } = event.resource;
    if (type === 'task') {
      setEditingItem(data);
      setShowTaskModal(true);
    } else {
      setEditingItem(data);
      setShowMilestoneModal(true);
    }
  };

  const handleDeleteTask = async (id) => {
    if (!window.confirm('هل أنت متأكد من حذف هذه المهمة؟')) return;
    try {
      await tasksAPI.delete(id);
      fetchData();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleDeleteMilestone = async (id) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا الحدث المهم؟')) return;
    try {
      await milestonesAPI.delete(id);
      fetchData();
    } catch (error) {
      console.error('Error deleting milestone:', error);
    }
  };

  const handleToggleMilestone = async (id) => {
    try {
      await milestonesAPI.toggle(id);
      fetchData();
    } catch (error) {
      console.error('Error toggling milestone:', error);
    }
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-yellow-400 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <FaCalendar className="text-2xl text-gray-900" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 bg-clip-text text-transparent">
                التقويم والجدول الزمني
              </h1>
              <p className="text-gray-400 mt-1">إدارة المهام والأحداث المهمة للمشاريع</p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setEditingItem(null);
                setShowTaskModal(true);
              }}
              className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300"
            >
              <FaPlus /> مهمة جديدة
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setEditingItem(null);
                setShowMilestoneModal(true);
              }}
              className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl font-semibold shadow-lg shadow-purple-500/20 hover:shadow-xl hover:shadow-purple-500/30 transition-all duration-300"
            >
              <FaFlag /> حدث مهم جديد
            </motion.button>
          </div>
        </div>

        {/* View Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-xl rounded-2xl p-4 border border-gray-700/50"
        >
          <div className="flex flex-wrap items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setView('calendar')}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold transition-all duration-300 ${
                view === 'calendar' 
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-gray-900 shadow-lg shadow-amber-500/20' 
                  : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 border border-gray-600/50'
              }`}
            >
              <FaCalendar /> عرض التقويم
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setView('gantt')}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold transition-all duration-300 ${
                view === 'gantt' 
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-gray-900 shadow-lg shadow-amber-500/20' 
                  : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 border border-gray-600/50'
              }`}
            >
              <FaTasks /> الجدول الزمني
            </motion.button>

            {view === 'gantt' && (
              <div className="flex gap-2 mr-auto">
                {[
                  { mode: ViewMode.Day, label: 'يوم' },
                  { mode: ViewMode.Week, label: 'أسبوع' },
                  { mode: ViewMode.Month, label: 'شهر' }
                ].map(({ mode, label }) => (
                  <motion.button
                    key={mode}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setGanttViewMode(mode)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      ganttViewMode === mode 
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' 
                        : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50 border border-gray-700/50'
                    }`}
                  >
                    {label}
                  </motion.button>
                ))}
              </div>
            )}
          </div>
        </motion.div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative">
              <div className="w-16 h-16 rounded-full border-4 border-gray-700 border-t-amber-500 animate-spin"></div>
              <div className="absolute inset-0 w-16 h-16 rounded-full border-4 border-transparent border-b-yellow-400 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
            </div>
            <p className="text-gray-400 mt-4">جاري التحميل...</p>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {/* Calendar View */}
            {view === 'calendar' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50 shadow-xl"
                style={{ height: 700 }}
              >
                <Calendar
                  localizer={localizer}
                  events={calendarEvents}
                  startAccessor="start"
                  endAccessor="end"
                  eventPropGetter={eventStyleGetter}
                  onSelectEvent={handleSelectEvent}
                  formats={formats}
                  views={['month', 'week', 'day', 'agenda']}
                  defaultView="month"
                  popup
                  selectable
                  messages={{
                    next: 'التالي ←',
                    previous: '→ السابق',
                    today: 'اليوم',
                    month: 'شهر',
                    week: 'أسبوع',
                    day: 'يوم',
                    agenda: 'جدول',
                    date: 'التاريخ',
                    time: 'الوقت',
                    event: 'حدث',
                    allDay: 'طوال اليوم',
                    work_week: 'أسبوع العمل',
                    yesterday: 'أمس',
                    tomorrow: 'غداً',
                    noEventsInRange: 'لا توجد أحداث في هذا النطاق',
                    showMore: (total) => `+${total} أخرى`
                  }}
                />
              </motion.div>
            )}

            {/* Gantt View */}
            {view === 'gantt' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50 overflow-x-auto"
              >
                {ganttTasks.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="w-20 h-20 rounded-full bg-gray-800/50 flex items-center justify-center mx-auto mb-4">
                      <FaTasks className="text-3xl text-gray-500" />
                    </div>
                    <p className="text-gray-400 text-lg">لا توجد مهام صالحة لعرضها في الجدول الزمني</p>
                  </div>
                ) : (
                  <Gantt
                    tasks={ganttTasks}
                    viewMode={ganttViewMode}
                    locale="ar"
                    listCellWidth="155"
                    columnWidth={ganttViewMode === ViewMode.Month ? 300 : 100}
                  />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        )}

        {/* Task Modal */}
        <AnimatePresence>
          {showTaskModal && (
            <TaskModal
              task={editingItem}
              properties={properties}
              onClose={() => {
                setShowTaskModal(false);
                setEditingItem(null);
              }}
              onSave={() => {
                fetchData();
                setShowTaskModal(false);
                setEditingItem(null);
              }}
              onDelete={handleDeleteTask}
            />
          )}
        </AnimatePresence>

        {/* Milestone Modal */}
        <AnimatePresence>
          {showMilestoneModal && (
            <MilestoneModal
              milestone={editingItem}
              properties={properties}
              onClose={() => {
                setShowMilestoneModal(false);
                setEditingItem(null);
              }}
              onSave={() => {
                fetchData();
                setShowMilestoneModal(false);
                setEditingItem(null);
              }}
              onDelete={handleDeleteMilestone}
              onToggle={handleToggleMilestone}
            />
          )}
        </AnimatePresence>
      </div>

      <style>{`
        .rbc-calendar {
          font-family: 'Segoe UI', Tahoma, Geneva, sans-serif;
          background: transparent;
          border-radius: 12px;
        }
        .rbc-header {
          padding: 14px 8px;
          font-weight: 600;
          font-size: 13px;
          background: linear-gradient(135deg, rgba(31, 41, 55, 0.8) 0%, rgba(17, 24, 39, 0.8) 100%);
          color: #9CA3AF;
          border-bottom: 2px solid rgba(75, 85, 99, 0.5);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .rbc-month-view {
          border: none;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0,0,0,0.2);
          background: rgba(31, 41, 55, 0.5);
        }
        .rbc-month-row {
          min-height: 110px;
          border-color: rgba(75, 85, 99, 0.3);
        }
        .rbc-day-bg {
          background: rgba(31, 41, 55, 0.3);
          transition: background-color 0.2s;
        }
        .rbc-day-bg:hover {
          background: rgba(55, 65, 81, 0.5);
        }
        .rbc-day-bg + .rbc-day-bg {
          border-left: 1px solid rgba(75, 85, 99, 0.3);
        }
        .rbc-off-range-bg {
          background: rgba(17, 24, 39, 0.5);
        }
        .rbc-today {
          background-color: rgba(245, 158, 11, 0.1) !important;
          border: 2px solid rgba(245, 158, 11, 0.5) !important;
        }
        .rbc-date-cell {
          padding: 10px 12px;
          text-align: right;
          font-size: 15px;
          font-weight: 600;
          color: #E5E7EB;
        }
        .rbc-date-cell.rbc-now {
          font-weight: 700;
        }
        .rbc-date-cell > a,
        .rbc-date-cell button,
        .rbc-button-link {
          color: #E5E7EB !important;
          font-weight: 600 !important;
          font-size: 15px !important;
          text-decoration: none !important;
          background: none !important;
          border: none !important;
          cursor: default !important;
        }
        .rbc-off-range .rbc-button-link,
        .rbc-off-range a {
          color: #6B7280 !important;
        }
        .rbc-now .rbc-button-link {
          color: #F59E0B !important;
          font-weight: 700 !important;
        }
        .rbc-event {
          border-radius: 8px;
          padding: 4px 10px;
          font-size: 12px;
          font-weight: 500;
          border: none !important;
          box-shadow: 0 2px 8px rgba(0,0,0,0.2);
          transition: transform 0.15s, box-shadow 0.15s;
        }
        .rbc-event:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(0,0,0,0.25);
        }
        .rbc-event-content {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .rbc-toolbar {
          padding: 16px 20px;
          background: linear-gradient(135deg, rgba(31, 41, 55, 0.8) 0%, rgba(17, 24, 39, 0.8) 100%);
          border-radius: 12px 12px 0 0;
          margin-bottom: 0;
          flex-wrap: wrap;
          gap: 12px;
          border-bottom: 1px solid rgba(75, 85, 99, 0.5);
        }
        .rbc-toolbar button {
          color: #9CA3AF;
          background: rgba(55, 65, 81, 0.5);
          border: 1px solid rgba(75, 85, 99, 0.5);
          padding: 10px 18px;
          border-radius: 10px;
          font-weight: 600;
          font-size: 14px;
          transition: all 0.2s;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .rbc-toolbar button:hover {
          background-color: rgba(75, 85, 99, 0.5);
          border-color: rgba(107, 114, 128, 0.5);
          color: #E5E7EB;
          transform: translateY(-1px);
        }
        .rbc-toolbar button.rbc-active {
          background: linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%);
          color: #111827;
          border-color: #F59E0B;
          box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
        }
        .rbc-toolbar-label {
          font-size: 20px;
          font-weight: 700;
          color: #E5E7EB;
          flex: 1;
          text-align: center;
        }
        .rbc-btn-group {
          display: flex;
          gap: 4px;
        }
        .rbc-btn-group button:first-child {
          border-radius: 10px 0 0 10px;
        }
        .rbc-btn-group button:last-child {
          border-radius: 0 10px 10px 0;
        }
        .rbc-row-segment {
          padding: 1px 3px;
        }
        .rbc-show-more {
          color: #F59E0B;
          font-weight: 600;
          font-size: 11px;
          background: rgba(245, 158, 11, 0.1);
          padding: 2px 8px;
          border-radius: 6px;
          margin-top: 2px;
          border: 1px solid rgba(245, 158, 11, 0.3);
        }
        .rbc-overlay {
          background: rgba(31, 41, 55, 0.95);
          backdrop-filter: blur(12px);
          border-radius: 16px;
          box-shadow: 0 20px 50px rgba(0,0,0,0.4);
          border: 1px solid rgba(75, 85, 99, 0.5);
          padding: 16px;
        }
        .rbc-overlay-header {
          font-weight: 700;
          font-size: 14px;
          color: #E5E7EB;
          padding-bottom: 10px;
          border-bottom: 1px solid rgba(75, 85, 99, 0.5);
          margin-bottom: 10px;
        }
        .rbc-agenda-view {
          border: none;
          border-radius: 12px;
          background: rgba(31, 41, 55, 0.5);
        }
        .rbc-agenda-table {
          border: none;
          color: #E5E7EB;
        }
        .rbc-agenda-date-cell,
        .rbc-agenda-time-cell {
          padding: 12px;
          font-weight: 500;
          color: #9CA3AF;
          background: rgba(31, 41, 55, 0.5);
        }
        .rbc-agenda-event-cell {
          padding: 12px;
          color: #E5E7EB;
          background: rgba(31, 41, 55, 0.3);
        }
        .rbc-time-view {
          background: rgba(31, 41, 55, 0.5);
          border: none;
        }
        .rbc-time-header {
          background: rgba(31, 41, 55, 0.8);
        }
        .rbc-time-content {
          border-top: 1px solid rgba(75, 85, 99, 0.3);
        }
        .rbc-timeslot-group {
          border-bottom: 1px solid rgba(75, 85, 99, 0.2);
        }
        .rbc-time-slot {
          color: #6B7280;
        }
        .rbc-current-time-indicator {
          background-color: #F59E0B;
        }
      `}</style>
    </div>
  );
}

// Task Modal Component
function TaskModal({ task, properties, onClose, onSave, onDelete }) {
  const [formData, setFormData] = useState({
    property: task?.property?._id || '',
    title: task?.title || '',
    description: task?.description || '',
    startDate: task?.startDate ? moment(task.startDate).format('YYYY-MM-DD') : '',
    endDate: task?.endDate ? moment(task.endDate).format('YYYY-MM-DD') : '',
    status: task?.status || 'pending',
    priority: task?.priority || 'medium',
    progress: task?.progress || 0
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      console.log('Sending task data:', formData);
      
      let result;
      if (task?._id) {
        result = await tasksAPI.update(task._id, formData);
      } else {
        result = await tasksAPI.create(formData);
      }
      
      console.log('Task saved successfully:', result);
      alert('✅ تم حفظ المهمة بنجاح');
      onSave();
    } catch (error) {
      console.error('Error saving task:', error);
      console.error('Error response:', error.response?.data);
      alert('❌ حدث خطأ أثناء الحفظ: ' + (error.response?.data?.message || error.message));
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.2 }}
        className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden border border-gray-700/50"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="sticky top-0 bg-gradient-to-r from-gray-800 to-gray-900 border-b border-gray-700/50 px-8 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <FaTasks className="text-xl text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">
                {task ? 'تعديل المهمة' : 'مهمة جديدة'}
              </h2>
              <p className="text-gray-400 text-sm">أدخل تفاصيل المهمة</p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="w-10 h-10 rounded-xl bg-gray-700/50 hover:bg-gray-600/50 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
          >
            <FaTimes className="text-lg" />
          </motion.button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-5 max-h-[calc(90vh-80px)] overflow-y-auto">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
              <FaBuilding className="text-amber-400" /> المشروع
            </label>
            <select
              value={formData.property}
              onChange={(e) => setFormData({ ...formData, property: e.target.value })}
              required
              className="w-full px-4 py-3.5 bg-gray-800/50 border border-gray-600/50 rounded-xl focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 focus:outline-none text-white transition-all duration-300"
            >
              <option value="">اختر المشروع</option>
              {properties.map(prop => (
                <option key={prop._id} value={prop._id}>
                  {prop.address} - {prop.client?.name || 'عميل غير محدد'}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
              <FaTasks className="text-amber-400" /> عنوان المهمة
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              className="w-full px-4 py-3.5 bg-gray-800/50 border border-gray-600/50 rounded-xl focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 focus:outline-none text-white transition-all duration-300"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">الوصف</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-3.5 bg-gray-800/50 border border-gray-600/50 rounded-xl focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 focus:outline-none text-white transition-all duration-300 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                <FaCalendar className="text-amber-400" /> تاريخ البدء
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                required
                className="w-full px-4 py-3.5 bg-gray-800/50 border border-gray-600/50 rounded-xl focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 focus:outline-none text-white transition-all duration-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                <FaCalendar className="text-amber-400" /> تاريخ الانتهاء
              </label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                required
                className="w-full px-4 py-3.5 bg-gray-800/50 border border-gray-600/50 rounded-xl focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 focus:outline-none text-white transition-all duration-300"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">الحالة</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-4 py-3.5 bg-gray-800/50 border border-gray-600/50 rounded-xl focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 focus:outline-none text-white transition-all duration-300"
              >
                <option value="pending">⏳ قيد الانتظار</option>
                <option value="in-progress">🔄 جاري التنفيذ</option>
                <option value="completed">✅ مكتملة</option>
                <option value="on-hold">⏸️ متوقفة</option>
                <option value="cancelled">❌ ملغاة</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">الأولوية</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="w-full px-4 py-3.5 bg-gray-800/50 border border-gray-600/50 rounded-xl focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 focus:outline-none text-white transition-all duration-300"
              >
                <option value="low">🟢 منخفضة</option>
                <option value="medium">🟡 متوسطة</option>
                <option value="high">🟠 عالية</option>
                <option value="urgent">🔴 عاجلة</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              نسبة الإنجاز: <span className="text-amber-400 font-bold">{formData.progress}%</span>
            </label>
            <div className="relative">
              <input
                type="range"
                min="0"
                max="100"
                value={formData.progress}
                onChange={(e) => setFormData({ ...formData, progress: parseInt(e.target.value) })}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
              <div 
                className="absolute top-0 left-0 h-2 bg-gradient-to-r from-amber-500 to-yellow-400 rounded-lg pointer-events-none"
                style={{ width: `${formData.progress}%` }}
              ></div>
            </div>
          </div>

          <div className="flex gap-3 pt-6 border-t border-gray-700/50">
            <motion.button
              type="submit"
              disabled={saving}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 py-3.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {saving ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  جاري الحفظ...
                </>
              ) : (
                <>
                  <FaCheck /> حفظ
                </>
              )}
            </motion.button>
            {task && (
              <motion.button
                type="button"
                onClick={() => onDelete(task._id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-3.5 bg-red-500/20 text-red-400 rounded-xl font-semibold border border-red-500/30 hover:bg-red-500/30 transition-all duration-300 flex items-center gap-2"
              >
                <FaTrash /> حذف
              </motion.button>
            )}
            <motion.button
              type="button"
              onClick={onClose}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-3.5 bg-gray-700/50 text-gray-300 rounded-xl font-semibold border border-gray-600/50 hover:bg-gray-600/50 transition-all duration-300"
            >
              إلغاء
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

// Milestone Modal Component
function MilestoneModal({ milestone, properties, onClose, onSave, onDelete, onToggle }) {
  const [formData, setFormData] = useState({
    property: milestone?.property?._id || '',
    title: milestone?.title || '',
    date: milestone?.date ? moment(milestone.date).format('YYYY-MM-DD') : '',
    category: milestone?.category || 'planning',
    notifyBefore: milestone?.notifyBefore || 7
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      let result;
      if (milestone?._id) {
        result = await milestonesAPI.update(milestone._id, formData);
      } else {
        result = await milestonesAPI.create(formData);
      }
      console.log('Milestone saved successfully:', result);
      alert('✅ تم حفظ الحدث المهم بنجاح');
      onSave();
    } catch (error) {
      console.error('Error saving milestone:', error);
      alert('❌ حدث خطأ أثناء الحفظ: ' + (error.response?.data?.message || error.message));
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.2 }}
        className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden border border-gray-700/50"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="sticky top-0 bg-gradient-to-r from-gray-800 to-gray-900 border-b border-gray-700/50 px-8 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
              <FaFlag className="text-xl text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">
                {milestone ? 'تعديل الحدث المهم' : 'حدث مهم جديد'}
              </h2>
              <p className="text-gray-400 text-sm">أدخل تفاصيل الحدث المهم</p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="w-10 h-10 rounded-xl bg-gray-700/50 hover:bg-gray-600/50 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
          >
            <FaTimes className="text-lg" />
          </motion.button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-5 max-h-[calc(90vh-80px)] overflow-y-auto">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
              <FaBuilding className="text-amber-400" /> المشروع
            </label>
            <select
              value={formData.property}
              onChange={(e) => setFormData({ ...formData, property: e.target.value })}
              required
              className="w-full px-4 py-3.5 bg-gray-800/50 border border-gray-600/50 rounded-xl focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 focus:outline-none text-white transition-all duration-300"
            >
              <option value="">اختر المشروع</option>
              {properties.map(prop => (
                <option key={prop._id} value={prop._id}>
                  {prop.address} - {prop.client?.name || 'عميل غير محدد'}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
              <FaFlag className="text-amber-400" /> عنوان الحدث
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              className="w-full px-4 py-3.5 bg-gray-800/50 border border-gray-600/50 rounded-xl focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 focus:outline-none text-white transition-all duration-300"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                <FaCalendar className="text-amber-400" /> التاريخ
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
                className="w-full px-4 py-3.5 bg-gray-800/50 border border-gray-600/50 rounded-xl focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 focus:outline-none text-white transition-all duration-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">التصنيف</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-3.5 bg-gray-800/50 border border-gray-600/50 rounded-xl focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 focus:outline-none text-white transition-all duration-300"
              >
                <option value="planning">📋 تخطيط</option>
                <option value="construction">🏗️ إنشاء</option>
                <option value="inspection">🔍 معاينة</option>
                <option value="payment">💰 دفعة</option>
                <option value="delivery">🎉 تسليم</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
              <FaClock className="text-amber-400" /> التذكير قبل (بالأيام)
            </label>
            <input
              type="number"
              value={formData.notifyBefore}
              onChange={(e) => setFormData({ ...formData, notifyBefore: parseInt(e.target.value) })}
              min="0"
              className="w-full px-4 py-3.5 bg-gray-800/50 border border-gray-600/50 rounded-xl focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 focus:outline-none text-white transition-all duration-300"
            />
          </div>

          {milestone && (
            <div className="border-t border-gray-700/50 pt-5">
              <motion.button
                type="button"
                onClick={() => onToggle(milestone._id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold transition-all duration-300 ${
                  milestone.isCompleted
                    ? 'bg-gray-700/50 text-gray-300 border border-gray-600/50 hover:bg-gray-600/50'
                    : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/20 hover:shadow-xl hover:shadow-green-500/30'
                }`}
              >
                <FaCheck />
                {milestone.isCompleted ? '✓ تم الإكمال' : 'تعيين كمكتمل'}
              </motion.button>
            </div>
          )}

          <div className="flex gap-3 pt-6 border-t border-gray-700/50">
            <motion.button
              type="submit"
              disabled={saving}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 py-3.5 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl font-bold shadow-lg shadow-purple-500/20 hover:shadow-xl hover:shadow-purple-500/30 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {saving ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  جاري الحفظ...
                </>
              ) : (
                <>
                  <FaCheck /> حفظ
                </>
              )}
            </motion.button>
            {milestone && (
              <motion.button
                type="button"
                onClick={() => onDelete(milestone._id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-3.5 bg-red-500/20 text-red-400 rounded-xl font-semibold border border-red-500/30 hover:bg-red-500/30 transition-all duration-300 flex items-center gap-2"
              >
                <FaTrash /> حذف
              </motion.button>
            )}
            <motion.button
              type="button"
              onClick={onClose}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-3.5 bg-gray-700/50 text-gray-300 rounded-xl font-semibold border border-gray-600/50 hover:bg-gray-600/50 transition-all duration-300"
            >
              إلغاء
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
