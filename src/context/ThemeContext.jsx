import React, { createContext, useContext, useEffect, useState } from 'react';
import { usePreferences } from './PreferencesContext';
import { useWorkspace } from './WorkspaceContext';

const ThemeContext = createContext(null);

function initialTheme() {
  try {
    const saved = window.localStorage.getItem('theme');
    if (saved === 'light' || saved === 'dark') return saved;
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  } catch { return 'light'; }
}

export function ThemeProvider({ children }) {
  const { profile } = useWorkspace();
  const { preferences, setThemePreference } = usePreferences();
  const [publicTheme, setPublicTheme] = useState(initialTheme);
  const theme = profile ? preferences.theme || publicTheme : publicTheme;

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.setAttribute('data-bs-theme', theme);
  }, [theme]);

  const setTheme = (next) => {
    if (next !== 'light' && next !== 'dark') return;
    if (profile) setThemePreference(next);
    else {
      setPublicTheme(next);
      try { window.localStorage.setItem('theme', next); } catch { /* tema em memória */ }
    }
  };
  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
