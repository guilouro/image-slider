import { useCallback, useEffect, useRef, useState } from "react";
import useDragScroll from "../../hooks/use-drag-scroll";
import { drawAllImages, loadImages } from "../../lib/canvas";

type ImageSliderProps = {
  images: string[];
  width?: number;
  height?: number;
};

function ImageSlider({ images, width = 640, height = 400 }: ImageSliderProps) {
  const [imagesLoaded, setImagesLoaded] = useState(0);
  const [loadedImages, setLoadedImages] = useState<HTMLImageElement[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { isDragging, scrollOffset, eventHandlers } = useDragScroll({
    totalWidth: width * images.length,
    containerWidth: width,
  });

  const drawImages = useCallback(() => {
    const canvas = canvasRef.current;
    const canDrawCanvas =
      canvas && loadedImages.length > 0 && imagesLoaded === images.length;

    if (!canDrawCanvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    drawAllImages(ctx, loadedImages, scrollOffset, width, height);
  }, [loadedImages, imagesLoaded, width, height, scrollOffset, images.length]);

  useEffect(() => {
    const loadAllImages = async () => {
      try {
        const imageElements = await loadImages(images);
        console.log("imageElements", imageElements);
        setLoadedImages(imageElements);
        setImagesLoaded(imageElements.length);
      } catch (error) {
        console.error("Error loading images", error);
      }
    };

    loadAllImages();
  }, [images]);

  useEffect(() => {
    drawImages();
  }, [drawImages]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      {...eventHandlers}
      style={{
        border: "1px solid #ccc",
        borderRadius: "4px",
        maxWidth: "100%",
        height: "auto",
        cursor: isDragging ? "grabbing" : "grab",
      }}
    />
  );
}

export default ImageSlider;
