import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function BlogListPage({ siteData }) {
  const { pages = [] } = siteData || {};
  const blogs = pages.filter(p => p.type === 'blog' || p.id.startsWith('blog-'));

  return (
    <div className="content-page-container">
      <h1>Latest Rummy & Teen Patti Blogs</h1>
      {blogs.length > 0 ? (
        <div style={{ display: 'grid', gap: '20px', marginTop: '20px' }}>
          {blogs.map(blog => (
            <article 
              key={blog.id} 
              style={{
                border: '1px solid #eee',
                borderRadius: '8px',
                padding: '15px',
                background: '#fafafa',
                display: 'flex',
                gap: '15px',
                alignItems: 'center'
              }}
            >
              {blog.cover_image && (
                <img 
                  src={blog.cover_image} 
                  alt={blog.title} 
                  style={{ width: '90px', height: '70px', objectFit: 'cover', borderRadius: '6px' }}
                />
              )}
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '17px', color: '#1b0058', marginBottom: '6px' }}>{blog.title}</h3>
                <p style={{ fontSize: '13px', color: '#666', marginBottom: '8px', lineClamp: 2 }}>
                  {blog.content ? blog.content.slice(0, 110) + '...' : ''}
                </p>
                <Link to={`/page/${blog.slug}`} style={{ color: '#e60009', fontWeight: 'bold', fontSize: '13px' }}>
                  Read More →
                </Link>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <p style={{ color: '#666', marginTop: '20px' }}>No blog articles posted yet.</p>
      )}
      <div style={{ marginTop: '30px' }}>
        <Link to="/" style={{ color: '#e60009', fontWeight: 'bold' }}>← Back to Home</Link>
      </div>
    </div>
  );
}
