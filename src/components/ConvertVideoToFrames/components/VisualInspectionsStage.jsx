import React, { useState } from 'react';
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
  const [activeTab, setActiveTab] = useState('camera');

  return (
    <div className="stage2-container">
      {/* Header com progresso */}
      <div className="stage2-header">
        <div className="stage-progress">
          <div className="stage-number">{currentStage}</div>
          <div className="stage-info">
            <h2>Inspeções Visuais</h2>
            <p>Documentação com vídeo e fotos</p>
          </div>
          <div className="progress-indicator">
            <span className="progress-text">{completedVisualInspections}/5</span>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${(completedVisualInspections / 5) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Informação da Inspeção Atual - Mobile Optimized */}
      <div className="current-inspection-card">
        <div className="inspection-badge-mobile">
          <span className="inspection-number">{currentInspection}</span>
          <span className="inspection-total">de 5</span>
        </div>
        <div className="inspection-details-mobile">
          <h3 className="inspection-name-mobile">{currentInspectionData?.name}</h3>
          <p className="inspection-description-mobile">{currentInspectionData?.description}</p>
          <div className="inspection-status-mobile">
            {currentInspectionData?.isCompleted ? (
              <span className="status-completed-mobile">✅ Concluída</span>
            ) : (
              <span className="status-pending-mobile">⏳ Em andamento</span>
            )}
          </div>
        </div>
      </div>

      {/* Navegação por Tabs - Mobile */}
      <div className="mobile-tabs">
        <button 
          className={`tab-button ${activeTab === 'camera' ? 'active' : ''}`}
          onClick={() => setActiveTab('camera')}
        >
          <span className="tab-icon">📹</span>
          <span className="tab-text">Câmera</span>
        </button>
        <button 
          className={`tab-button ${activeTab === 'status' ? 'active' : ''}`}
          onClick={() => setActiveTab('status')}
        >
          <span className="tab-icon">📊</span>
          <span className="tab-text">Status</span>
        </button>
        <button 
          className={`tab-button ${activeTab === 'list' ? 'active' : ''}`}
          onClick={() => setActiveTab('list')}
        >
          <span className="tab-icon">📋</span>
          <span className="tab-text">Lista</span>
        </button>
      </div>

      {/* Conteúdo das Tabs */}
      <div className="tab-content">
        {/* Tab Câmera */}
        {activeTab === 'camera' && (
          <div className="camera-tab">
            {/* Seção da Câmera - Mobile Optimized */}
            <div className="video-section-mobile">
              <div className="video-container-mobile">
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  playsInline
                  className="video-element-mobile"
                />
                {isCapturing && (
                  <div className="video-overlay-mobile">
                    <div className="recording-indicator-mobile">
                      <div className="recording-dot-mobile"></div>
                      <span>Gravando</span>
                    </div>
                    <div className="frame-counter-mobile">
                      📸 {currentInspectionData?.frames.length || 0}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Controles de Vídeo - Mobile Optimized */}
            <div className="video-controls-mobile">
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
        )}

        {/* Tab Status */}
        {activeTab === 'status' && (
          <div className="status-tab">
            <div className="status-cards-mobile">
              <div className="status-card-mobile">
                <div className="status-icon-mobile">📈</div>
                <div className="status-content-mobile">
                  <div className="status-value-mobile">{completedVisualInspections}/5</div>
                  <div className="status-label-mobile">Concluídas</div>
                </div>
              </div>
              
              <div className="status-card-mobile">
                <div className="status-icon-mobile">📸</div>
                <div className="status-content-mobile">
                  <div className="status-value-mobile">{totalFrames}</div>
                  <div className="status-label-mobile">Fotos</div>
                </div>
              </div>
              
              <div className="status-card-mobile">
                <div className="status-icon-mobile">🎥</div>
                <div className="status-content-mobile">
                  <div className="status-value-mobile">
                    {visualInspections.filter(i => i.videoData).length}
                  </div>
                  <div className="status-label-mobile">Vídeos</div>
                </div>
              </div>
              
              <div className="status-card-mobile">
                <div className="status-icon-mobile">📋</div>
                <div className="status-content-mobile">
                  <div className="status-value-mobile">{currentInspection}</div>
                  <div className="status-label-mobile">Atual</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab Lista */}
        {activeTab === 'list' && (
          <div className="list-tab">
            <div className="inspection-list-mobile">
              {visualInspections.map((inspection) => (
                <div
                  key={inspection.id} 
                  className={`inspection-card-mobile ${
                    inspection.id === currentInspection ? 'current' : ''
                  } ${inspection.isCompleted ? 'completed' : ''}`}
                >
                  <div className="inspection-card-header-mobile">
                    <div className="inspection-number-badge-mobile">
                      {inspection.id}
                    </div>
                    <div className="inspection-card-content-mobile">
                      <h4 className="inspection-card-title-mobile">
                        {inspection.name}
                      </h4>
                      <p className="inspection-card-description-mobile">
                        {inspection.description}
                      </p>
                    </div>
                    <div className="inspection-card-status-mobile">
                      {inspection.isCompleted ? (
                        <div className="status-icon-mobile success">✓</div>
                      ) : inspection.id === currentInspection ? (
                        <div className="status-icon-mobile current">⏳</div>
                      ) : (
                        <div className="status-icon-mobile pending">○</div>
                      )}
                    </div>
                  </div>
                  
                  <div className="inspection-card-stats-mobile">
                    <div className="stat-mobile">
                      <span className="stat-icon-mobile">📸</span>
                      <span className="stat-value-mobile">{inspection.frames.length}</span>
                    </div>
                    <div className="stat-mobile">
                      <span className="stat-icon-mobile">🎥</span>
                      <span className="stat-value-mobile">{inspection.videoData ? '1' : '0'}</span>
                    </div>
                    <div className="stat-mobile">
                      <span className="stat-icon-mobile">
                        {inspection.isCompleted 
                          ? (inspection.status === 'ok' ? '✅' : 
                             inspection.status === 'not_ok' ? '❌' : 
                             inspection.status === 'na' ? '➖' : '✓')
                          : '⏳'}
                      </span>
                      <span className="stat-value-mobile">
                        {inspection.isCompleted 
                          ? (inspection.status === 'ok' ? 'OK' : 
                             inspection.status === 'not_ok' ? 'NOK' : 
                             inspection.status === 'na' ? 'N/A' : 'OK')
                          : 'Pendente'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Canvas invisível para captura */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
};

export default VisualInspectionsStage;