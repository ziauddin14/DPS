import { useState, useEffect, useCallback } from 'react';
import { Plus, CalendarDays, AlertCircle } from 'lucide-react';
import EventStats from '../components/EventStats';
import EventFilters from '../components/EventFilters';
import EventCard from '../components/EventCard';
import EventCardSkeleton from '../components/EventCardSkeleton';
import EmptyState from '../components/EmptyState';
import EventModal from '../components/EventModal';
import ConfirmModal from '../components/ConfirmModal';
import Toast from '../components/Toast';
import UpcomingEvents from '../components/UpcomingEvents';
import BirthdayReminder from '../components/BirthdayReminder';
import useToast from '../hooks/useToast';
import eventService from '../services/eventService';
import { PageHeader } from '../components/ui';

// ── Constants ────────────────────────────────────────────────────────────────

const DEFAULT_FILTERS = {
  search:    '',
  type:      'All',
  dateRange: 'All',
};

const SKELETON_COUNT = 6;

// ── Pure helper: compute fromDate / toDate params from dateRange label ───────

/**
 * Converts a human-readable date range label into ISO date strings
 * to pass as fromDate / toDate query params.
 *
 * @param {string} dateRange - One of 'All' | 'Upcoming' | 'Today' | 'This Week' | 'This Month'
 * @returns {{ fromDate?: string, toDate?: string }}
 */
function computeDateRangeParams(dateRange) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (dateRange === 'Today') {
    const end = new Date(today);
    end.setHours(23, 59, 59, 999);
    return { fromDate: today.toISOString(), toDate: end.toISOString() };
  }

  if (dateRange === 'Upcoming') {
    return { fromDate: today.toISOString() };
  }

  if (dateRange === 'This Week') {
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay()); // Sunday
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);
    return { fromDate: startOfWeek.toISOString(), toDate: endOfWeek.toISOString() };
  }

  if (dateRange === 'This Month') {
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth   = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 999);
    return { fromDate: startOfMonth.toISOString(), toDate: endOfMonth.toISOString() };
  }

  return {}; // 'All' — no date restriction
}

// ── Component ────────────────────────────────────────────────────────────────

/**
 * Calendar Page component.
 *
 * Integrates frontend components with the MERN backend Event API handlers.
 * Layout (top → bottom):
 *   PageHeader → Error Banner → EventStats → Sidebar Row (UpcomingEvents + BirthdayReminder)
 *   → EventFilters → Events Grid
 *
 * Two separate event arrays are maintained:
 *   - `events`    : filtered events for the main grid (search + type + dateRange)
 *   - `allEvents` : unfiltered events for the sidebar widgets
 */
