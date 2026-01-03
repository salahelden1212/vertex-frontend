import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus, FaEdit, FaTrash, FaStar, FaImage, FaTimes, FaFolder, FaCalendar, FaEye, FaBuilding, FaHome, FaBriefcase } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { projectsAPI } from '../../services/apiService';
import ImageUpload from '../../components/ImageUpload';

const ProjectsManagement = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [formData, setFormData] = useState({
    title: { ar: '', en: '' },
    description: { ar: '', en: '' },
    category: 'residential',
    coverImage: '',
    images: [{ url: '', caption: { ar: '', en: '' } }],
    isFeatured: false,
    completionDate: ''
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const data = await projectsAPI.getAll();
      setProjects(data);
    } catch (error) {
      toast.error('Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate cover image
    if (!formData.coverImage) {
      return toast.error('Please upload a cover image');
    }
    
    try {
      const projectData = {
        ...formData,
        images: formData.images.filter(img => {
          // Handle both string URLs and objects with url property
          const url = typeof img === 'string' ? img : img?.url;
          return url && typeof url === 'string' && url.trim() !== '';
        }).map(img => {
          // Ensure all images are in the correct object format
          if (typeof img === 'string') {
            return { url: img, caption: { ar: '', en: '' } };
          }
          return img;
        })
      };

      // Remove empty client field to avoid validation error
      if (!projectData.client || projectData.client === '') {
        delete projectData.client;
      }

      if (editingProject) {
        await projectsAPI.update(editingProject._id, projectData);
        toast.success('Project updated successfully!');
      } else {
        await projectsAPI.create(projectData);
        toast.success('Project created successfully!');
      }

      fetchProjects();
      handleCloseModal();
    } catch (error) {
      console.error('Project creation/update error:', error);
      console.error('Error response:', error.response?.data);
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    
    try {
      await projectsAPI.delete(id);
      toast.success('Project deleted successfully!');
      fetchProjects();
    } catch (error) {
      toast.error('Failed to delete project');
    }
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      description: project.description,
      category: project.category,
      coverImage: project.coverImage || '',
      images: project.images.length > 0 ? project.images : [{ url: '', caption: { ar: '', en: '' } }],
      client: project.client || '',
      isFeatured: project.isFeatured,
      completionDate: project.completionDate ? new Date(project.completionDate).toISOString().split('T')[0] : ''
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingProject(null);
    setFormData({
      title: { ar: '', en: '' },
      description: { ar: '', en: '' },
      category: 'residential',
      coverImage: '',
      images: [{ url: '', caption: { ar: '', en: '' } }],
      client: '',
      isFeatured: false,
      completionDate: ''
    });
  };

  const addImage = () => {
    setFormData({
      ...formData,
      images: [...formData.images, { url: '', caption: { ar: '', en: '' } }]
    });
  };

  const removeImage = (index) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData({ ...formData, images: newImages });
  };

  const updateImage = (index, field, value, lang = null) => {
    const newImages = [...formData.images];
    if (lang) {
      newImages[index].caption[lang] = value;
    } else {
      newImages[index][field] = value;
    }
    setFormData({ ...formData, images: newImages });
  };

  const filteredProjects = categoryFilter === 'all' 
    ? projects 
    : projects.filter(p => p.category === categoryFilter);

  const getCategoryColor = (category) => {
    switch (category) {
      case 'residential': return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      case 'commercial': return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'administrative': return 'bg-purple-500/20 text-purple-400 border-purple-500/50';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'residential': return <FaHome />;
      case 'commercial': return <FaBuilding />;
      case 'administrative': return <FaBriefcase />;
      default: return <FaFolder />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Projects <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-300">Management</span>
          </h1>
          <p className="text-gray-400">Manage your portfolio and showcase projects</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-yellow-400 text-gray-900 rounded-xl font-semibold shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 transition-all"
        >
          <FaPlus />
          <span>Add Project</span>
        </motion.button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Projects', value: projects.length, gradient: 'from-amber-500 to-yellow-500', icon: FaFolder },
          { label: 'Residential', value: projects.filter(p => p.category === 'residential').length, gradient: 'from-blue-500 to-cyan-500', icon: FaHome },
          { label: 'Commercial', value: projects.filter(p => p.category === 'commercial').length, gradient: 'from-green-500 to-emerald-500', icon: FaBuilding },
          { label: 'Featured', value: projects.filter(p => p.isFeatured).length, gradient: 'from-purple-500 to-pink-500', icon: FaStar },
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

      {/* Category Filter */}
      <div className="flex gap-3 overflow-x-auto pb-2">
        {['all', 'residential', 'commercial', 'administrative'].map((cat) => (
          <motion.button
            key={cat}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setCategoryFilter(cat)}
            className={`px-5 py-2.5 rounded-xl whitespace-nowrap transition-all font-medium ${
              categoryFilter === cat
                ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-gray-900 shadow-lg shadow-amber-500/20'
                : 'bg-gray-800/60 text-gray-400 hover:bg-gray-700/60 border border-gray-700/50'
            }`}
          >
            <span className="flex items-center gap-2">
              {cat !== 'all' && getCategoryIcon(cat)}
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </span>
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
            <p className="mt-4 text-gray-400">Loading projects...</p>
          </div>
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-xl rounded-2xl border border-gray-700/50 text-center py-16">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center mx-auto mb-4">
            <FaImage className="text-4xl text-gray-500" />
          </div>
          <p className="text-gray-400 text-lg">No projects in this category yet</p>
          <p className="text-gray-500 text-sm mt-2">Add your first project to get started</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-xl rounded-2xl border border-gray-700/50 group hover:border-amber-500/30 transition-all overflow-hidden"
            >
              {/* Cover Image */}
              <div className="relative h-52 overflow-hidden">
                {project.coverImage ? (
                  <img
                    src={project.coverImage}
                    alt={project.title.en}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
                    <FaImage className="text-6xl text-gray-600" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-80"></div>
                {project.isFeatured && (
                  <div className="absolute top-4 right-4 bg-gradient-to-r from-amber-500 to-yellow-400 px-3 py-1.5 rounded-lg flex items-center gap-1.5 text-gray-900 font-semibold text-sm shadow-lg">
                    <FaStar /> Featured
                  </div>
                )}
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-3 py-1 rounded-lg text-xs font-semibold border ${getCategoryColor(project.category)}`}>
                      {project.category}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white">{project.title.en}</h3>
                </div>
              </div>

              <div className="p-5">
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">{project.description.en}</p>

                {project.completionDate && (
                  <div className="flex items-center gap-2 text-gray-500 text-sm mb-4">
                    <FaCalendar className="text-amber-500/50" />
                    Completed: {new Date(project.completionDate).toLocaleDateString()}
                  </div>
                )}

                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleEdit(project)}
                    className="flex-1 px-4 py-2.5 bg-blue-500/20 text-blue-400 rounded-xl hover:bg-blue-500/30 flex items-center justify-center gap-2 transition-all font-medium"
                  >
                    <FaEdit /> Edit
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleDelete(project._id)}
                    className="px-4 py-2.5 bg-red-500/20 text-red-400 rounded-xl hover:bg-red-500/30 transition-all"
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
              className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-gray-700/50 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">
                  {editingProject ? 'Edit Project' : 'Create New Project'}
                </h2>
                <button
                  onClick={handleCloseModal}
                  className="w-10 h-10 rounded-xl bg-gray-700/50 hover:bg-gray-700 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                >
                  <FaTimes />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-300 mb-2 font-medium">Title (English) *</label>
                    <input
                      type="text"
                      required
                      value={formData.title.en}
                      onChange={(e) => setFormData({ ...formData, title: { ...formData.title, en: e.target.value } })}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl focus:border-amber-500/50 focus:outline-none focus:ring-2 focus:ring-amber-500/20 text-white transition-all"
                      placeholder="Modern Villa Project"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-2 font-medium">Title (Arabic) *</label>
                    <input
                      type="text"
                      required
                      value={formData.title.ar}
                      onChange={(e) => setFormData({ ...formData, title: { ...formData.title, ar: e.target.value } })}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl focus:border-amber-500/50 focus:outline-none focus:ring-2 focus:ring-amber-500/20 text-white text-right transition-all"
                      placeholder="مشروع فيلا عصرية"
                      dir="rtl"
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-300 mb-2 font-medium">Description (English) *</label>
                    <textarea
                      required
                      rows="3"
                      value={formData.description.en}
                      onChange={(e) => setFormData({ ...formData, description: { ...formData.description, en: e.target.value } })}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl focus:border-amber-500/50 focus:outline-none focus:ring-2 focus:ring-amber-500/20 text-white transition-all resize-none"
                      placeholder="Project details..."
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-2 font-medium">Description (Arabic) *</label>
                    <textarea
                      required
                      rows="3"
                      value={formData.description.ar}
                      onChange={(e) => setFormData({ ...formData, description: { ...formData.description, ar: e.target.value } })}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl focus:border-amber-500/50 focus:outline-none focus:ring-2 focus:ring-amber-500/20 text-white text-right transition-all resize-none"
                      placeholder="تفاصيل المشروع..."
                      dir="rtl"
                    />
                  </div>
                </div>

                {/* Category, Completion Date, Featured */}
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-gray-300 mb-2 font-medium">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl focus:border-amber-500/50 focus:outline-none text-white cursor-pointer"
                    >
                      <option value="residential">Residential</option>
                      <option value="commercial">Commercial</option>
                      <option value="administrative">Administrative</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-2 font-medium">Completion Date</label>
                    <input
                      type="date"
                      value={formData.completionDate}
                      onChange={(e) => setFormData({ ...formData, completionDate: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl focus:border-amber-500/50 focus:outline-none text-white"
                    />
                  </div>
                  <div className="flex items-end">
                    <label className="flex items-center gap-3 p-3 bg-gray-800/30 rounded-xl cursor-pointer hover:bg-gray-800/50 transition-colors w-full">
                      <input
                        type="checkbox"
                        checked={formData.isFeatured}
                        onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                        className="w-5 h-5 rounded border-gray-600 bg-gray-700 text-amber-500 focus:ring-amber-500 focus:ring-offset-gray-800"
                      />
                      <span className="text-gray-300 flex items-center gap-2"><FaStar className="text-amber-500" /> Featured Project</span>
                    </label>
                  </div>
                </div>

                {/* Cover Image */}
                <div>
                  <label className="block text-gray-300 mb-2 font-medium">Cover Image *</label>
                  <ImageUpload
                    category="projects"
                    multiple={false}
                    existingImages={formData.coverImage ? [formData.coverImage] : []}
                    onUploadComplete={(url) => {
                      // For single upload, url is a string directly
                      setFormData({ ...formData, coverImage: url });
                    }}
                  />
                  <p className="text-xs text-gray-500 mt-2">Main project image displayed on cards</p>
                </div>

                {/* Gallery Images */}
                <div>
                  <label className="block text-gray-300 mb-2 font-medium">Gallery Images</label>
                  <ImageUpload
                    category="projects"
                    multiple={true}
                    existingImages={formData.images.map(img => img.url)}
                    onUploadComplete={(urls) => {
                      // Merge new images with existing ones, preserving captions
                      const existingImagesMap = new Map(
                        formData.images.map(img => [img.url, img])
                      );
                      
                      const allImages = urls.map(url => {
                        // Keep existing caption if image already exists
                        if (existingImagesMap.has(url)) {
                          return existingImagesMap.get(url);
                        }
                        // New image with empty captions
                        return { url, caption: { ar: '', en: '' } };
                      });
                      
                      setFormData({ ...formData, images: allImages });
                    }}
                  />
                  
                  {/* Captions for uploaded images */}
                  {formData.images.length > 0 && formData.images[0].url && (
                    <div className="mt-4 space-y-3">
                      <p className="text-sm text-gray-400">Add captions to your images:</p>
                      {formData.images.map((image, index) => (
                        <div key={index} className="p-4 bg-gray-800/30 rounded-xl border border-gray-700/30">
                          <div className="flex items-center gap-2 mb-3">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-yellow-400 flex items-center justify-center">
                              <FaImage className="text-gray-900 text-sm" />
                            </div>
                            <span className="text-sm text-gray-400">Image {index + 1}</span>
                          </div>
                          <div className="grid md:grid-cols-2 gap-3">
                            <input
                              type="text"
                              value={image.caption.en}
                              onChange={(e) => updateImage(index, 'caption', e.target.value, 'en')}
                              className="px-4 py-2.5 bg-gray-800/50 border border-gray-600/50 rounded-xl focus:border-amber-500/50 focus:outline-none text-white text-sm transition-all"
                              placeholder="Caption (English)"
                            />
                            <input
                              type="text"
                              value={image.caption.ar}
                              onChange={(e) => updateImage(index, 'caption', e.target.value, 'ar')}
                              className="px-4 py-2.5 bg-gray-800/50 border border-gray-600/50 rounded-xl focus:border-amber-500/50 focus:outline-none text-white text-sm text-right transition-all"
                              placeholder="التعليق (عربي)"
                              dir="rtl"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Buttons */}
                <div className="flex gap-4 pt-4">
                  <motion.button 
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 py-3 bg-gradient-to-r from-amber-500 to-yellow-400 text-gray-900 rounded-xl font-bold shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 transition-all"
                  >
                    {editingProject ? 'Update Project' : 'Create Project'}
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

export default ProjectsManagement;
