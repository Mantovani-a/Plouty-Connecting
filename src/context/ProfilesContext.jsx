import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { professionalProfiles as seedProfiles } from '../data/profilesData';
import { getStorageItem, setStorageItem } from '../utils/storage';

const ProfilesContext = createContext(null);
const PROFILE_EDITS_KEY = 'plouty.demo.profile-edits.v1';
const editableFields = ['name', 'role', 'location', 'description', 'about', 'contactEmail', 'contactPhone', 'capacity'];
const seedById = Object.fromEntries(seedProfiles.map((profile) => [profile.id, profile]));

function readEdits() {
  const stored = getStorageItem(PROFILE_EDITS_KEY, {});
  if (!stored || typeof stored !== 'object' || Array.isArray(stored)) return {};
  return Object.fromEntries(Object.entries(stored).filter(([id, value]) =>
    Object.hasOwn(seedById, id) && value && typeof value === 'object' && !Array.isArray(value)
  ));
}

function initialsFor(name) {
  return name.split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase();
}

function mergeProfile(base, edit = {}) {
  const strings = Object.fromEntries(editableFields
    .filter((field) => typeof edit[field] === 'string')
    .map((field) => [field, edit[field]]));
  const products = Array.isArray(edit.products) && edit.products.every((item) => typeof item === 'string')
    ? edit.products : base.products;
  const name = strings.name || base.name;
  const capacity = base.kind === 'buyer' ? '' : (strings.capacity ?? base.availability?.summary ?? '');
  return {
    ...base,
    ...strings,
    name,
    products,
    initials: initialsFor(name),
    shortName: name === base.name ? base.shortName : (base.kind === 'producer' ? name.split(' ')[0] : name),
    organization: base.organization === base.name ? name : base.organization,
    contactEmail: strings.contactEmail ?? '',
    contactPhone: strings.contactPhone ?? '',
    capacity,
    tags: edit.products ? products : base.tags,
    availability: base.availability ? { ...base.availability, summary: capacity } : undefined
  };
}

export function ProfilesProvider({ children }) {
  const [edits, setEdits] = useState(readEdits);
  useEffect(() => {
    const sync = (event) => { if (event.key === PROFILE_EDITS_KEY) setEdits(readEdits()); };
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, []);
  const profiles = useMemo(() => seedProfiles.map((base) => mergeProfile(base, edits[base.id])), [edits]);
  const profilesById = useMemo(() => Object.fromEntries(profiles.map((profile) => [profile.id, profile])), [profiles]);
  const getProfileById = useCallback((id) => Object.hasOwn(profilesById, id) ? profilesById[id] : null, [profilesById]);
  const supplierProfiles = useMemo(() => profiles.filter((profile) => profile.kind !== 'buyer'), [profiles]);

  const saveProfile = useCallback((id, values) => {
    if (!Object.hasOwn(seedById, id)) return false;
    const next = { ...edits, [id]: values };
    setEdits(next);
    return setStorageItem(PROFILE_EDITS_KEY, next);
  }, [edits]);

  const value = useMemo(() => ({ profiles, getProfileById, supplierProfiles, saveProfile }),
    [profiles, getProfileById, supplierProfiles, saveProfile]);
  return <ProfilesContext.Provider value={value}>{children}</ProfilesContext.Provider>;
}

export function useProfiles() {
  const context = useContext(ProfilesContext);
  if (!context) throw new Error('useProfiles must be used within ProfilesProvider');
  return context;
}
