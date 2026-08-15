import React, { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import {
  DATE_INPUT_MAX_LENGTH,
  DATE_INPUT_PLACEHOLDER,
  getDateCaretPosition,
  getDateInputMeta,
  getDateSeparatorDeletion,
  normalizeDateInputValue,
  validateDateInput
} from '../../utils/dateUtils';

export default function DateField({
  id,
  name,
  label,
  value,
  defaultValue = '',
  onChange,
  onBlur,
  error,
  required = false,
  disabled = false,
  readOnly = false,
  min,
  max,
  placeholder = DATE_INPUT_PLACEHOLDER,
  className = '',
  inputClassName = 'form-control',
  ...inputProps
}) {
  const generatedId = useId();
  const fieldId = id || name || `date-field-${generatedId}`;
  const errorId = `${fieldId}-error`;
  const inputRef = useRef(null);
  const pendingCaretRef = useRef(null);
  const [touched, setTouched] = useState(false);
  const [displayValue, setDisplayValue] = useState(() => normalizeDateInputValue(value ?? defaultValue));

  useEffect(() => {
    if (value !== undefined) setDisplayValue(normalizeDateInputValue(value));
  }, [value]);

  const validationOptions = { required, min, max };
  const automaticError = validateDateInput(displayValue, validationOptions);
  const hasCompleteInvalidDate = displayValue.length === DATE_INPUT_MAX_LENGTH && Boolean(automaticError);
  const visibleError = error || (touched || hasCompleteInvalidDate ? automaticError : '');
  const describedBy = [inputProps['aria-describedby'], visibleError ? errorId : null].filter(Boolean).join(' ') || undefined;

  useEffect(() => {
    inputRef.current?.setCustomValidity(error || automaticError);
  }, [automaticError, error]);

  useLayoutEffect(() => {
    if (pendingCaretRef.current == null || document.activeElement !== inputRef.current) return;
    const nextCaret = Math.min(pendingCaretRef.current, displayValue.length);
    inputRef.current.setSelectionRange(nextCaret, nextCaret);
    pendingCaretRef.current = null;
  }, [displayValue]);

  const handleChange = (event) => {
    const rawValue = event.currentTarget.value;
    const rawCaret = event.currentTarget.selectionStart ?? rawValue.length;
    const nextValue = normalizeDateInputValue(rawValue);
    const inputType = event.nativeEvent?.inputType || '';
    pendingCaretRef.current = getDateCaretPosition(
      rawValue,
      rawCaret,
      nextValue,
      inputType.startsWith('insert')
    );

    setDisplayValue(nextValue);
    event.currentTarget.value = nextValue;
    onChange?.(event, getDateInputMeta(nextValue, validationOptions));
  };

  const handleBlur = (event) => {
    setTouched(true);
    onBlur?.(event, getDateInputMeta(displayValue, validationOptions));
  };

  const handleKeyDown = (event) => {
    inputProps.onKeyDown?.(event);
    if (event.defaultPrevented || readOnly || disabled) return;
    const { selectionStart, selectionEnd, value: currentValue } = event.currentTarget;
    if (selectionStart == null || selectionEnd == null || selectionStart !== selectionEnd) return;

    const separatorDeletion = getDateSeparatorDeletion(
      currentValue,
      selectionStart,
      selectionEnd,
      event.key
    );
    if (!separatorDeletion) return;
    event.preventDefault();
    const nextValue = separatorDeletion.displayValue;
    pendingCaretRef.current = separatorDeletion.caret;
    setDisplayValue(nextValue);
    event.currentTarget.value = nextValue;
    onChange?.(event, getDateInputMeta(nextValue, validationOptions));
  };

  const handleInvalid = (event) => {
    setTouched(true);
    inputProps.onInvalid?.(event);
  };

  return (
    <div className={`date-field ${className}`.trim()}>
      {label && (
        <label className="form-label" htmlFor={fieldId}>
          {label}{required && <span aria-hidden="true"> *</span>}
        </label>
      )}
      <input
        {...inputProps}
        ref={inputRef}
        id={fieldId}
        name={name || fieldId}
        type="text"
        className={inputClassName}
        value={displayValue}
        placeholder={placeholder}
        inputMode="numeric"
        maxLength={DATE_INPUT_MAX_LENGTH}
        required={required}
        disabled={disabled}
        readOnly={readOnly}
        aria-label={!label ? (inputProps['aria-label'] || 'Data') : inputProps['aria-label']}
        aria-invalid={Boolean(visibleError) || undefined}
        aria-describedby={describedBy}
        aria-errormessage={visibleError ? errorId : undefined}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        onInvalid={handleInvalid}
      />
      {visibleError && (
        <div id={errorId} className="error-message" role="alert">
          {visibleError}
        </div>
      )}
    </div>
  );
}
