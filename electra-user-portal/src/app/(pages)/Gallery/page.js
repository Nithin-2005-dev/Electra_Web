import GallerySection from "../../../components/gallery/GallerySection";
import { ImageStoreProvider } from "../../store/ImageStore";

export default function Gallery() {
  return (
    <ImageStoreProvider>
      <main className="min-h-screen bg-black">

        {/* GALLERY GRID */}
        <GallerySection />
      </main>
    </ImageStoreProvider>
  );
}
