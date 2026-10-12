import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export default function CartDrawer() {
  const { cart, isCartOpen, setIsCartOpen, updateQuantity, removeFromCart, subtotal, totalItems } = useCart();
  const navigate = useNavigate();

  if (!isCartOpen) return null;

  const freeShippingThreshold = 500;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const progressPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 2000,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(3px)',
        display: 'flex',
        justifyContent: 'flex-start',
        animation: 'fadeIn 0.2s ease'
      }}
      onClick={() => setIsCartOpen(false)}
      dir="rtl"
    >
      <div
        style={{
          width: '100%',
          maxWidth: '430px',
          height: '100%',
          backgroundColor: '#ffffff',
          boxShadow: '-10px 0 30px rgba(0,0,0,0.15)',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          animation: 'slideInRight 0.25s ease'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div style={{
          padding: '18px 20px',
          borderBottom: '1px solid #e9e9ee',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#ffffff'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShoppingBag size={20} color="#f20d16" />
            <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 700, color: '#101010' }}>
              سلة المشتريات ({totalItems})
            </h3>
          </div>
          <button
            type="button"
            onClick={() => setIsCartOpen(false)}
            style={{
              background: '#f0f0f3',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#525252'
            }}
            aria-label="إغلاق السلة"
          >
            <X size={18} />
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div style={{
          padding: '12px 20px',
          backgroundColor: remainingForFreeShipping === 0 ? '#ecfdf5' : '#f8f8fa',
          borderBottom: '1px solid #e9e9ee'
        }}>
          {remainingForFreeShipping === 0 ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#059669', fontSize: '13px', fontWeight: 700 }}>
              <CheckCircle2 size={16} />
              <span>مبروك! لقد حصلت على شحن مجاني 🚚</span>
            </div>
          ) : (
            <div style={{ fontSize: '12px', fontWeight: 600, color: '#525252', marginBottom: '6px' }}>
              أضف بـ <strong style={{ color: '#f20d16' }}>{remainingForFreeShipping.toLocaleString('ar-EG')} ج.م</strong> إضافية للحصول على شحن مجاني!
            </div>
          )}
          <div style={{
            width: '100%',
            height: '6px',
            backgroundColor: '#e5e7eb',
            borderRadius: '9999px',
            overflow: 'hidden',
            marginTop: '4px'
          }}>
            <div style={{
              width: `${progressPercent}%`,
              height: '100%',
              backgroundColor: remainingForFreeShipping === 0 ? '#10b981' : '#f20d16',
              borderRadius: '9999px',
              transition: 'width 0.3s ease'
            }} />
          </div>
        </div>

        {/* Cart Items List */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '16px 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px'
        }}>
          {cart.length === 0 ? (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              textAlign: 'center',
              gap: '14px',
              color: '#747474'
            }}>
              <div style={{
                width: '70px',
                height: '70px',
                borderRadius: '50%',
                backgroundColor: '#f0f0f3',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <ShoppingBag size={34} color="#a8a8b4" />
              </div>
              <p style={{ margin: 0, fontWeight: 700, fontSize: '16px', color: '#202020' }}>سلة المشتريات فارغة</p>
              <p style={{ margin: 0, fontSize: '13px' }}>ابدأ التسوق واختر أفضل المنتجات لبيتك الآن</p>
              <button
                type="button"
                onClick={() => {
                  setIsCartOpen(false);
                  navigate('/products');
                }}
                style={{
                  marginTop: '8px',
                  backgroundColor: '#f20d16',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '10px 22px',
                  fontSize: '14px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                تصفح المنتجات
              </button>
            </div>
          ) : (
            cart.map((item) => {
              const { product, quantity } = item;
              return (
                <div
                  key={product._id}
                  style={{
                    display: 'flex',
                    gap: '12px',
                    paddingBottom: '14px',
                    borderBottom: '1px solid #f0f0f3'
                  }}
                >
                  <img
                    src={product.image || '/logo.png'}
                    alt={product.name}
                    style={{
                      width: '70px',
                      height: '70px',
                      objectFit: 'cover',
                      borderRadius: '10px',
                      backgroundColor: '#f8f8fa',
                      border: '1px solid #e9e9ee'
                    }}
                    onError={(e) => { e.currentTarget.src = '/logo.png'; }}
                  />

                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <h4 style={{
                          margin: '0 0 4px 0',
                          fontSize: '13px',
                          fontWeight: 700,
                          color: '#202020',
                          lineHeight: '1.4'
                        }}>
                          {product.name}
                        </h4>
                        <button
                          type="button"
                          onClick={() => removeFromCart(product._id)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#a8a8b4',
                            cursor: 'pointer',
                            padding: '4px'
                          }}
                          aria-label="حذف المنتج"
                          title="حذف"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <div style={{ fontSize: '13px', fontWeight: 800, color: '#f20d16' }}>
                        {product.price.toLocaleString('ar-EG')} ج.م
                      </div>
                    </div>

                    {/* Quantity Controls */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        border: '1px solid #d0d0d8',
                        borderRadius: '8px',
                        overflow: 'hidden'
                      }}>
                        <button
                          type="button"
                          onClick={() => updateQuantity(product._id, quantity - 1)}
                          style={{
                            background: '#f8f8fa',
                            border: 'none',
                            padding: '4px 8px',
                            cursor: 'pointer',
                            color: '#363636'
                          }}
                        >
                          <Minus size={13} />
                        </button>
                        <span style={{
                          padding: '2px 10px',
                          fontSize: '13px',
                          fontWeight: 700,
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
                            padding: '4px 8px',
                            cursor: 'pointer',
                            color: '#363636'
                          }}
                        >
                          <Plus size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Drawer Footer / Checkout CTA */}
        {cart.length > 0 && (
          <div style={{
            padding: '16px 20px',
            borderTop: '1px solid #e9e9ee',
            backgroundColor: '#ffffff',
            boxShadow: '0 -4px 15px rgba(0,0,0,0.03)'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '14px'
            }}>
              <span style={{ fontSize: '14px', fontWeight: 600, color: '#525252' }}>المجموع الفرعي:</span>
              <strong style={{ fontSize: '18px', fontWeight: 900, color: '#101010' }}>
                {subtotal.toLocaleString('ar-EG')} ج.م
              </strong>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button
                type="button"
                onClick={() => {
                  setIsCartOpen(false);
                  navigate('/checkout');
                }}
                style={{
                  width: '100%',
                  backgroundColor: '#f20d16',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '13px',
                  fontSize: '15px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 14px rgba(242, 13, 22, 0.28)'
                }}
              >
                <span>إتمام الطلب الآن</span>
                <ArrowLeft size={18} />
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsCartOpen(false);
                  navigate('/cart');
                }}
                style={{
                  width: '100%',
                  backgroundColor: '#f0f0f3',
                  color: '#202020',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '10px',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                عرض السلة كاملة
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
