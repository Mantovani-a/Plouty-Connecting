import React from 'react';

export default function FormField({ id, label, type = 'text', value = '', onChange, onBlur, error, valid = false, placeholder, required = false, maxLength, rows, options, children }) {
  const isError = Boolean(error);
  const stateClass = isError ? 'input-error' : valid ? 'is-valid-field' : '';
  const errorId = `error-${id}`;
  const counterId = `counter-${id}`;
  const describedBy = [isError ? errorId : null, maxLength ? counterId : null].filter(Boolean).join(' ') || undefined;
  const sharedProps = { id, name: id, value, onChange, onBlur, required, 'aria-invalid': isError || undefined, 'aria-describedby': describedBy };

  return (
    <div className="mb-3 text-start">
      {label && <label htmlFor={id} className="form-label">{label}{required && <span aria-hidden="true"> *</span>}</label>}
      {type === 'textarea' ? (
        <textarea {...sharedProps} className={`form-control ${stateClass}`} rows={rows || 5} placeholder={placeholder} maxLength={maxLength} />
      ) : type === 'select' ? (
        <select {...sharedProps} className={`form-select ${stateClass}`}>
          {options?.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}{children}
        </select>
      ) : (
        <input {...sharedProps} type={type} className={`form-control ${stateClass}`} placeholder={placeholder} />
      )}
      {(isError || maxLength) && (
        <div className="d-flex justify-content-between align-items-center mt-1">
          <div className="error-message" id={errorId} role={isError ? 'alert' : undefined}>{error}</div>
          {maxLength && <div className={`char-counter ${value.length >= maxLength ? 'limit-reached' : ''}`} id={counterId}>{value.length} / {maxLength} caracteres</div>}
        </div>
      )}
    </div>
  );
}
