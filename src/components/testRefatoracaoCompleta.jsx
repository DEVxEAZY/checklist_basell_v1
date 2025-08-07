import React from 'react';
import { saveChecklistPDF } from './pdfTemplate';

const TestRefatoracaoCompleta = () => {
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
        observation: 'Cintas e catracas funcionando - REFATORAÇÃO COMPLETA'
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
        title: 'Refatoração Completa - Checklist de Verificações',
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
      alert('PDF gerado com sucesso! Verifique se todos os elementos estão funcionando corretamente.');
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      alert('Erro ao gerar PDF: ' + error.message);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Teste Refatoração Completa do PDF</h1>
      <p>Este teste verifica se a refatoração completa do layout do PDF está funcionando corretamente.</p>
      
      <div style={{ 
        marginBottom: '20px', 
        padding: '15px', 
        backgroundColor: '#e3f2fd', 
        border: '1px solid #2196f3',
        borderRadius: '5px'
      }}>
        <h3>🔄 Refatoração Completa Implementada:</h3>
        <ul>
          <li>✓ Sistema de coordenadas centralizado (currentY)</li>
          <li>✓ Funções modulares e reutilizáveis</li>
          <li>✓ Controle de quebra de página simplificado</li>
          <li>✓ Layout mais limpo e organizado</li>
          <li>✓ Melhor gerenciamento de espaço</li>
        </ul>
      </div>
      
      <button 
        onClick={handleGeneratePDF}
        style={{
          padding: '10px 20px',
          backgroundColor: '#2196f3',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          fontSize: '16px'
        }}
      >
        Gerar PDF - Refatoração Completa
      </button>
      
      <div style={{ marginTop: '20px' }}>
        <h3>Verificações Específicas:</h3>
        <ul>
          <li>✅ Todos os títulos devem aparecer corretamente</li>
          <li>✅ Item 8 "Cintas e Catracas" deve estar visível</li>
          <li>✅ Quebras de página devem ser suaves</li>
          <li>✅ Layout deve estar organizado e limpo</li>
          <li>✅ Observações devem estar presentes</li>
          <li>✅ Caixas de verificação devem estar alinhadas</li>
        </ul>
      </div>
      
      <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#fff3cd', borderRadius: '5px' }}>
        <h4>Principais Mudanças:</h4>
        <ul>
          <li>🔧 Sistema de coordenadas unificado com <code>currentY</code></li>
          <li>🔧 Funções modulares: <code>addChecklistItem</code>, <code>addVisualInspectionItem</code></li>
          <li>🔧 Controle simplificado de quebra de página</li>
          <li>🔧 Melhor organização do código</li>
          <li>🔧 Layout mais consistente</li>
        </ul>
      </div>
      
      <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
        <h4>Como Verificar:</h4>
        <ol>
          <li>Abra o PDF gerado</li>
          <li>Verifique se todas as seções estão presentes</li>
          <li>Confirme se os títulos aparecem corretamente</li>
          <li>Teste as quebras de página</li>
          <li>Verifique se o layout está limpo e organizado</li>
          <li>Confirme se todas as observações estão visíveis</li>
        </ol>
      </div>
    </div>
  );
};

export default TestRefatoracaoCompleta; 