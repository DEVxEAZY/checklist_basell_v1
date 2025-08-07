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
  generatePDF,
  videoRef,
  canvasRef,
  isCapturing
}) => {
  return (
    <div>
      <h2>ETAPA {currentStage} - Inspeções Visuais</h2>
      <p style={{ color: '#666', marginBottom: '20px' }}>
        Inspeções visuais com documentação fotográfica. Captura automática a cada 3 segundos.
      </p>
      
      {/* Status das Inspeções Visuais */}
      <StatusPanel
        title="Status das Inspeções Visuais"
        completedCount={completedVisualInspections}
        totalCount={5}
        status="Em andamento"
        additionalInfo={[
          { label: 'Total de Fotos', value: totalFrames },
          { label: 'Inspeção Atual', value: `${currentInspection}/5` },
          { label: 'Fotos da Inspeção Atual', value: currentInspectionData?.frames.length || 0 }
        ]}
      />

      {/* Lista de Inspeções Visuais */}
      <InspectionList
        visualInspections={visualInspections}
        currentInspection={currentInspection}
      />

      {/* Controles de Vídeo */}
      <VideoControls
        isCapturing={isCapturing}
        currentInspectionData={currentInspectionData}
        startCapture={startCapture}
        stopCapture={stopCapture}
        currentInspection={currentInspection}
        generatePDF={generatePDF}
        totalFrames={totalFrames}
        completedVisualInspections={completedVisualInspections}
      />

      {/* Câmera */}
      <div style={{ marginBottom: '20px' }}>
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          style={{ 
            width: '100%', 
            maxWidth: '640px', 
            border: '2px solid #ddd',
            borderRadius: '8px'
          }} 
        />
      </div>
      
      {/* Canvas invisível para captura */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
};

export default VisualInspectionsStage; 