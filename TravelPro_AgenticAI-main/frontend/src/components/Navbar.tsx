import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Compass, LogOut, Sparkles, Map, Landmark, Calendar, Menu, X } from 'lucide-react';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    showToast('Logged out successfully. See you soon!', 'info');
    navigate('/');
    setMobileMenuOpen(false);
  };

  const isActive = (path: string) => {
    if (path === '/create-trip' && (location.pathname === '/create-trip' || location.pathname === '/adventure-builder')) return true;
    return location.pathname === path;
  };

  const navLinks = [
    { label: 'Adventure Builder', path: '/create-trip', icon: Sparkles },
    { label: 'States', path: '/states', icon: Map },
    { label: 'Union Territories', path: '/union-territories', icon: Landmark },
    { label: 'Smart Months Calendar', path: '/smart-calendar', icon: Calendar },
  ];

  return (
    <header style={{
      backgroundColor: '#ffffff',
      color: '#0f172a',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      borderBottom: '2px solid #fee2e2',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)'
    }}>
      <div style={{
        maxWidth: '1440px',
        margin: '0 auto',
        padding: '12px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'relative'
      }}>
        {/* Brand Logo */}
        <Link to="/" onClick={() => setMobileMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
          <div style={{
            backgroundColor: '#dc2626',
            backgroundImage: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
            borderRadius: '10px',
            padding: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(220, 38, 38, 0.4)'
          }}>
            <Compass size={24} style={{ color: '#ffffff' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontWeight: 900, fontSize: '1.35rem', letterSpacing: '-0.5px', color: '#0f172a' }}>
              Incredible<span style={{ color: '#dc2626' }}>India</span> <span style={{ fontSize: '0.78rem', backgroundColor: '#fee2e2', color: '#991b1b', padding: '2px 8px', borderRadius: '12px', fontWeight: 800 }}>PRO</span>
            </span>
            <span style={{ fontSize: '0.65rem', color: '#64748b', fontWeight: 700, letterSpacing: '0.5px' }}>
              STATE & SEASONAL TRAVEL DISCOVERY
            </span>
          </div>
        </Link>

        {/* Desktop Central Navigation */}
        <nav className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {navLinks.map(link => {
            const Icon = link.icon;
            const active = isActive(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 14px',
                  borderRadius: '10px',
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  fontWeight: active ? '800' : '600',
                  color: active ? '#dc2626' : '#475569',
                  backgroundColor: active ? '#fee2e2' : 'transparent',
                  border: active ? '1.5px solid #fca5a5' : '1.5px solid transparent',
                  transition: 'all 0.2s ease'
                }}
              >
                <Icon size={17} style={{ color: active ? '#dc2626' : '#94a3b8' }} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Desktop User Auth Actions */}
        <div className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {user ? (
            <>
              <Link to="/dashboard" style={{
                color: isActive('/dashboard') ? '#dc2626' : '#475569',
                fontWeight: isActive('/dashboard') ? '800' : '600',
                textDecoration: 'none',
                fontSize: '0.88rem',
                padding: '8px 12px',
                borderRadius: '8px',
                backgroundColor: isActive('/dashboard') ? '#fee2e2' : 'transparent'
              }}>
                Dashboard
              </Link>
              
              <div style={{ height: '24px', width: '1px', background: '#e2e8f0' }} />

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0f172a' }}>{user.name}</span>
                <button 
                  onClick={handleLogout}
                  style={{
                    padding: '8px 14px',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    color: '#dc2626',
                    backgroundColor: '#fee2e2',
                    border: '1px solid #fca5a5',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'all 0.2s ease'
                  }}
                  title="Logout"
                >
                  <LogOut size={15} />
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" style={{
                color: '#0f172a',
                backgroundColor: '#ffffff',
                border: '1.5px solid #cbd5e1',
                borderRadius: '8px',
                padding: '8px 16px',
                textDecoration: 'none',
                fontWeight: 700,
                fontSize: '0.88rem',
                transition: 'all 0.2s ease'
              }}>
                Login
              </Link>
              <Link to="/register" style={{
                color: '#ffffff',
                backgroundColor: '#dc2626',
                border: '1.5px solid #b91c1c',
                borderRadius: '8px',
                padding: '8px 16px',
                textDecoration: 'none',
                fontWeight: 800,
                fontSize: '0.88rem',
                boxShadow: '0 2px 8px rgba(220, 38, 38, 0.3)',
                transition: 'all 0.2s ease'
              }}>
                Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger Toggle Button */}
        <button
          className="mobile-menu-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation menu"
          style={{
            backgroundColor: mobileMenuOpen ? '#fee2e2' : '#f8fafc',
            border: '1px solid #cbd5e1',
            borderRadius: '8px',
            padding: '8px',
            color: '#0f172a',
            cursor: 'pointer',
            display: 'none',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {mobileMenuOpen ? <X size={24} style={{ color: '#dc2626' }} /> : <Menu size={24} />}
        </button>

      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div style={{
          backgroundColor: '#ffffff',
          borderTop: '1px solid #fee2e2',
          padding: '16px 24px 24px 24px',
          boxShadow: '0 12px 24px rgba(0,0,0,0.08)'
        }}>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
            {navLinks.map(link => {
              const Icon = link.icon;
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '12px 16px',
                    borderRadius: '10px',
                    textDecoration: 'none',
                    fontSize: '0.95rem',
                    fontWeight: active ? '800' : '600',
                    color: active ? '#dc2626' : '#475569',
                    backgroundColor: active ? '#fee2e2' : '#f8fafc',
                    border: active ? '1.5px solid #fca5a5' : '1px solid #e2e8f0'
                  }}
                >
                  <Icon size={18} style={{ color: active ? '#dc2626' : '#64748b' }} />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          <div style={{ paddingTop: '12px', borderTop: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {user ? (
              <>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 0' }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f172a' }}>{user.name}</span>
                  <Link 
                    to="/dashboard" 
                    onClick={() => setMobileMenuOpen(false)}
                    style={{ fontSize: '0.88rem', fontWeight: 700, color: '#dc2626', textDecoration: 'none' }}
                  >
                    Dashboard
                  </Link>
                </div>
                <button 
                  onClick={handleLogout}
                  style={{
                    width: '100%',
                    padding: '12px',
                    fontSize: '0.9rem',
                    fontWeight: 700,
                    color: '#dc2626',
                    backgroundColor: '#fee2e2',
                    border: '1px solid #fca5a5',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <Link to="/login" onClick={() => setMobileMenuOpen(false)} style={{
                  textAlign: 'center',
                  color: '#0f172a',
                  backgroundColor: '#ffffff',
                  border: '1.5px solid #cbd5e1',
                  borderRadius: '10px',
                  padding: '10px',
                  textDecoration: 'none',
                  fontWeight: 700,
                  fontSize: '0.9rem'
                }}>
                  Login
                </Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)} style={{
                  textAlign: 'center',
                  color: '#ffffff',
                  backgroundColor: '#dc2626',
                  border: '1.5px solid #b91c1c',
                  borderRadius: '10px',
                  padding: '10px',
                  textDecoration: 'none',
                  fontWeight: 800,
                  fontSize: '0.9rem'
                }}>
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Style block for mobile menu responsive rules */}
      <style>{`
        @media (max-width: 960px) {
          .desktop-nav {
            display: none !important;
          }
          .mobile-menu-toggle {
            display: flex !important;
          }
        }
      `}</style>
    </header>
  );
};

export default Navbar;
