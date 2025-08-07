import React from 'react';
import { generateChecklistWithData } from '../pdfTemplate';
import { PDF_OPTIONS } from './constants/inspectionData';

// Hooks
import { useBasicChecks } from './hooks/useBasicChecks';
import { useVisualInspections } from './hooks/useVisualInspections';
import { useVideoCapture } from './hooks/useVideoCapture';
import { useStageNavigation } from './hooks/useStageNavigation';

// Componentes
import BasicChecksStage from './components/BasicChecksStage';
import VisualInspectionsStage from './components/VisualInspectionsStage';
import ConfirmationPopup from './components/ConfirmationPopup';
import InspectionStatusPopup from './components/InspectionStatusPopup';

const ConvertVideoToFrames = () => {
  // Hooks
  const {
    basicChecks,
    vehicleInfo,
    updateBasicCheck,
    updateBasicCheckObservation,
    updateVehicleInfo,
    areBasicChecksComplete,
    getStatusStats,
    clearAllBasicChecks,
    completedBasicChecks
  } = useBasicChecks();

  const {
    visualInspections,
    currentInspection,
    currentInspectionData,
    addFrameToCurrentInspection,
    markInspectionAsComplete,
    resetCurrentInspection,
    nextInspection,
    resetVisualInspections,
    clearAllVisualInspections,
    totalFrames,
    completedVisualInspections
  } = useVisualInspections();

  const {
    currentStage,
    nextStage,
    resetToFirstStage
  } = useStageNavigation(resetVisualInspections);

  const {
    isCapturing,
    videoRef,
    canvasRef,
    startCapture,
    stopCapture,
    showRerecordPopup,
    showStatusPopup,
    handleRerecordConfirm,
    handleRerecordCancel,
    handleStatusConfirm,
    handleStatusCancel
  } = useVideoCapture(
    addFrameToCurrentInspection,
    (inspectionId, status) => markInspectionAsComplete(inspectionId || currentInspection, status),
    nextInspection,
    resetCurrentInspection
  );

  // Função 6: Gerar PDF com todos os dados
  const generatePDF = async () => {
    const allFrames = visualInspections.flatMap(inspection => inspection.frames);
    
    if (allFrames.length === 0 && !areBasicChecksComplete()) {
      alert('Nenhuma verificação documentada para gerar relatório');
      return;
    }

    try {
      // Preparar dados do checklist
      const checklistData = {
        basicChecks: basicChecks,
        visualInspections: visualInspections,
        allFrames: allFrames
      };

      // Configurar opções do template
      const templateOptions = {
        title: 'Checklist de Verificações BASELL',
        subtitle: 'Relatório de Inspeção de Veículo',
        companyName: 'BASELL',
        vehicleInfo: {
          plate: vehicleInfo.plate || 'ABC-1234', // Usar dados do usuário ou padrão
          model: vehicleInfo.model || 'Mercedes-Benz Actros 2651', // Usar dados do usuário ou padrão
          driver: vehicleInfo.driver || 'Motorista', // Usar dados do usuário ou padrão
          inspector: vehicleInfo.inspector || 'Inspetor(a)', // Usar dados do usuário ou padrão
          date: new Date().toLocaleDateString('pt-BR')
        },
        filename: `checklist_basell_${new Date().toISOString().slice(0, 10)}.pdf`
      };

      await generateChecklistWithData(checklistData, templateOptions);
      alert('Relatório de inspeção gerado com sucesso!');
    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
      alert('Erro ao gerar relatório. Verifique o console para mais detalhes.');
    }
  };

  // Função 7: Limpar todas as verificações
  const clearAllChecks = () => {
    console.log('=== LIMPANDO CHECKLIST COMPLETO ===');
    
    clearAllBasicChecks();
    clearAllVisualInspections();
    resetToFirstStage();
    
    console.log('Checklist limpo completamente');
  };

  return (
    <div className="checklist-container">
      <div className="checklist-header">
        <h1 className="checklist-title">Sistema BASELL</h1>
        <p className="checklist-subtitle">Checklist Digital de Inspeção Veicular</p>
      </div>

      <div className="checklist-content">
        {/* Renderizar conteúdo baseado na etapa atual */}
        {currentStage === 1 ? (
          <BasicChecksStage
            basicChecks={basicChecks}
            updateBasicCheck={updateBasicCheck}
            updateBasicCheckObservation={updateBasicCheckObservation}
            areBasicChecksComplete={areBasicChecksComplete}
            getStatusStats={getStatusStats}
            completedBasicChecks={completedBasicChecks}
            nextStage={nextStage}
            vehicleInfo={vehicleInfo}
            updateVehicleInfo={updateVehicleInfo}
          />
        ) : (
          <VisualInspectionsStage
            currentStage={currentStage}
            visualInspections={visualInspections}
            currentInspection={currentInspection}
            currentInspectionData={currentInspectionData}
            totalFrames={totalFrames}
            completedVisualInspections={completedVisualInspections}
            startCapture={startCapture}
            stopCapture={stopCapture}
            generatePDF={generatePDF}
            videoRef={videoRef}
            canvasRef={canvasRef}
            isCapturing={isCapturing}
          />
        )}

        {/* Botão Limpar Tudo */}
        <div className="action-buttons">
          <button onClick={clearAllChecks} className="action-btn secondary">
            Limpar Checklist
          </button>
        </div>
      </div>

      {/* Popup de Confirmação de Regravação */}
      <ConfirmationPopup
        isVisible={showRerecordPopup}
        onConfirm={handleRerecordConfirm}
        onCancel={handleRerecordCancel}
        title="Regravar Inspeção"
        message="Deseja regravar esta inspeção?"
        confirmText="Sim, Regravar"
        cancelText="Não, Continuar"
      />

      {/* Popup de Status da Inspeção */}
      <InspectionStatusPopup
        isVisible={showStatusPopup}
        onConfirm={handleStatusConfirm}
        onCancel={handleStatusCancel}
        inspectionName={currentInspectionData?.name || "Inspeção"}
        title="Status da Inspeção"
        message="Qual o status desta inspeção após a conclusão do vídeo?"
      />
    </div>
  );
};

export default ConvertVideoToFrames; 