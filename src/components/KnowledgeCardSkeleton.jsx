/**
 * KnowledgeCardSkeleton — animated placeholder for KnowledgeCard during loading.
 */
function KnowledgeCardSkeleton() {
  return (
    <div
      className="bg-white border border-slate-100 rounded-2xl shadow-sm p-5 flex flex-col justify-between h-full gap-4"
      aria-hidden="true"
    >
      {/* Top Section: Title & Content */}
      <div className="space-y-3">
        <div className="space-y-2">
          {/* Metadata pill lines */}
          <div className="flex gap-2">
            <div className="h-4 bg-slate-100 animate-pulse rounded w-16" />
            <div className="h-4 bg-slate-100 animate-pulse rounded w-14" />
          </div>
          {/* Title line */}
          <div className="h-5 bg-slate-100 animate-pulse rounded-lg w-3/4 mt-2" />
        </div>

        {/* Content lines */}
        <div className="space-y-1.5 pt-1">
          <div className="h-3 bg-slate-100 animate-pulse rounded-lg w-full" />
          <div className="h-3 bg-slate-100 animate-pulse rounded-lg w-5/6" />
          <div className="h-3 bg-slate-100 animate-pulse rounded-lg.w-11/12" />
        </div>

        {/* Link line */}
        <div className="h-3.5 bg-slate-100 animate-pulse rounded w-1/3 pt-1" />
      </div>

      {/* Bottom Section: Tags & Actions */}
      <div className="space-y-4 pt-3 border-t border-slate-50">
        {/* Tags line */}
        <div className="flex gap-1.5">
          <div className="h-4 bg-slate-100 animate-pulse rounded w-10" />
          <div className="h-4 bg-slate-100 animate-pulse rounded w-12" />
        </div>

        {/* Action icons line */}
        <div className="flex items-center justify-end gap-1">
          <div className="w-8 h-8 bg-slate-100 animate-pulse rounded-xl" />
          <div className="w-8 h-8 bg-slate-100 animate-pulse rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export default KnowledgeCardSkeleton;
export { KnowledgeCardSkeleton };
