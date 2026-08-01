import React from 'react';
import { Brain, Play, CheckSquare } from 'lucide-react';

/**
 * AIRecommendationCard component.
 * Displays today's AI recommendation along with action buttons
 * and a premium gradient-based visual icon container.
 */
function AIRecommendationCard() {
  return (
    <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6 sm:p-8 hover:shadow-md transition-shadow duration-200">

      {/* Dynamic Grid Layout: 1 column on mobile, 3 columns on larger screens */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">

        {/* Left Side: Content & Actions (takes 2 columns on desktop) */}
        <div className="md:col-span-2 space-y-5">
          {/* Header */}
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xl" role="img" aria-label="bot">🤖</span>
              <h3 className="text-base font-bold text-slate-800 tracking-tight">
                AI Secretary
              </h3>
            </div>
            <p className="text-xs font-semibold text-primary-600 uppercase tracking-wider">
              Today's Recommendation
            </p>
          </div>

          {/* Recommendation Text Box */}
          <div className="bg-slate-50/80 border border-slate-100 rounded-xl p-5 space-y-3">
            <p className="text-sm font-bold text-slate-800">
              Good Morning, Zia 👋
            </p>
            <p className="text-sm text-slate-600 leading-relaxed font-medium">
              You have 3 important priorities today.
            </p>

            {/* List of Priorities */}
            <ol className="space-y-2 text-sm text-slate-600 font-medium">
              <li className="flex items-start gap-2">
                <span className="text-primary-500 font-bold" aria-hidden="true">1.</span>
                <span>Complete your Dashboard module.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary-500 font-bold" aria-hidden="true">2.</span>
                <span>Review pending tasks.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary-500 font-bold" aria-hidden="true">3.</span>
                <span>Continue your DPS development.</span>
              </li>
            </ol>

            <p className="text-xs font-semibold text-slate-400 pt-1">
              Stay focused on one priority at a time.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Primary Action */}
            <button
              type="button"
              className="flex items-center gap-2 px-5 py-2.5 bg-primary-600 hover:bg-primary-700 active:bg-primary-800 text-white text-sm font-semibold rounded-xl shadow-sm shadow-primary-100 transition-all focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            >
              <Play className="w-4 h-4 fill-current" aria-hidden="true" />
              <span>Start Working</span>
            </button>
            {/* Secondary Action */}
            <button
              type="button"
              className="flex items-center gap-2 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-700 text-sm font-semibold rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-slate-300 focus:ring-offset-2"
            >
              <CheckSquare className="w-4 h-4" aria-hidden="true" />
              <span>View Tasks</span>
            </button>
          </div>
        </div>

        {/* Right Side: Brain Icon with circular gradient (takes 1 column on desktop) */}
        <div className="flex justify-center md:justify-end">
          <div className="relative group">
            {/* Soft decorative background pulse */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-300" />

            {/* Main Circle Icon container */}
            <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br from-primary-500 to-accent-600 flex items-center justify-center shadow-lg shadow-primary-200">
              <Brain className="w-12 h-12 sm:w-14 sm:h-14 text-white drop-shadow-sm group-hover:scale-105 transition-transform duration-300" aria-hidden="true" />
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}

export default AIRecommendationCard;
