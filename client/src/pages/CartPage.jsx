import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Trash2, Plus, Minus, ArrowLeft, ArrowRight, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, clearCart, subtotal, totalItems } = useCart();
  const navigate = useNavigate();

  const shippingFee = subtotal >= 500 || subtotal === 0 ? 0 : 60;
  const grandTotal = subtotal + shippingFee;

  if (cart.length === 0) {
    return (
      <div style={{ maxWidth: '600px', margin: '80px auto', textAlign: 'center', padding: '0 20px' }} dir="rtl">
        <div style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          backgroundColor: '#f0f0f3',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 20px auto'
        }}>
          <ShoppingBag size={40} color="#a8a8b4" />
        </div>
        <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#101010', marginBottom: '8px' }}>
          سلة المشتريات فارغة
        </h2>
        <p style={{ color: '#747474', marginBottom: '24px' }}>
          لم تقم بإضافة أي منتجات للسلة بعد. تصفح منتجاتنا المميزة الآن!
        </p>
        <Link
          to="/products"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: '#f20d16',
            color: '#ffffff',
            padding: '12px 28px',
            borderRadius: '12px',
            textDecoration: 'none',
            fontWeight: 800
          }}
        >
          <span>تسوق الآن</span>
          <ArrowLeft size={18} />
        </Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1280px', margin: '30px auto 70px auto', padding: '0 20px' }} dir="rtl">
      <h1 style={{ fontSize: '26px', fontWeight: 900, marginBottom: '24px', color: '#101010' }}>
        سلة المشتريات ({totalItems} منتجات)
      </h1>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '30px',
        alignItems: 'flex-start'
      }}>
        {/* Items Table / Cards */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '20px',
          border: '1px solid #e9e9ee',
          padding: '24px',
          boxShadow: '0 4px 15px rgba(0,0,0,0.02)'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {cart.map((item) => {
              const { product, quantity } = item;
              return (
                <div
                  key={product._id}
                  style={{
                    display: 'flex',
                    gap: '16px',
                    paddingBottom: '20px',
                    borderBottom: '1px solid #f0f0f3',
                    alignItems: 'center'
                  }}
                >
                  <img
                    src={product.image || '/logo.png'}
                    alt={product.name}
                    style={{
                      width: '80px',
                      height: '80px',
                      borderRadius: '12px',
                      objectFit: 'cover',
                      border: '1px solid #e9e9ee',
                      backgroundColor: '#f8f8fa'
                    }}
                    onError={(e) => { e.currentTarget.src = '/logo.png'; }}
                  />

                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#101010', margin: '0 0 6px 0' }}>
                      {product.name}
                    </h3>
                    <div style={{ fontSize: '15px', fontWeight: 900, color: '#f20d16', marginBottom: '10px' }}>
                      {product.price.toLocaleString('ar-EG')} ج.م
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      {/* Stepper */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        border: '1.5px solid #d0d0d8',
                        borderRadius: '8px',
                        overflow: 'hidden'
                      }}>
                        <button
                          type="button"
                          onClick={() => updateQuantity(product._id, quantity - 1)}
                          style={{
                            background: '#f8f8fa',
                            border: 'none',
                            padding: '6px 10px',
                            cursor: 'pointer',
                            color: '#363636'
                          }}
                        >
                          <Minus size={13} />
                        </button>
                        <span style={{
                          padding: '0 12px',
                          fontSize: '14px',
                          fontWeight: 800,
                          minWidth: '24px',
                          textAlign: 'center'
                        }}>
                          {quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(product._id, quantity + 1)}
                          style={{
                            background: '#f8f8fa',
                            border: 'none',
                            padding: '6px 10px',
                            cursor: 'pointer',
                            color: '#363636'
                          }}
                        >
                          <Plus size={13} />
                        </button>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <span style={{ fontSize: '15px', fontWeight: 900, color: '#202020' }}>
                          {(product.price * quantity).toLocaleString('ar-EG')} ج.م
                        </span>

                        <button
                          type="button"
                          onClick={() => removeFromCart(product._id)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#ef4444',
                            cursor: 'pointer',
                            padding: '4px'
                          }}
                          title="حذف"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '20px'
          }}>
            <button
              type="button"
              onClick={clearCart}
              style={{
                background: 'none',
                border: 'none',
                color: '#747474',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              تفريغ السلة بالكامل
            </button>

            <Link
              to="/products"
              style={{
                color: '#172cf4',
                textDecoration: 'none',
                fontSize: '13px',
                fontWeight: 700
              }}
            >
              متابعة التسوق وإضافة منتجات أخرى ←
            </Link>
          </div>
        </div>

        {/* Order Summary Column */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '20px',
          border: '1px solid #e9e9ee',
          padding: '24px',
          boxShadow: '0 4px 15px rgba(0,0,0,0.02)'
        }}>
          <h3 style={{ fontSize: '18px', fontWeight: 900, color: '#101010', marginBottom: '20px' }}>
            ملخص الطلب
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#525252' }}>
              <span>المجموع الفرعي ({totalItems} منتجات):</span>
              <strong style={{ color: '#101010' }}>{subtotal.toLocaleString('ar-EG')} ج.م</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#525252' }}>
              <span>تكلفة الشحن:</span>
              <strong style={{ color: shippingFee === 0 ? '#10b981' : '#101010' }}>
                {shippingFee === 0 ? 'شحن مجاني 🚚' : `${shippingFee} ج.م`}
              </strong>
            </div>

            {shippingFee > 0 && (
              <div style={{
                backgroundColor: '#fff0f0',
                color: '#c80009',
                fontSize: '12px',
                padding: '8px 12px',
                borderRadius: '8px',
                fontWeight: 600
              }}>
                أضف بـ {(500 - subtotal).toLocaleString('ar-EG')} ج.م للحصول على شحن مجاني!
              </div>
            )}

            <div style={{ height: '1px', backgroundColor: '#e9e9ee', margin: '4px 0' }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: 900, color: '#101010' }}>
              <span>الإجمالي الكلي:</span>
              <span style={{ color: '#f20d16' }}>{grandTotal.toLocaleString('ar-EG')} ج.م</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate('/checkout')}
            style={{
              width: '100%',
              backgroundColor: '#f20d16',
              color: '#ffffff',
              border: 'none',
              borderRadius: '12px',
              padding: '14px',
              fontSize: '16px',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 4px 15px rgba(242, 13, 22, 0.3)',
              marginBottom: '16px'
            }}
          >
            <span>الانتقال للدفع وتأكيد الطلب</span>
            <ArrowLeft size={18} />
          </button>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '12px',
            color: '#747474',
            justifyContent: 'center'
          }}>
            <ShieldCheck size={16} color="#10b981" />
            <span>الدفع عند الاستلام بعد معاينة الطلب</span>
          </div>
        </div>
      </div>
    </div>
  );
}
