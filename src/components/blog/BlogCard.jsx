import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function BlogCard({ post }) {
  return (
    <Link to={`/blog/${post.slug}`} className="blog-card">
      <div className="blog-card__media">
        {post.coverImage ? (
          <img src={post.coverImage} alt={post.title} />
        ) : (
          <div className="blog-card__media-placeholder" aria-hidden="true">📝</div>
        )}
      </div>
      <div className="blog-card__body">
        {post.category && <span className="blog-card__category">{post.category}</span>}
        <h3 className="blog-card__title">{post.title}</h3>
        <time className="blog-card__date" dateTime={post.date}>{formatDate(post.date)}</time>
      </div>
    </Link>
  );
}

BlogCard.propTypes = {
  post: PropTypes.shape({
    slug: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    category: PropTypes.string,
    coverImage: PropTypes.string,
  }).isRequired,
};

export default BlogCard;
