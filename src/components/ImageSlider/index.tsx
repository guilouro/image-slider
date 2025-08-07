import { useCallback, useEffect, useRef, useState } from "react";
import useDragScroll from "../../hooks/use-drag-scroll";
import { drawAllImages, loadImages } from "../../lib/canvas";
import Loading from "../Loading";

type ImageSliderProps = {
  images: string[];
  width?: number;
  height?: number;
};

function ImageSlider({ images, width = 640, height = 400 }: ImageSliderProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [imagesLoaded, setImagesLoaded] = useState(0);
  const [loadedImages, setLoadedImages] = useState<HTMLImageElement[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);

  const { isDragging, scrollOffset, eventHandlers } = useDragScroll({
    totalWidth: width * images.length,
    containerWidth: width,
  });

  const renderImages = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    animationFrameRef.current = requestAnimationFrame(() => {
      const canvas = canvasRef.current;
      const canRenderCanvas =
        canvas && loadedImages?.length > 0 && imagesLoaded === images.length;

      if (!canRenderCanvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      drawAllImages(ctx, loadedImages, scrollOffset, width, height);
    });
  }, [loadedImages, imagesLoaded, width, height, scrollOffset, images.length]);

  useEffect(() => {
    const loadAllImages = async () => {
      try {
        const imageElements = await loadImages(images);
        setLoadedImages(imageElements);
        setImagesLoaded(imageElements?.length || 0);
      } catch (error) {
        console.error("Error loading images", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAllImages();
  }, [images]);

  useEffect(() => {
    renderImages();
  }, [renderImages]);

  return (
    <div className="slider-container">
      {isLoading && <Loading />}
      <canvas
        className="slider"
        ref={canvasRef}
        width={width}
        height={height}
        role="img"
        aria-label="Image slider gallery"
        aria-roledescription="Draggable image slider"
        aria-valuemin={0}
        aria-valuemax={images.length - 1}
        aria-valuenow={Math.round(scrollOffset / width)} // Current image index
        style={{ cursor: isDragging ? "grabbing" : "grab" }}
        {...eventHandlers}
      />
    </div>
  );
}

export default ImageSlider;
