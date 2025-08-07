import { useState, useEffect } from 'react';
import { BASIC_CHECKS_DATA } from '../constants/inspectionData';

export const useBasicChecks = () => {
  const [basicChecks, setBasicChecks] = useState(BASIC_CHECKS_DATA);
  
  // Estado para informações do veículo
  const [vehicleInfo, setVehicleInfo] = useState({
    plate: '',
    model: '',
    driver: '',
    inspector: ''
  });

  // Função para atualizar verificação básica
  const updateBasicCheck = (id, status, observation = '') => {
    setBasicChecks(prev => prev.map(check => 
      check.id === id 
        ? { ...check, status, observation, isCompleted: true }
        : check
    ));
  };

  // Função para atualizar apenas a observação
  const updateBasicCheckObservation = (id, observation) => {
    setBasicChecks(prev => prev.map(check => 
      check.id === id 
        ? { ...check, observation }
        : check
    ));
  };

  // Função para atualizar informações do veículo
  const updateVehicleInfo = (field, value) => {
    setVehicleInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Função para verificar se todas as verificações básicas estão completas
  const areBasicChecksComplete = () => {
    return basicChecks.every(check => check.isCompleted);
  };

  // Função para obter estatísticas dos status
  const getStatusStats = () => {
    const stats = {
      ok: basicChecks.filter(check => check.status === 'ok').length,
      not_ok: basicChecks.filter(check => check.status === 'not_ok').length,
      na: basicChecks.filter(check => check.status === 'na').length,
      pending: basicChecks.filter(check => !check.isCompleted).length
    };
    return stats;
  };

  // Função para resetar verificações básicas
  const resetBasicChecks = () => {
    setBasicChecks(BASIC_CHECKS_DATA);
  };

  // Função para limpar todas as verificações
  const clearAllBasicChecks = () => {
    const resetChecks = BASIC_CHECKS_DATA.map(check => ({
      ...check,
      status: null,
      observation: '',
      isCompleted: false
    }));
    setBasicChecks(resetChecks);
    
    // Limpar também as informações do veículo
    setVehicleInfo({
      plate: '',
      model: '',
      driver: '',
      inspector: ''
    });
  };

  // Calcular estatísticas
  const completedBasicChecks = basicChecks.filter(check => check.isCompleted).length;
  const totalBasicChecks = basicChecks.length;

  // Debug: Verificar estado inicial
  useEffect(() => {
    console.log('Estado inicial das verificações básicas:', basicChecks);
    console.log('Estado inicial das informações do veículo:', vehicleInfo);
  }, []);

  // Debug: Verificar mudanças
  useEffect(() => {
    console.log('Estado atual das verificações básicas:', basicChecks);
    console.log('Estado atual das informações do veículo:', vehicleInfo);
  }, [basicChecks, vehicleInfo]);

  return {
    basicChecks,
    vehicleInfo,
    updateBasicCheck,
    updateBasicCheckObservation,
    updateVehicleInfo,
    areBasicChecksComplete,
    getStatusStats,
    resetBasicChecks,
    clearAllBasicChecks,
    completedBasicChecks,
    totalBasicChecks
  };
}; 