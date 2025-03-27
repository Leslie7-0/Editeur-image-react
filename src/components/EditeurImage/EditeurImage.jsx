import React, { useState, useRef } from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import './EditeurImage.css';

const EditeurImage = ({ sourceImage, surRecadrageComplete, modeRecadrage, surAnnulationRecadrage }) => {
  const [recadrage, setRecadrage] = useState();
  const referenceImage = useRef(null);

  const gererRecadrageComplete = (crop) => {
    if (!sourceImage || !referenceImage.current || !crop.width || !crop.height) return;

    const image = referenceImage.current;
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    canvas.width = crop.width;
    canvas.height = crop.height;

    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingQuality = 'high';
    
    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    canvas.toBlob(
      (blob) => {
        const urlRecadree = URL.createObjectURL(blob);
        surRecadrageComplete(urlRecadree);
      },
      'image/jpeg',
      0.95
    );
  };

  return (
    <div className="editeur-image">
      {sourceImage ? (
        modeRecadrage ? (
          <div className="conteneur-recadrage">
            <ReactCrop
              crop={recadrage}
              onChange={setRecadrage}
              onComplete={gererRecadrageComplete}
              ruleOfThirds
              minWidth={100}
              minHeight={100}
            >
              <img
                ref={referenceImage}
                src={sourceImage}
                alt="Image à recadrer"
                onLoad={() => setRecadrage(undefined)}
                style={{ maxWidth: '100%', maxHeight: '400px' }}
              />
            </ReactCrop>
            <button 
              className="bouton-annuler"
              onClick={surAnnulationRecadrage}
            >
              Annuler le recadrage
            </button>
          </div>
        ) : (
          <img
            src={sourceImage}
            alt="Image modifiée"
            style={{ maxWidth: '100%', maxHeight: '400px' }}
          />
        )
      ) : (
        <div className="espace-reserve">Aucune image chargée</div>
      )}
    </div>
  );
};

export default EditeurImage;