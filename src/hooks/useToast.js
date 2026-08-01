import { useState, useCallback } from 'react';

let _toastId = 0;

/**
 * useToast — lightweight toast notification hook.
 *
 * Returns:
 *   toasts      — array of active toast objects: { id, message, type }
 *   showToast   — (message: string, type: 'success' | 'error') => void
 *   removeToast — (id: number) => void
 *
 * Auto-dismisses each toast after 3 seconds.
 * No external libraries required.
 */
function useToast() {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (message, type = 'success') => {
      const id = ++_toastId;
      setToasts((prev) => [...prev, { id, message, type }]);

      // Auto-dismiss after 3 seconds
      setTimeout(() => removeToast(id), 3000);
    },
    [removeToast]
  );

  return { toasts, showToast, removeToast };
}

export default useToast;
