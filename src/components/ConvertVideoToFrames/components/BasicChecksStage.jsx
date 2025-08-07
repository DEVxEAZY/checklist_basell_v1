import React from 'react';
import StatusPanel from './StatusPanel';

const BasicChecksStage = ({ 
  basicChecks, 
  updateBasicCheck, 
  updateBasicCheckObservation,
  areBasicChecksComplete, 
  getStatusStats,
  completedBasicChecks, 
  nextStage,
  vehicleInfo,
  updateVehicleInfo
}) => {
  return (
    <div>
      <h2>ETAPA 1 - Verificações Básicas</h2>
      <p style={{ color: '#666', marginBottom: '20px' }}>
        Verificações rápidas com respostas categóricas. Todas as 9 verificações devem ser completadas antes de prosseguir.
      </p>
      
      {/* Informações do Veículo */}
      <div style={{ 
        marginBottom: '30px', 
        padding: '20px', 
        backgroundColor: '#f8f9fa', 
        borderRadius: '8px',
        border: '1px solid #e9ecef'
      }}>
        <h3 style={{ margin: '0 0 15px 0', color: '#495057' }}>Informações do Veículo</h3>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '15px' 
        }}>
          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '5px', 
              fontWeight: 'bold', 
              color: '#495057' 
            }}>
              Placa:
            </label>
            <input
              type="text"
              value={vehicleInfo.plate}
              onChange={(e) => updateVehicleInfo('plate', e.target.value)}
              placeholder="Ex: ABC-1234"
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #ced4da',
                borderRadius: '4px',
                fontSize: '14px'
              }}
            />
          </div>
          
          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '5px', 
              fontWeight: 'bold', 
              color: '#495057' 
            }}>
              Modelo:
            </label>
            <input
              type="text"
              value={vehicleInfo.model}
              onChange={(e) => updateVehicleInfo('model', e.target.value)}
              placeholder="Ex: Mercedes-Benz Actros 2651"
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #ced4da',
                borderRadius: '4px',
                fontSize: '14px'
              }}
            />
          </div>
          
          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '5px', 
              fontWeight: 'bold', 
              color: '#495057' 
            }}>
              Motorista:
            </label>
            <input
              type="text"
              value={vehicleInfo.driver}
              onChange={(e) => updateVehicleInfo('driver', e.target.value)}
              placeholder="Nome do motorista"
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #ced4da',
                borderRadius: '4px',
                fontSize: '14px'
              }}
            />
          </div>
          
          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '5px', 
              fontWeight: 'bold', 
              color: '#495057' 
            }}>
              Inspetor(a):
            </label>
            <input
              type="text"
              value={vehicleInfo.inspector}
              onChange={(e) => updateVehicleInfo('inspector', e.target.value)}
              placeholder="Nome do inspetor"
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #ced4da',
                borderRadius: '4px',
                fontSize: '14px'
              }}
            />
          </div>
        </div>
      </div>
      
      {/* Status da Etapa 1 */}
      <StatusPanel
        title="Status das Verificações Básicas"
        completedCount={completedBasicChecks}
        totalCount={9}
        status={areBasicChecksComplete() ? '✅ Completa' : '⏳ Pendente'}
      />

      {/* Estatísticas dos Status */}
      {(() => {
        const stats = getStatusStats();
        return (
          <div style={{ 
            marginBottom: '20px', 
            padding: '15px', 
            backgroundColor: '#f5f5f5', 
            borderRadius: '8px',
            display: 'flex',
            gap: '15px',
            flexWrap: 'wrap'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ color: '#4CAF50', fontSize: '16px' }}>✅</span>
              <span>Conforme: <strong>{stats.ok}</strong></span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ color: '#f44336', fontSize: '16px' }}>❌</span>
              <span>Não conforme: <strong>{stats.not_ok}</strong></span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ color: '#FF9800', fontSize: '16px' }}>➖</span>
              <span>Não aplicável: <strong>{stats.na}</strong></span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ color: '#666', fontSize: '16px' }}>⏳</span>
              <span>Pendente: <strong>{stats.pending}</strong></span>
            </div>
          </div>
        );
      })()}

      {/* Lista de Verificações Básicas */}
      <div style={{ marginBottom: '20px' }}>
        {basicChecks.map((check) => (
          <div 
            key={check.id} 
            style={{ 
              padding: '15px',
              border: '1px solid #ddd',
              borderRadius: '8px',
              marginBottom: '15px',
              backgroundColor: check.isCompleted ? '#e8f5e8' : 'white'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <h4 style={{ margin: 0, color: check.isCompleted ? '#4CAF50' : '#333' }}>
                {check.id}. {check.name}
              </h4>
              {check.isCompleted && (
                <span style={{ color: '#4CAF50', fontSize: '20px' }}>✓</span>
              )}
            </div>
            
            <div style={{ fontSize: '14px', color: '#666', marginBottom: '15px' }}>
              {check.description}
            </div>

            {!check.isCompleted ? (
              <div style={{ display: 'flex', gap: '10px', marginBottom: '10px', flexWrap: 'wrap' }}>
                <button 
                  onClick={() => updateBasicCheck(check.id, 'ok')}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#4CAF50',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  ✅ Conforme/Aprovado
                </button>
                <button 
                  onClick={() => updateBasicCheck(check.id, 'not_ok')}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#f44336',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  ❌ Não conforme/Reprovado
                </button>
                <button 
                  onClick={() => updateBasicCheck(check.id, 'na')}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#FF9800',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  ➖ Não aplicável
                </button>
              </div>
            ) : (
              <div style={{ fontSize: '12px', color: '#666' }}>
                <div>Status: <strong>
                  {check.status === 'ok' ? '✅ Conforme/Aprovado' : 
                   check.status === 'not_ok' ? '❌ Não conforme/Reprovado' : 
                   check.status === 'na' ? '➖ Não aplicável' : 'Pendente'}
                </strong></div>
                {check.observation && (
                  <div>Observação: {check.observation}</div>
                )}
              </div>
            )}

            {!check.isCompleted && (
              <div style={{ marginTop: '10px' }}>
                <input 
                  type="text" 
                  placeholder="Adicionar observação (opcional)"
                  value={check.observation}
                  onChange={(e) => {
                    updateBasicCheckObservation(check.id, e.target.value);
                  }}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ddd',
                    borderRadius: '4px'
                  }}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Botões de Navegação */}
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={nextStage} 
          disabled={!areBasicChecksComplete()}
          style={{
            padding: '12px 24px',
            backgroundColor: areBasicChecksComplete() ? '#2196F3' : '#ccc',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: areBasicChecksComplete() ? 'pointer' : 'not-allowed',
            fontSize: '16px'
          }}
        >
          {areBasicChecksComplete() ? 'Próxima Etapa →' : 'Complete todas as verificações'}
        </button>
      </div>
    </div>
  );
};

export default BasicChecksStage; 