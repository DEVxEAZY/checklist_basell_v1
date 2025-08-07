import React from 'react';

const HistoryTable = ({
  checklists,
  loading,
  selectedChecklists,
  onSelectChecklist,
  onSelectAll,
  onView,
  onLoad,
  onDelete
}) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('pt-BR');
  };

  const getStatusBadge = (status) => {
    const badges = {
      completed: { text: 'Concluído', class: 'status-completed' },
      in_progress: { text: 'Em Andamento', class: 'status-in-progress' },
      draft: { text: 'Rascunho', class: 'status-draft' }
    };
    
    const badge = badges[status] || badges.draft;
    return <span className={`status-badge ${badge.class}`}>{badge.text}</span>;
  };

  if (checklists.length === 0) {
    if (loading) {
      return (
        <div className="empty-state">
          <div className="empty-icon">⏳</div>
          <h3>Carregando checklists...</h3>
          <p>Aguarde enquanto carregamos os dados do Supabase.</p>
        </div>
      );
    }
    
    return (
      <div className="empty-state">
        <div className="empty-icon">📋</div>
        <h3>Nenhum checklist encontrado</h3>
        <p>Não há checklists salvos ou que correspondam aos filtros aplicados.</p>
      </div>
    );
  }

  return (
    <div className="history-table-container">
      <table className="history-table">
        <thead>
          <tr>
            <th className="checkbox-column">
              <input
                type="checkbox"
                checked={selectedChecklists.length === checklists.length}
                onChange={onSelectAll}
                className="checkbox"
              />
            </th>
            <th>Placa</th>
            <th>Modelo</th>
            <th>Motorista</th>
            <th>Inspetor</th>
            <th>Status</th>
            <th>Fotos</th>
            <th>Criado em</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {checklists.map((checklist) => (
            <tr key={checklist.id} className="table-row">
              <td>
                <input
                  type="checkbox"
                  checked={selectedChecklists.includes(checklist.id)}
                  onChange={() => onSelectChecklist(checklist.id)}
                  className="checkbox"
                />
              </td>
              <td className="plate-cell">
                {checklist.vehicle_plate || '-'}
              </td>
              <td className="model-cell">
                {checklist.vehicle_model || '-'}
              </td>
              <td>{checklist.driver_name || '-'}</td>
              <td>{checklist.inspector_name || '-'}</td>
              <td>{getStatusBadge(checklist.status)}</td>
              <td className="photos-cell">
                <span className="photo-count">{checklist.total_frames || 0}</span>
              </td>
              <td className="date-cell">
                {formatDate(checklist.createdAt)}
              </td>
              <td className="actions-cell">
                <div className="action-buttons">
                  <button
                    onClick={() => onView(checklist.id)}
                    className="btn btn-sm btn-outline"
                    title="Visualizar"
                  >
                    👁️
                  </button>
                  <button
                    onClick={() => onLoad(checklist.id)}
                    className="btn btn-sm btn-primary"
                    title="Carregar para Edição"
                  >
                    📝
                  </button>
                  <button
                    onClick={() => onDelete(checklist.id)}
                    className="btn btn-sm btn-danger"
                    title="Excluir"
                  >
                    🗑️
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default HistoryTable;