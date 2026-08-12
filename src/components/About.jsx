import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import PropTypes from 'prop-types';
import { Fade } from 'react-awesome-reveal';
import Header from './Header';
import endpoints from '../constants/endpoints';
import FallbackSpinner from './FallbackSpinner';
import '../css/about.css';
import '../css/timeline.css';

function About(props) {
  const { header } = props;
  const [about, setAbout] = useState(null);
  const [skills, setSkills] = useState(null);
  const [education, setEducation] = useState(null);

  useEffect(() => {
    fetch(endpoints.about).then((res) => res.json()).then(setAbout).catch((err) => err);
    fetch(endpoints.skills).then((res) => res.json()).then(setSkills).catch((err) => err);
    fetch(endpoints.education).then((res) => res.json()).then(setEducation).catch((err) => err);
  }, []);

  return (
    <>
      <Header title={header} />
      <div className="section-content-container">
        {about ? (
          <Fade triggerOnce>
            <div className="bento">
              <div className="tile about-bio-tile span-4 rspan-2">
                <ReactMarkdown>{about.about}</ReactMarkdown>
              </div>
              {about?.imageSource && (
                <div className="tile about-image-tile span-2 rspan-2">
                  <img src={about.imageSource} alt="profile" />
                </div>
              )}
            </div>

            {skills && (
              <div className="tile about-section-tile">
                <h2 className="about-section-title">Skills</h2>
                {skills.intro && (
                  <div className="about-section-intro">
                    <ReactMarkdown>{skills.intro}</ReactMarkdown>
                  </div>
                )}
                <div className="skills-columns">
                  <div className="skills-column">
                    {skills.skills?.map((category) => (
                      <div key={category.title} className="skill-row">
                        <h3 className="skill-category-title">{category.title}</h3>
                        <div className="skill-grid">
                          {category.items.map((item) => (
                            <div key={item.title} className="skill-item">
                              <img src={item.icon} alt={item.title} />
                              <span>{item.title}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  {skills.languages?.length > 0 && (
                    <div className="skills-column">
                      <h3 className="skill-category-title">Languages</h3>
                      <div className="language-grid">
                        {skills.languages.map((lang) => (
                          <div key={lang.label} className="language-item">
                            <span className="language-flag" aria-hidden="true">{lang.flag}</span>
                            <span>{lang.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {education?.education?.length > 0 && (
              <div className="about-section">
                <h2 className="about-section-title">Education</h2>
                <div className="tl tl--education">
                  {education.education.map((item) => (
                    <div className="tl-item" key={item.cardTitle + item.title}>
                      <div className="tl-node--icon">
                        {item.icon ? (
                          <img src={item.icon.src} alt={item.icon.alt} />
                        ) : <span className="tl-node--icon-fallback">🎓</span>}
                      </div>
                      <div className={`tl-card${item.orgIcon ? ' tl-card--has-icon' : ''}`}>
                        {item.orgIcon && (
                          <div className="tl-card__org-icon">
                            <img
                              src={item.orgIcon}
                              alt={item.cardSubtitle}
                              style={item.orgIconHeight ? { height: item.orgIconHeight } : undefined}
                            />
                          </div>
                        )}
                        <div className="tl-date">{item.title}</div>
                        <h3 className="tl-title">{item.cardTitle}</h3>
                        <div className="tl-subtitle">
                          <span className="accent">{item.cardSubtitle}</span>
                        </div>
                        {item.cardDetailedText && (
                          <div className="tl-detail">{item.cardDetailedText}</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Fade>
        ) : <FallbackSpinner />}
      </div>
    </>
  );
}

About.propTypes = {
  header: PropTypes.string.isRequired,
};

export default About;
