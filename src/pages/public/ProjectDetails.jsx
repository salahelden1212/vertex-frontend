import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { projectsAPI } from '../../services/apiService';
import { formatDate } from '../../utils/helpers';
import { FaMapMarkerAlt, FaRulerCombined, FaCalendarAlt, FaStar, FaArrowLeft, FaArrowRight, FaTimes, FaExpand, FaChevronLeft, FaChevronRight, FaHome, FaBuilding, FaBriefcase } from 'react-icons/fa';

const ProjectDetails = () => {
  const { id } = useParams();
  const { i18n } = useTranslation();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [allImages, setAllImages] = useState([]);
  const isArabic = i18n.language === 'ar';

  const categoryIcons = {
    residential: FaHome,
    commercial: FaBuilding,
    administrative: FaBriefcase,
  };

  const categoryLabels = {
    residential: isArabic ? 'سكني' : 'Residential',
    commercial: isArabic ? 'تجاري' : 'Commercial',
    administrative: isArabic ? 'إداري' : 'Administrative',
  };

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const data = await projectsAPI.getOne(id);
        setProject(data);
        const images = [];
        if (data.coverImage) {
          images.push({ url: data.coverImage, caption: data.title, isCover: true });
        }
        if (data.images && data.images.length > 0) {
          images.push(...data.images);
        }
        setAllImages(images);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [id]);

  const openLightbox = (index) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    document.body.style.overflow = 'auto';
  };

  const nextImage = () => setLightboxIndex((prev) => (prev + 1) % allImages.length);
  const prevImage = () => setLightboxIndex((prev) => (prev - 1 + allImages.length) % allImages.length);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!lightboxOpen) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, allImages.length]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-amber-200 rounded-full animate-spin border-t-amber-500 mx-auto"></div>
            <div className="w-14 h-14 border-4 border-gray-200 rounded-full animate-spin border-t-gray-500 mx-auto absolute top-3 left-1/2 -translate-x-1/2" style={{ animationDirection: 'reverse' }}></div>
          </div>
          <p className="mt-6 text-gray-400 text-lg">{isArabic ? 'جاري تحميل المشروع...' : 'Loading project...'}</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 rounded-full bg-gray-800/50 flex items-center justify-center mx-auto mb-6">
            <FaBuilding className="text-4xl text-gray-600" />
          </div>
          <p className="text-white text-2xl mb-4">{isArabic ? 'المشروع غير موجود' : 'Project not found'}</p>
          <Link to="/projects" className="inline-flex items-center gap-2 text-amber-400 hover:text-amber-300 transition-colors">
            <FaArrowRight className={isArabic ? '' : 'rotate-180'} />
            <span>{isArabic ? 'العودة للمشاريع' : 'Back to Projects'}</span>
          </Link>
        </div>
      </div>
    );
  }

  const CategoryIcon = categoryIcons[project.category] || FaBuilding;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-[150px]"></div>
        <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[150px]"></div>
      </div>

      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `linear-gradient(rgba(212, 175, 55, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(212, 175, 55, 0.3) 1px, transparent 1px)`,
        backgroundSize: '50px 50px'
      }}></div>

      <div className="relative z-10 pt-32 pb-24">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="mb-8">
            <Link to="/projects" className="inline-flex items-center gap-2 text-gray-400 hover:text-amber-400 transition-colors group">
              <FaArrowRight className={`${isArabic ? '' : 'rotate-180'} group-hover:-translate-x-1 transition-transform`} />
              <span>{isArabic ? 'العودة للمشاريع' : 'Back to Projects'}</span>
            </Link>
          </motion.div>

          <div className="max-w-6xl mx-auto">
            {/* Hero Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative rounded-3xl overflow-hidden mb-12 group cursor-pointer"
              onClick={() => openLightbox(0)}
            >
              <img src={project.coverImage} alt={isArabic ? project.title.ar : project.title.en} className="w-full h-[500px] object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent"></div>
              
              {project.isFeatured && (
                <div className="absolute top-6 left-6">
                  <span className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-yellow-400 text-gray-900 px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                    <FaStar />{isArabic ? 'مشروع مميز' : 'Featured Project'}
                  </span>
                </div>
              )}

              <div className="absolute top-6 right-6">
                <span className="inline-flex items-center gap-2 bg-gray-900/80 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm border border-gray-700/50">
                  <CategoryIcon className="text-amber-400" />{categoryLabels[project.category]}
                </span>
              </div>

              <div className="absolute bottom-6 right-6 bg-gray-900/80 backdrop-blur-sm p-3 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity border border-gray-700/50">
                <FaExpand className="text-white text-xl" />
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-8">
                <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
                  {isArabic ? project.title.ar : project.title.en}
                </motion.h1>
              </div>
            </motion.div>

            {/* Project Info Cards */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {project.location && (
                <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50 hover:border-amber-500/30 transition-all duration-300 group">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <FaMapMarkerAlt className="text-white text-2xl" />
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm mb-1">{isArabic ? 'الموقع' : 'Location'}</p>
                      <p className="text-white font-semibold text-lg">{typeof project.location === 'object' ? (isArabic ? project.location.ar : project.location.en) : project.location}</p>
                    </div>
                  </div>
                </div>
              )}

              {project.area && (
                <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50 hover:border-amber-500/30 transition-all duration-300 group">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-r from-purple-500 to-pink-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <FaRulerCombined className="text-white text-2xl" />
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm mb-1">{isArabic ? 'المساحة' : 'Area'}</p>
                      <p className="text-white font-semibold text-lg">{project.area} {isArabic ? 'م²' : 'm²'}</p>
                    </div>
                  </div>
                </div>
              )}

              {project.completionDate && (
                <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50 hover:border-amber-500/30 transition-all duration-300 group">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-r from-green-500 to-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <FaCalendarAlt className="text-white text-2xl" />
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm mb-1">{isArabic ? 'تاريخ الإنجاز' : 'Completion Date'}</p>
                      <p className="text-white font-semibold text-lg">{formatDate(project.completionDate, isArabic ? 'ar-SA' : 'en-US')}</p>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Description */}
            {project.description && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-xl rounded-3xl p-8 border border-gray-700/50 mb-12">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 flex items-center gap-3">
                  <span className="w-2 h-8 bg-gradient-to-b from-amber-500 to-yellow-400 rounded-full"></span>
                  {isArabic ? 'عن المشروع' : 'About the Project'}
                </h2>
                <p className="text-gray-300 text-lg leading-relaxed">{isArabic ? project.description.ar : project.description.en}</p>
              </motion.div>
            )}

            {/* Gallery */}
            {project.images && project.images.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-8 flex items-center gap-3">
                  <span className="w-2 h-8 bg-gradient-to-b from-amber-500 to-yellow-400 rounded-full"></span>
                  {isArabic ? 'معرض الصور' : 'Gallery'}
                  <span className="text-gray-500 text-lg font-normal">({project.images.length} {isArabic ? 'صورة' : 'images'})</span>
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {project.images.map((image, index) => (
                    <motion.div key={index} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 * index }} className="relative overflow-hidden rounded-2xl group cursor-pointer" onClick={() => openLightbox(index + 1)}>
                      <img src={image.url} alt={image.caption ? (isArabic ? image.caption.ar : image.caption.en) : ''} className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <div className="bg-gray-900/80 backdrop-blur-sm p-4 rounded-xl border border-gray-700/50"><FaExpand className="text-white text-2xl" /></div>
                      </div>
                      {image.caption && (
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-gray-900 to-transparent p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                          <p className="text-white text-sm">{isArabic ? image.caption.ar : image.caption.en}</p>
                        </div>
                      )}
                      <div className="absolute top-4 right-4 bg-gray-900/80 backdrop-blur-sm px-3 py-1 rounded-full text-sm text-white border border-gray-700/50">{index + 1}/{project.images.length}</div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* CTA Section */}
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-16 text-center">
              <div className="inline-flex flex-col md:flex-row items-center gap-6 bg-gradient-to-r from-gray-800/50 to-gray-700/50 backdrop-blur-xl rounded-2xl p-8 border border-gray-600/30">
                <div className="text-center md:text-right">
                  <h3 className="text-2xl font-bold text-white mb-2">{isArabic ? 'أعجبك هذا المشروع؟' : 'Like this project?'}</h3>
                  <p className="text-gray-400">{isArabic ? 'تواصل معنا لنحقق لك مشروع أحلامك' : 'Contact us to make your dream project come true'}</p>
                </div>
                <Link to="/contact" className="bg-gradient-to-r from-amber-500 to-yellow-400 text-gray-900 px-8 py-4 rounded-xl font-bold hover:shadow-xl hover:shadow-amber-500/30 transition-all duration-300 flex items-center gap-2">
                  <span>{isArabic ? 'تواصل معنا' : 'Contact Us'}</span>
                  <FaArrowLeft className={isArabic ? '' : 'rotate-180'} />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxOpen && allImages.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center" onClick={closeLightbox}>
            <button onClick={closeLightbox} className="absolute top-6 right-6 z-10 bg-gray-800/80 backdrop-blur-sm p-3 rounded-xl text-white hover:text-amber-400 hover:bg-gray-700/80 transition-all border border-gray-700/50"><FaTimes className="text-2xl" /></button>
            <div className="absolute top-6 left-6 bg-gray-800/80 backdrop-blur-sm px-4 py-2 rounded-xl text-white border border-gray-700/50"><span className="text-amber-400 font-bold">{lightboxIndex + 1}</span><span className="text-gray-400"> / {allImages.length}</span></div>
            {allImages.length > 1 && (
              <>
                <button onClick={(e) => { e.stopPropagation(); prevImage(); }} className="absolute left-4 md:left-8 z-10 bg-gray-800/80 backdrop-blur-sm p-4 rounded-xl text-white hover:text-amber-400 hover:bg-gray-700/80 transition-all border border-gray-700/50"><FaChevronLeft className="text-2xl" /></button>
                <button onClick={(e) => { e.stopPropagation(); nextImage(); }} className="absolute right-4 md:right-8 z-10 bg-gray-800/80 backdrop-blur-sm p-4 rounded-xl text-white hover:text-amber-400 hover:bg-gray-700/80 transition-all border border-gray-700/50"><FaChevronRight className="text-2xl" /></button>
              </>
            )}
            <motion.div key={lightboxIndex} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="max-w-7xl max-h-[85vh] p-4" onClick={(e) => e.stopPropagation()}>
              <img src={allImages[lightboxIndex]?.url} alt="" className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl" />
              {allImages[lightboxIndex]?.caption && (
                <div className="mt-4 text-center"><p className="text-white text-lg bg-gray-800/80 backdrop-blur-sm inline-block px-6 py-3 rounded-xl border border-gray-700/50">{typeof allImages[lightboxIndex].caption === 'object' ? (isArabic ? allImages[lightboxIndex].caption.ar : allImages[lightboxIndex].caption.en) : allImages[lightboxIndex].caption}</p></div>
              )}
            </motion.div>
            {allImages.length > 1 && (
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 bg-gray-800/80 backdrop-blur-sm p-3 rounded-xl border border-gray-700/50 max-w-[90vw] overflow-x-auto">
                {allImages.map((img, idx) => (
                  <button key={idx} onClick={(e) => { e.stopPropagation(); setLightboxIndex(idx); }} className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${idx === lightboxIndex ? 'border-amber-500 scale-110' : 'border-transparent opacity-50 hover:opacity-100'}`}>
                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProjectDetails;
