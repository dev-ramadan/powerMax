import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Mail, User, Phone, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { authApi } from '../services/api';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password.length < 6) {
      setError('كلمة المرور يجب أن تكون 6 أحرف أو أرقام على الأقل');
      return;
    }

    try {
      setLoading(true);
      const res = await authApi.register(formData);
      const { token, user } = res.data;
      login(user, token);
      showToast(`تم إنشاء حسابك بنجاح! أهلاً بك يا ${user.name}`, 'success');
      navigate('/');
    } catch (err) {
      console.error('Register error:', err);
      const msg = err.response?.data?.message || 'حدث خطأ أثناء إنشاء الحساب، يرجى مراجعة البيانات';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '460px', margin: '50px auto 90px auto', padding: '0 20px' }} dir="rtl">
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '24px',
        border: '1px solid #e9e9ee',
        padding: '35px 30px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.04)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '25px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 900, color: '#101010', marginBottom: '6px' }}>
            إنشاء حساب جديد
          </h1>
          <p style={{ fontSize: '14px', color: '#747474', margin: 0 }}>
            انضم لعائلة POWER MAX واستمتع بمتابعة طلباتك وعروضنا الحصرية
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
              الاسم بالكامل
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="محمد أحمد"
                style={{
                  width: '100%',
                  padding: '11px 14px 11px 40px',
                  borderRadius: '10px',
                  border: '1.5px solid #d0d0d8',
                  fontSize: '14px'
                }}
              />
              <User size={18} color="#a8a8b4" style={{ position: 'absolute', left: '12px', top: '12px' }} />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px', color: '#363636' }}>
              رقم الموبايل
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                placeholder="01xxxxxxxxx"
                style={{
                  width: '100%',
                  padding: '11px 14px 11px 40px',
                  borderRadius: '10px',
                  border: '1.5px solid #d0d0d8',
                  fontSize: '14px',
                  direction: 'ltr',
                  textAlign: 'right'
                }}
              />
              <Phone size={18} color="#a8a8b4" style={{ position: 'absolute', left: '12px', top: '12px' }} />
            </div>
          </div>

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
                placeholder="6 أحرف أو أرقام على الأقل"
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
              marginTop: '8px',
              boxShadow: '0 4px 14px rgba(242, 13, 22, 0.3)'
            }}
          >
            {loading ? 'جاري التسجيل...' : 'إنشاء الحساب'}
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
          لديك حساب بالفعل؟{' '}
          <Link to="/login" style={{ color: '#172cf4', fontWeight: 800, textDecoration: 'none' }}>
            تسجيل الدخول
          </Link>
        </div>
      </div>
    </div>
  );
}
