import React, { useState, useEffect } from 'react';
import { Fade } from 'react-awesome-reveal';
import PropTypes from 'prop-types';
import Header from './Header';
import endpoints from '../constants/endpoints';
import BlogCard from './blog/BlogCard';
import FallbackSpinner from './FallbackSpinner';
import '../css/blog.css';

function Blog(props) {
  const { header } = props;
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(endpoints.blog, {
      method: 'GET',
    })
      .then((res) => res.json())
      .then((res) => setData(res))
      .catch((err) => err);
  }, []);

  const sortedPosts = data?.posts
    ?.slice()
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <>
      <Header title={header} />
      {data ? (
        <div className="section-content-container">
          <Fade triggerOnce>
            <div className="blog-grid">
              {sortedPosts.map((post) => (
                <BlogCard key={post.slug} post={post} />
              ))}
            </div>
          </Fade>
        </div>
      ) : <FallbackSpinner />}
    </>
  );
}

Blog.propTypes = {
  header: PropTypes.string.isRequired,
};

export default Blog;
