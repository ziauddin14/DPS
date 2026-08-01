import { useEffect } from 'react';
import { X } from 'lucide-react';
import { Input, Textarea, Select, Button } from './ui';

const PRIORITY_OPTIONS = [
  { value: 'High', label: 'High' },
  { value: 'Medium', label: 'Medium' },
  { value: 'Low', label: 'Low' },
];

const STATUS_OPTIONS = [
  { value: 'Planning', label: 'Planning' },
  { value: 'In Progress', label: 'In Progress' },
  { value: 'Completed', label: 'Completed' },
  { value: 'On Hold', label: 'On Hold' },
];

const COLOR_OPTIONS = [
  { value: 'Blue', label: 'Blue' },
  { value: 'Green', label: 'Green' },
  { value: 'Red', label: 'Red' },
  { value: 'Purple', label: 'Purple' },
  { value: 'Orange', label: 'Orange' },
  { value: 'Yellow', label: 'Yellow' },
  { value: 'Indigo', label: 'Indigo' },
  { value: 'Slate', label: 'Slate' },
];

/**
 * ProjectModal — reusable dialog for adding or editing a project.
 */
function ProjectModal({ isOpen, onClose, mode = 'add', project, onSave, isSaving = false }) {
  // Close on ESC keypress
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
  const modalTitle = isEdit ? 'Edit Project' : 'Add Project';

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    // Convert comma-separated string back to array of trimmed values
    const technologiesInput = formData.get('technologies') ?? '';
    const technologies = technologiesInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const data = {
      title: formData.get('title'),
      description: formData.get('description'),
      status: formData.get('status'),
      priority: formData.get('priority'),
      category: formData.get('category'),
      startDate: formData.get('startDate') || undefined,
      deadline: formData.get('deadline') || undefined,
      progress: Number(formData.get('progress')),
      client: formData.get('client'),
      technologies,
      notes: formData.get('notes'),
      color: formData.get('color'),
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
      aria-labelledby="project-modal-title"
    >
      {/* Modal container */}
      <div
        className="bg-white rounded-2xl border border-slate-100 shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h3 id="project-modal-title" className="text-lg font-bold text-slate-800 tracking-tight">
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
              id="project-title"
              name="title"
              required
              placeholder="Enter project title"
              defaultValue={project?.title ?? ''}
            />

            {/* Description */}
            <Textarea
              label="Description"
              id="project-desc"
              name="description"
              placeholder="Enter project description"
              rows={3}
              defaultValue={project?.description ?? ''}
            />

            {/* Status + Priority */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="Status"
                id="project-status"
                name="status"
                options={STATUS_OPTIONS}
                defaultValue={project?.status ?? 'Planning'}
              />
              <Select
                label="Priority"
                id="project-priority"
                name="priority"
                options={PRIORITY_OPTIONS}
                defaultValue={project?.priority ?? 'Medium'}
              />
            </div>

            {/* Category + Progress */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Category"
                id="project-category"
                name="category"
                placeholder="e.g. Work, Personal"
                defaultValue={project?.category ?? 'General'}
              />
              <Input
                label="Progress (%)"
                id="project-progress"
                name="progress"
                type="number"
                min={0}
                max={100}
                placeholder="0-100"
                defaultValue={project?.progress ?? 0}
              />
            </div>

            {/* Start Date + Deadline */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Start Date"
                id="project-start-date"
                name="startDate"
                type="date"
                defaultValue={formatDate(project?.startDate)}
              />
              <Input
                label="Deadline"
                id="project-deadline"
                name="deadline"
                type="date"
                defaultValue={formatDate(project?.deadline)}
              />
            </div>

            {/* Client */}
            <Input
              label="Client"
              id="project-client"
              name="client"
              placeholder="e.g. Acme Corp"
              defaultValue={project?.client ?? ''}
            />

            {/* Technologies (Comma-separated) */}
            <Input
              label="Technologies"
              id="project-technologies"
              name="technologies"
              placeholder="e.g. React, Node.js, MongoDB (comma separated)"
              defaultValue={project?.technologies?.join(', ') ?? ''}
            />

            {/* Color selection + Notes */}
            <div className="grid grid-cols-1 gap-4">
              <Select
                label="Theme Color"
                id="project-color"
                name="color"
                options={COLOR_OPTIONS}
                defaultValue={project?.color ?? 'Blue'}
              />
              <Textarea
                label="Notes"
                id="project-notes"
                name="notes"
                placeholder="Additional notes or links..."
                rows={2}
                defaultValue={project?.notes ?? ''}
              />
            </div>
          </div>

          {/* Footer actions */}
          <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-3">
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={isSaving}>
              {isSaving ? 'Saving…' : 'Save Project'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProjectModal;
export { ProjectModal };
