import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import '../styles/auth.css';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ nama: '', username: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      await api.post('/auth/register', form);
      setSuccess('Registration successful! Redirecting to login page...');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-layout">
      {/* Left panel — branding */}
      <div className="auth-hero">
        <div className="auth-hero-content">
          <div className="auth-hero-brand">Capsule</div>
          <h1 className="auth-hero-title">Build your<br />perfect capsule.</h1>
          <p className="auth-hero-sub">
            Organize your wardrobe and get outfit recommendations tailored just for you.
          </p>
        </div>
        <div className="auth-hero-dots">
          <span /><span /><span />
        </div>
      </div>

      {/* Right panel — form */}
      <div className="auth-panel">
        <div className="auth-card">
          <div className="auth-card-header">
            <h2 className="auth-card-title">Create a new account</h2>
            <p className="auth-card-sub">Join and start exploring your style</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Full name</label>
              <input
                id="register-nama"
                className="form-input"
                name="nama"
                value={form.nama}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Username</label>
              <input
                id="register-username"
                className="form-input"
                name="username"
                value={form.username}
                onChange={handleChange}
                placeholder="Choose a username"
                autoComplete="username"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                id="register-password"
                className="form-input"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Create a password"
                autoComplete="new-password"
                required
              />
            </div>

            {error && (
              <div className="auth-error">
                <span className="auth-error-icon">⚠</span>
                {error}
              </div>
            )}

            {success && (
              <div className="auth-success">
                <span className="auth-success-icon">✓</span>
                {success}
              </div>
            )}

            <button
              id="register-submit"
              className="btn-primary auth-submit"
              type="submit"
              disabled={loading}
            >
              {loading ? 'Registering...' : 'Register'}
            </button>
          </form>

          <p className="auth-footer">
            Already have an account?{' '}
            <Link to="/login" className="auth-link">Log in here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}