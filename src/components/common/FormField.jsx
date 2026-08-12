import React from 'react';

export default function FormField({
  id,
  label,
  type = 'text',
  value,
  onChange,
  onBlur,
  error,
  placeholder,
  required = false,
  maxLength,
  rows,
  options,
  children
}) {
  const isError = Boolean(error);

  return (
    <div className="mb-3 text-start">
      {label && (
        <label htmlFor={id} className="form-label">
          {label}
        </label>
      )}

      {type === 'textarea' ? (
        <>
          <textarea
            id={id}
            name={id}
            className={`form-control ${isError ? 'input-error' : ''}`}
            rows={rows || 5}
            placeholder={placeholder}
            maxLength={maxLength}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            required={required}
          ></textarea>
          <div className="d-flex justify-content-between align-items-center mt-1">
            <div
              className="error-message"
              id={`error-${id}`}
              style={{ display: isError ? 'block' : 'none' }}
            >
              {error}
            </div>
            {maxLength && (
              <div
                className={`char-counter ${value.length >= maxLength ? 'limit-reached' : ''}`}
                id="char-counter"
              >
                {value.length} / {maxLength} caracteres
              </div>
            )}
          </div>
        </>
      ) : type === 'select' ? (
        <>
          <select
            id={id}
            name={id}
            className={`form-select ${isError ? 'input-error' : ''}`}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            required={required}
          >
            {options &&
              options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            {children}
          </select>
          {isError && (
            <div className="error-message d-block" id={`error-${id}`}>
              {error}
            </div>
          )}
        </>
      ) : (
        <>
          <input
            type={type}
            id={id}
            name={id}
            className={`form-control ${isError ? 'input-error' : ''}`}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            required={required}
          />
          {isError && (
            <div className="error-message d-block" id={`error-${id}`}>
              {error}
            </div>
          )}
        </>
      )}
    </div>
  );
}
