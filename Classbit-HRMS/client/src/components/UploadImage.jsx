import React, { useState, useRef } from 'react';
import api from '../utils/api';
import { UploadCloud, X, CheckCircle, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const UploadImage = ({ entityType, entityId, type = 'general', onUploadComplete }) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const validateFiles = (files) => {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const maxSize = 2 * 1024 * 1024; // 2MB
    
    const valid = [];
    const errors = [];
    
    Array.from(files).forEach(file => {
      if (!validTypes.includes(file.type)) {
        errors.push(`${file.name}: Invalid file type.`);
      } else if (file.size > maxSize) {
        errors.push(`${file.name}: Exceeds 2MB limit.`);
      } else {
        valid.push(file);
      }
    });
    
    if (errors.length > 0) {
      toast.error(errors.join(' '));
    }
    
    return valid;
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const validFiles = validateFiles(e.dataTransfer.files);
      setSelectedFiles(prev => [...prev, ...validFiles].slice(0, 5)); // Max 5 at a time
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      const validFiles = validateFiles(e.target.files);
      setSelectedFiles(prev => [...prev, ...validFiles].slice(0, 5));
    }
  };

  const removeFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;
    
    const formData = new FormData();
    selectedFiles.forEach(file => {
      formData.append('images', file);
    });
    formData.append('entity_type', entityType);
    formData.append('entity_id', entityId);
    formData.append('type', type);
    
    setIsUploading(true);
    try {
      const res = await api.post('/api/images/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      const { successful, failed } = res.data.results;
      
      if (successful.length > 0) {
        toast.success(`Successfully uploaded ${successful.length} image(s)`);
        if (onUploadComplete) onUploadComplete(successful);
      }
      if (failed.length > 0) {
        toast.error(`Failed to upload ${failed.length} image(s)`);
      }
      
      setSelectedFiles([]);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 bg-white rounded-lg shadow-sm border border-gray-200">
      <div 
        className={`relative border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center transition-colors ${
          dragActive ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:border-gray-400 bg-gray-50'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <UploadCloud className={`w-10 h-10 mb-3 ${dragActive ? 'text-indigo-600' : 'text-gray-400'}`} />
        <p className="text-sm text-gray-600 text-center mb-1">
          Drag and drop your images here, or <button type="button" className="text-indigo-600 font-medium hover:underline" onClick={() => inputRef.current?.click()}>browse</button>
        </p>
        <p className="text-xs text-gray-500 text-center">
          JPG, PNG, WEBP up to 2MB (Max 5 files)
        </p>
        <input 
          ref={inputRef}
          type="file" 
          multiple 
          accept="image/jpeg,image/png,image/webp" 
          onChange={handleChange}
          className="hidden" 
        />
      </div>

      {selectedFiles.length > 0 && (
        <div className="mt-4 space-y-2">
          {selectedFiles.map((file, idx) => (
            <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg border border-gray-100">
              <div className="flex items-center space-x-3 overflow-hidden">
                <div className="w-10 h-10 shrink-0 bg-gray-200 rounded overflow-hidden">
                  <img src={URL.createObjectURL(file)} alt="preview" className="w-full h-full object-cover" />
                </div>
                <div className="truncate">
                  <p className="text-sm font-medium text-gray-700 truncate">{file.name}</p>
                  <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              </div>
              <button 
                onClick={() => removeFile(idx)} 
                className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                disabled={isUploading}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
          
          <button 
            onClick={handleUpload}
            disabled={isUploading}
            className="w-full mt-3 py-2 px-4 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors flex items-center justify-center space-x-2"
          >
            {isUploading ? (
              <span>Uploading...</span>
            ) : (
              <>
                <CheckCircle className="w-4 h-4" />
                <span>Upload {selectedFiles.length} File{selectedFiles.length > 1 ? 's' : ''}</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default UploadImage;
