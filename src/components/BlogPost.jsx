import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import endpoints from '../constants/endpoints';
import FallbackSpinner from './FallbackSpinner';
import '../css/blog.css';

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function BlogPost() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [body, setBody] = useState(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let ignore = false;
    setPost(null);
    setBody(null);
    setNotFound(false);

    async function load() {
      try {
        const res = await fetch(endpoints.blog);
        const listData = await res.json();
        const match = listData.posts.find((p) => p.slug === slug);
        if (!match) {
          if (!ignore) setNotFound(true);
          return;
        }
        const bodyRes = await fetch(match.contentFile);
        const text = await bodyRes.text();
        if (!ignore) {
          setPost(match);
          setBody(text);
        }
      } catch (err) {
        if (!ignore) setNotFound(true);
      }
    }

    load();

    return () => {
      ignore = true;
    };
  }, [slug]);

  if (notFound) {
    return (
      <div className="section-content-container">
        <p className="blog-post__not-found">Post not found.</p>
        <div className="blog-post__back">
          <Link className="btn-pill btn-ghost" to="/blog">← Back to blog</Link>
        </div>
      </div>
    );
  }

  if (!post || body === null) return <FallbackSpinner />;

  return (
    <article className="blog-post">
      <div className="blog-post__header">
        {post.category && <span className="blog-card__category">{post.category}</span>}
        <h1 className="blog-post__title">{post.title}</h1>
        <time className="blog-post__date" dateTime={post.date}>{formatDate(post.date)}</time>
      </div>

      {post.coverImage && (
        <div className="blog-post__hero">
          <img src={post.coverImage} alt={post.title} />
        </div>
      )}

      <div className="section-content-container">
        <div className="blog-post__body">
          <ReactMarkdown>{body}</ReactMarkdown>
        </div>
        <div className="blog-post__back">
          <Link className="btn-pill btn-ghost" to="/blog">← Back to blog</Link>
        </div>
      </div>
    </article>
  );
}

export default BlogPost;
