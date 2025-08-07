import React from 'react';

const HistoryStats = ({ statistics }) => {
  const { total, completed, inProgress, drafts, totalFrames } = statistics;

  return (
    <div className="history-stats">
      <div className="stat-card">
        <div className="stat-icon total">📋</div>
        <div className="stat-content">
          <div className="stat-value">{total}</div>
          <div className="stat-label">Total</div>
        </div>
      </div>
      
      <div className="stat-card">
        <div className="stat-icon completed">✅</div>
        <div className="stat-content">
          <div className="stat-value">{completed}</div>
          <div className="stat-label">Concluídos</div>
        </div>
      </div>
      
      <div className="stat-card">
        <div className="stat-icon in-progress">⏳</div>
        <div className="stat-content">
          <div className="stat-value">{inProgress}</div>
          <div className="stat-label">Em Andamento</div>
        </div>
      </div>
      
      <div className="stat-card">
        <div className="stat-icon draft">📝</div>
        <div className="stat-content">
          <div className="stat-value">{drafts}</div>
          <div className="stat-label">Rascunhos</div>
        </div>
      </div>
      
      <div className="stat-card">
        <div className="stat-icon photos">📸</div>
        <div className="stat-content">
          <div className="stat-value">{totalFrames}</div>
          <div className="stat-label">Fotos</div>
        </div>
      </div>
    </div>
  );
};

export default HistoryStats;