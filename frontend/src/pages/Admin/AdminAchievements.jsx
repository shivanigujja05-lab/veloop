import React, { useState, useEffect } from 'react';
import { Trophy, Edit2, Check, X, RefreshCw, Loader2 } from 'lucide-react';
import { adminService } from '../../services/adminService';
import { formatNumber } from '../../utils/formatters';
import styles from './Admin.module.css';

export const AdminAchievements = () => {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', description: '', xpReward: 0, vesReward: 0, requiredValue: 0 });
  const [saveLoading, setSaveLoading] = useState(false);

  const fetchAchievements = async () => {
    try {
      setLoading(true);
      const res = await adminService.getAchievements();
      if (res.success) {
        setAchievements(res.achievements);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAchievements();
  }, []);

  const handleStartEdit = (ach) => {
    setEditingId(ach._id);
    setEditForm({
      name: ach.name,
      description: ach.description,
      xpReward: ach.xpReward,
      vesReward: ach.vesReward,
      requiredValue: ach.requiredValue,
    });
  };

  const handleSaveEdit = async (id) => {
    try {
      setSaveLoading(true);
      await adminService.updateAchievement(id, editForm);
      setEditingId(null);
      await fetchAchievements();
    } catch (err) {
      alert(err.message || 'Failed to update achievement');
    } finally {
      setSaveLoading(false);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff', margin: 0 }}>
            Achievement & Badge Management
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: '4px 0 0 0' }}>
            Configure unlock rules, XP rewards, and gamification badge honors
          </p>
        </div>

        <button
          onClick={fetchAchievements}
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
                  <th>Badge Code</th>
                  <th>Achievement Name & Description</th>
                  <th>Category</th>
                  <th>Target Requirement</th>
                  <th>XP & VEs Bonus</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {achievements.map((ach) => {
                  const isEditing = editingId === ach._id;
                  return (
                    <tr key={ach._id}>
                      <td style={{ fontFamily: 'var(--veloop-font-mono)', fontWeight: 600 }}>{ach.achievementId}</td>
                      <td>
                        {isEditing ? (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <input
                              type="text"
                              value={editForm.name}
                              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                              className="form-control form-control-sm"
                              style={{ backgroundColor: '#10131e', color: '#fff', borderColor: '#283048' }}
                            />
                            <input
                              type="text"
                              value={editForm.description}
                              onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                              className="form-control form-control-sm"
                              style={{ backgroundColor: '#10131e', color: '#fff', borderColor: '#283048' }}
                            />
                          </div>
                        ) : (
                          <div>
                            <strong style={{ color: '#fff', display: 'block' }}>{ach.name}</strong>
                            <span style={{ color: '#94a3b8', fontSize: '0.75rem' }}>{ach.description}</span>
                          </div>
                        )}
                      </td>
                      <td>
                        <span style={{ color: '#cbd5e1', fontSize: '0.75rem', fontWeight: 600 }}>
                          {ach.category}
                        </span>
                      </td>
                      <td>
                        {isEditing ? (
                          <input
                            type="number"
                            value={editForm.requiredValue}
                            onChange={(e) => setEditForm({ ...editForm, requiredValue: Number(e.target.value) })}
                            className="form-control form-control-sm"
                            style={{ backgroundColor: '#10131e', color: '#fff', borderColor: '#283048', width: '100px' }}
                          />
                        ) : (
                          <span style={{ fontFamily: 'var(--veloop-font-mono)', color: '#38bdf8' }}>
                            {formatNumber(ach.requiredValue)} ({ach.conditionType})
                          </span>
                        )}
                      </td>
                      <td>
                        {isEditing ? (
                          <div style={{ display: 'flex', gap: '4px' }}>
                            <input
                              type="number"
                              placeholder="XP"
                              value={editForm.xpReward}
                              onChange={(e) => setEditForm({ ...editForm, xpReward: Number(e.target.value) })}
                              className="form-control form-control-sm"
                              style={{ backgroundColor: '#10131e', color: '#fff', borderColor: '#283048', width: '70px' }}
                            />
                            <input
                              type="number"
                              placeholder="VEs"
                              value={editForm.vesReward}
                              onChange={(e) => setEditForm({ ...editForm, vesReward: Number(e.target.value) })}
                              className="form-control form-control-sm"
                              style={{ backgroundColor: '#10131e', color: '#fff', borderColor: '#283048', width: '70px' }}
                            />
                          </div>
                        ) : (
                          <span style={{ color: '#f59e0b', fontWeight: 700, fontFamily: 'var(--veloop-font-mono)' }}>
                            +{ach.xpReward} XP | +{ach.vesReward} VEs
                          </span>
                        )}
                      </td>
                      <td>
                        <span className={ach.isActive ? 'status-badge-active' : 'status-badge-rejected'}>
                          {ach.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td>
                        {isEditing ? (
                          <div style={{ display: 'flex', gap: '6px' }}>
                            <button
                              onClick={() => handleSaveEdit(ach._id)}
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
                            onClick={() => handleStartEdit(ach)}
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

