import GallerySection from "../../../components/gallery/GallerySection";
import { ImageStoreProvider } from "../../store/ImageStore";

export const metadata = {
  title: "Gallery | Electra",
  description:
    "Browse Electra moments and community highlights in the gallery.",
};

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
