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
        </div>
      </div>
      
      {/* Canvas invisível para captura */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
};

export default VisualInspectionsStage; 