import React, { useState } from 'react';
import { useSupabaseChecklistHistory } from '../../hooks/useSupabaseChecklistHistory';
import HistoryHeader from './components/HistoryHeader';
import HistoryFilters from './components/HistoryFilters';
import HistoryTable from './components/HistoryTable';
import HistoryStats from './components/HistoryStats';
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
  } = useChecklistHistory();

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
  const handleViewChecklist = (id) => {
    const checklist = getChecklistById(id);
    setViewingChecklist(checklist);
  };

  // Handle load checklist for editing
  const handleLoadChecklist = (id) => {
    const checklist = getChecklistById(id);
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
    <div className="history-container">
      <HistoryHeader
        onBack={onBack}
        onExport={exportChecklists}
        onClearAll={handleClearAll}
        hasChecklists={checklists.length > 0}
      />

      <HistoryStats statistics={statistics} />

      <HistoryFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        sortBy={sortBy}
        setSortBy={setSortBy}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        selectedCount={selectedChecklists.length}
        onDeleteMultiple={handleDeleteMultiple}
      />

      <HistoryTable
        checklists={checklists}
        selectedChecklists={selectedChecklists}
        onSelectChecklist={handleSelectChecklist}
        onSelectAll={handleSelectAll}
        onView={handleViewChecklist}
        onLoad={handleLoadChecklist}
        onDelete={handleDeleteSingle}
      />

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