import React from 'react';

const VideoControls = ({ 
  isCapturing,
  isRecording,
  recordedVideoBlob,
  currentInspectionData,
  startCapture,
  stopCapture,
  downloadRecordedVideo,
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
          className={`action-btn ${isCapturing || currentInspectionData?.isCompleted ? 'secondary' : 'success'}`}
        >
          {isCapturing ? (isRecording ? '🔴 Gravando...' : 'Documentando...') : `Iniciar ${currentInspectionData?.name}`}
        </button>
        <button
          onClick={stopCapture}
          disabled={!isCapturing}
          className={`action-btn ${!isCapturing ? 'secondary' : 'danger'}`}
        >
          Finalizar Inspeção
        </button>
        
        {/* Botão para baixar vídeo gravado */}
        {recordedVideoBlob && (
          <button
            onClick={downloadRecordedVideo}
            className="action-btn primary"
          >
            📹 Baixar Vídeo
          </button>
        )}
        
        {/* Mostrar botão de gerar PDF apenas quando todas as inspeções estiverem completas */}
        {completedVisualInspections === 5 && (
          <button
            onClick={generatePDF}
            disabled={totalFrames === 0}
            className={`action-btn ${totalFrames === 0 ? 'secondary' : 'primary'}`}
          >
            Gerar Relatório ({totalFrames} fotos)
          </button>
        )}
      </div>
      
      {/* Status da gravação */}
      {isRecording && (
        <div style={{
          marginTop: 'var(--spacing-md)',
          padding: 'var(--spacing-sm)',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          borderRadius: 'var(--radius-md)',
          textAlign: 'center',
          color: 'var(--color-danger)',
          fontSize: '0.875rem',
          fontWeight: '500'
        }}>
          🔴 Gravando vídeo da inspeção...
        </div>
      )}
      
      {recordedVideoBlob && !isCapturing && (
        <div style={{
          marginTop: 'var(--spacing-md)',
          padding: 'var(--spacing-sm)',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          borderRadius: 'var(--radius-md)',
          textAlign: 'center',
          color: 'var(--color-success)',
          fontSize: '0.875rem',
          fontWeight: '500'
        }}>
          ✅ Vídeo gravado com sucesso! Clique em "Baixar Vídeo" para salvar.
        </div>
      )}
    </div>
  );
};

export default VideoControls; 