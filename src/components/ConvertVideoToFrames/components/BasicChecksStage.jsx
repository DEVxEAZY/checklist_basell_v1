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
    <div className="fade-in-up">
      <div className="stage-header">
        <div className="stage-number">1</div>
        <div className="stage-info">
          <h2>Verificações Básicas</h2>
          <p>Verificações rápidas com respostas categóricas. Todas as 9 verificações devem ser completadas antes de prosseguir.</p>
        </div>
      </div>
      
      {/* Informações do Veículo */}
      <div className="info-card vehicle-info-card">
        <h3 style={{ margin: '0 0 1.5rem 0', fontSize: '1.2rem', fontWeight: '600' }}>
          🚛 Informações do Veículo
        </h3>
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Placa:</label>
            <input
              type="text"
              value={vehicleInfo.plate}
              onChange={(e) => updateVehicleInfo('plate', e.target.value)}
              placeholder="Ex: ABC-1234"
              className="form-input"
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Modelo:</label>
            <input
              type="text"
              value={vehicleInfo.model}
              onChange={(e) => updateVehicleInfo('model', e.target.value)}
              placeholder="Ex: Mercedes-Benz Actros 2651"
              className="form-input"
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Motorista:</label>
            <input
              type="text"
              value={vehicleInfo.driver}
              onChange={(e) => updateVehicleInfo('driver', e.target.value)}
              placeholder="Nome do motorista"
              className="form-input"
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Inspetor(a):</label>
            <input
              type="text"
              value={vehicleInfo.inspector}
              onChange={(e) => updateVehicleInfo('inspector', e.target.value)}
              placeholder="Nome do inspetor"
              className="form-input"
            />
          </div>
        </div>
      </div>
      
      {/* Status da Etapa 1 */}
      <div className="info-card status-card">
        <StatusPanel
          title="📋 Status das Verificações Básicas"
          completedCount={completedBasicChecks}
          totalCount={9}
          status={areBasicChecksComplete() ? '✅ Completa' : '⏳ Pendente'}
        />
      </div>

      {/* Estatísticas dos Status */}
      {(() => {
        const stats = getStatusStats();
        return (
          <div className="info-card stats-card">
            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-icon success">✅</div>
                <div className="stat-content">
                  <p className="stat-label">Conforme</p>
                  <p className="stat-value">{stats.ok}</p>
                </div>
              </div>
              <div className="stat-item">
                <div className="stat-icon danger">❌</div>
                <div className="stat-content">
                  <p className="stat-label">Não conforme</p>
                  <p className="stat-value">{stats.not_ok}</p>
                </div>
              </div>
              <div className="stat-item">
                <div className="stat-icon warning">➖</div>
                <div className="stat-content">
                  <p className="stat-label">Não aplicável</p>
                  <p className="stat-value">{stats.na}</p>
                </div>
              </div>
              <div className="stat-item">
                <div className="stat-icon info">⏳</div>
                <div className="stat-content">
                  <p className="stat-label">Pendente</p>
                  <p className="stat-value">{stats.pending}</p>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Lista de Verificações Básicas */}
      <div>
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
                <span style={{ color: '#22c55e', fontSize: '1.5rem' }}>✓</span>
              )}
            </div>
            
            <div className="check-item-description">
              {check.description}
            </div>

            {!check.isCompleted ? (
              <div className="status-buttons">
                <button
                  onClick={() => updateBasicCheck(check.id, 'ok')}
                  className="status-btn success"
                >
                  ✅ Conforme/Aprovado
                </button>
                <button
                  onClick={() => updateBasicCheck(check.id, 'not_ok')}
                  className="status-btn danger"
                >
                  ❌ Não conforme/Reprovado
                </button>
                <button
                  onClick={() => updateBasicCheck(check.id, 'na')}
                  className="status-btn warning"
                >
                  ➖ Não aplicável
                </button>
              </div>
            ) : (
              <div className="status-display">
                <div className="status-text">Status: 
                  {check.status === 'ok' ? '✅ Conforme/Aprovado' : 
                   check.status === 'not_ok' ? '❌ Não conforme/Reprovado' : 
                   check.status === 'na' ? '➖ Não aplicável' : 'Pendente'}
                </div>
                {check.observation && (
                  <div className="observation-text">Observação: {check.observation}</div>
                )}
              </div>
            )}

            {!check.isCompleted && (
              <div style={{ marginTop: '1rem' }}>
                <input
                  type="text" 
                  placeholder="Adicionar observação (opcional)"
                  value={check.observation}
                  onChange={(e) => {
                    updateBasicCheckObservation(check.id, e.target.value);
                  }}
                  className="observation-input"
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Botões de Navegação */}
      <div className="action-buttons">
        <button
          onClick={nextStage}
          disabled={!areBasicChecksComplete()}
          className={`action-btn ${areBasicChecksComplete() ? 'primary' : 'secondary'}`}
        >
          {areBasicChecksComplete() ? 'Próxima Etapa →' : 'Complete todas as verificações'}
        </button>
      </div>
    </div>
  );
};

export default BasicChecksStage; 