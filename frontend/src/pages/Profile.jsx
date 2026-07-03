import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import '../styles/pages.css';

export default function Profile() {
  const { user, login, logout } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ nama: user?.nama || '', username: user?.username || '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const userInitial = user?.nama ? user.nama.charAt(0).toUpperCase() : 'U';

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleUpdate(e) {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const res = await api.put('/auth/me', form);
      login(res.data.user, localStorage.getItem('token'));
      setSuccess('Profil berhasil diperbarui!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal memperbarui profil.');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!confirm('Hapus akun Anda permanen? Tindakan ini menghapus seluruh wardrobe Anda dan tidak bisa dibatalkan.')) return;
    try {
      await api.delete('/auth/me');
      logout();
      navigate('/login');
    } catch (err) {
      setError('Gagal menghapus akun.');
    }
  }

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <>
      <Navbar />
      <div className="page-main--narrow">
        {/* Page Header */}
        <div className="page-header">
          <div>
            <h1 className="page-title">Profil Saya</h1>
            <p className="page-sub">Kelola data informasi akun Anda dan preferensi keamanan.</p>
          </div>
        </div>

        {/* Profile Info Header Card */}
        <div className="profile-header-card">
          <div className="avatar-lg">{userInitial}</div>
          <div>
            <div className="profile-name">{user?.nama || 'User'}</div>
            <div className="profile-uname">@{user?.username || 'username'}</div>
          </div>
          <button onClick={handleLogout} className="btn-secondary" style={{ marginLeft: 'auto' }}>
            Logout
          </button>
        </div>

        {/* Settings Card */}
        <div className="section-card">
          <div className="section-card-title">Pengaturan Profil</div>
          <form onSubmit={handleUpdate}>
            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">Nama Lengkap</label>
                <input
                  name="nama"
                  className="form-input"
                  value={form.nama}
                  onChange={handleChange}
                  placeholder="Nama Lengkap Anda"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Username</label>
                <input
                  name="username"
                  className="form-input"
                  value={form.username}
                  onChange={handleChange}
                  placeholder="Username Anda"
                  required
                />
              </div>

              <div className="form-group form-group-full">
                <label className="form-label">Password Baru (Opsional)</label>
                <input
                  name="password"
                  type="password"
                  className="form-input"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Biarkan kosong jika tidak ingin mengubah password"
                />
              </div>
            </div>

            {error && <p style={{ color: 'var(--danger)', fontSize: '13px', marginBottom: '16px' }}>⚠ {error}</p>}
            {success && <p style={{ color: '#27AE60', fontSize: '13px', marginBottom: '16px' }}>✓ {success}</p>}

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>
          </form>
        </div>

        {/* Danger Zone Card */}
        <div className="danger-card">
          <div className="danger-title">Zona Bahaya</div>
          <div className="danger-desc">
            Menghapus akun Anda bersifat permanen. Seluruh data pakaian personal dan rekomendasi Anda akan dihapus dari sistem kami.
          </div>
          <button onClick={handleDelete} className="btn-danger">
            Hapus Akun Saya
          </button>
        </div>
      </div>
    </>
  );
}