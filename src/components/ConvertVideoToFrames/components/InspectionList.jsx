import React from 'react';

const InspectionList = ({ 
  visualInspections, 
  currentInspection
}) => {
  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">
          <span>📋</span>
          Lista de Inspeções
        </h3>
      </div>
      <div className="inspection-grid">
        {visualInspections.map((inspection) => {
          console.log(`Renderizando inspeção ${inspection.id}:`, inspection);
          return (
            <div
              key={inspection.id} 
              className={`inspection-item ${
                inspection.id === currentInspection ? 'current' : ''
              } ${inspection.isCompleted ? 'completed' : ''}`}
            >
              <div className="inspection-item-header">
                <h4 className="inspection-item-title">
                  {inspection.name}
                </h4>
                {inspection.isCompleted && (
                  <div className="inspection-item-status success">✓</div>
                )}
              </div>
              <div className="inspection-item-description">
                {inspection.description}
              </div>
              <div className="stats-grid" style={{ gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-sm)' }}>
                <div className="stat-item">
                  <div className="stat-icon info">📸</div>
                  <div className="stat-content">
                    <p className="stat-label">Fotos</p>
                    <p className="stat-value">{inspection.frames.length}</p>
                  </div>
                </div>
                <div className="stat-item">
                  <div className={`stat-icon ${inspection.isCompleted ? 'success' : 'info'}`}>
                    {inspection.isCompleted 
                      ? (inspection.status === 'ok' ? '✅' : 
                         inspection.status === 'not_ok' ? '❌' : 
                         inspection.status === 'na' ? '➖' : '✓')
                      : '⏳'}
                  </div>
                  <div className="stat-content">
                    <p className="stat-label">Status</p>
                    <p className="stat-value">
                      {inspection.isCompleted 
                        ? (inspection.status === 'ok' ? 'Conforme' : 
                           inspection.status === 'not_ok' ? 'Não conforme' : 
                           inspection.status === 'na' ? 'N/A' : 'Concluída')
                        : 'Pendente'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default InspectionList; 