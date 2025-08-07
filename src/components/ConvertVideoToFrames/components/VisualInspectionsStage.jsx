import React from 'react';
import StatusPanel from './StatusPanel';
import InspectionList from './InspectionList';
import VideoControls from './VideoControls';

const VisualInspectionsStage = ({ 
  currentStage,
  visualInspections,
  currentInspection,
  currentInspectionData,
  totalFrames,
  completedVisualInspections,
  startCapture,
  stopCapture,
  downloadRecordedVideo,
  generatePDF,
  videoRef,
  canvasRef,
  isCapturing,
  isRecording,
  recordedVideoBlob
}) => {
  return (
    <div className="fade-in-up">
      <div className="stage-header">
        <div className="stage-number">{currentStage}</div>
        <div className="stage-info">
          <h2>Inspeções Visuais</h2>
          <p>Documentação fotográfica com captura automática</p>
        </div>
      </div>
      
      {/* Layout responsivo com grid */}
      <div className="stage2-layout">
        {/* Coluna esquerda - Status e Lista */}
        <div className="stage2-sidebar">
          {/* Status das Inspeções Visuais */}
          <div className="card">
            <StatusPanel
              title="Status das Inspeções"
              completedCount={completedVisualInspections}
              totalCount={5}
              status="Em andamento"
              additionalInfo={[
                { label: 'Total de Fotos', value: totalFrames },
                { label: 'Inspeção Atual', value: `${currentInspection}/5` },
                { label: 'Fotos da Inspeção Atual', value: currentInspectionData?.frames.length || 0 }
              ]}
            />
          </div>

          {/* Lista de Inspeções Visuais */}
          <InspectionList
            visualInspections={visualInspections}
            currentInspection={currentInspection}
          />
        </div>

        {/* Coluna direita - Câmera e Controles */}
        <div className="stage2-main">
          {/* Informações da Inspeção Atual */}
          <div className="current-inspection-info">
            <div className="inspection-badge">
              <span className="inspection-number">{currentInspection}</span>
              <span className="inspection-total">/ 5</span>
            </div>
            <div className="inspection-details">
              <h3 className="inspection-name">{currentInspectionData?.name}</h3>
              <p className="inspection-description">{currentInspectionData?.description}</p>
            </div>
            <div className="inspection-status">
              {currentInspectionData?.isCompleted ? (
                <span className="status-completed">✅ Concluída</span>
              ) : (
                <span className="status-pending">⏳ Em andamento</span>
              )}
            </div>
          </div>

          {/* Câmera */}
          <div className="video-section">
            <div className="video-container">
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className="video-element"
              />
              {isCapturing && (
                <div className="video-overlay">
                  <div className="recording-indicator">
                    <div className="recording-dot"></div>
                    <span>Gravando</span>
                  </div>
                  <div className="frame-counter">
                    Fotos: {currentInspectionData?.frames.length || 0}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Controles de Vídeo */}
          <VideoControls
            isCapturing={isCapturing}
            isRecording={isRecording}
            recordedVideoBlob={recordedVideoBlob}
            currentInspectionData={currentInspectionData}
            startCapture={startCapture}
            stopCapture={stopCapture}
            downloadRecordedVideo={downloadRecordedVideo}
            currentInspection={currentInspection}
            generatePDF={generatePDF}
            totalFrames={totalFrames}
            completedVisualInspections={completedVisualInspections}
          />
        </div>
      </div>
      
      {/* Canvas invisível para captura */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
};

export default VisualInspectionsStage; 