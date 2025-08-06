import "./App.css";
import ImageSlider from "./components/ImageSlider";

const images = [
  "https://picsum.photos/800/600?random=1",
  "https://picsum.photos/600/800?random=2",
  "https://picsum.photos/700/700?random=3",
  "https://picsum.photos/900/600?random=4",
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
