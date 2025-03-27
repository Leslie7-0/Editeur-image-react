import React from 'react';
import { saveAs } from 'file-saver';
import './DownloadButton.css';

const DownloadButton = ({ imageTraitee }) => {
  const handleDownload = () => {
    if (imageTraitee) {
      saveAs(imageTraitee, 'image-modifiee.png');
    }
  };

  return (
    <div className="download-container">
      <button 
        className="download-btn"
        onClick={handleDownload}
        disabled={!imageTraitee}
      >
        Télécharger l'image
      </button>
    </div>
  );
};

export default DownloadButton;