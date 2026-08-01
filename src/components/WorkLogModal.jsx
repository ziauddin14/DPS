import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { Input, Textarea, Select, Button } from './ui';
import SearchableSelect from './SearchableSelect';
import taskService from '../services/taskService';
import followupService from '../services/followupService';
import { DEPENDENCY_OPTIONS } from '../constants/dependencyOptions';

const CATEGORY_OPTIONS = [
  { value: 'Email', label: 'Email' },
  { value: 'WhatsApp', label: 'WhatsApp' },
  { value: 'Phone Call', label: 'Phone Call' },
  { value: 'Meeting', label: 'Meeting' },
  { value: 'Documentation', label: 'Documentation' },
  { value: 'Research', label: 'Research' },
  { value: 'Development', label: 'Development' },
  { value: 'Testing', label: 'Testing' },
  { value: 'Planning', label: 'Planning' },
  { value: 'Learning', label: 'Learning' },
  { value: 'Office Work', label: 'Office Work' },
  { value: 'Deployment', label: 'Deployment' },
  { value: 'Bug Fix', label: 'Bug Fix' },
  { value: 'Support', label: 'Support' },
  { value: 'Other', label: 'Other' },
];


/**
 * WorkLogModal — reusable modal for adding or editing a work log
 */
function WorkLogModal({ isOpen, onClose, mode = 'add', workLog, onSave }) {
  const [category, setCategory] = useState(workLog?.category || 'Other');
  const [relatedTask, setRelatedTask] = useState(workLog?.relatedTask?._id || '');
  const [relatedFollowup, setRelatedFollowup] = useState(workLog?.relatedFollowup?._id || '');
  const [department, setDepartment] = useState(workLog?.department || '');
  const [startTime, setStartTime] = useState(workLog?.startTime || '');
  const [endTime, setEndTime] = useState(workLog?.endTime || '');
  const [durationMinutes, setDurationMinutes] = useState(workLog?.durationMinutes || '');

  // Related data state
  const [tasks, setTasks] = useState([]);
  const [followups, setFollowups] = useState([]);
  const [isLoadingRelated, setIsLoadingRelated] = useState(false);

  // Fetch tasks and followups when modal opens
  useEffect(() => {
    if (isOpen) {
      const fetchRelatedData = async () => {
        setIsLoadingRelated(true);
        try {
          const [tasksRes, followupsRes] = await Promise.all([
            taskService.getAllTasks(),
            followupService.getAllFollowUps(),
          ]);
          
          // Map tasks response: { success: true, data: { tasks: [...] } }
          if (tasksRes.success && tasksRes.data?.tasks) {
            setTasks(tasksRes.data.tasks);
          }
          
          // Map followups response: { success: true, data: { followups: [...], departments: [] } }
          if (
            followupsRes.success &&
            Array.isArray(followupsRes.data?.followups)
          ) {
            setFollowups(followupsRes.data.followups);
          } else {
            setFollowups([]);
          }
        } catch (error) {
          console.error('Failed to fetch related data:', error);
        } finally {
          setIsLoadingRelated(false);
        }
      };

      fetchRelatedData();
    }
  }, [isOpen]);

  // Calculate duration when start/end time changes
  useEffect(() => {
    if (startTime && endTime) {
      const start = new Date(`2000-01-01 ${startTime}`);
      const end = new Date(`2000-01-01 ${endTime}`);
      const diffMs = end - start;
      const calculatedDuration = Math.floor(diffMs / 60000);
      if (calculatedDuration > 0) {
        setDurationMinutes(calculatedDuration);
      }
    }
  }, [startTime, endTime]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      title: formData.get('title'),
      category,
      description: formData.get('description') || undefined,
      activityDate: formData.get('activityDate') || undefined,
      startTime: startTime || undefined,
      endTime: endTime || undefined,
      durationMinutes: durationMinutes || undefined,
      relatedTask: relatedTask || undefined,
      relatedFollowup: relatedFollowup || undefined,
      department: department || undefined,
    };
    if (onSave) onSave(data);
  };

  // Reset state when modal opens or workLog changes
  useEffect(() => {
    if (isOpen) {
      setCategory(workLog?.category || 'Other');
      setRelatedTask(workLog?.relatedTask?._id || '');
      setRelatedFollowup(workLog?.relatedFollowup?._id || '');
      setDepartment(workLog?.department || '');
      setStartTime(workLog?.startTime || '');
      setEndTime(workLog?.endTime || '');
      setDurationMinutes(workLog?.durationMinutes || '');
    }
  }, [isOpen, workLog]);

  if (!isOpen) return null;

  const isEdit = mode === 'edit';
  const modalTitle = isEdit ? 'Edit Work Log' : 'Add Work Log';

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
          {/* Title */}
          <Input
            label="Title *"
            id="worklog-title"
            name="title"
            required
            placeholder="Enter work activity title"
            defaultValue={workLog?.title ?? ''}
          />

          {/* Category + Department */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <SearchableSelect
              label="Category"
              id="worklog-category"
              name="category"
              options={CATEGORY_OPTIONS}
              value={category}
              onChange={setCategory}
              placeholder="Select category"
            />
            <SearchableSelect
              label="Department"
              id="worklog-department"
              name="department"
              options={[
                { value: '', label: 'No department' },
                ...DEPENDENCY_OPTIONS,
              ]}
              value={department}
              onChange={setDepartment}
              placeholder="No department"
            />
          </div>

          {/* Description */}
          <Textarea
            label="Description"
            id="worklog-description"
            name="description"
            placeholder="Enter description"
            rows={3}
            defaultValue={workLog?.description ?? ''}
          />

          {/* Activity Date */}
          <Input
            type="date"
            label="Activity Date *"
            id="worklog-activityDate"
            name="activityDate"
            required
            defaultValue={
              workLog?.activityDate
                ? new Date(workLog.activityDate).toISOString().split('T')[0]
                : new Date().toISOString().split('T')[0]
            }
          />

          {/* Start Time + End Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              type="time"
              label="Start Time"
              id="worklog-startTime"
              name="startTime"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
            <Input
              type="time"
              label="End Time"
              id="worklog-endTime"
              name="endTime"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            />
          </div>

          {/* Duration */}
          <Input
            type="number"
            label="Duration (minutes)"
            id="worklog-durationMinutes"
            name="durationMinutes"
            placeholder="Auto-calculated from start/end time"
            value={durationMinutes}
            onChange={(e) => setDurationMinutes(e.target.value ? parseInt(e.target.value) : '')}
            min="0"
          />

          {/* Related Task + Related Follow-up */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <SearchableSelect
              label="Related Task (Optional)"
              id="worklog-relatedTask"
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
            <SearchableSelect
              label="Related Follow-up (Optional)"
              id="worklog-relatedFollowup"
              name="relatedFollowup"
              options={[
                { value: '', label: 'No related follow-up' },
                ...(followups || []).map((followup) => ({
                  value: followup._id,
                  label: `${followup.personName} - ${followup.subject}`,
                })),
              ]}
              value={relatedFollowup}
              onChange={setRelatedFollowup}
              placeholder="No related follow-up"
            />
          </div>

          {/* Footer actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-700">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Save Work Log
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default WorkLogModal;
export { WorkLogModal };
