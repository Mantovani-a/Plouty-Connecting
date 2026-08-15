import React, { useEffect, useId, useState } from 'react';
import {
  CURRENCY_INPUT_PLACEHOLDER,
  completeCurrencyInput,
  getCurrencyInputMeta,
  parseCurrencyInput,
  validateCurrencyInput
} from '../../utils/currencyUtils';

export default function CurrencyField({
  id,
  name,
  label = 'Valor',
  value = '',
  onChange,
  onBlur,
  error = '',
  required = false,
  disabled = false,
  placeholder = CURRENCY_INPUT_PLACEHOLDER,
  hint,
  className = ''
}) {
  const generatedId = useId();
  const fieldId = id || name || `currency-field-${generatedId}`;
  const errorId = `${fieldId}-error`;
  const hintId = `${fieldId}-hint`;
  const [touched, setTouched] = useState(false);
  const [attemptError, setAttemptError] = useState('');
  const [displayValue, setDisplayValue] = useState(() => parseCurrencyInput(value).displayValue);

  useEffect(() => {
    const parsed = parseCurrencyInput(value);
    if (!parsed.validationMessage) setDisplayValue(parsed.displayValue);
  }, [value]);

  const automaticError = validateCurrencyInput(displayValue, { required });
  const visibleError = error || attemptError || (touched ? automaticError : '');
  const describedBy = [hint ? hintId : null, visibleError ? errorId : null].filter(Boolean).join(' ') || undefined;

  const notifyChange = (event, nextValue, overrideError = '') => {
    const meta = getCurrencyInputMeta(nextValue, { required });
    onChange?.(event, overrideError ? { ...meta, validationMessage: overrideError, isValid: false, rejected: true } : meta);
  };

  const handleChange = (event) => {
    const parsed = parseCurrencyInput(event.currentTarget.value);
    if (parsed.validationMessage) {
      setAttemptError(parsed.validationMessage);
      notifyChange(event, displayValue, parsed.validationMessage);
      return;
    }

    setAttemptError('');
    setDisplayValue(parsed.displayValue);
    event.currentTarget.value = parsed.displayValue;
    notifyChange(event, parsed.displayValue);
  };

  const handlePaste = (event) => {
    const pastedValue = event.clipboardData.getData('text');
    const parsed = parseCurrencyInput(pastedValue);
    if (!parsed.validationMessage) return;
    event.preventDefault();
    setAttemptError(parsed.validationMessage);
    notifyChange(event, displayValue, parsed.validationMessage);
  };

  const handleBlur = (event) => {
    setTouched(true);
    const completed = completeCurrencyInput(displayValue);
    if (!completed.validationMessage && completed.numericValue != null) {
      setDisplayValue(completed.displayValue);
      event.currentTarget.value = completed.displayValue;
      setAttemptError('');
      notifyChange(event, completed.displayValue);
    }
    onBlur?.(event, getCurrencyInputMeta(completed.displayValue, { required }));
  };

  return (
    <div className={`currency-field ${className}`.trim()}>
      <label className="form-label" htmlFor={fieldId}>
        {label}{required && <span aria-hidden="true"> *</span>}
      </label>
      <div className={`currency-control ${visibleError ? 'has-error' : ''}`}>
        <span className="currency-prefix" aria-hidden="true">R$</span>
        <input
          id={fieldId}
          name={name || fieldId}
          type="text"
          value={displayValue}
          placeholder={placeholder}
          inputMode="decimal"
          autoComplete="off"
          maxLength={19}
          required={required}
          disabled={disabled}
          aria-label={`${label}, em reais`}
          aria-invalid={Boolean(visibleError) || undefined}
          aria-describedby={describedBy}
          aria-errormessage={visibleError ? errorId : undefined}
          onChange={handleChange}
          onPaste={handlePaste}
          onBlur={handleBlur}
        />
      </div>
      {hint && !visibleError && <span id={hintId} className="currency-hint">{hint}</span>}
      {visibleError && <span id={errorId} className="proposal-field-error" role="alert">{visibleError}</span>}
    </div>
  );
}
