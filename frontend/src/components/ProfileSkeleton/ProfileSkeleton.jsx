import React from 'react';

export const ProfileSkeleton = () => {
  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '1.5rem 1rem' }}>
      {/* Hero Skeleton */}
      <div
        className="skeleton-shimmer"
        style={{
          height: '180px',
          borderRadius: '20px',
          marginBottom: '2rem',
        }}
      />

      {/* Rewards Grid Skeleton */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="skeleton-shimmer"
            style={{
              height: '130px',
              borderRadius: '16px',
            }}
          />
        ))}
      </div>

      {/* Level Progress Skeleton */}
      <div
        className="skeleton-shimmer"
        style={{
          height: '200px',
          borderRadius: '20px',
          marginBottom: '2rem',
        }}
      />

      {/* Withdrawal Skeleton */}
      <div
        className="skeleton-shimmer"
        style={{
          height: '240px',
          borderRadius: '20px',
          marginBottom: '2rem',
        }}
      />

      {/* Referral & Activity Skeletons */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        <div className="skeleton-shimmer" style={{ height: '220px', borderRadius: '20px' }} />
        <div className="skeleton-shimmer" style={{ height: '220px', borderRadius: '20px' }} />
      </div>
    </div>
  );
};

