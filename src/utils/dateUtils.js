export const DATE_INPUT_MAX_LENGTH = 8;
export const DATE_INPUT_PLACEHOLDER = 'DD/MM/AA';

const ISO_DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;
const SHORT_DATE_PATTERN = /^(\d{2})\/(\d{2})\/(\d{2})$/;
const LONG_DATE_PATTERN = /^(\d{2})\/(\d{2})\/(\d{4})$/;
const LONG_DATE_DIGITS_PATTERN = /^(\d{2})(\d{2})(\d{4})$/;

const padTwoDigits = (value) => String(value).padStart(2, '0');
const asText = (value) => value == null ? '' : String(value).trim();

export function isLeapYear(year) {
  return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
}

export function getDaysInMonth(month, year) {
  if (month === 2) return isLeapYear(year) ? 29 : 28;
  if ([4, 6, 9, 11].includes(month)) return 30;
  if (month >= 1 && month <= 12) return 31;
  return 0;
}

export function isValidDateParts(day, month, year) {
  return Number.isInteger(day)
    && Number.isInteger(month)
    && Number.isInteger(year)
    && year >= 2000
    && year <= 2099
    && month >= 1
    && month <= 12
    && day >= 1
    && day <= getDaysInMonth(month, year);
}

export function sanitizeDateDigits(value) {
  return asText(value).replace(/\D/g, '').slice(0, 6);
}

