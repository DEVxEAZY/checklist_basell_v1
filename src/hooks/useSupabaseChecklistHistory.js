import { useState, useEffect } from 'react'
import { supabase, blobToBase64, base64ToBlob } from '../lib/supabase'

export const useSupabaseChecklistHistory = () => {
  const [checklists, setChecklists] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [sortBy, setSortBy] = useState('date')
  const [sortOrder, setSortOrder] = useState('desc')

  // Load checklists from Supabase
  const loadChecklists = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('checklists')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      setChecklists(data || [])
    } catch (error) {
      console.error('Error loading checklists:', error)
      alert('Erro ao carregar histórico de checklists')
    } finally {
      setLoading(false)
    }
  }

  // Load checklists on mount
  useEffect(() => {
    loadChecklists()
  }, [])

  // Save a new checklist with videos
  const saveChecklist = async (checklistData, vehicleInfo) => {
    setLoading(true)
    try {
      console.log('Saving checklist with data:', { checklistData, vehicleInfo })
      
      // Prepare checklist data
      const checklistRecord = {
        vehicle_plate: vehicleInfo.plate || '',
        vehicle_model: vehicleInfo.model || '',
        driver_name: vehicleInfo.driver || '',
        inspector_name: vehicleInfo.inspector || '',
        status: calculateStatus(checklistData.basicChecks, checklistData.visualInspections),
        basic_checks: checklistData.basicChecks || [],
        visual_inspections: checklistData.visualInspections?.map(inspection => ({
          ...inspection,
          videoData: null // Remove video data from main record
        })) || [],
        total_frames: checklistData.visualInspections?.reduce((total, inspection) => 
          total + (inspection.frames?.length || 0), 0) || 0,
        total_videos: checklistData.visualInspections?.filter(inspection => 
          inspection.videoData).length || 0
      }

      console.log('Checklist record to insert:', checklistRecord)

      // Insert checklist
      const { data: checklist, error: checklistError } = await supabase
        .from('checklists')
        .insert([checklistRecord])
        .select()
        .single()

      if (checklistError) {
        console.error('Checklist insert error:', checklistError)
        throw checklistError
      }

      console.log('Checklist inserted successfully:', checklist)

      // Save videos separately
      if (checklistData.visualInspections) {
        for (const inspection of checklistData.visualInspections) {
          if (inspection.videoData && inspection.videoData.blob) {
            try {
              // Convert blob to base64 for storage
              const base64Data = await blobToBase64(inspection.videoData.blob)
              console.log('Converting video for inspection:', inspection.name)
              
              const videoRecord = {
                checklist_id: checklist.id,
                inspection_id: inspection.id,
                inspection_name: inspection.name,
                video_data: base64Data,
                video_type: inspection.videoData.type || 'video/webm',
                video_size: inspection.videoData.size || 0,
                recorded_at: inspection.videoData.recordedAt || new Date().toISOString()
              }

              console.log('Video record to insert:', { 
                checklist_id: videoRecord.checklist_id,
                inspection_id: videoRecord.inspection_id,
                inspection_name: videoRecord.inspection_name,
                video_size: videoRecord.video_size
              })

              const { error: videoError } = await supabase
                .from('inspection_videos')
                .insert([videoRecord])

              if (videoError) {
                console.error('Video insert error for inspection:', inspection.name, videoError)
              } else {
                console.log('Video saved successfully for inspection:', inspection.name)
              }
            } catch (videoError) {
              console.error('Error processing video for inspection:', inspection.name, videoError)
            }
          }
        }
      }

      // Reload checklists
      await loadChecklists()
      
      return checklist.id
    } catch (error) {
      console.error('Error saving checklist:', error)
      
      // More detailed error message
      let errorMessage = 'Erro ao salvar checklist: '
      if (error.message) {
        errorMessage += error.message
      }
      if (error.details) {
        errorMessage += ' - Detalhes: ' + error.details
      }
      if (error.hint) {
        errorMessage += ' - Dica: ' + error.hint
      }
      
      alert(errorMessage)
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Update an existing checklist
  const updateChecklist = async (id, checklistData, vehicleInfo) => {
    setLoading(true)
    try {
      console.log('Updating checklist:', id, { checklistData, vehicleInfo })
      
      // Prepare updated checklist data
      const checklistRecord = {
        updated_at: new Date().toISOString(),
        vehicle_plate: vehicleInfo.plate || '',
        vehicle_model: vehicleInfo.model || '',
        driver_name: vehicleInfo.driver || '',
        inspector_name: vehicleInfo.inspector || '',
        status: calculateStatus(checklistData.basicChecks, checklistData.visualInspections),
        basic_checks: checklistData.basicChecks || [],
        visual_inspections: checklistData.visualInspections?.map(inspection => ({
          ...inspection,
          videoData: null // Remove video data from main record
        })) || [],
        total_frames: checklistData.visualInspections?.reduce((total, inspection) => 
          total + (inspection.frames?.length || 0), 0) || 0,
        total_videos: checklistData.visualInspections?.filter(inspection => 
          inspection.videoData).length || 0
      }

      console.log('Checklist record to update:', checklistRecord)

      // Update checklist
      const { error: checklistError } = await supabase
        .from('checklists')
        .update(checklistRecord)
        .eq('id', id)

      if (checklistError) {
        console.error('Checklist update error:', checklistError)
        throw checklistError
      }

      console.log('Checklist updated successfully')

      // Delete existing videos
      const { error: deleteError } = await supabase
        .from('inspection_videos')
        .delete()
        .eq('checklist_id', id)

      if (deleteError) {
        console.error('Error deleting old videos:', deleteError)
      }

      // Save new videos
      if (checklistData.visualInspections) {
        for (const inspection of checklistData.visualInspections) {
          if (inspection.videoData && inspection.videoData.blob) {
            try {
              // Convert blob to base64 for storage
              const base64Data = await blobToBase64(inspection.videoData.blob)
              
              const videoRecord = {
                checklist_id: id,
                inspection_id: inspection.id,
                inspection_name: inspection.name,
                video_data: base64Data,
                video_type: inspection.videoData.type || 'video/webm',
                video_size: inspection.videoData.size || 0,
                recorded_at: inspection.videoData.recordedAt || new Date().toISOString()
              }

              const { error: videoError } = await supabase
                .from('inspection_videos')
                .insert([videoRecord])

              if (videoError) {
                console.error('Error saving video for inspection:', inspection.name, videoError)
              }
            } catch (videoError) {
              console.error('Error processing video for inspection:', inspection.name, videoError)
            }
          }
        }
      }

      // Reload checklists
      await loadChecklists()
    } catch (error) {
      console.error('Error updating checklist:', error)
      
      // More detailed error message
      let errorMessage = 'Erro ao atualizar checklist: '
      if (error.message) {
        errorMessage += error.message
      }
      if (error.details) {
        errorMessage += ' - Detalhes: ' + error.details
      }
      if (error.hint) {
        errorMessage += ' - Dica: ' + error.hint
      }
      
      alert(errorMessage)
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Get a specific checklist by ID with videos
  const getChecklistById = async (id) => {
    try {
      console.log('Getting checklist by ID:', id)
      
      // Get checklist data
      const { data: checklist, error: checklistError } = await supabase
        .from('checklists')
        .select('*')
        .eq('id', id)
        .single()

      if (checklistError) {
        console.error('Error getting checklist:', checklistError)
        throw checklistError
      }

      console.log('Checklist retrieved:', checklist)

      // Get videos for this checklist
      const { data: videos, error: videosError } = await supabase
        .from('inspection_videos')
        .select('*')
        .eq('checklist_id', id)

      if (videosError) {
        console.error('Error getting videos:', videosError)
      } else {
        console.log('Videos retrieved:', videos?.length || 0, 'videos')
      }

      // Reconstruct checklist with videos
      const checklistWithVideos = {
        ...checklist,
        vehicleInfo: {
          plate: checklist.vehicle_plate,
          model: checklist.vehicle_model,
          driver: checklist.driver_name,
          inspector: checklist.inspector_name
        },
        basicChecks: checklist.basic_checks || [],
        visualInspections: (checklist.visual_inspections || []).map(inspection => {
          // Find corresponding video
          const video = videos?.find(v => v.inspection_id === inspection.id)
          
          if (video) {
            // Convert base64 back to blob
            const blob = base64ToBlob(video.video_data, video.video_type)
            
            return {
              ...inspection,
              videoData: {
                dataUrl: URL.createObjectURL(blob),
                blob: blob,
                size: video.video_size,
                type: video.video_type,
                recordedAt: video.recorded_at
              }
            }
          }
          
          return inspection
        })
      }

      return checklistWithVideos
    } catch (error) {
      console.error('Error getting checklist:', error)
      return null
    }
  }

  // Delete a checklist
  const deleteChecklist = async (id) => {
    setLoading(true)
    try {
      // Delete videos first (cascade should handle this, but being explicit)
      const { error: videosError } = await supabase
        .from('inspection_videos')
        .delete()
        .eq('checklist_id', id)

      if (videosError) {
        console.error('Error deleting videos:', videosError)
      }

      // Delete checklist
      const { error: checklistError } = await supabase
        .from('checklists')
        .delete()
        .eq('id', id)

      if (checklistError) throw checklistError

      // Reload checklists
      await loadChecklists()
    } catch (error) {
      console.error('Error deleting checklist:', error)
      alert('Erro ao excluir checklist: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  // Delete multiple checklists
  const deleteMultipleChecklists = async (ids) => {
    setLoading(true)
    try {
      // Delete videos first
      const { error: videosError } = await supabase
        .from('inspection_videos')
        .delete()
        .in('checklist_id', ids)

      if (videosError) {
        console.error('Error deleting videos:', videosError)
      }

      // Delete checklists
      const { error: checklistError } = await supabase
        .from('checklists')
        .delete()
        .in('id', ids)

      if (checklistError) throw checklistError

      // Reload checklists
      await loadChecklists()
    } catch (error) {
      console.error('Error deleting checklists:', error)
      alert('Erro ao excluir checklists: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  // Clear all checklists
  const clearAllChecklists = async () => {
    setLoading(true)
    try {
      // Delete all videos first
      const { error: videosError } = await supabase
        .from('inspection_videos')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000') // Delete all

      if (videosError) {
        console.error('Error deleting all videos:', videosError)
      }

      // Delete all checklists
      const { error: checklistError } = await supabase
        .from('checklists')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000') // Delete all

      if (checklistError) throw checklistError

      // Reload checklists
      await loadChecklists()
    } catch (error) {
      console.error('Error clearing all checklists:', error)
      alert('Erro ao limpar todos os checklists: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  // Calculate checklist status
  const calculateStatus = (basicChecks = [], visualInspections = []) => {
    const basicComplete = basicChecks.every(check => check.isCompleted)
    const visualComplete = visualInspections.every(inspection => inspection.isCompleted)
    
    if (basicComplete && visualComplete) return 'completed'
    if (basicChecks.some(check => check.isCompleted) || visualInspections.some(inspection => inspection.isCompleted)) return 'in_progress'
    return 'draft'
  }

  // Filter and sort checklists
  const getFilteredChecklists = () => {
    let filtered = checklists

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(checklist => 
        checklist.vehicle_plate.toLowerCase().includes(term) ||
        checklist.vehicle_model.toLowerCase().includes(term) ||
        checklist.driver_name.toLowerCase().includes(term) ||
        checklist.inspector_name.toLowerCase().includes(term)
      )
    }

    // Apply status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(checklist => checklist.status === filterStatus)
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue, bValue
      
      switch (sortBy) {
        case 'date':
          aValue = new Date(a.created_at)
          bValue = new Date(b.created_at)
          break
        case 'plate':
          aValue = a.vehicle_plate.toLowerCase()
          bValue = b.vehicle_plate.toLowerCase()
          break
        case 'driver':
          aValue = a.driver_name.toLowerCase()
          bValue = b.driver_name.toLowerCase()
          break
        case 'status':
          aValue = a.status
          bValue = b.status
          break
        default:
          aValue = a.created_at
          bValue = b.created_at
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

    return filtered
  }

  // Get statistics
  const getStatistics = () => {
    const total = checklists.length
    const completed = checklists.filter(c => c.status === 'completed').length
    const inProgress = checklists.filter(c => c.status === 'in_progress').length
    const drafts = checklists.filter(c => c.status === 'draft').length
    const totalFrames = checklists.reduce((sum, c) => sum + (c.total_frames || 0), 0)
    const totalVideos = checklists.reduce((sum, c) => sum + (c.total_videos || 0), 0)

    return {
      total,
      completed,
      inProgress,
      drafts,
      totalFrames,
      totalVideos
    }
  }

  // Export checklists to JSON
  const exportChecklists = async () => {
    try {
      const dataStr = JSON.stringify(checklists, null, 2)
      const dataBlob = new Blob([dataStr], { type: 'application/json' })
      const url = URL.createObjectURL(dataBlob)
      const link = document.createElement('a')
      link.href = url
      link.download = `checklist-history-${new Date().toISOString().slice(0, 10)}.json`
      link.click()
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error exporting checklists:', error)
      alert('Erro ao exportar checklists')
    }
  }

  return {
    checklists: getFilteredChecklists(),
    allChecklists: checklists,
    loading,
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
    exportChecklists,
    loadChecklists
  }
}