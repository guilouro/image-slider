import "./App.css";
import ImageSlider from "./components/ImageSlider";

const images = [
  "http://challenge.publitas.com/images/0.jpg",
  "http://challenge.publitas.com/images/1.jpg",
  "http://challenge.publitas.com/images/2.jpg",
  "http://challenge.publitas.com/images/3.jpg",
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
