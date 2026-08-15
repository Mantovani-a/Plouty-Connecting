const CURRENCY_PREFIX_PATTERN = /^\s*R\$\s*/i;
const MAX_INTEGER_DIGITS = 12;

export const CURRENCY_INPUT_PLACEHOLDER = '1.250,00';
export const CURRENCY_INVALID_CHARACTER_ERROR = 'Use apenas números e vírgula para os centavos.';

const asText = (value) => value == null ? '' : String(value);

function groupIntegerDigits(value) {
  const normalized = value.replace(/^0+(?=\d)/, '') || '0';
  return normalized.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

export function parseCurrencyInput(value) {
  const original = asText(value);
  const withoutPrefix = original.replace(CURRENCY_PREFIX_PATTERN, '').trim();

  if (!withoutPrefix) {
    return { displayValue: '', numericValue: null, cents: null, validationMessage: '' };
  }

  if (withoutPrefix.includes('-')) {
    return {
      displayValue: '',
      numericValue: null,
      cents: null,
      validationMessage: 'O valor da proposta não pode ser negativo.'
    };
  }

  if (/[^\d.,]/.test(withoutPrefix)) {
    return {
      displayValue: '',
      numericValue: null,
      cents: null,
      validationMessage: CURRENCY_INVALID_CHARACTER_ERROR
    };
  }

  const commaCount = (withoutPrefix.match(/,/g) || []).length;
  if (commaCount > 1) {
    return {
      displayValue: '',
      numericValue: null,
      cents: null,
      validationMessage: 'Use somente uma vírgula para separar os centavos.'
    };
  }

  const [integerDraft = '', decimalDraft] = withoutPrefix.split(',');
  const hasValidIntegerGrouping = /^\d*$/.test(integerDraft)
    || /^\d{1,3}(?:\.\d{3})+$/.test(integerDraft);
  if (!hasValidIntegerGrouping) {
    return {
      displayValue: '',
      numericValue: null,
      cents: null,
      validationMessage: 'Use pontos apenas para separar milhares, como 1.250,00.'
    };
  }
  const integerDigits = integerDraft.replace(/\./g, '');
  if (!/^\d*$/.test(integerDigits) || (decimalDraft != null && !/^\d*$/.test(decimalDraft))) {
    return {
      displayValue: '',
      numericValue: null,
      cents: null,
      validationMessage: CURRENCY_INVALID_CHARACTER_ERROR
    };
  }

  if (integerDigits.length > MAX_INTEGER_DIGITS) {
    return {
      displayValue: '',
      numericValue: null,
      cents: null,
      validationMessage: 'O valor informado é maior do que o limite aceito.'
    };
  }

  if (decimalDraft != null && decimalDraft.length > 2) {
    return {
      displayValue: '',
      numericValue: null,
      cents: null,
      validationMessage: 'Informe no máximo dois dígitos para os centavos.'
    };
  }

  if (!integerDigits && decimalDraft == null) {
    return { displayValue: '', numericValue: null, cents: null, validationMessage: '' };
  }

  const safeInteger = integerDigits || '0';
  const decimalDigits = decimalDraft ?? '';
  const cents = (Number(safeInteger) * 100) + Number(decimalDigits.padEnd(2, '0') || 0);
  const numericValue = cents / 100;
  const displayValue = `${groupIntegerDigits(safeInteger)}${decimalDraft != null ? `,${decimalDigits}` : ''}`;

  return { displayValue, numericValue, cents, validationMessage: '' };
}

export function validateCurrencyInput(value, { required = false, min = 0.01 } = {}) {
  const parsed = parseCurrencyInput(value);
  if (parsed.validationMessage) return parsed.validationMessage;
  if (parsed.numericValue == null) return required ? 'Informe o valor total da proposta.' : '';
  if (parsed.numericValue < min) return 'Informe um valor maior que zero.';
  return '';
}

export function getCurrencyInputMeta(value, options = {}) {
  const parsed = parseCurrencyInput(value);
  const validationMessage = parsed.validationMessage || validateCurrencyInput(value, options);
  return {
    ...parsed,
    isValid: parsed.numericValue != null && !validationMessage,
    validationMessage
  };
}

export function completeCurrencyInput(value) {
  const parsed = parseCurrencyInput(value);
  if (parsed.validationMessage || parsed.numericValue == null) return parsed;
  const decimalDigits = String(parsed.cents % 100).padStart(2, '0');
  const integerDigits = String(Math.floor(parsed.cents / 100));
  return {
    ...parsed,
    displayValue: `${groupIntegerDigits(integerDigits)},${decimalDigits}`
  };
}

export function formatCurrencyBRL(value) {
  if (value == null || !Number.isFinite(Number(value))) return '';
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(Number(value));
}
