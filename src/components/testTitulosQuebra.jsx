import React from 'react';
import { saveChecklistPDF } from './pdfTemplate';

const TestTitulosQuebra = () => {
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
        observation: 'Cintas e catracas funcionando - TESTE TÍTULO QUEBRA'
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
        title: 'Teste Títulos Quebra - Checklist de Verificações',
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
      alert('PDF gerado com sucesso! Verifique se todos os títulos estão visíveis, especialmente o item 8 "Cintas e Catracas" na quebra de página.');
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      alert('Erro ao gerar PDF: ' + error.message);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Teste Títulos em Quebra de Página</h1>
      <p>Este teste verifica se os títulos dos itens estão aparecendo corretamente quando há quebra de página.</p>
      
      <div style={{ 
        marginBottom: '20px', 
        padding: '15px', 
        backgroundColor: '#fff3cd', 
        border: '1px solid #ffeaa7',
        borderRadius: '5px'
      }}>
        <h3>⚠️ Problema Reportado:</h3>
        <p>O título do item 8 "Cintas e Catracas" estava desaparecendo quando era o primeiro item de uma nova página.</p>
      </div>
      
      <button 
        onClick={handleGeneratePDF}
        style={{
          padding: '10px 20px',
          backgroundColor: '#e67e22',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          fontSize: '16px'
        }}
      >
        Gerar PDF - Teste Títulos Quebra
      </button>
      
      <div style={{ marginTop: '20px' }}>
        <h3>Verificações Específicas:</h3>
        <ul>
          <li>✅ Item 8 "Cintas e Catracas" deve estar visível na nova página</li>
          <li>✅ Deve ter observação: "Cintas e catracas funcionando - TESTE TÍTULO QUEBRA"</li>
          <li>✅ Todos os títulos devem aparecer corretamente</li>
          <li>✅ Não deve haver títulos cortados ou desaparecidos</li>
          <li>✅ A quebra de página deve ser suave e legível</li>
        </ul>
      </div>
      
      <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#d4edda', borderRadius: '5px' }}>
        <h4>Correções Implementadas:</h4>
        <ul>
          <li>✓ Aumentada margem de segurança para quebra de página (30 → 40)</li>
          <li>✓ Garantido espaço suficiente para título e conteúdo</li>
          <li>✓ Melhorada lógica de detecção de fim de página</li>
          <li>✓ Adicionado comentário explicativo sobre a lógica</li>
        </ul>
      </div>
      
      <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
        <h4>Como Verificar:</h4>
        <ol>
          <li>Abra o PDF gerado</li>
          <li>Vá para a página 2</li>
          <li>Verifique se o item 8 "Cintas e Catracas" está visível no topo</li>
          <li>Confirme se o título não foi cortado ou desaparecido</li>
          <li>Verifique se a observação está presente</li>
        </ol>
      </div>
    </div>
  );
};

export default TestTitulosQuebra; 