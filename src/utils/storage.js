/**
 * Utilitário seguro para persistência local no navegador.
 * Previne quebras em ambientes SSR, restrições de navegação anônima ou estouro de cota.
 */

export function getStorageItem(key, fallbackValue = []) {
  if (typeof window === 'undefined') return fallbackValue;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallbackValue;
  } catch {
    return fallbackValue;
  }
}

export function setStorageItem(key, value) {
  if (typeof window === 'undefined') return false;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}
