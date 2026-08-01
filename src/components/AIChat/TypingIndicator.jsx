import { useState, useEffect } from 'react';
import { Bot } from 'lucide-react';
import { motion } from 'framer-motion';

const THINKING_PHRASES = [
  'Thinking...',
  'Analyzing...',
  'Planning your response...',
  'Reviewing your request...',
];

/**
 * TypingIndicator component — renders animated loading dots with rotating thinking phrases.
 */
function TypingIndicator() {
  const [phraseIndex, setPhraseIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPhraseIndex((prev) => (prev + 1) % THINKING_PHRASES.length);
    }, 1400);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="flex items-start gap-3 my-2"
    >
      {/* Bot Icon */}
      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-500 to-accent-600 flex items-center justify-center text-white shadow-sm flex-shrink-0 mt-0.5">
        <Bot className="w-4 h-4" />
      </div>

      {/* Typing Bubble */}
      <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 px-4 py-3 rounded-2xl rounded-tl-xs shadow-sm flex items-center gap-2">
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-primary-500 animate-bounce" style={{ animationDelay: '0ms' }} />
          <span className="w-2 h-2 rounded-full bg-primary-500 animate-bounce" style={{ animationDelay: '150ms' }} />
          <span className="w-2 h-2 rounded-full bg-primary-500 animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 ml-1 select-none transition-all duration-300">
          {THINKING_PHRASES[phraseIndex]}
        </span>
      </div>
    </motion.div>
  );
}

export default TypingIndicator;
export { TypingIndicator };
