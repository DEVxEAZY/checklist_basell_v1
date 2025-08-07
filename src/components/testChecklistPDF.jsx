import React from 'react';
import { saveChecklistPDF } from './pdfTemplate';

const TestChecklistPDF = () => {
  const testData = {
    basicChecks: [
      {
        name: 'Luzes e Sinalização',
        description: 'Funcionamento de lanternas de frio, ré, faróis e setas',
        status: 'ok',
        observation: 'Todas as luzes funcionando corretamente'
      },
      {
        name: 'Sirene de Ré',
        description: 'Verificação do funcionamento da sirene',
        status: 'not_ok',
        observation: 'Sirene com defeito'
      },
      {
        name: 'Buzina e Pisca-Alerta',
        description: 'Teste de funcionamento de buzina e pisca-alerta',
        status: 'ok',
        observation: 'Funcionando normalmente'
      },
      {
        name: 'Vazamentos',
        description: 'Verificação de ausência de vazamento de óleo',
        status: 'ok',
        observation: 'Nenhum vazamento detectado'
      },
      {
        name: 'EPIs',
        description: 'Confirmação do uso obrigatório dos equipamentos de proteção',
        status: 'ok',
        observation: 'Todos os EPIs em uso'
      },
      {
        name: 'Assoalho',
        description: 'Avaliação das condições gerais do assoalho',
        status: 'na',
        observation: 'Não aplicável neste veículo'
      },
      {
        name: 'Fitas (Rabicho)',
        description: 'Inspeção do estado das fitas de amarração',
        status: 'ok',
        observation: 'Fitas em bom estado'
      },
      {
        name: 'Cintas e Catracas',
        description: 'Verificação de cintas e catracas (fixa e móvel)',
        status: 'ok',
        observation: 'Cintas e catracas funcionando'
      },
      {
        name: 'Faixas Reflexivas',
        description: 'Avaliação das condições das faixas reflexivas',
        status: 'ok',
        observation: 'Faixas reflexivas em bom estado'
      }
    ],
    visualInspections: [
      {
        name: 'Inspeção dos Pneus',
        description: 'Verificação visual completa com documentação',
        status: 'ok',
        observation: 'Pneus em bom estado'
      },
      {
        name: 'Inspeção do Assoalho',
        description: 'Verificação visual detalhada com mídia',
        status: 'ok',
        observation: 'Assoalho em condições adequadas'
      },
      {
        name: 'Proteções de Borracha',
        description: 'Inspeção bilateral (lado direito e esquerdo)',
        status: 'ok',
        observation: 'Proteções em bom estado'
      },
      {
        name: 'Inspeção das Lonas',
        description: 'Verificação bilateral das lonas',
        status: 'ok',
        observation: 'Lonas em condições adequadas'
      },
      {
        name: 'Inspeção do Teto',
        description: 'Avaliação completa das condições do teto',
        status: 'ok',
        observation: 'Teto em bom estado'
      }
    ]
  };

  const handleGeneratePDF = async () => {
    try {
      const options = {
        title: 'Checklist de Verificações',
        subtitle: 'Relatório de Inspeção de Veículo',
        companyName: 'Empresa Teste',
        vehicleInfo: {
          plate: 'ABC-1234',
          model: 'Caminhão 3/4',
          driver: 'João Silva',
          date: new Date().toLocaleDateString('pt-BR')
        },
        pageOrientation: 'portrait'
      };

      await saveChecklistPDF(testData, options);
      alert('PDF gerado com sucesso! Verifique se não há sobreposições de texto.');
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      alert('Erro ao gerar PDF: ' + error.message);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Teste do Layout do PDF</h1>
      <p>Este teste verifica se o layout do PDF está funcionando corretamente sem sobreposições de texto.</p>
      
      <button 
        onClick={handleGeneratePDF}
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
        Gerar PDF de Teste
      </button>
      
      <div style={{ marginTop: '20px' }}>
        <h3>Dados de Teste Incluídos:</h3>
        <ul>
          <li>9 verificações básicas com diferentes status (ok, not_ok, na)</li>
          <li>5 inspeções visuais</li>
          <li>Informações do veículo</li>
          <li>Observações para cada item</li>
        </ul>
      </div>
      
      <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
        <h4>Verificações a Fazer no PDF Gerado:</h4>
        <ul>
          <li>✓ Texto não deve sobrepor as caixas de verificação</li>
          <li>✓ Caixas devem estar alinhadas à direita</li>
          <li>✓ Descrições devem quebrar linha adequadamente</li>
          <li>✓ Espaçamento entre itens deve ser adequado</li>
          <li>✓ Observações devem estar em linhas separadas</li>
        </ul>
      </div>
    </div>
  );
};

export default TestChecklistPDF; 