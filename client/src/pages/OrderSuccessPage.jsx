import React, { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { CheckCircle2, MessageCircle, Package, ArrowLeft, Truck, Phone } from 'lucide-react';
import { ordersApi } from '../services/api';

export default function OrderSuccessPage() {
  const { orderId } = useParams();
  const location = useLocation();

  const [order, setOrder] = useState(location.state?.order || null);
  const [loading, setLoading] = useState(!order);

  useEffect(() => {
    if (!order && orderId) {
      ordersApi.getById(orderId)
        .then(res => setOrder(res.data?.order))
        .catch(err => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [order, orderId]);

  const orderNum = order?.orderNumber || (orderId ? orderId.slice(-6).toUpperCase() : 'PM-SUCCESS');
  const customerName = order?.customerInfo?.name || 'عميلنا العزيز';
  const customerPhone = order?.customerInfo?.phone || '';
  const totalAmount = order?.total || 0;

  const whatsappMessage = `مرحباً POWER MAX، قمت بعمل طلب جديد برقم (${orderNum}) باسم ${customerName} بمبلغ ${totalAmount} ج.م، أود تأكيد الطلب.`;
  const whatsappUrl = `https://wa.me/201000000000?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <div style={{ maxWidth: '680px', margin: '40px auto 80px auto', padding: '0 20px' }} dir="rtl">
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '24px',
        border: '1px solid #e9e9ee',
        padding: '40px 30px',
        boxShadow: '0 10px 40px rgba(0,0,0,0.04)',
        textAlign: 'center'
      }}>
        {/* Animated Checkmark */}
        <div style={{
          width: '76px',
          height: '76px',
          borderRadius: '50%',
          backgroundColor: '#ecfdf5',
          color: '#10b981',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 20px auto'
        }}>
          <CheckCircle2 size={46} strokeWidth={2.5} />
        </div>

        <h1 style={{ fontSize: '26px', fontWeight: 900, color: '#101010', marginBottom: '8px' }}>
          تم استلام طلبك بنجاح! 🎉
        </h1>

        <p style={{ fontSize: '15px', color: '#525252', lineHeight: '1.6', marginBottom: '24px' }}>
          شكراً لتسوقك من <strong>POWER MAX</strong>، سنقوم بتجهيز طلبك والتواصل معك لتأكيد الشحن والتوصيل.
        </p>

        {/* Order Number Box */}
        <div style={{
          backgroundColor: '#f8f8fa',
          border: '1.5px dashed #d0d0d8',
          borderRadius: '16px',
          padding: '16px 20px',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '30px'
        }}>
          <span style={{ fontSize: '13px', fontWeight: 600, color: '#747474' }}>رقم الطلب:</span>
          <strong style={{ fontSize: '18px', fontWeight: 900, color: '#f20d16', letterSpacing: '0.5px' }}>
            {orderNum}
          </strong>
        </div>

        {/* Details Breakdown if available */}
        {order && (
          <div style={{
            textAlign: 'right',
            backgroundColor: '#fafafa',
            borderRadius: '16px',
            padding: '20px',
            marginBottom: '30px',
            border: '1px solid #f0f0f3'
          }}>
            <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: 800, color: '#101010' }}>
              تفاصيل الشحن والتسليم:
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', color: '#525252' }}>
              <div>المستلم: <strong>{customerName}</strong> ({customerPhone})</div>
              <div>العنوان: <strong>{order.shippingAddress?.governorate} — {order.shippingAddress?.city} — {order.shippingAddress?.addressLine}</strong></div>
              <div>طريقة الدفع: <strong>{order.paymentMethod === 'cod' ? 'الدفع عند الاستلام' : order.paymentMethod}</strong></div>
              <div>المبلغ المطلوب: <strong style={{ color: '#f20d16', fontSize: '15px' }}>{totalAmount.toLocaleString('ar-EG')} ج.م</strong></div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              backgroundColor: '#25D366',
              color: '#ffffff',
              borderRadius: '12px',
              padding: '14px',
              fontSize: '15px',
              fontWeight: 800,
              textDecoration: 'none',
              boxShadow: '0 4px 14px rgba(37, 211, 102, 0.3)'
            }}
          >
            <MessageCircle size={18} />
            <span>تأكيد الطلب مع خدمة العملاء عبر واتساب</span>
          </a>

          <Link
            to={`/track-order?query=${encodeURIComponent(orderNum)}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              backgroundColor: '#f0f0f3',
              color: '#202020',
              borderRadius: '12px',
              padding: '12px',
              fontSize: '14px',
              fontWeight: 700,
              textDecoration: 'none'
            }}
          >
            <Truck size={17} />
            <span>تتبع حالة هذا الطلب</span>
          </Link>

          <Link
            to="/"
            style={{
              color: '#172cf4',
              textDecoration: 'none',
              fontSize: '13px',
              fontWeight: 700,
              marginTop: '6px'
            }}
          >
            العودة للصفحة الرئيسية ومتابعة التسوق
          </Link>
        </div>
      </div>
    </div>
  );
}
