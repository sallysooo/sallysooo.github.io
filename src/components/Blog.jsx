import React, { useState, useEffect } from 'react';
import { Fade } from 'react-awesome-reveal';
import PropTypes from 'prop-types';
import Header from './Header';
import endpoints from '../constants/endpoints';
import BlogCard from './blog/BlogCard';
import TechPostCard from './blog/TechPostCard';
import FallbackSpinner from './FallbackSpinner';
import '../css/blog.css';

const TABS = ['Blog', 'Tech'];

function Blog(props) {
  const { header } = props;
  const [data, setData] = useState(null);
  const [techData, setTechData] = useState(null);
  const [activeTab, setActiveTab] = useState('Blog');

  useEffect(() => {
    fetch(endpoints.blog, {
      method: 'GET',
    })
      .then((res) => res.json())
      .then((res) => setData(res))
      .catch((err) => err);

    fetch(endpoints.techBlog, {
      method: 'GET',
    })
      .then((res) => res.json())
      .then((res) => setTechData(res))
      .catch((err) => err);
  }, []);

  const sortedPosts = data?.posts
    ?.slice()
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const isLoading = activeTab === 'Blog' ? !data : !techData;

  return (
    <>
      <Header title={header} />
      <div className="section-content-container">
        <div className="blog-tabs">
          {TABS.map((tab) => (
            <button
              key={tab}
              type="button"
              className={`btn-pill ${activeTab === tab ? 'btn-accent' : 'btn-ghost'}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {isLoading ? <FallbackSpinner /> : (
          <Fade triggerOnce>
            <div className="blog-grid">
              {activeTab === 'Blog'
                ? sortedPosts.map((post) => <BlogCard key={post.slug} post={post} />)
                : techData.posts.map((post) => <TechPostCard key={post.link} post={post} />)}
            </div>
          </Fade>
        )}
      </div>
    </>
  );
}

Blog.propTypes = {
  header: PropTypes.string.isRequired,
};

export default Blog;
