import { jsPDF } from "jspdf";

// Template PDF para Checklist de Verificações - REFATORADO DO ZERO
export const generateChecklistPDF = (checklistData = {}, options = {}) => {
  const {
    title = 'Checklist de Verificações',
    subtitle = 'Relatório de Inspeção de Veículo',
    companyName = 'Empresa',
    vehicleInfo = {},
    pageOrientation = 'portrait'
  } = options;

  // Criar documento PDF
  const doc = new jsPDF(pageOrientation, 'mm', 'a4');
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  
  // Configurações de layout REFATORADAS
  const margin = 15;
  const headerHeight = 30;
  const footerHeight = 15;
  const contentStartY = headerHeight + margin;
  const contentEndY = pageHeight - footerHeight - margin;
  
  let currentPage = 0;
  let currentY = contentStartY;

  // Função para adicionar nova página
  const addNewPage = () => {
    currentPage++;
    doc.addPage();
    addHeader(currentPage);
    addFooter();
    currentY = contentStartY;
  };

  // Função para adicionar item do checklist
  const addChecklistItem = (itemNumber, check, checkData) => {
    const itemName = check.split(' - ')[0];
    const description = check.split(' - ')[1];
    
    // Adicionar número e nome do item
    doc.setTextColor(52, 73, 94);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text(`${itemNumber}. ${itemName}`, margin, currentY);
    currentY += 4;
    
    // Adicionar descrição
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    const checkboxX = pageWidth - margin - 85;
    const maxDescriptionWidth = checkboxX - margin - 5;
    doc.text(`   ${description}`, margin, currentY, { maxWidth: maxDescriptionWidth });
    
    // Adicionar caixas de verificação
    drawCheckboxes(checkboxX, currentY - 2, checkData?.status);
    
    // Adicionar linha de observações
    currentY += 8;
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.2);
    doc.line(margin, currentY, pageWidth - margin, currentY);
    
    // Adicionar observações
    currentY += 2;
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    const observation = checkData && checkData.observation ? 
      `Observações: ${checkData.observation}` : 
      'Observações: _________________________________________________';
    doc.text(observation, margin, currentY);
    
    currentY += 15; // Espaçamento entre itens
  };

  // Função para adicionar item de inspeção visual
  const addVisualInspectionItem = (itemNumber, inspection, inspectionData) => {
    const itemName = inspection.split(' - ')[0];
    const description = inspection.split(' - ')[1];
    
    // Adicionar número e nome do item
    doc.setTextColor(52, 73, 94);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text(`${itemNumber}. ${itemName}`, margin, currentY);
    currentY += 4;
    
    // Adicionar descrição
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    const checkboxX = pageWidth - margin - 85;
    const maxDescriptionWidth = checkboxX - margin - 5;
    doc.text(`   ${description}`, margin, currentY, { maxWidth: maxDescriptionWidth });
    
    // Adicionar caixas de verificação
    drawCheckboxes(checkboxX, currentY - 2, inspectionData?.status);
    
    // Adicionar área para mídia
    currentY += 8;
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.2);
    doc.rect(margin, currentY, pageWidth - (margin * 2), 25);
    
    // Adicionar texto da área de mídia
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    const frameCount = inspectionData && inspectionData.frames ? inspectionData.frames.length : 0;
    const mediaText = frameCount > 0 ? 
      `Área para foto/vídeo (${frameCount} frames capturados):` : 
      'Área para foto/vídeo (obrigatório):';
    doc.text(mediaText, margin + 2, currentY + 4);
    
    // Adicionar imagens se disponíveis
    if (inspectionData && inspectionData.frames && inspectionData.frames.length > 0) {
      addImagesToPDF(inspectionData.frames, currentY + 6);
      currentY += 20;
    }
    
    // Adicionar linha de observações
    currentY += 8;
    doc.line(margin, currentY, pageWidth - margin, currentY);
    
    // Adicionar observações
    currentY += 2;
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    const observation = inspectionData && inspectionData.observation ? 
      `Observações: ${inspectionData.observation}` : 
      'Observações: _________________________________________________';
    doc.text(observation, margin, currentY);
    
    currentY += 20; // Espaçamento entre itens
  };

  // Função para adicionar imagens ao PDF
  const addImagesToPDF = (frames, startY) => {
    const imageWidth = 25;
    const imageHeight = 15;
    const imagesPerRow = 4;
    
    let imageX = margin + 2;
    let imageY = startY;
    
    frames.slice(0, 8).forEach((frame, frameIndex) => {
      if (frameIndex > 0 && frameIndex % imagesPerRow === 0) {
        imageX = margin + 2;
        imageY += imageHeight + 2;
      }
      
      try {
        doc.addImage(frame.dataUrl, 'JPEG', imageX, imageY, imageWidth, imageHeight);
        imageX += imageWidth + 2;
      } catch (error) {
        console.error('Erro ao adicionar imagem:', error);
      }
    });
  };

  // Função para adicionar cabeçalho
  const addHeader = (pageNum) => {
    // Cabeçalho principal
    doc.setFillColor(41, 128, 185); // Azul
    doc.rect(0, 0, pageWidth, headerHeight, 'F');
    
    // Título principal
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text(title, margin, 15);
    
    // Subtítulo
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(subtitle, margin, 25);
    
    // Número da página
    doc.text(`Página ${pageNum}`, pageWidth - margin - 25, 20);
  };

  // Função para adicionar rodapé
  const addFooter = () => {
    const footerY = pageHeight - footerHeight;
    doc.setFillColor(52, 73, 94); // Cinza escuro
    doc.rect(0, footerY, pageWidth, footerHeight, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    
    const timestamp = new Date().toLocaleString('pt-BR');
    doc.text(`Gerado em: ${timestamp}`, margin, footerY + 8);
    doc.text(`${companyName}`, pageWidth - margin - 50, footerY + 8);
  };

  // Função para adicionar informações do veículo - REFATORADA
  const addVehicleInfo = () => {
    doc.setTextColor(52, 73, 94);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Informações do Veículo:', margin, currentY);
    
    currentY += 8;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    
    if (vehicleInfo.plate) {
      doc.text(`Placa: ${vehicleInfo.plate}`, margin, currentY);
      currentY += 5;
    }
    if (vehicleInfo.model) {
      doc.text(`Modelo: ${vehicleInfo.model}`, margin, currentY);
      currentY += 5;
    }
    if (vehicleInfo.driver) {
      doc.text(`Motorista: ${vehicleInfo.driver}`, margin, currentY);
      currentY += 5;
    }
    if (vehicleInfo.inspector) {
      doc.text(`Inspetor(a): ${vehicleInfo.inspector}`, margin, currentY);
      currentY += 5;
    }
    if (vehicleInfo.date) {
      doc.text(`Data: ${vehicleInfo.date}`, margin, currentY);
      currentY += 5;
    }
    
    currentY += 10; // Espaçamento após informações do veículo
  };

  // Função auxiliar para desenhar caixas de verificação
  const drawCheckboxes = (checkboxX, checkboxY, status = null) => {
    // Caixa "Conforme/Aprovado"
    doc.setDrawColor(0, 128, 0);
    doc.setLineWidth(0.5);
    doc.rect(checkboxX, checkboxY - 2, 4, 4);
    doc.setTextColor(0, 128, 0);
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.text('Conforme', checkboxX + 6, checkboxY);
    
    // Caixa "Não conforme/Reprovado"
    doc.setDrawColor(255, 0, 0);
    doc.rect(checkboxX + 25, checkboxY - 2, 4, 4);
    doc.setTextColor(255, 0, 0);
    doc.text('Não conforme', checkboxX + 31, checkboxY);
    
    // Caixa "Não aplicável"
    doc.setDrawColor(255, 152, 0);
    doc.rect(checkboxX + 50, checkboxY - 2, 4, 4);
    doc.setTextColor(255, 152, 0);
    doc.text('N/A', checkboxX + 56, checkboxY);
    
    // Marcar checkbox se houver status
    if (status) {
      if (status === 'ok') {
        doc.setFillColor(0, 128, 0);
        doc.rect(checkboxX, checkboxY - 2, 4, 4, 'F');
      } else if (status === 'not_ok') {
        doc.setFillColor(255, 0, 0);
        doc.rect(checkboxX + 25, checkboxY - 2, 4, 4, 'F');
      } else if (status === 'na') {
        doc.setFillColor(255, 152, 0);
        doc.rect(checkboxX + 50, checkboxY - 2, 4, 4, 'F');
      }
    }
  };

  // Função para adicionar seção de verificações básicas - REFATORADA
  const addBasicChecks = () => {
    // Adicionar título da seção
    doc.setTextColor(41, 128, 185);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('ETAPA 1 - Verificações Básicas', margin, currentY);
    currentY += 10;
    
    // Usar dados reais do checklist se disponíveis
    const basicChecksData = checklistData.basicChecks || [];
    const defaultChecks = [
      'Luzes e Sinalização - Funcionamento de lanternas de frio, ré, faróis e setas',
      'Sirene de Ré - Verificação do funcionamento da sirene',
      'Buzina e Pisca-Alerta - Teste de funcionamento de buzina e pisca-alerta',
      'Vazamentos - Verificação de ausência de vazamento de óleo',
      'EPIs - Confirmação do uso obrigatório dos equipamentos de proteção',
      'Assoalho - Avaliação das condições gerais do assoalho',
      'Fitas (Rabicho) - Inspeção do estado das fitas de amarração',
      'Cintas e Catracas - Verificação de cintas e catracas (fixa e móvel)',
      'Faixas Reflexivas - Avaliação das condições das faixas reflexivas'
    ];
    
    const basicChecks = basicChecksData.length > 0 ? 
      basicChecksData.map(check => `${check.name} - ${check.description}`) : 
      defaultChecks;

    // Processar cada verificação básica
    basicChecks.forEach((check, index) => {
      const checkNumber = index + 1;
      const checkData = basicChecksData[index];
      
      // Verificar se precisa de nova página
      if (currentY > contentEndY - 30) {
        addNewPage();
      }
      
      // Adicionar item da verificação
      addChecklistItem(checkNumber, check, checkData);
    });
  };

  // Função para adicionar seção de inspeções visuais - REFATORADA
  const addVisualInspections = () => {
    // Adicionar título da seção
    doc.setTextColor(41, 128, 185);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('ETAPA 2 - Inspeções Visuais com Mídia', margin, currentY);
    currentY += 10;
    
    // Usar dados reais das inspeções visuais se disponíveis
    const visualInspectionsData = checklistData.visualInspections || [];
    const defaultInspections = [
      'Inspeção dos Pneus - Verificação visual completa com documentação',
      'Inspeção do Assoalho - Verificação visual detalhada com mídia',
      'Proteções de Borracha - Inspeção bilateral (lado direito e esquerdo)',
      'Inspeção das Lonas - Verificação bilateral das lonas',
      'Inspeção do Teto - Avaliação completa das condições do teto'
    ];
    
    const visualInspections = visualInspectionsData.length > 0 ? 
      visualInspectionsData.map(inspection => `${inspection.name} - ${inspection.description}`) : 
      defaultInspections;

    // Processar cada inspeção visual
    visualInspections.forEach((inspection, index) => {
      const inspectionNumber = index + 10; // Começa do item 10
      const inspectionData = visualInspectionsData[index];
      
      // Verificar se precisa de nova página
      if (currentY > contentEndY - 50) {
        addNewPage();
      }
      
      // Adicionar item da inspeção visual
      addVisualInspectionItem(inspectionNumber, inspection, inspectionData);
    });
  };

  // Função para adicionar seção de conclusão - REFATORADA
  const addConclusion = () => {
    // Verificar se precisa de nova página
    if (currentY > contentEndY - 100) {
      addNewPage();
    }
    
    // Adicionar título da conclusão
    doc.setTextColor(41, 128, 185);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('CONCLUSÃO', margin, currentY);
    currentY += 15;
    
    // Área para conclusão geral
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.2);
    doc.rect(margin, currentY, pageWidth - (margin * 2), 40);
    doc.setFontSize(9);
    doc.setTextColor(128, 128, 128);
    doc.text('Conclusão geral da inspeção:', margin + 2, currentY + 4);
    
    // Assinaturas
    currentY += 50;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Assinaturas:', margin, currentY);
    
    currentY += 15;
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text('Inspetor: _________________________________', margin, currentY);
    
    currentY += 10;
    doc.text('Motorista: _________________________________', margin, currentY);
    
    currentY += 10;
    doc.text('Data: ___________ Hora: ___________', margin, currentY);
  };

  // Função principal para gerar o PDF - REFATORADA
  const generatePDF = () => {
    try {
      // Adicionar primeira página
      currentPage = 1;
      addHeader(currentPage);
      addFooter();
      
      // Adicionar informações do veículo
      addVehicleInfo();
      
      // Adicionar verificações básicas
      addBasicChecks();
      
      // Adicionar inspeções visuais
      addVisualInspections();
      
      // Adicionar conclusão
      addConclusion();
      
      return doc;
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      throw error;
    }
  };

  // Executar e retornar PDF
  return generatePDF();
};

