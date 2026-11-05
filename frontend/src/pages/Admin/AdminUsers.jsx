import React, { useState, useEffect } from 'react';
import { Search, Filter, Eye, RefreshCw, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { adminService } from '../../services/adminService';
import { formatNumber, formatDate } from '../../utils/formatters';
import { AdminUserDetail } from './AdminUserDetail';
import styles from './Admin.module.css';

export const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [selectedUserId, setSelectedUserId] = useState(null);

  const fetchUsers = async (page = 1) => {
    try {
      setLoading(true);
      const res = await adminService.getUsers(page, 10, search, status);
      if (res.success) {
        setUsers(res.users);
        setPagination(res.pagination);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(1);
  }, [status]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchUsers(1);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff', margin: 0 }}>
            User Management
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: '4px 0 0 0' }}>
            Inspect members, adjust balances, and enforce security policies
          </p>
        </div>

        <button
          onClick={() => fetchUsers(pagination.page)}
          className="btn btn-sm btn-outline-secondary"
          style={{ borderRadius: '8px' }}
        >
          <RefreshCw size={14} />
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className={styles.tableCard} style={{ marginTop: 0 }}>
        <form onSubmit={handleSearchSubmit} className={styles.filterBar}>
          <div style={{ display: 'flex', gap: '8px', flex: 1, minWidth: '240px' }}>
            <input
              type="text"
              placeholder="Search by name, email, user ID, or referral code..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="form-control form-control-sm"
              style={{ backgroundColor: '#10131e', color: '#fff', borderColor: '#283048', borderRadius: '8px' }}
            />
            <button type="submit" className="btn btn-sm btn-primary" style={{ borderRadius: '8px' }}>
              <Search size={14} />
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Status:</span>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="form-select form-select-sm"
              style={{ backgroundColor: '#10131e', color: '#fff', borderColor: '#283048', borderRadius: '8px', width: 'auto' }}
            >
              <option value="ALL">All Statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="SUSPENDED">Suspended</option>
            </select>
          </div>
        </form>

        {/* Users Table */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <Loader2 size={30} className="spinner-border text-primary" />
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="table table-dark table-hover mb-0" style={{ fontSize: '0.85rem' }}>
              <thead>
                <tr>
                  <th>User ID</th>
                  <th>Member Name</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>VEs</th>
                  <th>SVEs</th>
                  <th>Gems</th>
                  <th>XP</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td style={{ fontFamily: 'var(--veloop-font-mono)', fontWeight: 600 }}>{u.userId}</td>
                    <td>{u.name}</td>
                    <td style={{ color: '#94a3b8' }}>{u.email}</td>
                    <td>
                      <span
                        className={
                          u.accountStatus === 'ACTIVE' ? 'status-badge-active' : 'status-badge-rejected'
                        }
                      >
                        {u.accountStatus}
                      </span>
                    </td>
                    <td style={{ color: '#f59e0b', fontWeight: 700, fontFamily: 'var(--veloop-font-mono)' }}>
                      {formatNumber(u.balances?.ves)}
                    </td>
                    <td style={{ color: '#cbd5e1', fontFamily: 'var(--veloop-font-mono)' }}>
                      {formatNumber(u.balances?.sves)}
                    </td>
                    <td style={{ color: '#ec4899', fontFamily: 'var(--veloop-font-mono)' }}>
                      {formatNumber(u.balances?.gems)}
                    </td>
                    <td style={{ color: '#38bdf8', fontFamily: 'var(--veloop-font-mono)' }}>
                      {formatNumber(u.balances?.xp)}
                    </td>
                    <td>
                      <button
                        onClick={() => setSelectedUserId(u.id)}
                        className="btn btn-sm btn-outline-info"
                        style={{ borderRadius: '6px', padding: '2px 8px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                      >
                        <Eye size={12} />
                        <span>Inspect</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.25rem', fontSize: '0.8rem', color: '#94a3b8' }}>
          <span>
            Showing {users.length} of {pagination.total} users
          </span>
          <div style={{ display: 'flex', gap: '6px' }}>
            <button
              onClick={() => fetchUsers(pagination.page - 1)}
              disabled={pagination.page <= 1}
              className="btn btn-sm btn-outline-secondary"
              style={{ borderRadius: '6px' }}
            >
              <ChevronLeft size={14} />
            </button>
            <span style={{ padding: '4px 10px', color: '#fff', fontWeight: 600 }}>
              Page {pagination.page} of {pagination.totalPages || 1}
            </span>
            <button
              onClick={() => fetchUsers(pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages}
              className="btn btn-sm btn-outline-secondary"
              style={{ borderRadius: '6px' }}
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* User Inspector Modal */}
      {selectedUserId && (
        <AdminUserDetail
          userId={selectedUserId}
          onClose={() => setSelectedUserId(null)}
          onUserUpdated={() => fetchUsers(pagination.page)}
        />
      )}
    </div>
  );
};
