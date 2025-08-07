import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { calculateImageDimensions, drawAllImages, loadImages } from ".";

describe("calculateImageDimensions", () => {
  it("should calculate dimensions for a wide image (fit to width)", () => {
    const mockImage = {
      width: 800,
      height: 400,
    } as HTMLImageElement;

    const result = calculateImageDimensions({
      image: mockImage,
      width: 600,
      height: 400,
    });

    expect(result.drawWidth).toBe(600);
    expect(result.drawHeight).toBe(300);
    expect(result.offsetX).toBe(0);
    expect(result.offsetY).toBe(50);
  });

  it("should calculate dimensions for a tall image (fit to height)", () => {
    const mockImage = {
      width: 400,
      height: 800,
    } as HTMLImageElement;

    const result = calculateImageDimensions({
      image: mockImage,
      width: 600,
      height: 400,
    });

    expect(result.drawWidth).toBe(200);
    expect(result.drawHeight).toBe(400);
    expect(result.offsetX).toBe(200);
    expect(result.offsetY).toBe(0);
  });
});

describe("drawAllImages", () => {
  let mockContext: CanvasRenderingContext2D;

  beforeEach(() => {
    mockContext = {
      clearRect: vi.fn(),
      drawImage: vi.fn(),
      fillStyle: "",
      fillRect: vi.fn(),
    } as unknown as CanvasRenderingContext2D;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should clear canvas", () => {
    const mockImages = [
      { width: 400, height: 300 } as HTMLImageElement,
      { width: 400, height: 300 } as HTMLImageElement,
    ];

    drawAllImages(mockContext, mockImages, 0, 600, 400);

    expect(mockContext.clearRect).toHaveBeenCalledWith(0, 0, 600, 400);
  });

  it("should only draw images that are visible in viewport", () => {
    const mockImages = [
      { width: 400, height: 300 } as HTMLImageElement,
      { width: 400, height: 300 } as HTMLImageElement,
      { width: 400, height: 300 } as HTMLImageElement,
    ];

    drawAllImages(mockContext, mockImages, 700, 600, 400);

    expect(mockContext.drawImage).toHaveBeenCalledTimes(2); // only the first two images are visible
  });

  it("should handle scroll offset that hides all images", () => {
    const mockImages = [{ width: 400, height: 300 } as HTMLImageElement];

    drawAllImages(mockContext, mockImages, 1000, 600, 400);

    expect(mockContext.drawImage).not.toHaveBeenCalled();
  });
});

describe("loadImages", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should load multiple images successfully", async () => {
    const originalImage = global.Image;
    global.Image = vi.fn().mockImplementation(() => {
      const img = {
        src: "",
        onload: null as (() => void) | null,
        onerror: null as ((error: Error) => void) | null,
      };

      setTimeout(() => {
        if (img.onload) img.onload();
      }, 0);

      return img as unknown as HTMLImageElement;
    });

    const imageUrls = ["image1.jpg", "image2.jpg"];
    const result = await loadImages(imageUrls);

    expect(result).toHaveLength(2);

    global.Image = originalImage;
  });

  it("should throw error when image fails to load", async () => {
    const originalImage = global.Image;
    global.Image = vi.fn().mockImplementation(() => {
      const img = {
        src: "",
        onload: null as (() => void) | null,
        onerror: null as ((error: Error) => void) | null,
      };

      setTimeout(() => {
        if (img.onerror) img.onerror(new Error("Failed to load image"));
      }, 0);

      return img as unknown as HTMLImageElement;
    });

    const imageUrls = ["invalid-image.jpg"];

    await expect(loadImages(imageUrls)).rejects.toThrow("Failed to load image");

    global.Image = originalImage;
  });
});
