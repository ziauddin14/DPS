import { useState, useEffect, useCallback } from 'react';
import { Plus, ListChecks, AlertCircle } from 'lucide-react';
import TaskStats from '../components/TaskStats';
import TaskFilters from '../components/TaskFilters';
import TaskTable from '../components/TaskTable';
import TaskTableSkeleton from '../components/TaskTableSkeleton';
import EmptyState from '../components/EmptyState';
import TaskModal from '../components/TaskModal';
import ConfirmModal from '../components/ConfirmModal';
import Toast from '../components/Toast';
import ExportDropdown from '../components/ExportDropdown';
import FollowUpModal from '../components/FollowUpModal';
import ProjectModal from '../components/ProjectModal';
import useToast from '../hooks/useToast';
import taskService from '../services/taskService';
import followupService from '../services/followupService';
import projectService from '../services/projectService';
import { PageHeader } from '../components/ui';
import { generateFilteredTasksMessage, openWhatsApp } from '../utils/whatsappShare';
import { exportToPDF, exportToExcel, exportToCSV } from '../utils/exportTasks';
import { useSettings } from '../context/SettingsContext';

// Default filter state — single source of truth for initial load and clear-filters reset
const DEFAULT_FILTERS = {
  search: '',
  department: 'All',
  priority: 'All',
  status: 'All',
  dependency: 'All',
};

// Number of skeleton cards shown while loading
const SKELETON_COUNT = 6;

/**
 * Tasks Page component.
 * Integrates frontend components with MERN backend API handlers.
 * Supports search (debounced 500ms) and department/priority/status/dependency filtering.
 */
