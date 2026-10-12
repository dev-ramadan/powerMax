import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Package, LogOut, Phone, Mail, ShieldAlert, ArrowLeft, Truck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { ordersApi, authApi } from '../services/api';

export default function ProfilePage() {
  const { user, logout, updateUser, isAdmin } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  // Edit profile state
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || ''
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    // Fetch user orders
    ordersApi.getMyOrders()
      .then(res => {
        setOrders(res.data?.items || []);
      })
      .catch(err => console.error('Error fetching my orders', err))
      .finally(() => setLoadingOrders(false));
  }, [user, navigate]);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await authApi.updateProfile(formData);
      updateUser(res.data?.user);
      setIsEditing(false);
      showToast('تم تحديث بياناتك بنجاح', 'success');
    } catch (err) {
      console.error(err);
      showToast('حدث خطأ أثناء حفظ التعديلات', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (!user) return null;

  return (
    <div style={{ maxWidth: '1100px', margin: '30px auto 80px auto', padding: '0 20px' }} dir="rtl">
      {/* Header Profile Card */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '24px',
        border: '1px solid #e9e9ee',
        padding: '30px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
        marginBottom: '35px',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '20px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: '#172cf4',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px',
            fontWeight: 900
          }}>
            {user.name?.charAt(0) || 'U'}
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h1 style={{ fontSize: '22px', fontWeight: 900, color: '#101010', margin: 0 }}>
                {user.name}
              </h1>
              {isAdmin && (
                <span style={{
                  backgroundColor: '#fff0f0',
                  color: '#f20d16',
                  fontSize: '11px',
                  fontWeight: 800,
                  padding: '3px 8px',
                  borderRadius: '6px'
                }}>
                  مسؤول المتجر
                </span>
              )}
            </div>
            <div style={{ fontSize: '13px', color: '#747474', marginTop: '4px' }}>
              {user.email} {user.phone ? `• ${user.phone}` : ''}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {isAdmin && (
            <Link
              to="/admin"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: '#f20d16',
                color: '#ffffff',
                padding: '10px 18px',
                borderRadius: '12px',
                fontSize: '13px',
                fontWeight: 700,
                textDecoration: 'none'
              }}
            >
              <ShieldAlert size={16} />
              <span>لوحة تحكم الأدمن</span>
            </Link>
          )}

          <button
            type="button"
            onClick={() => setIsEditing(!isEditing)}
            style={{
              backgroundColor: '#f0f0f3',
              color: '#202020',
              border: 'none',
              padding: '10px 18px',
              borderRadius: '12px',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            {isEditing ? 'إلغاء التعديل' : 'تعديل البيانات'}
          </button>

          <button
            type="button"
            onClick={() => {
              logout();
              navigate('/');
            }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#fff1f2',
              color: '#ef4444',
              border: 'none',
              padding: '10px 18px',
              borderRadius: '12px',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            <LogOut size={16} />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </div>

      {/* Edit Profile Form */}
      {isEditing && (
        <form
          onSubmit={handleSaveProfile}
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '20px',
            border: '1px solid #e9e9ee',
            padding: '24px',
            marginBottom: '35px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '16px',
            alignItems: 'flex-end'
          }}
        >
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>الاسم</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
              style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #d0d0d8' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>رقم الموبايل</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              placeholder="01xxxxxxxxx"
              style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #d0d0d8' }}
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={saving}
              style={{
                backgroundColor: '#172cf4',
                color: '#ffffff',
                border: 'none',
                borderRadius: '10px',
                padding: '11px 24px',
                fontSize: '14px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              {saving ? 'جاري الحفظ...' : 'حفظ التغييرات'}
            </button>
          </div>
        </form>
      )}

      {/* My Orders Section */}
      <div>
        <h2 style={{ fontSize: '20px', fontWeight: 900, color: '#101010', marginBottom: '18px' }}>
          سجل طلباتي ({orders.length})
        </h2>

        {loadingOrders ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#747474' }}>
            جاري تحميل طلباتك...
          </div>
        ) : orders.length === 0 ? (
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '20px',
            border: '1px solid #e9e9ee',
            padding: '50px 20px',
            textAlign: 'center'
          }}>
            <Package size={40} color="#a8a8b4" style={{ marginBottom: '12px' }} />
            <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#202020', marginBottom: '6px' }}>
              لا توجد لديك طلبات سابقة
            </h3>
            <p style={{ fontSize: '13px', color: '#747474', marginBottom: '20px' }}>
              تصفح عروضنا ومنتجاتنا الآن وابدأ أول طلب!
            </p>
            <Link
              to="/products"
              style={{
                backgroundColor: '#f20d16',
                color: '#ffffff',
                padding: '10px 24px',
                borderRadius: '10px',
                textDecoration: 'none',
                fontWeight: 700,
                fontSize: '13px'
              }}
            >
              تصفح المنتجات
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {orders.map((ord) => (
              <div
                key={ord._id}
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '16px',
                  border: '1px solid #e9e9ee',
                  padding: '20px',
                  display: 'flex',
                  flexWrap: 'wrap',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '14px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                    <span style={{ fontSize: '15px', fontWeight: 900, color: '#f20d16' }}>
                      {ord.orderNumber}
                    </span>
                    <span style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      padding: '3px 8px',
                      borderRadius: '6px',
                      backgroundColor:
                        ord.status === 'delivered' ? '#ecfdf5' :
                        ord.status === 'shipped' ? '#eff6ff' :
                        ord.status === 'cancelled' ? '#fef2f2' : '#fefce8',
                      color:
                        ord.status === 'delivered' ? '#059669' :
                        ord.status === 'shipped' ? '#2563eb' :
                        ord.status === 'cancelled' ? '#dc2626' : '#ca8a04'
                    }}>
                      {ord.status === 'pending' ? 'قيد الانتظار' :
                       ord.status === 'processing' ? 'جاري التجهيز' :
                       ord.status === 'shipped' ? 'تم الشحن' :
                       ord.status === 'delivered' ? 'تم التوصيل' : 'ملغي'}
                    </span>
                  </div>

                  <div style={{ fontSize: '12px', color: '#747474' }}>
                    بتاريخ: {new Date(ord.createdAt).toLocaleDateString('ar-EG')} • {ord.items?.length || 0} أصناف
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <div style={{ textAlign: 'left' }}>
                    <span style={{ fontSize: '11px', color: '#747474', display: 'block' }}>الإجمالي:</span>
                    <strong style={{ fontSize: '16px', fontWeight: 900, color: '#101010' }}>
                      {ord.total?.toLocaleString('ar-EG')} ج.م
                    </strong>
                  </div>

                  <Link
                    to={`/track-order?query=${encodeURIComponent(ord.orderNumber)}`}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      backgroundColor: '#f0f0f3',
                      color: '#202020',
                      padding: '8px 14px',
                      borderRadius: '10px',
                      textDecoration: 'none',
                      fontSize: '12px',
                      fontWeight: 700
                    }}
                  >
                    <Truck size={15} />
                    <span>تتبع</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
