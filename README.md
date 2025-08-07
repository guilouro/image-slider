# Image Slider

A performant, draggable image slider built with React, TypeScript, and HTML5 Canvas. This project demonstrates modern web development practices with a focus on performance, reusability, and adaptable patterns that can be leveraged for other interactive UI components.

https://github.com/user-attachments/assets/a6bee2be-1f7f-4cdc-ba29-d2349da1c64c

## 🚀 Features

- **Smooth Drag & Drop Navigation**: Intuitive touch and mouse interactions for browsing images
- **Canvas-Based Rendering**: High-performance image rendering using HTML5 Canvas
- **TypeScript**: Full type safety and better developer experience
- **Comprehensive Testing**: Unit tests for all components and utilities
- **Modern Build System**: Vite for fast development and optimized production builds

## 🛠 Tech Stack

- **Frontend Framework**: React 19
- **Language**: TypeScript
- **Build Tool**: Vite
- **Testing**: Vitest + Testing Library
- **Linting**: ESLint with TypeScript support
- **Canvas API**: HTML5 Canvas for high-performance rendering

## 📁 Project Structure

```
src/
├── components/
│   ├── ImageSlider/
│   │   ├── index.tsx          # Main slider component
│   │   └── test.tsx           # Component tests
│   └── Loading/
│       └── index.tsx          # Loading spinner component
├── hooks/
│   └── use-drag-scroll/
│       ├── index.ts           # Custom drag scroll hook
│       └── test.ts            # Hook tests
├── lib/
│   └── canvas/
│       ├── index.ts           # Canvas utilities and image handling
│       └── test.ts            # Canvas utility tests
├── App.tsx                    # Main application component
└── main.tsx                   # Application entry point
```

## 🎯 Key Components

### ImageSlider Component

The main component that orchestrates the entire slider functionality. It manages:

- Image loading and state management
- Canvas rendering with smooth animations
- Integration with the drag scroll hook

### useDragScroll Hook

A custom React hook that provides drag-to-scroll functionality for both mouse and touch interactions. Features:

- **Cross-platform support**: Works on desktop and mobile devices
- **Smooth scrolling**: Optimized scroll calculations with boundary constraints
- **Event handling**: Comprehensive mouse and touch event management
- **Type safety**: Full TypeScript support with detailed type definitions

### Canvas Library (`lib/canvas`)

A dedicated utility library for canvas operations and image handling. I chose to place this in `lib/canvas` because:

- **Separation of concerns**: Keeps canvas logic separate from React components
- **Reusability**: Can be easily reused in other projects or components
- **Testability**: Pure functions that are easy to unit test
- **Performance**: Optimized image loading and rendering algorithms

Key functions:

- `loadImages()`: Asynchronously loads multiple images with error handling
- `drawAllImages()`: Renders images on canvas with proper positioning and scaling
- `calculateImageDimensions()`: Calculates optimal image dimensions for centering and scaling

## 🚀 Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- npm

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd image-slider

# Install dependencies
npm install
```

### Development

```bash
# Start development server
npm run dev

# The application will be available at http://localhost:5173
```

### Building for Production

```bash
# Build the project
npm run build

# Preview the production build
npm run preview
```

### Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with UI
npm run test:ui
```

## 🔄 CI/CD

This project uses GitHub Actions for automated testing. The workflow runs on every push to main and:

- Installs dependencies with `npm install`
- Runs tests with `npm test`
- Verifies the build with `npm run build`

## 📦 Using the Built Application

After running `npm run build`, the optimized files will be generated in the `dist/` folder. You can serve these files using any static file server:

### Using a Local Server

```bash
# Navigate to the dist folder
cd dist

# Using Python (if installed)
python -m http.server 8000

# Using nws (install globally first: npm install -g nws)
nws 8000

```

### Deployment

The `dist/` folder contains everything needed to deploy the application:

- Optimized and minified JavaScript bundles
- Static assets
- HTML file ready for production

## 🎨 Usage Example

```tsx
import ImageSlider from "./components/ImageSlider";

const images = [
  "https://example.com/image1.jpg",
  "https://example.com/image2.jpg",
  "https://example.com/image3.jpg",
];

function App() {
  return <ImageSlider images={images} width={640} height={400} />;
}
```

## 📱 Mobile Support

Unlike the original example slider, this implementation includes full mobile support:

- **Touch gestures**: Swipe left/right to navigate between images
- **Responsive design**: Adapts to different screen sizes
- **Performance optimized**: Smooth scrolling on mobile devices
- **Accessibility**: Touch-friendly interaction patterns

## 🔮 Future Improvements

### Performance Enhancements

- **Lazy Loading**: Implement batch loading of images based on viewport visibility
- **Virtual Scrolling**: Only render visible images for better performance with large galleries
- **Image Preloading**: Smart preloading of adjacent images

### User Experience

- **Animation Options**: Multiple drag animation styles (elastic, bounce, smooth)
- **Transition Effects**: Fade, slide, and zoom transitions between images
- **Keyboard Navigation**: Arrow keys and spacebar support
- **Auto-play**: Automatic slideshow with pause on hover

### Technical Improvements

- **Caching Strategy**: Implement image caching for faster subsequent loads
- **Progressive Loading**: Load low-resolution thumbnails first, then high-res images
- **WebP Support**: Automatic format detection and optimization

## 📸 Demo

[Add GIF of the slider in action here]

## 🌐 Live Demo

[Add link to deployed application here]
