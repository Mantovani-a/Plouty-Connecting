import React, { useEffect, useMemo, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { impactSummary, operationalAlerts } from '../../data/dashboardData';

const COMPLETED_ALERTS_KEY = 'plouty.demo.completed-next-steps.v1';
const UNDO_WINDOW_MS = 6000;

function readCompletedAlerts() {
  if (typeof window === 'undefined') return [];
  try {
    const stored = JSON.parse(window.localStorage.getItem(COMPLETED_ALERTS_KEY) || '[]');
    return Array.isArray(stored) ? stored.filter((id) => operationalAlerts.some((alert) => alert.id === id)) : [];
  } catch {
    return [];
  }
}

export default function ImpactSidebar({ onOpenMessages }) {
  const [completedIds, setCompletedIds] = useState(readCompletedAlerts);
  const [undoAlert, setUndoAlert] = useState(null);
  const [announcement, setAnnouncement] = useState('');
  const undoTimerRef = useRef(null);
  const undoButtonRef = useRef(null);
  const alertSectionRef = useRef(null);
  const emptyStateRef = useRef(null);
  const visibleAlerts = useMemo(
    () => operationalAlerts.filter((alert) => !completedIds.includes(alert.id)),
    [completedIds]
  );

  useEffect(() => {
    try {
      window.localStorage.setItem(COMPLETED_ALERTS_KEY, JSON.stringify(completedIds));
    } catch {
      // A conclusão continua funcionando nesta página se o armazenamento estiver indisponível.
    }
  }, [completedIds]);

  useEffect(() => () => window.clearTimeout(undoTimerRef.current), []);

  const completeAlert = (alert) => {
    const completedIndex = visibleAlerts.findIndex((item) => item.id === alert.id);
    window.clearTimeout(undoTimerRef.current);
    setCompletedIds((current) => current.includes(alert.id) ? current : [...current, alert.id]);
    setUndoAlert(alert);
    setAnnouncement(`${alert.title} marcado como concluído.`);
    window.requestAnimationFrame(() => {
      const remainingButtons = alertSectionRef.current?.querySelectorAll('.alert-complete-button') || [];
      const nextButton = remainingButtons[Math.min(completedIndex, remainingButtons.length - 1)];
      if (nextButton) nextButton.focus();
      else emptyStateRef.current?.focus();
    });
    undoTimerRef.current = window.setTimeout(() => setUndoAlert(null), UNDO_WINDOW_MS);
  };

  const undoCompletion = () => {
    if (!undoAlert) return;
    const restoredAlert = undoAlert;
    window.clearTimeout(undoTimerRef.current);
    setCompletedIds((current) => current.filter((id) => id !== restoredAlert.id));
    setUndoAlert(null);
    setAnnouncement(`${restoredAlert.title} voltou para próximos passos.`);
    window.requestAnimationFrame(() => {
      alertSectionRef.current?.querySelector(`[data-alert-id="${restoredAlert.id}"] .alert-complete-button`)?.focus();
    });
  };

  const restoreCompletedAlerts = () => {
    window.clearTimeout(undoTimerRef.current);
    setCompletedIds([]);
    setUndoAlert(null);
    setAnnouncement('Todos os próximos passos demonstrativos foram restaurados.');
    window.requestAnimationFrame(() => {
      alertSectionRef.current?.querySelector('.alert-complete-button')?.focus();
    });
  };

  return (
    <aside className="operational-sidebar" aria-label="Atividade importante">
      <section ref={alertSectionRef} className="sidebar-section">
        <div className="section-title-row">
          <div><span className="eyebrow">Para agir agora</span><h2>Próximos passos</h2></div>
          <span className="counter-pill" aria-label={`${visibleAlerts.length} ${visibleAlerts.length === 1 ? 'próximo passo' : 'próximos passos'}`}>{visibleAlerts.length}</span>
        </div>
        <div className="alert-list">
          {visibleAlerts.map((alert) => {
            const content = (
              <>
                <span className={`activity-icon tone-${alert.tone}`}><i className={`bi ${alert.icon}`} aria-hidden="true" /></span>
                <span><strong>{alert.title}</strong><small>{alert.text}</small><em>{alert.action} <i className="bi bi-arrow-right" aria-hidden="true" /></em></span>
              </>
            );
            return (
              <div className="alert-row" key={alert.id} data-alert-id={alert.id}>
                {alert.to ? (
                  <NavLink className="alert-item" to={alert.to}>{content}</NavLink>
                ) : (
                  <button type="button" className="alert-item" onClick={() => onOpenMessages?.()}>{content}</button>
                )}
                <button
                  type="button"
                  className="alert-complete-button"
                  onClick={() => completeAlert(alert)}
                  aria-label={`Marcar ${alert.title.toLocaleLowerCase('pt-BR')} como concluído`}
                  title="Marcar como concluído"
                >
                  <i className="bi bi-check2" aria-hidden="true" />
                </button>
              </div>
            );
          })}
          {!visibleAlerts.length && (
            <div ref={emptyStateRef} className="next-steps-empty" tabIndex="-1">
              <span><i className="bi bi-check2-circle" aria-hidden="true" /></span>
              <strong>Tudo em dia por aqui</strong>
              <p>Você concluiu os próximos passos desta demonstração.</p>
            </div>
          )}
        </div>
        {undoAlert && (
          <div className="next-step-feedback" role="status">
            <i className="bi bi-check-circle-fill" aria-hidden="true" />
            <span><strong>Item concluído</strong>{undoAlert.title}</span>
            <button ref={undoButtonRef} type="button" onClick={undoCompletion}>Desfazer</button>
          </div>
        )}
        {completedIds.length > 0 && (
          <button type="button" className="restore-next-steps" onClick={restoreCompletedAlerts}>
            <i className="bi bi-arrow-counterclockwise" aria-hidden="true" />
            Restaurar itens concluídos
          </button>
        )}
        <p className="visually-hidden" aria-live="polite" aria-atomic="true">{announcement}</p>
      </section>

      <section className="sidebar-section reputation-section">
        <span className="eyebrow">Sua confiança comercial</span>
        <div className="reputation-score"><strong>4,8</strong><span><i className="bi bi-star-fill" aria-hidden="true" /> 38 avaliações</span></div>
        <div className="reputation-bars">
          <div><span>Pontualidade</span><strong>97%</strong><div className="progress-track"><i style={{ width: '97%' }} /></div></div>
          <div><span>Qualidade</span><strong>95%</strong><div className="progress-track"><i style={{ width: '95%' }} /></div></div>
          <div><span>Taxa de resposta</span><strong>96%</strong><div className="progress-track"><i style={{ width: '96%' }} /></div></div>
        </div>
        <p className="verified-docs"><i className="bi bi-shield-check" aria-hidden="true" /> CAF e identidade validadas</p>
      </section>

      <section className="impact-note">
        <span><i className="bi bi-globe-americas" aria-hidden="true" /> {impactSummary.label}</span>
        <strong>{impactSummary.value}</strong>
        <p>{impactSummary.detail}</p>
        <small>{impactSummary.footnote}</small>
      </section>
    </aside>
  );
}
