import { useState, useRef, useEffect } from 'react';

export const useVideoCapture = (addFrameToCurrentInspection, markInspectionAsComplete, nextInspection, resetCurrentInspection) => {
  const [isCapturing, setIsCapturing] = useState(false);
  const [stream, setStream] = useState(null);
  const [showRerecordPopup, setShowRerecordPopup] = useState(false);
  const [showStatusPopup, setShowStatusPopup] = useState(false);
  const [hasActiveCapture, setHasActiveCapture] = useState(false);
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const intervalRef = useRef(null);
  const captureTimeRef = useRef(0);

  // Função 1: Iniciar Captura de Vídeo
  const startCapture = async () => {
    try {
      // Solicitar acesso à câmera
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720 },
        audio: false
      });
      
      // Configurar o stream no elemento video
      videoRef.current.srcObject = mediaStream;
      setStream(mediaStream);
      setIsCapturing(true);
      
      // Aguardar o vídeo estar pronto
      await new Promise(resolve => {
        videoRef.current.onloadedmetadata = resolve;
      });
      
      // Configurar canvas com as mesmas dimensões do vídeo
      const canvas = canvasRef.current;
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      
      // Iniciar captura automática a cada 3 segundos (fixo)
      startAutoCapture();
      setHasActiveCapture(true);
      
    } catch (error) {
      console.error('Erro ao acessar a câmera:', error);
      alert('Não foi possível acessar a câmera');
    }
  };

  // Função 2: Captura Automática de Frames (fixo 3 segundos)
  const startAutoCapture = () => {
    captureTimeRef.current = 0;
    
    intervalRef.current = setInterval(() => {
      captureFrame();
      captureTimeRef.current += 3; // Fixo 3 segundos
    }, 3000); // Fixo 3 segundos
  };

  const captureFrame = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Desenhar o frame atual do vídeo no canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Converter para imagem
    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
    
    // Criar novo frame
    const newFrame = {
      dataUrl,
      timestamp: captureTimeRef.current,
      captureTime: new Date().toLocaleTimeString(),
      inspectionId: null // Será definido pelo componente pai
    };
    
    // Adicionar à inspeção atual via callback
    addFrameToCurrentInspection(newFrame);
  };

  // Função 3: Parar Captura
  const stopCapture = () => {
    // Parar interval de captura
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    // Parar stream da câmera
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    
    setIsCapturing(false);
    captureTimeRef.current = 0;
    
    // Limpar o elemento video
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    // Mostrar popup de status da inspeção apenas se houve captura ativa
    if (hasActiveCapture) {
      setShowStatusPopup(true);
      setHasActiveCapture(false);
    }
  };

  // Função para lidar com confirmação de regravação
  const handleRerecordConfirm = () => {
    setShowRerecordPopup(false);
    // Resetar a inspeção atual para permitir nova gravação
    resetCurrentInspection();
    console.log('Usuário escolheu regravar - inspeção resetada');
  };

  // Função para lidar com cancelamento de regravação
  const handleRerecordCancel = () => {
    setShowRerecordPopup(false);
    // Ir para próxima inspeção automaticamente
    console.log('Indo para próxima inspeção');
    nextInspection();
  };

  // Função para lidar com confirmação de status da inspeção
  const handleStatusConfirm = (status) => {
    setShowStatusPopup(false);
    // Marcar inspeção como completa com o status escolhido
    markInspectionAsComplete(null, status);
    console.log('Status da inspeção confirmado:', status);
    // Mostrar popup de regravação apenas se houve captura ativa
    if (hasActiveCapture || captureTimeRef.current > 0) {
      setShowRerecordPopup(true);
    } else {
      // Se não houve captura, ir para próxima inspeção automaticamente
      nextInspection();
    }
  };

  // Função para lidar com cancelamento de status da inspeção
  const handleStatusCancel = () => {
    setShowStatusPopup(false);
    // Resetar a inspeção atual para permitir nova gravação
    resetCurrentInspection();
    console.log('Status da inspeção cancelado - inspeção resetada');
  };

  // Limpeza (useEffect)
  useEffect(() => {
    return () => {
      stopCapture();
      setShowRerecordPopup(false);
      setShowStatusPopup(false);
      setHasActiveCapture(false);
    };
  }, []);

  return {
    isCapturing,
    videoRef,
    canvasRef,
    startCapture,
    stopCapture,
    showRerecordPopup,
    showStatusPopup,
    handleRerecordConfirm,
    handleRerecordCancel,
    handleStatusConfirm,
    handleStatusCancel
  };
}; 