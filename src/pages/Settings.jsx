import { useState, useEffect, useCallback, useRef, useMemo, memo } from 'react';
import { useBlocker } from 'react-router-dom';
import {
  Settings2,
  User,
  AppWindow,
  BriefcaseBusiness,
  Bell,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { PageHeader, Card, Input, Select, Textarea, Button } from '../components/ui';
import Toast from '../components/Toast';
import ConfirmModal from '../components/ConfirmModal';
import useToast from '../hooks/useToast';
import settingsService from '../services/settingsService';
import { useSettings } from '../context/SettingsContext';

// ── Static option lists — module-level to avoid re-creation on every render ──

const THEME_OPTIONS = [
  { value: 'Light',  label: 'Light' },
  { value: 'Dark',   label: 'Dark' },
  { value: 'System', label: 'System' },
];

const LANGUAGE_OPTIONS = [
  { value: 'English', label: 'English' },
  { value: 'Arabic',  label: 'Arabic' },
  { value: 'French',  label: 'French' },
  { value: 'Spanish', label: 'Spanish' },
  { value: 'German',  label: 'German' },
  { value: 'Urdu',    label: 'Urdu' },
];

const TIMEZONE_OPTIONS = [
  { value: 'UTC',                  label: 'UTC' },
  { value: 'Asia/Karachi',         label: 'Asia/Karachi (PKT, UTC+5)' },
  { value: 'Asia/Kolkata',         label: 'Asia/Kolkata (IST, UTC+5:30)' },
  { value: 'Asia/Dubai',           label: 'Asia/Dubai (GST, UTC+4)' },
  { value: 'Europe/London',        label: 'Europe/London (GMT/BST)' },
  { value: 'Europe/Berlin',        label: 'Europe/Berlin (CET, UTC+1)' },
  { value: 'America/New_York',     label: 'America/New_York (EST, UTC−5)' },
  { value: 'America/Los_Angeles',  label: 'America/Los_Angeles (PST, UTC−8)' },
  { value: 'Asia/Tokyo',           label: 'Asia/Tokyo (JST, UTC+9)' },
  { value: 'Australia/Sydney',     label: 'Australia/Sydney (AEST, UTC+10)' },
];

const DATE_FORMAT_OPTIONS = [
  { value: 'YYYY-MM-DD',  label: 'YYYY-MM-DD (2025-07-09)' },
  { value: 'MM/DD/YYYY',  label: 'MM/DD/YYYY (07/09/2025)' },
  { value: 'DD/MM/YYYY',  label: 'DD/MM/YYYY (09/07/2025)' },
  { value: 'DD MMM YYYY', label: 'DD MMM YYYY (09 Jul 2025)' },
];

const TIME_FORMAT_OPTIONS = [
  { value: '12-hour', label: '12-hour (01:30 PM)' },
  { value: '24-hour', label: '24-hour (13:30)' },
];

const PRIORITY_OPTIONS = [
  { value: 'High',   label: 'High' },
  { value: 'Medium', label: 'Medium' },
  { value: 'Low',    label: 'Low' },
];

const EDITABLE_KEYS = [
  'userName',
  'designation',
  'email',
  'phone',
  'company',
  'about',
  'theme',
  'language',
  'timezone',
  'dateFormat',
  'timeFormat',
  'workingHoursStart',
  'workingHoursEnd',
  'defaultPriority',
  'dashboardGreeting',
  'dailyReminder',
  'emailNotifications',
  'desktopNotifications',
  'autoBackup',
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TIME_RE  = /^([01]\d|2[0-3]):[0-5]\d$/;

const APP_VERSION = '1.0.0';

// ── Pure helpers ──────────────────────────────────────────────────────────────

/**
 * Validate the settings form values.
 * @param {object} form
 * @returns {{ [field]: string }} - Map of field keys to error messages.
 */
function validateForm(form) {
  const errs = {};

  if (!form.userName?.trim()) {
    errs.userName = 'Full Name is required.';
  }

  if (form.email?.trim() && !EMAIL_RE.test(form.email.trim())) {
    errs.email = 'Enter a valid email address.';
  }

  if (form.workingHoursStart?.trim() && !TIME_RE.test(form.workingHoursStart.trim())) {
    errs.workingHoursStart = 'Use HH:MM format (e.g. 09:00).';
  }

  if (form.workingHoursEnd?.trim() && !TIME_RE.test(form.workingHoursEnd.trim())) {
    errs.workingHoursEnd = 'Use HH:MM format (e.g. 17:00).';
  }

  return errs;
}

// ── Sub-components (Memoised for performance optimization) ────────────────────

/** ToggleRow — accessible labelled boolean toggle switch. */
const ToggleRow = memo(function ToggleRow({ id, label, hint, checked, onChange, disabled }) {
  const descId = hint ? `${id}-desc` : undefined;

  const handleClick = useCallback(() => {
    if (!disabled) {
      onChange(id, !checked);
    }
  }, [disabled, onChange, id, checked]);

  return (
    <div className={`flex items-start sm:items-center justify-between gap-4 py-3 border-b border-slate-50 dark:border-slate-700 last:border-0 ${disabled ? 'opacity-50' : ''}`}>
      <div className="flex-1 min-w-0">
        <label htmlFor={id} className={`text-sm font-bold text-slate-700 dark:text-slate-300 ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
          {label}
        </label>
        {hint && (
          <p id={descId} className="text-xs font-medium text-slate-400 dark:text-slate-500 mt-0.5">
            {hint}
          </p>
        )}
      </div>
      <button
        type="button"
        id={id}
        role="switch"
        aria-checked={checked}
        aria-label={label}
        aria-describedby={descId}
        disabled={disabled}
        onClick={handleClick}
        className={`relative inline-flex h-6 w-11 items-center rounded-full border-2 transition-all focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800 flex-shrink-0 disabled:cursor-not-allowed ${
          checked
            ? 'bg-primary-600 border-primary-600'
            : 'bg-slate-200 dark:bg-slate-600 border-slate-300 dark:border-slate-500'
        }`}
      >
        <span className="sr-only">{checked ? 'Enabled' : 'Disabled'}</span>
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200 ${
            checked ? 'translate-x-5' : 'translate-x-0.5'
          }`}
          aria-hidden="true"
        />
      </button>
    </div>
  );
});

/** StatusPill — read-only online / offline badge. */
const StatusPill = memo(function StatusPill({ label, status }) {
  const isGood    = status === 'online' || status === 'connected';
  const isUnknown = status === 'unknown';

  const pillClass = isGood
    ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border-emerald-100 dark:border-emerald-800'
    : isUnknown
    ? 'bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border-amber-100 dark:border-amber-800'
    : 'bg-rose-50 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 border-rose-100 dark:border-rose-800';

  const dotClass = isGood
    ? 'bg-emerald-500'
    : isUnknown
    ? 'bg-amber-500'
    : 'bg-rose-500';

  const displayText =
    status === 'online'     ? 'Online'
    : status === 'connected'  ? 'Connected'
    : status === 'unknown'    ? 'Unknown'
    : status === 'offline'    ? 'Offline'
    : 'Disconnected';

  return (
    <div className="flex items-center justify-between py-2.5">
      <span className="text-sm font-bold text-slate-600 dark:text-slate-400">{label}</span>
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold border ${pillClass}`}
        aria-live="polite"
      >
        <span className={`w-1.5 h-1.5 rounded-full ${dotClass}`} aria-hidden="true" />
        {displayText}
      </span>
    </div>
  );
});

/** Animated card skeleton displayed while settings are loading. */
function SettingsSkeleton() {
  const SkeletonField = () => (
    <div className="space-y-1.5">
      <div className="h-4 bg-slate-100 dark:bg-slate-700 rounded animate-pulse w-24" />
      <div className="h-10 bg-slate-100 dark:bg-slate-700 rounded-xl animate-pulse w-full" />
    </div>
  );

  return (
    <div className="space-y-6" aria-busy="true" aria-label="Loading settings">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl shadow-sm p-6 space-y-5">
          <div className="h-5 bg-slate-100 dark:bg-slate-700 rounded animate-pulse w-40 mb-4" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <SkeletonField /><SkeletonField />
            <SkeletonField /><SkeletonField />
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

/**
 * Settings page.
 */
function Settings() {
  const [savedSettings, setSavedSettings] = useState(null);
  const [form, setForm]                   = useState(null);
  const [fieldErrors, setFieldErrors]     = useState({});
  const [isLoading, setIsLoading]         = useState(true);
  const [isSaving, setIsSaving]           = useState(false);
  const [fetchError, setFetchError]       = useState(null);
  const [healthStatus, setHealthStatus]   = useState({
    backend:  'unknown',
    database: 'unknown',
  });
  const [confirmOpen, setConfirmOpen]     = useState(false);
  const lastActiveElementRef              = useRef(null);

  const { toasts, showToast, removeToast } = useToast();
  const { refreshSettings } = useSettings();

  // ── Derived state ───────────────────────────────────────────────────────

  /** True only when the form contains changes not yet persisted (trimmed strings). */
  const hasChanges = useMemo(() => {
    if (!savedSettings || !form) return false;
    for (const key of EDITABLE_KEYS) {
      let valOrig = savedSettings[key];
      let valCurr = form[key];
      if (typeof valOrig === 'string') valOrig = valOrig.trim();
      if (typeof valCurr === 'string') valCurr = valCurr.trim();
      if (valOrig !== valCurr) return true;
    }
    return false;
  }, [savedSettings, form]);

  // ── Blocker for navigation guard ────────────────────────────────────────

  const blocker = useBlocker(
    useCallback(
      ({ currentValue, nextLocation }) => {
        return hasChanges && currentValue.location.pathname !== nextLocation.pathname;
      },
      [hasChanges]
    )
  );

  // Sync blocker state with confirmOpen
  useEffect(() => {
    if (blocker.state === 'blocked') {
      setConfirmOpen(true);
    }
  }, [blocker.state]);

  // Track active element to restore focus when ConfirmModal opens
  useEffect(() => {
    if (confirmOpen) {
      lastActiveElementRef.current = document.activeElement;
    }
  }, [confirmOpen]);

  // ── Data fetching ───────────────────────────────────────────────────────

  const fetchAll = useCallback(async () => {
    setIsLoading(true);
    setFetchError(null);

    const [settingsResult, healthResult] = await Promise.allSettled([
      settingsService.getSettings(),
      settingsService.getHealth(),
    ]);

    // Settings
    if (settingsResult.status === 'fulfilled' && settingsResult.value?.success) {
      setSavedSettings(settingsResult.value.data);
      setForm(settingsResult.value.data);
    } else {
      setFetchError('Could not load settings. Please check your connection and retry.');
    }

    // Health
    if (healthResult.status === 'fulfilled') {
      setHealthStatus({
        backend:  healthResult.value.backend  ?? 'unknown',
        database: healthResult.value.database ?? 'unknown',
      });
    } else {
      setHealthStatus({ backend: 'offline', database: 'unknown' });
    }

    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  // ── Unsaved-changes guard (browser navigation) ──────────────────────────

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasChanges) e.preventDefault();
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasChanges]);

  // ── Form helpers ────────────────────────────────────────────────────────

  const setField = useCallback((key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setFieldErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }, []);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setField(name, value);
  }, [setField]);

  const handleToggleChange = useCallback((id, val) => {
    const key = id.replace('settings-', '');
    setField(key, val);
  }, [setField]);

  // ── Save ────────────────────────────────────────────────────────────────

  const handleSave = useCallback(async () => {
    if (isSaving) return;

    if (!hasChanges) {
      showToast('No changes to save.', 'info');
      return;
    }

    const errs = validateForm(form);
    if (Object.keys(errs).length > 0) {
      setFieldErrors(errs);
      showToast('Please fix the highlighted errors.', 'error');
      
      // Auto-focus the first invalid field
      setTimeout(() => {
        const invalidEl = document.querySelector('[aria-invalid="true"]');
        if (invalidEl) {
          invalidEl.focus();
        }
      }, 50);
      return;
    }

    setIsSaving(true);
    try {
      const res = await settingsService.updateSettings(form);
      if (res.success) {
        setSavedSettings(res.data);
        setForm(res.data);
        setFieldErrors({});
        // Refresh global settings to apply theme immediately without page reload
        await refreshSettings();
        showToast('Settings saved successfully.', 'success');
      } else {
        showToast(res.message || 'Failed to save settings.', 'error');
        // Auto-focus first invalid element if any
        setTimeout(() => {
          const invalidEl = document.querySelector('[aria-invalid="true"]');
          if (invalidEl) {
            invalidEl.focus();
          }
        }, 50);
      }
    } catch {
      showToast('An error occurred. Your changes are preserved — please retry.', 'error');
    } finally {
      setIsSaving(false);
    }
  }, [hasChanges, form, showToast, isSaving]);

  // ── Discard ─────────────────────────────────────────────────────────────

  const handleDiscard = useCallback(() => {
    setForm(savedSettings);
    setFieldErrors({});
  }, [savedSettings]);

  // ── Form submission handler ─────────────────────────────────────────────

  const handleFormSubmit = useCallback((e) => {
    e.preventDefault();
    handleSave();
  }, [handleSave]);

  // ── ConfirmModal callbacks ──────────────────────────────────────────────

  const handleConfirmLeave = useCallback(() => {
    setConfirmOpen(false);
    if (blocker.state === 'blocked') {
      blocker.proceed();
    }
  }, [blocker]);

  const handleCancelLeave = useCallback(() => {
    setConfirmOpen(false);
    if (blocker.state === 'blocked') {
      blocker.reset();
    }
    // Return focus to the element that was active before modal opened
    if (lastActiveElementRef.current) {
      lastActiveElementRef.current.focus();
      lastActiveElementRef.current = null;
    }
  }, [blocker]);

  // ── Header (stable across re-renders when props unchanged) ──────────────

  const headerActions = hasChanges && !isSaving ? (
    <span
      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-900/30 border border-amber-100 dark:border-amber-800 text-xs font-bold text-amber-700 dark:text-amber-300"
      aria-live="polite"
    >
      <span className="w-1.5 h-1.5 bg-amber-500 rounded-full" aria-hidden="true" />
      Unsaved changes
    </span>
  ) : null;

  // ── Error state ─────────────────────────────────────────────────────────

  if (!isLoading && fetchError) {
    return (
      <div className="p-6 sm:p-8 space-y-6 max-w-5xl mx-auto">
        <PageHeader
          title="Settings"
          subtitle="Manage your profile, preferences, notifications, and system configuration."
          icon={<Settings2 className="w-6 h-6 text-primary-600" aria-hidden="true" />}
        />
        <div
          className="flex items-start gap-3 p-5 bg-rose-50 dark:bg-rose-900/30 border border-rose-100 dark:border-rose-800 rounded-2xl"
          role="alert"
        >
          <AlertCircle className="w-5 h-5 text-rose-500 dark:text-rose-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <p className="text-sm font-bold text-rose-700 dark:text-rose-300">{fetchError}</p>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="mt-3"
              onClick={fetchAll}
            >
              Retry
            </Button>
          </div>
        </div>
        <Toast toasts={toasts} onRemove={removeToast} />
      </div>
    );
  }

  // ── Main render ─────────────────────────────────────────────────────────

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-5xl mx-auto relative min-h-[calc(100vh-70px)]">

      <PageHeader
        title="Settings"
        subtitle="Manage your profile, preferences, notifications, and system configuration."
        icon={<Settings2 className="w-6 h-6 text-primary-600" aria-hidden="true" />}
        actions={headerActions}
      />

      {isLoading ? (
        <SettingsSkeleton />
      ) : (
        <form onSubmit={handleFormSubmit} className="space-y-6">

          {/* ── 1. Profile ──────────────────────────────────────────────── */}
          <Card
            title="Profile"
            subtitle="Your personal information"
            actions={<User className="w-5 h-5 text-primary-600" aria-hidden="true" />}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Input
                label="Full Name"
                id="settings-userName"
                name="userName"
                required
                disabled={isSaving}
                placeholder="Enter your full name"
                value={form.userName}
                onChange={handleInputChange}
                error={fieldErrors.userName}
              />
              <Input
                label="Designation"
                id="settings-designation"
                name="designation"
                disabled={isSaving}
                placeholder="e.g. Software Developer"
                value={form.designation}
                onChange={handleInputChange}
              />
              <Input
                label="Email Address"
                id="settings-email"
                name="email"
                type="email"
                disabled={isSaving}
                placeholder="name@example.com"
                value={form.email}
                onChange={handleInputChange}
                error={fieldErrors.email}
              />
              <Input
                label="Phone"
                id="settings-phone"
                name="phone"
                type="tel"
                disabled={isSaving}
                placeholder="+92 300 0000000"
                value={form.phone}
                onChange={handleInputChange}
              />
              <Input
                label="Company / Organisation"
                id="settings-company"
                name="company"
                disabled={isSaving}
                placeholder="Your company or team name"
                value={form.company}
                onChange={handleInputChange}
                wrapperClassName="sm:col-span-2"
              />
              <Textarea
                label="About"
                id="settings-about"
                name="about"
                disabled={isSaving}
                placeholder="Write a short bio or description..."
                rows={3}
                value={form.about}
                onChange={handleInputChange}
                wrapperClassName="sm:col-span-2"
              />
            </div>
          </Card>

          {/* ── 2. Application ──────────────────────────────────────────── */}
          <Card
            title="Application"
            subtitle="Display and localisation preferences"
            actions={<AppWindow className="w-5 h-5 text-indigo-600" aria-hidden="true" />}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Select
                label="Theme"
                id="settings-theme"
                name="theme"
                disabled={isSaving}
                options={THEME_OPTIONS}
                value={form.theme}
                onChange={handleInputChange}
              />
              <Select
                label="Language"
                id="settings-language"
                name="language"
                disabled={true}
                options={LANGUAGE_OPTIONS}
                value={form.language}
                onChange={handleInputChange}
                hint="Language support will be available in a future update."
              />
              <Select
                label="Timezone"
                id="settings-timezone"
                name="timezone"
                disabled={isSaving}
                options={TIMEZONE_OPTIONS}
                value={form.timezone}
                onChange={handleInputChange}
                wrapperClassName="sm:col-span-2"
              />
              <Select
                label="Date Format"
                id="settings-dateFormat"
                name="dateFormat"
                disabled={isSaving}
                options={DATE_FORMAT_OPTIONS}
                value={form.dateFormat}
                onChange={handleInputChange}
              />
              <Select
                label="Time Format"
                id="settings-timeFormat"
                name="timeFormat"
                disabled={isSaving}
                options={TIME_FORMAT_OPTIONS}
                value={form.timeFormat}
                onChange={handleInputChange}
              />
            </div>
          </Card>

          {/* ── 3. Work Preferences ─────────────────────────────────────── */}
          <Card
            title="Work Preferences"
            subtitle="Productivity and task defaults"
            actions={<BriefcaseBusiness className="w-5 h-5 text-amber-600" aria-hidden="true" />}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Input
                label="Working Hours Start"
                id="settings-workingHoursStart"
                name="workingHoursStart"
                type="time"
                disabled={isSaving}
                value={form.workingHoursStart}
                onChange={handleInputChange}
                error={fieldErrors.workingHoursStart}
              />
              <Input
                label="Working Hours End"
                id="settings-workingHoursEnd"
                name="workingHoursEnd"
                type="time"
                disabled={isSaving}
                value={form.workingHoursEnd}
                onChange={handleInputChange}
                error={fieldErrors.workingHoursEnd}
              />
              <Select
                label="Default Task Priority"
                id="settings-defaultPriority"
                name="defaultPriority"
                disabled={isSaving}
                options={PRIORITY_OPTIONS}
                value={form.defaultPriority}
                onChange={handleInputChange}
              />
            </div>
            <div className="mt-5 pt-4 border-t border-slate-50">
              <ToggleRow
                id="settings-dashboardGreeting"
                label="Dashboard Greeting"
                hint="Show personalised greeting on the dashboard."
                checked={form.dashboardGreeting}
                onChange={handleToggleChange}
                disabled={isSaving}
              />
            </div>
          </Card>

          {/* ── 4. Notifications ────────────────────────────────────────── */}
          <Card
            title="Notifications"
            subtitle="Control how and when you receive alerts"
            actions={<Bell className="w-5 h-5 text-rose-600" aria-hidden="true" />}
          >
            <div className="divide-y divide-slate-50">
              <ToggleRow
                id="settings-dailyReminder"
                label="Daily Reminder"
                hint="Receive a daily summary of pending tasks and goals."
                checked={form.dailyReminder}
                onChange={handleToggleChange}
                disabled={isSaving}
              />
              <ToggleRow
                id="settings-emailNotifications"
                label="Email Notifications"
                hint="Send notifications to your registered email address."
                checked={form.emailNotifications}
                onChange={handleToggleChange}
                disabled={isSaving}
              />
              <ToggleRow
                id="settings-desktopNotifications"
                label="Desktop Notifications"
                hint="Push browser notifications while the app is open."
                checked={form.desktopNotifications}
                onChange={handleToggleChange}
                disabled={isSaving}
              />
            </div>
          </Card>

          {/* ── 5. System ───────────────────────────────────────────────── */}
          <Card
            title="System"
            subtitle="Application diagnostics and data management"
            actions={<ShieldCheck className="w-5 h-5 text-emerald-600" aria-hidden="true" />}
          >
            <div className="mb-4">
              <ToggleRow
                id="settings-autoBackup"
                label="Auto Backup"
                hint="Automatically backup your data periodically."
                checked={form.autoBackup}
                onChange={handleToggleChange}
                disabled={isSaving}
              />
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-700">
              <div className="flex items-center justify-between py-2.5">
                <span className="text-sm font-bold text-slate-600 dark:text-slate-400">Application Version</span>
                <span className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-xs font-bold text-slate-600 dark:text-slate-300">
                  v{APP_VERSION}
                </span>
              </div>
              <StatusPill label="Backend Status"  status={healthStatus.backend} />
              <StatusPill label="Database Status" status={healthStatus.database} />
            </div>
          </Card>

          {/* ── Save / Discard action bar ─────────────────────────────── */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl shadow-sm px-6 py-4">
            <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 font-medium" aria-live="polite">
              {hasChanges ? (
                <>
                  <AlertCircle className="w-4 h-4 text-amber-500 dark:text-amber-400 flex-shrink-0" aria-hidden="true" />
                  <span>You have unsaved changes.</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400 flex-shrink-0" aria-hidden="true" />
                  <span>All changes saved.</span>
                </>
              )}
            </div>
            <div className="flex items-center gap-3">
              {hasChanges && (
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleDiscard}
                  disabled={isSaving}
                >
                  Discard
                </Button>
              )}
              <Button
                type="submit"
                variant="primary"
                disabled={isSaving}
                loading={isSaving}
              >
                {isSaving ? 'Saving…' : 'Save Settings'}
              </Button>
            </div>
          </div>

        </form>
      )}

      {/* Unsaved-changes in-app navigation guard */}
      <ConfirmModal
        isOpen={confirmOpen}
        title="Unsaved Changes"
        message="You have unsaved changes. Are you sure you want to leave without saving?"
        onConfirm={handleConfirmLeave}
        onCancel={handleCancelLeave}
      />

      {/* Toast notifications */}
      <Toast toasts={toasts} onRemove={removeToast} />

    </div>
  );
}

export default Settings;
export { Settings };
