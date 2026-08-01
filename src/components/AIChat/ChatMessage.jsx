import React, { useState } from 'react';
import { Bot, User, Copy, Check, RefreshCw, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

/**
 * CodeBlock sub-component for styled markdown code snippets with a copy button & toast callback.
 */
function CodeBlock({ children, className, onCopySuccess }) {
  const [copied, setCopied] = useState(false);
  const match = /language-(\w+)/.exec(className || '');
  const language = match ? match[1] : '';
  const codeText = String(children).replace(/\n$/, '');

  const handleCopyCode = () => {
    navigator.clipboard.writeText(codeText);
    setCopied(true);
    if (onCopySuccess) onCopySuccess('Code copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-2 rounded-xl overflow-hidden bg-slate-900 border border-slate-700/60 shadow-md">
      <div className="flex items-center justify-between px-3.5 py-1.5 bg-slate-800/90 text-slate-400 text-[10px] font-mono border-b border-slate-700/50">
        <span className="uppercase font-bold">{language || 'code'}</span>
        <button
          type="button"
          onClick={handleCopyCode}
          className="flex items-center gap-1 hover:text-white transition-colors focus:outline-none"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-emerald-400" />
              <span className="text-emerald-400 font-bold">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              <span>Copy code</span>
            </>
          )}
        </button>
      </div>
      <div className="p-3 overflow-x-auto text-xs font-mono text-slate-100 leading-relaxed">
        <code>{codeText}</code>
      </div>
    </div>
  );
}

/**
 * ChatMessage component — renders message bubbles with framer-motion animations,
 * markdown parsing, blinking cursor, and hover action menu.
 */
const ChatMessage = React.memo(function ChatMessage({
  message,
  hideAvatar = false,
  onRegenerate,
  onCopySuccess,
}) {
  const [copiedMessage, setCopiedMessage] = useState(false);

  // 1. System Notice
  if (message.sender === 'system' || message.type === 'system') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="flex justify-center my-3"
      >
        <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-xs font-semibold rounded-full border border-slate-200 dark:border-slate-700 select-none">
          {message.text}
        </span>
      </motion.div>
    );
  }

  const isUser = message.sender === 'user';
  const isAssistant = message.sender === 'assistant' || message.sender === 'ai';
  const isError = message.isError || message.status === 'error';
  const isStreaming = message.isStreaming;

  const handleCopyMessage = () => {
    if (message.text) {
      navigator.clipboard.writeText(message.text);
      setCopiedMessage(true);
      if (onCopySuccess) onCopySuccess('Copied to clipboard');
      setTimeout(() => setCopiedMessage(false), 2000);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28 }}
      className={`flex items-start gap-3 my-1.5 group ${
        isUser ? 'flex-row-reverse' : 'flex-row'
      }`}
    >
      {/* Avatar Icon (Hidden if consecutive same sender) */}
      <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center">
        {!hideAvatar && (
          <div
            className={`w-8 h-8 rounded-xl flex items-center justify-center text-white shadow-sm mt-0.5 ${
              isUser
                ? 'bg-slate-700 dark:bg-slate-600'
                : 'bg-gradient-to-br from-primary-500 to-accent-600'
            }`}
          >
            {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
          </div>
        )}
      </div>

      {/* Bubble Content */}
      <div className="flex flex-col max-w-[85%] sm:max-w-[78%]">
        <div
          className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
            isUser
              ? 'bg-primary-600 text-white rounded-tr-xs shadow-sm font-medium'
              : isError
              ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800/60 rounded-tl-xs shadow-sm'
              : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-100 dark:border-slate-700/80 rounded-tl-xs shadow-sm'
          }`}
        >
          {isError ? (
            <div className="flex items-center gap-2 font-semibold text-xs">
              <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0" />
              <span>{message.text || '⚠️ Something went wrong. Please try again.'}</span>
            </div>
          ) : isAssistant ? (
            <div className="prose dark:prose-invert prose-xs max-w-none prose-p:my-1.5 prose-headings:my-2 prose-ul:my-1.5 prose-ol:my-1.5 prose-li:my-0.5 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:bg-slate-100 dark:prose-code:bg-slate-700/60 prose-code:before:content-none prose-code:after:content-none">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  code({ node, inline, className, children, ...props }) {
                    if (inline) {
                      return (
                        <code className={className} {...props}>
                          {children}
                        </code>
                      );
                    }
                    return (
                      <CodeBlock className={className} onCopySuccess={onCopySuccess}>
                        {children}
                      </CodeBlock>
                    );
                  },
                }}
              >
                {message.text || ''}
              </ReactMarkdown>

              {/* Blinking Cursor while Streaming */}
              {isStreaming && (
                <span className="inline-block w-2 h-4 ml-1 bg-primary-500 animate-pulse font-mono font-bold align-middle">
                  ▌
                </span>
              )}
            </div>
          ) : (
            <div className="whitespace-pre-wrap">{message.text}</div>
          )}
        </div>

        {/* Bottom Bar: Timestamp + Hover Actions (Copy / Regenerate for Assistant) */}
        <div className="flex items-center justify-between gap-2 mt-1 px-1 min-h-[16px]">
          {/* Timestamp */}
          {message.timestamp && (
            <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 select-none">
              {message.timestamp}
            </span>
          )}

          {/* Hover Menu for Assistant Messages */}
          {isAssistant && !isError && !isStreaming && (
            <div className="flex items-center gap-2.5 opacity-0 group-hover:opacity-100 transition-opacity">
              {/* Copy Button */}
              <button
                type="button"
                onClick={handleCopyMessage}
                className="flex items-center gap-1 text-[10px] font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors focus:outline-none"
                title="Copy message"
              >
                {copiedMessage ? (
                  <span className="text-emerald-500 dark:text-emerald-400 font-bold">Copied ✓</span>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy</span>
                  </>
                )}
              </button>

              {/* Regenerate Button */}
              <button
                type="button"
                onClick={() => onRegenerate && onRegenerate(message.id)}
                className="flex items-center gap-1 text-[10px] font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors focus:outline-none"
                title="Regenerate response"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Regenerate</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
});

export default ChatMessage;
export { ChatMessage };
