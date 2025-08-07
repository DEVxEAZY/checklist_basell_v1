import React from 'react';

const InspectionList = ({ 
  visualInspections, 
  currentInspection
}) => {
  return (
    <div className="info-card">
      <h3 style={{ margin: '0 0 1.5rem 0', fontSize: '1.2rem', fontWeight: '600' }}>
        📋 Lista de Inspeções
      </h3>
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
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '600' }}>
                  {inspection.name}
                </h4>
                {inspection.isCompleted && (
                  <span style={{ color: '#22c55e', fontSize: '1.5rem' }}>✓</span>
                )}
              </div>
              <div style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '1rem', lineHeight: '1.5' }}>
                {inspection.description}
              </div>
              <div className="stats-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
                <div className="stat-item" style={{ padding: '0.5rem' }}>
                  <div className="stat-icon info" style={{ width: '32px', height: '32px', fontSize: '1rem' }}>📸</div>
                  <div className="stat-content">
                    <p className="stat-label">Fotos</p>
                    <p className="stat-value" style={{ fontSize: '1rem' }}>{inspection.frames.length}</p>
                  </div>
                </div>
                <div className="stat-item" style={{ padding: '0.5rem' }}>
                  <div className="stat-icon success" style={{ width: '32px', height: '32px', fontSize: '1rem' }}>
                    {inspection.isCompleted 
                      ? (inspection.status === 'ok' ? '✅' : 
                         inspection.status === 'not_ok' ? '❌' : 
                         inspection.status === 'na' ? '➖' : '✓')
                      : '⏳'}
                  </div>
                  <div className="stat-content">
                    <p className="stat-label">Status</p>
                    <p className="stat-value" style={{ fontSize: '0.85rem' }}>
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