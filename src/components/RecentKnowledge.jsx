import { Card, Badge } from './ui';
import { BookOpen, Star, Sparkles } from 'lucide-react';
import { formatRelativeDate } from '../utils/dateFormatter.js';

const BADGE_COLORS = {
  Note:      'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700',
  Book:      'bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-405 border-amber-105 dark:border-amber-900/50',
  Article:   'bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-405 border-blue-105 dark:border-blue-900/50',
  Idea:      'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-405 border-emerald-105 dark:border-emerald-900/50',
  Learning:  'bg-violet-50 dark:bg-violet-950/30 text-violet-700 dark:text-violet-405 border-violet-105 dark:border-violet-900/50',
  Reference: 'bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-405 border-rose-105 dark:border-rose-900/50',
};

/**
 * RecentKnowledge component.
 * Displays recently added knowledge items/notes with type badges and dates.
 *
 * @param {Array} recentNotes - List of recent knowledge items.
 * @param {boolean} isLoading - Controls loading skeleton state.
 */
function RecentKnowledge({ recentNotes = [], isLoading = false }) {
  const notes = Array.isArray(recentNotes) ? recentNotes : [];
  const isEmpty = notes.length === 0;

  if (isLoading) {
    return (
      <Card title="Recent Knowledge" subtitle="Latest notes and ideas">
        <div className="space-y-4 h-[300px] flex flex-col justify-center animate-pulse">
          {Array.from({ length: 3 }).map((_, idx) => (
            <div key={idx} className="flex justify-between items-center gap-4 py-2 border-b border-slate-50 dark:border-slate-800">
              <div className="h-4 bg-slate-200 dark:bg-slate-705 rounded w-1/2" />
              <div className="flex gap-2">
                <div className="h-5 bg-slate-200 dark:bg-slate-705 rounded w-14" />
                <div className="h-4 bg-slate-200 dark:bg-slate-705 rounded w-16" />
              </div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card title="Recent Knowledge" subtitle="Your latest captured insights and ideas">
      {isEmpty ? (
        <div className="flex flex-col items-center justify-center h-[300px] text-center px-4">
          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-full mb-3 text-slate-350 dark:text-slate-500">
            <BookOpen className="w-10 h-10" aria-hidden="true" />
          </div>
          <p className="text-sm font-semibold text-slate-400 dark:text-slate-500">No knowledge items saved yet.</p>
        </div>
      ) : (
        <div className="h-[300px] overflow-y-auto space-y-1.5 pr-2 scrollbar-thin">
          {notes.map((note, index) => {
            const isLast = index === notes.length - 1;
            const badgeColor = BADGE_COLORS[note.type] || BADGE_COLORS.Note;

            return (
              <div key={note._id || index}>
                <div className="flex items-center justify-between p-3 rounded-xl bg-transparent hover:bg-slate-50 dark:hover:bg-slate-800/40 hover:translate-x-1 transition-all duration-200 ease-in-out gap-4 group">
                  
                  {/* Left: Star/Icon + Title */}
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <Sparkles className="w-4 h-4 text-slate-405 dark:text-slate-500 flex-shrink-0 group-hover:text-primary-500 transition-colors" aria-hidden="true" />
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-250 truncate group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                      {note.title}
                    </span>
                    {note.favorite && (
                      <Star className="w-3.5 h-3.5 text-rose-500 fill-current flex-shrink-0" aria-label="Starred note" />
                    )}
                  </div>

                  {/* Right: Type Badge + Relative Date */}
                  <div className="flex items-center gap-3.5 flex-shrink-0">
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border uppercase tracking-wider ${badgeColor}`}>
                      {note.type}
                    </span>
                    <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 min-w-[75px] text-right font-mono">
                      {formatRelativeDate(note.createdAt)}
                    </span>
                  </div>
                </div>

                {!isLast && (
                  <div className="mx-3 border-b border-slate-100 dark:border-slate-800" aria-hidden="true" />
                )}
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}

export default RecentKnowledge;
export { RecentKnowledge };
