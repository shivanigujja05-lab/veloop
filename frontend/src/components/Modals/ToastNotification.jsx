import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastNotification = ({ message, type = 'success', onClose }) => {
  if (!message) return null;

  const bgStyles = {
    success: 'border-emerald-500/40 bg-[#142922] text-emerald-300',
    error: 'border-rose-500/40 bg-[#2b181a] text-rose-300',
    info: 'border-sky-500/40 bg-[#16253a] text-sky-300',
  };

  const icons = {
    success: <CheckCircle2 size={18} className="text-emerald-400" />,
    error: <AlertCircle size={18} className="text-rose-400" />,
    info: <Info size={18} className="text-sky-400" />,
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 9999,
        minWidth: '280px',
        maxWidth: '420px',
        backgroundColor: '#1e2438',
        border: '1px solid #2e3754',
        borderRadius: '12px',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.4)',
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
        animation: 'fadeIn 0.25s ease',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {icons[type] || icons.success}
        <span style={{ fontSize: '0.875rem', fontWeight: 500, color: '#f8fafc' }}>{message}</span>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#94a3b8',
            cursor: 'pointer',
            padding: '2px',
            display: 'flex',
            alignItems: 'center',
          }}
          aria-label="Close notification"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};

