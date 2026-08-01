import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import settingsService from '../services/settingsService';

const SettingsContext = createContext(null);

/**
 * Apply the selected theme to the root documentElement class list.
 * Supports Light, Dark, and System modes.
 */
function applyThemeClass(theme) {
  const root = document.documentElement;
  if (theme === 'Dark') {
    root.classList.add('dark');
  } else if (theme === 'Light') {
    root.classList.remove('dark');
  } else {
    // System
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (prefersDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }
}

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const refreshSettings = useCallback(async () => {
    try {
      const res = await settingsService.getSettings();
      if (res.success) {
        setSettings(res.data);
        applyThemeClass(res.data.theme);
        setError(null);
      } else {
        setError(res.message || 'Failed to fetch settings');
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch settings');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Sync theme changes immediately when settings update
  useEffect(() => {
    if (settings?.theme) {
      applyThemeClass(settings.theme);
    }
  }, [settings?.theme]);

  // Listen for prefers-color-scheme changes when System theme is selected
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleMediaChange = () => {
      if (settings?.theme === 'System') {
        applyThemeClass('System');
      }
    };

    mediaQuery.addEventListener('change', handleMediaChange);
    return () => mediaQuery.removeEventListener('change', handleMediaChange);
  }, [settings?.theme]);

  // Initial fetch
  useEffect(() => {
    refreshSettings();
  }, [refreshSettings]);

  const value = useMemo(() => ({
    settings,
    isLoading,
    error,
    refreshSettings,
  }), [settings, isLoading, error, refreshSettings]);

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
