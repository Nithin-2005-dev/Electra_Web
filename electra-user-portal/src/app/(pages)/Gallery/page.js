import GallerySectionOne from "../../../components/GallaryImages";
import MainGallerySlider from "../../../components/GallerySlider";
import { ImageStoreProvider } from "../../store/ImageStore";
export default function Gallery() {
  return (
    <ImageStoreProvider>
      <main className="min-h-screen">
        <MainGallerySlider/>
        <GallerySectionOne/>
      </main>
    </ImageStoreProvider>
  );
}
