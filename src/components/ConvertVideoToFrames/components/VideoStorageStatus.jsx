import React, { useState, useEffect } from 'react';
import { videoStorageManager } from '../../../utils/videoStorage';

const VideoStorageStatus = ({ currentInspection, visualInspections }) => {
  const [storageStats, setStorageStats] = useState(null);
  const [tempVideos, setTempVideos] = useState([]);

  // Update storage stats periodically
  useEffect(() => {
    const updateStats = () => {
      const stats = videoStorageManager.getStorageStats();
      const temps = videoStorageManager.getAllTempVideos();
      
      setStorageStats(stats);
      setTempVideos(temps);
    };

    // Initial update
    updateStats();

    // Update every 5 seconds
    const interval = setInterval(updateStats, 5000);

    return () => clearInterval(interval);
  }, []);

  // Handle manual cleanup of old temporary videos
  const handleCleanupOldVideos = () => {
    const cleaned = videoStorageManager.cleanupOldTempVideos(1); // Clean videos older than 1 hour
    alert(`Limpeza concluída: ${cleaned} vídeos temporários removidos`);
  };

  // Handle download of temporary video
  const handleDownloadTempVideo = (inspectionId) => {
    const success = videoStorageManager.downloadVideo(inspectionId);
    if (!success) {
      alert('Erro ao baixar vídeo');
    }
  };

  if (!storageStats) {
    return (
      <div className="storage-status loading">
        <p>Carregando estatísticas de armazenamento...</p>
      </div>
    );
  }

  return (
    <div className="storage-status">
      <div className="storage-header">
        <h4>📹 Status do Armazenamento de Vídeos</h4>
        <button 
          onClick={handleCleanupOldVideos}
          className="cleanup-btn"
          title="Limpar vídeos temporários antigos"
        >
          🧹 Limpeza
        </button>
      </div>

      {/* Storage Statistics */}
      <div className="storage-stats">
        <div className="stat-group">
          <div className="stat-item temp">
            <div className="stat-icon">⏳</div>
            <div className="stat-content">
              <div className="stat-value">{storageStats.temporary.count}</div>
              <div className="stat-label">Temporários</div>
              <div className="stat-size">{storageStats.temporary.totalSizeMB} MB</div>
            </div>
          </div>
          
          <div className="stat-item permanent">
            <div className="stat-icon">💾</div>
            <div className="stat-content">
              <div className="stat-value">{storageStats.permanent.count}</div>
              <div className="stat-label">Permanentes</div>
              <div className="stat-size">{storageStats.permanent.totalSizeMB} MB</div>
            </div>
          </div>
          
          <div className="stat-item total">
            <div className="stat-icon">📊</div>
            <div className="stat-content">
              <div className="stat-value">{storageStats.total.count}</div>
              <div className="stat-label">Total</div>
              <div className="stat-size">{storageStats.total.totalSizeMB} MB</div>
            </div>
          </div>
        </div>
      </div>

      {/* Temporary Videos List */}
      {tempVideos.length > 0 && (
        <div className="temp-videos-section">
          <h5>📹 Vídeos Temporários (não salvos)</h5>
          <div className="temp-videos-list">
            {tempVideos.map((video) => {
              const inspection = visualInspections.find(i => i.id === parseInt(video.id));
              const isCurrent = parseInt(video.id) === currentInspection;
              
              return (
                <div 
                  key={video.id} 
                  className={`temp-video-item ${isCurrent ? 'current' : ''}`}
                >
                  <div className="video-info">
                    <div className="video-name">
                      {inspection?.name || `Inspeção ${video.id}`}
                      {isCurrent && <span className="current-badge">Atual</span>}
                    </div>
                    <div className="video-details">
                      <span className="video-size">
                        {(video.size / 1024 / 1024).toFixed(2)} MB
                      </span>
                      <span className="video-time">
                        {new Date(video.recordedAt).toLocaleTimeString('pt-BR')}
                      </span>
                    </div>
                  </div>
                  
                  <div className="video-actions">
                    <button
                      onClick={() => handleDownloadTempVideo(video.id)}
                      className="download-btn"
                      title="Baixar vídeo temporário"
                    >
                      📥
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="temp-videos-warning">
            <p>⚠️ <strong>Atenção:</strong> Estes vídeos são temporários e serão perdidos se você não salvar o checklist.</p>
          </div>
        </div>
      )}

      {/* Storage Workflow Info */}
      <div className="workflow-info">
        <h5>💡 Como Funciona o Armazenamento</h5>
        <ul>
          <li><strong>Gravação:</strong> Vídeos ficam temporários durante a inspeção</li>
          <li><strong>Controle:</strong> Você decide quando salvar permanentemente</li>
          <li><strong>Salvamento:</strong> Clique em "Salvar Checklist" para tornar permanente</li>
          <li><strong>Limpeza:</strong> Vídeos não salvos são removidos automaticamente</li>
        </ul>
      </div>
    </div>
  );
};

export default VideoStorageStatus;