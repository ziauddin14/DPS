import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { Input, Textarea, Button } from './ui';
import SearchableSelect from './SearchableSelect';
import { DEPENDENCY_OPTIONS } from '../constants/dependencyOptions';
import { projectService } from '../services/projectService';

const PRIORITY_OPTIONS = [
  { value: 'High', label: 'High' },
  { value: 'Medium', label: 'Medium' },
  { value: 'Low', label: 'Low' },
];

const STATUS_OPTIONS = [
  { value: 'Pending', label: 'Pending' },
  { value: 'Contacted', label: 'Contacted' },
  { value: 'Waiting Reply', label: 'Waiting Reply' },
  { value: 'Completed', label: 'Completed' },
  { value: 'Cancelled', label: 'Cancelled' },
];

// Helper to safely extract ObjectId string whether ref is populated object or string ID
const getRefId = (ref) => (ref && typeof ref === 'object' ? ref._id : ref) || '';

/**
 * FollowUpModal — reusable modal for adding or editing a follow-up
 */
function FollowUpModal({ isOpen, onClose, mode = 'add', followup, onSave, tasks, projects }) {
  const [relatedTask, setRelatedTask] = useState(() => getRefId(followup?.relatedTask));
  const [relatedProject, setRelatedProject] = useState(() => getRefId(followup?.relatedProject));
  const [priority, setPriority] = useState(followup?.priority || 'Medium');
  const [status, setStatus] = useState(followup?.status || 'Pending');
  const [department, setDepartment] = useState(followup?.department || '');
  const [internalProjects, setInternalProjects] = useState([]);

  // Fetch projects internally if not passed via props
  useEffect(() => {
    if (isOpen && (!projects || projects.length === 0)) {
      projectService
        .getAllProjects()
        .then((res) => setInternalProjects(res.data?.projects || []))
        .catch((err) => console.error('Failed to load projects in modal:', err));
    }
  }, [isOpen, projects]);

  const projectList = projects && projects.length > 0 ? projects : internalProjects;

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      personName: formData.get('personName'),
      company: formData.get('company') || undefined,
      phoneNumber: formData.get('phoneNumber') || undefined,
      subject: formData.get('subject'),
      description: formData.get('description') || undefined,
      relatedTask: relatedTask || undefined,
      relatedProject: relatedProject || undefined,
      priority,
      status,
      nextFollowupDate: formData.get('nextFollowupDate') || undefined,
      lastContactDate: formData.get('lastContactDate') || undefined,
      department: department || undefined,
    };
    if (onSave) onSave(data);
  };

  // Reset state when modal opens or followup changes
  useEffect(() => {
    if (isOpen) {
      setRelatedTask(getRefId(followup?.relatedTask));
      setRelatedProject(getRefId(followup?.relatedProject));
      setPriority(followup?.priority || 'Medium');
      setStatus(followup?.status || 'Pending');
      setDepartment(followup?.department || '');
    }
  }, [isOpen, followup]);

  if (!isOpen) return null;

  const isEdit = mode === 'edit';
  const modalTitle = isEdit ? 'Edit Follow-up' : 'Add Follow-up';

  return (
    <div
      className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-700">
          <h2 id="modal-title" className="text-xl font-bold text-slate-800 dark:text-slate-100">
            {modalTitle}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Person Name */}
          <Input
            label="Person Name *"
            id="followup-personName"
            name="personName"
            required
            placeholder="Enter person name"
            defaultValue={followup?.personName ?? ''}
          />

          {/* Company + Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Company"
              id="followup-company"
              name="company"
              placeholder="Enter company"
              defaultValue={followup?.company ?? ''}
            />
            <Input
              label="Phone Number"
              id="followup-phoneNumber"
              name="phoneNumber"
              placeholder="Enter phone number"
              defaultValue={followup?.phoneNumber ?? ''}
            />
          </div>

          {/* Subject */}
          <Input
            label="Subject *"
            id="followup-subject"
            name="subject"
            required
            placeholder="Enter subject"
            defaultValue={followup?.subject ?? ''}
          />

          {/* Description */}
          <Textarea
            label="Description"
            id="followup-description"
            name="description"
            placeholder="Enter description"
            rows={3}
            defaultValue={followup?.description ?? ''}
          />

          {/* Related Task */}
          <SearchableSelect
            label="Related Task (Optional)"
            id="followup-relatedTask"
            name="relatedTask"
            options={[
              { value: '', label: 'No related task' },
              ...(tasks || []).map((task) => ({
                value: task._id,
                label: task.title,
              })),
            ]}
            value={relatedTask}
            onChange={setRelatedTask}
            placeholder="No related task"
          />

          {/* Related Project */}
          <SearchableSelect
            label="Related Project (Optional)"
            id="followup-relatedProject"
            name="relatedProject"
            options={[
              { value: '', label: 'No related project' },
              ...(projectList || []).map((project) => ({
                value: project._id,
                label: project.title,
              })),
            ]}
            value={relatedProject}
            onChange={setRelatedProject}
            placeholder="No related project"
          />

          {/* Priority + Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <SearchableSelect
              label="Priority"
              id="followup-priority"
              name="priority"
              options={PRIORITY_OPTIONS}
              value={priority}
              onChange={setPriority}
              placeholder="Select priority"
            />
            <SearchableSelect
              label="Status"
              id="followup-status"
              name="status"
              options={STATUS_OPTIONS}
              value={status}
              onChange={setStatus}
              placeholder="Select status"
            />
          </div>

          {/* Next Follow-up Date + Last Contact Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              type="date"
              label="Next Follow-up Date *"
              id="followup-nextFollowupDate"
              name="nextFollowupDate"
              required
              defaultValue={
                followup?.nextFollowupDate
                  ? new Date(followup.nextFollowupDate).toISOString().split('T')[0]
                  : ''
              }
            />
            <Input
              type="date"
              label="Last Contact Date"
              id="followup-lastContactDate"
              name="lastContactDate"
              defaultValue={
                followup?.lastContactDate
                  ? new Date(followup.lastContactDate).toISOString().split('T')[0]
                  : ''
              }
            />
          </div>

          {/* Department */}
          <SearchableSelect
            label="Department"
            id="followup-department"
            name="department"
            options={[
              { value: '', label: 'No department' },
              ...DEPENDENCY_OPTIONS,
            ]}
            value={department}
            onChange={setDepartment}
            placeholder="No department"
          />

          {/* Footer actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-700">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Save Follow-up
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default FollowUpModal;
export { FollowUpModal };
