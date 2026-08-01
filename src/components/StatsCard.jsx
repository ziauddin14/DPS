import React from 'react';

/**
 * StatsCard component.
 * Displays a single metric value, title, dynamic icon, and description.
 *
 * @param {string} title - Label of the statistic.
 * @param {string|number} value - The primary metric number.
 * @param {React.ComponentType} icon - Lucide icon component.
 * @param {string} description - Small explanation text.
 * @param {string} [colorClass="text-primary-600 bg-primary-50"] - Tailwind color classes for the icon wrapper.
 */
function StatsCard({ title, value, icon: Icon, description, colorClass = "text-primary-600 bg-primary-50" }) {
  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl shadow-sm p-6 hover:-translate-y-1 hover:shadow-md transition-all duration-200 ease-in-out group">

      {/* Top row: Icon and Title */}
      <div className="flex items-center gap-3">
        {/* Icon wrapper badge */}
        <div className={`p-2.5 rounded-xl ${colorClass} flex-shrink-0 transition-transform duration-300 group-hover:scale-110`}>
          <Icon className="w-5 h-5" aria-hidden="true" />
        </div>
        <span className="text-sm font-semibold text-slate-500 dark:text-slate-400 tracking-tight">
          {title}
        </span>
      </div>

      {/* Main value */}
      <div className="mt-4">
        <span className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">
          {value}
        </span>
      </div>

      {/* Small description */}
      <div className="mt-2">
        <p className="text-xs font-medium text-slate-400 dark:text-slate-500">
          {description}
        </p>
      </div>

    </div>
  );
}

export default StatsCard;
