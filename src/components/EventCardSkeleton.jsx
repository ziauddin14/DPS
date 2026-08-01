/**
 * EventCardSkeleton — animated placeholder for an EventCard during loading.
 *
 * Mimics the exact layout of EventCard (left border accent, badge, title,
 * description, date/time/location, action buttons) using shimmer pulse
 * animation so the user perceives immediate content.
 */
function EventCardSkeleton() {
  return (
    <div
      className="bg-white border border-slate-100 border-l-4 border-l-slate-200 rounded-2xl shadow-sm p-5 flex flex-col justify-between h-full gap-4"
      aria-hidden="true"
    >
      {/* Top: badge + title */}
      <div className="space-y-3">
        <div className="space-y-2 min-w-0">
          {/* Title line */}
          <div className="h-4 bg-slate-100 animate-pulse rounded-lg w-3/4" />
          {/* Badge */}
          <div className="flex items-center gap-1.5">
            <div className="h-5 w-16 bg-slate-100 animate-pulse rounded-full" />
          </div>
        </div>

        {/* Description lines */}
        <div className="space-y-1.5 pt-1">
          <div className="h-3 bg-slate-100 animate-pulse rounded-lg w-full" />
          <div className="h-3 bg-slate-100 animate-pulse rounded-lg w-4/5" />
        </div>
      </div>

      {/* Middle: date / time / location placeholders */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-1.5">
          <div className="w-3.5 h-3.5 bg-slate-100 animate-pulse rounded" />
          <div className="h-3 w-32 bg-slate-100 animate-pulse rounded-lg" />
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3.5 h-3.5 bg-slate-100 animate-pulse rounded" />
          <div className="h-3 w-16 bg-slate-100 animate-pulse rounded-lg" />
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3.5 h-3.5 bg-slate-100 animate-pulse rounded" />
          <div className="h-3 w-24 bg-slate-100 animate-pulse rounded-lg" />
        </div>
      </div>

      {/* Bottom: edit + delete button placeholders */}
      <div className="pt-3 border-t border-slate-50 flex items-center justify-end gap-2">
        <div className="w-8 h-8 bg-slate-100 animate-pulse rounded-xl" />
        <div className="w-8 h-8 bg-slate-100 animate-pulse rounded-xl" />
      </div>
    </div>
  );
}

export default EventCardSkeleton;
export { EventCardSkeleton };
