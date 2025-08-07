import React from 'react';
import { saveChecklistPDF } from './pdfTemplate';

const TestItem9 = () => {
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
        observation: 'Faixas reflexivas em bom estado - TESTE ITEM 9'
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
        title: 'Teste Item 9 - Checklist de Verificações',
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
      alert('PDF gerado com sucesso! Verifique se o item 9 "Faixas Reflexivas" está visível.');
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      alert('Erro ao gerar PDF: ' + error.message);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Teste Específico - Item 9</h1>
      <p>Este teste verifica se o item 9 "Faixas Reflexivas" está aparecendo corretamente no PDF.</p>
      
      <div style={{ 
        marginBottom: '20px', 
        padding: '15px', 
        backgroundColor: '#fff3cd', 
        border: '1px solid #ffeaa7',
        borderRadius: '5px'
      }}>
        <h3>⚠️ Problema Reportado:</h3>
        <p>O item 9 "Faixas Reflexivas" estava desaparecendo na quebra de linha.</p>
      </div>
      
      <button 
        onClick={handleGeneratePDF}
        style={{
          padding: '10px 20px',
          backgroundColor: '#e74c3c',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          fontSize: '16px'
        }}
      >
        Gerar PDF - Teste Item 9
      </button>
      
      <div style={{ marginTop: '20px' }}>
        <h3>Verificações Específicas:</h3>
        <ul>
          <li>✅ Item 9 "Faixas Reflexivas" deve estar visível</li>
          <li>✅ Deve ter observação: "Faixas reflexivas em bom estado - TESTE ITEM 9"</li>
          <li>✅ Não deve ser cortado na quebra de página</li>
          <li>✅ Deve ter status "ok" marcado</li>
        </ul>
      </div>
      
      <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#d4edda', borderRadius: '5px' }}>
        <h4>Correções Implementadas:</h4>
        <ul>
          <li>✓ Aumentada margem de segurança para quebra de página</li>
          <li>✓ Calculada altura estimada para cada item (25px para básicos, 45px para visuais)</li>
          <li>✓ Melhorada lógica de detecção de fim de página</li>
          <li>✓ Aumentada margem de segurança para conclusão (100px)</li>
        </ul>
      </div>
    </div>
  );
};

export default TestItem9; 