import "./App.css";
import ImageSlider from "./components/ImageSlider";

const images = [
  "/images/0.jpg",
  "/images/1.jpg",
  "/images/2.jpg",
  "/images/3.jpg",
];

function App() {
  return (
    <>
      <h1>Image Slider</h1>
      <p>
        This is a draggable image slider. Click and drag to navigate between
        images.
      </p>

      <ImageSlider images={images} />
    </>
  );
}

export default App;
