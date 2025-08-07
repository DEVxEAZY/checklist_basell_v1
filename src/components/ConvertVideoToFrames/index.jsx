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
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>Sistema BASELL - Checklist Digital</h1>

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
      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <button 
          onClick={clearAllChecks} 
          style={{
            padding: '10px 20px',
            backgroundColor: '#607D8B',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Limpar Checklist Completo
        </button>
        <button 
          onClick={() => {
            console.log('=== DEBUG INSPEÇÕES VISUAIS ===');
            console.log('Estado atual das inspeções visuais:', visualInspections);
            console.log('Inspeção atual:', currentInspection);
            console.log('Etapa atual:', currentStage);
            alert('Verifique o console para debug das inspeções visuais');
          }}
          style={{
            padding: '10px 20px',
            marginLeft: '10px',
            backgroundColor: '#FF5722',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Debug Inspeções Visuais
        </button>
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