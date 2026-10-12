import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  Sparkles,
  ShoppingBag,
  Heart,
  Truck,
  ShieldCheck,
  BadgePercent,
  Headset,
  Check,
  Star
} from 'lucide-react';
import ProductCard from '../components/common/ProductCard';
import { productsApi, categoriesApi, bridalApi } from '../services/api';

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [bridalPackages, setBridalPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [prodRes, catRes, bridalRes] = await Promise.all([
          productsApi.list({ limit: 8, featured: true }),
          categoriesApi.list(),
          bridalApi.list()
        ]);
        setFeaturedProducts(prodRes.data?.items || []);
        setCategories(catRes.data?.categories || []);
        setBridalPackages(bridalRes.data?.packages || []);
      } catch (err) {
        console.error('Failed to load homepage data', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div dir="rtl">
      {/* ─── Hero Section ──────────────────────────────────────────────────────── */}
      <section style={{
        background: 'linear-gradient(135deg, #0a0a0c 0%, #171822 100%)',
        color: '#ffffff',
        padding: '50px 20px 70px 20px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Glow Effects */}
        <div style={{
          position: 'absolute',
          top: '-10%',
          right: '5%',
          width: '350px',
          height: '350px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(242, 13, 22, 0.25) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-10%',
          left: '5%',
          width: '350px',
          height: '350px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(23, 44, 244, 0.25) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '40px',
          alignItems: 'center',
          position: 'relative',
          zIndex: 1
        }}>
          <div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              padding: '6px 14px',
              borderRadius: '9999px',
              fontSize: '13px',
              fontWeight: 700,
              color: '#ffd21f',
              marginBottom: '20px'
            }}>
              <Sparkles size={15} />
              <span>POWER MAX — THE BEST IN HOME WORLD</span>
            </div>

            <h1 style={{
              fontSize: 'clamp(28px, 5vw, 44px)',
              fontWeight: 900,
              lineHeight: '1.25',
              marginBottom: '18px',
              color: '#ffffff'
            }}>
              كل تفاصيل <span style={{ color: '#f20d16' }}>بيتك</span> وتجهيزات{' '}
              <span style={{ color: '#00d8d8' }}>العروسة</span> في مكان واحد
            </h1>

            <p style={{
              fontSize: '16px',
              color: '#d0d0d8',
              lineHeight: '1.7',
              marginBottom: '28px',
              maxWidth: '520px'
            }}>
              من أطقم الحلل والسفرة الفاخرة إلى منظمات المطبخ والمفروشات. جودة أصلية مختارة بعناية وأسعار تنافسية تناسب كل بيت مصري.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px' }}>
              <Link
                to="/products"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: '#f20d16',
                  color: '#ffffff',
                  padding: '13px 26px',
                  borderRadius: '12px',
                  fontSize: '15px',
                  fontWeight: 800,
                  textDecoration: 'none',
                  boxShadow: '0 6px 20px rgba(242, 13, 22, 0.4)'
                }}
              >
                <span>تسوق الآن</span>
                <ArrowLeft size={18} />
              </Link>

              <Link
                to="/bridal"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: 'rgba(255, 255, 255, 0.12)',
                  color: '#ffffff',
                  border: '1px solid rgba(255, 255, 255, 0.25)',
                  padding: '13px 24px',
                  borderRadius: '12px',
                  fontSize: '15px',
                  fontWeight: 700,
                  textDecoration: 'none'
                }}
              >
                <span>عروض جهاز العروسة 👰</span>
              </Link>
            </div>
          </div>

          <div style={{ position: 'relative' }}>
            <div style={{
              borderRadius: '24px',
              overflow: 'hidden',
              boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
              border: '2px solid rgba(255,255,255,0.1)',
              position: 'relative'
            }}>
              <img
                src="https://res.cloudinary.com/dmdltantp/image/upload/v1791817463/IMG-20261012-WA0001_wzggng.jpg"
                alt="POWER MAX Kitchen & Home"
                style={{ width: '100%', height: '380px', objectFit: 'cover' }}
              />
            </div>

            {/* Floating Trust Card */}
            <div style={{
              position: 'absolute',
              bottom: '-20px',
              right: '20px',
              backgroundColor: '#ffffff',
              color: '#101010',
              padding: '14px 20px',
              borderRadius: '16px',
              boxShadow: '0 12px 30px rgba(0,0,0,0.25)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              border: '1px solid #e9e9ee'
            }}>
              <div style={{
                backgroundColor: '#ecfdf5',
                color: '#10b981',
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <ShieldCheck size={24} />
              </div>
              <div>
                <strong style={{ display: 'block', fontSize: '14px', fontWeight: 800 }}>ضمان وجودة أصلية</strong>
                <span style={{ fontSize: '12px', color: '#747474' }}>معاينة المنتج قبل الدفع</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Benefits Section ──────────────────────────────────────────────────── */}
      <section style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '35px 20px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '20px'
      }}>
        {[
          { icon: Truck, color: '#f20d16', title: 'شحن لجميع المحافظات', desc: 'توصيل سريع وآمن حتى باب بيتك' },
          { icon: ShieldCheck, color: '#172cf4', title: 'معاينة قبل الاستلام', desc: 'افتح وعاين أوردرك واطمن بنفسك' },
          { icon: BadgePercent, color: '#ffd21f', title: 'أسعار وعروض مميزة', desc: 'أعلى قيمة مقابل أفضل سعر' },
          { icon: Headset, color: '#20d927', title: 'خدمة عملاء ودعم سريع', desc: 'متواجدين دايماً عبر واتساب' }
        ].map((item, idx) => (
          <div
            key={idx}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              backgroundColor: '#ffffff',
              padding: '16px 18px',
              borderRadius: '14px',
              border: '1px solid #e9e9ee',
              boxShadow: '0 2px 10px rgba(0,0,0,0.02)'
            }}
          >
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              backgroundColor: `${item.color}15`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: item.color,
              flexShrink: 0
            }}>
              <item.icon size={22} />
            </div>
            <div>
              <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 800, color: '#101010' }}>{item.title}</h4>
              <p style={{ margin: '3px 0 0 0', fontSize: '12px', color: '#747474' }}>{item.desc}</p>
            </div>
          </div>
        ))}
      </section>

      {/* ─── Categories Section ────────────────────────────────────────────────── */}
      <section style={{
        maxWidth: '1280px',
        margin: '20px auto 40px auto',
        padding: '0 20px'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          marginBottom: '22px'
        }}>
          <div>
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#f20d16', display: 'block', marginBottom: '4px' }}>
              تصنيفات البيت
            </span>
            <h2 style={{ fontSize: '24px', fontWeight: 900, color: '#101010', margin: 0 }}>
              تسوق حسب القسم
            </h2>
          </div>
          <Link
            to="/products"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              color: '#172cf4',
              fontWeight: 700,
              fontSize: '14px',
              textDecoration: 'none'
            }}
          >
            <span>عرض كل الأقسام</span>
            <ArrowLeft size={16} />
          </Link>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
          gap: '14px'
        }}>
          {categories.map((cat) => (
            <Link
              key={cat._id}
              to={`/products?category=${cat.slug}`}
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #e9e9ee',
                borderRadius: '16px',
                padding: '18px 14px',
                textAlign: 'center',
                textDecoration: 'none',
                color: '#202020',
                boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                transition: 'transform 0.2s ease, border-color 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.borderColor = '#f20d16';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = '#e9e9ee';
              }}
            >
              <div style={{
                width: '54px',
                height: '54px',
                borderRadius: '50%',
                backgroundColor: '#f8f8fa',
                margin: '0 auto 10px auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden'
              }}>
                {cat.image ? (
                  <img src={cat.image} alt={cat.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <Sparkles size={24} color="#f20d16" />
                )}
              </div>
              <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 800 }}>{cat.name}</h3>
            </Link>
          ))}
        </div>
      </section>

      {/* ─── Featured Products Section ─────────────────────────────────────────── */}
      <section style={{
        maxWidth: '1280px',
        margin: '0 auto 50px auto',
        padding: '0 20px'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          marginBottom: '22px'
        }}>
          <div>
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#f20d16', display: 'block', marginBottom: '4px' }}>
              اختيارات POWER MAX الأكثر طلباً
            </span>
            <h2 style={{ fontSize: '24px', fontWeight: 900, color: '#101010', margin: 0 }}>
              منتجات مميزة لبيتك
            </h2>
          </div>
          <Link
            to="/products"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              color: '#172cf4',
              fontWeight: 700,
              fontSize: '14px',
              textDecoration: 'none'
            }}
          >
            <span>كل المنتجات</span>
            <ArrowLeft size={16} />
          </Link>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '50px 0', color: '#747474' }}>
            جاري تحميل المنتجات...
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
            gap: '20px'
          }}>
            {featuredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* ─── Bridal Packages Banner ────────────────────────────────────────────── */}
      <section style={{
        maxWidth: '1280px',
        margin: '0 auto 60px auto',
        padding: '0 20px'
      }}>
        <div style={{
          background: 'linear-gradient(135deg, #172cf4 0%, #0d1ec7 100%)',
          borderRadius: '24px',
          color: '#ffffff',
          padding: '40px 30px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '30px',
          alignItems: 'center',
          boxShadow: '0 15px 40px rgba(23, 44, 244, 0.3)'
        }}>
          <div>
            <div style={{
              display: 'inline-block',
              backgroundColor: '#ffd21f',
              color: '#080808',
              fontWeight: 900,
              fontSize: '12px',
              padding: '4px 12px',
              borderRadius: '9999px',
              marginBottom: '14px'
            }}>
              عروض خاصة وحصرية
            </div>
            <h2 style={{ fontSize: '28px', fontWeight: 900, marginBottom: '12px' }}>
              باقات تجهيز العروسة المتكاملة 👰
            </h2>
            <p style={{ color: '#e0e0ff', fontSize: '15px', lineHeight: '1.7', marginBottom: '22px' }}>
              وفّري وقتك ومجهودك مع باقات جهاز العروسة من POWER MAX. جمعنا لكِ كل أساسيات المطبخ والبيت في باقة واحدة بخصومات تصل إلى 30%!
            </p>
            <Link
              to="/bridal"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: '#ffffff',
                color: '#172cf4',
                padding: '12px 24px',
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: 800,
                textDecoration: 'none'
              }}
            >
              <span>استكشف باقات العروسة</span>
              <ArrowLeft size={16} />
            </Link>
          </div>

          {/* Quick Package Previews */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {bridalPackages.slice(0, 2).map((pkg) => (
              <div
                key={pkg._id}
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '16px',
                  padding: '18px 20px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 800 }}>{pkg.name}</h4>
                  <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#e0e0ff' }}>
                    {pkg.items?.length || 0} قطعة ومكون أساسي
                  </p>
                </div>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: '18px', fontWeight: 900, color: '#ffd21f' }}>
                    {pkg.price.toLocaleString('ar-EG')} ج.م
                  </div>
                  {pkg.compareAtPrice > pkg.price && (
                    <del style={{ fontSize: '12px', color: '#c0c0e0' }}>
                      {pkg.compareAtPrice.toLocaleString('ar-EG')} ج.م
                    </del>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
