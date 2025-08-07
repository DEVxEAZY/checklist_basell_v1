import React, { useState } from 'react';

const InspectionStatusPopup = ({ 
  isVisible, 
  onConfirm, 
  onCancel, 
  inspectionName = "Inspeção",
  title = "Status da Inspeção",
  message = "Qual o status desta inspeção após a conclusão do vídeo?"
}) => {
  const [selectedStatus, setSelectedStatus] = useState('ok');

  if (!isVisible) return null;

  const handleConfirm = () => {
    onConfirm(selectedStatus);
  };

  const handleCancel = () => {
    onCancel();
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '10px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
        maxWidth: '500px',
        width: '90%',
        textAlign: 'center'
      }}>
        <h3 style={{ 
          margin: '0 0 15px 0', 
          color: '#333',
          fontSize: '18px'
        }}>
          {title}
        </h3>
        
        <p style={{ 
          margin: '0 0 10px 0', 
          color: '#666',
          fontSize: '16px',
          lineHeight: '1.4'
        }}>
          {message}
        </p>

        <p style={{ 
          margin: '0 0 25px 0', 
          color: '#333',
          fontSize: '14px',
          fontWeight: 'bold'
        }}>
          Inspeção: <span style={{ color: '#2980b9' }}>{inspectionName}</span>
        </p>
        
        {/* Opções de Status */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          marginBottom: '25px'
        }}>
          <label style={{
            display: 'flex',
            alignItems: 'center',
            padding: '12px',
            border: selectedStatus === 'ok' ? '2px solid #4CAF50' : '2px solid #ddd',
            borderRadius: '8px',
            cursor: 'pointer',
            backgroundColor: selectedStatus === 'ok' ? '#e8f5e8' : 'white',
            transition: 'all 0.2s'
          }}>
            <input
              type="radio"
              name="status"
              value="ok"
              checked={selectedStatus === 'ok'}
              onChange={(e) => setSelectedStatus(e.target.value)}
              style={{ marginRight: '10px' }}
            />
            <span style={{ color: '#4CAF50', fontSize: '16px', marginRight: '8px' }}>✅</span>
            <span style={{ fontWeight: '500' }}>Conforme/Aprovado</span>
          </label>

          <label style={{
            display: 'flex',
            alignItems: 'center',
            padding: '12px',
            border: selectedStatus === 'not_ok' ? '2px solid #f44336' : '2px solid #ddd',
            borderRadius: '8px',
            cursor: 'pointer',
            backgroundColor: selectedStatus === 'not_ok' ? '#ffebee' : 'white',
            transition: 'all 0.2s'
          }}>
            <input
              type="radio"
              name="status"
              value="not_ok"
              checked={selectedStatus === 'not_ok'}
              onChange={(e) => setSelectedStatus(e.target.value)}
              style={{ marginRight: '10px' }}
            />
            <span style={{ color: '#f44336', fontSize: '16px', marginRight: '8px' }}>❌</span>
            <span style={{ fontWeight: '500' }}>Não conforme/Reprovado</span>
          </label>

          <label style={{
            display: 'flex',
            alignItems: 'center',
            padding: '12px',
            border: selectedStatus === 'na' ? '2px solid #FF9800' : '2px solid #ddd',
            borderRadius: '8px',
            cursor: 'pointer',
            backgroundColor: selectedStatus === 'na' ? '#fff3e0' : 'white',
            transition: 'all 0.2s'
          }}>
            <input
              type="radio"
              name="status"
              value="na"
              checked={selectedStatus === 'na'}
              onChange={(e) => setSelectedStatus(e.target.value)}
              style={{ marginRight: '10px' }}
            />
            <span style={{ color: '#FF9800', fontSize: '16px', marginRight: '8px' }}>➖</span>
            <span style={{ fontWeight: '500' }}>Não aplicável</span>
          </label>
        </div>
        
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '15px'
        }}>
          <button
            onClick={handleCancel}
            style={{
              padding: '12px 24px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#5a6268'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#6c757d'}
          >
            Cancelar
          </button>
          
          <button
            onClick={handleConfirm}
            style={{
              padding: '12px 24px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#218838'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#28a745'}
          >
            Confirmar Status
          </button>
        </div>
      </div>
    </div>
  );
};

export default InspectionStatusPopup; 