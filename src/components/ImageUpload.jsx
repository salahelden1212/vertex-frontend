import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUpload, FaImage, FaTimes, FaCheck, FaSpinner } from 'react-icons/fa';
import toast from 'react-hot-toast';
import axios from 'axios';

const ImageUpload = ({ 
  onUploadComplete, 
  category = 'general', 
  multiple = false,
  existingImages = []
}) => {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploadedImages, setUploadedImages] = useState(existingImages);
  const [previewImages, setPreviewImages] = useState([]);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = async (files) => {
    const filesArray = Array.from(files);
    
    // Validate file types
    const validFiles = filesArray.filter(file => {
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} is not an image file`);
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} is too large (max 5MB)`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    // Create preview URLs
    const previews = validFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));
    setPreviewImages(previews);

    // Upload files
    await uploadFiles(validFiles);
  };

  const uploadFiles = async (files) => {
    setUploading(true);
    const token = localStorage.getItem('adminToken');

    try {
      const formData = new FormData();
      
      if (multiple) {
        files.forEach(file => {
          formData.append('images', file);
        });
        formData.append('category', category);

        const response = await axios.post(
          'http://localhost:5000/api/upload/multiple',
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              'Authorization': `Bearer ${token}`
            }
          }
        );

        const newImages = response.data.data;
        setUploadedImages([...uploadedImages, ...newImages]);
        // For multiple upload, return array of URL strings only
        const imageUrls = newImages.map(img => img.url || img);
        onUploadComplete([...uploadedImages.map(img => img.url || img), ...imageUrls]);
        toast.success(`${newImages.length} image(s) uploaded successfully!`);
      } else {
        formData.append('image', files[0]);
        formData.append('category', category);

        const response = await axios.post(
          'http://localhost:5000/api/upload/single',
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              'Authorization': `Bearer ${token}`
            }
          }
        );

        const newImage = response.data.data;
        setUploadedImages([newImage]);
        // For single upload, return only the URL string
        onUploadComplete(newImage.url || newImage);
        toast.success('Image uploaded successfully!');
      }

      // Clear previews
      previewImages.forEach(preview => URL.revokeObjectURL(preview.preview));
      setPreviewImages([]);
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error.response?.data?.message || 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index) => {
    const newImages = uploadedImages.filter((_, i) => i !== index);
    setUploadedImages(newImages);
    onUploadComplete(multiple ? newImages : null);
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-lg transition-all duration-300 ${
          dragActive
            ? 'border-primary bg-primary/10'
            : 'border-gray-600 hover:border-primary/50'
        } ${uploading ? 'pointer-events-none opacity-50' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple={multiple}
          accept="image/*"
          onChange={handleFileInput}
          className="hidden"
        />

        <div
          className="p-8 text-center cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          {uploading ? (
            <div className="space-y-3">
              <FaSpinner className="w-12 h-12 mx-auto text-primary animate-spin" />
              <p className="text-gray-400">Uploading...</p>
            </div>
          ) : (
            <div className="space-y-3">
              <FaUpload className="w-12 h-12 mx-auto text-gray-400" />
              <div>
                <p className="text-white font-medium">
                  Click to upload or drag and drop
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  PNG, JPG, GIF, WEBP up to 5MB
                </p>
                {multiple && (
                  <p className="text-xs text-gray-500 mt-1">
                    You can upload multiple images
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Preview Images (Before Upload) */}
      {previewImages.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {previewImages.map((preview, index) => (
            <div key={index} className="relative group">
              <div className="aspect-square rounded-lg overflow-hidden bg-dark-light">
                <img
                  src={preview.preview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute inset-0 bg-dark/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <FaSpinner className="w-6 h-6 text-white animate-spin" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Uploaded Images */}
      {uploadedImages.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-400">
            Uploaded Images ({uploadedImages.length})
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <AnimatePresence>
              {uploadedImages.map((image, index) => (
                <motion.div
                  key={image.url || index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="relative group"
                >
                  <div className="aspect-square rounded-lg overflow-hidden bg-dark-light border-2 border-green-500/50">
                    <img
                      src={image.url}
                      alt="Uploaded"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {/* Success Badge */}
                  <div className="absolute top-2 right-2 bg-green-500 text-white rounded-full p-1.5">
                    <FaCheck className="w-3 h-3" />
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeImage(index)}
                    className="absolute inset-0 bg-dark/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <div className="bg-red-500 hover:bg-red-600 rounded-full p-3 transition-colors">
                      <FaTimes className="w-4 h-4 text-white" />
                    </div>
                  </button>

                  {/* Image Info */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-dark to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-xs text-white truncate">
                      {image.filename}
                    </p>
                    <p className="text-xs text-gray-400">
                      {(image.size / 1024).toFixed(0)} KB
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
