import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import '../styles/pages.css';

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ defaultCount: 0, personalCount: 0 });

  useEffect(() => {
    async function loadStats() {
      try {
        const [resDefault, resPersonal] = await Promise.all([
          api.get('/wardrobe/default'),
          api.get('/wardrobe/personal')
        ]);
        setStats({
          defaultCount: resDefault.data.data?.length || 0,
          personalCount: resPersonal.data.data?.length || 0
        });
      } catch (err) {
        console.error('Gagal mengambil data statistik wardrobe:', err);
      }
    }
    loadStats();
  }, []);

  const totalCount = stats.defaultCount + stats.personalCount;

  return (
    <>
      <Navbar />
      <div className="page-main">
        {/* Greeting Section */}
        <div className="greeting">
          <div className="greeting-sub">Selamat Datang Kembali</div>
          <h1 className="greeting-name">
            Halo, <strong>{user?.nama || 'User'}</strong>
          </h1>
          <div className="greeting-line"></div>
        </div>

        {/* Quick Access Menu Cards */}
        <div className="sec-label">Menu Utama</div>
        <div className="grid-3">
          <div className="menu-card" onClick={() => navigate('/wardrobe')}>
            <div className="card-icon ic-terra">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 19.5V15a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4.5M4 19.5A2.5 2.5 0 0 0 6.5 22h11a2.5 2.5 0 0 0 2.5-2.5M4 19.5V4.5A2.5 2.5 0 0 1 6.5 2M18 2h1.5A2.5 2.5 0 0 1 22 4.5v15M12 2v11"/>
              </svg>
            </div>
            <div className="card-title">Wardrobe</div>
            <div className="card-desc">
              Kelola koleksi pakaian pribadimu, tambahkan pakaian baru, dan edit detail wardrobe.
            </div>
            <div className="card-link" style={{ color: 'var(--terra)' }}>
              Buka Wardrobe &rarr;
            </div>
          </div>

          <div className="menu-card" onClick={() => navigate('/recommendation')}>
            <div className="card-icon ic-clay">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>
              </svg>
            </div>
            <div className="card-title">Rekomendasi Outfit</div>
            <div className="card-desc">
              Dapatkan saran kombinasi pakaian otomatis yang serasi dari pakaian pilihanmu.
            </div>
            <div className="card-link" style={{ color: 'var(--clay)' }}>
              Cari Rekomendasi &rarr;
            </div>
          </div>

          <div className="menu-card" onClick={() => navigate('/profile')}>
            <div className="card-icon ic-brown">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"/>
              </svg>
            </div>
            <div className="card-title">Profil Saya</div>
            <div className="card-desc">
              Atur informasi akun, ubah username, nama lengkap, atau perbarui sandi keamananmu.
            </div>
            <div className="card-link" style={{ color: 'var(--brown)' }}>
              Lihat Profil &rarr;
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="sec-label">Statistik Koleksi</div>
        <div className="stat-grid">
          <div className="stat-card">
            <div className="stat-num">{stats.defaultCount}</div>
            <div className="stat-label">Pakaian Default</div>
            <div className="stat-bar">
              <div className="stat-fill" style={{ width: `${stats.defaultCount > 0 ? 100 : 0}%`, background: 'var(--terra)' }}></div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-num">{stats.personalCount}</div>
            <div className="stat-label">Pakaian Pribadi</div>
            <div className="stat-bar">
              <div className="stat-fill" style={{ width: `${stats.personalCount > 0 ? 100 : 0}%`, background: 'var(--clay)' }}></div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-num">{totalCount}</div>
            <div className="stat-label">Total Item Wardrobe</div>
            <div className="stat-bar">
              <div className="stat-fill" style={{ width: `${totalCount > 0 ? 100 : 0}%`, background: 'var(--brown)' }}></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}