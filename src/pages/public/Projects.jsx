import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { projectsAPI } from '../../services/apiService';
import { FaHome, FaBuilding, FaBriefcase, FaThLarge, FaStar, FaArrowRight, FaMapMarkerAlt, FaEye } from 'react-icons/fa';

const Projects = () => {
  const { t, i18n } = useTranslation();
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [hoveredProject, setHoveredProject] = useState(null);
  const isArabic = i18n.language === 'ar';

  const categories = [
    { value: 'all', label: isArabic ? 'الكل' : 'All', icon: FaThLarge },
    { value: 'residential', label: isArabic ? 'سكني' : 'Residential', icon: FaHome },
    { value: 'commercial', label: isArabic ? 'تجاري' : 'Commercial', icon: FaBuilding },
    { value: 'administrative', label: isArabic ? 'إداري' : 'Administrative', icon: FaBriefcase },
  ];

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await projectsAPI.getAll({ isActive: true });
        setProjects(data);
        setFilteredProjects(data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    if (category === 'all') {
      setFilteredProjects(projects);
    } else {
      setFilteredProjects(projects.filter((p) => p.category === category));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-amber-200 rounded-full animate-spin border-t-amber-500 mx-auto"></div>
            <div className="w-14 h-14 border-4 border-gray-200 rounded-full animate-spin border-t-gray-500 mx-auto absolute top-3 left-1/2 -translate-x-1/2" style={{ animationDirection: 'reverse' }}></div>
          </div>
          <p className="mt-6 text-gray-400 text-lg">{isArabic ? 'جاري تحميل المشاريع...' : 'Loading projects...'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
      {/* Premium Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-[150px]"></div>
        <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[150px]"></div>
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `linear-gradient(rgba(212, 175, 55, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(212, 175, 55, 0.3) 1px, transparent 1px)`,
        backgroundSize: '50px 50px'
      }}></div>

      <div className="relative z-10 pt-32 pb-24">
        <div className="container mx-auto px-4">
          {/* Enhanced Header */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500/20 to-amber-600/20 backdrop-blur-sm border border-amber-500/30 rounded-full px-6 py-2 mb-6"
            >
              <FaStar className="text-amber-400" />
              <span className="text-amber-300 font-medium">
                {isArabic ? 'معرض أعمالنا' : 'Our Portfolio'}
              </span>
            </motion.div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
              <span className="text-white">{isArabic ? 'مشاريعنا ' : 'Our '}</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500">
                {isArabic ? 'المميزة' : 'Projects'}
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
              {isArabic
                ? 'استكشف مجموعة من أفضل مشاريعنا التي تعكس خبرتنا وجودة أعمالنا'
                : 'Explore our finest projects that reflect our expertise and quality of work'}
            </p>
          </motion.div>

          {/* Premium Category Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap justify-center gap-4 mb-16"
          >
            {categories.map((cat, index) => {
              const isActive = activeCategory === cat.value;
              return (
                <motion.button
                  key={cat.value}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  onClick={() => handleCategoryChange(cat.value)}
                  className={`relative group px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-3 ${
                    isActive
                      ? 'text-gray-900'
                      : 'bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-700/50 border border-gray-700/50'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeCategory"
                      className="absolute inset-0 bg-gradient-to-r from-amber-500 to-yellow-400 rounded-xl"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                  <cat.icon className={`relative z-10 text-lg ${isActive ? 'text-gray-900' : ''}`} />
                  <span className="relative z-10">{cat.label}</span>
                </motion.button>
              );
            })}
          </motion.div>

          {/* Projects Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-center mb-10"
          >
            <span className="text-gray-500">
              {isArabic ? 'عرض' : 'Showing'} <span className="text-amber-400 font-bold">{filteredProjects.length}</span> {isArabic ? 'مشروع' : 'projects'}
            </span>
          </motion.div>

          {/* Projects Grid */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filteredProjects.map((project, index) => (
                <motion.div
                  key={project._id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  onHoverStart={() => setHoveredProject(project._id)}
                  onHoverEnd={() => setHoveredProject(null)}
                  className="group"
                >
                  <Link to={`/projects/${project._id}`} className="block">
                    <div className="relative bg-gradient-to-br from-gray-800/90 to-gray-900/90 rounded-2xl overflow-hidden border border-gray-700/50 hover:border-amber-500/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-amber-500/10">
                      {/* Image Container */}
                      <div className="relative h-72 overflow-hidden">
                        <img
                          src={project.coverImage}
                          alt={isArabic ? project.title.ar : project.title.en}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        
                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300"></div>
                        
                        {/* Featured Badge */}
                        {project.isFeatured && (
                          <motion.div
                            initial={{ x: -50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            className="absolute top-4 left-4"
                          >
                            <span className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-yellow-400 text-gray-900 px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                              <FaStar />
                              {isArabic ? 'مميز' : 'Featured'}
                            </span>
                          </motion.div>
                        )}

                        {/* Category Badge */}
                        <div className="absolute top-4 right-4">
                          <span className="bg-gray-900/80 backdrop-blur-sm text-gray-300 px-3 py-1 rounded-full text-xs border border-gray-600/50">
                            {categories.find(c => c.value === project.category)?.label || project.category}
                          </span>
                        </div>

                        {/* View Project Overlay */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                          <motion.div
                            initial={{ scale: 0.8 }}
                            whileHover={{ scale: 1 }}
                            className="bg-gradient-to-r from-amber-500 to-yellow-400 text-gray-900 px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg"
                          >
                            <FaEye className="text-lg" />
                            {isArabic ? 'عرض المشروع' : 'View Project'}
                          </motion.div>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6">
                        <h3 className="text-xl md:text-2xl font-bold text-white mb-3 group-hover:text-amber-400 transition-colors duration-300">
                          {isArabic ? project.title.ar : project.title.en}
                        </h3>
                        
                        {project.description && (
                          <p className="text-gray-400 text-sm line-clamp-2 mb-4 leading-relaxed">
                            {isArabic ? project.description.ar : project.description.en}
                          </p>
                        )}

                        {/* Project Meta */}
                        <div className="flex items-center justify-between pt-4 border-t border-gray-700/50">
                          {project.location && (
                            <div className="flex items-center gap-2 text-gray-500 text-sm">
                              <FaMapMarkerAlt className="text-amber-500" />
                              <span>{isArabic ? project.location.ar : project.location.en}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-2 text-amber-400 font-medium text-sm group-hover:gap-3 transition-all duration-300">
                            <span>{isArabic ? 'المزيد' : 'Details'}</span>
                            <FaArrowRight className={isArabic ? 'rotate-180' : ''} />
                          </div>
                        </div>
                      </div>

                      {/* Bottom Gradient Line */}
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Empty State */}
          {filteredProjects.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20"
            >
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gray-800/50 mb-6">
                <FaBuilding className="text-4xl text-gray-600" />
              </div>
              <p className="text-gray-400 text-2xl mb-4">
                {isArabic ? 'لا توجد مشاريع في هذه الفئة' : 'No projects in this category'}
              </p>
              <p className="text-gray-500">
                {isArabic ? 'جرب اختيار فئة أخرى' : 'Try selecting another category'}
              </p>
            </motion.div>
          )}

          {/* Bottom CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-20 text-center"
          >
            <div className="inline-flex flex-col md:flex-row items-center gap-6 bg-gradient-to-r from-gray-800/50 to-gray-700/50 backdrop-blur-xl rounded-2xl p-8 border border-gray-600/30">
              <div className="text-center md:text-right">
                <h3 className="text-2xl font-bold text-white mb-2">
                  {isArabic ? 'هل لديك مشروع؟' : 'Have a project in mind?'}
                </h3>
                <p className="text-gray-400">
                  {isArabic ? 'دعنا نحول رؤيتك إلى واقع' : 'Let us turn your vision into reality'}
                </p>
              </div>
              <Link
                to="/contact"
                className="bg-gradient-to-r from-amber-500 to-yellow-400 text-gray-900 px-8 py-4 rounded-xl font-bold hover:shadow-xl hover:shadow-amber-500/30 transition-all duration-300 flex items-center gap-2"
              >
                <span>{isArabic ? 'تواصل معنا' : 'Contact Us'}</span>
                <FaArrowRight className={isArabic ? 'rotate-180' : ''} />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Projects;
