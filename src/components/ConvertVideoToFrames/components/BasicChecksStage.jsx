import React, { useState } from 'react';
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
  const [activeSection, setActiveSection] = useState('vehicle');
  const [expandedCheck, setExpandedCheck] = useState(null);

  const toggleCheck = (checkId) => {
    setExpandedCheck(expandedCheck === checkId ? null : checkId);
  };

  const handleStatusSelect = (checkId, status) => {
    updateBasicCheck(checkId, status);
    // Auto-collapse after selection for better flow
    setTimeout(() => setExpandedCheck(null), 500);
  };

  const stats = getStatusStats();

  return (
    <div className="stage1-mobile-container">
      {/* Mobile Header */}
      <div className="stage1-mobile-header">
        <div className="stage-badge">
          <span className="stage-number">1</span>
        </div>
        <div className="stage-title">
          <h2>Verificações Básicas</h2>
          <p>Complete todas as verificações para prosseguir</p>
        </div>
        <div className="progress-circle">
          <div className="progress-ring">
            <svg width="60" height="60">
              <circle
                cx="30"
                cy="30"
                r="25"
                stroke="rgba(37, 99, 235, 0.2)"
                strokeWidth="4"
                fill="none"
              />
              <circle
                cx="30"
                cy="30"
                r="25"
                stroke="var(--color-primary)"
                strokeWidth="4"
                fill="none"
                strokeDasharray={`${(completedBasicChecks / 9) * 157} 157`}
                strokeLinecap="round"
                transform="rotate(-90 30 30)"
                className="progress-circle-fill"
              />
            </svg>
            <div className="progress-text">
              <span className="progress-number">{completedBasicChecks}</span>
              <span className="progress-total">/9</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Tabs */}
      <div className="stage1-mobile-tabs">
        <button 
          className={`mobile-tab ${activeSection === 'vehicle' ? 'active' : ''}`}
          onClick={() => setActiveSection('vehicle')}
        >
          <span className="tab-icon">🚛</span>
          <span className="tab-text">Veículo</span>
        </button>
        <button 
          className={`mobile-tab ${activeSection === 'checks' ? 'active' : ''}`}
          onClick={() => setActiveSection('checks')}
        >
          <span className="tab-icon">✅</span>
          <span className="tab-text">Verificações</span>
          {completedBasicChecks > 0 && (
            <span className="tab-badge">{completedBasicChecks}</span>
          )}
        </button>
        <button 
          className={`mobile-tab ${activeSection === 'summary' ? 'active' : ''}`}
          onClick={() => setActiveSection('summary')}
        >
          <span className="tab-icon">📊</span>
          <span className="tab-text">Resumo</span>
        </button>
      </div>

      {/* Tab Content */}
      <div className="stage1-tab-content">
        {/* Vehicle Information Tab */}
        {activeSection === 'vehicle' && (
          <div className="vehicle-tab fade-in">
            <div className="mobile-card">
              <div className="card-header-mobile">
                <h3>Informações do Veículo</h3>
                <p>Preencha os dados básicos do veículo</p>
              </div>
              
              <div className="form-stack-mobile">
                <div className="form-field-mobile">
                  <label className="field-label-mobile">
                    <span className="label-icon">🚗</span>
                    <span className="label-text">Placa do Veículo</span>
                  </label>
                  <input
                    type="text"
                    value={vehicleInfo.plate}
                    onChange={(e) => updateVehicleInfo('plate', e.target.value.toUpperCase())}
                    placeholder="ABC-1234"
                    className="field-input-mobile"
                    maxLength="8"
                  />
                </div>
                
                <div className="form-field-mobile">
                  <label className="field-label-mobile">
                    <span className="label-icon">🚚</span>
                    <span className="label-text">Modelo do Veículo</span>
                  </label>
                  <input
                    type="text"
                    value={vehicleInfo.model}
                    onChange={(e) => updateVehicleInfo('model', e.target.value)}
                    placeholder="Mercedes-Benz Actros 2651"
                    className="field-input-mobile"
                  />
                </div>
                
                <div className="form-field-mobile">
                  <label className="field-label-mobile">
                    <span className="label-icon">👤</span>
                    <span className="label-text">Nome do Motorista</span>
                  </label>
                  <input
                    type="text"
                    value={vehicleInfo.driver}
                    onChange={(e) => updateVehicleInfo('driver', e.target.value)}
                    placeholder="Nome completo do motorista"
                    className="field-input-mobile"
                  />
                </div>
                
                <div className="form-field-mobile">
                  <label className="field-label-mobile">
                    <span className="label-icon">🔍</span>
                    <span className="label-text">Nome do Inspetor</span>
                  </label>
                  <input
                    type="text"
                    value={vehicleInfo.inspector}
                    onChange={(e) => updateVehicleInfo('inspector', e.target.value)}
                    placeholder="Nome completo do inspetor"
                    className="field-input-mobile"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Checks Tab */}
        {activeSection === 'checks' && (
          <div className="checks-tab fade-in">
            <div className="checks-list-mobile">
              {basicChecks.map((check) => (
                <div
                  key={check.id} 
                  className={`check-card-mobile ${check.isCompleted ? 'completed' : ''} ${expandedCheck === check.id ? 'expanded' : ''}`}
                >
                  <div 
                    className="check-header-mobile"
                    onClick={() => !check.isCompleted && toggleCheck(check.id)}
                  >
                    <div className="check-number-mobile">
                      {check.isCompleted ? '✓' : check.id}
                    </div>
                    <div className="check-info-mobile">
                      <h4 className="check-title-mobile">{check.name}</h4>
                      <p className="check-description-mobile">{check.description}</p>
                    </div>
                    <div className="check-status-mobile">
                      {check.isCompleted ? (
                        <div className={`status-indicator ${check.status}`}>
                          {check.status === 'ok' ? '✅' : 
                           check.status === 'not_ok' ? '❌' : '➖'}
                        </div>
                      ) : (
                        <div className="expand-arrow">
                          {expandedCheck === check.id ? '▲' : '▼'}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Expanded Content */}
                  {expandedCheck === check.id && !check.isCompleted && (
                    <div className="check-expanded-mobile">
                      <div className="status-options-mobile">
                        <button
                          onClick={() => handleStatusSelect(check.id, 'ok')}
                          className="status-option-mobile success"
                        >
                          <span className="option-icon">✅</span>
                          <span className="option-text">Conforme</span>
                        </button>
                        <button
                          onClick={() => handleStatusSelect(check.id, 'not_ok')}
                          className="status-option-mobile danger"
                        >
                          <span className="option-icon">❌</span>
                          <span className="option-text">Não Conforme</span>
                        </button>
                        <button
                          onClick={() => handleStatusSelect(check.id, 'na')}
                          className="status-option-mobile warning"
                        >
                          <span className="option-icon">➖</span>
                          <span className="option-text">Não Aplicável</span>
                        </button>
                      </div>
                      
                      <div className="observation-field-mobile">
                        <textarea
                          placeholder="Adicionar observação (opcional)"
                          value={check.observation}
                          onChange={(e) => updateBasicCheckObservation(check.id, e.target.value)}
                          className="observation-textarea-mobile"
                          rows="3"
                        />
                      </div>
                    </div>
                  )}

                  {/* Completed Status Display */}
                  {check.isCompleted && (
                    <div className="check-completed-mobile">
                      <div className="completed-status">
                        <span className="status-label">Status:</span>
                        <span className={`status-value ${check.status}`}>
                          {check.status === 'ok' ? 'Conforme' : 
                           check.status === 'not_ok' ? 'Não Conforme' : 'Não Aplicável'}
                        </span>
                      </div>
                      {check.observation && (
                        <div className="completed-observation">
                          <span className="observation-label">Observação:</span>
                          <span className="observation-value">{check.observation}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Summary Tab */}
        {activeSection === 'summary' && (
          <div className="summary-tab fade-in">
            <div className="mobile-card">
              <div className="card-header-mobile">
                <h3>Resumo das Verificações</h3>
                <p>Status geral do checklist</p>
              </div>
              
              <div className="summary-stats-mobile">
                <div className="stat-card-mobile success">
                  <div className="stat-icon-mobile">✅</div>
                  <div className="stat-content-mobile">
                    <div className="stat-number-mobile">{stats.ok}</div>
                    <div className="stat-label-mobile">Conforme</div>
                  </div>
                </div>
                
                <div className="stat-card-mobile danger">
                  <div className="stat-icon-mobile">❌</div>
                  <div className="stat-content-mobile">
                    <div className="stat-number-mobile">{stats.not_ok}</div>
                    <div className="stat-label-mobile">Não Conforme</div>
                  </div>
                </div>
                
                <div className="stat-card-mobile warning">
                  <div className="stat-icon-mobile">➖</div>
                  <div className="stat-content-mobile">
                    <div className="stat-number-mobile">{stats.na}</div>
                    <div className="stat-label-mobile">Não Aplicável</div>
                  </div>
                </div>
                
                <div className="stat-card-mobile info">
                  <div className="stat-icon-mobile">⏳</div>
                  <div className="stat-content-mobile">
                    <div className="stat-number-mobile">{stats.pending}</div>
                    <div className="stat-label-mobile">Pendente</div>
                  </div>
                </div>
              </div>

              {/* Progress Summary */}
              <div className="progress-summary-mobile">
                <div className="progress-bar-mobile">
                  <div 
                    className="progress-fill-mobile"
                    style={{ width: `${(completedBasicChecks / 9) * 100}%` }}
                  />
                </div>
                <div className="progress-label-mobile">
                  {completedBasicChecks} de 9 verificações concluídas
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Fixed Bottom Action */}
      <div className="stage1-bottom-action">
        <button
          onClick={nextStage}
          disabled={!areBasicChecksComplete()}
          className={`next-stage-btn-mobile ${areBasicChecksComplete() ? 'enabled' : 'disabled'}`}
        >
          {areBasicChecksComplete() ? (
            <>
              <span>Próxima Etapa</span>
              <span className="btn-icon">→</span>
            </>
          ) : (
            <>
              <span>Complete {9 - completedBasicChecks} verificações</span>
              <span className="btn-icon">⏳</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default BasicChecksStage;