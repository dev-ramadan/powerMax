import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, AlertCircle, LogIn, Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { authApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export default function AdminLoginPage() {
  const navigate  = useNavigate();
  const { login } = useAuth();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');

  const handleChange = (e) =>
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.email.trim() || !formData.password) {
      setError('يرجى إدخال البريد الإلكتروني وكلمة المرور');
      return;
    }

    try {
      setLoading(true);
      const res = await authApi.adminLogin({
        email:    formData.email.trim().toLowerCase(),
        password: formData.password,
      });
      const { token, user } = res.data;
      login(user, token);
      showToast('مرحباً بك في لوحة التحكم', 'success');
      navigate('/admin', { replace: true });
    } catch (err) {
      console.error('Admin login error', err);
      setError(
        err.response?.status === 401
          ? 'البريد الإلكتروني أو كلمة المرور غير صحيحة'
          : err.response?.data?.message || 'حدث خطأ، يرجى المحاولة مرة أخرى'
      );
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '12px 42px 12px 14px',
    borderRadius: '12px',
    border: '1px solid #2a2d3e',
    backgroundColor: '#0c0e17',
    color: '#ffffff',
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 0.2s',
    boxSizing: 'border-box',
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
        fontFamily: "'Cairo', sans-serif",
      }}
    >
      {/* Background glows */}
      <div style={{
        position: 'absolute', top: '10%', right: '10%',
        width: '350px', height: '350px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(242,13,22,0.1) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '10%', left: '10%',
        width: '280px', height: '280px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(23,44,244,0.08) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Card */}
      <div style={{
        width: '100%',
        maxWidth: '420px',
        backgroundColor: '#12141e',
        borderRadius: '28px',
        border: '1px solid rgba(255,255,255,0.06)',
        padding: '40px 32px 36px',
        color: '#ffffff',
        boxShadow: '0 25px 60px rgba(0,0,0,0.6)',
        position: 'relative',
        zIndex: 1,
      }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{
            width: '68px', height: '68px', borderRadius: '18px',
            backgroundColor: 'rgba(242,13,22,0.1)',
            border: '1px solid rgba(242,13,22,0.2)',
            boxShadow: '0 0 28px rgba(242,13,22,0.18)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 18px',
          }}>
            <ShieldCheck size={34} color="#f20d16" />
          </div>
          <h1 style={{ fontSize: '21px', fontWeight: 900, marginBottom: '6px' }}>
            تسجيل دخول الإدارة
          </h1>
          <p style={{ fontSize: '13px', color: '#6b7280', margin: 0 }}>
            لوحة تحكم POWER MAX — للمدير فقط
          </p>
        </div>

        {/* Error */}
        {error && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            backgroundColor: 'rgba(239,68,68,0.08)',
            border: '1px solid rgba(239,68,68,0.25)',
            color: '#f87171',
            padding: '12px 14px', borderRadius: '12px',
            marginBottom: '20px', fontSize: '13px', fontWeight: 600,
          }}>
            <AlertCircle size={15} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* Email */}
          <div>
            <label style={{
              display: 'block', fontSize: '12px', fontWeight: 700,
              color: '#9ca3af', marginBottom: '7px', letterSpacing: '0.3px',
            }}>
              البريد الإلكتروني
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="admin@example.com"
                autoComplete="username"
                required
                style={inputStyle}
                onFocus={e => { e.target.style.borderColor = '#f20d16'; }}
                onBlur={e  => { e.target.style.borderColor = '#2a2d3e'; }}
              />
              <Mail
                size={16}
                color="#4b5563"
                style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label style={{
              display: 'block', fontSize: '12px', fontWeight: 700,
              color: '#9ca3af', marginBottom: '7px', letterSpacing: '0.3px',
            }}>
              كلمة المرور
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPass ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••••"
                autoComplete="current-password"
                required
                style={{ ...inputStyle, paddingLeft: '80px' }}
                onFocus={e => { e.target.style.borderColor = '#f20d16'; }}
                onBlur={e  => { e.target.style.borderColor = '#2a2d3e'; }}
              />
              <Lock
                size={16}
                color="#4b5563"
                style={{ position: 'absolute', left: '44px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
              />
              <button
                type="button"
                onClick={() => setShowPass(v => !v)}
                style={{
                  position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: '#4b5563', padding: '2px', display: 'flex', alignItems: 'center',
                }}
                tabIndex={-1}
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: '8px',
              width: '100%',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
              background: loading
                ? 'rgba(242,13,22,0.4)'
                : 'linear-gradient(135deg, #f20d16 0%, #c20010 100%)',
              color: '#ffffff',
              border: 'none', borderRadius: '14px',
              padding: '14px', fontSize: '15px', fontWeight: 800,
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: loading ? 'none' : '0 6px 22px rgba(242,13,22,0.38)',
              transition: 'transform 0.15s, box-shadow 0.15s',
            }}
            onMouseEnter={e => {
              if (!loading) {
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = '0 10px 28px rgba(242,13,22,0.48)';
              }
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 6px 22px rgba(242,13,22,0.38)';
            }}
          >
            {loading ? (
              <>
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none"
                  style={{ animation: 'adminSpin 0.9s linear infinite' }}>
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"
                    strokeDasharray="31.4 62.8" strokeLinecap="round" />
                </svg>
                <span>جاري التحقق...</span>
              </>
            ) : (
              <>
                <LogIn size={17} />
                <span>دخول لوحة التحكم</span>
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <p style={{
          textAlign: 'center', marginTop: '22px',
          fontSize: '11px', color: '#2d3148', letterSpacing: '0.3px',
        }}>
          POWER MAX Admin Panel &copy; {new Date().getFullYear()}
        </p>
      </div>

      <style>{`
        @keyframes adminSpin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        input:-webkit-autofill,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:focus {
          -webkit-box-shadow: 0 0 0 1000px #0c0e17 inset !important;
          -webkit-text-fill-color: #ffffff !important;
          caret-color: #ffffff;
        }
      `}</style>
    </div>
  );
}
