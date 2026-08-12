import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import '../css/lightbox.css';

function Lightbox({ images, initialIndex = 0, onClose }) {
  const [index, setIndex] = useState(initialIndex);

  const next = () => setIndex((i) => (i + 1) % images.length);
  const prev = () => setIndex((i) => (i - 1 + images.length) % images.length);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onClose]);

  return (
    <div
      className="lightbox-backdrop"
      role="presentation"
      onClick={(e) => { e.stopPropagation(); onClose(); }}
    >
      <button type="button" className="lightbox-close" onClick={onClose} aria-label="Close">
        ×
      </button>

      {images.length > 1 && (
        <button
          type="button"
          className="lightbox-nav lightbox-nav--prev"
          onClick={(e) => { e.stopPropagation(); prev(); }}
          aria-label="Previous image"
        >
          ‹
        </button>
      )}

      <img
        className="lightbox-image"
        src={images[index]}
        alt=""
        onClick={(e) => e.stopPropagation()}
      />

      {images.length > 1 && (
        <button
          type="button"
          className="lightbox-nav lightbox-nav--next"
          onClick={(e) => { e.stopPropagation(); next(); }}
          aria-label="Next image"
        >
          ›
        </button>
      )}

      {images.length > 1 && (
        <div className="lightbox-counter">{index + 1} / {images.length}</div>
      )}
    </div>
  );
}

Lightbox.propTypes = {
  images: PropTypes.arrayOf(PropTypes.string).isRequired,
  initialIndex: PropTypes.number,
  onClose: PropTypes.func.isRequired,
};

export default Lightbox;
