import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import useDragScroll from "./index";

describe("useDragScroll", () => {
  const mockProps = {
    totalWidth: 1000,
    containerWidth: 400,
  };

  const mockX = (x: number) =>
    ({ clientX: x } as React.MouseEvent & React.TouchEvent);

  describe("initial state", () => {
    it("should initialize with correct default values", () => {
      const { result } = renderHook(() => useDragScroll(mockProps));

      expect(result.current.isDragging).toBe(false);
      expect(result.current.scrollOffset).toBe(0);
      expect(result.current.eventHandlers).toEqual({
        onMouseDown: expect.any(Function),
        onMouseMove: expect.any(Function),
        onMouseUp: expect.any(Function),
        onMouseLeave: expect.any(Function),
        onTouchStart: expect.any(Function),
        onTouchMove: expect.any(Function),
        onTouchEnd: expect.any(Function),
      });
    });
  });

  describe("mouse interactions", () => {
    it("should start dragging on mouse down", () => {
      const { result } = renderHook(() => useDragScroll(mockProps));

      act(() => {
        result.current.eventHandlers.onMouseDown(mockX(100));
      });

      expect(result.current.isDragging).toBe(true);
    });

    it("should update scroll offset on mouse move while dragging", () => {
      const { result } = renderHook(() => useDragScroll(mockProps));

      act(() => {
        result.current.eventHandlers.onMouseDown(mockX(200));
      });

      act(() => {
        result.current.eventHandlers.onMouseMove(mockX(50));
      });

      expect(result.current.scrollOffset).toBe(150);
    });

    it("should not update scroll offset on mouse move when not dragging", () => {
      const { result } = renderHook(() => useDragScroll(mockProps));

      act(() => {
        result.current.eventHandlers.onMouseMove(mockX(150));
      });

      expect(result.current.scrollOffset).toBe(0);
    });

    it("should stop dragging on mouse up", () => {
      const { result } = renderHook(() => useDragScroll(mockProps));

      act(() => {
        result.current.eventHandlers.onMouseDown(mockX(100));
      });

      expect(result.current.isDragging).toBe(true);

      act(() => {
        result.current.eventHandlers.onMouseUp();
      });

      expect(result.current.isDragging).toBe(false);
    });

    it("should stop dragging on mouse leave", () => {
      const { result } = renderHook(() => useDragScroll(mockProps));

      act(() => {
        result.current.eventHandlers.onMouseDown(mockX(100));
      });

      expect(result.current.isDragging).toBe(true);

      act(() => {
        result.current.eventHandlers.onMouseLeave();
      });

      expect(result.current.isDragging).toBe(false);
    });
  });

  describe("touch interactions", () => {
    it("should start dragging on touch start", () => {
      const { result } = renderHook(() => useDragScroll(mockProps));

      act(() => {
        result.current.eventHandlers.onTouchStart({
          touches: [{ clientX: 100 }],
        } as unknown as React.TouchEvent);
      });

      expect(result.current.isDragging).toBe(true);
    });

    it("should update scroll offset on touch move while dragging", () => {
      const { result } = renderHook(() => useDragScroll(mockProps));

      act(() => {
        result.current.eventHandlers.onTouchStart({
          touches: [{ clientX: 100 }],
        } as unknown as React.TouchEvent);
      });

      act(() => {
        result.current.eventHandlers.onTouchMove({
          touches: [{ clientX: 50 }],
        } as unknown as React.TouchEvent);
      });

      expect(result.current.scrollOffset).toBe(50);
    });

    it("should not update scroll offset on touch move when not dragging", () => {
      const { result } = renderHook(() => useDragScroll(mockProps));

      act(() => {
        result.current.eventHandlers.onTouchMove({
          touches: [{ clientX: 150 }],
        } as unknown as React.TouchEvent);
      });

      expect(result.current.scrollOffset).toBe(0);
    });

    it("should stop dragging on touch end", () => {
      const { result } = renderHook(() => useDragScroll(mockProps));

      act(() => {
        result.current.eventHandlers.onTouchStart({
          touches: [{ clientX: 100 }],
        } as unknown as React.TouchEvent);
      });

      expect(result.current.isDragging).toBe(true);

      act(() => {
        result.current.eventHandlers.onTouchEnd();
      });

      expect(result.current.isDragging).toBe(false);
    });
  });

  describe("scroll offset calculations", () => {
    it("should clamp scroll offset to minimum of 0", () => {
      const { result } = renderHook(() => useDragScroll(mockProps));

      act(() => {
        result.current.eventHandlers.onMouseDown(mockX(100));
      });

      act(() => {
        result.current.eventHandlers.onMouseMove(mockX(200));
      });

      expect(result.current.scrollOffset).toBe(0);
    });

    it("should clamp scroll offset to maximum scroll offset", () => {
      const { result } = renderHook(() => useDragScroll(mockProps));

      act(() => {
        result.current.eventHandlers.onMouseDown(mockX(0));

        result.current.eventHandlers.onMouseMove(mockX(-700));
      });

      expect(result.current.scrollOffset).toBeLessThanOrEqual(600);
    });
  });
});
