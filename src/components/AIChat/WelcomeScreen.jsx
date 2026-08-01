import { useMemo } from 'react';
import { Bot, Sparkles, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const WELCOME_SUGGESTION_CHIPS = [
  "What should I do today?",
  "Show today's tasks",
  "Summarize my work",
  "Help me organize",
];

function getTimeGreeting() {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'Good Morning';
  if (hour >= 12 && hour < 17) return 'Good Afternoon';
  return 'Good Evening';
}

/**
 * WelcomeScreen component — displays dynamic greeting and starter prompt chips.
 *
 * @param {Function} onSelectPrompt - Callback when a suggestion chip is clicked.
 */
function WelcomeScreen({ onSelectPrompt }) {
  const greeting = useMemo(() => getTimeGreeting(), []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="h-full min-h-[380px] flex flex-col items-center justify-center text-center p-6 space-y-6"
    >
      {/* Large AI Icon */}
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500 to-accent-600 rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity" />
        <div className="relative w-20 h-20 rounded-3xl bg-gradient-to-br from-primary-500 to-accent-600 flex items-center justify-center text-white shadow-xl shadow-primary-200 dark:shadow-none">
          <Bot className="w-10 h-10 drop-shadow-sm" aria-hidden="true" />
        </div>
      </div>

      {/* Dynamic Heading & Subtitle */}
      <div className="max-w-md space-y-2">
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">
          {greeting}, User!
        </h2>
        <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 leading-relaxed">
          What would you like to accomplish today?
        </p>
      </div>

      {/* Suggestion Chips */}
      <div className="w-full max-w-lg space-y-2 pt-2">
        <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
          <Sparkles className="w-3.5 h-3.5 text-primary-500" aria-hidden="true" />
          <span>Quick Prompts</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {WELCOME_SUGGESTION_CHIPS.map((chipText, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onSelectPrompt && onSelectPrompt(chipText)}
              className="flex items-center justify-between p-3.5 rounded-2xl bg-white dark:bg-slate-800 hover:bg-primary-50 dark:hover:bg-primary-950/40 border border-slate-200 dark:border-slate-700/80 hover:border-primary-300 dark:hover:border-primary-700 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-primary-700 dark:hover:text-primary-300 shadow-sm transition-all duration-200 text-left group"
            >
              <span>{chipText}</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-350 dark:text-slate-500 group-hover:text-primary-600 dark:group-hover:text-primary-400 group-hover:translate-x-0.5 transition-all flex-shrink-0 ml-2" />
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default WelcomeScreen;
export { WelcomeScreen };
