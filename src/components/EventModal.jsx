import { useEffect } from 'react';
import { X } from 'lucide-react';
import { Input, Textarea, Select, Button } from './ui';

const TYPE_OPTIONS = [
  { value: 'Meeting',  label: 'Meeting' },
  { value: 'Event',    label: 'Event' },
  { value: 'Birthday', label: 'Birthday' },
  { value: 'Reminder', label: 'Reminder' },
];

const COLOR_OPTIONS = [
  { value: 'Blue',   label: 'Blue' },
  { value: 'Green',  label: 'Green' },
  { value: 'Red',    label: 'Red' },
  { value: 'Purple', label: 'Purple' },
  { value: 'Orange', label: 'Orange' },
  { value: 'Pink',   label: 'Pink' },
  { value: 'Yellow', label: 'Yellow' },
];

/**
 * EventModal — reusable modal for adding or editing a calendar event.
 */
function EventModal({ isOpen, onClose, mode = 'add', event, onSave }) {
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
  const modalTitle = isEdit ? 'Edit Event' : 'Add Event';

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const data = {
      title:        formData.get('title'),
      description:  formData.get('description'),
      type:         formData.get('type'),
      startDate:    formData.get('startDate') || undefined,
      endDate:      formData.get('endDate')   || undefined,
      time:         formData.get('time')      || undefined,
      location:     formData.get('location'),
      reminder:     formData.get('reminder') === 'on',
      reminderTime: formData.get('reminderTime') || undefined,
      notes:        formData.get('notes'),
      color:        formData.get('color'),
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
      aria-labelledby="event-modal-title"
    >
      {/* Modal container */}
      <div
        className="bg-white rounded-2xl border border-slate-100 shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h3 id="event-modal-title" className="text-lg font-bold text-slate-800 tracking-tight">
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
              id="event-title"
              name="title"
              required
              placeholder="Enter event title"
              defaultValue={event?.title ?? ''}
            />

            {/* Description */}
            <Textarea
              label="Description"
              id="event-desc"
              name="description"
              placeholder="Enter event description"
              rows={2}
              defaultValue={event?.description ?? ''}
            />

            {/* Type + Color */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="Type"
                id="event-type"
                name="type"
                required
                options={TYPE_OPTIONS}
                defaultValue={event?.type ?? 'Meeting'}
              />
              <Select
                label="Color"
                id="event-color"
                name="color"
                options={COLOR_OPTIONS}
                defaultValue={event?.color ?? 'Blue'}
              />
            </div>

            {/* Start Date + End Date */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Start Date"
                id="event-start-date"
                name="startDate"
                type="date"
                required
                defaultValue={formatDate(event?.startDate)}
              />
              <Input
                label="End Date"
                id="event-end-date"
                name="endDate"
                type="date"
                defaultValue={formatDate(event?.endDate)}
              />
            </div>

            {/* Time + Location */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Time"
                id="event-time"
                name="time"
                type="time"
                defaultValue={event?.time ?? ''}
              />
              <Input
                label="Location"
                id="event-location"
                name="location"
                placeholder="e.g. Conference Room A"
                defaultValue={event?.location ?? ''}
              />
            </div>

            {/* Reminder toggle + Reminder Time */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
              {/* Reminder checkbox */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="event-reminder"
                  className="text-sm font-semibold text-slate-700"
                >
                  Reminder
                </label>
                <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                  <input
                    id="event-reminder"
                    name="reminder"
                    type="checkbox"
                    defaultChecked={event?.reminder ?? false}
                    className="w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-400 focus:ring-offset-0"
                  />
                  <span className="text-sm text-slate-600">Enable reminder</span>
                </label>
              </div>

              <Input
                label="Reminder Time"
                id="event-reminder-time"
                name="reminderTime"
                placeholder="e.g. 30 minutes before"
                defaultValue={event?.reminderTime ?? ''}
              />
            </div>

            {/* Notes */}
            <Textarea
              label="Notes"
              id="event-notes"
              name="notes"
              placeholder="Additional notes..."
              rows={2}
              defaultValue={event?.notes ?? ''}
            />
          </div>

          {/* Footer actions */}
          <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-3">
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Save Event
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EventModal;
export { EventModal };
