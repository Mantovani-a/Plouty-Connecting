export const QUANTITY_CATEGORIES = Object.freeze({
  WEIGHT: 'weight',
  COUNT: 'count'
});

export const QUANTITY_UNITS = Object.freeze({
  weight: Object.freeze([
    Object.freeze({ value: 'g', label: 'g' }),
    Object.freeze({ value: 'kg', label: 'kg' }),
    Object.freeze({ value: 't', label: 't' })
  ]),
  count: Object.freeze([
    Object.freeze({ value: 'un', label: 'un' }),
    Object.freeze({ value: 'maço', label: 'maço' }),
    Object.freeze({ value: 'caixa', label: 'caixa' }),
    Object.freeze({ value: 'saca', label: 'saca' })
  ])
});

const CATEGORY_ALIASES = {
  weight: 'weight',
  peso: 'weight',
  count: 'count',
  unit: 'count',
  units: 'count',
  unidade: 'count',
  unidades: 'count'
};

const UNIT_ALIASES = {
  g: 'g',
  grama: 'g',
  gramas: 'g',
  kg: 'kg',
  quilo: 'kg',
  quilos: 'kg',
  t: 't',
  tonelada: 't',
  toneladas: 't',
  un: 'un',
  'un.': 'un',
  unidade: 'un',
  unidades: 'un',
  maco: 'maço',
  'maço': 'maço',
  caixa: 'caixa',
  caixas: 'caixa',
  saca: 'saca',
  sacas: 'saca'
};

const asText = (value) => value == null ? '' : String(value).trim();

export function isBrazilianGroupedInteger(value) {
  return /^\d{1,3}(?:\.\d{3})+$/.test(asText(value));
}

export function normalizeQuantityCategory(category) {
  return CATEGORY_ALIASES[asText(category).toLowerCase()] || null;
}

export function normalizeQuantityUnit(unit) {
  return UNIT_ALIASES[asText(unit).toLocaleLowerCase('pt-BR')] || null;
}

export function getQuantityUnits(category) {
  const normalizedCategory = normalizeQuantityCategory(category);
  return normalizedCategory ? [...QUANTITY_UNITS[normalizedCategory]] : [];
}

export function getQuantityCategoryForUnit(unit) {
  const normalizedUnit = normalizeQuantityUnit(unit);
  if (!normalizedUnit) return null;
  if (QUANTITY_UNITS.weight.some((item) => item.value === normalizedUnit)) return 'weight';
  if (QUANTITY_UNITS.count.some((item) => item.value === normalizedUnit)) return 'count';
  return null;
}

export function isQuantityUnitAllowed(unit, category) {
  const normalizedUnit = normalizeQuantityUnit(unit);
  return getQuantityUnits(category).some((item) => item.value === normalizedUnit);
}

export function sanitizeQuantityValue(value, category) {
  const text = asText(value);
  const normalizedCategory = normalizeQuantityCategory(category);
  if (!text || !normalizedCategory) return '';

  if (normalizedCategory === 'count') {
    if (isBrazilianGroupedInteger(text)) return text.replace(/\./g, '');
    const separatorIndex = text.search(/[,.]/);
    const integerPart = separatorIndex >= 0 ? text.slice(0, separatorIndex) : text;
    return integerPart.replace(/\D/g, '');
  }

  // Na interface brasileira, peso usa vírgula como separador decimal. Um ponto
  // é rejeitado para não transformar silenciosamente 1.234 kg em 1,234 kg.
  if (text.includes('.') || (text.match(/,/g) || []).length > 1) return '';

  const punctuation = [...text.matchAll(/,/g)];
  if (!punctuation.length) return text.replace(/\D/g, '');

  const decimalIndex = punctuation[punctuation.length - 1].index;
  const integerDigits = text.slice(0, decimalIndex).replace(/\D/g, '');
  const decimalDigits = text.slice(decimalIndex + 1).replace(/\D/g, '');
  return `${integerDigits || '0'},${decimalDigits}`;
}

export function parseQuantityValue(value, category) {
  const text = asText(value);
  const normalizedCategory = normalizeQuantityCategory(category);
  if (!text || !normalizedCategory || text.includes('-')) return null;

  const numericText = normalizedCategory === 'count' && isBrazilianGroupedInteger(text)
    ? text.replace(/\./g, '')
    : text;
  const pattern = normalizedCategory === 'weight' ? /^\d+(?:,\d+)?$/ : /^\d+$/;
  if (!pattern.test(numericText)) return null;

  const parsed = Number(numericText.replace(',', '.'));
  if (!Number.isFinite(parsed)) return null;
  return parsed;
}

export function validateQuantityValue(value, { category, required = false } = {}) {
  const text = asText(value);
  const normalizedCategory = normalizeQuantityCategory(category);
  if (!normalizedCategory) return 'Selecione uma categoria de quantidade válida.';
  if (!text) return required ? 'Informe a quantidade.' : '';

  const parsed = parseQuantityValue(text, normalizedCategory);
  if (parsed == null) {
    return normalizedCategory === 'weight'
      ? 'Use apenas números e vírgula para a quantidade.'
      : 'Use apenas números inteiros para a quantidade.';
  }
  if (parsed <= 0) return 'A quantidade deve ser maior que zero.';
  return '';
}

export function formatQuantityValue(value, category) {
  const normalizedCategory = normalizeQuantityCategory(category);
  const number = typeof value === 'number' ? value : parseQuantityValue(value, normalizedCategory);
  if (!normalizedCategory || !Number.isFinite(number)) return '';
  if (normalizedCategory === 'count' && !Number.isInteger(number)) return '';

  return new Intl.NumberFormat('pt-BR', {
    useGrouping: false,
    maximumFractionDigits: normalizedCategory === 'weight' ? 20 : 0
  }).format(number);
}

export function getQuantityMeta(value, unit, category, validationOptions = {}) {
  const normalizedCategory = normalizeQuantityCategory(category);
  const normalizedUnit = normalizeQuantityUnit(unit);
  const sanitizedValue = sanitizeQuantityValue(value, normalizedCategory);
  const numericValue = parseQuantityValue(sanitizedValue, normalizedCategory);
  const validationMessage = validateQuantityValue(sanitizedValue, {
    ...validationOptions,
    category: normalizedCategory
  });

  return {
    value: sanitizedValue,
    numericValue,
    unit: isQuantityUnitAllowed(normalizedUnit, normalizedCategory) ? normalizedUnit : null,
    category: normalizedCategory,
    isValid: numericValue != null && numericValue > 0 && !validationMessage,
    validationMessage
  };
}