function Calendar() {
  // Main grid events (filtered)
  const [events, setEvents] = useState([]);
  // Sidebar events (always unfiltered — for UpcomingEvents + BirthdayReminder)
  const [allEvents, setAllEvents] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError]         = useState(null);

  // Toast hook
  const { toasts, showToast, removeToast } = useToast();

  // ── Filter state ────────────────────────────────────────────────────────

  const [search,         setSearch]         = useState(DEFAULT_FILTERS.search);
  const [debouncedSearch, setDebouncedSearch] = useState(DEFAULT_FILTERS.search);
  const [type,           setType]           = useState(DEFAULT_FILTERS.type);
  const [dateRange,      setDateRange]      = useState(DEFAULT_FILTERS.dateRange);

  // ── Modal state ─────────────────────────────────────────────────────────

  const [isModalOpen,   setIsModalOpen]   = useState(false);
  const [modalMode,     setModalMode]     = useState('add');
  const [selectedEvent, setSelectedEvent] = useState(null);

  // ── Confirm-delete modal state ──────────────────────────────────────────

  const [confirmOpen,   setConfirmOpen]   = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);

  // ── Data fetching ────────────────────────────────────────────────────────

  /**
   * Fetches all events (no filters) for the sidebar widgets.
   * Runs on mount and after any CRUD operation.
   */
  const fetchAllEvents = useCallback(async () => {
    try {
      const response = await eventService.getAllEvents({});
      if (response.success) setAllEvents(response.data ?? []);
    } catch {
      // Sidebar widgets degrade silently — the main grid error banner handles errors
    }
  }, []);

  /**
   * Fetches filtered events for the main grid.
   * Builds query params from the active search / type / dateRange filters.
   */
  const fetchEvents = useCallback(async (filters = {}) => {
    setIsLoading(true);
    setError(null);

    const params = {};
    if (filters.search)                            params.search = filters.search;
    if (filters.type && filters.type !== 'All')    params.type   = filters.type;

    const dateParams = computeDateRangeParams(filters.dateRange ?? 'All');
    Object.assign(params, dateParams);

    try {
      const response = await eventService.getAllEvents(params);
      if (response.success) {
        setEvents(response.data ?? []);
      } else {
        setError(response.message || 'Failed to fetch events.');
      }
    } catch {
      setError('Could not retrieve events from server. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch all events once on mount (sidebar widgets)
  useEffect(() => {
    fetchAllEvents();
  }, [fetchAllEvents]);

  // 500ms debounce on search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  // Re-fetch grid when debounced search, type, or dateRange changes
  useEffect(() => {
    fetchEvents({ search: debouncedSearch, type, dateRange });
  }, [debouncedSearch, type, dateRange, fetchEvents]);

  // ── Filter handlers ──────────────────────────────────────────────────────

  const handleClearFilters = () => {
    setSearch(DEFAULT_FILTERS.search);
    setDebouncedSearch(DEFAULT_FILTERS.search);
    setType(DEFAULT_FILTERS.type);
    setDateRange(DEFAULT_FILTERS.dateRange);
  };

  // ── Event modal handlers ─────────────────────────────────────────────────

  const handleAddClick = () => {
    setModalMode('add');
    setSelectedEvent(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (event) => {
    setModalMode('edit');
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleSaveEvent = async (eventData) => {
    setError(null);
    try {
      let response;
      if (modalMode === 'edit' && selectedEvent) {
        response = await eventService.updateEvent(selectedEvent._id, eventData);
      } else {
        response = await eventService.createEvent(eventData);
      }

      if (response.success) {
        setIsModalOpen(false);
        // Refresh both lists after a write operation
        fetchEvents({ search: debouncedSearch, type, dateRange });
        fetchAllEvents();
        showToast(
          modalMode === 'edit' ? 'Event updated successfully.' : 'Event created successfully.',
          'success'
        );
      } else {
        showToast(response.message || 'Failed to save event.', 'error');
      }
    } catch {
      showToast('An error occurred while saving your event. Please try again.', 'error');
    }
  };

  // ── Confirm-delete modal handlers ────────────────────────────────────────

  const handleDeleteClick = (event) => {
    setEventToDelete(event);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!eventToDelete) return;
    setConfirmOpen(false);

    try {
      const response = await eventService.deleteEvent(eventToDelete._id);
      if (response.success) {
        // Refresh both lists after delete
        fetchEvents({ search: debouncedSearch, type, dateRange });
        fetchAllEvents();
        showToast('Event deleted successfully.', 'success');
      } else {
        showToast(response.message || 'Failed to delete event.', 'error');
      }
    } catch {
      showToast('Failed to delete event from the server.', 'error');
    } finally {
      setEventToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setConfirmOpen(false);
    setEventToDelete(null);
  };

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto relative min-h-[calc(100vh-70px)]">

      {/* ── Page Header ───────────────────────────────────────── */}
      <PageHeader
        title="Calendar"
        subtitle="Schedule, track, and manage your meetings, events, and reminders."
        icon={<CalendarDays className="w-6 h-6 text-primary-600" aria-hidden="true" />}
      />

      {/* ── Error Banner ─────────────────────────────────────── */}
      {error && (
        <div className="flex items-center justify-between gap-3 p-4 bg-rose-50 dark:bg-rose-900/30 border border-rose-100 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-sm font-semibold rounded-xl">
          <div className="flex items-center gap-2 min-w-0">
            <AlertCircle className="w-5 h-5 text-rose-500 dark:text-rose-400 flex-shrink-0" aria-hidden="true" />
            <span className="truncate">{error}</span>
          </div>
          <button
            type="button"
            onClick={() => setError(null)}
            className="text-xs font-bold uppercase tracking-wider text-rose-500 dark:text-rose-400 hover:text-rose-800 dark:hover:text-rose-300 transition-colors focus:outline-none focus:ring-2 focus:ring-rose-300 rounded"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* ── Event Statistics ───────────────────────────────────── */}
      <EventStats events={allEvents} />

      {/* ── Sidebar Row: Upcoming Events + Birthday Reminders ──── */}
      {/* BirthdayReminder renders null when no birthdays exist,   */}
      {/* so this grid collapses to 1 column naturally on mobile.  */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <UpcomingEvents events={allEvents} />
        <BirthdayReminder events={allEvents} />
      </div>

      {/* ── Search + Filters ──────────────────────────────────── */}
      <EventFilters
        search={search}
        onSearchChange={setSearch}
        type={type}
        onTypeChange={setType}
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        onClearFilters={handleClearFilters}
      />

      {/* ── Events Grid ───────────────────────────────────────── */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
            <EventCardSkeleton key={i} />
          ))}
        </div>
      ) : events.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <EventCard
              key={event._id}
              event={event}
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
            />
          ))}
        </div>
      )}

      {/* ── Floating Add Event Button ──────────────────────────── */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          type="button"
          onClick={handleAddClick}
          className="flex items-center gap-2 px-5 py-3.5 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 active:from-primary-700 active:to-primary-800 text-white font-bold rounded-2xl shadow-lg shadow-primary-200 hover:shadow-xl hover:scale-105 active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          aria-label="Add new event"
        >
          <Plus className="w-5 h-5" aria-hidden="true" />
          <span>Add Event</span>
        </button>
      </div>

      {/* ── Add / Edit Event Modal ─────────────────────────────── */}
      <EventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        mode={modalMode}
        event={selectedEvent || undefined}
        onSave={handleSaveEvent}
      />

      {/* ── Delete Confirmation Modal ──────────────────────────── */}
      <ConfirmModal
        isOpen={confirmOpen}
        title="Delete Event"
        message={
          eventToDelete
            ? `Are you sure you want to delete "${eventToDelete.title}"? This action cannot be undone.`
            : ''
        }
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />

      {/* ── Toast Notifications ────────────────────────────────── */}
      <Toast toasts={toasts} onRemove={removeToast} />

    </div>
  );
}

export default Calendar;
