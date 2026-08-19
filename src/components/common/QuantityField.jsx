import React, {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import { createPortal } from 'react-dom';
import {
  getQuantityMeta,
  getQuantityCategoryForUnit,
  getQuantityUnits,
  isBrazilianGroupedInteger,
  isQuantityUnitAllowed,
  normalizeQuantityCategory,
  normalizeQuantityUnit,
  sanitizeQuantityValue,
  validateQuantityValue
} from '../../utils/quantityUtils';

const VIEWPORT_GAP = 12;
const MENU_GAP = 7;
const PREFERRED_MENU_WIDTH = 232;
const FOCUSABLE_SELECTOR = 'a[href], button:not([disabled]), input:not([type="hidden"]):not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

const clamp = (value, minimum, maximum) => Math.min(Math.max(value, minimum), maximum);

function getVisibleEdgeInset(selector, edge, viewportHeight) {
  const element = document.querySelector(selector);
  if (!element || getComputedStyle(element).display === 'none') return 0;
  const rect = element.getBoundingClientRect();
  if (edge === 'top' && rect.top <= 1 && rect.bottom > 0) return Math.max(0, rect.bottom);
  if (edge === 'bottom' && rect.bottom >= viewportHeight - 1 && rect.top < viewportHeight) {
    return Math.max(0, viewportHeight - rect.top);
  }
  return 0;
}

export default function QuantityField({
  id,
  name,
  label = 'Quantidade',
  value,
  defaultValue = '',
  onChange,
  onBlur,
  unit,
  defaultUnit,
  onUnitChange,
  onQuantityChange,
  category = 'all',
  unitLabel = 'Unidade',
  error,
  required = false,
  disabled = false,
  readOnly = false,
  placeholder = 'Ex.: 120',
  className = '',
  inputClassName = 'form-control',
  selectClassName = '',
  selectProps = {},
  ...inputProps
}) {
  const generatedId = useId();
  const fieldId = id || name || `quantity-field-${generatedId}`;
  const unitId = `${fieldId}-unit`;
  const unitButtonId = `${unitId}-button`;
  const unitMenuId = `${unitId}-menu`;
  const unitLabelId = `${unitId}-label`;
  const labelId = `${fieldId}-label`;
  const errorId = `${fieldId}-error`;
  const inputRef = useRef(null);
  const rootRef = useRef(null);
  const unitButtonRef = useRef(null);
  const unitMenuRef = useRef(null);
  const flexibleCategory = category === 'all';
  const fixedCategory = normalizeQuantityCategory(category) || 'weight';
  const initialUnit = normalizeQuantityUnit(unit ?? defaultUnit);
  const fallbackUnit = flexibleCategory
    ? (getQuantityCategoryForUnit(initialUnit) ? initialUnit : 'kg')
    : (isQuantityUnitAllowed(initialUnit, fixedCategory) ? initialUnit : getQuantityUnits(fixedCategory)[0]?.value || '');
  const [selectedUnit, setSelectedUnit] = useState(fallbackUnit);
  const normalizedCategory = flexibleCategory ? (getQuantityCategoryForUnit(selectedUnit) || 'weight') : fixedCategory;
  const units = useMemo(() => flexibleCategory
    ? [...getQuantityUnits('weight'), ...getQuantityUnits('count')]
    : getQuantityUnits(normalizedCategory), [flexibleCategory, normalizedCategory]);
  const unitGroups = useMemo(() => {
    if (flexibleCategory) {
      return [
        { key: 'weight', label: 'Peso', items: getQuantityUnits('weight') },
        { key: 'count', label: 'Contagem e embalagem', items: getQuantityUnits('count') }
      ];
    }
    return [{
      key: normalizedCategory,
      label: normalizedCategory === 'weight' ? 'Peso' : 'Contagem e embalagem',
      items: units
    }];
  }, [flexibleCategory, normalizedCategory, units]);
  const flatUnits = useMemo(() => unitGroups.flatMap((group) => group.items), [unitGroups]);
  const [displayValue, setDisplayValue] = useState(() => sanitizeQuantityValue(value ?? defaultValue, getQuantityCategoryForUnit(fallbackUnit) || fixedCategory));
  const [touched, setTouched] = useState(false);
  const [inputError, setInputError] = useState('');
  const [unitMenuOpen, setUnitMenuOpen] = useState(false);
  const [activeUnitIndex, setActiveUnitIndex] = useState(() => Math.max(0, units.findIndex((item) => item.value === fallbackUnit)));
  const [menuPosition, setMenuPosition] = useState({ left: 0, top: 0, width: PREFERRED_MENU_WIDTH, maxHeight: 280, placement: 'bottom' });

  useEffect(() => {
    if (value !== undefined) setDisplayValue(sanitizeQuantityValue(value, normalizedCategory));
  }, [value]);

  useEffect(() => {
    const requestedUnit = normalizeQuantityUnit(unit);
    if ((flexibleCategory && getQuantityCategoryForUnit(requestedUnit)) || isQuantityUnitAllowed(requestedUnit, normalizedCategory)) {
      setSelectedUnit(requestedUnit);
      return;
    }
    if (!flexibleCategory && !isQuantityUnitAllowed(selectedUnit, normalizedCategory)) {
      setSelectedUnit(units[0]?.value || '');
    }
  }, [flexibleCategory, normalizedCategory, selectedUnit, unit, units]);

  const validationOptions = { category: normalizedCategory, required };
  const automaticError = validateQuantityValue(displayValue, validationOptions);
  const visibleError = error || inputError || (touched ? automaticError : '');
  const describedBy = [inputProps['aria-describedby'], visibleError ? errorId : null].filter(Boolean).join(' ') || undefined;

  useEffect(() => {
    inputRef.current?.setCustomValidity(error || inputError || automaticError);
  }, [automaticError, error, inputError]);

  const emitQuantityChange = (nextValue, nextUnit, source, interactionError = '') => {
    const meta = getQuantityMeta(nextValue, nextUnit, normalizedCategory, validationOptions);
    onQuantityChange?.({
      ...meta,
      isValid: interactionError ? false : meta.isValid,
      validationMessage: interactionError || meta.validationMessage,
      source
    });
  };

  const handleValueChange = (event) => {
    const rawValue = event.currentTarget.value;
    let nextValue = sanitizeQuantityValue(rawValue, normalizedCategory);
    let nextInputError = '';
    if (rawValue.includes('-')) {
      nextValue = displayValue;
      nextInputError = 'A quantidade não pode ser negativa.';
    } else if (normalizedCategory === 'weight' && rawValue.includes('.')) {
      nextValue = displayValue;
      nextInputError = 'Use vírgula para separar os decimais.';
    } else if (normalizedCategory === 'weight' && (rawValue.match(/,/g) || []).length > 1) {
      nextValue = displayValue;
      nextInputError = 'Use somente uma vírgula para separar os decimais.';
    } else if (normalizedCategory === 'count' && /[,.]/.test(rawValue) && !isBrazilianGroupedInteger(rawValue)) {
      nextValue = displayValue;
      nextInputError = 'Use um número inteiro para unidades, maços, caixas ou sacas.';
    } else if (normalizedCategory === 'weight' && /[^\d,.]/.test(rawValue)) {
      nextValue = displayValue;
      nextInputError = 'Use apenas números e vírgula para a quantidade.';
    } else if (normalizedCategory === 'count' && /\D/.test(rawValue) && !isBrazilianGroupedInteger(rawValue)) {
      nextValue = displayValue;
      nextInputError = 'Use apenas números inteiros para a quantidade.';
    }
    setInputError(nextInputError);
    setDisplayValue(nextValue);
    event.currentTarget.value = nextValue;
    const quantityMeta = getQuantityMeta(nextValue, selectedUnit, normalizedCategory, validationOptions);
    const meta = {
      ...quantityMeta,
      isValid: nextInputError ? false : quantityMeta.isValid,
      validationMessage: nextInputError || quantityMeta.validationMessage
    };
    onChange?.(event, meta);
    emitQuantityChange(nextValue, selectedUnit, 'value', nextInputError);
  };

  const updateMenuPosition = useCallback(() => {
    const trigger = unitButtonRef.current;
    if (!trigger || typeof window === 'undefined') return;

    const triggerRect = trigger.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const topInset = getVisibleEdgeInset('.site-header', 'top', viewportHeight);
    const bottomInset = getVisibleEdgeInset('.mobile-bottom-nav', 'bottom', viewportHeight);
    const safeTop = VIEWPORT_GAP + topInset;
    const safeBottom = viewportHeight - VIEWPORT_GAP - bottomInset;
    const width = Math.min(PREFERRED_MENU_WIDTH, viewportWidth - (VIEWPORT_GAP * 2));
    const measuredHeight = unitMenuRef.current?.getBoundingClientRect().height || 276;
    const spaceBelow = safeBottom - triggerRect.bottom - MENU_GAP;
    const spaceAbove = triggerRect.top - MENU_GAP - safeTop;
    const placement = spaceBelow >= Math.min(measuredHeight, 224) || spaceBelow >= spaceAbove ? 'bottom' : 'top';
    const availableHeight = Math.max(96, placement === 'bottom' ? spaceBelow : spaceAbove);
    const maxHeight = Math.min(312, availableHeight);
    const renderedHeight = Math.min(measuredHeight, maxHeight);
    const left = clamp(triggerRect.right - width, VIEWPORT_GAP, Math.max(VIEWPORT_GAP, viewportWidth - width - VIEWPORT_GAP));
    const top = placement === 'bottom'
      ? triggerRect.bottom + MENU_GAP
      : Math.max(safeTop, triggerRect.top - MENU_GAP - renderedHeight);

    setMenuPosition({ left, top, width, maxHeight, placement });
  }, []);

  useLayoutEffect(() => {
    if (!unitMenuOpen) return undefined;
    updateMenuPosition();
    const frameId = window.requestAnimationFrame(updateMenuPosition);
    return () => window.cancelAnimationFrame(frameId);
  }, [unitMenuOpen, updateMenuPosition]);

  useEffect(() => {
    if (!unitMenuOpen) return undefined;

    const handleViewportChange = () => updateMenuPosition();
    const handleOutsidePointer = (event) => {
      if (rootRef.current?.contains(event.target) || unitMenuRef.current?.contains(event.target)) return;
      setUnitMenuOpen(false);
    };

    document.addEventListener('pointerdown', handleOutsidePointer);
    window.addEventListener('resize', handleViewportChange);
    window.addEventListener('scroll', handleViewportChange, true);
    return () => {
      document.removeEventListener('pointerdown', handleOutsidePointer);
      window.removeEventListener('resize', handleViewportChange);
      window.removeEventListener('scroll', handleViewportChange, true);
    };
  }, [unitMenuOpen, updateMenuPosition]);

  useEffect(() => {
    if (!unitMenuOpen) return undefined;
    const frameId = window.requestAnimationFrame(() => unitMenuRef.current?.focus());
    return () => window.cancelAnimationFrame(frameId);
  }, [unitMenuOpen]);

  useEffect(() => {
    if (!unitMenuOpen) return undefined;
    const frameId = window.requestAnimationFrame(() => {
      document.getElementById(`${unitId}-option-${activeUnitIndex}`)?.scrollIntoView({ block: 'nearest' });
    });
    return () => window.cancelAnimationFrame(frameId);
  }, [activeUnitIndex, unitId, unitMenuOpen]);

  const openUnitMenu = (preferredIndex) => {
    if (disabled || readOnly || selectProps.disabled) return;
    const selectedIndex = flatUnits.findIndex((item) => item.value === selectedUnit);
    setActiveUnitIndex(preferredIndex ?? Math.max(0, selectedIndex));
    setUnitMenuOpen(true);
  };

  const closeUnitMenu = ({ restoreFocus = false } = {}) => {
    setUnitMenuOpen(false);
    if (restoreFocus) window.requestAnimationFrame(() => unitButtonRef.current?.focus());
  };

  const handleUnitSelection = (requestedUnit) => {
    const nextUnit = normalizeQuantityUnit(requestedUnit) || units[0]?.value || '';
    const nextCategory = flexibleCategory ? (getQuantityCategoryForUnit(nextUnit) || 'weight') : normalizedCategory;
    setSelectedUnit(nextUnit);
    const nextValidationOptions = { category: nextCategory, required };
    const quantityMeta = getQuantityMeta(displayValue, nextUnit, nextCategory, nextValidationOptions);
    const nextValidationMessage = validateQuantityValue(displayValue, nextValidationOptions);
    const preservedInteractionError = nextCategory === normalizedCategory ? inputError : '';
    const effectiveValidationMessage = preservedInteractionError || nextValidationMessage;
    const meta = {
      ...quantityMeta,
      value: displayValue,
      numericValue: effectiveValidationMessage ? null : quantityMeta.numericValue,
      isValid: !effectiveValidationMessage && quantityMeta.isValid,
      validationMessage: effectiveValidationMessage
    };
    const unitName = selectProps.name || `${name || fieldId}Unit`;
    const syntheticEvent = {
      type: 'change',
      target: { name: unitName, value: nextUnit },
      currentTarget: { name: unitName, value: nextUnit }
    };
    setInputError(preservedInteractionError);
    if (displayValue && effectiveValidationMessage) setTouched(true);
    onUnitChange?.(syntheticEvent, meta);
    onQuantityChange?.({ ...meta, source: 'unit' });
    closeUnitMenu({ restoreFocus: true });
  };

  const handleUnitButtonKeyDown = (event) => {
    selectProps.onKeyDown?.(event);
    if (event.defaultPrevented) return;
    if ((event.altKey && event.key === 'ArrowDown') || event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      const selectedIndex = Math.max(0, flatUnits.findIndex((item) => item.value === selectedUnit));
      openUnitMenu(event.key === 'ArrowUp' ? Math.max(0, flatUnits.length - 1) : selectedIndex);
    }
  };

  const handleUnitMenuKeyDown = (event) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      closeUnitMenu({ restoreFocus: true });
      return;
    }
    if (event.key === 'Tab') {
      event.preventDefault();
      const focusable = [...document.querySelectorAll(FOCUSABLE_SELECTOR)].filter((element) => (
        !unitMenuRef.current?.contains(element)
        && element.getClientRects().length > 0
        && element.getAttribute('aria-hidden') !== 'true'
      ));
      const currentIndex = focusable.indexOf(unitButtonRef.current);
      const nextIndex = event.shiftKey ? currentIndex - 1 : currentIndex + 1;
      const nextFocusable = focusable[nextIndex] || unitButtonRef.current;
      setUnitMenuOpen(false);
      window.requestAnimationFrame(() => nextFocusable?.focus());
      return;
    }
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp' || event.key === 'Home' || event.key === 'End') {
      event.preventDefault();
      setActiveUnitIndex((current) => {
        if (event.key === 'Home') return 0;
        if (event.key === 'End') return flatUnits.length - 1;
        const offset = event.key === 'ArrowDown' ? 1 : -1;
        return (current + offset + flatUnits.length) % flatUnits.length;
      });
      return;
    }
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleUnitSelection(flatUnits[activeUnitIndex]?.value);
    }
  };

  const handleBlur = (event) => {
    setTouched(true);
    onBlur?.(event, getQuantityMeta(displayValue, selectedUnit, normalizedCategory, validationOptions));
  };

  const handleInvalid = (event) => {
    setTouched(true);
    inputProps.onInvalid?.(event);
  };

  const selectedUnitIndex = Math.max(0, flatUnits.findIndex((item) => item.value === selectedUnit));
  const activeOptionId = `${unitId}-option-${activeUnitIndex}`;
  const unitFieldName = selectProps.name || `${name || fieldId}Unit`;
  const unitDisabled = disabled || readOnly || Boolean(selectProps.disabled);

  const unitMenu = unitMenuOpen && typeof document !== 'undefined' ? createPortal(
    <div
      ref={unitMenuRef}
      id={unitMenuId}
      className={`quantity-unit-menu opens-${menuPosition.placement}`}
      role="listbox"
      tabIndex={-1}
      aria-label={unitLabel}
      aria-activedescendant={activeOptionId}
      style={{
        '--menu-left': `${menuPosition.left}px`,
        '--menu-top': `${menuPosition.top}px`,
        '--menu-width': `${menuPosition.width}px`,
        '--menu-max-height': `${menuPosition.maxHeight}px`
      }}
      onKeyDown={handleUnitMenuKeyDown}
    >
      {unitGroups.map((group, groupIndex) => (
        <div
          key={group.key}
          className="quantity-unit-group"
          role="group"
          aria-labelledby={`${unitMenuId}-${group.key}-label`}
        >
          <div id={`${unitMenuId}-${group.key}-label`} className="quantity-unit-group-label">
            {group.label}
          </div>
          <div className="quantity-unit-options">
            {group.items.map((item) => {
              const itemIndex = flatUnits.findIndex((unitItem) => unitItem.value === item.value);
              const selected = item.value === selectedUnit;
              const active = itemIndex === activeUnitIndex;
              return (
                <button
                  key={item.value}
                  id={`${unitId}-option-${itemIndex}`}
                  type="button"
                  className={`quantity-unit-option d-flex align-items-center justify-content-between w-100${active ? ' is-active' : ''}${selected ? ' is-selected' : ''}`}
                  role="option"
                  tabIndex={-1}
                  aria-selected={selected}
                  aria-posinset={itemIndex + 1}
                  aria-setsize={flatUnits.length}
                  onPointerMove={() => setActiveUnitIndex(itemIndex)}
                  onClick={() => handleUnitSelection(item.value)}
                >
                  <span>{item.label}</span>
                  {selected && <i className="bi bi-check2" aria-hidden="true" />}
                </button>
              );
            })}
          </div>
          {groupIndex < unitGroups.length - 1 && <span className="quantity-unit-divider" aria-hidden="true" />}
        </div>
      ))}
    </div>,
    document.body
  ) : null;

  return (
    <div ref={rootRef} className={`quantity-field${visibleError ? ' has-error' : ''} ${className}`.trim()}>
      {label && (
        <label id={labelId} className="form-label" htmlFor={fieldId}>
          {label}{required && <span aria-hidden="true"> *</span>}
        </label>
      )}
      <div
        className={`quantity-field-controls${unitMenuOpen ? ' is-menu-open' : ''}`}
        role="group"
        aria-labelledby={label ? labelId : undefined}
        aria-label={!label ? 'Quantidade e unidade' : undefined}
      >
        <input
          {...inputProps}
          ref={inputRef}
          id={fieldId}
          name={name || fieldId}
          type="text"
          className={`${inputClassName} quantity-value-input`.trim()}
          value={displayValue}
          placeholder={placeholder}
          inputMode={normalizedCategory === 'weight' ? 'decimal' : 'numeric'}
          required={required}
          disabled={disabled}
          readOnly={readOnly}
          aria-label={!label ? (inputProps['aria-label'] || 'Quantidade') : inputProps['aria-label']}
          aria-invalid={Boolean(visibleError) || undefined}
          aria-describedby={describedBy}
          aria-errormessage={visibleError ? errorId : undefined}
          onChange={handleValueChange}
          onBlur={handleBlur}
          onInvalid={handleInvalid}
        />
        <span id={unitLabelId} className="visually-hidden">{unitLabel}</span>
        <input type="hidden" name={unitFieldName} value={selectedUnit} disabled={unitDisabled} />
        <button
          ref={unitButtonRef}
          id={unitButtonId}
          type="button"
          className={`quantity-unit-trigger d-inline-flex align-items-center justify-content-between gap-2 ${selectClassName}`.trim()}
          disabled={unitDisabled}
          aria-label={selectProps['aria-label'] || `${unitLabel}: ${selectedUnit}`}
          aria-haspopup="listbox"
          aria-expanded={unitMenuOpen}
          aria-controls={unitMenuId}
          aria-describedby={selectProps['aria-describedby']}
          onClick={() => unitMenuOpen ? closeUnitMenu() : openUnitMenu(selectedUnitIndex)}
          onKeyDown={handleUnitButtonKeyDown}
          onFocus={selectProps.onFocus}
          onBlur={selectProps.onBlur}
        >
          <span className="quantity-unit-current" aria-hidden="true">{selectedUnit}</span>
          <i className="bi bi-chevron-down quantity-unit-chevron" aria-hidden="true" />
        </button>
      </div>
      {visibleError && (
        <div id={errorId} className="error-message" role="alert">
          {visibleError}
        </div>
      )}
      {unitMenu}
    </div>
  );
}
