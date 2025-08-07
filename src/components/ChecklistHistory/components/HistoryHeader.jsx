import React from 'react';

const HistoryHeader = ({ onBack, onExport, onClearAll, hasChecklists }) => {
  return (
    <div className="history-header">
      <div className="history-header-left">
        <button onClick={onBack} className="btn btn-secondary">
          ← Voltar
        </button>
        <div className="history-title">
          <h1>Histórico de Checklists</h1>
          <p>Gerencie e visualize todos os checklists salvos</p>
        </div>
      </div>
      
      <div className="history-header-actions">
        {hasChecklists && (
          <>
            <button onClick={onExport} className="btn btn-outline">
              📥 Exportar
            </button>
            <button onClick={onClearAll} className="btn btn-danger">
              🗑️ Limpar Tudo
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default HistoryHeader;