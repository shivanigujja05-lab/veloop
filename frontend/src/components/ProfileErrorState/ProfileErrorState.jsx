import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

export const ProfileErrorState = ({ title = 'Unable to Load Profile', message = "We couldn't load your profile information right now.", onRetry }) => {
  return (
    <div
      style={{
        maxWidth: '540px',
        margin: '4rem auto',
        padding: '2.5rem 2rem',
        backgroundColor: '#1e2438',
        border: '1px solid rgba(239, 68, 68, 0.3)',
        borderRadius: '20px',
        textAlign: 'center',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)',
      }}
    >
      <div
        style={{
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          backgroundColor: 'rgba(239, 68, 68, 0.15)',
          color: '#f87171',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.25rem auto',
        }}
      >
        <AlertCircle size={32} />
      </div>

      <h3 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#fff', marginBottom: '0.5rem' }}>
        {title}
      </h3>

      <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.75rem' }}>
        {message}
      </p>

      {onRetry && (
        <button
          onClick={onRetry}
          className="btn btn-primary"
          style={{
            borderRadius: '10px',
            padding: '10px 24px',
            fontWeight: 600,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <RefreshCw size={16} />
          <span>Try Again</span>
        </button>
      )}
    </div>
  );
};

