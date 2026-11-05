export const formatNumber = (num) => {
  if (num === undefined || num === null) return '0';
  return Number(num).toLocaleString('en-IN');
};

export const formatCurrency = (amount, symbol = '₹') => {
  if (amount === undefined || amount === null) return `${symbol}0`;
  return `${symbol}${Number(amount).toLocaleString('en-IN')}`;
};

export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export const formatDateTime = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const getInitials = (name = '') => {
  if (!name) return 'VL';
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};
