import React, { useState, useEffect, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import PropTypes from 'prop-types';
import { Fade } from 'react-awesome-reveal';
import Header from './Header';
import Lightbox from './Lightbox';
import endpoints from '../constants/endpoints';
import FallbackSpinner from './FallbackSpinner';
import '../css/timeline.css';
import '../css/projects.css';
import '../css/publications.css';

function Authors({ authors, self }) {
  return (
    <div className="pub-authors">
      {authors.map((name, i) => (
        <React.Fragment key={name}>
          {self.includes(name) ? <strong>{name}</strong> : name}
          {i < authors.length - 1 && ', '}
        </React.Fragment>
      ))}
    </div>
  );
}

Authors.propTypes = {
  authors: PropTypes.arrayOf(PropTypes.string).isRequired,
  self: PropTypes.arrayOf(PropTypes.string).isRequired,
};

function PublicationCard({ pub, self }) {
  const [showLightbox, setShowLightbox] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyBibtex = () => {
    navigator.clipboard?.writeText(pub.bibtex).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  return (
    <div className={`tl-card pub-card${pub.image ? ' pub-card--has-image' : ''}`}>
      <div className="pub-card__main">
        <h3 className="tl-title pub-title">{pub.title}</h3>
        {pub.titleAlt && <div className="pub-title-alt">{pub.titleAlt}</div>}

        {pub.authors?.length > 0 && <Authors authors={pub.authors} self={self} />}

        <div className="pub-venue">
          <em>{pub.venue}</em>
          {pub.venueDetail && `, ${pub.venueDetail}`}
        </div>

        {pub.highlights?.length > 0 && (
          <div className="pub-highlights">
            {pub.highlights.map((h) => <span key={h} className="pub-highlight">{h}</span>)}
          </div>
        )}

        {pub.tldr && (
          <div className="pub-tldr">
            <span className="pub-tldr__label">TL;DR</span>
            <ReactMarkdown components={{ p: 'span' }}>{pub.tldr}</ReactMarkdown>
          </div>
        )}

        {pub.abstract && (
          <details className="pub-abstract">
            <summary>Abstract</summary>
            <p>{pub.abstract}</p>
          </details>
        )}

        {(pub.links?.length > 0 || pub.bibtex) && (
          <div className="pub-links">
            {pub.links?.map((link) => (
              <a
                key={link.href}
                className="proj-link"
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                {link.text}
                {' '}
                ↗
              </a>
            ))}
            {pub.bibtex && (
              <button type="button" className="proj-link pub-bibtex-btn" onClick={copyBibtex}>
                {copied ? 'Copied ✓' : 'BibTeX'}
              </button>
            )}
          </div>
        )}
      </div>

      {pub.image && (
        <button
          type="button"
          className="pub-card__thumb"
          onClick={() => setShowLightbox(true)}
          aria-label={`Enlarge image for ${pub.title}`}
        >
          <img
            src={pub.image}
            alt={pub.title}
            style={pub.imagePosition ? { objectPosition: pub.imagePosition } : undefined}
          />
        </button>
      )}

      {showLightbox && (
        <Lightbox
          images={[pub.image]}
          initialIndex={0}
          onClose={() => setShowLightbox(false)}
        />
      )}
    </div>
  );
}

PublicationCard.propTypes = {
  self: PropTypes.arrayOf(PropTypes.string).isRequired,
  pub: PropTypes.shape({
    year: PropTypes.number.isRequired,
    type: PropTypes.string.isRequired,
    venue: PropTypes.string.isRequired,
    venueDetail: PropTypes.string,
    title: PropTypes.string.isRequired,
    titleAlt: PropTypes.string,
    authors: PropTypes.arrayOf(PropTypes.string),
    highlights: PropTypes.arrayOf(PropTypes.string),
    tldr: PropTypes.string,
    abstract: PropTypes.string,
    image: PropTypes.string,
    imagePosition: PropTypes.string,
    links: PropTypes.arrayOf(PropTypes.shape({
      text: PropTypes.string.isRequired,
      href: PropTypes.string.isRequired,
    })),
    bibtex: PropTypes.string,
  }).isRequired,
};

function Publications(props) {
  const { header } = props;
  const [data, setData] = useState(null);
  const [activeType, setActiveType] = useState('All');

  useEffect(() => {
    fetch(endpoints.publications, {
      method: 'GET',
    })
      .then((res) => res.json())
      .then((res) => setData(res))
      .catch((err) => err);
  }, []);

  const types = useMemo(() => {
    if (!data?.publications) return ['All'];
    return ['All', ...new Set(data.publications.map((p) => p.type))];
  }, [data]);

  // Newest year first; within a year, keep the order written in the JSON.
  const byYear = useMemo(() => {
    if (!data?.publications) return [];
    const filtered = data.publications.filter(
      (p) => activeType === 'All' || p.type === activeType,
    );
    const years = [...new Set(filtered.map((p) => p.year))].sort((a, b) => b - a);
    return years.map((year) => ({
      year,
      pubs: filtered.filter((p) => p.year === year),
    }));
  }, [data, activeType]);

  return (
    <>
      <Header title={header} />
      {data ? (
        <div className="section-content-container">
          {types.length > 2 && (
            <div className="projects-filter">
              {types.map((type) => (
                <button
                  key={type}
                  type="button"
                  className={`btn-pill ${activeType === type ? 'btn-accent' : 'btn-ghost'}`}
                  onClick={() => setActiveType(type)}
                >
                  {type}
                </button>
              ))}
            </div>
          )}

          <Fade triggerOnce>
            <div className="tl tl--publications">
              {byYear.map(({ year, pubs }) => (
                <React.Fragment key={year}>
                  <div className="tl-item pub-year">
                    <div className="tl-node--dot" />
                    <div className="tl-date pub-year__label">{year}</div>
                  </div>
                  {pubs.map((pub) => (
                    <div className="tl-item" key={pub.title}>
                      <PublicationCard pub={pub} self={data.self || []} />
                    </div>
                  ))}
                </React.Fragment>
              ))}
            </div>
          </Fade>
        </div>
      ) : <FallbackSpinner />}
    </>
  );
}

Publications.propTypes = {
  header: PropTypes.string.isRequired,
};

export default Publications;
