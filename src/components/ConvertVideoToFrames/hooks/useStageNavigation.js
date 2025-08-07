import { useState, useEffect } from 'react';

export const useStageNavigation = (resetVisualInspections) => {
  const [currentStage, setCurrentStage] = useState(1);

  // Função para avançar para próxima etapa
  const nextStage = () => {
    if (currentStage < 5) {
      console.log('=== NAVEGANDO PARA PRÓXIMA ETAPA ===');
      console.log('Etapa atual:', currentStage);
      
      setCurrentStage(currentStage + 1);
      if (currentStage === 1) {
        // Reset completo das inspeções visuais ao navegar da Etapa 1 para Etapa 2
        resetVisualInspections();
        console.log('Avançando para Etapa 2, resetando inspeções visuais');
      }
    }
  };

  // Função para resetar para etapa 1
  const resetToFirstStage = () => {
    setCurrentStage(1);
  };

  // Debug: Verificar mudanças de etapa
  useEffect(() => {
    console.log('Etapa atual mudou para:', currentStage);
  }, [currentStage]);

  return {
    currentStage,
    nextStage,
    resetToFirstStage
  };
}; 