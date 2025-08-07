import React from 'react';

const ConfirmDialog = ({ isVisible, message, onConfirm, onCancel }) => {
  if (!isVisible) return null;

  return (
    <div className="confirm-dialog-overlay">
      <div className="confirm-dialog">
        <div className="confirm-dialog-header">
          <h3>Confirmar Ação</h3>
        </div>
        
        <div className="confirm-dialog-body">
          <p>{message}</p>
        </div>
        
        <div className="confirm-dialog-actions">
          <button onClick={onCancel} className="btn btn-secondary">
            Cancelar
          </button>
          <button onClick={onConfirm} className="btn btn-danger">
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;