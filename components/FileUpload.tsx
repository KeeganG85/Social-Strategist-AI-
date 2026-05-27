import React, { useRef, useState } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (file: File | null) => void;
  selectedFile: File | null;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, selectedFile }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0 && files[0].type.startsWith('image/')) {
      handleFile(files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    onFileSelect(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const clearFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFileSelect(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div 
      onClick={() => fileInputRef.current?.click()}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`
        relative group cursor-pointer border-2 border-dashed rounded-xl p-8 transition-all duration-300
        ${isDragging ? 'border-brand-amber bg-brand-amber/5' : 'border-gray-300 hover:border-brand-amber'}
        ${selectedFile ? 'border-brand-sky bg-brand-sky/5' : 'bg-white'}
      `}
    >
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept="image/*" 
        className="hidden" 
      />

      {selectedFile && previewUrl ? (
        <div className="relative w-full h-64 md:h-80 flex items-center justify-center overflow-hidden rounded-lg">
            <img 
              src={previewUrl} 
              alt="Preview" 
              className="object-contain h-full w-full"
            />
            <button 
              onClick={clearFile}
              className="absolute top-2 right-2 p-2 bg-brand-black/70 text-white rounded-full hover:bg-red-500 transition-colors"
            >
              <X size={16} />
            </button>
            <div className="absolute bottom-2 left-2 px-3 py-1 bg-brand-black/70 text-white text-xs rounded-full">
              {selectedFile.name}
            </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center space-y-4 text-brand-grey py-8">
          <div className={`p-4 rounded-full ${isDragging ? 'bg-brand-amber/20' : 'bg-gray-100 group-hover:bg-brand-amber/10'} transition-colors`}>
            <Upload size={32} className={`${isDragging ? 'text-brand-amber' : 'text-gray-400 group-hover:text-brand-amber'}`} />
          </div>
          <div className="text-center">
            <p className="font-heading font-semibold text-lg text-brand-black">
              Click to upload or drag and drop
            </p>
            <p className="text-sm mt-1">
              Supports high-res Images (PNG, JPG, WEBP)
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;