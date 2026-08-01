import { useState } from 'react';
import { X } from 'lucide-react';
import { Textarea, Button } from './ui';

/**
 * AddNoteModal — modal for adding a note to a follow-up
 */
function AddNoteModal({ isOpen, onClose, followup, onSave }) {
  const [note, setNote] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!note.trim()) return;
    
    const newNote = {
      message: note.trim(),
      createdAt: new Date().toISOString(),
      createdBy: undefined,
    };

    onSave(followup._id, newNote);
    setNote('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-700">
          <h2 id="modal-title" className="text-lg font-bold text-slate-800 dark:text-slate-100">
            Add Note
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
          <div className="text-sm text-slate-600 dark:text-slate-300 mb-2">
            Adding note for: <span className="font-semibold">{followup?.personName}</span>
          </div>

          <Textarea
            label="Note"
            id="note-message"
            placeholder="Enter your note..."
            rows={4}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            required
          />

          {/* Footer actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-700">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Save Note
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddNoteModal;
export { AddNoteModal };
