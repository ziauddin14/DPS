import { useEffect } from 'react';
import { X } from 'lucide-react';
import { Input, Textarea, Select, Button } from './ui';

const TYPE_OPTIONS = [
  { value: 'Note',      label: 'Note' },
  { value: 'Book',      label: 'Book' },
  { value: 'Article',   label: 'Article' },
  { value: 'Idea',      label: 'Idea' },
  { value: 'Learning',  label: 'Learning' },
  { value: 'Reference', label: 'Reference' },
];

const COLOR_OPTIONS = [
  { value: 'Blue',   label: 'Blue' },
  { value: 'Green',  label: 'Green' },
  { value: 'Red',    label: 'Red' },
  { value: 'Purple', label: 'Purple' },
  { value: 'Orange', label: 'Orange' },
  { value: 'Yellow', label: 'Yellow' },
  { value: 'Indigo', label: 'Indigo' },
  { value: 'Slate',  label: 'Slate' },
];

/**
 * KnowledgeModal — reusable dialog for adding or editing a knowledge entry.
 */
function KnowledgeModal({ isOpen, onClose, mode = 'add', entry, onSave, isSaving = false }) {
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
  const modalTitle = isEdit ? 'Edit Knowledge Entry' : 'Add Knowledge Entry';

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    // Convert comma-separated tags to trimmed array
    const tagsInput = formData.get('tags') ?? '';
    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const data = {
      title:    formData.get('title'),
      content:  formData.get('content'),
      type:     formData.get('type'),
      category: formData.get('category'),
      tags,
      source:   formData.get('source'),
      favorite: formData.get('favorite') === 'true',
      color:    formData.get('color'),
    };

    if (onSave) onSave(data);
  };

  return (
    <div
      className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="knowledge-modal-title"
    >
      {/* Modal container */}
      <div
        className="bg-white rounded-2xl border border-slate-100 shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h3 id="knowledge-modal-title" className="text-lg font-bold text-slate-800 tracking-tight">
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
              id="knowledge-title"
              name="title"
              required
              placeholder="Enter entry title"
              defaultValue={entry?.title ?? ''}
            />

            {/* Content */}
            <Textarea
              label="Content"
              id="knowledge-content"
              name="content"
              placeholder="Write your note, idea details, or bookmarks description here..."
              rows={4}
              defaultValue={entry?.content ?? ''}
            />

            {/* Type + Category */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="Type"
                id="knowledge-type"
                name="type"
                options={TYPE_OPTIONS}
                defaultValue={entry?.type ?? 'Note'}
              />
              <Input
                label="Category"
                id="knowledge-category"
                name="category"
                placeholder="e.g. Technology, Recipes"
                defaultValue={entry?.category ?? 'General'}
              />
            </div>

            {/* Tags + Source */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Tags"
                id="knowledge-tags"
                name="tags"
                placeholder="e.g. javascript, tutorial (comma separated)"
                defaultValue={entry?.tags?.join(', ') ?? ''}
              />
              <Input
                label="Source URL"
                id="knowledge-source"
                name="source"
                placeholder="e.g. https://example.com"
                defaultValue={entry?.source ?? ''}
              />
            </div>

            {/* Starred + Color */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="Starred (Favorite)"
                id="knowledge-favorite"
                name="favorite"
                options={[
                  { value: 'false', label: 'No' },
                  { value: 'true',  label: 'Yes' },
                ]}
                defaultValue={entry?.favorite ? 'true' : 'false'}
              />
              <Select
                label="Theme Color"
                id="knowledge-color"
                name="color"
                options={COLOR_OPTIONS}
                defaultValue={entry?.color ?? 'Blue'}
              />
            </div>
          </div>

          {/* Footer actions */}
          <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-3">
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={isSaving}>
              {isSaving ? 'Saving…' : 'Save Entry'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default KnowledgeModal;
export { KnowledgeModal };
