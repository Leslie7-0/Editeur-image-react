import React from 'react';
import './PanelOutils.css';

const PanelOutils = ({
  onCompress,
  onResize,
  onCrop,
  compressionQuality,
  setCompressionQuality,
  width,
  setWidth,
  height,
  setHeight,
  maintainAspectRatio,
  setMaintainAspectRatio,
  resizeUnit,
  setResizeUnit,
  resizePercentage,
  setResizePercentage,
  modeRecadrage
}) => {
  const handleQualityChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value)) {
      setCompressionQuality(Math.max(1, Math.min(100, value)));
    }
  };

  const handlePercentageChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value)) {
      setResizePercentage(Math.max(1, Math.min(500, value)));
    }
  };

  const handleUnitChange = (e) => {
    setResizeUnit(e.target.value);
  };

  return (
    <div className="panel-outils-container">
      <div className="outil-card">
        <h3 className="outil-title">
          <span className="outil-icon">🔄</span> Compression
        </h3>
        <div className="outil-content">
          <div className="slider-container">
            <label>Qualité : {compressionQuality}%</label>
            <input
              type="range"
              min="1"
              max="100"
              value={compressionQuality}
              onChange={handleQualityChange}
              className="quality-slider"
            />
          </div>
          <button 
            className="action-btn primary" 
            onClick={onCompress}
          >
            Compresser
          </button>
        </div>
      </div>

      <div className="outil-card">
        <h3 className="outil-title">
          <span className="outil-icon">📐</span> Redimensionnement
        </h3>
        <div className="outil-content">
          <div className="unit-selector">
            <label>
              <input
                type="radio"
                value="px"
                checked={resizeUnit === 'px'}
                onChange={handleUnitChange}
              />
              Pixels
            </label>
            <label>
              <input
                type="radio"
                value="%"
                checked={resizeUnit === '%'}
                onChange={handleUnitChange}
              />
              Pourcentage
            </label>
          </div>

          {resizeUnit === 'px' ? (
            <>
              <div className="dimension-inputs">
                <div className="input-group">
                  <label>Largeur (px)</label>
                  <input
                    type="number"
                    value={width}
                    onChange={(e) => setWidth(e.target.value)}
                    placeholder="Auto"
                    min="1"
                  />
                </div>
                <div className="input-group">
                  <label>Hauteur (px)</label>
                  <input
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    placeholder="Auto"
                    min="1"
                  />
                </div>
              </div>
              <div className="checkbox-container">
                <input
                  type="checkbox"
                  id="maintain-ratio"
                  checked={maintainAspectRatio}
                  onChange={(e) => setMaintainAspectRatio(e.target.checked)}
                />
                <label htmlFor="maintain-ratio">Conserver les proportions</label>
              </div>
            </>
          ) : (
            <div className="percentage-control">
              <label>Pourcentage : {resizePercentage}%</label>
              <input
                type="range"
                min="1"
                max="500"
                value={resizePercentage}
                onChange={handlePercentageChange}
                className="percentage-slider"
              />
            </div>
          )}
          <button className="action-btn primary" onClick={onResize}>
            Redimensionner l'image
          </button>
        </div>
      </div>

      <div className="outil-card">
        <h3 className="outil-title">
          <span className="outil-icon">✂️</span> Recadrage
        </h3>
        <div className="outil-content">
          <button className="action-btn secondary" onClick={onCrop}>
            {modeRecadrage ? 'Désactiver' : 'Activer'} le recadrage
          </button>
        </div>
      </div>
    </div>
  );
};

export default PanelOutils;