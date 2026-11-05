import React, { useState } from 'react';
import { X, Check, Loader2 } from 'lucide-react';
import { profileService } from '../../services/profileService';

export const EditProfileModal = ({ profile, onClose, onSuccess }) => {
  const [name, setName] = useState(profile?.displayName || '');
  const [profileImage, setProfileImage] = useState(profile?.profileImage || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || name.trim().length < 2) {
      setError('Display name must be at least 2 characters');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const res = await profileService.updateProfile({
        name: name.trim(),
        profileImage: profileImage.trim(),
      });
      if (res.success) {
        onSuccess(res.profile);
      }
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(10, 12, 22, 0.8)',
        backdropFilter: 'blur(4px)',
        zIndex: 1050,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
      }}
    >
      <div
        style={{
          backgroundColor: '#1e2438',
          border: '1px solid #2e3754',
          borderRadius: '16px',
          width: '100%',
          maxWidth: '480px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)',
          overflow: 'hidden',
          animation: 'fadeIn 0.2s ease',
        }}
      >
        <div
          style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid #2e3754',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#fff', margin: 0 }}>
            Edit Profile Settings
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer',
              padding: '4px',
            }}
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '1.5rem' }}>
          {error && (
            <div
              style={{
                backgroundColor: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#f87171',
                padding: '0.75rem',
                borderRadius: '8px',
                marginBottom: '1rem',
                fontSize: '0.85rem',
              }}
            >
              {error}
            </div>
          )}

          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
              Display Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="form-control"
              style={{
                backgroundColor: '#161927',
                border: '1px solid #2e3754',
                color: '#fff',
                borderRadius: '8px',
                padding: '0.6rem 0.85rem',
              }}
              required
            />
          </div>

          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
              Avatar Image URL (Optional)
            </label>
            <input
              type="url"
              value={profileImage}
              onChange={(e) => setProfileImage(e.target.value)}
              placeholder="https://example.com/avatar.jpg"
              className="form-control"
              style={{
                backgroundColor: '#161927',
                border: '1px solid #2e3754',
                color: '#fff',
                borderRadius: '8px',
                padding: '0.6rem 0.85rem',
              }}
            />
            <small style={{ color: '#64748b', fontSize: '0.75rem', marginTop: '4px', display: 'block' }}>
              Leave blank to keep your initials fallback avatar badge.
            </small>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button
              type="button"
              onClick={onClose}
              className="btn btn-outline-secondary"
              style={{ borderRadius: '8px' }}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              style={{
                borderRadius: '8px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: '#2563eb',
              }}
              disabled={loading}
            >
              {loading ? <Loader2 size={16} className="spinner-border spinner-border-sm" /> : <Check size={16} />}
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

