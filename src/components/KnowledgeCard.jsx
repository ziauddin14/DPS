import { Pencil, Trash2, Star, Link, FileText, BookOpen, FileCheck, Lightbulb, Award, Bookmark } from 'lucide-react';
import { Badge } from './ui';

// Type color mapping to Badge variants
const TYPE_BADGE_VARIANTS = {
  Note:      'neutral',
  Book:      'warning',
  Article:   'info',
  Idea:      'success',
  Learning:  'success',
  Reference: 'neutral',
};

// Type icon mapping
const TYPE_ICONS = {
  Note:      FileText,
  Book:      BookOpen,
  Article:   Bookmark,
  Idea:      Lightbulb,
  Learning:  Award,
  Reference: FileCheck,
};

/**
 * KnowledgeCard component.
 * Displays a single knowledge entry, with type, tags, source link, favorite state, and actions.
 *
 * @param {Object}   entry      - Knowledge entry data.
 * @param {Function} onEdit     - Edit click callback.
 * @param {Function} onDelete   - Delete click callback.
 * @param {Function} onToggleFav - Favorite toggle callback.
 */
function KnowledgeCard({ entry, onEdit, onDelete, onToggleFav }) {
  const TypeIcon = TYPE_ICONS[entry.type] || FileText;
  const badgeVariant = TYPE_BADGE_VARIANTS[entry.type] || 'neutral';

  return (
    <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-5 hover:shadow-md transition-all duration-200 ease-in-out flex flex-col justify-between h-full gap-4 group">
      
      {/* Top section: Title, Type badge, and Favorite Star */}
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] font-bold text-slate-400 px-2 py-0.5 border border-slate-100 rounded bg-slate-50 uppercase tracking-wider inline-flex items-center gap-1">
                <TypeIcon className="w-3 h-3" aria-hidden="true" />
                {entry.type}
              </span>
              <Badge variant="neutral" className="bg-slate-50 border-slate-100 text-[10px] text-slate-400 uppercase tracking-wider">
                {entry.category || 'General'}
              </Badge>
            </div>
            
            <h4 className="text-base font-bold text-slate-800 tracking-tight leading-snug break-words mt-2">
              {entry.title}
            </h4>
          </div>

          {/* Favorite indicator/toggle */}
          <button
            type="button"
            onClick={() => onToggleFav && onToggleFav(entry)}
            className={`p-1.5 rounded-xl border transition-all focus:outline-none focus:ring-2 focus:ring-rose-300 ${
              entry.favorite
                ? 'bg-rose-50 border-rose-100 text-rose-500'
                : 'bg-white border-slate-100 text-slate-400 hover:text-rose-500 hover:bg-rose-50'
            }`}
            aria-label={entry.favorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Star className={`w-4 h-4 ${entry.favorite ? 'fill-current' : ''}`} aria-hidden="true" />
          </button>
        </div>

        {/* Content text */}
        <p className="text-sm font-medium text-slate-500 line-clamp-4 whitespace-pre-line leading-relaxed">
          {entry.content || 'No content provided.'}
        </p>

        {/* Source link */}
        {entry.source && (
          <div className="pt-1">
            <a
              href={entry.source}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-semibold text-primary-600 hover:text-primary-700 hover:underline focus:outline-none focus:ring-2 focus:ring-primary-300 rounded"
            >
              <Link className="w-3.5 h-3.5" aria-hidden="true" />
              <span className="truncate max-w-[200px]">{entry.source}</span>
            </a>
          </div>
        )}
      </div>

      {/* Bottom section: Tags and Action Controls */}
      <div className="space-y-4 pt-3 border-t border-slate-100">
        {/* Tags */}
        {entry.tags && entry.tags.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {entry.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-2 py-0.5 rounded bg-slate-50 border border-slate-100 text-[10px] font-bold text-slate-500"
              >
                #{tag}
              </span>
            ))}
          </div>
        ) : (
          <div className="h-4" aria-hidden="true" /> // placeholder spacer to keep height consistency
        )}

        {/* Actions Row */}
        <div className="flex items-center justify-end gap-2 pt-1">
          <button
            type="button"
            onClick={() => onEdit && onEdit(entry)}
            className="p-2 rounded-xl text-slate-500 hover:text-primary-600 hover:bg-primary-50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-300"
            aria-label="Edit knowledge entry"
          >
            <Pencil className="w-4 h-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => onDelete && onDelete(entry)}
            className="p-2 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors focus:outline-none focus:ring-2 focus:ring-rose-300"
            aria-label="Delete knowledge entry"
          >
            <Trash2 className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default KnowledgeCard;
export { KnowledgeCard };
