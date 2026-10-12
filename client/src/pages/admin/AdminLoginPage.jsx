import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, Mail, AlertCircle, ArrowLeft } from 'lucide-react';
import { authApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    email: 'admin@powermax.eg',
    password: 'PowerMax@2025!'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      setLoading(true);
      const res = await authApi.adminLogin(formData);
      const { token, user } = res.data;

      login(user, token);
      showToast('تم تسجيل دخول المدير بنجاح', 'success');
      navigate('/admin', { replace: true });
    } catch (err) {
      console.error('Admin login error', err);
      const msg = err.response?.data?.message || 'بيانات الدخول غير صحيحة أو ليس لديك صلاحيات الإدارة';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#0a0a0c',
      padding: '20px'
    }} dir="rtl">
      <div style={{
        width: '100%',
        maxWidth: '420px',
        backgroundColor: '#14161f',
        borderRadius: '24px',
        border: '1px solid #232736',
        padding: '35px 30px',
        color: '#ffffff',
        boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
      }}>
        {/* Brand */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            backgroundColor: 'rgba(242, 13, 22, 0.15)',
            color: '#f20d16',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 14px auto'
          }}>
            <ShieldCheck size={32} />
          </div>
          <h1 style={{ fontSize: '22px', fontWeight: 900, marginBottom: '6px' }}>
            تسجيل دخول الإدارة
          </h1>
          <p style={{ fontSize: '13px', color: '#9ca3af', margin: 0 }}>
            لوحة تحكم POWER MAX للتحكم في المتجر والطلبات
          </p>
        </div>

        {error && (
          <div style={{
            backgroundColor: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid #ef4444',
            color: '#ef4444',
            padding: '12px',
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
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px', color: '#d0d0d8' }}>
              بريد المدير الإلكتروني
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '12px 14px 12px 40px',
                  borderRadius: '10px',
                  border: '1px solid #2e3447',
                  backgroundColor: '#0e1017',
                  color: '#ffffff',
                  fontSize: '14px'
                }}
              />
              <Mail size={18} color="#747474" style={{ position: 'absolute', left: '12px', top: '13px' }} />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px', color: '#d0d0d8' }}>
              كلمة مرور المدير
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '12px 14px 12px 40px',
                  borderRadius: '10px',
                  border: '1px solid #2e3447',
                  backgroundColor: '#0e1017',
                  color: '#ffffff',
                  fontSize: '14px'
                }}
              />
              <Lock size={18} color="#747474" style={{ position: 'absolute', left: '12px', top: '13px' }} />
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
              marginTop: '8px',
              boxShadow: '0 4px 15px rgba(242, 13, 22, 0.4)'
            }}
          >
            {loading ? 'جاري التحقق...' : 'تسجيل دخول الإدارة'}
          </button>
        </form>

        <div style={{
          marginTop: '24px',
          padding: '14px',
          borderRadius: '12px',
          backgroundColor: '#0e1017',
          border: '1px dashed #2e3447',
          fontSize: '12px',
          color: '#9ca3af',
          textAlign: 'center'
        }}>
          بيانات المدير الافتراضية:<br />
          <strong style={{ color: '#ffd21f' }}>admin@powermax.eg</strong> / <strong style={{ color: '#ffd21f' }}>PowerMax@2025!</strong>
          <button
            type="button"
            onClick={() => setFormData({ email: 'admin@powermax.eg', password: 'PowerMax@2025!' })}
            style={{
              display: 'block',
              margin: '8px auto 0 auto',
              backgroundColor: '#2e3447',
              color: '#ffffff',
              border: 'none',
              borderRadius: '6px',
              padding: '5px 12px',
              fontSize: '11px',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            تعبئة البيانات تلقائياً ⚡
          </button>
        </div>
      </div>
    </div>
  );
}
