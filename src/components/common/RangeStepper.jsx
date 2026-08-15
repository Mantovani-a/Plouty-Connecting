import React, { useCallback, useEffect, useRef } from 'react';

const REPEAT_DELAY_MS = 420;
const REPEAT_INTERVAL_MS = 95;

function decimalPlaces(value) {
  const text = String(value).toLowerCase();
  if (text.includes('e-')) return Number(text.split('e-')[1]);
  return (text.split('.')[1] || '').length;
}

function normalizeValue(value, min, max, step) {
  const precision = Math.min(10, Math.max(decimalPlaces(min), decimalPlaces(max), decimalPlaces(step)));
  const stepsFromMinimum = Math.round((Number(value) - min) / step);
  const steppedValue = min + (stepsFromMinimum * step);
  const clampedValue = Math.min(max, Math.max(min, steppedValue));
  return Number(clampedValue.toFixed(precision));
}

export default function RangeStepper({
  id,
  label,
  value,
  min,
  max,
  step,
  onChange,
  formatValue = (currentValue) => String(currentValue),
  getValueText,
  decreaseLabel,
  increaseLabel,
  className = '',
}) {
  const repeatDelayRef = useRef(null);
  const repeatIntervalRef = useRef(null);
  const resetClickSuppressionRef = useRef(null);
  const activeKeyRef = useRef(null);
  const suppressKeyboardClickRef = useRef(false);
  const valueRef = useRef(value);
  const configRef = useRef({ min, max, step, onChange });

  const normalizedValue = normalizeValue(value, min, max, step);
  valueRef.current = normalizedValue;
  configRef.current = { min, max, step, onChange };

  const stopRepeat = useCallback(() => {
    if (repeatDelayRef.current !== null) {
      window.clearTimeout(repeatDelayRef.current);
      repeatDelayRef.current = null;
    }
    if (repeatIntervalRef.current !== null) {
      window.clearInterval(repeatIntervalRef.current);
      repeatIntervalRef.current = null;
    }
  }, []);

  const changeByStep = useCallback((direction) => {
    const currentConfig = configRef.current;
    const currentValue = normalizeValue(
      valueRef.current,
      currentConfig.min,
      currentConfig.max,
      currentConfig.step,
    );
    const nextValue = normalizeValue(
      currentValue + (direction * currentConfig.step),
      currentConfig.min,
      currentConfig.max,
      currentConfig.step,
    );

    if (nextValue === currentValue) return false;

    valueRef.current = nextValue;
    currentConfig.onChange(nextValue);
    return true;
  }, []);

  const startRepeat = useCallback((direction) => {
    stopRepeat();
    if (!changeByStep(direction)) return;

    repeatDelayRef.current = window.setTimeout(() => {
      repeatDelayRef.current = null;
      repeatIntervalRef.current = window.setInterval(() => {
        if (!changeByStep(direction)) stopRepeat();
      }, REPEAT_INTERVAL_MS);
    }, REPEAT_DELAY_MS);
  }, [changeByStep, stopRepeat]);

  useEffect(() => {
    const stopWhenHidden = () => {
      if (document.hidden) stopRepeat();
    };

    window.addEventListener('pointerup', stopRepeat);
    window.addEventListener('pointercancel', stopRepeat);
    window.addEventListener('blur', stopRepeat);
    document.addEventListener('visibilitychange', stopWhenHidden);

    return () => {
      stopRepeat();
      if (resetClickSuppressionRef.current !== null) {
        window.clearTimeout(resetClickSuppressionRef.current);
      }
      window.removeEventListener('pointerup', stopRepeat);
      window.removeEventListener('pointercancel', stopRepeat);
      window.removeEventListener('blur', stopRepeat);
      document.removeEventListener('visibilitychange', stopWhenHidden);
    };
  }, [stopRepeat]);

  const handlePointerDown = (direction, disabled) => (event) => {
    if (disabled || event.button !== 0) return;
    event.preventDefault();
    event.currentTarget.focus();
    event.currentTarget.setPointerCapture?.(event.pointerId);
    startRepeat(direction);
  };

  const handleKeyDown = (direction, disabled) => (event) => {
    if (disabled || (event.key !== 'Enter' && event.key !== ' ')) return;
    event.preventDefault();
    suppressKeyboardClickRef.current = true;
    if (event.repeat || activeKeyRef.current) return;
    activeKeyRef.current = event.key;
    startRepeat(direction);
  };

  const handleKeyUp = (event) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    activeKeyRef.current = null;
    stopRepeat();
    if (resetClickSuppressionRef.current !== null) {
      window.clearTimeout(resetClickSuppressionRef.current);
    }
    resetClickSuppressionRef.current = window.setTimeout(() => {
      suppressKeyboardClickRef.current = false;
      resetClickSuppressionRef.current = null;
    }, 0);
  };

  const handleButtonClick = (direction, disabled) => (event) => {
    if (event.detail !== 0) {
      event.preventDefault();
      return;
    }
    if (suppressKeyboardClickRef.current) {
      suppressKeyboardClickRef.current = false;
      event.preventDefault();
      return;
    }
    if (!disabled) changeByStep(direction);
  };

  const handleButtonBlur = () => {
    activeKeyRef.current = null;
    suppressKeyboardClickRef.current = false;
    stopRepeat();
  };

  const handleRangeChange = (event) => {
    const currentConfig = configRef.current;
    const nextValue = normalizeValue(
      Number(event.target.value),
      currentConfig.min,
      currentConfig.max,
      currentConfig.step,
    );
    valueRef.current = nextValue;
    currentConfig.onChange(nextValue);
  };

  const displayedValue = formatValue(normalizedValue);
  const accessibleValue = getValueText ? getValueText(normalizedValue) : String(displayedValue);
  const decreaseDisabled = normalizedValue <= min;
  const increaseDisabled = normalizedValue >= max;
  const rootClassName = ['range-stepper', className].filter(Boolean).join(' ');

  return (
    <div className={rootClassName}>
      <div className="range-stepper-heading">
        <label htmlFor={id}>{label}</label>
        <output className="range-stepper-output" htmlFor={id}>
          <strong>{displayedValue}</strong>
        </output>
      </div>
      <div className="range-stepper-controls d-flex align-items-center gap-2">
        <button
          type="button"
          className="btn btn-secondary range-step-button"
          aria-label={decreaseLabel}
          aria-controls={id}
          disabled={decreaseDisabled}
          onPointerDown={handlePointerDown(-1, decreaseDisabled)}
          onPointerUp={stopRepeat}
          onPointerCancel={stopRepeat}
          onLostPointerCapture={stopRepeat}
          onKeyDown={handleKeyDown(-1, decreaseDisabled)}
          onKeyUp={handleKeyUp}
          onClick={handleButtonClick(-1, decreaseDisabled)}
          onBlur={handleButtonBlur}
        >
          <span aria-hidden="true">−</span>
        </button>
        <input
          id={id}
          className="range-stepper-input"
          type="range"
          min={min}
          max={max}
          step={step}
          value={normalizedValue}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={normalizedValue}
          aria-valuetext={accessibleValue}
          onChange={handleRangeChange}
        />
        <button
          type="button"
          className="btn btn-secondary range-step-button"
          aria-label={increaseLabel}
          aria-controls={id}
          disabled={increaseDisabled}
          onPointerDown={handlePointerDown(1, increaseDisabled)}
          onPointerUp={stopRepeat}
          onPointerCancel={stopRepeat}
          onLostPointerCapture={stopRepeat}
          onKeyDown={handleKeyDown(1, increaseDisabled)}
          onKeyUp={handleKeyUp}
          onClick={handleButtonClick(1, increaseDisabled)}
          onBlur={handleButtonBlur}
        >
          <span aria-hidden="true">+</span>
        </button>
      </div>
    </div>
  );
}
