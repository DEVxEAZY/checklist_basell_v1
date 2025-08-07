import React from 'react';

const QuickPreview = ({ checklist, onClose, onLoad, onView }) => {
  if (!checklist) return null;

  const getCompletionStats = () => {
    const basicChecksCompleted = checklist.basic_checks?.filter(check => check.isCompleted).length || 0;
    const visualInspectionsCompleted = checklist.visual_inspections?.filter(inspection => inspection.isCompleted).length || 0;
    const totalBasicChecks = 9;
    const totalVisualInspections = 5;
    
    return {
      basicChecks: {
        completed: basicChecksCompleted,
        total: totalBasicChecks,
        percentage: Math.round((basicChecksCompleted / totalBasicChecks) * 100)
      },
      visualInspections: {
        completed: visualInspectionsCompleted,
        total: totalVisualInspections,
        percentage: Math.round((visualInspectionsCompleted / totalVisualInspections) * 100)
      },
      overall: {
        completed: basicChecksCompleted + visualInspectionsCompleted,
        total: totalBasicChecks + totalVisualInspections,
        percentage: Math.round(((basicChecksCompleted + visualInspectionsCompleted) / (totalBasicChecks + totalVisualInspections)) * 100)
      }
    };
  };

  const stats = getCompletionStats();
  
  const getStatusInfo = (status) => {
    const statusMap = {
      completed: { text: 'Concluído', color: '#10b981', icon: '✅' },
      in_progress: { text: 'Em Andamento', color: '#f59e0b', icon: '⏳' },
      draft: { text: 'Rascunho', color: '#6b7280', icon: '📝' }
    };
    return statusMap[status] || statusMap.draft;
  };

  const statusInfo = getStatusInfo(checklist.status);

  return (
    <div className="quick-preview-overlay">
      <div className="quick-preview-modal">
        <div className="preview-header">
          <div className="preview-title">
            <h3>Prévia do Checklist</h3>
            <button onClick={onClose} className="close-btn">✕</button>
          </div>
          
          <div className="preview-status">
            <span 
              className="status-indicator"
              style={{ backgroundColor: statusInfo.color }}
            >
              {statusInfo.icon} {statusInfo.text}
            </span>
          </div>
        </div>

        <div className="preview-content">
          {/* Vehicle Information */}
          <div className="preview-section">
            <h4 className="section-title">🚛 Informações do Veículo</h4>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Placa:</span>
                <span className="info-value">{checklist.vehicle_plate || 'Não informado'}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Modelo:</span>
                <span className="info-value">{checklist.vehicle_model || 'Não informado'}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Motorista:</span>
                <span className="info-value">{checklist.driver_name || 'Não informado'}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Inspetor:</span>
                <span className="info-value">{checklist.inspector_name || 'Não informado'}</span>
              </div>
            </div>
          </div>

          {/* Progress Overview */}
          <div className="preview-section">
            <h4 className="section-title">📊 Progresso Geral</h4>
            <div className="progress-overview">
              <div className="progress-item">
                <div className="progress-header">
                  <span className="progress-label">Verificações Básicas</span>
                  <span className="progress-count">{stats.basicChecks.completed}/{stats.basicChecks.total}</span>
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill basic"
                    style={{ width: `${stats.basicChecks.percentage}%` }}
                  />
                </div>
                <span className="progress-percentage">{stats.basicChecks.percentage}%</span>
              </div>
              
              <div className="progress-item">
                <div className="progress-header">
                  <span className="progress-label">Inspeções Visuais</span>
                  <span className="progress-count">{stats.visualInspections.completed}/{stats.visualInspections.total}</span>
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill visual"
                    style={{ width: `${stats.visualInspections.percentage}%` }}
                  />
                </div>
                <span className="progress-percentage">{stats.visualInspections.percentage}%</span>
              </div>
              
              <div className="progress-item overall">
                <div className="progress-header">
                  <span className="progress-label">Progresso Total</span>
                  <span className="progress-count">{stats.overall.completed}/{stats.overall.total}</span>
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill total"
                    style={{ width: `${stats.overall.percentage}%` }}
                  />
                </div>
                <span className="progress-percentage">{stats.overall.percentage}%</span>
              </div>
            </div>
          </div>

          {/* Media Summary */}
          <div className="preview-section">
            <h4 className="section-title">📱 Mídia Capturada</h4>
            <div className="media-summary">
              <div className="media-stat">
                <div className="media-icon">📸</div>
                <div className="media-info">
                  <span className="media-count">{checklist.total_frames || 0}</span>
                  <span className="media-label">Fotos</span>
                </div>
              </div>
              <div className="media-stat">
                <div className="media-icon">🎥</div>
                <div className="media-info">
                  <span className="media-count">{checklist.total_videos || 0}</span>
                  <span className="media-label">Vídeos</span>
                </div>
              </div>
            </div>
          </div>

          {/* Timestamps */}
          <div className="preview-section">
            <h4 className="section-title">📅 Informações de Data</h4>
            <div className="timestamp-info">
              <div className="timestamp-item">
                <span className="timestamp-label">Criado em:</span>
                <span className="timestamp-value">
                  {new Date(checklist.created_at).toLocaleString('pt-BR')}
                </span>
              </div>
              {checklist.updated_at && checklist.updated_at !== checklist.created_at && (
                <div className="timestamp-item">
                  <span className="timestamp-label">Última atualização:</span>
                  <span className="timestamp-value">
                    {new Date(checklist.updated_at).toLocaleString('pt-BR')}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="preview-actions">
          <button onClick={onClose} className="btn btn-secondary">
            Fechar
          </button>
          <button onClick={() => onView(checklist.id)} className="btn btn-outline">
            👁️ Ver Completo
          </button>
          <button onClick={() => onLoad(checklist.id)} className="btn btn-primary">
            📝 Carregar para Edição
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuickPreview;