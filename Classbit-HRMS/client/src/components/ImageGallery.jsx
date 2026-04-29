import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { Trash2, ExternalLink, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';

const ImageGallery = ({ entityType, entityId, type }) => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const fetchImages = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({ entity_type: entityType, entity_id: entityId });
      if (type) params.append('type', type);
      
      const res = await api.get(`/api/images?${params.toString()}`);
      setImages(res.data);
    } catch (error) {
      toast.error('Failed to load images');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entityType, entityId, type]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this image?')) return;
    
    setDeletingId(id);
    try {
      await api.delete(`/api/images/${id}`);
      toast.success('Image deleted successfully');
      setImages(images.filter(img => img.id !== id));
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete image');
    } finally {
      setDeletingId(null);
    }
  };

  const handleImageError = (e) => {
    // Fallback handling for broken images
    e.target.onerror = null; 
    e.target.src = '/placeholder-image.png'; // Assuming a placeholder image exists in public folder
    e.target.className = 'w-full h-full object-cover opacity-50 grayscale';
  };

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
        <ImageIcon className="w-12 h-12 mb-2 opacity-50" />
        <p>No images found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {images.map((image) => (
        <div key={image.id} className="group relative rounded-xl overflow-hidden shadow-sm border border-gray-200 bg-white hover:shadow-md transition-all">
          <div className="aspect-square bg-gray-100 relative">
            <img 
              src={image.url} 
              alt={image.type} 
              onError={handleImageError}
              className="w-full h-full object-cover"
            />
            
            {/* Overlay Actions */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-3">
              <a 
                href={image.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 bg-white/90 rounded-full hover:bg-white text-gray-700 hover:text-indigo-600 transition-colors"
                title="View Full Size"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
              <button 
                onClick={() => handleDelete(image.id)}
                disabled={deletingId === image.id}
                className="p-2 bg-white/90 rounded-full hover:bg-white text-gray-700 hover:text-red-500 transition-colors disabled:opacity-50"
                title="Delete Image"
              >
                {deletingId === image.id ? (
                  <div className="w-4 h-4 rounded-full border-2 border-red-500 border-t-transparent animate-spin"></div>
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
          
          <div className="p-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium px-2 py-1 bg-indigo-50 text-indigo-700 rounded-md capitalize">
                {image.type || 'General'}
              </span>
              <span className="text-xs text-gray-500 font-mono">
                {image.format?.toUpperCase() || 'JPG'}
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-2">
              {image.size ? `${(image.size / 1024).toFixed(1)} KB` : 'Unknown size'}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ImageGallery;
