import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useWorkspace } from './WorkspaceContext';
import { getStorageItem, setStorageItem } from '../utils/storage';

const PreferencesContext = createContext(null);
const KEY = 'plouty.demo.preferences.v1';
const DEMO_DATA_KEYS = [
  'plouty.demo.social.v2', 'plouty.demo.social-posts.v1',
  'plouty.demo.profile-edits.v1', 'plouty.demo.profile-connections.v2',
  'plouty.demo.network.v1', 'plouty.demo.demands.v1',
  'plouty.demo.commerce.v1', 'plouty.demo.notifications.v1',
  'plouty.demo.saved-profiles.v1'
];
export const NOTIFICATION_TYPES = ['connections', 'likes', 'comments', 'proposals', 'messages'];
const defaultNotificationSettings = Object.fromEntries(NOTIFICATION_TYPES.map((type) => [type, true]));

function readPreferences() {
  const stored = getStorageItem(KEY, {});
  return stored && typeof stored === 'object' && !Array.isArray(stored) ? stored : {};
}

export function PreferencesProvider({ children }) {
  const { profile } = useWorkspace();
  const [allPreferences, setAllPreferences] = useState(readPreferences);

  useEffect(() => {
    const sync = (event) => { if (event.key === KEY) setAllPreferences(readPreferences()); };
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, []);

  const preferencesFor = useCallback((profileId) => {
    const saved = profileId ? allPreferences[profileId] || {} : {};
    return {
      theme: saved.theme === 'light' || saved.theme === 'dark' ? saved.theme : null,
      mobilePreview: Boolean(saved.mobilePreview),
      notifications: { ...defaultNotificationSettings, ...(saved.notifications || {}) }
    };
  }, [allPreferences]);

  const update = useCallback((profileId, changes) => {
    if (!profileId) return false;
    const current = allPreferences[profileId] || {};
    const next = { ...allPreferences, [profileId]: { ...current, ...changes } };
    setAllPreferences(next);
    return setStorageItem(KEY, next);
  }, [allPreferences]);

  const setThemePreference = (theme) => update(profile?.id, { theme });
  const setMobilePreview = (enabled) => update(profile?.id, { mobilePreview: Boolean(enabled) });
  const setNotificationPreference = (type, enabled) => {
    if (!NOTIFICATION_TYPES.includes(type) || !profile) return false;
    return update(profile.id, { notifications: { ...preferencesFor(profile.id).notifications, [type]: Boolean(enabled) } });
  };
  const restoreDemoData = () => {
    try {
      DEMO_DATA_KEYS.forEach((key) => window.localStorage.removeItem(key));
    } catch { return false; }
    DEMO_DATA_KEYS.forEach((key) => window.dispatchEvent(new StorageEvent('storage', { key, newValue: null })));
    return true;
  };

  return <PreferencesContext.Provider value={{ preferences: preferencesFor(profile?.id), preferencesFor,
    setThemePreference, setMobilePreview, setNotificationPreference, restoreDemoData }}>
    {children}
  </PreferencesContext.Provider>;
}

export function usePreferences() {
  const context = useContext(PreferencesContext);
  if (!context) throw new Error('usePreferences must be used within PreferencesProvider');
  return context;
}
