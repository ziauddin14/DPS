/**
 * ProjectCardSkeleton — animated placeholder for ProjectCard during loading.
 */
function ProjectCardSkeleton() {
  return (
    <div
      className="bg-white border border-slate-100 rounded-2xl shadow-sm p-5 flex flex-col justify-between h-full gap-4"
      aria-hidden="true"
    >
      {/* Top Section: Title, Description, Client & Tech */}
      <div className="space-y-3">
        <div className="space-y-2">
          {/* Title line */}
          <div className="h-5 bg-slate-100 animate-pulse rounded-lg w-2/3" />
          {/* Category tag */}
          <div className="h-4 bg-slate-100 animate-pulse rounded-md w-16" />
        </div>

        {/* Description lines */}
        <div className="space-y-1.5 pt-1">
          <div className="h-3 bg-slate-100 animate-pulse rounded-lg w-full" />
          <div className="h-3 bg-slate-100 animate-pulse rounded-lg w-5/6" />
        </div>

        {/* Client placeholder */}
        <div className="h-3.5 bg-slate-100 animate-pulse rounded w-1/2 pt-1" />

        {/* Technologies placeholders */}
        <div className="space-y-1.5 pt-1">
          <div className="h-3 bg-slate-100 animate-pulse rounded w-1/4" />
          <div className="flex gap-1">
            <div className="h-4 bg-slate-100 animate-pulse rounded w-12" />
            <div className="h-4 bg-slate-100 animate-pulse rounded w-14" />
            <div className="h-4 bg-slate-100 animate-pulse rounded w-10" />
          </div>
        </div>
      </div>

      {/* Middle Section: Progress */}
      <div className="space-y-2 pt-1">
        <div className="flex justify-between">
          <div className="h-3 bg-slate-100 animate-pulse rounded-lg w-12" />
          <div className="h-3 bg-slate-100 animate-pulse rounded-lg w-8" />
        </div>
        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden" />
      </div>

      {/* Bottom Section: Badges, Metadata & Actions */}
      <div className="space-y-4 pt-3 border-t border-slate-50">
        <div className="flex justify-between items-center gap-2">
          {/* Status & Priority badges */}
          <div className="flex items-center gap-1.5">
            <div className="h-5 bg-slate-100 animate-pulse rounded-full w-14" />
            <div className="h-5 bg-slate-100 animate-pulse rounded-full w-16" />
          </div>
          {/* Date range string placeholder */}
          <div className="h-3.5 bg-slate-100 animate-pulse rounded-lg w-20" />
        </div>

        {/* Action icons placeholders */}
        <div className="flex items-center justify-end gap-1">
          <div className="w-8 h-8 bg-slate-100 animate-pulse rounded-xl" />
          <div className="w-8 h-8 bg-slate-100 animate-pulse rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export default ProjectCardSkeleton;
export { ProjectCardSkeleton };
