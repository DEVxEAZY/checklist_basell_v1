import React from 'react';

const StatusPanel = ({ 
  title, 
  completedCount, 
  totalCount, 
  status, 
  additionalInfo = [] 
}) => {
  return (
    <div>
      <h3 style={{ margin: '0 0 1.5rem 0', fontSize: '1.2rem', fontWeight: '600' }}>{title}</h3>
      <div className="stats-grid">
        <div className="stat-item">
          <div className="stat-icon success">📊</div>
          <div className="stat-content">
            <p className="stat-label">Verificações Concluídas</p>
            <p className="stat-value">{completedCount}/{totalCount}</p>
          </div>
        </div>
        <div className="stat-item">
          <div className="stat-icon info">📋</div>
          <div className="stat-content">
            <p className="stat-label">Status</p>
            <p className="stat-value">{status}</p>
          </div>
        </div>
        {additionalInfo.map((info, index) => (
          <div key={index} className="stat-item">
            <div className="stat-icon info">📈</div>
            <div className="stat-content">
              <p className="stat-label">{info.label}</p>
              <p className="stat-value">{info.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatusPanel; 