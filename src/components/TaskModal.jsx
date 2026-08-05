import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { Input, Textarea, Select, Button } from './ui';
import SearchableMultiSelect from './SearchableMultiSelect';
import { DEPENDENCY_OPTIONS } from '../constants/dependencyOptions';

/**
 * Priority options for the Task form.
 * Defined outside the component to prevent recreation on every render.
 */
const PRIORITY_OPTIONS = [
  { value: 'High',   label: 'High' },
  { value: 'Medium', label: 'Medium' },
  { value: 'Low',    label: 'Low' },
];

/**
 * Status options for the Task form.
 */
const STATUS_OPTIONS = [
  { value: 'Pending',     label: 'Pending' },
  { value: 'In Progress', label: 'In Progress' },
  { value: 'Completed',   label: 'Completed' },
  { value: 'Overdue',     label: 'Overdue' },
];

/**
 * Department options for the Task form.
 */
const DEPARTMENT_OPTIONS = [
  { value: 'ETD', label: 'ETD' },
  { value: 'NTD', label: 'NTD' },
];

/**
 * TaskModal — reusable modal for adding or editing a task.
 *
 * @param {boolean}  isOpen  - Determines if the modal is visible.
 * @param {Function} onClose - Callback function to close the modal.
 * @param {string}   mode    - 'add' or 'edit'.
 * @param {object}   [task]  - Task object to populate inputs (for 'edit' mode).
 * @param {Function} [onSave]- Callback when saving form: (taskData) => void
 */
function TaskModal({ isOpen, onClose, mode = 'add', task, onSave }) {
  // Controlled state for department and dependency
  const [department, setDepartment] = useState(task?.department || 'ETD');
  const [dependency, setDependency] = useState(
    Array.isArray(task?.dependency) ? task.dependency : 
    (task?.dependency ? [task.dependency] : [])
  );

  // Close on ESC key
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Reset form when mode changes or task changes
  useEffect(() => {
    if (task) {
      setDepartment(task.department || 'ETD');
      setDependency(
        Array.isArray(task.dependency) ? task.dependency : 
        (task.dependency ? [task.dependency] : [])
      );
    } else {
      setDepartment('ETD');
      setDependency([]);
    }
  }, [task, mode]);

  if (!isOpen) return null;

  const isEdit = mode === 'edit';
  const modalTitle = isEdit ? 'Edit Task' : 'Add Task';

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      title:       formData.get('title'),
      description: formData.get('description'),
      priority:    formData.get('priority'),
      status:      formData.get('status'),
      department:  formData.get('department'),
      dependency:  dependency,
      deadline:    formData.get('deadline') || undefined,
      delayReason: formData.get('delayReason') || '',
    };
    if (onSave) onSave(data);
  };

  return (
    <div
      className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Modal container */}
      <div
        className="bg-white rounded-2xl border border-slate-100 shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h3 id="modal-title" className="text-lg font-bold text-slate-800 tracking-tight">
            {modalTitle}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-300"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Form body */}
        <form onSubmit={handleSubmit} className="flex flex-col overflow-hidden">
          <div className="p-6 space-y-4 overflow-y-auto">
            {/* Title */}
            <Input
              label="Title"
              id="task-title"
              name="title"
              required
              placeholder="Enter task title"
              defaultValue={task?.title ?? ''}
            />

            {/* Description */}
            <Textarea
              label="Description"
              id="task-desc"
              name="description"
              placeholder="Enter task description"
              rows={3}
              defaultValue={task?.description ?? ''}
            />

            {/* Priority + Status */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="Priority"
                id="task-priority"
                name="priority"
                options={PRIORITY_OPTIONS}
                defaultValue={task?.priority ?? 'Medium'}
              />
              <Select
                label="Status"
                id="task-status"
                name="status"
                options={STATUS_OPTIONS}
                defaultValue={task?.status ?? 'Pending'}
              />
            </div>

            {/* Department */}
            <Select
              label="Department"
              id="task-department"
              name="department"
              options={DEPARTMENT_OPTIONS}
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              required
            />

            {/* Dependency */}
            <SearchableMultiSelect
              label="Dependencies"
              options={DEPENDENCY_OPTIONS}
              value={dependency}
              onChange={setDependency}
              placeholder="Search dependencies..."
            />

            {/* Deadline */}
            <Input
              label="Deadline"
              id="task-deadline"
              name="deadline"
              type="date"
              defaultValue={
                task?.deadline
                  ? new Date(task.deadline).toISOString().split('T')[0]
                  : ''
              }
            />

            {/* Delay Reason - Only show if task has deadline and is overdue or in edit mode */}
            {(isEdit || (task?.deadline && new Date(task.deadline) < new Date())) && (
              <Textarea
                label="Reason for Delay"
                id="task-delay-reason"
                name="delayReason"
                placeholder="Enter reason for delay..."
                rows={3}
                defaultValue={task?.delayReason ?? ''}
              />
            )}
          </div>

          {/* Footer actions */}
          <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-3">
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Save Task
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TaskModal;
export { TaskModal };
