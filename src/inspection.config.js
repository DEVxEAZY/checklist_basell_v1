// src/inspection.config.js

export const INITIAL_BASIC_CHECKS = [
    { id: 1, name: 'Luzes e Sinalização', description: 'Funcionamento de lanternas de frio, ré, faróis e setas', status: null, observation: '', isCompleted: false },
    { id: 2, name: 'Sirene de Ré', description: 'Verificação do funcionamento da sirene', status: null, observation: '', isCompleted: false },
    { id: 3, name: 'Buzina e Pisca-Alerta', description: 'Teste de funcionamento de buzina e pisca-alerta', status: null, observation: '', isCompleted: false },
    // ... adicione os outros 6 checks básicos aqui
    { id: 9, name: 'Faixas Reflexivas', description: 'Avaliação das condições das faixas reflexivas', status: null, observation: '', isCompleted: false }
  ];
  
  export const INITIAL_VISUAL_INSPECTIONS = [
    { id: 1, name: 'Inspeção dos Pneus', description: 'Verificação visual completa com documentação', frames: [], isCompleted: false },
    { id: 2, name: 'Inspeção do Assoalho', description: 'Verificação visual detalhada com mídia', frames: [], isCompleted: false },
    { id: 3, name: 'Proteções de Borracha', description: 'Inspeção bilateral (lado direito e esquerdo)', frames: [], isCompleted: false },
    { id: 4, name: 'Inspeção das Lonas', description: 'Verificação bilateral das lonas', frames: [], isCompleted: false },
    { id: 5, name: 'Inspeção do Teto', description: 'Avaliação completa das condições do teto', frames: [], isCompleted: false }
  ];
  
  export const PDF_OPTIONS = {
    title: 'Relatório de Inspeção BASELL',
    subtitle: 'Checklist completo de inspeções com documentação fotográfica',
    showTimestamp: true,
    showCaptureTime: true,
    imagesPerPage: 2
  };