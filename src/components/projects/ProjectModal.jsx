import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';
import Lightbox from '../Lightbox';
import '../../css/project-modal.css';

function formatDate(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function ProjectModal({ project, onClose }) {
  const [lightboxIndex, setLightboxIndex] = useState(null);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  const hasDateRange = project?.dateRange?.start && project?.dateRange?.end;

  return (
    <div
      className="project-modal-backdrop"
      role="presentation"
      onClick={onClose}
    >
      <div
        className="project-modal"
        role="dialog"
        aria-modal="true"
        aria-label={project.title}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="project-modal__close"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>

        <div className="project-modal__scroll">
          <h2 className="project-modal__title">{project.title}</h2>

          <div className="project-modal__properties">
            {project.field && (
              <div className="project-modal__property">
                <span className="project-modal__property-label">Field</span>
                <span className="project-modal__property-value">
                  <span className="project-tag">{project.field}</span>
                </span>
              </div>
            )}
            {hasDateRange && (
              <div className="project-modal__property">
                <span className="project-modal__property-label">Date</span>
                <span className="project-modal__property-value">
                  {formatDate(project.dateRange.start)} → {formatDate(project.dateRange.end)}
                </span>
              </div>
            )}
            {project?.links?.length > 0 && (
              <div className="project-modal__property">
                <span className="project-modal__property-label">Links</span>
                <span className="project-modal__property-value">
                  {project.links.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {link.text} ↗
                    </a>
                  ))}
                </span>
              </div>
            )}
          </div>

          <hr className="project-modal__divider" />

          <div className="project-modal__body">
            <ReactMarkdown>{project.detailBody || project.bodyText}</ReactMarkdown>
          </div>

          {project?.gallery?.length > 0 && (
            <div className="project-modal__gallery">
              {project.gallery.map((src, i) => (
                <button key={src} type="button" onClick={() => setLightboxIndex(i)}>
                  <img src={src} alt={project.title} />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {lightboxIndex !== null && (
        <Lightbox
          images={project.gallery}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </div>
  );
}

ProjectModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  project: PropTypes.shape({
    title: PropTypes.string.isRequired,
    field: PropTypes.string,
    bodyText: PropTypes.string,
    detailBody: PropTypes.string,
    dateRange: PropTypes.shape({
      start: PropTypes.string,
      end: PropTypes.string,
    }),
    links: PropTypes.arrayOf(PropTypes.shape({
      text: PropTypes.string.isRequired,
      href: PropTypes.string.isRequired,
    })),
    gallery: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
};

export default ProjectModal;
