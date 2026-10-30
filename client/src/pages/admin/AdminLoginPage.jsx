import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, AlertCircle, LogIn } from 'lucide-react';
import { authApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

// Credentials are kept out of the visible UI
const ADMIN_EMAIL = 'admin@powermax.eg';
const ADMIN_PASS  = 'PowerMax@2025!';

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { showToast } = useToast();

  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const handleLogin = async () => {
    setError('');
    try {
      setLoading(true);
      const res = await authApi.adminLogin({ email: ADMIN_EMAIL, password: ADMIN_PASS });
      const { token, user } = res.data;
      login(user, token);
      showToast('مرحباً بك في لوحة التحكم', 'success');
      navigate('/admin', { replace: true });
    } catch (err) {
      console.error('Admin login error', err);
      setError(err.response?.data?.message || 'حدث خطأ، يرجى المحاولة مرة أخرى');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      dir="rtl"
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0a0a0c 0%, #0f111a 60%, #0a0a0c 100%)',
        padding: '20px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background glow effects */}
      <div style={{
        position: 'absolute', top: '10%', right: '10%',
        width: '400px', height: '400px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(242,13,22,0.12) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '10%', left: '10%',
        width: '300px', height: '300px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(23,44,244,0.1) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Card */}
      <div style={{
        width: '100%',
        maxWidth: '400px',
        backgroundColor: '#13151f',
        borderRadius: '28px',
        border: '1px solid rgba(255,255,255,0.07)',
        padding: '40px 32px',
        color: '#ffffff',
        boxShadow: '0 25px 60px rgba(0,0,0,0.6)',
        position: 'relative',
        zIndex: 1,
      }}>

        {/* Logo / Icon */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '72px',
            height: '72px',
            borderRadius: '20px',
            backgroundColor: 'rgba(242,13,22,0.12)',
            border: '1px solid rgba(242,13,22,0.25)',
            boxShadow: '0 0 30px rgba(242,13,22,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 18px',
          }}>
            <ShieldCheck size={36} color="#f20d16" />
          </div>

          <h1 style={{
            fontSize: '22px',
            fontWeight: 900,
            marginBottom: '8px',
            letterSpacing: '-0.3px',
          }}>
            لوحة تحكم POWER MAX
          </h1>
          <p style={{ fontSize: '13px', color: '#6b7280', margin: 0, lineHeight: 1.6 }}>
            منطقة مخصصة لفريق الإدارة فقط
          </p>
        </div>

        {/* Divider */}
        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.06)',
          marginBottom: '28px',
        }} />

        {/* Error message */}
        {error && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            backgroundColor: 'rgba(239,68,68,0.1)',
            border: '1px solid rgba(239,68,68,0.3)',
            color: '#f87171',
            padding: '12px 16px',
            borderRadius: '12px',
            marginBottom: '20px',
            fontSize: '13px',
            fontWeight: 600,
          }}>
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {/* Secure zone notice */}
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '12px',
          backgroundColor: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: '14px',
          padding: '16px',
          marginBottom: '28px',
        }}>
          <div style={{
            width: '8px', height: '8px', borderRadius: '50%',
            backgroundColor: '#10b981', flexShrink: 0, marginTop: '5px',
            boxShadow: '0 0 8px rgba(16,185,129,0.5)',
          }} />
          <div>
            <p style={{ margin: 0, fontSize: '13px', color: '#9ca3af', lineHeight: 1.7 }}>
              هذه المنطقة محمية ومخصصة للمدير فقط. سيتم تسجيل دخولك تلقائياً بصلاحيات الإدارة الكاملة.
            </p>
          </div>
        </div>

        {/* Login Button */}
        <button
          onClick={handleLogin}
          disabled={loading}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            background: loading
              ? 'rgba(242,13,22,0.5)'
              : 'linear-gradient(135deg, #f20d16 0%, #c20010 100%)',
            color: '#ffffff',
            border: 'none',
            borderRadius: '14px',
            padding: '15px',
            fontSize: '15px',
            fontWeight: 800,
            cursor: loading ? 'not-allowed' : 'pointer',
            boxShadow: loading ? 'none' : '0 6px 25px rgba(242,13,22,0.4)',
            transition: 'transform 0.15s, box-shadow 0.15s',
            letterSpacing: '0.3px',
          }}
          onMouseEnter={(e) => {
            if (!loading) {
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = '0 10px 30px rgba(242,13,22,0.5)';
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 6px 25px rgba(242,13,22,0.4)';
          }}
        >
          {loading ? (
            <>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ animation: 'spin 1s linear infinite' }}>
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="31.4 62.8" strokeLinecap="round" />
              </svg>
              <span>جاري التحقق...</span>
            </>
          ) : (
            <>
              <LogIn size={18} />
              <span>دخول لوحة التحكم</span>
            </>
          )}
        </button>

        {/* Footer note */}
        <p style={{
          textAlign: 'center',
          marginTop: '20px',
          fontSize: '11px',
          color: '#374151',
          letterSpacing: '0.3px',
        }}>
          POWER MAX Admin Panel &copy; {new Date().getFullYear()}
        </p>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
