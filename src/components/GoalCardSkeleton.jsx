/**
 * GoalCardSkeleton — animated placeholder for a GoalCard during loading.
 *
 * Mimics the exact layout of GoalCard (header, description, progress bar, badges, actions)
 * using shimmer pulse animation so the user perceives immediate content.
 */
function GoalCardSkeleton() {
  return (
    <div
      className="bg-white border border-slate-100 rounded-2xl shadow-sm p-5 flex flex-col justify-between h-full gap-4"
      aria-hidden="true"
    >
      {/* Top: title + category */}
      <div className="space-y-3">
        <div className="space-y-2 min-w-0">
          {/* Title line */}
          <div className="h-4 bg-slate-100 animate-pulse rounded-lg w-3/4" />
          {/* Category + Type badges */}
          <div className="flex items-center gap-1.5">
            <div className="h-3.5 w-12 bg-slate-100 animate-pulse rounded-md" />
            <div className="h-3.5 w-10 bg-slate-100 animate-pulse rounded-md" />
          </div>
        </div>

        {/* Description lines */}
        <div className="space-y-1.5 pt-1">
          <div className="h-3 bg-slate-100 animate-pulse rounded-lg w-full" />
          <div className="h-3 bg-slate-100 animate-pulse rounded-lg w-5/6" />
          <div className="h-3 bg-slate-100 animate-pulse rounded-lg w-2/3" />
        </div>
      </div>

      {/* Middle: progress bar */}
      <div className="space-y-2 pt-1">
        <div className="flex justify-between items-center">
          <div className="h-3 bg-slate-100 animate-pulse rounded-lg w-1/4" />
          <div className="h-3 bg-slate-100 animate-pulse rounded-lg w-8" />
        </div>
        <div className="h-2 bg-slate-100 animate-pulse rounded-full w-full" />
      </div>

      {/* Bottom: badges + action buttons */}
      <div className="space-y-4 pt-3 border-t border-slate-50">
        <div className="flex flex-wrap items-center justify-between gap-2">
          {/* Priority + Status badges */}
          <div className="flex items-center gap-1.5">
            <div className="h-5 w-12 bg-slate-100 animate-pulse rounded-full" />
            <div className="h-5 w-16 bg-slate-100 animate-pulse rounded-full" />
          </div>
          {/* Target Date */}
          <div className="h-3.5 w-20 bg-slate-100 animate-pulse rounded-lg" />
        </div>

        {/* Edit + Delete button placeholders */}
        <div className="flex items-center justify-end gap-2">
          <div className="w-8 h-8 bg-slate-100 animate-pulse rounded-xl" />
          <div className="w-8 h-8 bg-slate-100 animate-pulse rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export default GoalCardSkeleton;
export { GoalCardSkeleton };
