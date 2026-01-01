import { cloudinaryImage } from "../../app/lib/cloudinary";

export default function ProductGallery({ product, active, setActive }) {
  const images = Array.from(
    new Set([product.imageMain, ...product.imageGallery])
  ).filter(Boolean);

  return (
    <section className="gallery">
      <img
        className="main"
        src={cloudinaryImage(active, "q_auto,f_auto,w_1400/")}
        alt={product.name}
      />

      <div className="thumbs">
        {images.map((pid, i) => (
          <img
            key={i}
            src={cloudinaryImage(pid, "q_auto,f_auto,w_200/")}
            onClick={() => setActive(pid)}
            className={pid === active ? "active" : ""}
          />
        ))}
      </div>
    </section>
  );
}
