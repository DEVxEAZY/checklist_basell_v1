import { useState, useEffect } from 'react';
import { VISUAL_INSPECTIONS_DATA } from '../constants/inspectionData';

export const useVisualInspections = () => {
  const [visualInspections, setVisualInspections] = useState(VISUAL_INSPECTIONS_DATA);
  const [currentInspection, setCurrentInspection] = useState(1);

  // Função auxiliar para resetar inspeções visuais
  const resetVisualInspectionsState = () => {
    return VISUAL_INSPECTIONS_DATA;
  };

  // Função para adicionar frame à inspeção atual
  const addFrameToCurrentInspection = (frame) => {
    setVisualInspections(prev => prev.map(inspection => 
      inspection.id === currentInspection 
        ? { ...inspection, frames: [...inspection.frames, frame] }
        : inspection
    ));
  };

  // Função para marcar inspeção como completa com status
  const markInspectionAsComplete = (inspectionId, status = 'ok', videoBlob = null) => {
    console.log('=== MARKING INSPECTION AS COMPLETE ===')
    console.log('Inspection ID:', inspectionId)
    console.log('Status:', status)
    console.log('Video blob provided:', !!videoBlob)
    if (videoBlob) {
      console.log('Video blob details:', {
        size: videoBlob.size,
        type: videoBlob.type,
        constructor: videoBlob.constructor.name
      })
    }
    
    setVisualInspections(prev => {
      const updated = prev.map(inspection => 
        inspection.id === inspectionId 
          ? { 
              ...inspection, 
              isCompleted: true, 
              status: status,
              videoData: videoBlob ? {
                dataUrl: URL.createObjectURL(videoBlob),
                blob: videoBlob,
                size: videoBlob.size,
                type: videoBlob.type,
                recordedAt: new Date().toISOString()
              } : null
            }
          : inspection
      );
      
      // Log the updated inspection
      const updatedInspection = updated.find(i => i.id === inspectionId)
      console.log('Updated inspection:', {
        id: updatedInspection?.id,
        name: updatedInspection?.name,
        isCompleted: updatedInspection?.isCompleted,
        status: updatedInspection?.status,
        hasVideoData: !!updatedInspection?.videoData,
        videoDataDetails: updatedInspection?.videoData ? {
          hasBlob: !!updatedInspection.videoData.blob,
          size: updatedInspection.videoData.size,
          type: updatedInspection.videoData.type
        } : null
      })
      
      return updated;
    });
  };

  // Função para resetar inspeção atual (para regravar)
  const resetCurrentInspection = () => {
    setVisualInspections(prev => prev.map(inspection => 
      inspection.id === currentInspection 
        ? { ...inspection, frames: [], isCompleted: false, videoData: null }
        : inspection
    ));
  };

  // Função para avançar para próxima inspeção
  const nextInspection = () => {
    if (currentInspection < 5) {
      setCurrentInspection(currentInspection + 1);
    }
  };

  // Função para voltar para inspeção anterior
  const previousInspection = () => {
    if (currentInspection > 1) {
      setCurrentInspection(currentInspection - 1);
    }
  };

  // Função para resetar inspeções visuais
  const resetVisualInspections = () => {
    const resetInspections = resetVisualInspectionsState();
    setVisualInspections(resetInspections);
    setCurrentInspection(1);
  };

  // Função para limpar todas as inspeções
  const clearAllVisualInspections = () => {
    const resetInspections = resetVisualInspectionsState();
    setVisualInspections(resetInspections);
    setCurrentInspection(1);
  };

  // Função para definir inspeção atual
  const setCurrentInspectionById = (id) => {
    setCurrentInspection(id);
  };

  // Calcular estatísticas
  const totalFrames = visualInspections.reduce((total, inspection) => total + inspection.frames.length, 0);
  const completedVisualInspections = visualInspections.filter(inspection => inspection.isCompleted).length;
  const currentInspectionData = visualInspections.find(inspection => inspection.id === currentInspection);

  // Debug: Verificar estado inicial
  useEffect(() => {
    console.log('Estado inicial das inspeções visuais:', visualInspections);
  }, []);

  // Debug: Verificar mudanças nas inspeções visuais
  useEffect(() => {
    console.log('Estado atual das inspeções visuais:', visualInspections);
  }, [visualInspections]);

  return {
    visualInspections,
    currentInspection,
    currentInspectionData,
    addFrameToCurrentInspection,
    markInspectionAsComplete,
    resetCurrentInspection,
    nextInspection,
    previousInspection,
    resetVisualInspections,
    clearAllVisualInspections,
    setCurrentInspectionById,
    totalFrames,
    completedVisualInspections
  };
}; 