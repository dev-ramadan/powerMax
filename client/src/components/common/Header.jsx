import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingBag, Search, User, Menu, X, ShieldAlert, LogOut, Package, Sparkles } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { settingsApi } from '../../services/api';

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { totalItems, setIsCartOpen } = useCart();
  const { user, logout, isAdmin } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    settingsApi.get()
      .then(res => setSettings(res.data.settings))
      .catch(err => console.log('Settings fetch err', err));
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  }, [location.pathname]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setMobileMenuOpen(false);
    }
  };

  const navLinks = [
    { label: 'الرئيسية', to: '/' },
    { label: 'كل المنتجات', to: '/products' },
    { label: 'تجهيزات العروسة 👰', to: '/bridal', highlight: true },
    { label: 'تتبع الطلب', to: '/track-order' }
  ];

  return (
    <>
      {/* Top Announcement Bar */}
      {settings?.announcementActive !== false && (
        <div style={{
          backgroundColor: '#080808',
          color: '#ffffff',
          textAlign: 'center',
          padding: '8px 16px',
          fontSize: '13px',
          fontWeight: '600',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px'
        }}>
          <Sparkles size={14} color="#ffd21f" />
          <span>{settings?.announcementText || 'شحن مجاني على الطلبات فوق 500 ج.م — اطلب الآن! 🚚'}</span>
        </div>
      )}

      {/* Main Header */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e9e9ee',
        boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
      }} dir="rtl">
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '12px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '20px'
        }}>
          {/* Logo & Mobile Menu Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{
                display: 'none',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '6px',
                color: '#202020'
              }}
              className="pm-mobile-menu-btn"
              aria-label="القائمة"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
              <img
                src="/logo.png"
                alt="POWER MAX - The Best in Home World"
                style={{ height: '48px', width: 'auto', objectFit: 'contain' }}
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextSibling.style.display = 'block';
                }}
              />
              <div style={{ display: 'none', fontWeight: 900, fontSize: '22px', color: '#f20d16', letterSpacing: '-0.5px' }}>
                POWER <span style={{ color: '#172cf4' }}>MAX</span>
              </div>
            </Link>
          </div>

          {/* Desktop Search Form */}
          <form
            onSubmit={handleSearch}
            style={{
              flex: '1',
              maxWidth: '460px',
              position: 'relative',
              display: 'flex',
              alignItems: 'center'
            }}
            className="pm-header-search"
          >
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="بتدور على إيه لبيتك؟ طقم حلل، سفرة، أكواب..."
              style={{
                width: '100%',
                padding: '10px 42px 10px 16px',
                borderRadius: '9999px',
                border: '1.5px solid #e0e0e6',
                backgroundColor: '#f8f8fa',
                fontSize: '14px',
                outline: 'none',
                fontFamily: 'Cairo, sans-serif',
                transition: 'border-color 0.2s ease'
              }}
              onFocus={(e) => e.target.style.borderColor = '#f20d16'}
              onBlur={(e) => e.target.style.borderColor = '#e0e0e6'}
            />
            <button
              type="submit"
              aria-label="بحث"
              style={{
                position: 'absolute',
                right: '12px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                color: '#747474'
              }}
            >
              <Search size={18} />
            </button>
          </form>

          {/* User actions: Account, Admin, Cart */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* User Dropdown */}
            <div style={{ position: 'relative' }}>
              <button
                type="button"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: '#f8f8fa',
                  border: '1px solid #e9e9ee',
                  borderRadius: '9999px',
                  padding: '7px 14px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#363636'
                }}
              >
                <User size={17} color={user ? '#172cf4' : '#747474'} />
                <span className="pm-user-name">
                  {user ? (user.name?.split(' ')[0] || 'حسابي') : 'دخول'}
                </span>
              </button>

              {userDropdownOpen && (
                <div style={{
                  position: 'absolute',
                  top: 'calc(100% + 8px)',
                  left: 0,
                  backgroundColor: '#ffffff',
                  borderRadius: '14px',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.12)',
                  border: '1px solid #e9e9ee',
                  minWidth: '200px',
                  padding: '8px',
                  zIndex: 1010
                }}>
                  {user ? (
                    <>
                      <div style={{ padding: '8px 12px', borderBottom: '1px solid #f0f0f3' }}>
                        <div style={{ fontWeight: 700, fontSize: '14px', color: '#101010' }}>{user.name}</div>
                        <div style={{ fontSize: '12px', color: '#747474' }}>{user.email}</div>
                      </div>

                      {isAdmin && (
                        <Link
                          to="/admin"
                          onClick={() => setUserDropdownOpen(false)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '10px 12px',
                            color: '#f20d16',
                            textDecoration: 'none',
                            fontSize: '13px',
                            fontWeight: 700,
                            borderRadius: '8px',
                            backgroundColor: '#fff0f0',
                            marginTop: '4px'
                          }}
                        >
                          <ShieldAlert size={16} />
                          لوحة تحكم الأدمن
                        </Link>
                      )}

                      <Link
                        to="/profile"
                        onClick={() => setUserDropdownOpen(false)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '10px 12px',
                          color: '#363636',
                          textDecoration: 'none',
                          fontSize: '13px',
                          fontWeight: 600,
                          borderRadius: '8px'
                        }}
                      >
                        <Package size={16} />
                        طلباتي وحسابي
                      </Link>

                      <button
                        type="button"
                        onClick={() => {
                          logout();
                          setUserDropdownOpen(false);
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          width: '100%',
                          textAlign: 'right',
                          padding: '10px 12px',
                          color: '#ef4444',
                          background: 'none',
                          border: 'none',
                          fontSize: '13px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          borderRadius: '8px'
                        }}
                      >
                        <LogOut size={16} />
                        تسجيل الخروج
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        onClick={() => setUserDropdownOpen(false)}
                        style={{
                          display: 'block',
                          padding: '10px 14px',
                          color: '#ffffff',
                          backgroundColor: '#f20d16',
                          textDecoration: 'none',
                          fontSize: '13px',
                          fontWeight: 700,
                          borderRadius: '8px',
                          textAlign: 'center',
                          marginBottom: '6px'
                        }}
                      >
                        تسجيل الدخول
                      </Link>
                      <Link
                        to="/register"
                        onClick={() => setUserDropdownOpen(false)}
                        style={{
                          display: 'block',
                          padding: '8px 14px',
                          color: '#363636',
                          textDecoration: 'none',
                          fontSize: '13px',
                          fontWeight: 600,
                          borderRadius: '8px',
                          textAlign: 'center',
                          backgroundColor: '#f8f8fa'
                        }}
                      >
                        إنشاء حساب جديد
                      </Link>
                      <div style={{ height: '1px', backgroundColor: '#f0f0f3', margin: '8px 0' }} />
                      <Link
                        to="/admin/login"
                        onClick={() => setUserDropdownOpen(false)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '6px 12px',
                          color: '#747474',
                          textDecoration: 'none',
                          fontSize: '12px'
                        }}
                      >
                        <ShieldAlert size={14} />
                        دخول المسؤول (Admin)
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Cart Trigger Button */}
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: '#f20d16',
                color: '#ffffff',
                border: 'none',
                borderRadius: '9999px',
                padding: '9px 18px',
                cursor: 'pointer',
                fontWeight: 700,
                fontSize: '14px',
                boxShadow: '0 4px 14px rgba(242, 13, 22, 0.28)',
                transition: 'transform 0.15s ease, background-color 0.15s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#c80009'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f20d16'}
              aria-label={`السلة تحتوي على ${totalItems} منتجات`}
            >
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <ShoppingBag size={19} />
                {totalItems > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: '-8px',
                    left: '-10px',
                    backgroundColor: '#ffd21f',
                    color: '#080808',
                    fontSize: '11px',
                    fontWeight: 900,
                    borderRadius: '9999px',
                    minWidth: '18px',
                    height: '18px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0 4px',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
                  }}>
                    {totalItems}
                  </span>
                )}
              </div>
              <span className="pm-cart-btn-label">السلة</span>
            </button>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav style={{
          borderTop: '1px solid #f0f0f3',
          backgroundColor: '#ffffff'
        }} className="pm-desktop-nav">
          <div style={{
            maxWidth: '1280px',
            margin: '0 auto',
            padding: '0 20px',
            display: 'flex',
            alignItems: 'center',
            gap: '24px',
            overflowX: 'auto',
            whiteSpace: 'nowrap'
          }}>
            {navLinks.map((link) => {
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  style={{
                    display: 'inline-block',
                    padding: '12px 4px',
                    textDecoration: 'none',
                    fontSize: '14px',
                    fontWeight: isActive || link.highlight ? 700 : 600,
                    color: link.highlight ? '#f20d16' : isActive ? '#172cf4' : '#363636',
                    borderBottom: isActive ? '2px solid #172cf4' : '2px solid transparent',
                    transition: 'color 0.15s ease'
                  }}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Mobile Slide-down Drawer */}
        {mobileMenuOpen && (
          <div style={{
            backgroundColor: '#ffffff',
            borderTop: '1px solid #e9e9ee',
            padding: '16px 20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }} className="pm-mobile-nav">
            <form onSubmit={handleSearch} style={{ marginBottom: '8px' }}>
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث عن المنتجات..."
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: '1.5px solid #e0e0e6',
                  fontSize: '14px'
                }}
              />
            </form>
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                style={{
                  padding: '10px 0',
                  textDecoration: 'none',
                  fontSize: '15px',
                  fontWeight: 600,
                  color: link.highlight ? '#f20d16' : '#202020',
                  borderBottom: '1px solid #f8f8fa'
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </header>

      <style>{`
        @media (max-width: 768px) {
          .pm-mobile-menu-btn { display: block !important; }
          .pm-header-search { display: none !important; }
          .pm-desktop-nav { display: none !important; }
          .pm-cart-btn-label { display: none !important; }
          .pm-user-name { display: none !important; }
        }
      `}</style>
    </>
  );
}
