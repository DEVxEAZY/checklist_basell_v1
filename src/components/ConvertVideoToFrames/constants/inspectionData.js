// Dados das verificações básicas (Etapa 1)
export const BASIC_CHECKS_DATA = [
  {
    id: 1,
    name: 'Luzes e Sinalização',
    description: 'Funcionamento de lanternas de frio, ré, faróis e setas',
    status: null,
    observation: '',
    isCompleted: false
  },
  {
    id: 2,
    name: 'Sirene de Ré',
    description: 'Verificação do funcionamento da sirene',
    status: null,
    observation: '',
    isCompleted: false
  },
  {
    id: 3,
    name: 'Buzina e Pisca-Alerta',
    description: 'Teste de funcionamento de buzina e pisca-alerta',
    status: null,
    observation: '',
    isCompleted: false
  },
  {
    id: 4,
    name: 'Vazamentos',
    description: 'Verificação de ausência de vazamento de óleo',
    status: null,
    observation: '',
    isCompleted: false
  },
  {
    id: 5,
    name: 'EPIs',
    description: 'Confirmação do uso obrigatório dos equipamentos de proteção',
    status: null,
    observation: '',
    isCompleted: false
  },
  {
    id: 6,
    name: 'Assoalho',
    description: 'Avaliação das condições gerais do assoalho',
    status: null,
    observation: '',
    isCompleted: false
  },
  {
    id: 7,
    name: 'Fitas (Rabicho)',
    description: 'Inspeção do estado das fitas de amarração',
    status: null,
    observation: '',
    isCompleted: false
  },
  {
    id: 8,
    name: 'Cintas e Catracas',
    description: 'Verificação de cintas e catracas (fixa e móvel)',
    status: null,
    observation: '',
    isCompleted: false
  },
  {
    id: 9,
    name: 'Faixas Reflexivas',
    description: 'Avaliação das condições das faixas reflexivas',
    status: null,
    observation: '',
    isCompleted: false
  }
];

// Dados das inspeções visuais (Etapas 2-5)
export const VISUAL_INSPECTIONS_DATA = [
  { 
    id: 1, 
    name: 'Inspeção dos Pneus', 
    description: 'Verificação visual completa com documentação',
    frames: [], 
    isCompleted: false 
  },
  { 
    id: 2, 
    name: 'Inspeção do Assoalho', 
    description: 'Verificação visual detalhada com mídia',
    frames: [], 
    isCompleted: false 
  },
  { 
    id: 3, 
    name: 'Proteções de Borracha', 
    description: 'Inspeção bilateral (lado direito e esquerdo)',
    frames: [], 
    isCompleted: false 
  },
  { 
    id: 4, 
    name: 'Inspeção das Lonas', 
    description: 'Verificação bilateral das lonas',
    frames: [], 
    isCompleted: false 
  },
  { 
    id: 5, 
    name: 'Inspeção do Teto', 
    description: 'Avaliação completa das condições do teto',
    frames: [], 
    isCompleted: false 
  }
];

// Configurações do PDF
export const PDF_OPTIONS = {
  title: 'Relatório de Inspeção BASELL',
  subtitle: 'Checklist completo de inspeções com documentação fotográfica',
  showTimestamp: true,
  showCaptureTime: true,
  imagesPerPage: 2
}; 