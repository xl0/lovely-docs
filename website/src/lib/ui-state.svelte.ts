import { browser } from '$app/environment';
import { PersistedState } from 'runed';

// UI state persisted to localStorage
export const sidebarOpen = browser ? new PersistedState('sidebarOpen', true) : { current: true };
export const outlineOpen = browser ? new PersistedState('outlineOpen', true) : { current: true };
export const wideMode = browser ? new PersistedState('wideMode', false) : { current: false };
