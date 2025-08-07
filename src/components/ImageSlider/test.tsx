import "@testing-library/jest-dom";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { loadImages } from "@/lib/canvas";
import useDragScroll from "@/hooks/use-drag-scroll";
import ImageSlider from "./index";

vi.mock("@/lib/canvas", () => ({
  drawAllImages: vi.fn(),
  loadImages: vi.fn(),
}));

vi.mock("@/hooks/use-drag-scroll", () => ({
  default: vi.fn(),
}));

describe("ImageSlider", () => {
  const mockImages = [
    "https://example.com/image1.jpg",
    "https://example.com/image2.jpg",
    "https://example.com/image3.jpg",
  ];

  const mockDragScrollReturn = {
    isDragging: false,
    scrollOffset: 0,
    eventHandlers: {
      onMouseDown: vi.fn(),
      onMouseMove: vi.fn(),
      onMouseUp: vi.fn(),
      onMouseLeave: vi.fn(),
      onTouchStart: vi.fn(),
      onTouchMove: vi.fn(),
      onTouchEnd: vi.fn(),
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();

    (useDragScroll as ReturnType<typeof vi.fn>).mockReturnValue(
      mockDragScrollReturn
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("Rendering", () => {
    it("should render the slider container and canvas", async () => {
      render(<ImageSlider images={mockImages} />);

      expect(await screen.findByRole("img")).toHaveClass("slider");
    });

    it("should render with custom width and height", async () => {
      const customWidth = 800;
      const customHeight = 600;

      render(
        <ImageSlider
          images={mockImages}
          width={customWidth}
          height={customHeight}
        />
      );

      const canvas = await screen.findByRole("img");
      expect(canvas).toHaveAttribute("width", customWidth.toString());
      expect(canvas).toHaveAttribute("height", customHeight.toString());
    });

    it("should render with default dimensions when not provided", async () => {
      render(<ImageSlider images={mockImages} />);

      const canvas = await screen.findByRole("img");
      expect(canvas).toHaveAttribute("width", "640");
      expect(canvas).toHaveAttribute("height", "400");
    });

    it("should apply correct cursor style based on drag state", async () => {
      const { rerender } = render(<ImageSlider images={mockImages} />);
      let canvas = await screen.findByRole("img");

      expect(canvas).toHaveStyle({ cursor: "grab" });

      (useDragScroll as ReturnType<typeof vi.fn>).mockReturnValue({
        ...mockDragScrollReturn,
        isDragging: true,
      });

      rerender(<ImageSlider images={mockImages} />);
      canvas = screen.getByRole("img");
      expect(canvas).toHaveStyle({ cursor: "grabbing" });
    });
  });

  describe("Loading State", () => {
    it("should show loading component while images are loading", async () => {
      render(<ImageSlider images={mockImages} />);

      await waitFor(() => {
        expect(
          screen.getByRole("status", { name: /loading/i })
        ).toBeInTheDocument();
      });
    });

    it("should hide loading component after images are loaded", async () => {
      render(<ImageSlider images={mockImages} />);

      await waitFor(() => {
        expect(
          screen.queryByRole("status", { name: /loading/i })
        ).not.toBeInTheDocument();
      });
    });
  });

  describe("Image Loading", () => {
    it("should call loadImages with the provided image URLs", async () => {
      render(<ImageSlider images={mockImages} />);

      await waitFor(() => {
        expect(loadImages).toHaveBeenCalledWith(mockImages);
      });
    });
  });

  describe("Drag Interactions", () => {
    it("should pass correct props to useDragScroll hook", async () => {
      const customWidth = 800;
      const customHeight = 600;

      render(
        <ImageSlider
          images={mockImages}
          width={customWidth}
          height={customHeight}
        />
      );

      await waitFor(() => {});

      expect(useDragScroll).toHaveBeenCalledWith({
        totalWidth: customWidth * mockImages.length,
        containerWidth: customWidth,
      });
    });

    it("should handle mouse events correctly", async () => {
      render(<ImageSlider images={mockImages} />);

      const canvas = await screen.findByRole("img");

      fireEvent.mouseDown(canvas);
      expect(mockDragScrollReturn.eventHandlers.onMouseDown).toHaveBeenCalled();

      fireEvent.mouseMove(canvas);
      expect(mockDragScrollReturn.eventHandlers.onMouseMove).toHaveBeenCalled();

      fireEvent.mouseUp(canvas);
      expect(mockDragScrollReturn.eventHandlers.onMouseUp).toHaveBeenCalled();

      fireEvent.mouseLeave(canvas);
      expect(
        mockDragScrollReturn.eventHandlers.onMouseLeave
      ).toHaveBeenCalled();
    });

    it("should handle touch events correctly", async () => {
      render(<ImageSlider images={mockImages} />);

      const canvas = await screen.findByRole("img");

      fireEvent.touchStart(canvas);
      expect(
        mockDragScrollReturn.eventHandlers.onTouchStart
      ).toHaveBeenCalled();

      fireEvent.touchMove(canvas);
      expect(mockDragScrollReturn.eventHandlers.onTouchMove).toHaveBeenCalled();

      fireEvent.touchEnd(canvas);
      expect(mockDragScrollReturn.eventHandlers.onTouchEnd).toHaveBeenCalled();
    });
  });
});
