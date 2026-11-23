import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';

export default function ContentPage() {
  const { slug } = useParams();
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    api.getPageBySlug(slug)
      .then(data => {
        setPage(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message || 'Page not found');
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <div style={{ padding: '60px 20px', textAlign: 'center' }}>
        <p>Loading page...</p>
      </div>
    );
  }

  if (error || !page) {
    return (
      <div className="content-page-container" style={{ textAlign: 'center', padding: '60px 20px' }}>
        <h1>Page Not Found</h1>
        <p>The requested page could not be found.</p>
        <div style={{ marginTop: '20px' }}>
          <Link to="/" className="featured-btn">Return to Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="content-page-container">
      <h1>{page.title}</h1>
      {page.cover_image && (
        <img 
          src={page.cover_image} 
          alt={page.title} 
          className="content-page-cover"
        />
      )}
      <div className="content-page-body">
        {page.content}
      </div>
      <div style={{ marginTop: '30px' }}>
        <Link to="/" style={{ color: '#e60009', fontWeight: 'bold' }}>
          ← Back to All Apps
        </Link>
      </div>
    </div>
  );
}
