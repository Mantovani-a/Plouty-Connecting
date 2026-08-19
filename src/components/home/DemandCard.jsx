import React, { useEffect, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';
import CurrencyField from '../common/CurrencyField';
import DateField from '../common/DateField';
import { formatISODateShort, validateDateInput } from '../../utils/dateUtils';
import { formatCurrencyBRL, validateCurrencyInput } from '../../utils/currencyUtils';

const urgencyTone = {
  Alta: 'danger',
  Média: 'warning',
  Baixa: 'neutral'
};

function getTodayIsoInSaoPaulo() {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Sao_Paulo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).formatToParts(new Date());
  const part = (type) => parts.find((item) => item.type === type)?.value;
  return `${part('year')}-${part('month')}-${part('day')}`;
}

export default function DemandCard({ demand, compact = false, headingLevel = 2 }) {
  const [saved, setSaved] = useState(false);
  const [proposalOpen, setProposalOpen] = useState(false);
  const [proposalSent, setProposalSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [proposalFeedback, setProposalFeedback] = useState('');
  const [proposalForm, setProposalForm] = useState({
    amountDisplay: '',
    amountValue: null,
    amountError: '',
    deliveryDate: '',
    deliveryIso: null,
    deliveryError: '',
    note: ''
  });
  const submitTimerRef = useRef(null);
  const Heading = headingLevel === 3 ? 'h3' : 'h2';
  const ProposalHeading = headingLevel === 3 ? 'h4' : 'h3';
  const proposalMinDate = getTodayIsoInSaoPaulo();
  const deliveryDateLabel = formatISODateShort(demand.deliveryDate) || demand.delivery?.date;
  const proposalDeadlineLabel = formatISODateShort(demand.proposalDeadline) || demand.proposalDeadlineLabel;
  const publishedDateLabel = formatISODateShort(demand.publishedAt);
  const proposalFormId = `proposal-form-${demand.id}`;
  const proposalIsValid = Boolean(
    proposalForm.amountValue > 0
    && !proposalForm.amountError
    && proposalForm.deliveryIso
    && !proposalForm.deliveryError
  );

  useEffect(() => () => {
    if (submitTimerRef.current) window.clearTimeout(submitTimerRef.current);
  }, []);

  const handleCurrencyChange = (event, meta) => {
    setProposalForm((current) => ({
      ...current,
      amountDisplay: meta.displayValue,
      amountValue: meta.numericValue,
      amountError: meta.validationMessage || ''
    }));
    setProposalFeedback(meta.rejected ? 'O valor não foi alterado. Revise os caracteres informados.' : '');
  };

  const handleDeliveryChange = (event, meta) => {
    setProposalForm((current) => ({
      ...current,
      deliveryDate: meta.displayValue,
      deliveryIso: meta.isoValue,
      deliveryError: meta.isComplete && !meta.isValid ? meta.validationMessage : ''
    }));
    setProposalFeedback(meta.isComplete && !meta.isValid ? 'Revise a data prevista para continuar.' : '');
  };

  const handleDeliveryBlur = (event, meta) => {
    setProposalForm((current) => ({ ...current, deliveryError: meta.validationMessage || '' }));
    if (meta.validationMessage) setProposalFeedback('Revise a data prevista para continuar.');
  };

  const handleSubmitProposal = (event) => {
    event.preventDefault();
    if (isSubmitting || proposalSent) return;

    const amountError = proposalForm.amountError || validateCurrencyInput(proposalForm.amountDisplay, { required: true });
    const deliveryError = validateDateInput(proposalForm.deliveryDate, { required: true, min: proposalMinDate });
    if (amountError || deliveryError) {
      setProposalForm((current) => ({ ...current, amountError, deliveryError }));
      setProposalFeedback('Revise os campos destacados antes de confirmar a proposta.');
      return;
    }

    setProposalFeedback('');
    setIsSubmitting(true);
    submitTimerRef.current = window.setTimeout(() => {
      setIsSubmitting(false);
      setProposalSent(true);
      setProposalOpen(false);
      submitTimerRef.current = null;
    }, 650);
  };

  return (
    <article className={`opportunity-card ${compact ? 'opportunity-card-compact' : ''}`}>
      <div className="opportunity-accent" aria-hidden="true" />
      <div className="opportunity-main">
        <div className="opportunity-topline d-flex align-items-start justify-content-between gap-3">
          <div className="institution-line d-flex align-items-center gap-2">
            <span className="institution-mark d-inline-flex align-items-center justify-content-center flex-shrink-0" aria-hidden="true"><i className={`bi ${demand.icon}`} /></span>
            <div className="d-flex flex-column">
              <span>{demand.institutionType}</span>
              <strong>{demand.institution}</strong>
            </div>
            {demand.verified && <i className="bi bi-patch-check-fill verified-icon" title="Instituição verificada" aria-label="Instituição verificada" />}
          </div>
          <div className="opportunity-badges d-flex align-items-center gap-2 flex-shrink-0">
            <span className={`status-chip status-${urgencyTone[demand.urgency]}`}>{demand.urgency === 'Alta' ? 'Urgente' : demand.status}</span>
            <button type="button" className={`save-button d-inline-flex align-items-center justify-content-center ${saved ? 'is-saved' : ''}`} onClick={() => setSaved((value) => !value)} aria-pressed={saved} aria-label={saved ? 'Remover oportunidade dos salvos' : 'Salvar oportunidade'}>
              <i className={`bi ${saved ? 'bi-bookmark-fill' : 'bi-bookmark'}`} aria-hidden="true" />
            </button>
          </div>
        </div>

        <div className="opportunity-heading">
          <div>
            <Heading>{demand.title}</Heading>
            <p className="mb-0">{demand.description}</p>
          </div>
          <strong className="price-range">{demand.priceRange}</strong>
        </div>

        <dl className="opportunity-facts">
          <div><dt><i className="bi bi-box-seam" aria-hidden="true" /> Quantidade</dt><dd>{demand.quantity}</dd></div>
          <div><dt><i className="bi bi-geo-alt" aria-hidden="true" /> Localização</dt><dd>{demand.location} <small>· {demand.distance}</small></dd></div>
          <div><dt><i className="bi bi-calendar2-week" aria-hidden="true" /> Entrega</dt><dd>{deliveryDateLabel} <small>· {demand.delivery.frequency}</small></dd></div>
          <div><dt><i className="bi bi-hourglass-split" aria-hidden="true" /> Propostas</dt><dd className={demand.urgency === 'Alta' ? 'deadline-urgent' : ''}>Até {proposalDeadlineLabel} <small>· {demand.proposalsCount} enviadas</small></dd></div>
        </dl>

        {!compact && (
          <div className="opportunity-details">
            <p><i className="bi bi-truck" aria-hidden="true" /><span><strong>Logística</strong>{demand.logistics}</span></p>
            <p><i className="bi bi-clipboard-check" aria-hidden="true" /><span><strong>Requisitos</strong>{demand.requirements.join(' · ')}</span></p>
          </div>
        )}

        <div className="opportunity-actions d-flex align-items-center gap-3 mt-3 flex-wrap">
          {proposalSent ? (
            <span className="proposal-submission-feedback d-inline-flex align-items-center gap-2" role="status">
              <i className="bi bi-check-circle-fill" aria-hidden="true" />
              <span>Proposta registrada na demonstração <small>Somente nesta sessão</small></span>
            </span>
          ) : (
            <button type="button" className="btn btn-primary" onClick={() => setProposalOpen((open) => !open)} aria-expanded={proposalOpen} aria-controls={proposalFormId} disabled={isSubmitting} aria-busy={isSubmitting || undefined}>
              Enviar proposta <i className="bi bi-arrow-right" aria-hidden="true" />
            </button>
          )}
          <NavLink to={`/explorar?search=${encodeURIComponent(demand.product)}`} className="text-link">Ver oportunidade</NavLink>
          <span className="published-time ms-auto">Publicada em {publishedDateLabel || demand.timeAgo}</span>
        </div>

        {proposalOpen && (
          <form id={proposalFormId} className="proposal-form-panel" onSubmit={handleSubmitProposal} noValidate>
            <div className="proposal-form-header d-flex align-items-center justify-content-between gap-3 pb-3">
              <div className="proposal-form-title d-flex align-items-start gap-3">
                <i className="bi bi-file-earmark-text d-inline-flex align-items-center justify-content-center flex-shrink-0" aria-hidden="true" />
                <div className="d-flex flex-column">
                  <ProposalHeading>{demand.title}</ProposalHeading>
                  <p className="mb-0">Informe o valor e quando consegue realizar a entrega.</p>
                </div>
              </div>
              <button type="button" className="icon-button" onClick={() => setProposalOpen(false)} aria-label="Fechar formulário de proposta" disabled={isSubmitting}>
                <i className="bi bi-x-lg" aria-hidden="true" />
              </button>
            </div>

            <div className="proposal-form-grid">
              <CurrencyField
                id={`proposal-value-${demand.id}`}
                label="Valor total"
                value={proposalForm.amountDisplay}
                required
                disabled={isSubmitting}
                error={proposalForm.amountError}
                hint="Use vírgula para os centavos."
                onChange={handleCurrencyChange}
              />
              <DateField
                id={`proposal-delivery-${demand.id}`}
                label="Previsão de entrega"
                value={proposalForm.deliveryDate}
                required
                min={proposalMinDate}
                disabled={isSubmitting}
                error={proposalForm.deliveryError}
                onChange={handleDeliveryChange}
                onBlur={handleDeliveryBlur}
              />
              <div className="proposal-field proposal-note-field">
                <label className="form-label" htmlFor={`proposal-note-${demand.id}`}>Observação</label>
                <textarea
                  id={`proposal-note-${demand.id}`}
                  value={proposalForm.note}
                  maxLength={320}
                  disabled={isSubmitting}
                  aria-describedby={`proposal-note-hint-${demand.id}`}
                  placeholder="Ex.: disponibilidade por lote, condições de transporte ou detalhes da entrega."
                  onChange={(event) => setProposalForm((current) => ({ ...current, note: event.target.value }))}
                />
                <div className="proposal-note-meta d-flex justify-content-between mt-1" id={`proposal-note-hint-${demand.id}`}>
                  <span>Opcional — não inclua dados pessoais sensíveis.</span>
                  <span aria-label={`${proposalForm.note.length} de 320 caracteres`}>{proposalForm.note.length}/320</span>
                </div>
              </div>
            </div>

            {proposalIsValid && (
              <div className="proposal-ready-summary d-flex align-items-center gap-2 mt-3 p-2" aria-live="polite">
                <i className="bi bi-check2-circle" aria-hidden="true" />
                <span>Resumo: <strong>{formatCurrencyBRL(proposalForm.amountValue)}</strong>, com entrega prevista para <strong>{proposalForm.deliveryDate}</strong>.</span>
              </div>
            )}

            <p className="proposal-form-feedback" role={proposalFeedback ? 'alert' : undefined} aria-live="polite">
              {proposalFeedback && <><i className="bi bi-exclamation-circle" aria-hidden="true" /> {proposalFeedback}</>}
            </p>

            <div className="proposal-form-footer d-flex align-items-center justify-content-between gap-3 mt-3 flex-wrap">
              <p className="proposal-form-disclaimer mb-0">
                <i className="bi bi-info-circle" aria-hidden="true" />
                Esta é uma simulação local. A proposta não será enviada nem salva em servidor.
              </p>
              <button className="btn btn-primary proposal-submit" type="submit" disabled={!proposalIsValid || isSubmitting}>
                {isSubmitting ? <><span className="proposal-submit-spinner" aria-hidden="true" /> Registrando…</> : <>Confirmar proposta <i className="bi bi-arrow-right" aria-hidden="true" /></>}
              </button>
            </div>
          </form>
        )}
      </div>
    </article>
  );
}
