import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import PropTypes from 'prop-types';
import { Fade } from 'react-awesome-reveal';
import Header from './Header';
import endpoints from '../constants/endpoints';
import FallbackSpinner from './FallbackSpinner';
import '../css/timeline.css';

function SubActivity({ activity }) {
  return (
    <div className="tl-subitem">
      <div className="tl-subitem__title">
        {activity.link ? (
          <a href={activity.link} target="_blank" rel="noopener noreferrer">
            {activity.title}
          </a>
        ) : activity.title}
      </div>
      {activity.image && (
        <div className="tl-subitem__image">
          <img src={activity.image} alt={activity.title} />
        </div>
      )}
      {activity.images?.length > 0 && (
        <div className="tl-subitem__gallery">
          {activity.images.map((src) => (
            <a key={src} href={src} target="_blank" rel="noopener noreferrer">
              <img src={src} alt={activity.title} />
            </a>
          ))}
        </div>
      )}
      {activity.description?.length > 0 && (
        <ul className="tl-list">
          {activity.description.map((point) => (
            <li key={point}>
              <ReactMarkdown components={{ p: 'span' }}>
                {point}
              </ReactMarkdown>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

SubActivity.propTypes = {
  activity: PropTypes.shape({
    title: PropTypes.string.isRequired,
    link: PropTypes.string,
    image: PropTypes.string,
    images: PropTypes.arrayOf(PropTypes.string),
    description: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
};

function Experience(props) {
  const { header } = props;
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(endpoints.experiences, {
      method: 'GET',
    })
      .then((res) => res.json())
      .then((res) => setData(res.experiences))
      .catch((err) => err);
  }, []);

  return (
    <>
      <Header title={header} />
      {data ? (
        <div className="section-content-container">
          <Fade triggerOnce>
            <div className="tl tl--experience">
              {data.map((item) => (
                <div className="tl-item" key={item.title + item.dateText}>
                  <div className="tl-node--dot" />
                  <div className={`tl-card${item.orgIcon ? ' tl-card--has-icon' : ''}`}>
                    {item.orgIcon && (
                      <div className="tl-card__org-icon">
                        <img src={item.orgIcon} alt={item.subtitle} />
                      </div>
                    )}
                    <div className="tl-date">{item.dateText}</div>
                    <h3 className="tl-title">{item.title}</h3>
                    <div className="tl-subtitle">
                      {item.link ? (
                        <a
                          className="accent"
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {item.subtitle}
                        </a>
                      ) : (
                        <span className="accent">{item.subtitle}</span>
                      )}
                      {item.workType ? ` · ${item.workType}` : ''}
                    </div>

                    {item.subActivities ? (
                      <div className="tl-subitems">
                        {item.subActivities.map((activity) => (
                          <SubActivity key={activity.title} activity={activity} />
                        ))}
                      </div>
                    ) : (
                      <ul className="tl-list">
                        {item.workDescription?.map((point) => (
                          <li key={point}>
                            <ReactMarkdown components={{ p: 'span' }}>
                              {point}
                            </ReactMarkdown>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Fade>
        </div>
      ) : <FallbackSpinner /> }
    </>
  );
}

Experience.propTypes = {
  header: PropTypes.string.isRequired,
};

export default Experience;
