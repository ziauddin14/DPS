import { useEffect } from 'react';
import { X } from 'lucide-react';
import { Input, Textarea, Select, Button } from './ui';

const TYPE_OPTIONS = [
  { value: 'Life', label: 'Life' },
  { value: '5 Years', label: '5 Years' },
  { value: '1 Year', label: '1 Year' },
  { value: '90 Days', label: '90 Days' },
  { value: 'Monthly', label: 'Monthly' },
  { value: 'Weekly', label: 'Weekly' },
  { value: 'Daily', label: 'Daily' },
];

const PRIORITY_OPTIONS = [
  { value: 'High', label: 'High' },
  { value: 'Medium', label: 'Medium' },
  { value: 'Low', label: 'Low' },
];

const STATUS_OPTIONS = [
  { value: 'Not Started', label: 'Not Started' },
  { value: 'In Progress', label: 'In Progress' },
  { value: 'Completed', label: 'Completed' },
  { value: 'On Hold', label: 'On Hold' },
];

/**
 * GoalModal — reusable modal for adding or editing a goal.
 */
function GoalModal({ isOpen, onClose, mode = 'add', goal, onSave }) {
  // Close on ESC key
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const isEdit = mode === 'edit';
  const modalTitle = isEdit ? 'Edit Goal' : 'Add Goal';

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      title: formData.get('title'),
      description: formData.get('description'),
      type: formData.get('type'),
      priority: formData.get('priority'),
      status: formData.get('status'),
      progress: Number(formData.get('progress')),
      category: formData.get('category'),
      startDate: formData.get('startDate') || undefined,
      targetDate: formData.get('targetDate') || undefined,
      notes: formData.get('notes'),
    };
    if (onSave) onSave(data);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toISOString().split('T')[0];
  };

  return (
    <div
      className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="goal-modal-title"
    >
      {/* Modal container */}
      <div
        className="bg-white rounded-2xl border border-slate-100 shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h3 id="goal-modal-title" className="text-lg font-bold text-slate-800 tracking-tight">
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
              id="goal-title"
              name="title"
              required
              placeholder="Enter goal title"
              defaultValue={goal?.title ?? ''}
            />

            {/* Description */}
            <Textarea
              label="Description"
              id="goal-desc"
              name="description"
              placeholder="Enter goal description"
              rows={3}
              defaultValue={goal?.description ?? ''}
            />

            {/* Type + Priority */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="Type"
                id="goal-type"
                name="type"
                required
                options={TYPE_OPTIONS}
                defaultValue={goal?.type ?? 'Life'}
              />
              <Select
                label="Priority"
                id="goal-priority"
                name="priority"
                options={PRIORITY_OPTIONS}
                defaultValue={goal?.priority ?? 'Medium'}
              />
            </div>

            {/* Status + Progress */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="Status"
                id="goal-status"
                name="status"
                options={STATUS_OPTIONS}
                defaultValue={goal?.status ?? 'Not Started'}
              />
              <Input
                label="Progress (%)"
                id="goal-progress"
                name="progress"
                type="number"
                min={0}
                max={100}
                placeholder="0-100"
                defaultValue={goal?.progress ?? 0}
              />
            </div>

            {/* Category + Start Date */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Category"
                id="goal-category"
                name="category"
                placeholder="e.g. Health"
                defaultValue={goal?.category ?? 'General'}
              />
              <Input
                label="Start Date"
                id="goal-start-date"
                name="startDate"
                type="date"
                defaultValue={formatDate(goal?.startDate)}
              />
            </div>

            {/* Target Date + Notes */}
            <div className="grid grid-cols-1 gap-4">
              <Input
                label="Target Date"
                id="goal-target-date"
                name="targetDate"
                type="date"
                defaultValue={formatDate(goal?.targetDate)}
              />
              <Textarea
                label="Notes"
                id="goal-notes"
                name="notes"
                placeholder="Additional notes for your goal..."
                rows={2}
                defaultValue={goal?.notes ?? ''}
              />
            </div>
          </div>

          {/* Footer actions */}
          <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-3">
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Save Goal
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default GoalModal;
export { GoalModal };
