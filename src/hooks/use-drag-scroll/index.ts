import { useCallback, useState } from "react";

type EventHandler = {
  /** Handles the mouse down event to start dragging */
  onMouseDown: (e: React.MouseEvent) => void;
  /** Handles mouse movement while dragging to update scroll position */
  onMouseMove: (e: React.MouseEvent) => void;
  /** Handles mouse up event to end dragging */
  onMouseUp: () => void;
  /** Handles mouse leaving the element to end dragging */
  onMouseLeave: () => void;
  /** Handles touch start event to start dragging */
  onTouchStart: (e: React.TouchEvent) => void;
  /** Handles touch movement while dragging to update scroll position */
  onTouchMove: (e: React.TouchEvent) => void;
  /** Handles touch end event to end dragging */
  onTouchEnd: () => void;
};

type UseDragScrollProps = {
  /** Total width of the scrollable content */
  totalWidth: number;
  /** Width of the container element */
  containerWidth: number;
};

type UseDragScrollReturn = {
  /** Whether the user is currently dragging */
  isDragging: boolean;
  /** Current scroll offset from the left */
  scrollOffset: number;
  /** Event handlers for drag scroll interactions */
  eventHandlers: EventHandler;
};

function useDragScroll({
  totalWidth,
  containerWidth,
}: UseDragScrollProps): UseDragScrollReturn {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [scrollOffset, setScrollOffset] = useState(0);

  const maxScrollOffset = Math.max(0, totalWidth - containerWidth);

  const updateScrollOffset = useCallback(
    (clientX: number) => {
      const deltaX = clientX - dragStartX;
      const newScrollOffset = scrollOffset - deltaX;
      const minScrollOffset = Math.min(maxScrollOffset, newScrollOffset);
      const clampedOffset = Math.max(0, minScrollOffset);

      if (clampedOffset !== scrollOffset) {
        setScrollOffset(clampedOffset);
        setDragStartX(clientX);
      }
    },
    [dragStartX, scrollOffset, maxScrollOffset]
  );

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStartX(e.clientX);
  };

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (isDragging) updateScrollOffset(e.clientX);
    },
    [isDragging, updateScrollOffset]
  );

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setDragStartX(e.touches[0].clientX);
  };

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (isDragging) updateScrollOffset(e.touches[0].clientX);
    },
    [isDragging, updateScrollOffset]
  );

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  return {
    isDragging,
    scrollOffset,
    eventHandlers: {
      onMouseDown: handleMouseDown,
      onMouseMove: handleMouseMove,
      onMouseUp: handleMouseUp,
      onMouseLeave: handleMouseLeave,
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
    },
  };
}

export default useDragScroll;
