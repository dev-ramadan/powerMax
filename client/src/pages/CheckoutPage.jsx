import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Truck, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { ordersApi } from '../services/api';

const EGYPT_GOVERNORATES = [
  'القاهرة', 'الجيزة', 'الإسكندرية', 'القليوبية', 'الدقهلية', 'الشرقية',
  'المنوفية', 'الغربية', 'كفر الشيخ', 'دمياط', 'بورسعيد', 'الإسماعيلية',
  'السويس', 'البحيرة', 'الفيوم', 'بني سويف', 'المنيا', 'أسيوط',
  'سوهاج', 'قنا', 'الأقصر', 'أسوان', 'البحر الأحمر', 'مطروح',
  'شمال سيناء', 'جنوب سيناء', 'الوادي الجديد'
];

export default function CheckoutPage() {
  const { cart, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    alternatePhone: '',
    email: user?.email || '',
    governorate: 'القاهرة',
    city: '',
    address: '',
    notes: '',
    paymentMethod: 'cod'
  });

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const shippingFee = subtotal >= 500 || subtotal === 0 ? 0 : 60;
  const grandTotal = subtotal + shippingFee;

  if (cart.length === 0) {
    return (
      <div style={{ maxWidth: '500px', margin: '80px auto', textAlign: 'center', padding: '0 20px' }} dir="rtl">
        <h2>لا توجد منتجات لإتمام الطلب</h2>
        <p style={{ color: '#747474', marginBottom: '20px' }}>سلتك فارغة حالياً</p>
        <Link to="/products" style={{
          backgroundColor: '#f20d16',
          color: '#fff',
          padding: '10px 24px',
          borderRadius: '10px',
          textDecoration: 'none',
          fontWeight: 700
        }}>
          تسوق الآن
        </Link>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    // Validation
    if (!formData.name.trim()) {
      setErrorMsg('يرجى إدخال الاسم بالكامل');
      return;
    }
    const cleanPhone = formData.phone.trim();
    if (!cleanPhone || !/^01[0125][0-9]{8}$/.test(cleanPhone)) {
      setErrorMsg('يرجى إدخال رقم موبايل مصري صحيح مكون من 11 رقم (مثال: 01012345678)');
      return;
    }
    if (!formData.address.trim()) {
      setErrorMsg('يرجى كتابة العنوان بالتفصيل (اسم الشارع، رقم العمارة، الشقة)');
      return;
    }

    try {
      setSubmitting(true);
      const orderPayload = {
        items: cart.map(item => ({
          product: item.product._id,
          name: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
          image: item.product.image
        })),
        customerInfo: {
          name: formData.name.trim(),
          phone: cleanPhone,
          alternatePhone: formData.alternatePhone.trim() || undefined,
          email: formData.email.trim() || undefined
        },
        shippingAddress: {
          governorate: formData.governorate,
          city: formData.city.trim() || formData.governorate,
          addressLine: formData.address.trim(),
          notes: formData.notes.trim() || undefined
        },
        paymentMethod: formData.paymentMethod,
        subtotal,
        shippingFee,
        total: grandTotal
      };

      const res = await ordersApi.create(orderPayload);
      const createdOrder = res.data?.order;

      clearCart();
      showToast('تم تأكيد طلبك بنجاح!', 'success');
      navigate(`/order-success/${createdOrder?._id || ''}`, {
        state: { order: createdOrder }
      });
    } catch (err) {
      console.error('Checkout error:', err);
      const msg = err.response?.data?.message || 'حدث خطأ أثناء حفظ الطلب، يرجى المحاولة مرة أخرى.';
      setErrorMsg(msg);
      showToast(msg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: '1180px', margin: '30px auto 70px auto', padding: '0 20px' }} dir="rtl">
      <h1 style={{ fontSize: '26px', fontWeight: 900, marginBottom: '24px', color: '#101010' }}>
        إتمام الطلب والتوصيل
      </h1>

      {errorMsg && (
        <div style={{
          backgroundColor: '#fef2f2',
          border: '1px solid #fecaca',
          color: '#ef4444',
          padding: '14px 18px',
          borderRadius: '12px',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontWeight: 700,
          fontSize: '14px'
        }}>
          <AlertCircle size={20} />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '30px',
          alignItems: 'flex-start'
        }}>
          {/* Column 1: Customer & Delivery Details */}
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '20px',
            border: '1px solid #e9e9ee',
            padding: '28px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.02)'
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#101010', marginBottom: '20px' }}>
              بيانات المستلم وعنوان التوصيل
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px', color: '#363636' }}>
                  الاسم بالكامل <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="مثال: محمد أحمد علي"
                  style={{ width: '100%', padding: '11px 14px', borderRadius: '10px', border: '1px solid #d0d0d8', fontSize: '14px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px', color: '#363636' }}>
                    رقم الموبايل <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    placeholder="01xxxxxxxxx"
                    style={{ width: '100%', padding: '11px 14px', borderRadius: '10px', border: '1px solid #d0d0d8', fontSize: '14px', direction: 'ltr', textAlign: 'right' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px', color: '#363636' }}>
                    رقم واتساب أو بديل
                  </label>
                  <input
                    type="tel"
                    name="alternatePhone"
                    value={formData.alternatePhone}
                    onChange={handleChange}
                    placeholder="01xxxxxxxxx"
                    style={{ width: '100%', padding: '11px 14px', borderRadius: '10px', border: '1px solid #d0d0d8', fontSize: '14px', direction: 'ltr', textAlign: 'right' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px', color: '#363636' }}>
                    المحافظة <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <select
                    name="governorate"
                    value={formData.governorate}
                    onChange={handleChange}
                    style={{ width: '100%', padding: '11px 14px', borderRadius: '10px', border: '1px solid #d0d0d8', fontSize: '14px', backgroundColor: '#fff', cursor: 'pointer' }}
                  >
                    {EGYPT_GOVERNORATES.map(gov => (
                      <option key={gov} value={gov}>{gov}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px', color: '#363636' }}>
                    المنطقة / الحي / المركز
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="مثال: المعادي / الهرم / سموحة"
                    style={{ width: '100%', padding: '11px 14px', borderRadius: '10px', border: '1px solid #d0d0d8', fontSize: '14px' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px', color: '#363636' }}>
                  العنوان بالتفصيل <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  rows={2}
                  placeholder="اسم الشارع، رقم العمارة، رقم الشقة أو علامة مميزة"
                  style={{ width: '100%', padding: '11px 14px', borderRadius: '10px', border: '1px solid #d0d0d8', fontSize: '14px', resize: 'vertical' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px', color: '#363636' }}>
                  ملاحظات للمندوب أو وقت التسليم
                </label>
                <input
                  type="text"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="مثال: يرجى الاتصال قبل الوصول بساعة"
                  style={{ width: '100%', padding: '11px 14px', borderRadius: '10px', border: '1px solid #d0d0d8', fontSize: '14px' }}
                />
              </div>

              {/* Payment Methods */}
              <div style={{ marginTop: '10px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 800, marginBottom: '10px', color: '#101010' }}>
                  طريقة الدفع:
                </label>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '14px',
                    borderRadius: '12px',
                    border: formData.paymentMethod === 'cod' ? '2px solid #f20d16' : '1px solid #e9e9ee',
                    backgroundColor: formData.paymentMethod === 'cod' ? '#fff5f5' : '#ffffff',
                    cursor: 'pointer'
                  }}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={formData.paymentMethod === 'cod'}
                      onChange={handleChange}
                    />
                    <div>
                      <strong style={{ display: 'block', fontSize: '14px', color: '#101010' }}>الدفع عند الاستلام (COD)</strong>
                      <small style={{ color: '#747474' }}>ادفع نقداً للمندوب بعد استلام ومعاينة طلبك</small>
                    </div>
                  </label>

                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '14px',
                    borderRadius: '12px',
                    border: formData.paymentMethod === 'instapay' ? '2px solid #172cf4' : '1px solid #e9e9ee',
                    backgroundColor: formData.paymentMethod === 'instapay' ? '#eeeeff' : '#ffffff',
                    cursor: 'pointer'
                  }}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="instapay"
                      checked={formData.paymentMethod === 'instapay'}
                      onChange={handleChange}
                    />
                    <div>
                      <strong style={{ display: 'block', fontSize: '14px', color: '#101010' }}>إنستاباي (Instapay)</strong>
                      <small style={{ color: '#747474' }}>تحويل سريع، سيتم إرسال معرف الحساب بعد تأكيد الطلب</small>
                    </div>
                  </label>

                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '14px',
                    borderRadius: '12px',
                    border: formData.paymentMethod === 'vodafone_cash' ? '2px solid #ef4444' : '1px solid #e9e9ee',
                    backgroundColor: formData.paymentMethod === 'vodafone_cash' ? '#fff0f0' : '#ffffff',
                    cursor: 'pointer'
                  }}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="vodafone_cash"
                      checked={formData.paymentMethod === 'vodafone_cash'}
                      onChange={handleChange}
                    />
                    <div>
                      <strong style={{ display: 'block', fontSize: '14px', color: '#101010' }}>فودافون كاش / محافظ إلكترونية</strong>
                      <small style={{ color: '#747474' }}>تحويل للمحفظة مع إرسال سكرين شوت عبر واتساب</small>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Column 2: Order Review & Submit */}
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '20px',
            border: '1px solid #e9e9ee',
            padding: '24px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.02)'
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#101010', marginBottom: '18px' }}>
              مراجعة الطلب ({cart.length} أصناف)
            </h3>

            {/* Items list preview */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              maxHeight: '260px',
              overflowY: 'auto',
              marginBottom: '20px',
              paddingLeft: '4px'
            }}>
              {cart.map(item => (
                <div key={item.product._id} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <img
                    src={item.product.image || '/logo.png'}
                    alt=""
                    style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover', border: '1px solid #e9e9ee' }}
                    onError={(e) => { e.currentTarget.src = '/logo.png'; }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#202020', lineHeight: '1.3' }}>
                      {item.product.name}
                    </div>
                    <div style={{ fontSize: '12px', color: '#747474' }}>
                      الكمية: {item.quantity} × {item.product.price.toLocaleString('ar-EG')} ج.م
                    </div>
                  </div>
                  <strong style={{ fontSize: '13px', color: '#101010' }}>
                    {(item.product.price * item.quantity).toLocaleString('ar-EG')} ج.م
                  </strong>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div style={{
              borderTop: '1px solid #f0f0f3',
              paddingTop: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              marginBottom: '20px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#525252' }}>
                <span>المجموع الفرعي:</span>
                <span>{subtotal.toLocaleString('ar-EG')} ج.م</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#525252' }}>
                <span>الشحن والتوصيل ({formData.governorate}):</span>
                <span style={{ color: shippingFee === 0 ? '#10b981' : '#101010', fontWeight: 700 }}>
                  {shippingFee === 0 ? 'شحن مجاني' : `${shippingFee} ج.م`}
                </span>
              </div>
              <div style={{ borderTop: '1px solid #e9e9ee', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: 900, color: '#101010' }}>
                <span>المبلغ الإجمالي:</span>
                <span style={{ color: '#f20d16' }}>{grandTotal.toLocaleString('ar-EG')} ج.م</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              style={{
                width: '100%',
                backgroundColor: submitting ? '#a8a8b4' : '#f20d16',
                color: '#ffffff',
                border: 'none',
                borderRadius: '12px',
                padding: '15px',
                fontSize: '16px',
                fontWeight: 800,
                cursor: submitting ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 15px rgba(242, 13, 22, 0.3)'
              }}
            >
              <span>{submitting ? 'جاري تأكيد الطلب...' : 'تأكيد الطلب الآن'}</span>
              <ArrowLeft size={18} />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
