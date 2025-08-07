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
      completed: { 
        text: 'Concluído', 
        class: 'status-completed',
        icon: '✅'
      },
      in_progress: { 
        text: 'Em Andamento', 
        class: 'status-in-progress',
        icon: '⏳'
      },
      draft: { 
        text: 'Rascunho', 
        class: 'status-draft',
        icon: '📝'
      }
    };
    
    const badge = badges[status] || badges.draft;
    return (
      <span className={`status-badge ${badge.class}`}>
        <span className="status-icon">{badge.icon}</span>
        {badge.text}
      </span>
    );
  };

  const getCompletionPercentage = (checklist) => {
    const basicChecksCompleted = checklist.basic_checks?.filter(check => check.isCompleted).length || 0;
    const visualInspectionsCompleted = checklist.visual_inspections?.filter(inspection => inspection.isCompleted).length || 0;
    const totalItems = 14; // 9 basic + 5 visual
    const completedItems = basicChecksCompleted + visualInspectionsCompleted;
    return Math.round((completedItems / totalItems) * 100);
  };

  if (checklists.length === 0) {
    if (loading) {
      return (
        <div className="empty-state loading">
          <div className="loading-spinner"></div>
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
        <div className="empty-actions">
          <button className="btn btn-primary">
            ➕ Criar Primeiro Checklist
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="history-table-container">
      {/* Cards View for Mobile */}
      <div className="history-cards-mobile">
        {checklists.map((checklist) => {
          const completionPercentage = getCompletionPercentage(checklist);
          
          return (
            <div key={checklist.id} className="history-card-mobile">
              <div className="card-header-mobile">
                <div className="card-checkbox-mobile">
                  <input
                    type="checkbox"
                    checked={selectedChecklists.includes(checklist.id)}
                    onChange={() => onSelectChecklist(checklist.id)}
                    className="checkbox"
                  />
                </div>
                <div className="card-status-mobile">
                  {getStatusBadge(checklist.status)}
                </div>
              </div>
              
              <div className="card-content-mobile">
                <div className="card-main-info">
                  <h4 className="card-plate">{checklist.vehicle_plate || 'Sem Placa'}</h4>
                  <p className="card-model">{checklist.vehicle_model || 'Modelo não informado'}</p>
                </div>
                
                <div className="card-details">
                  <div className="detail-item">
                    <span className="detail-label">Motorista:</span>
                    <span className="detail-value">{checklist.driver_name || '-'}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Inspetor:</span>
                    <span className="detail-value">{checklist.inspector_name || '-'}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Criado:</span>
                    <span className="detail-value">{formatDate(checklist.createdAt)}</span>
                  </div>
                </div>
                
                <div className="card-progress">
                  <div className="progress-info">
                    <span className="progress-label">Progresso</span>
                    <span className="progress-percentage">{completionPercentage}%</span>
                  </div>
                  <div className="progress-bar-mobile">
                    <div 
                      className="progress-fill-mobile" 
                      style={{ width: `${completionPercentage}%` }}
                    />
                  </div>
                </div>
                
                <div className="card-stats">
                  <div className="stat-item-mobile">
                    <span className="stat-icon">📸</span>
                    <span className="stat-value">{checklist.total_frames || 0}</span>
                    <span className="stat-label">Fotos</span>
                  </div>
                  <div className="stat-item-mobile">
                    <span className="stat-icon">🎥</span>
                    <span className="stat-value">{checklist.total_videos || 0}</span>
                    <span className="stat-label">Vídeos</span>
                  </div>
                </div>
              </div>
              
              <div className="card-actions-mobile">
                <button
                  onClick={() => onView(checklist.id)}
                  className="action-btn-mobile view"
                  title="Visualizar Detalhes"
                >
                  <span className="action-icon">👁️</span>
                  <span className="action-text">Ver</span>
                </button>
                <button
                  onClick={() => onLoad(checklist.id)}
                  className="action-btn-mobile edit"
                  title="Carregar para Edição"
                >
                  <span className="action-icon">📝</span>
                  <span className="action-text">Editar</span>
                </button>
                <button
                  onClick={() => onDelete(checklist.id)}
                  className="action-btn-mobile delete"
                  title="Excluir"
                >
                  <span className="action-icon">🗑️</span>
                  <span className="action-text">Excluir</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Table View for Desktop */}
      <div className="history-table-desktop">
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
              <th>Status</th>
              <th>Veículo</th>
              <th>Motorista</th>
              <th>Inspetor</th>
              <th>Progresso</th>
              <th>Mídia</th>
              <th>Criado em</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {checklists.map((checklist) => {
              const completionPercentage = getCompletionPercentage(checklist);
              
              return (
                <tr key={checklist.id} className="table-row">
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedChecklists.includes(checklist.id)}
                      onChange={() => onSelectChecklist(checklist.id)}
                      className="checkbox"
                    />
                  </td>
                  <td>
                    {getStatusBadge(checklist.status)}
                  </td>
                  <td className="vehicle-cell">
                    <div className="vehicle-info">
                      <div className="plate">{checklist.vehicle_plate || 'Sem Placa'}</div>
                      <div className="model">{checklist.vehicle_model || 'Modelo não informado'}</div>
                    </div>
                  </td>
                  <td>{checklist.driver_name || '-'}</td>
                  <td>{checklist.inspector_name || '-'}</td>
                  <td className="progress-cell">
                    <div className="progress-container">
                      <div className="progress-bar-desktop">
                        <div 
                          className="progress-fill-desktop" 
                          style={{ width: `${completionPercentage}%` }}
                        />
                      </div>
                      <span className="progress-text">{completionPercentage}%</span>
                    </div>
                  </td>
                  <td className="media-cell">
                    <div className="media-stats">
                      <span className="media-item">
                        <span className="media-icon">📸</span>
                        {checklist.total_frames || 0}
                      </span>
                      <span className="media-item">
                        <span className="media-icon">🎥</span>
                        {checklist.total_videos || 0}
                      </span>
                    </div>
                  </td>
                  <td className="date-cell">
                    {formatDate(checklist.createdAt)}
                  </td>
                  <td className="actions-cell">
                    <div className="action-buttons-desktop">
                      <button
                        onClick={() => onView(checklist.id)}
                        className="btn btn-sm btn-outline"
                        title="Visualizar Detalhes"
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
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HistoryTable;