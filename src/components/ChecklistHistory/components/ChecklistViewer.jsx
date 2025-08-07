import React from 'react';

const ChecklistViewer = ({ checklist, onBack, onLoad }) => {
  // Add safety check for checklist object
  if (!checklist) {
    return (
      <div className="checklist-viewer">
        <div className="viewer-header">
          <button onClick={onBack} className="back-button">
            ← Voltar
          </button>
        </div>
        <div className="loading-message">
          Carregando checklist...
        </div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('pt-BR');
  };

  const getStatusText = (status) => {
    const statusMap = {
      'ok': 'Conforme',
      'not_ok': 'Não Conforme',
      'na': 'Não Aplicável'
    };
    return statusMap[status] || 'Pendente';
  };

  const getStatusIcon = (status) => {
    const iconMap = {
      'ok': '✅',
      'not_ok': '❌',
      'na': '➖'
    };
    return iconMap[status] || '⏳';
  };

  return (
    <div className="checklist-viewer">
      <div className="viewer-header">
        <div className="viewer-header-left">
          <button onClick={onBack} className="btn btn-secondary">
            ← Voltar
          </button>
          <div className="viewer-title">
            <h1>Visualizar Checklist</h1>
            <p>Criado em {formatDate(checklist.createdAt)}</p>
          </div>
        </div>
        
        <div className="viewer-header-actions">
          <button onClick={onLoad} className="btn btn-primary">
            📝 Carregar para Edição
          </button>
        </div>
      </div>

      <div className="viewer-content">
        {/* Vehicle Information */}
        <div className="viewer-section">
          <h2 className="section-title">Informações do Veículo</h2>
              <div className="info-item">
                <span className="label">Placa:</span>
                <span className="value">{checklist.vehicleInfo?.plate || 'N/A'}</span>
              </div>
              <div className="info-item">
                <span className="label">Modelo:</span>
                <span className="value">{checklist.vehicleInfo?.model || 'N/A'}</span>
              </div>
              <div className="info-item">
                <span className="label">Motorista:</span>
                <span className="value">{checklist.vehicleInfo?.driver || 'N/A'}</span>
              </div>
              <div className="info-item">
                <span className="label">Inspetor:</span>
                <span className="value">{checklist.vehicleInfo?.inspector || 'N/A'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Basic Checks */}
        <div className="viewer-section">
          <h2 className="section-title">Verificações Básicas</h2>
          <div className="checks-list">
            {checklist.basicChecks.map((check, index) => (
              <div key={index} className="check-item-viewer">
                <div className="check-header">
                  <span className="check-number">{index + 1}</span>
                  <span className="check-name">{check.name}</span>
                  <span className="check-status">
                    {getStatusIcon(check.status)} {getStatusText(check.status)}
                  </span>
                </div>
                <div className="check-description">{check.description}</div>
                {check.observation && (
                  <div className="check-observation">
                    <strong>Observação:</strong> {check.observation}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Visual Inspections */}
        <div className="viewer-section">
          <h2 className="section-title">Inspeções Visuais</h2>
          <div className="inspections-list">
            {checklist.visualInspections.map((inspection, index) => (
              <div key={index} className="inspection-item-viewer">
                <div className="inspection-header">
                  <span className="inspection-name">{inspection.name}</span>
                  <span className="inspection-status">
                    {inspection.isCompleted ? (
                      <>
                        {getStatusIcon(inspection.status)} {getStatusText(inspection.status)}
                      </>
                    ) : (
                      '⏳ Pendente'
                    )}
                  </span>
                </div>
                <div className="inspection-description">{inspection.description}</div>
                
                {/* Vídeo da Inspeção */}
                {inspection.videoData && (
                  <div className="inspection-video">
                    <h4>Vídeo da Inspeção</h4>
                    <div className="video-container">
                      <video 
                        src={inspection.videoData.dataUrl}
                        controls
                        className="inspection-video-player"
                        style={{
                          width: '100%',
                          maxWidth: '500px',
                          height: 'auto',
                          borderRadius: 'var(--radius-md)',
                          border: '1px solid var(--color-gray-200)'
                        }}
                      />
                      <div className="video-info">
                        <span>Tamanho: {(inspection.videoData.size / 1024 / 1024).toFixed(2)} MB</span>
                        <span>Gravado em: {new Date(inspection.videoData.recordedAt).toLocaleString('pt-BR')}</span>
                      </div>
                    </div>
                  </div>
                )}
                
                {inspection.frames && inspection.frames.length > 0 && (
                  <div className="inspection-frames">
                    <h4>Fotos Capturadas ({inspection.frames.length})</h4>
                    <div className="frames-grid">
                      {inspection.frames.map((frame, frameIndex) => (
                        <div key={frameIndex} className="frame-item">
                          <img 
                            src={frame.dataUrl} 
                            alt={`Frame ${frameIndex + 1}`}
                            className="frame-image"
                          />
                          <div className="frame-info">
                            <span>Tempo: {frame.timestamp}s</span>
                            <span>Capturado: {frame.captureTime}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChecklistViewer;