import { Sparkles, ArrowUpRight } from 'lucide-react';

const SUGGESTED_PROMPTS = [
  "What should I focus on today?",
  "Show my pending work.",
  "Summarize today's schedule.",
  "Help me plan tomorrow.",
  "Generate today's report.",
];

/**
 * SuggestedPrompts component — displays example prompt cards for quick activation.
 *
 * @param {Function} onSelectPrompt - Callback function when user clicks a suggested prompt.
 */
function SuggestedPrompts({ onSelectPrompt }) {
  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl p-5 shadow-sm space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-700">
        <div className="p-1.5 rounded-lg bg-primary-50 dark:bg-primary-950/40 text-primary-600 dark:text-primary-400">
          <Sparkles className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 leading-none">
            Suggested Prompts
          </h3>
          <p className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 mt-1">
            Quick starter ideas for your AI Secretary
          </p>
        </div>
      </div>

      {/* Prompts List */}
      <div className="space-y-2">
        {SUGGESTED_PROMPTS.map((prompt, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => onSelectPrompt && onSelectPrompt(prompt)}
            className="w-full flex items-center justify-between p-3 text-left rounded-xl bg-slate-50/70 dark:bg-slate-900/40 hover:bg-primary-50 dark:hover:bg-primary-950/30 border border-slate-100 dark:border-slate-700/60 hover:border-primary-200 dark:hover:border-primary-800/50 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-primary-700 dark:hover:text-primary-300 transition-all duration-200 group"
          >
            <span className="truncate pr-2">{prompt}</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors flex-shrink-0" />
          </button>
        ))}
      </div>
    </div>
  );
}

export default SuggestedPrompts;
export { SuggestedPrompts };
