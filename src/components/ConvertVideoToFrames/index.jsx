import React from 'react';
import ChecklistHistory from '../ChecklistHistory';
import { generateChecklistWithData } from '../pdfTemplate';
import { PDF_OPTIONS } from './constants/inspectionData';
import { useSupabaseChecklistHistory } from '../../hooks/useSupabaseChecklistHistory';

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
  const [currentView, setCurrentView] = React.useState('checklist'); // 'checklist' or 'history'
  const [loadedChecklistId, setLoadedChecklistId] = React.useState(null);
  
  // History hook
  const { 
    saveChecklist, 
    updateChecklist, 
    getChecklistById,
    loading 
  } = useSupabaseChecklistHistory();

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
    isRecording,
    recordedVideoBlob,
    videoRef,
    canvasRef,
    startCapture,
    stopCapture,
    downloadRecordedVideo,
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

  // Function to save current checklist
  const saveCurrentChecklist = async () => {
    if (loading) return;
    
    const checklistData = {
      basicChecks: basicChecks,
      visualInspections: visualInspections
    };

    try {
      if (loadedChecklistId) {
        // Update existing checklist
        await updateChecklist(loadedChecklistId, checklistData, vehicleInfo);
        alert('Checklist atualizado com sucesso!');
      } else {
        // Save new checklist
        const newId = await saveChecklist(checklistData, vehicleInfo);
        setLoadedChecklistId(newId);
        alert('Checklist salvo com sucesso!');
      }
    } catch (error) {
      console.error('Error saving checklist:', error);
      alert('Erro ao salvar checklist. Verifique sua conexão.');
    }
  };

  // Function to load checklist from history
  const loadChecklistFromHistory = async (checklist) => {
    try {
      // Get full checklist data with videos
      const fullChecklist = await getChecklistById(checklist.id);
      if (!fullChecklist) {
        alert('Erro ao carregar checklist');
        return;
      }
      
    // Load vehicle info
      Object.keys(fullChecklist.vehicleInfo).forEach(key => {
        updateVehicleInfo(key, fullChecklist.vehicleInfo[key]);
    });

    // Load basic checks
      fullChecklist.basicChecks.forEach(check => {
      if (check.isCompleted) {
        updateBasicCheck(check.id, check.status, check.observation);
      }
      if (check.observation) {
        updateBasicCheckObservation(check.id, check.observation);
      }
    });

      // Load visual inspections with videos
      // Note: Frames are not restored to avoid large data storage
    
      setLoadedChecklistId(fullChecklist.id);
    setCurrentView('checklist');
      alert('Checklist carregado com sucesso! Nota: As fotos individuais não são restauradas, mas os vídeos estão disponíveis.');
    } catch (error) {
      console.error('Error loading checklist:', error);
      alert('Erro ao carregar checklist');
    }
  };

  // Function to create new checklist
  const createNewChecklist = () => {
    clearAllChecks();
    setLoadedChecklistId(null);
    setCurrentView('checklist');
  };

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

  // Show history view
  if (currentView === 'history') {
    return (
      <ChecklistHistory
        onLoadChecklist={loadChecklistFromHistory}
        onBack={() => setCurrentView('checklist')}
      />
    );
  }

  return (
    <div className="checklist-container">
      <div className="checklist-header">
        <h1 className="checklist-title">Sistema BASELL</h1>
        <p className="checklist-subtitle">Checklist Digital de Inspeção Veicular</p>
        
        {/* Header Actions */}
        <div className="header-actions" style={{ 
          marginTop: 'var(--spacing-lg)', 
          display: 'flex', 
          gap: 'var(--spacing-md)', 
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          <button onClick={() => setCurrentView('history')} className="btn btn-outline">
            📋 Histórico
          </button>
          <button 
            onClick={saveCurrentChecklist} 
            disabled={loading}
            className="btn btn-primary"
          >
            {loading ? '⏳ Salvando...' : '💾 Salvar Checklist'}
          </button>
          <button onClick={createNewChecklist} className="btn btn-secondary">
            ➕ Novo Checklist
          </button>
        </div>
        
        {loadedChecklistId && (
          <div style={{ 
            marginTop: 'var(--spacing-sm)', 
            padding: 'var(--spacing-sm)', 
            backgroundColor: 'rgb(16 185 129 / 0.1)', 
            borderRadius: 'var(--radius-md)',
            textAlign: 'center'
          }}>
            <span style={{ color: 'var(--color-success)', fontSize: '0.875rem', fontWeight: '500' }}>
              ✅ Checklist carregado (ID: {loadedChecklistId.slice(-8)})
            </span>
          </div>
        )}
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
            downloadRecordedVideo={downloadRecordedVideo}
            generatePDF={generatePDF}
            videoRef={videoRef}
            canvasRef={canvasRef}
            isCapturing={isCapturing}
            isRecording={isRecording}
            recordedVideoBlob={recordedVideoBlob}
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