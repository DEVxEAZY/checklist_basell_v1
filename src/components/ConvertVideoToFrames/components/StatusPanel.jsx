import React from 'react';

const StatusPanel = ({ 
  title, 
  completedCount, 
  totalCount, 
  status, 
  additionalInfo = [] 
}) => {
  return (
    <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#e8f5e8', borderRadius: '8px' }}>
      <h3>{title}</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
        <div>
          <strong>Verificações Concluídas:</strong> {completedCount}/{totalCount}
        </div>
        <div>
          <strong>Status:</strong> {status}
        </div>
        {additionalInfo.map((info, index) => (
          <div key={index}>
            <strong>{info.label}:</strong> {info.value}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatusPanel; 