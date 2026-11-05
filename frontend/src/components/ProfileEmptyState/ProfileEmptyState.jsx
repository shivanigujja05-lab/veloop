import React from 'react';
import { Inbox, ArrowRight } from 'lucide-react';

export const ProfileEmptyState = ({ title, message, actionText, onAction, icon: CustomIcon }) => {
  const IconComponent = CustomIcon || Inbox;

  return (
    <div
      style={{
        padding: '2.5rem 1.5rem',
        textAlign: 'center',
        backgroundColor: 'rgba(18, 21, 35, 0.7)',
        border: '1px dashed var(--veloop-surface-border)',
        borderRadius: '16px',
        margin: '1rem 0',
      }}
    >
      <div
        style={{
          width: '54px',
          height: '54px',
          borderRadius: '50%',
          backgroundColor: 'rgba(56, 189, 248, 0.1)',
          color: '#38bdf8',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1rem auto',
        }}
      >
        <IconComponent size={26} />
      </div>

      <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginBottom: '0.4rem' }}>
        {title}
      </h4>

      <p style={{ color: '#94a3b8', fontSize: '0.875rem', maxWidth: '400px', margin: '0 auto 1.25rem auto' }}>
        {message}
      </p>

      {actionText && onAction && (
        <button
          onClick={onAction}
          className="btn btn-outline-light btn-sm"
          style={{
            borderRadius: '8px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <span>{actionText}</span>
          <ArrowRight size={14} />
        </button>
      )}
    </div>
  );
};

