import React from 'react';

const VideoControls = ({ 
  isCapturing,
  currentInspectionData,
  startCapture,
  stopCapture,
  currentInspection,
  generatePDF,
  totalFrames,
  completedVisualInspections
}) => {
  return (
    <div>
      {/* Botões de controle */}
      <div className="action-buttons">
        <button
          onClick={startCapture}
          disabled={isCapturing || currentInspectionData?.isCompleted}
          className={`action-btn ${
            isCapturing || currentInspectionData?.isCompleted ? 'secondary' : 'success'
          }`}
        >
          {isCapturing ? '📹 Documentando...' : `▶️ Iniciar ${currentInspectionData?.name}`}
        </button>
        <button
          onClick={stopCapture}
          disabled={!isCapturing}
          className={`action-btn ${!isCapturing ? 'secondary' : 'danger'}`}
        >
          ⏹️ Finalizar Inspeção
        </button>
        
        {/* Mostrar botão de gerar PDF apenas quando todas as inspeções estiverem completas */}
        {completedVisualInspections === 5 && (
          <button
            onClick={generatePDF}
            disabled={totalFrames === 0}
            className={`action-btn ${totalFrames === 0 ? 'secondary' : 'primary'}`}
          >
            📄 Gerar PDF ({totalFrames} fotos)
          </button>
        )}
      </div>
    </div>
  );
};

export default VideoControls; 