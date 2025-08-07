import React from 'react';

const HistoryFilters = ({
  searchTerm,
  setSearchTerm,
  filterStatus,
  setFilterStatus,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
  selectedCount,
  onDeleteMultiple
}) => {
  return (
    <div className="history-filters">
      <div className="filters-row">
        <div className="search-box">
          <input
            type="text"
            placeholder="Buscar por placa, modelo, motorista ou inspetor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <span className="search-icon">🔍</span>
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
            {sortOrder === 'asc' ? '↑' : '↓'}
          </button>
        </div>
      </div>
      
      {selectedCount > 0 && (
        <div className="selection-actions">
          <span className="selection-count">
            {selectedCount} item(s) selecionado(s)
          </span>
          <button
            onClick={onDeleteMultiple}
            className="btn btn-danger btn-sm"
          >
            🗑️ Excluir Selecionados
          </button>
        </div>
      )}
    </div>
  );
};

export default HistoryFilters;