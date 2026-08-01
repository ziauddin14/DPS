import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Trash2, ArrowDown, Sparkles, Brain, Cpu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import TypingIndicator from './TypingIndicator';
import WelcomeScreen from './WelcomeScreen';

/**
 * Helper to get clean Date Separator label from timestamp string or Date.
 */
function getDateLabel(msg) {
  if (msg.dateLabel) return msg.dateLabel;
  const d = msg.createdAt ? new Date(msg.createdAt) : new Date();
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (d.toDateString() === today.toDateString()) return 'Today';
  if (d.toDateString() === yesterday.toDateString()) return 'Yesterday';

  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

/**
 * AIChatWindow component — upgraded header, floating scroll-to-bottom button, date separators, and smart auto-scroll.
 */
function AIChatWindow({
  messages = [],
  isTyping = false,
  isLoadingHistory = false,
  title = null,
  onSendMessage,
  onStop,
  onRegenerate,
  onClearChat,
  onCopySuccess,
}) {
  const containerRef = useRef(null);
  const messagesEndRef = useRef(null);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);
  const [showScrollButton, setShowScrollButton] = useState(false);

  // Detect user manual scroll up vs bottom position
  const handleScroll = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;

    const isNearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
    setShouldAutoScroll(isNearBottom);
    setShowScrollButton(!isNearBottom && el.scrollHeight > el.clientHeight + 100);
  }, []);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  // Smooth scroll to bottom when new messages arrive if auto-scroll is enabled
  useEffect(() => {
    if (shouldAutoScroll) {
      scrollToBottom();
    }
  }, [messages, isTyping, shouldAutoScroll, scrollToBottom]);

  return (
    <div className="relative flex flex-col h-full bg-slate-50/40 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
      {/* Upgraded Chat Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 bg-white/80 dark:bg-slate-800/80 border-b border-slate-100 dark:border-slate-800 backdrop-blur-xs z-10">
        {/* Title & Online Status */}
        <div className="flex items-center gap-2.5">
          <div className="relative flex items-center justify-center">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="absolute w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping opacity-75" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-extrabold text-slate-800 dark:text-slate-100 leading-tight">
                AI Secretary
              </h3>
              {title && (
                <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700 text-[10px] font-bold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600 max-w-[180px] truncate">
                  {title}
                </span>
              )}
            </div>
            <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 block">
              Online
            </span>
          </div>
        </div>

        {/* Badges & Clear Chat Action */}
        <div className="flex items-center gap-2">
          {/* Conversation Memory Badge */}
          <div className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary-50 dark:bg-primary-950/50 text-primary-700 dark:text-primary-300 border border-primary-100 dark:border-primary-900/50 text-[10px] font-bold">
            <Brain className="w-3 h-3 text-primary-500" />
            <span>Memory ON</span>
          </div>

          {/* Model Badge */}
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600 text-[10px] font-bold">
            <Cpu className="w-3 h-3 text-slate-400" />
            <span>GPT-4o-mini</span>
          </div>

          {/* Clear Chat Button */}
          {messages.length > 0 && (
            <button
              type="button"
              onClick={onClearChat}
              className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/50 transition-colors focus:outline-none ml-1"
              title="Clear Conversation"
              aria-label="Clear Conversation"
            >
              <Trash2 className="w-3 h-3" />
              <span className="hidden md:inline">Clear</span>
            </button>
          )}
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-1 min-h-[380px] max-h-[calc(100vh-290px)] relative"
      >
        {isLoadingHistory ? (
          <div className="space-y-4 p-4 animate-pulse">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-slate-200 dark:bg-slate-700" />
              <div className="h-12 w-2/3 bg-slate-200 dark:bg-slate-700 rounded-2xl" />
            </div>
            <div className="flex items-start gap-3 flex-row-reverse">
              <div className="w-8 h-8 rounded-xl bg-slate-200 dark:bg-slate-700" />
              <div className="h-10 w-1/2 bg-primary-200 dark:bg-primary-900/50 rounded-2xl" />
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-slate-200 dark:bg-slate-700" />
              <div className="h-16 w-3/4 bg-slate-200 dark:bg-slate-700 rounded-2xl" />
            </div>
          </div>
        ) : messages.length === 0 ? (
          <WelcomeScreen onSelectPrompt={onSendMessage} />
        ) : (
          <>
            {messages.map((msg, idx) => {
              // Date Separator calculation
              const prevMsg = messages[idx - 1];
              const currentDateLabel = getDateLabel(msg);
              const prevDateLabel = prevMsg ? getDateLabel(prevMsg) : null;
              const showDateSeparator = currentDateLabel !== prevDateLabel;

              // Hide avatar if previous message was from the same sender
              const hideAvatar =
                !showDateSeparator &&
                prevMsg &&
                prevMsg.sender === msg.sender &&
                msg.sender !== 'system';

              return (
                <React.Fragment key={msg.id}>
                  {/* Date Separator */}
                  {showDateSeparator && (
                    <div className="flex justify-center my-4">
                      <span className="px-3 py-1 bg-slate-200/60 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[10px] font-bold rounded-full uppercase tracking-wider select-none shadow-2xs">
                        {currentDateLabel}
                      </span>
                    </div>
                  )}

                  {/* Message item */}
                  <ChatMessage
                    message={msg}
                    hideAvatar={hideAvatar}
                    onRegenerate={onRegenerate}
                    onCopySuccess={onCopySuccess}
                  />
                </React.Fragment>
              );
            })}

            {isTyping && <TypingIndicator />}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Floating Scroll-to-Bottom Button */}
      <AnimatePresence>
        {showScrollButton && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            type="button"
            onClick={scrollToBottom}
            className="absolute bottom-20 right-6 p-2.5 rounded-full bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-lg hover:bg-slate-50 dark:hover:bg-slate-700 active:scale-95 transition-all z-20 focus:outline-none"
            title="Scroll to bottom"
            aria-label="Scroll to bottom"
          >
            <ArrowDown className="w-4 h-4 text-primary-600 dark:text-primary-400" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Input Area at Bottom */}
      <div className="p-3 sm:p-4 bg-white/80 dark:bg-slate-800/80 border-t border-slate-100 dark:border-slate-800 backdrop-blur-xs">
        <ChatInput
          onSendMessage={onSendMessage}
          onStop={onStop}
          isSending={isTyping}
        />
      </div>
    </div>
  );
}

export default AIChatWindow;
export { AIChatWindow };
