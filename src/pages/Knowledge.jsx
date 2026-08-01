import { useState, useEffect, useCallback } from 'react';
import { Plus, Library, AlertCircle } from 'lucide-react';
import KnowledgeStats from '../components/KnowledgeStats';
import KnowledgeFilters from '../components/KnowledgeFilters';
import KnowledgeCard from '../components/KnowledgeCard';
import KnowledgeCardSkeleton from '../components/KnowledgeCardSkeleton';
import KnowledgeModal from '../components/KnowledgeModal';
import EmptyState from '../components/EmptyState';
import ConfirmModal from '../components/ConfirmModal';
import Toast from '../components/Toast';
import useToast from '../hooks/useToast';
import knowledgeService from '../services/knowledgeService';
import { PageHeader } from '../components/ui';

// Default filters
const DEFAULT_FILTERS = {
  search:   '',
  type:     'All',
  category: 'All',
  favorite: 'All',
};

// Loading skeletons count
const SKELETON_COUNT = 6;

/**
 * Knowledge Vault Page component.
 * Complete integration with MERN backend API handlers.
 * Supports CRUD, search debounce (500ms), and custom categorisation/filters.
 */
function Knowledge() {
  const [knowledge, setKnowledge] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Toast notifications hook
  const { toasts, showToast, removeToast } = useToast();

  // Filters state
  const [search, setSearch] = useState(DEFAULT_FILTERS.search);
  const [debouncedSearch, setDebouncedSearch] = useState(DEFAULT_FILTERS.search);
  const [type, setType] = useState(DEFAULT_FILTERS.type);
  const [category, setCategory] = useState(DEFAULT_FILTERS.category);
  const [favorite, setFavorite] = useState(DEFAULT_FILTERS.favorite);

  // Modal dialog states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // Delete confirm state
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [entryToDelete, setEntryToDelete] = useState(null);

  // ── Data fetching ────────────────────────────────────────────────────────

  /**
   * Fetch knowledge entries from API, forwarding active filter params.
   */
  const fetchKnowledge = useCallback(async (filters = {}) => {
    setIsLoading(true);
    setError(null);

    const params = {};
    if (filters.search)                         params.search   = filters.search;
    if (filters.type     && filters.type     !== 'All') params.type     = filters.type;
    if (filters.category && filters.category !== 'All') params.category = filters.category;
    if (filters.favorite && filters.favorite !== 'All') params.favorite = filters.favorite;

    try {
      const response = await knowledgeService.getAllKnowledge(params);
      if (response.success) {
        setKnowledge(response.data?.knowledge ?? []);
        setCategories(response.data?.categories ?? []);
      } else {
        setError(response.message || 'Failed to fetch knowledge entries.');
      }
    } catch {
      setError('Could not retrieve knowledge entries from server. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 500ms search input debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  // Re-fetch when debouncedSearch or filters change
  useEffect(() => {
    fetchKnowledge({ search: debouncedSearch, type, category, favorite });
  }, [debouncedSearch, type, category, favorite, fetchKnowledge]);

  // ── Filters reset ────────────────────────────────────────────────────────

  const handleClearFilters = () => {
    setSearch(DEFAULT_FILTERS.search);
    setDebouncedSearch(DEFAULT_FILTERS.search);
    setType(DEFAULT_FILTERS.type);
    setCategory(DEFAULT_FILTERS.category);
    setFavorite(DEFAULT_FILTERS.favorite);
  };

  // ── Modal Handlers ───────────────────────────────────────────────────────

  const handleAddClick = () => {
    setModalMode('add');
    setSelectedEntry(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (entry) => {
    setModalMode('edit');
    setSelectedEntry(entry);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    if (isSaving) return;
    setIsModalOpen(false);
    setSelectedEntry(null);
  };

  const handleSave = async (data) => {
    setIsSaving(true);
    try {
      if (modalMode === 'edit' && selectedEntry) {
        const response = await knowledgeService.updateKnowledge(selectedEntry._id, data);
        if (response.success) {
          showToast('Knowledge entry updated successfully.', 'success');
          setIsModalOpen(false);
          setSelectedEntry(null);
          fetchKnowledge({ search: debouncedSearch, type, category, favorite });
        } else {
          showToast(response.message || 'Failed to update entry.', 'error');
        }
      } else {
        const response = await knowledgeService.createKnowledge(data);
        if (response.success) {
          showToast('Knowledge entry created successfully.', 'success');
          setIsModalOpen(false);
          setSelectedEntry(null);
          fetchKnowledge({ search: debouncedSearch, type, category, favorite });
        } else {
          showToast(response.message || 'Failed to create entry.', 'error');
        }
      }
    } catch {
      showToast('An error occurred while saving the entry.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // ── Favorite toggle handler ──────────────────────────────────────────────

  const handleToggleFavorite = async (entry) => {
    try {
      const response = await knowledgeService.updateKnowledge(entry._id, {
        favorite: !entry.favorite,
      });
      if (response.success) {
        // Toggle inline inside local state for performance (avoid full reloading flicker)
        setKnowledge((prev) =>
          prev.map((k) => (k._id === entry._id ? { ...k, favorite: !k.favorite } : k))
        );
        showToast(
          entry.favorite ? 'Removed from favorites.' : 'Added to favorites.',
          'success'
        );
      } else {
        showToast(response.message || 'Failed to toggle favorite.', 'error');
      }
    } catch {
      showToast('Error updating favorite state.', 'error');
    }
  };

  // ── Delete entry handlers ────────────────────────────────────────────────

  const handleDeleteClick = (entry) => {
    setEntryToDelete(entry);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!entryToDelete) return;
    setConfirmOpen(false);

    try {
      const response = await knowledgeService.deleteKnowledge(entryToDelete._id);
      if (response.success) {
        fetchKnowledge({ search: debouncedSearch, type, category, favorite });
        showToast('Knowledge entry deleted successfully.', 'success');
      } else {
        showToast(response.message || 'Failed to delete entry.', 'error');
      }
    } catch {
      showToast('Failed to delete entry from server.', 'error');
    } finally {
      setEntryToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setConfirmOpen(false);
    setEntryToDelete(null);
  };

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto relative min-h-[calc(100vh-70px)]">

      {/* ── Page Header ───────────────────────────────────────── */}
      <PageHeader
        title="Knowledge Vault"
        subtitle="Organize resources, save book notes, record articles, capture ideas, and keep track of learnings."
        icon={<Library className="w-6 h-6 text-primary-600" aria-hidden="true" />}
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

      {/* ── Statistics ───────────────────────────────────────────── */}
      <KnowledgeStats knowledge={knowledge} />

      {/* ── Search + Filters ──────────────────────────────────────── */}
      <KnowledgeFilters
        search={search}
        onSearchChange={setSearch}
        type={type}
        onTypeChange={setType}
        category={category}
        onCategoryChange={setCategory}
        favorite={favorite}
        onFavoriteChange={setFavorite}
        categories={categories}
        onClearFilters={handleClearFilters}
      />

      {/* ── Cards Grid ────────────────────────────────────────────── */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
            <KnowledgeCardSkeleton key={i} />
          ))}
        </div>
      ) : knowledge.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {knowledge.map((entry) => (
            <KnowledgeCard
              key={entry._id}
              entry={entry}
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
              onToggleFav={handleToggleFavorite}
            />
          ))}
        </div>
      )}

      {/* ── Floating Add Button ──────────────────────────────────────── */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          type="button"
          onClick={handleAddClick}
          className="flex items-center gap-2 px-5 py-3.5 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 active:from-primary-700 active:to-primary-800 text-white font-bold rounded-2xl shadow-lg shadow-primary-200 hover:shadow-xl hover:scale-105 active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          aria-label="Add new entry"
        >
          <Plus className="w-5 h-5" aria-hidden="true" />
          <span>Add Entry</span>
        </button>
      </div>

      {/* ── Add / Edit Modal ─────────────────────────────────────────── */}
      <KnowledgeModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        mode={modalMode}
        entry={selectedEntry}
        onSave={handleSave}
        isSaving={isSaving}
      />

      {/* ── Delete Confirmation Modal ──────────────────────────────── */}
      <ConfirmModal
        isOpen={confirmOpen}
        title="Delete Knowledge Entry"
        message={
          entryToDelete
            ? `Are you sure you want to delete "${entryToDelete.title}"? This action cannot be undone.`
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

export default Knowledge;
export { Knowledge };
