import React from 'react';

const InspectionList = ({ 
  visualInspections, 
  currentInspection
}) => {
  return (
    <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
      <h3>Lista de Inspeções</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '15px' }}>
        {visualInspections.map((inspection) => {
          console.log(`Renderizando inspeção ${inspection.id}:`, inspection);
          return (
            <div 
              key={inspection.id} 
              style={{ 
                padding: '15px',
                border: inspection.id === currentInspection ? '3px solid #4CAF50' : '1px solid #ddd',
                borderRadius: '8px',
                backgroundColor: inspection.isCompleted ? '#e8f5e8' : 'white'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <h4 style={{ margin: 0, color: inspection.isCompleted ? '#4CAF50' : '#333' }}>
                  {inspection.name}
                </h4>
                {inspection.isCompleted && (
                  <span style={{ color: '#4CAF50', fontSize: '20px' }}>✓</span>
                )}
              </div>
              <div style={{ fontSize: '14px', color: '#666', marginBottom: '10px' }}>
                {inspection.description}
              </div>
              <div style={{ fontSize: '12px', color: '#888' }}>
                <div>Fotos: {inspection.frames.length}</div>
                <div>Status: {
                  inspection.isCompleted 
                    ? (inspection.status === 'ok' ? '✅ Conforme' : 
                       inspection.status === 'not_ok' ? '❌ Não conforme' : 
                       inspection.status === 'na' ? '➖ Não aplicável' : 'Concluída')
                    : '⏳ Pendente'
                }</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default InspectionList; 