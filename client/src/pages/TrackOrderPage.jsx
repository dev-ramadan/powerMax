import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Package, Clock, Truck, CheckCircle2, XCircle, AlertCircle, MessageCircle } from 'lucide-react';
import { ordersApi } from '../services/api';

const STEPS = [
  { key: 'pending', label: 'تم استلام الطلب', desc: 'تم تسجيل طلبك بنجاح في النظام' },
  { key: 'processing', label: 'جاري التجهيز والتغليف', desc: 'يتم تجهيز المنتجات وتغليفها للشحن' },
  { key: 'shipped', label: 'تم الشحن مع المندوب', desc: 'الطلب في طريقه لعنوانك' },
  { key: 'delivered', label: 'تم التوصيل بنجاح', desc: 'تم تسليم الطلب للعميل' }
];

function getStepIndex(status) {
  if (status === 'pending') return 0;
  if (status === 'confirmed' || status === 'processing') return 1;
  if (status === 'shipped') return 2;
  if (status === 'delivered') return 3;
  return 0;
}

export default function TrackOrderPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('query') || '';

  const [query, setQuery] = useState(initialQuery);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const searchOrder = async (orderIdOrNumber) => {
    if (!orderIdOrNumber?.trim()) return;
    try {
      setLoading(true);
      setError('');
      setOrder(null);
      const res = await ordersApi.getById(orderIdOrNumber.trim());
      setOrder(res.data?.order);
    } catch (err) {
      console.error('Track order err:', err);
      setError('عفواً، لم يتم العثور على طلب بهذا الرقم. تأكد من إدخال رقم الطلب بشكل صحيح (مثال: PM-...)');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialQuery) {
      searchOrder(initialQuery);
    }
  }, [initialQuery]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      setSearchParams({ query: query.trim() });
      searchOrder(query);
    }
  };

  const currentStep = order ? getStepIndex(order.status) : 0;
  const isCancelled = order?.status === 'cancelled';

  return (
    <div style={{ maxWidth: '850px', margin: '30px auto 70px auto', padding: '0 20px' }} dir="rtl">
      {/* Title */}
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 900, color: '#101010', marginBottom: '8px' }}>
          تتبع حالة طلبك
        </h1>
        <p style={{ fontSize: '14px', color: '#747474', margin: 0 }}>
          أدخل رقم الطلب لمعرفة خط سير شحنتك وموعد وصولها
        </p>
      </div>

      {/* Search Input Box */}
      <form
        onSubmit={handleSearch}
        style={{
          backgroundColor: '#ffffff',
          padding: '16px 20px',
          borderRadius: '18px',
          border: '1px solid #e9e9ee',
          boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
          display: 'flex',
          gap: '12px',
          marginBottom: '35px'
        }}
      >
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="أدخل رقم الطلب (مثال: PM-...)"
          required
          style={{
            flex: 1,
            padding: '12px 16px',
            borderRadius: '12px',
            border: '1.5px solid #d0d0d8',
            fontSize: '15px',
            fontFamily: 'inherit'
          }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            backgroundColor: '#f20d16',
            color: '#ffffff',
            border: 'none',
            borderRadius: '12px',
            padding: '0 24px',
            fontSize: '14px',
            fontWeight: 800,
            cursor: loading ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <Search size={18} />
          <span>{loading ? 'جاري البحث...' : 'تتبع الآن'}</span>
        </button>
      </form>

      {/* Error Message */}
      {error && (
        <div style={{
          backgroundColor: '#fef2f2',
          border: '1px solid #fecaca',
          color: '#ef4444',
          padding: '16px',
          borderRadius: '14px',
          marginBottom: '30px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontWeight: 600,
          fontSize: '14px'
        }}>
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {/* Order Status Display */}
      {order && (
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '24px',
          border: '1px solid #e9e9ee',
          padding: '30px',
          boxShadow: '0 6px 25px rgba(0,0,0,0.04)'
        }}>
          {/* Order Header Summary */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingBottom: '20px',
            borderBottom: '1px solid #f0f0f3',
            gap: '12px',
            marginBottom: '30px'
          }}>
            <div>
              <span style={{ fontSize: '13px', color: '#747474', display: 'block' }}>رقم الطلب:</span>
              <strong style={{ fontSize: '20px', fontWeight: 900, color: '#f20d16' }}>
                {order.orderNumber}
              </strong>
            </div>

            <div style={{ textAlign: 'left' }}>
              <span style={{ fontSize: '13px', color: '#747474', display: 'block' }}>تاريخ الطلب:</span>
              <span style={{ fontSize: '14px', fontWeight: 700, color: '#202020' }}>
                {new Date(order.createdAt).toLocaleDateString('ar-EG', { dateStyle: 'long' })}
              </span>
            </div>
          </div>

          {/* Cancelled Banner */}
          {isCancelled ? (
            <div style={{
              backgroundColor: '#fef2f2',
              color: '#ef4444',
              padding: '16px',
              borderRadius: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              fontWeight: 800,
              fontSize: '15px',
              marginBottom: '30px'
            }}>
              <XCircle size={22} />
              <span>تم إلغاء هذا الطلب. للتواصل مع خدمة العملاء يرجى مراسلتنا عبر واتساب.</span>
            </div>
          ) : (
            /* 4-Step Stepper */
            <div style={{ marginBottom: '40px' }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '10px',
                position: 'relative'
              }}>
                {STEPS.map((step, idx) => {
                  const isDone = idx <= currentStep;
                  const isCurrent = idx === currentStep;

                  return (
                    <div key={step.key} style={{ textAlign: 'center', position: 'relative' }}>
                      {/* Step Circle */}
                      <div style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '50%',
                        backgroundColor: isDone ? '#10b981' : '#f0f0f3',
                        color: isDone ? '#ffffff' : '#a8a8b4',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 10px auto',
                        fontWeight: 900,
                        fontSize: '15px',
                        border: isCurrent ? '3px solid #059669' : 'none',
                        boxShadow: isDone ? '0 4px 10px rgba(16, 185, 129, 0.3)' : 'none'
                      }}>
                        {isDone ? <CheckCircle2 size={20} /> : idx + 1}
                      </div>

                      <h4 style={{
                        margin: '0 0 4px 0',
                        fontSize: '13px',
                        fontWeight: isCurrent ? 900 : 700,
                        color: isDone ? '#101010' : '#a8a8b4'
                      }}>
                        {step.label}
                      </h4>
                      <p style={{
                        margin: 0,
                        fontSize: '11px',
                        color: '#747474',
                        lineHeight: '1.4'
                      }}>
                        {step.desc}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Details breakdown */}
          <div style={{
            backgroundColor: '#f8f8fa',
            borderRadius: '16px',
            padding: '20px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '20px',
            marginBottom: '25px'
          }}>
            <div>
              <h4 style={{ margin: '0 0 10px 0', fontSize: '14px', fontWeight: 800, color: '#101010' }}>
                بيانات التوصيل:
              </h4>
              <div style={{ fontSize: '13px', color: '#525252', lineHeight: '1.7' }}>
                <div>الاسم: <strong>{order.shippingAddress?.fullName}</strong></div>
                <div>الموبايل: <strong>{order.shippingAddress?.phone}</strong></div>
                <div>المحافظة: <strong>{order.shippingAddress?.city}</strong></div>
                <div>العنوان: <strong>{order.shippingAddress?.address}</strong></div>
              </div>
            </div>

            <div>
              <h4 style={{ margin: '0 0 10px 0', fontSize: '14px', fontWeight: 800, color: '#101010' }}>
                تفاصيل السداد:
              </h4>
              <div style={{ fontSize: '13px', color: '#525252', lineHeight: '1.7' }}>
                <div>طريقة الدفع: <strong>{order.paymentMethod === 'cod' ? 'الدفع عند الاستلام' : order.paymentMethod}</strong></div>
                <div>حالة الدفع: <strong>{order.paymentStatus === 'paid' ? 'تم الدفع ✓' : 'عند الاستلام'}</strong></div>
                <div>المبلغ الإجمالي: <strong style={{ color: '#f20d16', fontSize: '16px' }}>{order.total?.toLocaleString('ar-EG')} ج.م</strong></div>
              </div>
            </div>
          </div>

          {/* Items in order */}
          <div>
            <h4 style={{ fontSize: '15px', fontWeight: 800, color: '#101010', marginBottom: '14px' }}>
              المنتجات المطلوبة ({order.items?.length || 0}):
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {order.items?.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    backgroundColor: '#ffffff',
                    border: '1px solid #e9e9ee',
                    fontSize: '13px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Package size={18} color="#747474" />
                    <span style={{ fontWeight: 700, color: '#202020' }}>{item.productName || item.name}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '14px', color: '#525252' }}>
                    <span>الكمية: {item.quantity}</span>
                    <strong style={{ color: '#101010' }}>
                      {(item.lineTotal || (item.unitPrice * item.quantity) || 0).toLocaleString('ar-EG')} ج.م
                    </strong>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* WhatsApp Support CTA */}
          <div style={{ marginTop: '30px', textAlign: 'center' }}>
            <a
              href={`https://wa.me/201000000000?text=${encodeURIComponent(`مرحباً، أود الاستفسار عن حالة طلبي رقم ${order.orderNumber}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: '#25D366',
                color: '#ffffff',
                padding: '11px 22px',
                borderRadius: '12px',
                textDecoration: 'none',
                fontWeight: 700,
                fontSize: '14px'
              }}
            >
              <MessageCircle size={18} />
              <span>متابعة الطلب مع خدمة العملاء عبر واتساب</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
