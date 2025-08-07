import React from 'react';
import { generateChecklistWithData } from './pdfTemplate';

// Exemplo de uso do template PDF do checklist
const ChecklistExample = () => {
  const handleGenerateChecklist = () => {
    // Dados do veículo
    const vehicleInfo = {
      plate: 'ABC-1234',
      model: 'Mercedes-Benz Actros 2651',
      driver: 'João Silva',
      date: new Date().toLocaleDateString('pt-BR')
    };

    // Opções do template
    const templateOptions = {
      title: 'Checklist de Verificações',
      subtitle: 'Relatório de Inspeção de Veículo',
      companyName: 'Transportadora XYZ Ltda',
      vehicleInfo: vehicleInfo,
      filename: `checklist_${vehicleInfo.plate}_${new Date().toISOString().slice(0, 10)}.pdf`
    };

    // Gerar e baixar o PDF
    generateChecklistWithData({}, templateOptions)
      .then(filename => {
        console.log('PDF gerado com sucesso:', filename);
      })
      .catch(error => {
        console.error('Erro ao gerar PDF:', error);
      });
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Exemplo de Checklist PDF</h2>
      <p>Este exemplo demonstra como gerar o template PDF do checklist de verificações.</p>
      
      <button 
        onClick={handleGenerateChecklist}
        style={{
          padding: '10px 20px',
          backgroundColor: '#2980b9',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          fontSize: '16px'
        }}
      >
        Gerar Checklist PDF
      </button>
      
      <div style={{ marginTop: '20px' }}>
        <h3>Funcionalidades do Template:</h3>
        <ul>
          <li><strong>Informações do Veículo:</strong> Placa, modelo, motorista e data</li>
          <li><strong>ETAPA 1 - Verificações Básicas:</strong> 9 itens com caixas Conforme/Não conforme/Não aplicável e observações</li>
          <li><strong>ETAPA 2 - Inspeções Visuais:</strong> 5 itens com área para mídia obrigatória</li>
          <li><strong>Conclusão:</strong> Área para conclusão geral e assinaturas</li>
        </ul>
        
        <h3>Itens do Checklist:</h3>
        <h4>Verificações Básicas (1-9):</h4>
        <ol>
          <li>Luzes e Sinalização</li>
          <li>Sirene de Ré</li>
          <li>Buzina e Pisca-Alerta</li>
          <li>Vazamentos</li>
          <li>EPIs</li>
          <li>Assoalho</li>
          <li>Fitas (Rabicho)</li>
          <li>Cintas e Catracas</li>
          <li>Faixas Reflexivas</li>
        </ol>
        
        <h4>Inspeções Visuais (10-14):</h4>
        <ol start="10">
          <li>Inspeção dos Pneus</li>
          <li>Inspeção do Assoalho</li>
          <li>Proteções de Borracha</li>
          <li>Inspeção das Lonas</li>
          <li>Inspeção do Teto</li>
        </ol>
      </div>
    </div>
  );
};

export default ChecklistExample; 