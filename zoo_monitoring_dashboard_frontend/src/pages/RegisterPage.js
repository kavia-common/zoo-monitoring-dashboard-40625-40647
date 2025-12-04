import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * PUBLIC_INTERFACE
 * RegisterPage
 * VizAi branded registration with email + password + confirm + role.
 * On success, navigates to /login.
 */
function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: '',
    password: '',
    confirm: '',
    role: 'Zoo Manager',
    agree: false
  });
  const [error, setError] = useState('');

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!form.email || !form.password || !form.confirm) {
      setError('Please fill in all required fields.');
      return;
    }
    if (form.password !== form.confirm) {
      setError('Passwords do not match.');
      return;
    }
    if (!form.agree) {
      setError('Please accept the Terms and Privacy Policy.');
      return;
    }
    // Mock register success
    navigate('/login');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 24, background: 'var(--bg)' }}>
      <div className="card" style={{ width: 520, maxWidth: '94vw', padding: 24 }}>
        <div className="header-gradient" style={{ borderRadius: 12, padding: 16, marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <h1 style={{ margin: 0, color: 'var(--primary)' }}>Viz</h1>
            <h1 style={{ margin: 0, color: 'var(--secondary)' }}>Ai</h1>
          </div>
          <div className="muted">Create your account to access Zoo Monitoring Dashboard</div>
        </div>

        {error && (
          <div className="card-flat" role="alert" style={{ padding: 12, borderColor: 'var(--error)', marginBottom: 12, color: 'var(--error)' }}>
            {error}
          </div>
        )}

        <form onSubmit={onSubmit}>
          <div style={{ display: 'grid', gap: 12 }}>
            <label>
              <div className="subtle">Email</div>
              <input
                aria-label="Email"
                className="input"
                type="email"
                placeholder="you@example.com"
                name="email"
                value={form.email}
                onChange={onChange}
                required
              />
            </label>
            <label>
              <div className="subtle">Password</div>
              <input
                aria-label="Password"
                className="input"
                type="password"
                placeholder="••••••••"
                name="password"
                value={form.password}
                onChange={onChange}
                required
              />
            </label>
            <label>
              <div className="subtle">Confirm Password</div>
              <input
                aria-label="Confirm Password"
                className="input"
                type="password"
                placeholder="••••••••"
                name="confirm"
                value={form.confirm}
                onChange={onChange}
                required
              />
            </label>
            <label>
              <div className="subtle">Role</div>
              <select
                aria-label="Select Role"
                className="input"
                name="role"
                value={form.role}
                onChange={onChange}
              >
                <option>Zoo Manager</option>
                <option>Veterinarian</option>
                <option>Researcher</option>
                <option>Animal Keeper</option>
              </select>
            </label>
            <label style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <input
                aria-label="Agree to terms"
                type="checkbox"
                name="agree"
                checked={form.agree}
                onChange={onChange}
                style={{ accentColor: 'var(--primary)' }}
              />
              <span className="muted">I agree to the Terms and Privacy Policy</span>
            </label>
            <button aria-label="Create account" className="btn btn-primary" type="submit">
              Create Account
            </button>
            <button
              type="button"
              className="btn btn-outline"
              aria-label="Go to login"
              onClick={() => navigate('/login')}
            >
              Already have an account? Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RegisterPage;
