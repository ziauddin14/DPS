import { useState, useEffect, useCallback } from 'react';
import { Plus, Briefcase, AlertCircle } from 'lucide-react';
import ProjectStats from '../components/ProjectStats';
import ProjectFilters from '../components/ProjectFilters';
import ProjectTable from '../components/ProjectTable';
import ProjectCardSkeleton from '../components/ProjectCardSkeleton';
import ProjectModal from '../components/ProjectModal';
import EmptyState from '../components/EmptyState';
import ConfirmModal from '../components/ConfirmModal';
import Toast from '../components/Toast';
import useToast from '../hooks/useToast';
import projectService from '../services/projectService';
import { PageHeader } from '../components/ui';

// Default filter state
const DEFAULT_FILTERS = {
  search: '',
  status: 'All',
  priority: 'All',
  category: 'All',
};

// Number of skeleton cards shown while loading
const SKELETON_COUNT = 6;

/**
 * Projects Page component.
 * Integrates frontend components with MERN backend API handlers.
 * Supports search (debounced 500ms) and status/priority/category filtering.
 * Full CRUD: create, read, update, delete via ProjectModal and ConfirmModal.
 */
function Projects() {
  const [projects, setProjects] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Toast notification hook
  const { toasts, showToast, removeToast } = useToast();

  // Filters state
  const [search, setSearch] = useState(DEFAULT_FILTERS.search);
  const [debouncedSearch, setDebouncedSearch] = useState(DEFAULT_FILTERS.search);
  const [status, setStatus] = useState(DEFAULT_FILTERS.status);
  const [priority, setPriority] = useState(DEFAULT_FILTERS.priority);
  const [category, setCategory] = useState(DEFAULT_FILTERS.category);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [selectedProject, setSelectedProject] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // Confirm delete modal state
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);

  // ── Data fetching ────────────────────────────────────────────────────────

  /**
   * Fetch projects from the backend, forwarding active filter params.
   */
  const fetchProjects = useCallback(async (filters = {}) => {
    setIsLoading(true);
    setError(null);

    const params = {};
    if (filters.search)                           params.search   = filters.search;
    if (filters.status   && filters.status   !== 'All') params.status   = filters.status;
    if (filters.priority && filters.priority !== 'All') params.priority = filters.priority;
    if (filters.category && filters.category !== 'All') params.category = filters.category;

    try {
      const response = await projectService.getAllProjects(params);
      if (response.success) {
        setProjects(response.data?.projects ?? []);
        setCategories(response.data?.categories ?? []);
      } else {
        setError(response.message || 'Failed to fetch projects.');
      }
    } catch {
      setError('Could not retrieve projects from server. Please check your connection.');
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

  // Re-fetch when debouncedSearch or filters change.
  useEffect(() => {
    fetchProjects({ search: debouncedSearch, status, priority, category });
  }, [debouncedSearch, status, priority, category, fetchProjects]);

  // ── Filter handlers ──────────────────────────────────────────────────────

  const handleClearFilters = () => {
    setSearch(DEFAULT_FILTERS.search);
    setDebouncedSearch(DEFAULT_FILTERS.search);
    setStatus(DEFAULT_FILTERS.status);
    setPriority(DEFAULT_FILTERS.priority);
    setCategory(DEFAULT_FILTERS.category);
  };

  // ── Modal Triggers ───────────────────────────────────────────────────────

  const handleAddClick = () => {
    setModalMode('add');
    setSelectedProject(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (project) => {
    setModalMode('edit');
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    if (isSaving) return;
    setIsModalOpen(false);
    setSelectedProject(null);
  };

  // ── Save handler (create or update) ─────────────────────────────────────

  const handleSave = async (data) => {
    setIsSaving(true);
    try {
      if (modalMode === 'edit' && selectedProject) {
        const response = await projectService.updateProject(selectedProject._id, data);
        if (response.success) {
          showToast('Project updated successfully.', 'success');
          setIsModalOpen(false);
          setSelectedProject(null);
          fetchProjects({ search: debouncedSearch, status, priority, category });
        } else {
          showToast(response.message || 'Failed to update project.', 'error');
        }
      } else {
        const response = await projectService.createProject(data);
        if (response.success) {
          showToast('Project created successfully.', 'success');
          setIsModalOpen(false);
          setSelectedProject(null);
          fetchProjects({ search: debouncedSearch, status, priority, category });
        } else {
          showToast(response.message || 'Failed to create project.', 'error');
        }
      }
    } catch {
      showToast('An error occurred while saving the project.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // ── Confirm-delete modal handlers ────────────────────────────────────────

  const handleDeleteClick = (project) => {
    setProjectToDelete(project);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!projectToDelete) return;
    setConfirmOpen(false);

    try {
      const response = await projectService.deleteProject(projectToDelete._id);
      if (response.success) {
        fetchProjects({ search: debouncedSearch, status, priority, category });
        showToast('Project deleted successfully.', 'success');
      } else {
        showToast(response.message || 'Failed to delete project.', 'error');
      }
    } catch {
      showToast('Failed to delete project from the server.', 'error');
    } finally {
      setProjectToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setConfirmOpen(false);
    setProjectToDelete(null);
  };

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto relative min-h-[calc(100vh-70px)]">

      {/* ── Page Header ───────────────────────────────────────── */}
      <PageHeader
        title="Project Hub"
        subtitle="Organize, track progress, collaborate on timelines, and manage deliverables."
        icon={<Briefcase className="w-6 h-6 text-primary-600" aria-hidden="true" />}
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

      {/* ── Project Statistics ───────────────────────────────────────── */}
      <ProjectStats projects={projects} />

      {/* ── Search + Filters ──────────────────────────────────────── */}
      <ProjectFilters
        search={search}
        onSearchChange={setSearch}
        status={status}
        onStatusChange={setStatus}
        priority={priority}
        onPriorityChange={setPriority}
        category={category}
        onCategoryChange={setCategory}
        categories={categories}
        onClearFilters={handleClearFilters}
      />

      {/* ── Projects Table ──────────────────────────────────────────── */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
            <ProjectCardSkeleton key={i} />
          ))}
        </div>
      ) : projects.length === 0 ? (
        <EmptyState />
      ) : (
        <ProjectTable
          projects={projects}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
        />
      )}

      {/* ── Floating Add Project Button ────────────────────────────────── */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          type="button"
          onClick={handleAddClick}
          className="flex items-center gap-2 px-5 py-3.5 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 active:from-primary-700 active:to-primary-800 text-white font-bold rounded-2xl shadow-lg shadow-primary-200 hover:shadow-xl hover:scale-105 active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          aria-label="Add new project"
        >
          <Plus className="w-5 h-5" aria-hidden="true" />
          <span>Add Project</span>
        </button>
      </div>

      {/* ── Add / Edit Modal ─────────────────────────────────────────── */}
      <ProjectModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        mode={modalMode}
        project={selectedProject}
        onSave={handleSave}
        isSaving={isSaving}
      />

      {/* ── Delete Confirmation Modal ──────────────────────────────── */}
      <ConfirmModal
        isOpen={confirmOpen}
        title="Delete Project"
        message={
          projectToDelete
            ? `Are you sure you want to delete "${projectToDelete.title}"? This action cannot be undone.`
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

export default Projects;
export { Projects };
