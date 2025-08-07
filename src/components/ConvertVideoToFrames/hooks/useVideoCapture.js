import { useState, useRef, useEffect } from 'react';

export const useVideoCapture = (addFrameToCurrentInspection, markInspectionAsComplete, nextInspection, resetCurrentInspection) => {
  const [isCapturing, setIsCapturing] = useState(false);
  const [stream, setStream] = useState(null);
  const [showRerecordPopup, setShowRerecordPopup] = useState(false);
  const [showStatusPopup, setShowStatusPopup] = useState(false);
  const [hasActiveCapture, setHasActiveCapture] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedVideoBlob, setRecordedVideoBlob] = useState(null);
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const intervalRef = useRef(null);
  const captureTimeRef = useRef(0);
  const mediaRecorderRef = useRef(null);
  const recordedChunksRef = useRef([]);

  // Função 1: Iniciar Captura de Vídeo
  const startCapture = async () => {
    try {
      // Detectar se é dispositivo móvel
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      
      // Solicitar acesso à câmera
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          width: 1280, 
          height: 720,
          // Usar câmera traseira em dispositivos móveis
          facingMode: isMobile ? 'environment' : 'user'
        },
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
      
      // Iniciar gravação de vídeo
      startVideoRecording(mediaStream);
      
      // Iniciar captura automática a cada 3 segundos (fixo)
      startAutoCapture();
      setHasActiveCapture(true);
      
    } catch (error) {
      console.error('Erro ao acessar a câmera:', error);
      alert('Não foi possível acessar a câmera');
    }
  };

  // Função para iniciar gravação de vídeo
  const startVideoRecording = (stream) => {
    try {
      recordedChunksRef.current = [];
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'video/webm;codecs=vp9' // Formato compatível
      });
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, {
          type: 'video/webm'
        });
        setRecordedVideoBlob(blob);
        setIsRecording(false);
      };
      
      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);
      
      console.log('Gravação de vídeo iniciada');
    } catch (error) {
      console.error('Erro ao iniciar gravação de vídeo:', error);
    }
  };

  // Função para parar gravação de vídeo
  const stopVideoRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      console.log('Gravação de vídeo finalizada');
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
    // Parar gravação de vídeo
    stopVideoRecording();
    
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

  // Função para baixar vídeo gravado
  const downloadRecordedVideo = () => {
    if (recordedVideoBlob) {
      const url = URL.createObjectURL(recordedVideoBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `inspecao_video_${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.webm`;
      link.click();
      URL.revokeObjectURL(url);
    }
  };
  // Função para lidar com confirmação de regravação
  const handleRerecordConfirm = () => {
    setShowRerecordPopup(false);
    // Limpar vídeo gravado anterior
    setRecordedVideoBlob(null);
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
    markInspectionAsComplete(null, status, recordedVideoBlob);
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
    // Limpar vídeo gravado
    setRecordedVideoBlob(null);
    // Resetar a inspeção atual para permitir nova gravação
    resetCurrentInspection();
    console.log('Status da inspeção cancelado - inspeção resetada');
  };

  // Limpeza (useEffect)
  useEffect(() => {
    return () => {
      stopCapture();
      stopVideoRecording();
      setShowRerecordPopup(false);
      setShowStatusPopup(false);
      setHasActiveCapture(false);
      setRecordedVideoBlob(null);
    };
  }, []);

  return {
    isCapturing,
    isRecording,
    recordedVideoBlob,
    videoRef,
    canvasRef,
    startCapture,
    stopCapture,
    downloadRecordedVideo,
    showRerecordPopup,
    showStatusPopup,
    handleRerecordConfirm,
    handleRerecordCancel,
    handleStatusConfirm,
    handleStatusCancel
  };
}; 