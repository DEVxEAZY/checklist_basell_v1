# ConvertVideoToFrames - Estrutura Modularizada

Este componente foi modularizado para melhorar a organização, manutenibilidade e testabilidade do código.

## Estrutura de Pastas

```
ConvertVideoToFrames/
├── index.jsx                    # Componente principal
├── constants/
│   └── inspectionData.js        # Dados das inspeções e configurações
├── hooks/
│   ├── useBasicChecks.js        # Hook para verificações básicas
│   ├── useVisualInspections.js  # Hook para inspeções visuais
│   ├── useVideoCapture.js       # Hook para captura de vídeo
│   └── useStageNavigation.js    # Hook para navegação entre etapas
├── components/
│   ├── StatusPanel.jsx          # Painel de status
│   ├── BasicChecksStage.jsx     # Etapa de verificações básicas
│   ├── VisualInspectionsStage.jsx # Etapas de inspeções visuais
│   ├── InspectionList.jsx       # Lista de inspeções
│   ├── VideoControls.jsx        # Controles de vídeo
│   └── ConfirmationPopup.jsx    # Popup de confirmação
└── README.md                    # Esta documentação
```

## Hooks Customizados

### useBasicChecks
Gerencia o estado das verificações básicas (Etapa 1).
- `basicChecks`: Array com todas as verificações
- `updateBasicCheck`: Atualiza status de uma verificação
- `updateBasicCheckObservation`: Atualiza observação de uma verificação
- `areBasicChecksComplete`: Verifica se todas estão completas
- `clearAllBasicChecks`: Limpa todas as verificações

### useVisualInspections
Gerencia o estado das inspeções visuais (Etapas 2-5).
- `visualInspections`: Array com todas as inspeções
- `currentInspection`: ID da inspeção atual
- `addFrameToCurrentInspection`: Adiciona frame à inspeção atual
- `markInspectionAsComplete`: Marca inspeção como completa
- `resetCurrentInspection`: Resetar inspeção atual (para regravar)
- `nextInspection`: Avança para próxima inspeção automaticamente

### useVideoCapture
Gerencia a captura de vídeo e frames.
- `isCapturing`: Estado da captura
- `videoRef` / `canvasRef`: Refs para vídeo e canvas
- `startCapture`: Inicia captura
- `stopCapture`: Para captura e mostra popup de confirmação
- `showRerecordPopup`: Estado do popup de confirmação
- `handleRerecordConfirm`: Confirma regravação
- `handleRerecordCancel`: Cancela regravação

### useStageNavigation
Gerencia a navegação entre etapas (automática).
- `currentStage`: Etapa atual
- `nextStage`: Avança para próxima etapa
- `resetToFirstStage`: Volta para etapa 1

## Componentes

### StatusPanel
Componente reutilizável para exibir status com informações customizáveis.

### BasicChecksStage
Renderiza a Etapa 1 com todas as verificações básicas.

### VisualInspectionsStage
Renderiza as Etapas 2-5 com inspeções visuais e captura de vídeo.

### InspectionList
Lista visual das inspeções visuais (apenas para visualização).

### VideoControls
Controles para captura de vídeo com fluxo automático.

### ConfirmationPopup
Popup personalizado para confirmações, substituindo os alerts do navegador.
- `isVisible`: Controla visibilidade do popup
- `onConfirm`: Função executada ao confirmar
- `onCancel`: Função executada ao cancelar
- `title`: Título do popup
- `message`: Mensagem principal
- `confirmText`: Texto do botão de confirmação
- `cancelText`: Texto do botão de cancelamento

## Fluxo de Navegação

### Etapa 1 - Verificações Básicas
1. Usuário preenche todas as 9 verificações básicas
2. Sistema automaticamente avança para Etapa 2

### Etapas 2-5 - Inspeções Visuais
1. **Iniciar Gravação**: Usuário clica em "Iniciar [Nome da Inspeção]"
2. **Captura Automática**: Fotos são tiradas automaticamente a cada 3 segundos
3. **Finalizar**: Usuário clica em "Finalizar Inspeção"
4. **Popup de Confirmação**: Sistema mostra popup "Deseja regravar esta inspeção?"
   - **Sim, Regravar**: Inspeção é resetada (frames limpos, status volta para pendente)
   - **Não, Continuar**: Sistema automaticamente vai para a próxima inspeção
5. **Geração de PDF**: Botão "Gerar Relatório" só aparece quando todas as 5 inspeções estiverem completas

## Benefícios da Modularização

1. **Separação de Responsabilidades**: Cada hook e componente tem uma responsabilidade específica
2. **Reutilização**: Componentes como `StatusPanel` e `ConfirmationPopup` podem ser reutilizados
3. **Testabilidade**: Hooks e componentes menores são mais fáceis de testar
4. **Manutenibilidade**: Mudanças em uma funcionalidade não afetam outras
5. **Legibilidade**: Código mais organizado e fácil de entender
6. **Debugging**: Mais fácil identificar problemas em componentes específicos
7. **Fluxo Simplificado**: Navegação automática sem controles manuais desnecessários
8. **UX Melhorada**: Popup personalizado em vez de alerts do navegador

## Como Usar

O componente principal (`index.jsx`) integra todos os hooks e componentes, mantendo a mesma API externa. A funcionalidade permanece idêntica, mas agora com melhor organização interna, fluxo simplificado e interface mais polida. 