function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { settings } = useSettings();

  // Toast notification system
  const { toasts, showToast, removeToast } = useToast();

  // Filter state
  // `search` — raw controlled value shown in the input (updates on every keystroke).
  // `debouncedSearch` — settled value sent to the backend (updated 500ms after typing stops).
  const [search, setSearch] = useState(DEFAULT_FILTERS.search);
  const [debouncedSearch, setDebouncedSearch] = useState(DEFAULT_FILTERS.search);
  const [department, setDepartment] = useState(DEFAULT_FILTERS.department);
  const [priority, setPriority] = useState(DEFAULT_FILTERS.priority);
  const [status, setStatus] = useState(DEFAULT_FILTERS.status);
  const [dependency, setDependency] = useState(DEFAULT_FILTERS.dependency);

  // Task modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [selectedTask, setSelectedTask] = useState(null);

  // Confirm-delete modal state
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  // Conversion modal state
  const [isFollowUpModalOpen, setIsFollowUpModalOpen] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [taskToConvert, setTaskToConvert] = useState(null);
  const [isSavingConversion, setIsSavingConversion] = useState(false);

  // ── Data fetching ────────────────────────────────────────────────────────

  /**
   * Fetch tasks from the backend, forwarding active filter params.
   * Stable reference via useCallback — no dependencies so it never re-creates.
   */
  const fetchTasks = useCallback(async (filters = {}) => {
    setIsLoading(true);
    setError(null);

    // Build params — omit 'All' so the backend applies no filter for that field
    const params = {};
    if (filters.search)                                params.search     = filters.search;
    if (filters.department && filters.department !== 'All') params.department = filters.department;
    if (filters.priority && filters.priority !== 'All') params.priority   = filters.priority;
    if (filters.status   && filters.status   !== 'All') params.status     = filters.status;
    if (filters.dependency && filters.dependency !== 'All') params.dependency = filters.dependency;

    try {
      const response = await taskService.getAllTasks(params);
      if (response.success) {
        setTasks(response.data?.tasks ?? []);
        setDepartments(response.data?.departments ?? []);
      } else {
        setError(response.message || 'Failed to fetch tasks.');
      }
    } catch {
      setError('Could not retrieve tasks from server. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 500ms debounce for the search input.
  // Clears the timer if the user keeps typing — only commits after a 500ms pause.
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  // Re-fetch when debouncedSearch (delayed) or any instant filter changes.
  // Department, priority, status, dependency are always immediate; search waits for debounce.
  useEffect(() => {
    fetchTasks({ search: debouncedSearch, department, priority, status, dependency });
  }, [debouncedSearch, department, priority, status, dependency, fetchTasks]);

  // ── Filter handlers ──────────────────────────────────────────────────────

  const handleClearFilters = () => {
    setSearch(DEFAULT_FILTERS.search);
    setDebouncedSearch(DEFAULT_FILTERS.search); // reset immediately so fetch fires without delay
    setDepartment(DEFAULT_FILTERS.department);
    setPriority(DEFAULT_FILTERS.priority);
    setStatus(DEFAULT_FILTERS.status);
    setDependency(DEFAULT_FILTERS.dependency);
  };

  // ── Task modal handlers ──────────────────────────────────────────────────

  const handleAddClick = () => {
    setModalMode('add');
    setSelectedTask(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (task) => {
    setModalMode('edit');
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleSaveTask = async (taskData) => {
    setError(null);
    try {
      let response;
      if (modalMode === 'edit' && selectedTask) {
        response = await taskService.updateTask(selectedTask._id, taskData);
      } else {
        response = await taskService.createTask(taskData);
      }

      if (response.success) {
        setIsModalOpen(false);
        fetchTasks({ search: debouncedSearch, department, priority, status, dependency });
        showToast(
          modalMode === 'edit' ? 'Task updated successfully.' : 'Task created successfully.',
          'success'
        );
      } else {
        showToast(response.message || 'Failed to save task.', 'error');
      }
    } catch {
      showToast('An error occurred while saving your task. Please try again.', 'error');
    }
  };

  const handleToggleComplete = async (task) => {
    try {
      const isCompleted = task.status === 'Completed' || task.completed;
      const nextCompleted = !isCompleted;
      const nextStatus = nextCompleted ? 'Completed' : 'Pending';

      const response = await taskService.updateTask(task._id, {
        completed: nextCompleted,
        status: nextStatus,
      });

      if (response.success) {
        fetchTasks({ search: debouncedSearch, department, priority, status, dependency });
      } else {
        showToast(response.message || 'Failed to update task status.', 'error');
      }
    } catch {
      showToast('Failed to update task status on the server.', 'error');
    }
  };

  // ── Confirm-delete modal handlers ────────────────────────────────────────

  const handleDeleteClick = (task) => {
    setTaskToDelete(task);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!taskToDelete) return;
    setConfirmOpen(false);

    try {
      const response = await taskService.deleteTask(taskToDelete._id);
      if (response.success) {
        fetchTasks({ search: debouncedSearch, department, priority, status, dependency });
        showToast('Task deleted successfully.', 'success');
      } else {
        showToast(response.message || 'Failed to delete task.', 'error');
      }
    } catch {
      showToast('Failed to delete task from the server.', 'error');
    } finally {
      setTaskToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setConfirmOpen(false);
    setTaskToDelete(null);
  };

  // ── Conversion handlers ─────────────────────────────────────────────────────

  const handleConvertToFollowup = (task) => {
    if (task.convertedTo) {
      showToast('This task has already been converted.', 'error');
      return;
    }
    setTaskToConvert(task);
    setIsFollowUpModalOpen(true);
  };

  const handleConvertToProject = (task) => {
    if (task.convertedTo) {
      showToast('This task has already been converted.', 'error');
      return;
    }
    setTaskToConvert(task);
    setIsProjectModalOpen(true);
  };

  const handleSaveFollowupConversion = async (followupData) => {
    if (!taskToConvert) return;
    setIsSavingConversion(true);

    try {
      console.log("Followup payload:", followupData);
      const response = await followupService.createFollowup(followupData);
      if (response.success) {
        // Update task with conversion tracking
        await taskService.updateTask(taskToConvert._id, {
          convertedTo: 'Followup',
          convertedReference: response.data?.followup?._id
        });
        setIsFollowUpModalOpen(false);
        setTaskToConvert(null);
        fetchTasks({ search: debouncedSearch, department, priority, status, dependency });
        showToast('Task converted to Follow-up successfully.', 'success');
      } else {
        showToast(response.message || 'Failed to convert task to Follow-up.', 'error');
      }
    } catch (error) {
      console.error("Followup conversion error:", error);
      console.error("Error response:", error.response);
      console.error("Error response data:", error.response?.data);
      showToast('An error occurred while converting task. Please try again.', 'error');
    } finally {
      setIsSavingConversion(false);
    }
  };

  const handleSaveProjectConversion = async (projectData) => {
    if (!taskToConvert) return;
    setIsSavingConversion(true);

    try {
      const response = await projectService.createProject(projectData);
      if (response.success) {
        // Update task with conversion tracking
        await taskService.updateTask(taskToConvert._id, {
          convertedTo: 'Project',
          convertedReference: response.data?.project?._id
        });
        setIsProjectModalOpen(false);
        setTaskToConvert(null);
        fetchTasks({ search: debouncedSearch, department, priority, status, dependency });
        showToast('Task converted to Project successfully.', 'success');
      } else {
        showToast(response.message || 'Failed to convert task to Project.', 'error');
      }
    } catch {
      showToast('An error occurred while converting task. Please try again.', 'error');
    } finally {
      setIsSavingConversion(false);
    }
  };

  // ── Export handlers ────────────────────────────────────────────────────

  const handleExportWhatsApp = () => {
    if (tasks.length === 0) {
      showToast('No tasks available to export.', 'error');
      return;
    }

    const message = generateFilteredTasksMessage(tasks, settings);
    if (message) {
      openWhatsApp(message);
    }
  };

  const handleExportPDF = (lang = 'en') => {
    if (tasks.length === 0) {
      showToast('No tasks available to export.', 'error');
      return;
    }

    exportToPDF(tasks, settings, status, lang);
  };

  const handleExportExcel = () => {
    if (tasks.length === 0) {
      showToast('No tasks available to export.', 'error');
      return;
    }

    exportToExcel(tasks);
  };

  const handleExportCSV = () => {
    if (tasks.length === 0) {
      showToast('No tasks available to export.', 'error');
      return;
    }

    exportToCSV(tasks);
  };

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto relative min-h-[calc(100vh-70px)]">

      {/* ── Page Header ───────────────────────────────────────────── */}
      <PageHeader
        title="Task Manager"
        subtitle="Manage your daily tasks efficiently."
        icon={<ListChecks className="w-6 h-6 text-primary-600" aria-hidden="true" />}
        actions={
          <ExportDropdown
            onExportWhatsApp={handleExportWhatsApp}
            onExportPDF={handleExportPDF}
            onExportExcel={handleExportExcel}
            onExportCSV={handleExportCSV}
          />
        }
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

      {/* ── Task Statistics ───────────────────────────────────────── */}
      <TaskStats tasks={tasks} />

      {/* ── Search + Filters ──────────────────────────────────────── */}
      <TaskFilters
        search={search}
        onSearchChange={setSearch}
        department={department}
        onDepartmentChange={setDepartment}
        priority={priority}
        onPriorityChange={setPriority}
        status={status}
        onStatusChange={setStatus}
        dependency={dependency}
        onDependencyChange={setDependency}
        onClearFilters={handleClearFilters}
      />

      {/* ── Task List / Table ──────────────────────────────────────── */}
      {isLoading ? (
        // Table skeleton
        <TaskTableSkeleton count={SKELETON_COUNT} />
      ) : tasks.length === 0 ? (
        <EmptyState />
      ) : (
        <TaskTable
          tasks={tasks}
          onEdit={handleEditClick}
          onToggleComplete={handleToggleComplete}
          onDelete={handleDeleteClick}
          onConvertToFollowup={handleConvertToFollowup}
          onConvertToProject={handleConvertToProject}
        />
      )}

      {/* ── Floating Add Task Button ────────────────────────────────── */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          type="button"
          onClick={handleAddClick}
          className="flex items-center gap-2 px-5 py-3.5 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 active:from-primary-700 active:to-primary-800 text-white font-bold rounded-2xl shadow-lg shadow-primary-200 hover:shadow-xl hover:scale-105 active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          aria-label="Add new task"
        >
          <Plus className="w-5 h-5" aria-hidden="true" />
          <span>Add Task</span>
        </button>
      </div>

      {/* ── Add / Edit Task Modal ──────────────────────────────────── */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        mode={modalMode}
        task={selectedTask || undefined}
        onSave={handleSaveTask}
      />

      {/* ── Delete Confirmation Modal ──────────────────────────────── */}
      <ConfirmModal
        isOpen={confirmOpen}
        title="Delete Task"
        message={
          taskToDelete
            ? `Are you sure you want to delete "${taskToDelete.title}"? This action cannot be undone.`
            : ''
        }
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />

      {/* ── Toast Notifications ────────────────────────────────────── */}
      <Toast toasts={toasts} onRemove={removeToast} />

      {/* ── Convert to Follow-up Modal ────────────────────────────────── */}
      <FollowUpModal
        isOpen={isFollowUpModalOpen}
        onClose={() => {
          setIsFollowUpModalOpen(false);
          setTaskToConvert(null);
        }}
        mode="add"
        followup={taskToConvert ? {
          personName: 'Task Owner',
          subject: taskToConvert.title,
          description: taskToConvert.description,
          relatedTask: taskToConvert._id,
          department: taskToConvert.department,
          priority: taskToConvert.priority,
          nextFollowupDate: new Date().toISOString().split('T')[0]
        } : undefined}
        onSave={handleSaveFollowupConversion}
        tasks={[taskToConvert].filter(Boolean)}
      />

      {/* ── Convert to Project Modal ─────────────────────────────────── */}
      <ProjectModal
        isOpen={isProjectModalOpen}
        onClose={() => {
          setIsProjectModalOpen(false);
          setTaskToConvert(null);
        }}
        mode="add"
        project={taskToConvert ? {
          title: taskToConvert.title,
          description: taskToConvert.description,
          department: taskToConvert.department,
          priority: taskToConvert.priority,
          startDate: new Date().toISOString().split('T')[0],
          status: 'Planning'
        } : undefined}
        onSave={handleSaveProjectConversion}
        isSaving={isSavingConversion}
      />

    </div>
  );
}

export default Tasks;
