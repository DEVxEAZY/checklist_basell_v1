# Template PDF - Checklist de Verificações

Este template PDF foi criado especificamente para gerar relatórios de checklist de verificações de veículos, conforme especificado nas funcionalidades.

## 📋 Funcionalidades

### ETAPA 1 - Verificações Básicas (Itens 1-9)
- **Luzes e Sinalização** - Funcionamento de lanternas de frio, ré, faróis e setas
- **Sirene de Ré** - Verificação do funcionamento da sirene
- **Buzina e Pisca-Alerta** - Teste de funcionamento de buzina e pisca-alerta
- **Vazamentos** - Verificação de ausência de vazamento de óleo
- **EPIs** - Confirmação do uso obrigatório dos equipamentos de proteção
- **Assoalho** - Avaliação das condições gerais do assoalho
- **Fitas (Rabicho)** - Inspeção do estado das fitas de amarração
- **Cintas e Catracas** - Verificação de cintas e catracas (fixa e móvel)
- **Faixas Reflexivas** - Avaliação das condições das faixas reflexivas

### ETAPA 2 - Inspeções Visuais com Mídia (Itens 10-14)
- **Inspeção dos Pneus** - Verificação visual completa com documentação
- **Inspeção do Assoalho** - Verificação visual detalhada com mídia
- **Proteções de Borracha** - Inspeção bilateral (lado direito e esquerdo)
- **Inspeção das Lonas** - Verificação bilateral das lonas
- **Inspeção do Teto** - Avaliação completa das condições do teto

## 🎯 Características do Template

### Layout
- **Cabeçalho**: Título, subtítulo e número da página
- **Informações do Veículo**: Placa, modelo, motorista e data
- **Seções Organizadas**: Etapas claramente separadas
- **Caixas de Verificação**: Conforme/Não conforme/Não aplicável para cada item
- **Áreas para Observações**: Linhas para anotações
- **Áreas para Mídia**: Espaços para fotos/vídeos (obrigatório na Etapa 2)
- **Conclusão**: Área para conclusão geral e assinaturas
- **Rodapé**: Timestamp e nome da empresa

### Validação
- Caixas de verificação obrigatórias (Conforme/Não conforme/Não aplicável)
- Áreas para observações em cada item
- Espaços para mídia obrigatória na Etapa 2
- Assinaturas do inspetor e motorista

## 📖 Como Usar

### Importação
```javascript
import { generateChecklistWithData } from './pdfTemplate';
```

### Exemplo Básico
```javascript
const vehicleInfo = {
  plate: 'ABC-1234',
  model: 'Mercedes-Benz Actros 2651',
  driver: 'João Silva',
  date: new Date().toLocaleDateString('pt-BR')
};

const templateOptions = {
  title: 'Checklist de Verificações',
  subtitle: 'Relatório de Inspeção de Veículo',
  companyName: 'Transportadora XYZ Ltda',
  vehicleInfo: vehicleInfo,
  filename: `checklist_${vehicleInfo.plate}_${new Date().toISOString().slice(0, 10)}.pdf`
};

generateChecklistWithData({}, templateOptions)
  .then(filename => {
    console.log('PDF gerado:', filename);
  })
  .catch(error => {
    console.error('Erro:', error);
  });
```

### Opções Disponíveis
```javascript
const options = {
  title: 'Checklist de Verificações',           // Título principal
  subtitle: 'Relatório de Inspeção de Veículo', // Subtítulo
  companyName: 'Empresa',                       // Nome da empresa
  vehicleInfo: {                                // Informações do veículo
    plate: '',                                  // Placa
    model: '',                                  // Modelo
    driver: '',                                 // Motorista
    date: ''                                    // Data
  },
  pageOrientation: 'portrait',                  // Orientação da página
  filename: 'checklist.pdf'                     // Nome do arquivo
};
```

## 🔧 Funções Disponíveis

### `generateChecklistPDF(options)`
Gera o PDF do checklist com as opções especificadas.

### `saveChecklistPDF(checklistData, options)`
Gera e salva o PDF do checklist automaticamente.

### `generateChecklistWithData(checklistData, templateOptions)`
Função principal que combina geração e salvamento com opções personalizadas.

## 📄 Estrutura do PDF

1. **Página 1**: Cabeçalho + Informações do Veículo + Verificações Básicas (1-9)
2. **Página 2+**: Continuação das verificações se necessário
3. **Página Final**: Inspeções Visuais (10-14) + Conclusão + Assinaturas

## 🎨 Personalização

O template pode ser personalizado através das opções:
- Cores do cabeçalho e rodapé
- Layout e espaçamentos
- Informações da empresa
- Dados do veículo
- Nome do arquivo de saída

## 📱 Compatibilidade

- Funciona em navegadores modernos
- Gera PDFs compatíveis com padrão PDF/A
- Suporte a caracteres especiais (acentos, etc.)
- Orientação portrait otimizada para impressão

## ⚠️ Requisitos

- Biblioteca jsPDF instalada
- Navegador com suporte a Canvas
- JavaScript ES6+

## 🔄 Integração

O template pode ser integrado com:
- Sistemas de captura de vídeo/foto
- Formulários de entrada de dados
- Sistemas de gestão de frota
- Aplicações móveis 