import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/vizai-logo.png';

/**
 * PUBLIC_INTERFACE
 * LoginPage
 * VizAi branded login with email, password, role, remember me.
 * Title: "Welcome Back". On submit, sets a mock auth flag and navigates to /species.
 */
function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: '',
    password: '',
    role: '',
    remember: false
  });

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (!form.role) return; // mandatory role
    localStorage.setItem('vizai_authed', '1');
    localStorage.removeItem('vizai_species');
    navigate('/species');
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)', display: 'grid', placeItems: 'center', padding: 24 }}>
      <div className="card" style={{ width: 480, maxWidth: '94vw', padding: 24 }}>
        <div className="header-gradient" style={{ borderRadius: 12, padding: 16, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 12 }}>
          <img src={logo} alt="VizAi" style={{ height: 32, width: 'auto' }} />
          <div style={{ color: '#fff', opacity: 0.9 }}>Welcome Back</div>
        </div>
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
                required
              >
                <option value="">Select your role</option>
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
            <button
              type="button"
              className="btn btn-outline"
              aria-label="Go to register"
              onClick={() => navigate('/register')}
            >
              Create an account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
