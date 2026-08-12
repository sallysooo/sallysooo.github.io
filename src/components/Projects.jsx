import React, { useState, useEffect, useMemo } from 'react';
import { Fade } from 'react-awesome-reveal';
import PropTypes from 'prop-types';
import Header from './Header';
import endpoints from '../constants/endpoints';
import ProjectCard from './projects/ProjectCard';
import ProjectModal from './projects/ProjectModal';
import FallbackSpinner from './FallbackSpinner';
import '../css/projects.css';

const Projects = (props) => {
  const { header } = props;
  const [data, setData] = useState(null);
  const [showMore, setShowMore] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeProject, setActiveProject] = useState(null);

  useEffect(() => {
    fetch(endpoints.projects, {
      method: 'GET',
    })
      .then((res) => res.json())
      .then((res) => setData(res))
      .catch((err) => err);
  }, []);

  const categories = useMemo(() => {
    if (!data?.projects) return ['All'];
    const unique = [...new Set(data.projects.map((p) => p.category).filter(Boolean))];
    return ['All', ...unique];
  }, [data]);

  const filteredProjects = useMemo(() => {
    if (!data?.projects) return [];
    if (activeCategory === 'All') return data.projects;
    return data.projects.filter((p) => p.category === activeCategory);
  }, [data, activeCategory]);

  const numberOfItems = showMore ? filteredProjects.length : 6;

  return (
    <>
      <Header title={header} />
      {data ? (
        <div className="section-content-container">
          {categories.length > 2 && (
            <div className="projects-filter">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  className={`btn-pill ${
                    activeCategory === category ? 'btn-accent' : 'btn-ghost'
                  }`}
                  onClick={() => {
                    setActiveCategory(category);
                    setShowMore(false);
                  }}
                >
                  {category}
                </button>
              ))}
            </div>
          )}

          <Fade triggerOnce>
            <div className="bento">
              {filteredProjects.slice(0, numberOfItems).map((project, index) => (
                <ProjectCard
                  key={project.title}
                  project={project}
                  featured={index === 0}
                  onOpen={setActiveProject}
                />
              ))}
            </div>
          </Fade>

          {!showMore && filteredProjects.length > numberOfItems && (
            <div className="projects-more">
              <button
                type="button"
                className="btn-pill btn-ghost"
                onClick={() => setShowMore(true)}
              >
                Show more
              </button>
            </div>
          )}
        </div>
      ) : <FallbackSpinner /> }
      {activeProject && (
        <ProjectModal project={activeProject} onClose={() => setActiveProject(null)} />
      )}
    </>
  );
};

Projects.propTypes = {
  header: PropTypes.string.isRequired,
};

export default Projects;
