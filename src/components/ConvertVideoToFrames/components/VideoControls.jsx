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
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={startCapture} 
          disabled={isCapturing || currentInspectionData?.isCompleted}
          style={{
            padding: '10px 20px',
            marginRight: '10px',
            backgroundColor: isCapturing || currentInspectionData?.isCompleted ? '#ccc' : '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: isCapturing || currentInspectionData?.isCompleted ? 'not-allowed' : 'pointer'
          }}
        >
          {isCapturing ? 'Documentando...' : `Iniciar ${currentInspectionData?.name}`}
        </button>
        <button 
          onClick={stopCapture} 
          disabled={!isCapturing}
          style={{
            padding: '10px 20px',
            marginRight: '10px',
            backgroundColor: !isCapturing ? '#ccc' : '#f44336',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: !isCapturing ? 'not-allowed' : 'pointer'
          }}
        >
          Finalizar Inspeção
        </button>
        
        {/* Mostrar botão de gerar PDF apenas quando todas as inspeções estiverem completas */}
        {completedVisualInspections === 5 && (
          <button 
            onClick={generatePDF} 
            disabled={totalFrames === 0}
            style={{
              padding: '10px 20px',
              marginRight: '10px',
              backgroundColor: totalFrames === 0 ? '#ccc' : '#9C27B0',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: totalFrames === 0 ? 'not-allowed' : 'pointer'
            }}
          >
            Gerar PDF ({totalFrames} fotos)
          </button>
        )}
      </div>
    </div>
  );
};

export default VideoControls; 