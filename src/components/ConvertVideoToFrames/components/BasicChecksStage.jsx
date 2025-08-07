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
  const stats = getStatusStats();

  return (
    <div className="stage1-container">
      {/* Header com progresso */}
      <div className="stage-header">
        <div className="stage-number">1</div>
        <div className="stage-info">
          <h2>Verificações Básicas</h2>
          <p>Complete todas as verificações para prosseguir</p>
        </div>
        <div className="progress-indicator">
          <span className="progress-text">{completedBasicChecks}/9</span>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${(completedBasicChecks / 9) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Informações do Veículo */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">
            <span>🚛</span>
            Informações do Veículo
          </h3>
          <p className="card-description">Preencha os dados básicos do veículo</p>
        </div>
        
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Placa do Veículo</label>
            <input
              type="text"
              value={vehicleInfo.plate}
              onChange={(e) => updateVehicleInfo('plate', e.target.value.toUpperCase())}
              placeholder="ABC-1234"
              className="form-input"
              maxLength="8"
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Modelo do Veículo</label>
            <input
              type="text"
              value={vehicleInfo.model}
              onChange={(e) => updateVehicleInfo('model', e.target.value)}
              placeholder="Mercedes-Benz Actros 2651"
              className="form-input"
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Nome do Motorista</label>
            <input
              type="text"
              value={vehicleInfo.driver}
              onChange={(e) => updateVehicleInfo('driver', e.target.value)}
              placeholder="Nome completo do motorista"
              className="form-input"
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Nome do Inspetor</label>
            <input
              type="text"
              value={vehicleInfo.inspector}
              onChange={(e) => updateVehicleInfo('inspector', e.target.value)}
              placeholder="Nome completo do inspetor"
              className="form-input"
            />
          </div>
        </div>
      </div>

      {/* Status Panel */}
      <div className="card">
        <StatusPanel
          title="Status das Verificações"
          completedCount={completedBasicChecks}
          totalCount={9}
          status={areBasicChecksComplete() ? 'Completo' : 'Em andamento'}
          additionalInfo={[
            { label: 'Conforme', value: stats.ok },
            { label: 'Não Conforme', value: stats.not_ok },
            { label: 'N/A', value: stats.na }
          ]}
        />
      </div>

      {/* Lista de Verificações */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">
            <span>✅</span>
            Verificações Básicas ({completedBasicChecks}/9)
          </h3>
          <p className="card-description">Marque o status de cada verificação</p>
        </div>
        
        <div className="checks-list">
          {basicChecks.map((check) => (
            <div
              key={check.id} 
              className={`check-item ${check.isCompleted ? 'completed' : ''}`}
            >
              <div className="check-item-header">
                <h4 className="check-item-title">
                  <span className="check-item-number">{check.id}</span>
                  {check.name}
                </h4>
                {check.isCompleted && (
                  <div className={`check-item-status ${check.status}`}>
                    {check.status === 'ok' ? '✅' : 
                     check.status === 'not_ok' ? '❌' : '➖'}
                  </div>
                )}
              </div>
              
              <p className="check-item-description">{check.description}</p>
              
              {!check.isCompleted ? (
                <>
                  <div className="status-buttons">
                    <button
                      onClick={() => updateBasicCheck(check.id, 'ok')}
                      className="status-btn success"
                    >
                      <span>✅</span>
                      Conforme
                    </button>
                    <button
                      onClick={() => updateBasicCheck(check.id, 'not_ok')}
                      className="status-btn danger"
                    >
                      <span>❌</span>
                      Não Conforme
                    </button>
                    <button
                      onClick={() => updateBasicCheck(check.id, 'na')}
                      className="status-btn warning"
                    >
                      <span>➖</span>
                      Não Aplicável
                    </button>
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">Observações (opcional)</label>
                    <textarea
                      value={check.observation}
                      onChange={(e) => updateBasicCheckObservation(check.id, e.target.value)}
                      placeholder="Adicione observações sobre esta verificação..."
                      className="observation-input"
                      rows="3"
                    />
                  </div>
                </>
              ) : (
                <div className="status-display">
                  <p className="status-text">
                    Status: <strong>
                      {check.status === 'ok' ? 'Conforme' : 
                       check.status === 'not_ok' ? 'Não Conforme' : 'Não Aplicável'}
                    </strong>
                  </p>
                  {check.observation && (
                    <p className="observation-text">
                      <strong>Observação:</strong> {check.observation}
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Botão para próxima etapa */}
      <div className="action-buttons">
        <button
          onClick={nextStage}
          disabled={!areBasicChecksComplete()}
          className={`action-btn ${areBasicChecksComplete() ? 'primary' : 'secondary'}`}
        >
          {areBasicChecksComplete() ? (
            <>
              <span>➡️</span>
              Próxima Etapa
            </>
          ) : (
            <>
              <span>⏳</span>
              Complete {9 - completedBasicChecks} verificações
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default BasicChecksStage;