export function maskDateInput(value) {
  const text = asText(value);
  const isoMatch = text.match(ISO_DATE_PATTERN);
  const longDateMatch = text.match(LONG_DATE_PATTERN) || text.match(LONG_DATE_DIGITS_PATTERN);

  if (isoMatch) {
    return `${isoMatch[3]}/${isoMatch[2]}/${isoMatch[1].slice(-2)}`;
  }
  if (longDateMatch) {
    return `${longDateMatch[1]}/${longDateMatch[2]}/${longDateMatch[3].slice(-2)}`;
  }

  const digits = sanitizeDateDigits(text);
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) {
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  }
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4, 6)}`;
}

export function parseIsoDate(value) {
  const match = asText(value).match(ISO_DATE_PATTERN);
  if (!match) return null;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  if (!isValidDateParts(day, month, year)) return null;

  return {
    day,
    month,
    year,
    iso: `${year}-${padTwoDigits(month)}-${padTwoDigits(day)}`,
    display: `${padTwoDigits(day)}/${padTwoDigits(month)}/${String(year).slice(-2)}`
  };
}

export function parseDateInput(value) {
  const text = asText(value);
  const parsedIso = parseIsoDate(text);
  if (parsedIso) return parsedIso;

  const shortMatch = text.match(SHORT_DATE_PATTERN);
  const longMatch = text.match(LONG_DATE_PATTERN);
  const match = shortMatch || longMatch;
  if (!match) return null;

  const day = Number(match[1]);
  const month = Number(match[2]);
  const year = shortMatch ? 2000 + Number(match[3]) : Number(match[3]);
  if (!isValidDateParts(day, month, year)) return null;

  return {
    day,
    month,
    year,
    iso: `${year}-${padTwoDigits(month)}-${padTwoDigits(day)}`,
    display: `${padTwoDigits(day)}/${padTwoDigits(month)}/${String(year).slice(-2)}`
  };
}

export function isoToDateInput(value) {
  return parseIsoDate(value)?.display || '';
}

export function normalizeDateInputValue(value) {
  const text = asText(value);
  if (!text) return '';
  if (ISO_DATE_PATTERN.test(text)) return maskDateInput(text);
  return maskDateInput(text);
}

export function getDateSeparatorDeletion(value, selectionStart, selectionEnd, key) {
  const currentValue = asText(value);
  if (!Number.isInteger(selectionStart) || selectionStart !== selectionEnd) return null;

  let nextRawValue = null;
  let caret = selectionStart;
  if (key === 'Delete' && currentValue[selectionStart] === '/' && currentValue[selectionStart + 1]) {
    nextRawValue = `${currentValue.slice(0, selectionStart + 1)}${currentValue.slice(selectionStart + 2)}`;
    caret = selectionStart + 1;
  } else if (key === 'Backspace' && currentValue[selectionStart - 1] === '/' && selectionStart >= 2) {
    nextRawValue = `${currentValue.slice(0, selectionStart - 2)}${currentValue.slice(selectionStart - 1)}`;
    caret = selectionStart - 2;
  }

  if (nextRawValue == null) return null;
  const displayValue = normalizeDateInputValue(nextRawValue);
  return { displayValue, caret: Math.min(caret, displayValue.length) };
}

export function dateInputToIso(value) {
  return parseDateInput(value)?.iso || null;
}

export function isValidDateInput(value) {
  return Boolean(parseDateInput(value));
}

export function isCompleteDateInput(value) {
  const text = asText(value);
  return ISO_DATE_PATTERN.test(text)
    || SHORT_DATE_PATTERN.test(text)
    || LONG_DATE_PATTERN.test(text);
}

export function formatDatePtBR(value, options = {}) {
  const parsed = parseDateInput(value);
  if (!parsed) return '';

  const date = new Date(Date.UTC(parsed.year, parsed.month - 1, parsed.day));
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: 'UTC',
    ...options
  }).format(date);
}

export function formatISODateShort(value) {
  const isoDate = asText(value).slice(0, 10);
  return formatDatePtBR(isoDate, { year: '2-digit' });
}

export function formatISODateTime(value) {
  const date = new Date(value);
  if (!value || Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'America/Sao_Paulo'
  }).format(date);
}

export function validateDateInput(value, { required = false, min, max } = {}) {
  const text = asText(value);
  if (!text) return required ? 'Informe uma data.' : '';

  if (!isCompleteDateInput(text)) {
    return `Informe a data no formato ${DATE_INPUT_PLACEHOLDER}.`;
  }

  const parsed = parseDateInput(text);
  if (!parsed) return 'Informe uma data válida.';

  const minIso = min ? dateInputToIso(min) : null;
  const maxIso = max ? dateInputToIso(max) : null;

  if (minIso && parsed.iso < minIso) {
    return `A data deve ser igual ou posterior a ${formatDatePtBR(minIso, { year: '2-digit' })}.`;
  }
  if (maxIso && parsed.iso > maxIso) {
    return `A data deve ser igual ou anterior a ${formatDatePtBR(maxIso, { year: '2-digit' })}.`;
  }
  return '';
}

export function getDateInputMeta(value, validationOptions = {}) {
  const displayValue = normalizeDateInputValue(value);
  const parsed = parseDateInput(displayValue);
  const validationMessage = validateDateInput(displayValue, validationOptions);

  return {
    displayValue,
    isoValue: parsed?.iso || null,
    isComplete: isCompleteDateInput(displayValue),
    isValid: Boolean(parsed) && !validationMessage,
    validationMessage
  };
}

export function getDateCaretPosition(rawValue, rawCaret, maskedValue = maskDateInput(rawValue), advancePastSeparator = false) {
  const safeCaret = Math.max(0, Math.min(Number(rawCaret) || 0, asText(rawValue).length));
  const digitsBeforeCaret = asText(rawValue).slice(0, safeCaret).replace(/\D/g, '').length;
  if (digitsBeforeCaret === 0) return 0;

  let seenDigits = 0;
  let position = maskedValue.length;
  for (let index = 0; index < maskedValue.length; index += 1) {
    if (/\d/.test(maskedValue[index])) seenDigits += 1;
    if (seenDigits === digitsBeforeCaret) {
      position = index + 1;
      break;
    }
  }

  if (advancePastSeparator && maskedValue[position] === '/') position += 1;
  return Math.min(position, maskedValue.length);
}
