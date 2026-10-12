import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Lock, Mail, ArrowLeft, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { authApi } from '../services/api';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const from = location.state?.from?.pathname || '/';

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      setLoading(true);
      const res = await authApi.login(formData);
      const { token, user } = res.data;
      login(user, token);
      showToast(`أهلاً بك مجدداً، ${user.name}!`, 'success');
      navigate(from, { replace: true });
    } catch (err) {
      console.error('Login error:', err);
      const msg = err.response?.data?.message || 'البريد الإلكتروني أو كلمة المرور غير صحيحة';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '440px', margin: '60px auto 90px auto', padding: '0 20px' }} dir="rtl">
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '24px',
        border: '1px solid #e9e9ee',
        padding: '35px 30px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.04)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '25px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 900, color: '#101010', marginBottom: '6px' }}>
            تسجيل الدخول
          </h1>
          <p style={{ fontSize: '14px', color: '#747474', margin: 0 }}>
            أهلاً بك في متجر POWER MAX
          </p>
        </div>

        {error && (
          <div style={{
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            color: '#ef4444',
            padding: '12px 14px',
            borderRadius: '10px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '13px',
            fontWeight: 700
          }}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px', color: '#363636' }}>
              البريد الإلكتروني
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="name@example.com"
                style={{
                  width: '100%',
                  padding: '11px 14px 11px 40px',
                  borderRadius: '10px',
                  border: '1.5px solid #d0d0d8',
                  fontSize: '14px'
                }}
              />
              <Mail size={18} color="#a8a8b4" style={{ position: 'absolute', left: '12px', top: '12px' }} />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px', color: '#363636' }}>
              كلمة المرور
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="••••••••"
                style={{
                  width: '100%',
                  padding: '11px 14px 11px 40px',
                  borderRadius: '10px',
                  border: '1.5px solid #d0d0d8',
                  fontSize: '14px'
                }}
              />
              <Lock size={18} color="#a8a8b4" style={{ position: 'absolute', left: '12px', top: '12px' }} />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              backgroundColor: '#f20d16',
              color: '#ffffff',
              border: 'none',
              borderRadius: '12px',
              padding: '13px',
              fontSize: '15px',
              fontWeight: 800,
              cursor: loading ? 'not-allowed' : 'pointer',
              marginTop: '6px',
              boxShadow: '0 4px 14px rgba(242, 13, 22, 0.3)'
            }}
          >
            {loading ? 'جاري التحقق...' : 'تسجيل الدخول'}
          </button>
        </form>

        <div style={{
          marginTop: '25px',
          paddingTop: '20px',
          borderTop: '1px solid #f0f0f3',
          textAlign: 'center',
          fontSize: '13px',
          color: '#525252'
        }}>
          ليس لديك حساب بعد؟{' '}
          <Link to="/register" style={{ color: '#172cf4', fontWeight: 800, textDecoration: 'none' }}>
            إنشاء حساب جديد
          </Link>
        </div>
      </div>
    </div>
  );
}
