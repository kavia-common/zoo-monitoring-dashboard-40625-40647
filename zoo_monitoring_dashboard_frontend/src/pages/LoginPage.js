import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * PUBLIC_INTERFACE
 * LoginPage
 * A simple login screen with email, password, role dropdown, remember me and a login button.
 * On submit, navigates to /animals with no backend dependency.
 */
function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: '',
    password: '',
    role: 'Zoo Manager',
    remember: false
  });

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    navigate('/animals');
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'grid', placeItems: 'center', padding: 24 }}>
      <div className="card" style={{ width: 420, maxWidth: '94vw', padding: 24 }}>
        <h1 style={{ margin: 0, marginBottom: 8, color: 'var(--text)' }}>Welcome back</h1>
        <p className="muted" style={{ marginTop: 0, marginBottom: 16 }}>
          Sign in to continue to Zoo Monitoring Dashboard
        </p>
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
            <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input
                aria-label="Remember me"
                type="checkbox"
                name="remember"
                checked={form.remember}
                onChange={onChange}
                style={{ accentColor: 'var(--primary)' }}
              />
              <span className="muted">Remember me</span>
            </label>
            <button aria-label="Login" className="btn btn-primary" type="submit">
              Sign In
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
