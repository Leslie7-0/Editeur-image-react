import React from 'react';
import { useDropzone } from 'react-dropzone';
import './TelechargeurFichier.css';

const TelechargeurFichier = ({ onImageUpload }) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: 'image/*',
    maxFiles: 1,
    onDrop: acceptedFiles => {
      const file = acceptedFiles[0];
      const reader = new FileReader();
      reader.onload = () => onImageUpload(reader.result);
      reader.readAsDataURL(file);
    }
  });

  return (
    <div {...getRootProps()} className={`telechargeur ${isDragActive ? 'active' : ''}`}>
      <input {...getInputProps()} />
      <div className="content-telechargeur">
        <div className="icon-telechargeur">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#4a90e2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="17 8 12 3 7 8"></polyline>
            <line x1="12" y1="3" x2="12" y2="15"></line>
          </svg>
        </div>
        <h3>Glissez-déposez votre image ici</h3>
        <p>Ou cliquez pour parcourir vos fichiers</p>
        <div className="formats-supportes">
          Formats supportés: JPG, PNG, WEBP, JPEG
        </div>
      </div>
    </div>
  );
};

export default TelechargeurFichier;