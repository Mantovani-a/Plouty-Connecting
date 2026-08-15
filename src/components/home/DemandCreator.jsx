import React, { useState } from 'react';
import DateField from '../common/DateField';
import QuantityField from '../common/QuantityField';
import { dateInputToIso, validateDateInput } from '../../utils/dateUtils';
import { getQuantityCategoryForUnit, validateQuantityValue } from '../../utils/quantityUtils';

const INITIAL_FORM = {
  product: '',
  quantityValue: '',
  quantityUnit: 'kg',
  quantityValidation: '',
  deadline: '',
  delivery: '',
  notes: ''
};

let localDemandId = 1000;

export default function DemandCreator({ onAddDemand, onCancel }) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});

  const update = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: '' }));
  };

  const updateQuantity = ({ value, unit, validationMessage }) => {
    setForm((current) => ({
      ...current,
      quantityValue: value,
      quantityUnit: unit || current.quantityUnit,
      quantityValidation: validationMessage || ''
    }));
    setErrors((current) => ({ ...current, quantityValue: '' }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const quantityCategory = getQuantityCategoryForUnit(form.quantityUnit);
    const deadlineISO = dateInputToIso(form.deadline);
    const deliveryISO = dateInputToIso(form.delivery);
    const nextErrors = {
      product: form.product.trim() ? '' : 'Informe o produto ou a categoria.',
      quantityValue:
        form.quantityValidation ||
        validateQuantityValue(form.quantityValue, { category: quantityCategory, required: true }),
      deadline: validateDateInput(form.deadline, { required: true }),
      delivery: validateDateInput(form.delivery, { required: true })
    };

    if (!nextErrors.delivery && deadlineISO && deliveryISO && deliveryISO < deadlineISO) {
      nextErrors.delivery = 'A entrega não pode acontecer antes do prazo para propostas.';
    }

    setErrors(nextErrors);
    if (Object.values(nextErrors).some(Boolean)) return;

    onAddDemand({
      id: ++localDemandId,
      product: form.product.trim(),
      quantity: `${form.quantityValue} ${form.quantityUnit}`,
      quantityValue: form.quantityValue,
      quantityUnit: form.quantityUnit,
      deadline: deadlineISO,
      delivery: deliveryISO,
      notes: form.notes.trim(),
      status: 'Rascunho publicado',
      proposals: 0,
      isMock: true
    });
    setForm(INITIAL_FORM);
    setErrors({});
  };

  return (
    <form className="demand-composer" onSubmit={handleSubmit} noValidate>
      <div className="section-title-row">
        <div>
          <span className="eyebrow">Nova compra</span>
          <h2>Publicar demanda</h2>
          <p>Informe o essencial para receber propostas comparáveis.</p>
        </div>
        {onCancel && (
          <button
            type="button"
            className="icon-button"
            onClick={onCancel}
            aria-label="Fechar formulário"
          >
            <i className="bi bi-x-lg" />
          </button>
        )}
      </div>

      <div className="demand-composer-grid">
        <div className="composer-field">
          <label htmlFor="demand-product">
            Produto ou categoria <span aria-hidden="true">*</span>
          </label>
          <input
            id="demand-product"
            value={form.product}
            onChange={(event) => update('product', event.target.value)}
            placeholder="Ex.: banana-prata"
            aria-invalid={Boolean(errors.product)}
            aria-describedby={errors.product ? 'demand-product-error' : undefined}
          />
          {errors.product && (
            <div id="demand-product-error" className="error-message" role="alert">
              {errors.product}
            </div>
          )}
        </div>

        <QuantityField
          id="demand-quantity"
          label="Quantidade e unidade"
          value={form.quantityValue}
          unit={form.quantityUnit}
          category="all"
          required
          error={errors.quantityValue}
          onQuantityChange={updateQuantity}
        />

        <DateField
          id="demand-deadline"
          label="Prazo para propostas"
          value={form.deadline}
          required
          error={errors.deadline}
          onChange={(event, meta) => update('deadline', meta.displayValue)}
        />

        <DateField
          id="demand-delivery"
          label="Previsão de entrega"
          value={form.delivery}
          required
          min={dateInputToIso(form.deadline) || undefined}
          error={errors.delivery}
          onChange={(event, meta) => update('delivery', meta.displayValue)}
        />

        <label className="composer-notes">
          Observações
          <textarea
            rows="3"
            value={form.notes}
            onChange={(event) => update('notes', event.target.value)}
            placeholder="Logística, frequência e requisitos principais"
          />
        </label>
      </div>

      <div className="editor-actions">
        <small>
          <i className="bi bi-info-circle" /> Publicação local, sem integração com servidor.
        </small>
        <button className="btn btn-primary" type="submit">
          Publicar demanda
        </button>
      </div>
    </form>
  );
}
