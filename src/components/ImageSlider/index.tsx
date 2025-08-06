import { useCallback, useEffect, useRef, useState } from "react";
import useDragScroll from "../../hooks/use-drag-scroll";

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

  useEffect(() => {
    const loadImages = async () => {
      const imageElements: HTMLImageElement[] = [];
      let loadedCount = 0;

      const onImageLoad = () => {
        loadedCount++;
        if (loadedCount === images.length) {
          setImagesLoaded(loadedCount);
        }
      };

      images.forEach((src) => {
        const img = new Image();
        img.onload = onImageLoad;
        img.src = src;
        imageElements.push(img);
      });

      setLoadedImages(imageElements);
    };

    loadImages();
  }, [images]);

  const drawImages = useCallback(() => {
    const canvas = canvasRef.current;
    const canDrawCanvas =
      canvas && loadedImages.length > 0 && imagesLoaded === images.length;

    if (!canDrawCanvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw each image
    loadedImages.forEach((image, index) => {
      const x = index * width - scrollOffset;

      if (x + width > 0 && x < width) {
        const canvasAspect = width / height;
        const imageAspect = image.width / image.height;

        let drawWidth, drawHeight, offsetX, offsetY;

        if (imageAspect > canvasAspect) {
          drawWidth = width;
          drawHeight = width / imageAspect;
          offsetX = 0;
          offsetY = (height - drawHeight) / 2;
        } else {
          drawHeight = height;
          drawWidth = height * imageAspect;
          offsetX = (width - drawWidth) / 2;
          offsetY = 0;
        }

        ctx.drawImage(image, x + offsetX, offsetY, drawWidth, drawHeight);
      }
    });
  }, [loadedImages, imagesLoaded, width, height, scrollOffset, images.length]);

  useEffect(() => {
    drawImages();
  }, [drawImages]);

  return (
    <div>
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
    </div>
  );
}

export default ImageSlider;
