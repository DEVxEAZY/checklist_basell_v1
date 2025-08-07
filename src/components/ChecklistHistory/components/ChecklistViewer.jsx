import React, { useState } from 'react';
import { generateChecklistWithData } from '../../pdfTemplate';

const ChecklistViewer = ({ checklist, onBack, onLoad }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedVideo, setSelectedVideo] = useState(null);

  // Add safety checks for undefined checklist or its properties
  if (!checklist) {
    return (
      <div className="viewer-container">
        <div className="viewer-header">
          <button onClick={onBack} className="back-button">
            ← Voltar
          </button>
          <div className="loading-spinner"></div>
          <h1>Carregando checklist...</h1>
        </div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusInfo = (status) => {
    const statusMap = {
      'ok': { text: 'Conforme', icon: '✅', color: '#10b981', bgColor: '#ecfdf5' },
      'not_ok': { text: 'Não Conforme', icon: '❌', color: '#ef4444', bgColor: '#fef2f2' },
      'na': { text: 'Não Aplicável', icon: '➖', color: '#f59e0b', bgColor: '#fffbeb' }
    };
    return statusMap[status] || { text: 'Pendente', icon: '⏳', color: '#6b7280', bgColor: '#f9fafb' };
  };

  const getOverallStatus = () => {
    const basicComplete = checklist.basicChecks?.every(check => check.isCompleted) || false;
    const visualComplete = checklist.visualInspections?.every(inspection => inspection.isCompleted) || false;
    
    if (basicComplete && visualComplete) return { text: 'Concluído', icon: '✅', color: '#10b981' };
    if (checklist.basicChecks?.some(check => check.isCompleted) || checklist.visualInspections?.some(inspection => inspection.isCompleted)) {
      return { text: 'Em Andamento', icon: '⏳', color: '#f59e0b' };
    }
    return { text: 'Rascunho', icon: '📝', color: '#6b7280' };
  };

  const getCompletionStats = () => {
    const basicCompleted = checklist.basicChecks?.filter(check => check.isCompleted).length || 0;
    const visualCompleted = checklist.visualInspections?.filter(inspection => inspection.isCompleted).length || 0;
    const totalBasic = 9;
    const totalVisual = 5;
    const totalCompleted = basicCompleted + visualCompleted;
    const totalItems = totalBasic + totalVisual;
    
    return {
      basic: { completed: basicCompleted, total: totalBasic, percentage: Math.round((basicCompleted / totalBasic) * 100) },
      visual: { completed: visualCompleted, total: totalVisual, percentage: Math.round((visualCompleted / totalVisual) * 100) },
      overall: { completed: totalCompleted, total: totalItems, percentage: Math.round((totalCompleted / totalItems) * 100) }
    };
  };

  const handleGeneratePDF = async () => {
    try {
      const templateOptions = {
        title: 'Checklist de Verificações BASELL',
        subtitle: 'Relatório de Inspeção de Veículo',
        companyName: 'BASELL',
        vehicleInfo: {
          plate: checklist.vehicleInfo?.plate || 'N/A',
          model: checklist.vehicleInfo?.model || 'N/A',
          driver: checklist.vehicleInfo?.driver || 'N/A',
          inspector: checklist.vehicleInfo?.inspector || 'N/A',
          date: formatDate(checklist.created_at || checklist.createdAt)
        },
        filename: `checklist_${checklist.vehicleInfo?.plate || 'sem-placa'}_${new Date().toISOString().slice(0, 10)}.pdf`
      };

      await generateChecklistWithData(checklist, templateOptions);
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      alert('Erro ao gerar relatório PDF');
    }
  };

  const overallStatus = getOverallStatus();
  const stats = getCompletionStats();

  return (
    <div className="checklist-viewer">
      {/* Header */}
      <div className="viewer-header">
        <div className="viewer-header-left">
          <button onClick={onBack} className="viewer-back-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m15 18-6-6 6-6"/>
            </svg>
            Voltar
          </button>
          <div className="viewer-title-section">
            <h1 className="viewer-title">Visualizar Checklist</h1>
            <div className="viewer-subtitle">
              <span className="viewer-date">Criado em {formatDate(checklist.created_at || checklist.createdAt)}</span>
              <div className="viewer-status-badge" style={{ backgroundColor: overallStatus.color }}>
                <span className="status-icon">{overallStatus.icon}</span>
                <span className="status-text">{overallStatus.text}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="viewer-header-actions">
          <button onClick={handleGeneratePDF} className="viewer-action-btn pdf-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14,2 14,8 20,8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
              <polyline points="10,9 9,9 8,9"/>
            </svg>
            Gerar PDF
          </button>
          <button onClick={onLoad} className="viewer-action-btn edit-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
            Editar
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="viewer-tabs">
        <button 
          className={`viewer-tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 3v5h5"/>
            <path d="M3 21v-5h5"/>
            <path d="M21 3v5h-5"/>
            <path d="M21 21v-5h-5"/>
          </svg>
          Visão Geral
        </button>
        <button 
          className={`viewer-tab ${activeTab === 'basic' ? 'active' : ''}`}
          onClick={() => setActiveTab('basic')}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 11l3 3L22 4"/>
            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
          </svg>
          Verificações Básicas
        </button>
        <button 
          className={`viewer-tab ${activeTab === 'visual' ? 'active' : ''}`}
          onClick={() => setActiveTab('visual')}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
            <circle cx="12" cy="13" r="4"/>
          </svg>
          Inspeções Visuais
        </button>
      </div>

      {/* Content */}
      <div className="viewer-content">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="overview-tab">
            {/* Vehicle Information Card */}
            <div className="viewer-card">
              <div className="card-header">
                <h3 className="card-title">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M7 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"/>
                    <path d="M17 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"/>
                    <path d="M5 17h-2v-6l2-5h9l4 5h1a2 2 0 0 1 2 2v4h-2"/>
                    <path d="M9 17v-6h4v6"/>
                  </svg>
                  Informações do Veículo
                </h3>
              </div>
              <div className="vehicle-info-grid">
                <div className="info-item">
                  <div className="info-label">Placa</div>
                  <div className="info-value">{checklist.vehicleInfo?.plate || 'N/A'}</div>
                </div>
                <div className="info-item">
                  <div className="info-label">Modelo</div>
                  <div className="info-value">{checklist.vehicleInfo?.model || 'N/A'}</div>
                </div>
                <div className="info-item">
                  <div className="info-label">Motorista</div>
                  <div className="info-value">{checklist.vehicleInfo?.driver || 'N/A'}</div>
                </div>
                <div className="info-item">
                  <div className="info-label">Inspetor</div>
                  <div className="info-value">{checklist.vehicleInfo?.inspector || 'N/A'}</div>
                </div>
              </div>
            </div>

            {/* Progress Overview */}
            <div className="viewer-card">
              <div className="card-header">
                <h3 className="card-title">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
                  </svg>
                  Progresso do Checklist
                </h3>
              </div>
              <div className="progress-overview">
                <div className="progress-item">
                  <div className="progress-header">
                    <span className="progress-label">Verificações Básicas</span>
                    <span className="progress-count">{stats.basic.completed}/{stats.basic.total}</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill basic" style={{ width: `${stats.basic.percentage}%` }}></div>
                  </div>
                  <span className="progress-percentage">{stats.basic.percentage}%</span>
                </div>
                
                <div className="progress-item">
                  <div className="progress-header">
                    <span className="progress-label">Inspeções Visuais</span>
                    <span className="progress-count">{stats.visual.completed}/{stats.visual.total}</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill visual" style={{ width: `${stats.visual.percentage}%` }}></div>
                  </div>
                  <span className="progress-percentage">{stats.visual.percentage}%</span>
                </div>
                
                <div className="progress-item overall">
                  <div className="progress-header">
                    <span className="progress-label">Progresso Total</span>
                    <span className="progress-count">{stats.overall.completed}/{stats.overall.total}</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill total" style={{ width: `${stats.overall.percentage}%` }}></div>
                  </div>
                  <span className="progress-percentage">{stats.overall.percentage}%</span>
                </div>
              </div>
            </div>

            {/* Statistics Cards */}
            <div className="stats-cards">
              <div className="stat-card">
                <div className="stat-icon photos">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                    <circle cx="12" cy="13" r="4"/>
                  </svg>
                </div>
                <div className="stat-content">
                  <div className="stat-value">{checklist.total_frames || 0}</div>
                  <div className="stat-label">Fotos Capturadas</div>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon videos">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="23,7 16,12 23,17 23,7"/>
                    <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
                  </svg>
                </div>
                <div className="stat-content">
                  <div className="stat-value">{checklist.total_videos || 0}</div>
                  <div className="stat-label">Vídeos Gravados</div>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon time">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="12,6 12,12 16,14"/>
                  </svg>
                </div>
                <div className="stat-content">
                  <div className="stat-value">{formatDate(checklist.created_at || checklist.createdAt).split(' ')[1]}</div>
                  <div className="stat-label">Horário de Criação</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Basic Checks Tab */}
        {activeTab === 'basic' && (
          <div className="basic-tab">
            <div className="viewer-card">
              <div className="card-header">
                <h3 className="card-title">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 11l3 3L22 4"/>
                    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
                  </svg>
                  Verificações Básicas ({stats.basic.completed}/{stats.basic.total})
                </h3>
              </div>
              <div className="checks-list">
                {checklist.basicChecks?.map((check, index) => {
                  const statusInfo = getStatusInfo(check.status);
                  return (
                    <div key={index} className="check-item-viewer">
                      <div className="check-header">
                        <div className="check-number">{index + 1}</div>
                        <div className="check-content">
                          <h4 className="check-name">{check.name}</h4>
                          <p className="check-description">{check.description}</p>
                        </div>
                        <div className="check-status" style={{ backgroundColor: statusInfo.bgColor, color: statusInfo.color }}>
                          <span className="status-icon">{statusInfo.icon}</span>
                          <span className="status-text">{statusInfo.text}</span>
                        </div>
                      </div>
                      {check.observation && (
                        <div className="check-observation">
                          <div className="observation-label">Observação:</div>
                          <div className="observation-text">{check.observation}</div>
                        </div>
                      )}
                    </div>
                  );
                }) || []}
              </div>
            </div>
          </div>
        )}

        {/* Visual Inspections Tab */}
        {activeTab === 'visual' && (
          <div className="visual-tab">
            <div className="viewer-card">
              <div className="card-header">
                <h3 className="card-title">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                    <circle cx="12" cy="13" r="4"/>
                  </svg>
                  Inspeções Visuais ({stats.visual.completed}/{stats.visual.total})
                </h3>
              </div>
              <div className="inspections-list">
                {checklist.visualInspections?.map((inspection, index) => {
                  const statusInfo = getStatusInfo(inspection.status);
                  return (
                    <div key={index} className="inspection-item-viewer">
                      <div className="inspection-header">
                        <div className="inspection-number">{index + 10}</div>
                        <div className="inspection-content">
                          <h4 className="inspection-name">{inspection.name}</h4>
                          <p className="inspection-description">{inspection.description}</p>
                        </div>
                        <div className="inspection-status" style={{ backgroundColor: statusInfo.bgColor, color: statusInfo.color }}>
                          <span className="status-icon">{statusInfo.icon}</span>
                          <span className="status-text">{inspection.isCompleted ? statusInfo.text : 'Pendente'}</span>
                        </div>
                      </div>
                      
                      {/* Video Section */}
                      {inspection.videoData && (
                        <div className="inspection-media">
                          <div className="media-header">
                            <h5 className="media-title">
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polygon points="23,7 16,12 23,17 23,7"/>
                                <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
                              </svg>
                              Vídeo da Inspeção
                            </h5>
                            <div className="media-info">
                              <span className="media-size">{(inspection.videoData.size / 1024 / 1024).toFixed(2)} MB</span>
                              <span className="media-date">{new Date(inspection.videoData.recordedAt).toLocaleString('pt-BR')}</span>
                            </div>
                          </div>
                          <div className="video-container">
                            <video 
                              src={inspection.videoData.dataUrl}
                              controls
                              className="inspection-video"
                              poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23f3f4f6'/%3E%3Ctext x='50' y='50' text-anchor='middle' dy='.3em' fill='%236b7280'%3E▶%3C/text%3E%3C/svg%3E"
                            />
                          </div>
                        </div>
                      )}
                      
                      {/* Photos Section */}
                      {inspection.frames && inspection.frames.length > 0 && (
                        <div className="inspection-media">
                          <div className="media-header">
                            <h5 className="media-title">
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                                <circle cx="12" cy="13" r="4"/>
                              </svg>
                              Fotos Capturadas ({inspection.frames.length})
                            </h5>
                          </div>
                          <div className="frames-grid">
                            {inspection.frames.map((frame, frameIndex) => (
                              <div key={frameIndex} className="frame-item">
                                <img 
                                  src={frame.dataUrl} 
                                  alt={`Frame ${frameIndex + 1}`}
                                  className="frame-image"
                                  loading="lazy"
                                />
                                <div className="frame-overlay">
                                  <div className="frame-info">
                                    <span className="frame-time">{frame.timestamp}s</span>
                                    <span className="frame-capture">{frame.captureTime}</span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                }) || []}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Video Modal */}
      {selectedVideo && (
        <div className="video-modal-overlay" onClick={() => setSelectedVideo(null)}>
          <div className="video-modal" onClick={(e) => e.stopPropagation()}>
            <div className="video-modal-header">
              <h3>Vídeo da Inspeção</h3>
              <button onClick={() => setSelectedVideo(null)} className="modal-close-btn">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
            <div className="video-modal-content">
              <video 
                src={selectedVideo}
                controls
                autoPlay
                className="modal-video"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChecklistViewer;