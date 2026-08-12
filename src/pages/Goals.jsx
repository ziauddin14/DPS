import { useState, useEffect, useCallback } from 'react';
import { Plus, Target, AlertCircle } from 'lucide-react';
import GoalStats from '../components/GoalStats';
import GoalFilters from '../components/GoalFilters';
import GoalTable from '../components/GoalTable';
import GoalCardSkeleton from '../components/GoalCardSkeleton';
import EmptyState from '../components/EmptyState';
import GoalModal from '../components/GoalModal';
import ConfirmModal from '../components/ConfirmModal';
import Toast from '../components/Toast';
import useToast from '../hooks/useToast';
import goalService from '../services/goalService';
import { PageHeader } from '../components/ui';

// Default filter state
const DEFAULT_FILTERS = {
  search: '',
  type: 'All',
  priority: 'All',
  status: 'All',
  category: 'All',
};

// Number of skeleton cards shown while loading
const SKELETON_COUNT = 6;

/**
 * Goals Page component.
 * Integrates frontend components with MERN backend API handlers.
 * Supports search (debounced 500ms) and type/priority/status/category filtering.
 */
function Goals() {
  const [goals, setGoals] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Toast notification hook
  const { toasts, showToast, removeToast } = useToast();

  // Filters state
  const [search, setSearch] = useState(DEFAULT_FILTERS.search);
  const [debouncedSearch, setDebouncedSearch] = useState(DEFAULT_FILTERS.search);
  const [type, setType] = useState(DEFAULT_FILTERS.type);
  const [priority, setPriority] = useState(DEFAULT_FILTERS.priority);
  const [status, setStatus] = useState(DEFAULT_FILTERS.status);
  const [category, setCategory] = useState(DEFAULT_FILTERS.category);

  // Goal modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [selectedGoal, setSelectedGoal] = useState(null);

  // Confirm delete modal state
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [goalToDelete, setGoalToDelete] = useState(null);

  // ── Data fetching ────────────────────────────────────────────────────────

  /**
   * Fetch goals from the backend, forwarding active filter params.
   */
  const fetchGoals = useCallback(async (filters = {}) => {
    setIsLoading(true);
    setError(null);

    // Build params — omit 'All' so backend filters aren't applied for that field
    const params = {};
    if (filters.search)                           params.search   = filters.search;
    if (filters.type     && filters.type     !== 'All') params.type     = filters.type;
    if (filters.priority && filters.priority !== 'All') params.priority = filters.priority;
    if (filters.status   && filters.status   !== 'All') params.status   = filters.status;
    if (filters.category && filters.category !== 'All') params.category = filters.category;

    try {
      const response = await goalService.getAllGoals(params);
      if (response.success) {
        setGoals(response.data?.goals ?? []);
        setCategories(response.data?.categories ?? []);
      } else {
        setError(response.message || 'Failed to fetch goals.');
      }
    } catch {
      setError('Could not retrieve goals from server. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 500ms debounce for the search input.
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  // Re-fetch when debouncedSearch (delayed) or any instant filter changes.
  useEffect(() => {
    fetchGoals({ search: debouncedSearch, type, priority, status, category });
  }, [debouncedSearch, type, priority, status, category, fetchGoals]);

  // ── Filter handlers ──────────────────────────────────────────────────────

  const handleClearFilters = () => {
    setSearch(DEFAULT_FILTERS.search);
    setDebouncedSearch(DEFAULT_FILTERS.search);
    setType(DEFAULT_FILTERS.type);
    setPriority(DEFAULT_FILTERS.priority);
    setStatus(DEFAULT_FILTERS.status);
    setCategory(DEFAULT_FILTERS.category);
  };

  // ── Goal modal handlers ──────────────────────────────────────────────────

  const handleAddClick = () => {
    setModalMode('add');
    setSelectedGoal(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (goal) => {
    setModalMode('edit');
    setSelectedGoal(goal);
    setIsModalOpen(true);
  };

  const handleSaveGoal = async (goalData) => {
    setError(null);
    try {
      let response;
      if (modalMode === 'edit' && selectedGoal) {
        response = await goalService.updateGoal(selectedGoal._id, goalData);
      } else {
        response = await goalService.createGoal(goalData);
      }

      if (response.success) {
        setIsModalOpen(false);
        fetchGoals({ search: debouncedSearch, type, priority, status, category });
        showToast(
          modalMode === 'edit' ? 'Goal updated successfully.' : 'Goal created successfully.',
          'success'
        );
      } else {
        showToast(response.message || 'Failed to save goal.', 'error');
      }
    } catch {
      showToast('An error occurred while saving your goal. Please try again.', 'error');
    }
  };

  // ── Confirm-delete modal handlers ────────────────────────────────────────

  const handleDeleteClick = (goal) => {
    setGoalToDelete(goal);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!goalToDelete) return;
    setConfirmOpen(false);

    try {
      const response = await goalService.deleteGoal(goalToDelete._id);
      if (response.success) {
        fetchGoals({ search: debouncedSearch, type, priority, status, category });
        showToast('Goal deleted successfully.', 'success');
      } else {
        showToast(response.message || 'Failed to delete goal.', 'error');
      }
    } catch {
      showToast('Failed to delete goal from the server.', 'error');
    } finally {
      setGoalToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setConfirmOpen(false);
    setGoalToDelete(null);
  };

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto relative min-h-[calc(100vh-70px)]">

      {/* ── Page Header ───────────────────────────────────────────── */}
      <PageHeader
        title="Goal Tracker"
        subtitle="Set, track, and achieve your long-term and short-term life goals."
        icon={<Target className="w-6 h-6 text-primary-600" aria-hidden="true" />}
      />

      {/* ── Error Banner ─────────────────────────────────────────── */}
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

      {/* ── Goal Statistics ───────────────────────────────────────── */}
      <GoalStats goals={goals} />

      {/* ── Search + Filters ──────────────────────────────────────── */}
      <GoalFilters
        search={search}
        onSearchChange={setSearch}
        type={type}
        onTypeChange={setType}
        priority={priority}
        onPriorityChange={setPriority}
        status={status}
        onStatusChange={setStatus}
        category={category}
        onCategoryChange={setCategory}
        categories={categories}
        onClearFilters={handleClearFilters}
      />

      {/* ── Goals Table ──────────────────────────────────────────── */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
            <GoalCardSkeleton key={i} />
          ))}
        </div>
      ) : goals.length === 0 ? (
        <EmptyState />
      ) : (
        <GoalTable
          goals={goals}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
        />
      )}

      {/* ── Floating Add Goal Button ────────────────────────────────── */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          type="button"
          onClick={handleAddClick}
          className="flex items-center gap-2 px-5 py-3.5 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 active:from-primary-700 active:to-primary-800 text-white font-bold rounded-2xl shadow-lg shadow-primary-200 hover:shadow-xl hover:scale-105 active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          aria-label="Add new goal"
        >
          <Plus className="w-5 h-5" aria-hidden="true" />
          <span>Add Goal</span>
        </button>
      </div>

      {/* ── Add / Edit Goal Modal ──────────────────────────────────── */}
      <GoalModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        mode={modalMode}
        goal={selectedGoal || undefined}
        onSave={handleSaveGoal}
      />

      {/* ── Delete Confirmation Modal ──────────────────────────────── */}
      <ConfirmModal
        isOpen={confirmOpen}
        title="Delete Goal"
        message={
          goalToDelete
            ? `Are you sure you want to delete "${goalToDelete.title}"? This action cannot be undone.`
            : ''
        }
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />

      {/* ── Toast Notifications ────────────────────────────────────── */}
      <Toast toasts={toasts} onRemove={removeToast} />

    </div>
  );
}

export default Goals;
export { Goals };
