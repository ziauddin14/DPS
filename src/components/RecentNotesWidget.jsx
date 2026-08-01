import { FileText, Star } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { formatDate, formatRelativeDate } from '../utils/dateFormatter';

const BADGE_COLORS = {
  Note:      'bg-slate-50 text-slate-700 border-slate-200',
  Book:      'bg-amber-50 text-amber-700 border-amber-100',
  Article:   'bg-blue-50 text-blue-700 border-blue-100',
  Idea:      'bg-emerald-50 text-emerald-700 border-emerald-100',
  Learning:  'bg-emerald-50 text-emerald-700 border-emerald-100',
  Reference: 'bg-slate-50 text-slate-700 border-slate-200',
};

/**
 * RecentNotesWidget component.
 * Displays recently saved user notes from the live Knowledge API.
 * Supports skeleton loading states.
 */
function RecentNotesWidget({ notes = [], isLoading = false }) {
  if (isLoading) {
    return (
      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6 sm:p-8">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-5">
          <div className="w-9 h-9 bg-slate-100 rounded-xl animate-pulse" />
          <div className="space-y-1.5 flex-1">
            <div className="h-4 bg-slate-100 rounded animate-pulse w-32" />
            <div className="h-3 bg-slate-100 rounded animate-pulse w-48" />
          </div>
        </div>
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, idx) => (
            <div key={idx} className="flex justify-between items-center gap-4 py-2">
              <div className="h-4 bg-slate-100 rounded animate-pulse w-1/3" />
              <div className="h-4 bg-slate-100 rounded animate-pulse w-16" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6 sm:p-8 hover:shadow-md transition-shadow duration-200">
      
      {/* Header section */}
      <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-5">
        <div className="p-2 bg-primary-50 rounded-xl text-primary-600">
          <FileText className="w-5 h-5" aria-hidden="true" />
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-800 tracking-tight">
            Recent Notes
          </h3>
          <p className="text-xs font-semibold text-slate-400 mt-0.5">
            Your latest saved notes
          </p>
        </div>
      </div>

      {/* Notes List */}
      {notes.length === 0 ? (
        <div className="py-6 text-center">
          <p className="text-sm font-semibold text-slate-400">No notes saved yet.</p>
        </div>
      ) : (
        <div className="space-y-1">
          {notes.map((note, index) => {
            const isLast = index === notes.length - 1;
            const badgeColor = BADGE_COLORS[note.type] || BADGE_COLORS.Note;

            return (
              <div key={note._id}>
                <div className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 hover:translate-x-1 transition-all duration-200 ease-in-out gap-4 group">
                  {/* Left: Icon + Title + Favorite indicator */}
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <FileText className="w-4 h-4 text-slate-400 flex-shrink-0 group-hover:text-slate-600 transition-colors" aria-hidden="true" />
                    <span className="text-sm font-semibold text-slate-700 truncate group-hover:text-slate-900 transition-colors">
                      {note.title}
                    </span>
                    {note.favorite && (
                      <Star className="w-3.5 h-3.5 text-rose-500 fill-current flex-shrink-0" aria-label="Starred note" />
                    )}
                  </div>

                  {/* Right: Badge + Date */}
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border uppercase tracking-wider ${badgeColor}`}>
                      {note.type}
                    </span>
                    <span className="text-xs font-medium text-slate-400 min-w-[70px] text-right">
                      {formatRelativeDate(note.createdAt)}
                    </span>
                  </div>
                </div>

                {!isLast && (
                  <div className="mx-3 border-b border-slate-100" aria-hidden="true" />
                )}
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}

export default RecentNotesWidget;
export { RecentNotesWidget };
