import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, MessageCircle, Mail, MapPin, Truck, ShieldCheck, Heart, Clock } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{
      backgroundColor: '#101010',
      color: '#ffffff',
      paddingTop: '50px',
      paddingBottom: '25px',
      marginTop: '60px',
      borderTop: '4px solid #f20d16'
    }} dir="rtl">
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '0 20px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '40px 30px'
      }}>
        {/* Brand Column */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <img
              src="/logo.png"
              alt="POWER MAX"
              style={{ height: '42px', width: 'auto', objectFit: 'contain', filter: 'brightness(0) invert(1)' }}
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            <span style={{ fontWeight: 900, fontSize: '20px', letterSpacing: '-0.5px' }}>
              POWER <span style={{ color: '#f20d16' }}>MAX</span>
            </span>
          </div>
          <p style={{ color: '#a8a8b4', fontSize: '13px', lineHeight: '1.7', marginBottom: '16px' }}>
            وجهتك الأولى لتجهيز البيت العصري وأدوات المطبخ وتجهيزات العروسة المتكاملة في مصر. جودة تدوم وضمان حقيقي.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', color: '#d0d0d8' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Truck size={16} color="#ffd21f" />
              <span>توصيل سريع لكافة محافظات مصر</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldCheck size={16} color="#20d927" />
              <span>معاينة المنتجات قبل الاستلام والدفع</span>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '18px', color: '#ffffff' }}>
            روابط سريعة
          </h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <li>
              <Link to="/" style={{ color: '#a8a8b4', textDecoration: 'none', fontSize: '13px' }}>الرئيسية</Link>
            </li>
            <li>
              <Link to="/products" style={{ color: '#a8a8b4', textDecoration: 'none', fontSize: '13px' }}>جميع المنتجات</Link>
            </li>
            <li>
              <Link to="/bridal" style={{ color: '#ffd21f', textDecoration: 'none', fontSize: '13px', fontWeight: 700 }}>
                عروض جهاز العروسة 👰
              </Link>
            </li>
            <li>
              <Link to="/track-order" style={{ color: '#a8a8b4', textDecoration: 'none', fontSize: '13px' }}>تتبع حالة طلبك</Link>
            </li>
            <li>
              <Link to="/cart" style={{ color: '#a8a8b4', textDecoration: 'none', fontSize: '13px' }}>سلة المشتريات</Link>
            </li>
          </ul>
        </div>

        {/* Categories */}
        <div>
          <h4 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '18px', color: '#ffffff' }}>
            أقسام المتجر
          </h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
            <li><Link to="/products?category=cooking-tools" style={{ color: '#a8a8b4', textDecoration: 'none' }}>أدوات الطهي والحلل</Link></li>
            <li><Link to="/products?category=dining-serving" style={{ color: '#a8a8b4', textDecoration: 'none' }}>السفرة والتقديم</Link></li>
            <li><Link to="/products?category=kitchen-setup" style={{ color: '#a8a8b4', textDecoration: 'none' }}>تجهيز المطبخ والمنظمات</Link></li>
            <li><Link to="/products?category=cups-mugs" style={{ color: '#a8a8b4', textDecoration: 'none' }}>الأكواب والمجات</Link></li>
            <li><Link to="/products?category=textiles-towels" style={{ color: '#a8a8b4', textDecoration: 'none' }}>المفروشات والمناشف</Link></li>
          </ul>
        </div>

        {/* Contact & Support */}
        <div>
          <h4 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '18px', color: '#ffffff' }}>
            خدمة العملاء والتواصل
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px', color: '#a8a8b4' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Phone size={16} color="#f20d16" />
              <span>خدمة العملاء: 01000000000</span>
            </div>
            <a
              href="https://wa.me/201000000000"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                color: '#20d927',
                textDecoration: 'none',
                fontWeight: 700
              }}
            >
              <MessageCircle size={16} />
              <span>تواصل واتساب مباشر</span>
            </a>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={16} color="#747474" />
              <span>يومياً من 10 صباحاً حتى 11 مساءً</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MapPin size={16} color="#747474" />
              <span>جمهورية مصر العربية — القاهرة</span>
            </div>
          </div>
        </div>
      </div>

      {/* Payment methods & Copyright */}
      <div style={{
        maxWidth: '1280px',
        margin: '35px auto 0 auto',
        padding: '20px 20px 0 20px',
        borderTop: '1px solid #202020',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
        fontSize: '12px',
        color: '#747474'
      }}>
        <div>
          جميع الحقوق محفوظة © {new Date().getFullYear()} <strong>POWER MAX</strong> — THE BEST IN HOME WORLD.
        </div>

        {/* Payment badges */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ padding: '4px 8px', borderRadius: '6px', backgroundColor: '#202020', color: '#d0d0d8', fontWeight: 600 }}>
            💵 الدفع عند الاستلام
          </span>
          <span style={{ padding: '4px 8px', borderRadius: '6px', backgroundColor: '#202020', color: '#d0d0d8', fontWeight: 600 }}>
            ⚡ إنستاباي Instapay
          </span>
          <span style={{ padding: '4px 8px', borderRadius: '6px', backgroundColor: '#202020', color: '#d0d0d8', fontWeight: 600 }}>
            📱 فودافون كاش
          </span>
        </div>
      </div>
    </footer>
  );
}
