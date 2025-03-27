import React, { useState, useCallback, useEffect, useRef } from 'react';
import TelechargeurFichier from './components/TelechargeurFichier/TelechargeurFichier';
import EditeurImage from './components/EditeurImage/EditeurImage';
import PanelOutils from './components/PanelOutils/PanelOutils';
import DownloadButton from './components/DownloadButton/DownloadButton';
import './App.css';

function App() {
  const [imageOriginale, setImageOriginale] = useState(null);
  const [imageTraitee, setImageTraitee] = useState(null);
  const [qualiteCompression, setQualiteCompression] = useState(80);
  const [largeur, setLargeur] = useState('');
  const [hauteur, setHauteur] = useState('');
  const [uniteRedimensionnement, setUniteRedimensionnement] = useState('px');
  const [pourcentageRedim, setPourcentageRedim] = useState(100);
  const [conserverProportions, setConserverProportions] = useState(true);
  const [modeRecadrage, setModeRecadrage] = useState(false);
  const dernierBlob = useRef(null);
  const dimensionsOriginales = useRef({ width: 0, height: 0 });

  // Nettoyage des URLs blob
  useEffect(() => {
    return () => {
      if (dernierBlob.current) {
        URL.revokeObjectURL(dernierBlob.current);
      }
    };
  }, []);

  const nettoyerBlobPrecedent = () => {
    if (dernierBlob.current) {
      URL.revokeObjectURL(dernierBlob.current);
      dernierBlob.current = null;
    }
  };

  const chargerImage = (sourceImage) => {
    nettoyerBlobPrecedent();
    setImageOriginale(sourceImage);
    setImageTraitee(sourceImage);
    setModeRecadrage(false);
    
    // Stocker les dimensions originales
    const img = new Image();
    img.onload = () => {
      dimensionsOriginales.current = {
        width: img.width,
        height: img.height
      };
      setLargeur(img.width.toString());
      setHauteur(img.height.toString());
    };
    img.src = sourceImage;
  };

  // Compression automatique lorsque la qualité change
  useEffect(() => {
    if (imageTraitee && qualiteCompression < 100) {
      compresserImage();
    }
  }, [qualiteCompression]);

  const compresserImage = () => {
    if (!imageTraitee) return;

    const image = new Image();
    image.crossOrigin = 'Anonymous';
    image.src = imageTraitee;

    image.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = image.width;
      canvas.height = image.height;

      const ctx = canvas.getContext('2d');
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

      canvas.toBlob((blob) => {
        nettoyerBlobPrecedent();
        const urlCompresse = URL.createObjectURL(blob);
        dernierBlob.current = urlCompresse;
        setImageTraitee(urlCompresse);
      }, 'image/jpeg', qualiteCompression / 100);
    };
  };

  const redimensionnerImage = () => {
    if (!imageTraitee) return;

    const image = new Image();
    image.crossOrigin = 'Anonymous';
    image.src = imageTraitee;

    image.onload = () => {
      const canvas = document.createElement('canvas');
      
      let nouvelleLargeur, nouvelleHauteur;

      if (uniteRedimensionnement === '%') {
        const ratio = pourcentageRedim / 100;
        nouvelleLargeur = Math.round(image.width * ratio);
        nouvelleHauteur = Math.round(image.height * ratio);
      } else {
        nouvelleLargeur = largeur ? parseInt(largeur) : image.width;
        nouvelleHauteur = hauteur ? parseInt(hauteur) : image.height;

        if (conserverProportions) {
          if (largeur && !hauteur) {
            nouvelleHauteur = Math.round((image.height * nouvelleLargeur) / image.width);
            setHauteur(nouvelleHauteur.toString());
          } else if (hauteur && !largeur) {
            nouvelleLargeur = Math.round((image.width * nouvelleHauteur) / image.height);
            setLargeur(nouvelleLargeur.toString());
          }
        }
      }

      canvas.width = nouvelleLargeur;
      canvas.height = nouvelleHauteur;

      const ctx = canvas.getContext('2d');
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(image, 0, 0, nouvelleLargeur, nouvelleHauteur);

      canvas.toBlob((blob) => {
        nettoyerBlobPrecedent();
        const urlRedimensionnee = URL.createObjectURL(blob);
        dernierBlob.current = urlRedimensionnee;
        setImageTraitee(urlRedimensionnee);
      }, 'image/jpeg', 0.92);
    };
  };

  const terminerRecadrage = useCallback((urlRecadree) => {
    if (!urlRecadree) return;
    
    nettoyerBlobPrecedent();
    dernierBlob.current = urlRecadree;
    setImageTraitee(urlRecadree);
    setModeRecadrage(false);
  }, []);

  const annulerRecadrage = useCallback(() => {
    setModeRecadrage(false);
  }, []);

  return (
    <div className="application">
      <header className="en-tete-application">
        <h1>Éditeur d'Images Professionnel</h1>
      </header>

      <main className="contenu-principal">
        <TelechargeurFichier onImageUpload={chargerImage} />

        {imageOriginale && (
          <>
            <section className="comparaison-images">
              <article className="zone-image">
                <h2>Originale</h2>
                <EditeurImage sourceImage={imageOriginale} />
              </article>
              <article className="zone-image">
                <h2>Modifiée</h2>
                <EditeurImage 
                  sourceImage={imageTraitee} 
                  surRecadrageComplete={terminerRecadrage}
                  modeRecadrage={modeRecadrage}
                  surAnnulationRecadrage={annulerRecadrage}
                />
              </article>
            </section>

            <PanelOutils
              onCompress={compresserImage}
              onResize={redimensionnerImage}
              onCrop={() => setModeRecadrage(!modeRecadrage)}
              compressionQuality={qualiteCompression}
              setCompressionQuality={setQualiteCompression}
              width={largeur}
              setWidth={setLargeur}
              height={hauteur}
              setHeight={setHauteur}
              maintainAspectRatio={conserverProportions}
              setMaintainAspectRatio={setConserverProportions}
              resizeUnit={uniteRedimensionnement}
              setResizeUnit={setUniteRedimensionnement}
              resizePercentage={pourcentageRedim}
              setResizePercentage={setPourcentageRedim}
            />

            <DownloadButton imageTraitee={imageTraitee} />
          </>
        )}
      </main>
    </div>
  );
}

export default App;