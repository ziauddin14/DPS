import { Clipboard } from 'lucide-react';

/**
 * EmptyState component.
 * Displays a nice graphic, title, and subtitle when there are no tasks.
 */
function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200 min-h-[300px]">
      <div className="p-4 bg-slate-50 dark:bg-slate-700 text-slate-400 dark:text-slate-500 rounded-full mb-4 animate-pulse">
        <Clipboard className="w-12 h-12" aria-hidden="true" />
      </div>
      <h3 className="text-lg font-bold text-slate-700 dark:text-slate-200 tracking-tight">
        No tasks available
      </h3>
      <p className="text-sm font-semibold text-slate-400 dark:text-slate-500 mt-1 max-w-sm">
        Create your first task to start organizing your schedule.
      </p>
    </div>
  );
}

export default EmptyState;
export { EmptyState };
