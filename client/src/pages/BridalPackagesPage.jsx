import React, { useState, useEffect } from 'react';
import { Sparkles, Check, MessageCircle, ShoppingBag, ArrowLeft, Heart, ShieldCheck } from 'lucide-react';
import { bridalApi } from '../services/api';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

export default function BridalPackagesPage() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { showToast } = useToast();

  useEffect(() => {
    async function loadPackages() {
      try {
        setLoading(true);
        const res = await bridalApi.list();
        setPackages(res.data?.packages || []);
      } catch (err) {
        console.error('Error loading bridal packages', err);
      } finally {
        setLoading(false);
      }
    }
    loadPackages();
  }, []);

  const handleAddPackageToCart = (pkg) => {
    // Add as a special package item
    const packageProduct = {
      _id: pkg._id,
      name: `[باقة العروسة] ${pkg.name}`,
      slug: pkg.slug || pkg._id,
      price: pkg.price,
      compareAtPrice: pkg.compareAtPrice,
      image: pkg.image || '/logo.png',
      stock: 50,
      category: 'تجهيزات العروسة'
    };
    addToCart(packageProduct, 1);
    showToast(`تمت إضافة "${pkg.name}" إلى سلتك`, 'success');
  };

  return (
    <div style={{ maxWidth: '1280px', margin: '30px auto 70px auto', padding: '0 20px' }} dir="rtl">
      {/* Header Banner */}
      <div style={{
        textAlign: 'center',
        padding: '50px 20px',
        background: 'linear-gradient(135deg, #172cf4 0%, #0d1ec7 100%)',
        color: '#ffffff',
        borderRadius: '24px',
        marginBottom: '45px',
        boxShadow: '0 12px 35px rgba(23, 44, 244, 0.25)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          backgroundColor: '#ffd21f',
          color: '#080808',
          fontSize: '13px',
          fontWeight: 900,
          padding: '6px 16px',
          borderRadius: '9999px',
          marginBottom: '16px'
        }}>
          <Sparkles size={16} />
          <span>عروض وخصومات جهاز العروسة 👰</span>
        </div>

        <h1 style={{ fontSize: 'clamp(26px, 4vw, 38px)', fontWeight: 900, marginBottom: '14px' }}>
          جهّزي بيتك بالكامل مع باقات POWER MAX
        </h1>

        <p style={{
          fontSize: '15px',
          color: '#e0e0ff',
          maxWidth: '650px',
          margin: '0 auto',
          lineHeight: '1.7'
        }}>
          اخترنا لكِ أفضل وأجود أطقم الطهي، السفرة، المجات، ومستلزمات المطبخ في باقات متكاملة توفر لكِ الوقت والجهد وتمنحك أعلى توفير مضمون!
        </p>
      </div>

      {/* Packages Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#747474' }}>
          جاري تحميل باقات العروسة...
        </div>
      ) : packages.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#747474' }}>
          لا توجد باقات متاحة حالياً، ترقبوا عروضنا قريباً!
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '30px'
        }}>
          {packages.map((pkg) => {
            const hasDiscount = pkg.compareAtPrice > pkg.price;
            const savings = hasDiscount ? pkg.compareAtPrice - pkg.price : 0;
            const whatsappMsg = `مرحباً، أود حجز وتأكيد باقة "${pkg.name}" بسعر ${pkg.price} ج.م من موقع POWER MAX.`;
            const whatsappUrl = `https://wa.me/201000000000?text=${encodeURIComponent(whatsappMsg)}`;

            return (
              <div
                key={pkg._id}
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '24px',
                  border: '2px solid #e9e9ee',
                  boxShadow: '0 8px 30px rgba(0,0,0,0.06)',
                  padding: '30px 24px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  position: 'relative'
                }}
              >
                {/* Badge */}
                {pkg.badge && (
                  <div style={{
                    position: 'absolute',
                    top: '-12px',
                    right: '24px',
                    backgroundColor: '#f20d16',
                    color: '#ffffff',
                    fontWeight: 800,
                    fontSize: '12px',
                    padding: '4px 14px',
                    borderRadius: '9999px',
                    boxShadow: '0 4px 10px rgba(242, 13, 22, 0.3)'
                  }}>
                    {pkg.badge}
                  </div>
                )}

                <div>
                  <h3 style={{ fontSize: '22px', fontWeight: 900, color: '#101010', marginBottom: '8px' }}>
                    {pkg.name}
                  </h3>
                  <p style={{ fontSize: '13px', color: '#747474', lineHeight: '1.6', marginBottom: '20px' }}>
                    {pkg.description || 'باقة متكاملة تحتوي على كل ما يحتاجه البيت الجديد بجودة استثنائية.'}
                  </p>

                  {/* Pricing */}
                  <div style={{
                    backgroundColor: '#f8f8fa',
                    padding: '16px',
                    borderRadius: '16px',
                    marginBottom: '24px',
                    display: 'flex',
                    alignItems: 'baseline',
                    gap: '12px'
                  }}>
                    <span style={{ fontSize: '26px', fontWeight: 900, color: '#f20d16' }}>
                      {pkg.price.toLocaleString('ar-EG')} ج.م
                    </span>
                    {hasDiscount && (
                      <del style={{ fontSize: '15px', color: '#a8a8b4', fontWeight: 600 }}>
                        {pkg.compareAtPrice.toLocaleString('ar-EG')} ج.م
                      </del>
                    )}
                    {savings > 0 && (
                      <span style={{ fontSize: '12px', fontWeight: 800, color: '#20d927', marginRight: 'auto' }}>
                        وفري {savings.toLocaleString('ar-EG')} ج.م!
                      </span>
                    )}
                  </div>

                  {/* Items Included List */}
                  <div style={{ marginBottom: '24px' }}>
                    <h4 style={{ fontSize: '14px', fontWeight: 800, color: '#202020', marginBottom: '12px' }}>
                      محتويات ومكونات الباقة ({pkg.items?.length || 0}):
                    </h4>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {pkg.items?.map((item, idx) => (
                        <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '13px', color: '#363636' }}>
                          <div style={{
                            width: '20px',
                            height: '20px',
                            borderRadius: '50%',
                            backgroundColor: '#ecfdf5',
                            color: '#10b981',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                            marginTop: '2px'
                          }}>
                            <Check size={13} strokeWidth={3} />
                          </div>
                          <span>
                            {typeof item === 'object' ? (item.title || item.name || item.product?.name) : item}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={() => handleAddPackageToCart(pkg)}
                    style={{
                      width: '100%',
                      backgroundColor: '#f20d16',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '12px',
                      padding: '13px',
                      fontSize: '14px',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      boxShadow: '0 4px 14px rgba(242, 13, 22, 0.25)'
                    }}
                  >
                    <ShoppingBag size={17} />
                    <span>أضف الباقة للسلة</span>
                  </button>

                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      width: '100%',
                      backgroundColor: '#25D366',
                      color: '#ffffff',
                      borderRadius: '12px',
                      padding: '12px',
                      fontSize: '13px',
                      fontWeight: 700,
                      textDecoration: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px'
                    }}
                  >
                    <MessageCircle size={16} />
                    <span>حجز الباقة عبر واتساب</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
