import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Lock, Mail, User, Compass, AlertCircle } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const locState = location.state as any;
  const planRequest = locState?.planRequest;
  const fromPath = locState?.from?.pathname || (planRequest ? '/create-trip' : '/dashboard');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login({ email, password });
      showToast('Signed in successfully! Welcome back.', 'success');
      
      if (planRequest) {
        navigate('/create-trip', { state: { planRequest }, replace: true });
      } else {
        navigate(fromPath, { replace: true });
      }
    } catch (err: any) {
      const errMsg = !err.response
        ? 'Cannot connect to the server. Please try again later or contact support if the issue persists.'
        : err.response?.data?.detail || 'Invalid email or password.';
      setError(errMsg);
      showToast(errMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-slide-up" style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 24px',
      minHeight: 'calc(100vh - 120px)',
      position: 'relative',
      backgroundColor: '#fcfcfd'
    }}>
      <div style={{
        backgroundColor: '#ffffff',
        border: '2px solid #fca5a5',
        borderRadius: '20px',
        padding: '40px',
        width: '100%',
        maxWidth: '420px',
        boxShadow: '0 12px 35px rgba(220, 38, 38, 0.15)',
        color: '#0f172a'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            backgroundColor: '#dc2626',
            color: '#ffffff',
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 14px auto',
            boxShadow: '0 4px 12px rgba(220, 38, 38, 0.3)'
          }}>
            <Compass size={32} />
          </div>
          <h2 style={{ fontSize: '1.85rem', fontWeight: 900, margin: '0 0 8px 0', color: '#0f172a' }}>Welcome Back</h2>
          <p style={{ color: '#475569', fontSize: '0.95rem', fontWeight: 600, margin: 0 }}>
            {planRequest ? 'Sign in to access your pre-configured trip plan.' : 'Sign in to access your Trip Planner workspace.'}
          </p>
        </div>

        {error && (
          <div style={{
            background: '#fee2e2',
            border: '1.5px solid #dc2626',
            borderRadius: '10px',
            padding: '12px',
            color: '#dc2626',
            fontSize: '0.88rem',
            fontWeight: 800,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '20px'
          }}>
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '0.85rem', color: '#334155', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '14px', top: '14px', color: '#dc2626' }} />
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 14px 12px 42px',
                  borderRadius: '10px',
                  border: '1.5px solid #cbd5e1',
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  color: '#0f172a',
                  backgroundColor: '#ffffff',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '0.85rem', color: '#334155', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '14px', top: '14px', color: '#dc2626' }} />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 14px 12px 42px',
                  borderRadius: '10px',
                  border: '1.5px solid #cbd5e1',
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  color: '#0f172a',
                  backgroundColor: '#ffffff',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            className="glass-button"
            style={{
              width: '100%',
              marginTop: '8px',
              padding: '14px',
              fontSize: '1rem'
            }}
          >
            {loading ? 'Signing in...' : 'Sign In & Continue'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.9rem', color: '#475569', fontWeight: 700, margin: '24px 0 0 0' }}>
          Don't have an account?{' '}
          <Link to="/register" state={{ from: locState?.from, planRequest }} style={{ color: '#dc2626', fontWeight: 800, textDecoration: 'underline' }}>
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const locState = location.state as any;
  const planRequest = locState?.planRequest;
  const fromPath = locState?.from?.pathname || (planRequest ? '/create-trip' : '/dashboard');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register({ name, email, password });
      showToast(`Account created successfully! Welcome to TravelPro AI, ${name}.`, 'success');
      
      if (planRequest) {
        navigate('/create-trip', { state: { planRequest }, replace: true });
      } else {
        navigate(fromPath, { replace: true });
      }
    } catch (err: any) {
      const errMsg = !err.response
        ? 'Cannot connect to the server. Please try again later or contact support if the issue persists.'
        : err.response?.data?.detail || 'Failed to register account.';
      setError(errMsg);
      showToast(errMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-slide-up" style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 24px',
      minHeight: 'calc(100vh - 120px)',
      position: 'relative',
      backgroundColor: '#fcfcfd'
    }}>
      <div style={{
        backgroundColor: '#ffffff',
        border: '2px solid #fca5a5',
        borderRadius: '20px',
        padding: '40px',
        width: '100%',
        maxWidth: '420px',
        boxShadow: '0 12px 35px rgba(220, 38, 38, 0.15)',
        color: '#0f172a'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            backgroundColor: '#dc2626',
            color: '#ffffff',
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 14px auto',
            boxShadow: '0 4px 12px rgba(220, 38, 38, 0.3)'
          }}>
            <Compass size={32} />
          </div>
          <h2 style={{ fontSize: '1.85rem', fontWeight: 900, margin: '0 0 8px 0', color: '#0f172a' }}>Create Account</h2>
          <p style={{ color: '#475569', fontSize: '0.95rem', fontWeight: 600, margin: 0 }}>
            {planRequest ? 'Register to save and launch your custom trip plan.' : 'Register to start creating agentic itineraries.'}
          </p>
        </div>

        {error && (
          <div style={{
            background: '#fee2e2',
            border: '1.5px solid #dc2626',
            borderRadius: '10px',
            padding: '12px',
            color: '#dc2626',
            fontSize: '0.88rem',
            fontWeight: 800,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '20px'
          }}>
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '0.85rem', color: '#334155', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Full Name
            </label>
            <div style={{ position: 'relative' }}>
              <User size={18} style={{ position: 'absolute', left: '14px', top: '14px', color: '#dc2626' }} />
              <input
                type="text"
                required
                placeholder="Alex Mercer"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 14px 12px 42px',
                  borderRadius: '10px',
                  border: '1.5px solid #cbd5e1',
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  color: '#0f172a',
                  backgroundColor: '#ffffff',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '0.85rem', color: '#334155', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '14px', top: '14px', color: '#dc2626' }} />
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 14px 12px 42px',
                  borderRadius: '10px',
                  border: '1.5px solid #cbd5e1',
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  color: '#0f172a',
                  backgroundColor: '#ffffff',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '0.85rem', color: '#334155', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Password (min 6 chars)
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '14px', top: '14px', color: '#dc2626' }} />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 14px 12px 42px',
                  borderRadius: '10px',
                  border: '1.5px solid #cbd5e1',
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  color: '#0f172a',
                  backgroundColor: '#ffffff',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            className="glass-button"
            style={{
              width: '100%',
              marginTop: '8px',
              padding: '14px',
              fontSize: '1rem'
            }}
          >
            {loading ? 'Creating Account...' : 'Create Account & Continue'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.9rem', color: '#475569', fontWeight: 700, margin: '24px 0 0 0' }}>
          Already have an account?{' '}
          <Link to="/login" state={{ from: locState?.from, planRequest }} style={{ color: '#dc2626', fontWeight: 800, textDecoration: 'underline' }}>
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};
