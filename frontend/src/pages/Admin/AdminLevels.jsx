import React, { useState, useEffect } from 'react';
import { Award, Edit2, Check, X, RefreshCw, Loader2 } from 'lucide-react';
import { adminService } from '../../services/adminService';
import { formatNumber } from '../../utils/formatters';
import styles from './Admin.module.css';

export const AdminLevels = () => {
  const [levels, setLevels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ levelName: '', xpThreshold: 0 });
  const [saveLoading, setSaveLoading] = useState(false);

  const fetchLevels = async () => {
    try {
      setLoading(true);
      const res = await adminService.getLevels();
      if (res.success) {
        setLevels(res.levels);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLevels();
  }, []);

  const handleStartEdit = (lvl) => {
    setEditingId(lvl._id);
    setEditForm({ levelName: lvl.levelName, xpThreshold: lvl.xpThreshold });
  };

  const handleSaveEdit = async (id) => {
    try {
      setSaveLoading(true);
      await adminService.updateLevel(id, editForm);
      setEditingId(null);
      await fetchLevels();
    } catch (err) {
      alert(err.message || 'Failed to update level configuration');
    } finally {
      setSaveLoading(false);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff', margin: 0 }}>
            Level Progression Configurations
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: '4px 0 0 0' }}>
            Configure tier names, XP thresholds, and status badges
          </p>
        </div>

        <button
          onClick={fetchLevels}
          className="btn btn-sm btn-outline-secondary"
          style={{ borderRadius: '8px' }}
        >
          <RefreshCw size={14} />
        </button>
      </div>

      <div className={styles.tableCard} style={{ marginTop: 0 }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <Loader2 size={30} className="spinner-border text-primary" />
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="table table-dark table-hover mb-0" style={{ fontSize: '0.85rem' }}>
              <thead>
                <tr>
                  <th>Tier Level</th>
                  <th>Level Name</th>
                  <th>XP Required Threshold</th>
                  <th>Badge Asset</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {levels.map((lvl) => {
                  const isEditing = editingId === lvl._id;
                  return (
                    <tr key={lvl._id}>
                      <td style={{ fontWeight: 700, fontFamily: 'var(--veloop-font-mono)' }}>
                        Level {String(lvl.levelNumber).padStart(2, '0')}
                      </td>
                      <td>
                        {isEditing ? (
                          <input
                            type="text"
                            value={editForm.levelName}
                            onChange={(e) => setEditForm({ ...editForm, levelName: e.target.value })}
                            className="form-control form-control-sm"
                            style={{ backgroundColor: '#10131e', color: '#fff', borderColor: '#283048' }}
                          />
                        ) : (
                          <span style={{ fontWeight: 600, color: '#fff' }}>{lvl.levelName}</span>
                        )}
                      </td>
                      <td>
                        {isEditing ? (
                          <input
                            type="number"
                            value={editForm.xpThreshold}
                            onChange={(e) => setEditForm({ ...editForm, xpThreshold: Number(e.target.value) })}
                            className="form-control form-control-sm"
                            style={{ backgroundColor: '#10131e', color: '#fff', borderColor: '#283048', width: '120px' }}
                          />
                        ) : (
                          <strong style={{ color: '#38bdf8', fontFamily: 'var(--veloop-font-mono)' }}>
                            {formatNumber(lvl.xpThreshold)} XP
                          </strong>
                        )}
                      </td>
                      <td>
                        <span
                          style={{
                            padding: '3px 8px',
                            backgroundColor: 'rgba(56, 189, 248, 0.1)',
                            color: lvl.badgeColor || '#38bdf8',
                            borderRadius: '4px',
                            fontSize: '0.75rem',
                          }}
                        >
                          {lvl.badgeIcon}
                        </span>
                      </td>
                      <td>
                        <span className={lvl.isActive ? 'status-badge-active' : 'status-badge-rejected'}>
                          {lvl.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td>
                        {isEditing ? (
                          <div style={{ display: 'flex', gap: '6px' }}>
                            <button
                              onClick={() => handleSaveEdit(lvl._id)}
                              disabled={saveLoading}
                              className="btn btn-sm btn-success"
                              style={{ padding: '2px 8px', fontSize: '0.75rem' }}
                            >
                              <Check size={12} />
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              className="btn btn-sm btn-secondary"
                              style={{ padding: '2px 8px', fontSize: '0.75rem' }}
                            >
                              <X size={12} />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleStartEdit(lvl)}
                            className="btn btn-sm btn-outline-secondary"
                            style={{ padding: '2px 8px', fontSize: '0.75rem' }}
                          >
                            <Edit2 size={12} />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

