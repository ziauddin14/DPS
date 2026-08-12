import { useEffect, useRef } from 'react';

/**
 * Custom hook for horizontal keyboard scrolling
 * Adds left/right arrow key navigation to a scrollable container
 * 
 * @param {number} [scrollAmount=200] - Pixels to scroll per key press
 * @returns {React.RefObject} - Ref to attach to the scrollable container
 */
export function useHorizontalScroll(scrollAmount = 200) {
  const containerRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!containerRef.current) return;
      
      // Only handle left/right arrow keys
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        if (e.key === 'ArrowLeft') {
          containerRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        } else {
          containerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('keydown', handleKeyDown);
      return () => container.removeEventListener('keydown', handleKeyDown);
    }
  }, [scrollAmount]);

  return containerRef;
}
