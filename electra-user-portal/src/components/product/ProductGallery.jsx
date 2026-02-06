import { useState, useRef, useEffect } from "react";
import { cloudinaryImage } from "../../app/lib/cloudinary";

export default function ProductGallery({ product, active, setActive }) {
  const [isLoading, setIsLoading] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const imageRef = useRef(null);
  
  const images = Array.from(
    new Set([product.imageMain, ...product.imageGallery])
  ).filter(Boolean);

  const currentIndex = images.indexOf(active);
  const minSwipeDistance = 50;

  const handleImageChange = (pid) => {
    if (pid !== active) {
      setIsLoading(true);
      setActive(pid);
    }
  };

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  const goToNext = () => {
    if (currentIndex < images.length - 1) {
      handleImageChange(images[currentIndex + 1]);
    }
  };

  const goToPrevious = () => {
    if (currentIndex > 0) {
      handleImageChange(images[currentIndex - 1]);
    }
  };

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      goToNext();
    } else if (isRightSwipe) {
      goToPrevious();
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") {
        goToPrevious();
      } else if (e.key === "ArrowRight") {
        goToNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, images]);

  return (
    <section className="gallery">
      <div 
        className="main-image-container" 
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        ref={imageRef}
      >
        {isLoading && (
          <div className="loading-overlay">
            <div className="spinner" />
          </div>
        )}
        
        {currentIndex > 0 && (
          <button
            className="nav-arrow nav-arrow-left"
            onClick={goToPrevious}
            aria-label="Previous image"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        )}
        
        <img
          className="main"
          src={cloudinaryImage(active, "q_auto,f_auto,w_1400/")}
          alt={product.name}
          onLoad={handleImageLoad}
          draggable={false}
        />
        
        {currentIndex < images.length - 1 && (
          <button
            className="nav-arrow nav-arrow-right"
            onClick={goToNext}
            aria-label="Next image"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        )}

        <div className="image-counter">
          {currentIndex + 1} / {images.length}
        </div>
      </div>

      <div className="thumbs">
        {images.map((pid, i) => (
          <div 
            key={i}
            className={`thumb-wrapper ${pid === active ? "active" : ""}`}
            onClick={() => handleImageChange(pid)}
          >
            <img
              src={cloudinaryImage(pid, "q_auto,f_auto,w_200/")}
              alt={`${product.name} thumbnail ${i + 1}`}
              draggable={false}
            />
          </div>
        ))}
      </div>

      <style jsx>{`
        .gallery {
          width: 100%;
          background: #000;
        }

        .main-image-container {
          position: relative;
          width: 100%;
          aspect-ratio: 1;
          background: #000;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          touch-action: pan-y pinch-zoom;
        }

        .main {
          width: 100%;
          height: 100%;
          object-fit: contain;
          user-select: none;
          transition: opacity 0.3s ease;
        }

        .loading-overlay {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(0, 0, 0, 0.4);
          z-index: 10;
        }

        .spinner {
          width: 40px;
          height: 40px;
          border: 2px solid rgba(255, 255, 255, 0.2);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .nav-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.9);
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
          z-index: 5;
          color: #000;
        }

        .nav-arrow:hover {
          background: #fff;
          transform: translateY(-50%) scale(1.05);
        }

        .nav-arrow:active {
          transform: translateY(-50%) scale(0.95);
        }

        .nav-arrow-left {
          left: 24px;
        }

        .nav-arrow-right {
          right: 24px;
        }

        .image-counter {
          position: absolute;
          bottom: 32px;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(0, 0, 0, 0.8);
          backdrop-filter: blur(8px);
          color: #fff;
          padding: 8px 20px;
          border-radius: 24px;
          font-size: 14px;
          font-weight: 500;
          letter-spacing: 0.5px;
          z-index: 5;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .thumbs {
          display: flex;
          gap: 12px;
          padding: 24px;
          background: #000;
          overflow-x: auto;
          scrollbar-width: none;
          -ms-overflow-style: none;
        }

        .thumbs::-webkit-scrollbar {
          display: none;
        }

        .thumb-wrapper {
          flex-shrink: 0;
          width: 80px;
          height: 80px;
          border-radius: 8px;
          overflow: hidden;
          cursor: pointer;
          border: 2px solid transparent;
          transition: all 0.2s ease;
          background: #0a0a0a;
        }

        .thumb-wrapper:hover {
          border-color: rgba(255, 255, 255, 0.3);
        }

        .thumb-wrapper.active {
          border-color: #fff;
          box-shadow: 0 0 0 1px #fff;
        }

        .thumb-wrapper img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          user-select: none;
          transition: transform 0.2s ease;
        }

        .thumb-wrapper:hover img {
          transform: scale(1.05);
        }

        @media (max-width: 768px) {
          .nav-arrow {
            width: 40px;
            height: 40px;
          }

          .nav-arrow svg {
            width: 20px;
            height: 20px;
          }

          .nav-arrow-left {
            left: 16px;
          }

          .nav-arrow-right {
            right: 16px;
          }

          .image-counter {
            bottom: 24px;
            font-size: 13px;
            padding: 6px 16px;
          }

          .thumbs {
            gap: 8px;
            padding: 16px;
          }

          .thumb-wrapper {
            width: 72px;
            height: 72px;
          }
        }
      `}</style>
    </section>
  );
}