import { useState, useRef, useEffect } from 'react';
import { Send, Square, Mic, Paperclip } from 'lucide-react';

/**
 * ChatInput component — Textarea input with auto-expand (2-8 rows),
 * Shift+Enter support, Send / Stop button toggle, and action buttons.
 *
 * @param {Function} onSendMessage - Callback function when user submits a message.
 * @param {Function} [onStop] - Callback function when user clicks Stop generating button.
 * @param {boolean} isSending - Whether AI is currently typing/generating response.
 */
function ChatInput({ onSendMessage, onStop, isSending = false }) {
  const [text, setText] = useState('');
  const textareaRef = useRef(null);

  // Auto-focus on mount
  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed || isSending) return;

    onSendMessage(trimmed);
    setText('');

    // Reset height back to min 2 rows (~48px)
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleChange = (e) => {
    setText(e.target.value);
    // Dynamic height resize (min ~48px / 2 rows, max ~192px / 8 rows)
    const el = textareaRef.current;
    if (el) {
      el.style.height = 'auto';
      el.style.height = `${Math.min(Math.max(el.scrollHeight, 48), 192)}px`;
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm p-3 flex flex-col gap-2 transition-all focus-within:border-primary-500 focus-within:ring-1 focus-within:ring-primary-500"
    >
      {/* Auto-expanding Textarea (Min 2 rows / Max 8 rows) */}
      <textarea
        ref={textareaRef}
        rows={2}
        value={text}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="Ask DPS AI Secretary anything... (Press Enter to send, Shift+Enter for new line)"
        disabled={isSending}
        aria-label="Chat input text"
        className="w-full bg-transparent text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 resize-none outline-none px-2 py-1 min-h-[48px] max-h-[192px] leading-relaxed"
      />

      {/* Actions Toolbar */}
      <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-700/60 pt-2 px-1">
        {/* Attachment & Mic Buttons (Disabled Placeholders) */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            disabled
            title="Attachment feature coming soon"
            aria-label="Attach file"
            className="p-2 text-slate-350 dark:text-slate-600 hover:text-slate-400 cursor-not-allowed rounded-lg transition-colors focus:outline-none"
          >
            <Paperclip className="w-4 h-4" />
          </button>
          <button
            type="button"
            disabled
            title="Voice input coming soon"
            aria-label="Voice input"
            className="p-2 text-slate-350 dark:text-slate-600 hover:text-slate-400 cursor-not-allowed rounded-lg transition-colors focus:outline-none"
          >
            <Mic className="w-4 h-4" />
          </button>
        </div>

        {/* Send / Stop Toggle Button */}
        {isSending ? (
          <button
            type="button"
            onClick={onStop}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 active:bg-rose-800 shadow-xs shadow-rose-200 transition-all hover:scale-105 active:scale-95 focus:outline-none"
            aria-label="Stop generating response"
          >
            <Square className="w-3.5 h-3.5 fill-current" />
            <span>Stop</span>
          </button>
        ) : (
          <button
            type="submit"
            disabled={!text.trim()}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white transition-all shadow-xs ${
              !text.trim()
                ? 'bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed'
                : 'bg-primary-600 hover:bg-primary-700 active:bg-primary-800 shadow-primary-200 hover:scale-105 active:scale-95'
            }`}
            aria-label="Send message"
          >
            <span>Send</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </form>
  );
}

export default ChatInput;
export { ChatInput };
