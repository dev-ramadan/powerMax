import React, { useState, useEffect } from 'react';
import { Settings, Save, Sparkles, Truck, Phone, MessageCircle } from 'lucide-react';
import { settingsApi } from '../../services/api';
import { useToast } from '../../context/ToastContext';

export default function AdminSettingsPage() {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    storeName: 'POWER MAX',
    tagline: 'THE BEST IN HOME WORLD',
    phone: '01000000000',
    whatsapp: '01000000000',
    email: 'info@powermax.eg',
    address: 'القاهرة، مصر',
    shippingFee: 60,
    freeShippingThreshold: 500,
    announcementText: 'شحن مجاني على الطلبات فوق 500 ج.م — اطلب الآن! 🚚',
    announcementActive: true
  });

  useEffect(() => {
    async function loadSettings() {
      try {
        setLoading(true);
        const res = await settingsApi.get();
        if (res.data?.settings) {
          setFormData(prev => ({
            ...prev,
            ...res.data.settings
          }));
        }
      } catch (err) {
        console.error(err);
        showToast('فشل تحميل إعدادات المتجر', 'error');
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await settingsApi.update({
        ...formData,
        shippingFee: Number(formData.shippingFee),
        freeShippingThreshold: Number(formData.freeShippingThreshold)
      });
      showToast('تم حفظ إعدادات المتجر بنجاح', 'success');
    } catch (err) {
      console.error(err);
      showToast('فشل حفظ الإعدادات', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '60px', color: '#747474' }}>
        جاري تحميل الإعدادات...
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 900, color: '#101010', margin: '0 0 6px 0' }}>
          إعدادات المتجر وسياسات الشحن
        </h1>
        <p style={{ margin: 0, fontSize: '13px', color: '#747474' }}>
          التحكم في بيانات التواصل وأسعار الشحن وشريط الإعلانات العلوي
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '20px',
          border: '1px solid #e9e9ee',
          padding: '28px',
          boxShadow: '0 4px 15px rgba(0,0,0,0.02)',
          display: 'flex',
          flexDirection: 'column',
          gap: '22px'
        }}
      >
        {/* Basic Store Info */}
        <div>
          <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#101010', marginBottom: '16px' }}>
            البيانات الأساسية للمتجر
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>اسم المتجر</label>
              <input
                type="text"
                name="storeName"
                value={formData.storeName}
                onChange={handleChange}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #d0d0d8' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>الشعار النصي (Tagline)</label>
              <input
                type="text"
                name="tagline"
                value={formData.tagline}
                onChange={handleChange}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #d0d0d8' }}
              />
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div style={{ borderTop: '1px solid #f0f0f3', paddingTop: '20px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#101010', marginBottom: '16px' }}>
            بيانات التواصل والدعم
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>رقم خدمة العملاء (اتصال)</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #d0d0d8', direction: 'ltr', textAlign: 'right' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>رقم واتساب المباشر</label>
              <input
                type="text"
                name="whatsapp"
                value={formData.whatsapp}
                onChange={handleChange}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #d0d0d8', direction: 'ltr', textAlign: 'right' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>البريد الإلكتروني</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #d0d0d8' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>العنوان والمقر</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #d0d0d8' }}
              />
            </div>
          </div>
        </div>

        {/* Shipping Policies */}
        <div style={{ borderTop: '1px solid #f0f0f3', paddingTop: '20px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#101010', marginBottom: '16px' }}>
            تكاليف وسياسات الشحن
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>
                تكلفة الشحن الثابتة (ج.م)
              </label>
              <input
                type="number"
                name="shippingFee"
                value={formData.shippingFee}
                onChange={handleChange}
                min="0"
                style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #d0d0d8' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>
                الحد الأدنى للشحن المجاني (ج.م)
              </label>
              <input
                type="number"
                name="freeShippingThreshold"
                value={formData.freeShippingThreshold}
                onChange={handleChange}
                min="0"
                style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #d0d0d8' }}
              />
            </div>
          </div>
        </div>

        {/* Announcement Bar */}
        <div style={{ borderTop: '1px solid #f0f0f3', paddingTop: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#101010', margin: 0 }}>
              شريط الإعلانات العلوي
            </h3>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 700 }}>
              <input
                type="checkbox"
                name="announcementActive"
                checked={formData.announcementActive}
                onChange={handleChange}
              />
              <span>تفعيل الشريط</span>
            </label>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>نص الإعلان</label>
            <input
              type="text"
              name="announcementText"
              value={formData.announcementText}
              onChange={handleChange}
              placeholder="نص الإعلان الذي يظهر في أعلى المتجر..."
              style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #d0d0d8' }}
            />
          </div>
        </div>

        {/* Submit */}
        <div style={{ borderTop: '1px solid #f0f0f3', paddingTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
          <button
            type="submit"
            disabled={saving}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: '#f20d16',
              color: '#ffffff',
              border: 'none',
              borderRadius: '12px',
              padding: '12px 28px',
              fontSize: '14px',
              fontWeight: 800,
              cursor: saving ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 14px rgba(242, 13, 22, 0.3)'
            }}
          >
            <Save size={18} />
            <span>{saving ? 'جاري الحفظ...' : 'حفظ الإعدادات'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
