import React, { useState } from 'react';
import { NavLink, Outlet, Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Layers,
  ShoppingBag,
  Sparkles,
  Settings,
  ExternalLink,
  LogOut,
  Menu,
  X,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { to: '/admin', label: 'لوحة التحكم', icon: LayoutDashboard, end: true },
    { to: '/admin/orders', label: 'الطلبات والمبيعات', icon: ShoppingBag },
    { to: '/admin/products', label: 'إدارة المنتجات', icon: Package },
    { to: '/admin/categories', label: 'أقسام المتجر', icon: Layers },
    { to: '/admin/bridal', label: 'عروض العروسة', icon: Sparkles },
    { to: '/admin/settings', label: 'إعدادات المتجر', icon: Settings }
  ];

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f4f5f8' }} dir="rtl">
      {/* Sidebar */}
      <aside
        style={{
          width: '260px',
          backgroundColor: '#0e1017',
          color: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          position: 'fixed',
          top: 0,
          bottom: 0,
          right: 0,
          zIndex: 1000,
          transition: 'transform 0.3s ease',
          boxShadow: '-4px 0 20px rgba(0,0,0,0.15)'
        }}
        className={`pm-admin-sidebar ${sidebarOpen ? 'open' : ''}`}
      >
        {/* Brand Header */}
        <div style={{
          padding: '22px 20px',
          borderBottom: '1px solid #1c202e',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img
              src="/logo.png"
              alt="POWER MAX"
              style={{ height: '36px', width: 'auto', objectFit: 'contain' }}
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
            <div>
              <div style={{ fontWeight: 900, fontSize: '16px', letterSpacing: '-0.5px' }}>
                POWER <span style={{ color: '#f20d16' }}>MAX</span>
              </div>
              <div style={{ fontSize: '11px', color: '#ffd21f', fontWeight: 700 }}>
                لوحة تحكم الإدارة
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            style={{
              background: 'none',
              border: 'none',
              color: '#a8a8b4',
              cursor: 'pointer',
              display: 'none'
            }}
            className="pm-admin-close-btn"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Items */}
        <nav style={{ flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={() => setSidebarOpen(false)}
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  textDecoration: 'none',
                  fontSize: '14px',
                  fontWeight: isActive ? 800 : 600,
                  color: isActive ? '#ffffff' : '#9ca3af',
                  backgroundColor: isActive ? '#f20d16' : 'transparent',
                  transition: 'background-color 0.15s ease, color 0.15s ease'
                })}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Footer actions: View Storefront & Logout */}
        <div style={{ padding: '16px 12px', borderTop: '1px solid #1c202e', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <Link
            to="/"
            target="_blank"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px 14px',
              borderRadius: '10px',
              textDecoration: 'none',
              fontSize: '13px',
              fontWeight: 600,
              color: '#d0d0d8',
              backgroundColor: '#191d2b'
            }}
          >
            <ExternalLink size={16} />
            <span>معاينة المتجر ↗</span>
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px 14px',
              borderRadius: '10px',
              border: 'none',
              fontSize: '13px',
              fontWeight: 600,
              color: '#ef4444',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              cursor: 'pointer',
              textAlign: 'right'
            }}
          >
            <LogOut size={16} />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div style={{ flex: 1, marginRight: '260px', display: 'flex', flexDirection: 'column', minWidth: 0 }} className="pm-admin-main">
        {/* Top Header */}
        <header style={{
          height: '65px',
          backgroundColor: '#ffffff',
          borderBottom: '1px solid #e9e9ee',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
          position: 'sticky',
          top: 0,
          zIndex: 100
        }}>
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            style={{
              display: 'none',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#202020'
            }}
            className="pm-admin-menu-btn"
          >
            <Menu size={24} />
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '14px', color: '#747474' }}>مرحباً بك:</span>
            <strong style={{ fontSize: '15px', color: '#101010' }}>{user?.name || 'المدير'}</strong>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <Link
              to="/"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '13px',
                fontWeight: 700,
                color: '#172cf4',
                textDecoration: 'none'
              }}
            >
              <span>عرض المتجر</span>
              <ExternalLink size={14} />
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main style={{ padding: '24px', flex: 1 }}>
          <Outlet />
        </main>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .pm-admin-sidebar {
            transform: translateX(100%);
          }
          .pm-admin-sidebar.open {
            transform: translateX(0);
          }
          .pm-admin-main {
            margin-right: 0 !important;
          }
          .pm-admin-menu-btn {
            display: block !important;
          }
          .pm-admin-close-btn {
            display: block !important;
          }
        }
      `}</style>
    </div>
  );
}
