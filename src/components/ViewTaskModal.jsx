import { useEffect, useState } from 'react';
import { X, Edit2, Trash2, Check } from 'lucide-react';
import { Badge, Button } from './ui';
import { formatDate } from '../utils/dateFormatter';
import { useSettings } from '../context/SettingsContext';

/**
 * Priority options for the Task form.
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
 * ViewTaskModal - Modal for viewing task details with edit/delete functionality
 *
 * @param {boolean}  isOpen  - Determines if the modal is visible
 * @param {Function} onClose - Callback function to close the modal
 * @param {object}   task    - Task object to display
 * @param {Function} onEdit  - Callback when editing task: (taskData) => void
 * @param {Function} onDelete - Callback when deleting task: (taskId) => void
 */
function ViewTaskModal({ isOpen, onClose, task, onEdit, onDelete }) {
  const { settings } = useSettings();
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedTask, setEditedTask] = useState({});
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Priority badge variants
  const priorityVariants = {
    High: 'danger',
    Medium: 'warning',
    Low: 'info',
  };

  // Status badge variants
  const statusVariants = {
    Pending: 'neutral',
    'In Progress': 'info',
    Completed: 'success',
    Overdue: 'danger',
  };

  // Department badge variants
  const departmentVariants = {
    ETD: 'info',
    NTD: 'warning',
  };

  // Reset edited task when modal opens or task changes
  useEffect(() => {
    if (isOpen && task) {
      setEditedTask({
        title: task.title,
        description: task.description || '',
        priority: task.priority,
        status: task.status,
        department: task.department,
        dependency: Array.isArray(task.dependency) ? task.dependency : (task.dependency ? [task.dependency] : []),
        deadline: task.deadline ? new Date(task.deadline).toISOString().split('T')[0] : '',
        delayReason: task.delayReason || '',
      });
    }
  }, [isOpen, task]);

  // Close on ESC key
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (showDeleteConfirm) {
          setShowDeleteConfirm(false);
        } else {
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, showDeleteConfirm]);

  if (!isOpen || !task) return null;

  const handleEditClick = () => {
    setIsEditMode(true);
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
    setEditedTask({
      title: task.title,
      description: task.description || '',
      priority: task.priority,
      status: task.status,
      department: task.department,
      dependency: Array.isArray(task.dependency) ? task.dependency : (task.dependency ? [task.dependency] : []),
      deadline: task.deadline ? new Date(task.deadline).toISOString().split('T')[0] : '',
      delayReason: task.delayReason || '',
    });
  };

  const handleSaveEdit = () => {
    const data = {
      ...editedTask,
      deadline: editedTask.deadline || undefined,
    };
    onEdit(task._id, data);
    setIsEditMode(false);
  };

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = () => {
    onDelete(task._id);
    setShowDeleteConfirm(false);
    onClose();
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  const handleInputChange = (field, value) => {
    setEditedTask(prev => ({ ...prev, [field]: value }));
  };

  const handleDependencyToggle = (dep) => {
    setEditedTask(prev => {
      const newDeps = prev.dependency.includes(dep)
        ? prev.dependency.filter(d => d !== dep)
        : [...prev.dependency, dep];
      return { ...prev, dependency: newDeps };
    });
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
        className="bg-white rounded-2xl border border-slate-100 shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h3 id="modal-title" className="text-lg font-bold text-slate-800 tracking-tight">
            {isEditMode ? 'Edit Task' : 'View Task'}
          </h3>
          <button
            type="button"
            onClick={() => {
              if (isEditMode) handleCancelEdit();
              else onClose();
            }}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-300"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4 overflow-y-auto">
          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
              Title
            </label>
            {isEditMode ? (
              <input
                type="text"
                value={editedTask.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-500"
              />
            ) : (
              <p className="text-sm font-bold text-slate-800">{task.title}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
              Description
            </label>
            {isEditMode ? (
              <textarea
                value={editedTask.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-500"
              />
            ) : (
              <p className="text-sm text-slate-600">{task.description || 'No description'}</p>
            )}
          </div>

          {/* Priority + Status */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                Priority
              </label>
              {isEditMode ? (
                <select
                  value={editedTask.priority}
                  onChange={(e) => handleInputChange('priority', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-500"
                >
                  {PRIORITY_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              ) : (
                <Badge variant={priorityVariants[task.priority] || 'neutral'} className="text-[10px] uppercase tracking-wider">
                  {task.priority}
                </Badge>
              )}
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                Status
              </label>
              {isEditMode ? (
                <select
                  value={editedTask.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-500"
                >
                  {STATUS_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              ) : (
                <Badge variant={statusVariants[task.status] || 'neutral'} className="text-[10px] uppercase tracking-wider">
                  {task.status}
                </Badge>
              )}
            </div>
          </div>

          {/* Department */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
              Department
            </label>
            {isEditMode ? (
              <select
                value={editedTask.department}
                onChange={(e) => handleInputChange('department', e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-500"
              >
                {DEPARTMENT_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            ) : (
              <Badge variant={departmentVariants[task.department] || 'neutral'} className="text-[10px] uppercase tracking-wider">
                {task.department || 'ETD'}
              </Badge>
            )}
          </div>

          {/* Dependency */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
              Dependencies
            </label>
            {isEditMode ? (
              <div className="flex flex-wrap gap-2">
                {['None', 'IT', 'Finance', 'IEC', 'DCD', 'MAB', 'USHR', 'GSB', 'Team Med', 'HR', 'Shura', 'Shoora Office', 'Dar ul Madina', 'Social Media', 'Construction Dept', 'FGRF', 'Supply Chain'].map(dep => (
                  <button
                    key={dep}
                    type="button"
                    onClick={() => handleDependencyToggle(dep)}
                    className={`px-2 py-1 rounded text-xs border transition-colors ${
                      editedTask.dependency.includes(dep)
                        ? 'bg-primary-500 text-white border-primary-500'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {dep}
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {Array.isArray(task.dependency) && task.dependency.length > 0 ? (
                  task.dependency.map((dep) => (
                    <Badge key={dep} variant="neutral" className="bg-slate-15 border-slate-100 text-[10px] text-slate-400 uppercase tracking-wider">
                      {dep}
                    </Badge>
                  ))
                ) : (
                  <Badge variant="neutral" className="bg-slate-15 border-slate-100 text-[10px] text-slate-400 uppercase tracking-wider">
                    None
                  </Badge>
                )}
              </div>
            )}
          </div>

          {/* Deadline */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
              Deadline
            </label>
            {isEditMode ? (
              <input
                type="date"
                value={editedTask.deadline}
                onChange={(e) => handleInputChange('deadline', e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-500"
              />
            ) : (
              <p className="text-sm text-slate-600">
                {task.deadline ? formatDate(task.deadline, settings?.dateFormat || 'YYYY-MM-DD') : 'No deadline'}
              </p>
            )}
          </div>

          {/* Delay Reason */}
          {(task.deadline || isEditMode) && (
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                Reason for Delay
              </label>
              {isEditMode ? (
                <textarea
                  value={editedTask.delayReason}
                  onChange={(e) => handleInputChange('delayReason', e.target.value)}
                  rows={3}
                  placeholder="Enter reason for delay..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-500"
                />
              ) : (
                <p className="text-sm text-slate-600">{task.delayReason || 'No delay reason provided'}</p>
              )}
            </div>
          )}

          {/* Created At */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
              Created
            </label>
            <p className="text-sm text-slate-400">
              {formatDate(task.createdAt, settings?.dateFormat || 'YYYY-MM-DD')}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          {showDeleteConfirm ? (
            <>
              <p className="text-sm text-slate-600">Are you sure you want to delete this task?</p>
              <div className="flex items-center gap-2">
                <Button variant="secondary" onClick={handleCancelDelete}>
                  Cancel
                </Button>
                <Button variant="danger" onClick={handleConfirmDelete}>
                  Delete
                </Button>
              </div>
            </>
          ) : (
            <>
              {isEditMode ? (
                <div className="flex items-center gap-2">
                  <Button variant="secondary" onClick={handleCancelEdit}>
                    Cancel
                  </Button>
                  <Button variant="primary" onClick={handleSaveEdit}>
                    Save
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Button variant="secondary" onClick={handleEditClick}>
                    <Edit2 className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                  <Button variant="danger" onClick={handleDeleteClick}>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </div>
              )}
              <Button variant="secondary" onClick={onClose}>
                Close
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ViewTaskModal;
export { ViewTaskModal };
