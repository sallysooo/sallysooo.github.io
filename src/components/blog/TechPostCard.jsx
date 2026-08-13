import React from 'react';
import PropTypes from 'prop-types';

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function TechPostCard({ post }) {
  return (
    <a
      href={post.link}
      target="_blank"
      rel="noopener noreferrer"
      className="blog-card"
    >
      <div className="blog-card__media">
        {post.thumbnail ? (
          <img src={post.thumbnail} alt={post.title} />
        ) : (
          <div className="blog-card__media-placeholder" aria-hidden="true">📝</div>
        )}
      </div>
      <div className="blog-card__body">
        {post.category && <span className="blog-card__category">{post.category}</span>}
        <h3 className="blog-card__title">{post.title}</h3>
        <time className="blog-card__date" dateTime={post.date}>{formatDate(post.date)}</time>
        {post.excerpt && <p className="blog-card__excerpt">{post.excerpt}</p>}
      </div>
    </a>
  );
}

TechPostCard.propTypes = {
  post: PropTypes.shape({
    link: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    category: PropTypes.string,
    thumbnail: PropTypes.string,
    excerpt: PropTypes.string,
  }).isRequired,
};

export default TechPostCard;
