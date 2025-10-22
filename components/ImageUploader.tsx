import React, { useCallback, useState } from 'react';

interface ImageUploaderProps {
  onImageChange: (file: File) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageChange }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onImageChange(e.target.files[0]);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      if (e.dataTransfer.files[0].type.startsWith('image/')) {
          onImageChange(e.dataTransfer.files[0]);
      }
    }
  }, [onImageChange]);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
        if (e.dataTransfer.items[0].kind === 'file') {
            setIsDragging(true);
        }
    }
  };
  
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleClick = () => {
      fileInputRef.current?.click();
  }

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
      <div
        className={`upload-zone ${isDragging ? 'dragover' : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onClick={handleClick}
      >
        <div className="upload-icon">📸</div>
        <div className="upload-text">Drop your image here</div>
        <div className="upload-hint">or click to browse files</div>
        <button type="button" className="btn-primary" onClick={(e) => { e.stopPropagation(); handleClick(); }}>
          Select Image
        </button>
      </div>
    </>
  );
};
