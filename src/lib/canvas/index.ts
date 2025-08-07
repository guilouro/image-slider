type ImageDimensions = {
  /** The image element to calculate dimensions for */
  image: HTMLImageElement;
  /** Width of the container */
  width: number;
  /** Height of the container */
  height: number;
};

/**
 * Calculates the dimensions and position to draw an image centered and scaled in a container
 */
export function calculateImageDimensions({
  image,
  width,
  height,
}: ImageDimensions) {
  const canvasAspect = width / height;
  const imageAspect = image.width / image.height;

  let drawWidth: number, drawHeight: number, offsetX: number, offsetY: number;

  // We need to calculate the dimensions and position to draw the image centered and scaled
  // in the container. If the image aspect ratio is wider than the canvas (imageAspect > canvasAspect),
  // we fit to width. If the image is taller (imageAspect < canvasAspect), we fit to height.
  // This ensures the image fills the container while maintaining aspect ratio.
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

  return { drawWidth, drawHeight, offsetX, offsetY };
}

/**
 * Draws multiple images on a canvas with horizontal scrolling
 */
export function drawAllImages(
  /** The 2D rendering context to draw on */
  canvasContext: CanvasRenderingContext2D,
  /** Array of images to draw */
  images: HTMLImageElement[],
  /** Horizontal scroll offset for positioning images */
  scrollOffset: number,
  /** Width of the canvas */
  width: number,
  /** Height of the canvas */
  height: number
) {
  canvasContext.clearRect(0, 0, width, height);

  images.forEach((image, index) => {
    const x = index * width - scrollOffset;
    const isImageVisible = x + width > 0 && x < width;

    if (isImageVisible) {
      const dimensions = calculateImageDimensions({ image, width, height });

      canvasContext.drawImage(
        image,
        x + dimensions.offsetX,
        dimensions.offsetY,
        dimensions.drawWidth,
        dimensions.drawHeight
      );
    }
  });
}

/**
 * Loads an array of images from their URLs asynchronously
 * @throws Error if any image fails to load
 */
export async function loadImages(
  imagesUrls: string[]
): Promise<HTMLImageElement[]> {
  const imageElements: HTMLImageElement[] = [];

  const loadPromises = imagesUrls.map(
    (url, idx) =>
      new Promise((resolve, reject) => {
        imageElements[idx] = new Image();
        imageElements[idx].src = url;
        imageElements[idx].onerror = reject;
        imageElements[idx].onload = () => {
          resolve(imageElements[idx]);
        };
      })
  );

  await Promise.all(loadPromises);
  return imageElements;
}