// Função auxiliar para salvar PDF do checklist
export const saveChecklistPDF = async (checklistData = {}, options = {}) => {
  try {
    const doc = generateChecklistPDF(checklistData, options);
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = options.filename || `checklist_verificacoes_${timestamp}.pdf`;
    doc.save(filename);
    return filename;
  } catch (error) {
    console.error('Erro ao salvar PDF do checklist:', error);
    throw error;
  }
};

// Função para gerar PDF com dados do checklist
export const generateChecklistWithData = (checklistData = {}, templateOptions = {}) => {
  const defaultOptions = {
    title: 'Checklist de Verificações',
    subtitle: 'Relatório de Inspeção de Veículo',
    companyName: 'Empresa',
    vehicleInfo: {
      plate: '',
      model: '',
      driver: '',
      date: new Date().toLocaleDateString('pt-BR')
    },
    pageOrientation: 'portrait',
    filename: `checklist_verificacoes_${new Date().toISOString().replace(/[:.]/g, '-')}.pdf`
  };

  const options = { ...defaultOptions, ...templateOptions };
  return saveChecklistPDF(checklistData, options);
};

// Manter as funções antigas para compatibilidade
export const generatePDFTemplate = (frames, options = {}) => {
  if (!frames || frames.length === 0) {
    throw new Error('Nenhum frame fornecido para gerar PDF');
  }

  const {
    title = 'Relatório de Captura de Frames',
    subtitle = 'Frames capturados em tempo real',
    showTimestamp = true,
    showCaptureTime = true,
    imagesPerRow = 4,
    pageOrientation = 'portrait'
  } = options;

  const doc = new jsPDF(pageOrientation, 'mm', 'a4');
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  
  const margin = 10;
  const headerHeight = 25;
  const footerHeight = 15;
  const contentHeight = pageHeight - headerHeight - footerHeight - (margin * 2);
  
  const availableWidth = pageWidth - (margin * 2);
  const imageWidth = (availableWidth - (margin * (imagesPerRow - 1))) / imagesPerRow;
  const imageHeight = imageWidth * 0.75;
  
  const rowHeight = imageHeight + 20;
  const rowsPerPage = Math.floor(contentHeight / rowHeight);
  
  let currentPage = 0;
  let frameIndex = 0;

  const addHeader = (pageNum) => {
    doc.setFillColor(41, 128, 185);
    doc.rect(0, 0, pageWidth, headerHeight, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text(title, margin, 12);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(subtitle, margin, 20);
    
    doc.text(`Página ${pageNum}`, pageWidth - margin - 20, 15);
  };

  const addFooter = () => {
    const footerY = pageHeight - footerHeight;
    doc.setFillColor(52, 73, 94);
    doc.rect(0, footerY, pageWidth, footerHeight, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    
    const timestamp = new Date().toLocaleString('pt-BR');
    doc.text(`Gerado em: ${timestamp}`, margin, footerY + 8);
    doc.text(`Total de frames: ${frames.length}`, pageWidth - margin - 50, footerY + 8);
  };

  const addFrameInfo = (frame, x, y) => {
    doc.setTextColor(52, 73, 94);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    
    const infoY = y + imageHeight + 3;
    doc.text(`Frame ${frameIndex + 1}`, x, infoY);
    
    if (showTimestamp) {
      doc.setFontSize(7);
      doc.setFont('helvetica', 'normal');
      doc.text(`Tempo: ${frame.timestamp}s`, x, infoY + 3);
    }
    
    if (showCaptureTime) {
      doc.text(`Capturado: ${frame.captureTime}`, x, infoY + 6);
    }
  };

  const addImage = (frame, x, y) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        try {
          doc.setDrawColor(200, 200, 200);
          doc.setLineWidth(0.5);
          doc.rect(x - 1, y - 1, imageWidth + 2, imageHeight + 2);
          
          doc.addImage(img, 'JPEG', x, y, imageWidth, imageHeight);
          
          addFrameInfo(frame, x, y);
          
          resolve();
        } catch (error) {
          reject(error);
        }
      };
      img.onerror = () => reject(new Error('Erro ao carregar imagem'));
      img.src = frame.dataUrl;
    });
  };

  const addNewPage = () => {
    currentPage++;
    doc.addPage();
    addHeader(currentPage);
    addFooter();
  };

  const processFrames = async () => {
    try {
      currentPage = 1;
      addHeader(currentPage);
      addFooter();
      
      let currentRow = 0;
      let currentCol = 0;
      let currentY = headerHeight + margin;
      
      for (let i = 0; i < frames.length; i++) {
        const frame = frames[i];
        
        if (currentRow >= rowsPerPage) {
          addNewPage();
          currentY = headerHeight + margin;
          currentRow = 0;
          currentCol = 0;
        }
        
        const currentX = margin + (currentCol * (imageWidth + margin));
        
        await addImage(frame, currentX, currentY);
        
        currentCol++;
        frameIndex++;
        
        if (currentCol >= imagesPerRow) {
          currentCol = 0;
          currentRow++;
          currentY += rowHeight;
        }
      }
      
      return doc;
    } catch (error) {
      console.error('Erro ao processar frames:', error);
      throw error;
    }
  };

  return processFrames();
};

export const savePDF = async (frames, options = {}) => {
  try {
    const doc = await generatePDFTemplate(frames, options);
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = options.filename || `relatorio_frames_${timestamp}.pdf`;
    doc.save(filename);
    return filename;
  } catch (error) {
    console.error('Erro ao salvar PDF:', error);
    throw error;
  }
};

export const generateCustomPDF = (frames, templateOptions = {}) => {
  const defaultOptions = {
    title: 'Relatório de Captura de Frames',
    subtitle: 'Frames capturados em tempo real',
    showTimestamp: true,
    showCaptureTime: true,
    imagesPerRow: 4,
    imageQuality: 0.9,
    pageOrientation: 'portrait',
    filename: `relatorio_frames_${new Date().toISOString().replace(/[:.]/g, '-')}.pdf`
  };

  const options = { ...defaultOptions, ...templateOptions };
  return savePDF(frames, options);
};

export default {
  generatePDFTemplate,
  savePDF,
  generateCustomPDF,
  generateChecklistPDF,
  saveChecklistPDF,
  generateChecklistWithData
};
