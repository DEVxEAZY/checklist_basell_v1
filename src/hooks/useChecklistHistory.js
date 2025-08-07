import { useState, useEffect } from 'react';

export const useChecklistHistory = () => {
  const [checklists, setChecklists] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');

  // Load checklists from localStorage on mount
  useEffect(() => {
    const savedChecklists = localStorage.getItem('checklistHistory');
    if (savedChecklists) {
      try {
        const parsed = JSON.parse(savedChecklists);
        setChecklists(parsed);
      } catch (error) {
        console.error('Error loading checklist history:', error);
        setChecklists([]);
      }
    }
  }, []);

  // Save checklists to localStorage whenever checklists change
  useEffect(() => {
    localStorage.setItem('checklistHistory', JSON.stringify(checklists));
  }, [checklists]);

  // Save a new checklist
  const saveChecklist = (checklistData, vehicleInfo) => {
    const newChecklist = {
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      vehicleInfo: {
        plate: vehicleInfo.plate || '',
        model: vehicleInfo.model || '',
        driver: vehicleInfo.driver || '',
        inspector: vehicleInfo.inspector || ''
      },
      basicChecks: checklistData.basicChecks || [],
      visualInspections: checklistData.visualInspections || [],
      status: calculateStatus(checklistData.basicChecks, checklistData.visualInspections),
      totalFrames: checklistData.visualInspections?.reduce((total, inspection) => 
        total + (inspection.frames?.length || 0), 0) || 0
      totalVideos: checklistData.visualInspections?.filter(inspection => 
        inspection.videoData).length || 0
    };

    setChecklists(prev => [newChecklist, ...prev]);
    return newChecklist.id;
  };

  // Update an existing checklist
  const updateChecklist = (id, checklistData, vehicleInfo) => {
    setChecklists(prev => prev.map(checklist => 
      checklist.id === id 
        ? {
            ...checklist,
            updatedAt: new Date().toISOString(),
            vehicleInfo: {
              plate: vehicleInfo.plate || '',
              model: vehicleInfo.model || '',
              driver: vehicleInfo.driver || '',
              inspector: vehicleInfo.inspector || ''
            },
            basicChecks: checklistData.basicChecks || [],
            visualInspections: checklistData.visualInspections || [],
            status: calculateStatus(checklistData.basicChecks, checklistData.visualInspections),
            totalFrames: checklistData.visualInspections?.reduce((total, inspection) => 
              total + (inspection.frames?.length || 0), 0) || 0
            totalVideos: checklistData.visualInspections?.filter(inspection => 
              inspection.videoData).length || 0
          }
        : checklist
    ));
  };

  // Delete a checklist
  const deleteChecklist = (id) => {
    setChecklists(prev => prev.filter(checklist => checklist.id !== id));
  };

  // Delete multiple checklists
  const deleteMultipleChecklists = (ids) => {
    setChecklists(prev => prev.filter(checklist => !ids.includes(checklist.id)));
  };

  // Get a specific checklist by ID
  const getChecklistById = (id) => {
    return checklists.find(checklist => checklist.id === id);
  };

  // Calculate checklist status
  const calculateStatus = (basicChecks = [], visualInspections = []) => {
    const basicComplete = basicChecks.every(check => check.isCompleted);
    const visualComplete = visualInspections.every(inspection => inspection.isCompleted);
    
    if (basicComplete && visualComplete) return 'completed';
    if (basicChecks.some(check => check.isCompleted) || visualInspections.some(inspection => inspection.isCompleted)) return 'in_progress';
    return 'draft';
  };

  // Filter and sort checklists
  const getFilteredChecklists = () => {
    let filtered = checklists;

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(checklist => 
        checklist.vehicleInfo.plate.toLowerCase().includes(term) ||
        checklist.vehicleInfo.model.toLowerCase().includes(term) ||
        checklist.vehicleInfo.driver.toLowerCase().includes(term) ||
        checklist.vehicleInfo.inspector.toLowerCase().includes(term)
      );
    }

    // Apply status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(checklist => checklist.status === filterStatus);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'date':
          aValue = new Date(a.createdAt);
          bValue = new Date(b.createdAt);
          break;
        case 'plate':
          aValue = a.vehicleInfo.plate.toLowerCase();
          bValue = b.vehicleInfo.plate.toLowerCase();
          break;
        case 'driver':
          aValue = a.vehicleInfo.driver.toLowerCase();
          bValue = b.vehicleInfo.driver.toLowerCase();
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        default:
          aValue = a.createdAt;
          bValue = b.createdAt;
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  };

  // Get statistics
  const getStatistics = () => {
    const total = checklists.length;
    const completed = checklists.filter(c => c.status === 'completed').length;
    const inProgress = checklists.filter(c => c.status === 'in_progress').length;
    const drafts = checklists.filter(c => c.status === 'draft').length;
    const totalFrames = checklists.reduce((sum, c) => sum + c.totalFrames, 0);
    const totalVideos = checklists.reduce((sum, c) => sum + (c.totalVideos || 0), 0);

    return {
      total,
      completed,
      inProgress,
      drafts,
      totalFrames,
      totalVideos
    };
  };

  // Clear all checklists
  const clearAllChecklists = () => {
    setChecklists([]);
  };

  // Export checklists to JSON
  const exportChecklists = () => {
    const dataStr = JSON.stringify(checklists, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `checklist-history-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return {
    checklists: getFilteredChecklists(),
    allChecklists: checklists,
    searchTerm,
    setSearchTerm,
    filterStatus,
    setFilterStatus,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    saveChecklist,
    updateChecklist,
    deleteChecklist,
    deleteMultipleChecklists,
    getChecklistById,
    getStatistics,
    clearAllChecklists,
    exportChecklists
  };
};