import React, { useState } from 'react';
import { useSupabaseChecklistHistory } from '../../hooks/useSupabaseChecklistHistory';
import ChecklistViewer from './components/ChecklistViewer';
import ConfirmDialog from './components/ConfirmDialog';

const ChecklistHistory = ({ onLoadChecklist, onBack }) => {
  const {
    checklists,
    loading,
    searchTerm,
    setSearchTerm,
    filterStatus,
    setFilterStatus,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    deleteChecklist,
    deleteMultipleChecklists,
    getChecklistById,
    getStatistics,
    clearAllChecklists,
    exportChecklists
  } = useSupabaseChecklistHistory();

  const [selectedChecklists, setSelectedChecklists] = useState([]);
  const [viewingChecklist, setViewingChecklist] = useState(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);

  // Handle single checklist selection
  const handleSelectChecklist = (id) => {
    setSelectedChecklists(prev => 
      prev.includes(id) 
        ? prev.filter(checklistId => checklistId !== id)
        : [...prev, id]
    );
  };

  // Handle select all checklists
  const handleSelectAll = () => {
    if (selectedChecklists.length === checklists.length) {
      setSelectedChecklists([]);
    } else {
      setSelectedChecklists(checklists.map(c => c.id));
    }
  };

  // Handle delete single checklist
  const handleDeleteSingle = (id) => {
    setConfirmAction({
      type: 'delete_single',
      id,
      message: 'Tem certeza que deseja excluir este checklist?'
    });
    setShowConfirmDialog(true);
  };

  // Handle delete multiple checklists
  const handleDeleteMultiple = () => {
    if (selectedChecklists.length === 0) return;
    
    setConfirmAction({
      type: 'delete_multiple',
      ids: selectedChecklists,
      message: `Tem certeza que deseja excluir ${selectedChecklists.length} checklist(s)?`
    });
    setShowConfirmDialog(true);
  };

  // Handle clear all checklists
  const handleClearAll = () => {
    setConfirmAction({
      type: 'clear_all',
      message: 'Tem certeza que deseja excluir TODOS os checklists? Esta ação não pode ser desfeita.'
    });
    setShowConfirmDialog(true);
  };

  // Handle view checklist
  const handleViewChecklist = async (id) => {
    const checklist = await getChecklistById(id);
    setViewingChecklist(checklist);
  };

  // Handle load checklist for editing
  const handleLoadChecklist = async (id) => {
    const checklist = await getChecklistById(id);
    if (checklist && onLoadChecklist) {
      onLoadChecklist(checklist);
    }
  };

  // Handle confirm dialog
  const handleConfirm = () => {
    if (!confirmAction) return;

    switch (confirmAction.type) {
      case 'delete_single':
        deleteChecklist(confirmAction.id);
        break;
      case 'delete_multiple':
        deleteMultipleChecklists(confirmAction.ids);
        setSelectedChecklists([]);
        break;
      case 'clear_all':
        clearAllChecklists();
        setSelectedChecklists([]);
        break;
    }

    setShowConfirmDialog(false);
    setConfirmAction(null);
  };

  // Handle cancel dialog
  const handleCancel = () => {
    setShowConfirmDialog(false);
    setConfirmAction(null);
  };

  const statistics = getStatistics();

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get status info
  const getStatusInfo = (status) => {
    const statusMap = {
      completed: { text: 'Concluído', color: '#10b981', icon: '✅' },
      in_progress: { text: 'Em Andamento', color: '#f59e0b', icon: '⏳' },
      draft: { text: 'Rascunho', color: '#6b7280', icon: '📝' }
    };
    return statusMap[status] || statusMap.draft;
  };

  // Get completion percentage
  const getCompletionPercentage = (checklist) => {
    const basicChecksCompleted = checklist.basic_checks?.filter(check => check.isCompleted).length || 0;
    const visualInspectionsCompleted = checklist.visual_inspections?.filter(inspection => inspection.isCompleted).length || 0;
    const totalItems = 14; // 9 basic + 5 visual
    const completedItems = basicChecksCompleted + visualInspectionsCompleted;
    return Math.round((completedItems / totalItems) * 100);
  };

  if (viewingChecklist) {
    return (
      <ChecklistViewer
        checklist={viewingChecklist}
        onBack={() => setViewingChecklist(null)}
        onLoad={() => handleLoadChecklist(viewingChecklist.id)}
      />
    );
  }

  return (
    <div className="history-page">
      {/* Header */}
      <div className="history-header">
        <button onClick={onBack} className="back-button">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="m15 18-6-6 6-6"/>
          </svg>
          Voltar
        </button>
        
        <div className="header-content">
          <h1>Histórico de Checklists</h1>
          <p>Gerencie todos os checklists salvos</p>
        </div>

        <div className="header-actions">
          {checklists.length > 0 && (
            <>
              <button onClick={exportChecklists} className="btn-secondary">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="7,10 12,15 17,10"/>
                  <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                Exportar
              </button>
              <button onClick={handleClearAll} className="btn-danger">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="3,6 5,6 21,6"/>
                  <path d="m19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"/>
                </svg>
                Limpar Tudo
              </button>
            </>
          )}
        </div>
      </div>

      {/* Statistics */}
      <div className="stats-section">
        <div className="stat-card">
          <div className="stat-icon total">📋</div>
          <div className="stat-content">
            <div className="stat-number">{statistics.total}</div>
            <div className="stat-label">Total</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon completed">✅</div>
          <div className="stat-content">
            <div className="stat-number">{statistics.completed}</div>
            <div className="stat-label">Concluídos</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon in-progress">⏳</div>
          <div className="stat-content">
            <div className="stat-number">{statistics.inProgress}</div>
            <div className="stat-label">Em Andamento</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon draft">📝</div>
          <div className="stat-content">
            <div className="stat-number">{statistics.drafts}</div>
            <div className="stat-label">Rascunhos</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="search-container">
          <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            type="text"
            placeholder="Buscar por placa, modelo, motorista..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-controls">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="filter-select"
          >
            <option value="all">Todos os Status</option>
            <option value="completed">Concluídos</option>
            <option value="in_progress">Em Andamento</option>
            <option value="draft">Rascunhos</option>
          </select>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="filter-select"
          >
            <option value="date">Data</option>
            <option value="plate">Placa</option>
            <option value="driver">Motorista</option>
            <option value="status">Status</option>
          </select>
          
          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="sort-button"
            title={`Ordenar ${sortOrder === 'asc' ? 'Decrescente' : 'Crescente'}`}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {sortOrder === 'asc' ? (
                <path d="m3 16 4 4 4-4M7 20V4"/>
              ) : (
                <path d="m3 8 4-4 4 4M7 4v16"/>
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Selection Actions */}
      {selectedChecklists.length > 0 && (
        <div className="selection-actions">
          <span className="selection-count">
            {selectedChecklists.length} item(s) selecionado(s)
          </span>
          <button onClick={handleDeleteMultiple} className="btn-danger-small">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="3,6 5,6 21,6"/>
              <path d="m19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"/>
            </svg>
            Excluir Selecionados
          </button>
        </div>
      )}

      {/* Content */}
      <div className="content-section">
        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <h3>Carregando checklists...</h3>
            <p>Aguarde enquanto carregamos os dados.</p>
          </div>
        ) : checklists.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <h3>Nenhum checklist encontrado</h3>
            <p>Não há checklists salvos ou que correspondam aos filtros aplicados.</p>
            <button onClick={onBack} className="btn-primary">
              Criar Primeiro Checklist
            </button>
          </div>
        ) : (
          <div className="checklist-grid">
            {checklists.map((checklist) => {
              const statusInfo = getStatusInfo(checklist.status);
              const completionPercentage = getCompletionPercentage(checklist);
              
              return (
                <div key={checklist.id} className="checklist-card">
                  <div className="card-header">
                    <input
                      type="checkbox"
                      checked={selectedChecklists.includes(checklist.id)}
                      onChange={() => handleSelectChecklist(checklist.id)}
                      className="card-checkbox"
                    />
                    <div className="status-badge" style={{ backgroundColor: statusInfo.color }}>
                      <span className="status-icon">{statusInfo.icon}</span>
                      <span className="status-text">{statusInfo.text}</span>
                    </div>
                  </div>

                  <div className="card-content">
                    <div className="vehicle-info">
                      <h3 className="vehicle-plate">{checklist.vehicle_plate || 'Sem Placa'}</h3>
                      <p className="vehicle-model">{checklist.vehicle_model || 'Modelo não informado'}</p>
                    </div>

                    <div className="details-grid">
                      <div className="detail-item">
                        <span className="detail-label">Motorista</span>
                        <span className="detail-value">{checklist.driver_name || '-'}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Inspetor</span>
                        <span className="detail-value">{checklist.inspector_name || '-'}</span>
                      </div>
                    </div>

                    <div className="progress-section">
                      <div className="progress-header">
                        <span className="progress-label">Progresso</span>
                        <span className="progress-percentage">{completionPercentage}%</span>
                      </div>
                      <div className="progress-bar">
                        <div 
                          className="progress-fill" 
                          style={{ width: `${completionPercentage}%` }}
                        />
                      </div>
                    </div>

                    <div className="media-stats">
                      <div className="media-item">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                          <circle cx="12" cy="13" r="4"/>
                        </svg>
                        <span>{checklist.total_frames || 0} fotos</span>
                      </div>
                      <div className="media-item">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polygon points="23,7 16,12 23,17 23,7"/>
                          <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
                        </svg>
                        <span>{checklist.total_videos || 0} vídeos</span>
                      </div>
                    </div>

                    <div className="date-info">
                      <span className="date-label">Criado em:</span>
                      <span className="date-value">{formatDate(checklist.created_at)}</span>
                    </div>
                  </div>

                  <div className="card-actions">
                    <button
                      onClick={() => handleViewChecklist(checklist.id)}
                      className="action-btn view"
                      title="Visualizar"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                      Ver
                    </button>
                    <button
                      onClick={() => handleLoadChecklist(checklist.id)}
                      className="action-btn edit"
                      title="Editar"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                      </svg>
                      Editar
                    </button>
                    <button
                      onClick={() => handleDeleteSingle(checklist.id)}
                      className="action-btn delete"
                      title="Excluir"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="3,6 5,6 21,6"/>
                        <path d="m19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"/>
                      </svg>
                      Excluir
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <ConfirmDialog
        isVisible={showConfirmDialog}
        message={confirmAction?.message || ''}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </div>
  );
};

export default ChecklistHistory;