import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ShoppingBag,
  MessageCircle,
  Truck,
  ShieldCheck,
  CheckCircle,
  Plus,
  Minus,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { productsApi } from '../services/api';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import ProductCard from '../components/common/ProductCard';

export default function ProductDetailPage() {
  const { slug } = useParams();
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState('');

  useEffect(() => {
    async function fetchProduct() {
      try {
        setLoading(true);
        // Try get by slug first, or id
        let res;
        try {
          res = await productsApi.getBySlug(slug);
        } catch {
          res = await productsApi.getById(slug);
        }

        const prod = res.data?.product;
        setProduct(prod);
        setSelectedImage(prod?.image || prod?.images?.[0] || '/logo.png');
        setQuantity(1);

        if (prod?._id) {
          try {
            const relRes = await productsApi.getRelated(prod._id);
            setRelated(relRes.data?.related || []);
          } catch {
            // ignore
          }
        }
      } catch (err) {
        console.error('Error fetching product detail', err);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 20px', color: '#747474' }} dir="rtl">
        جاري تحميل تفاصيل المنتج...
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{ maxWidth: '600px', margin: '80px auto', textAlign: 'center', padding: '0 20px' }} dir="rtl">
        <h2>عفواً، لم يتم العثور على المنتج</h2>
        <p style={{ color: '#747474', marginBottom: '20px' }}>ربما تم نقل المنتج أو حذفه</p>
        <Link
          to="/products"
          style={{
            backgroundColor: '#f20d16',
            color: '#ffffff',
            padding: '10px 24px',
            borderRadius: '10px',
            textDecoration: 'none',
            fontWeight: 700
          }}
        >
          العودة للمنتجات
        </Link>
      </div>
    );
  }

  const {
    name,
    price = 0,
    compareAtPrice = 0,
    sku,
    stock = 0,
    description,
    images = [],
    category
  } = product;

  const allImages = [product.image, ...(images || [])].filter(Boolean);
  const hasDiscount = compareAtPrice > price;
  const discountPercent = hasDiscount ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100) : 0;
  const isOutOfStock = stock <= 0;
  const categoryName = typeof category === 'object' ? category?.name : category;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(product, quantity);
    showToast(`تمت إضافة ${quantity} من "${name}" إلى سلتك`, 'success');
  };

  const whatsappMessage = `مرحباً، أود الاستفسار وطلب منتج "${name}" (كود: ${sku || ''}) بسعر ${price} ج.م الرابط: ${window.location.href}`;
  const whatsappUrl = `https://wa.me/201000000000?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <div style={{ maxWidth: '1280px', margin: '20px auto 70px auto', padding: '0 20px' }} dir="rtl">
      {/* Breadcrumbs */}
      <nav style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '13px',
        color: '#747474',
        marginBottom: '24px'
      }}>
        <Link to="/" style={{ color: '#747474', textDecoration: 'none' }}>الرئيسية</Link>
        <span>/</span>
        <Link to="/products" style={{ color: '#747474', textDecoration: 'none' }}>المنتجات</Link>
        {categoryName && (
          <>
            <span>/</span>
            <span style={{ color: '#202020', fontWeight: 600 }}>{categoryName}</span>
          </>
        )}
      </nav>

      {/* Main Product Layout */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '40px',
        backgroundColor: '#ffffff',
        padding: '30px',
        borderRadius: '24px',
        border: '1px solid #e9e9ee',
        boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
      }}>
        {/* Gallery Column */}
        <div>
          <div style={{
            width: '100%',
            height: '420px',
            borderRadius: '18px',
            overflow: 'hidden',
            backgroundColor: '#f8f8fa',
            border: '1px solid #e9e9ee',
            marginBottom: '14px',
            position: 'relative'
          }}>
            <img
              src={selectedImage || allImages[0] || '/logo.png'}
              alt={name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={(e) => { e.currentTarget.src = '/logo.png'; }}
            />
            {hasDiscount && (
              <span style={{
                position: 'absolute',
                top: '14px',
                right: '14px',
                backgroundColor: '#f20d16',
                color: '#ffffff',
                fontSize: '12px',
                fontWeight: 800,
                padding: '5px 10px',
                borderRadius: '8px'
              }}>
                خصم {discountPercent}%
              </span>
            )}
          </div>

          {/* Thumbnails */}
          {allImages.length > 1 && (
            <div style={{ display: 'flex', gap: '10px', overflowX: 'auto' }}>
              {allImages.map((img, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setSelectedImage(img)}
                  style={{
                    width: '70px',
                    height: '70px',
                    borderRadius: '10px',
                    overflow: 'hidden',
                    border: selectedImage === img ? '2px solid #f20d16' : '1px solid #e9e9ee',
                    padding: 0,
                    cursor: 'pointer',
                    backgroundColor: '#fff'
                  }}
                >
                  <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details Column */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {categoryName && (
            <span style={{
              display: 'inline-block',
              fontSize: '12px',
              fontWeight: 700,
              color: '#172cf4',
              backgroundColor: '#eeeeff',
              padding: '4px 10px',
              borderRadius: '6px',
              alignSelf: 'flex-start',
              marginBottom: '10px'
            }}>
              {categoryName}
            </span>
          )}

          <h1 style={{
            fontSize: '26px',
            fontWeight: 900,
            color: '#101010',
            lineHeight: '1.3',
            marginBottom: '12px'
          }}>
            {name}
          </h1>

          {sku && (
            <div style={{ fontSize: '13px', color: '#747474', marginBottom: '16px' }}>
              كود المنتج (SKU): <strong style={{ color: '#202020' }}>{sku}</strong>
            </div>
          )}

          {/* Price */}
          <div style={{
            display: 'flex',
            alignItems: 'baseline',
            gap: '12px',
            marginBottom: '20px',
            paddingBottom: '20px',
            borderBottom: '1px solid #f0f0f3'
          }}>
            <span style={{ fontSize: '28px', fontWeight: 900, color: '#f20d16' }}>
              {price.toLocaleString('ar-EG')} ج.م
            </span>
            {hasDiscount && (
              <del style={{ fontSize: '16px', color: '#a8a8b4', fontWeight: 600 }}>
                {compareAtPrice.toLocaleString('ar-EG')} ج.م
              </del>
            )}
            {hasDiscount && (
              <span style={{ fontSize: '13px', fontWeight: 700, color: '#20d927' }}>
                (وفرت {(compareAtPrice - price).toLocaleString('ar-EG')} ج.م)
              </span>
            )}
          </div>

          {/* Stock info */}
          <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{
              display: 'inline-block',
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              backgroundColor: isOutOfStock ? '#ef4444' : '#10b981'
            }} />
            <span style={{ fontSize: '13px', fontWeight: 700, color: isOutOfStock ? '#ef4444' : '#10b981' }}>
              {isOutOfStock ? 'نفد من المخزون حالياً' : `متوفر في المخزون (${stock} قطعة)`}
            </span>
          </div>

          {/* Quantity and Cart Buttons */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', marginBottom: '20px' }}>
            {/* Quantity Stepper */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              border: '1.5px solid #d0d0d8',
              borderRadius: '12px',
              overflow: 'hidden'
            }}>
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                style={{
                  background: '#f8f8fa',
                  border: 'none',
                  padding: '10px 14px',
                  cursor: 'pointer',
                  color: '#363636'
                }}
              >
                <Minus size={15} />
              </button>
              <span style={{
                padding: '0 16px',
                fontSize: '15px',
                fontWeight: 800,
                minWidth: '35px',
                textAlign: 'center'
              }}>
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity(Math.min(stock || 99, quantity + 1))}
                style={{
                  background: '#f8f8fa',
                  border: 'none',
                  padding: '10px 14px',
                  cursor: 'pointer',
                  color: '#363636'
                }}
              >
                <Plus size={15} />
              </button>
            </div>

            {/* Add to Cart Button */}
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              style={{
                flex: '1',
                minWidth: '200px',
                backgroundColor: isOutOfStock ? '#e9e9ee' : '#f20d16',
                color: isOutOfStock ? '#a8a8b4' : '#ffffff',
                border: 'none',
                borderRadius: '12px',
                padding: '14px 24px',
                fontSize: '15px',
                fontWeight: 800,
                cursor: isOutOfStock ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: isOutOfStock ? 'none' : '0 6px 20px rgba(242, 13, 22, 0.3)'
              }}
            >
              <ShoppingBag size={18} />
              <span>{isOutOfStock ? 'المنتج غير متوفر' : 'أضف إلى السلة'}</span>
            </button>
          </div>

          {/* Buy via WhatsApp direct button */}
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
              padding: '12px 20px',
              fontSize: '14px',
              fontWeight: 700,
              textDecoration: 'none',
              marginBottom: '25px',
              boxShadow: '0 4px 14px rgba(37, 211, 102, 0.25)'
            }}
          >
            <MessageCircle size={18} />
            <span>اشتري فوراً عبر واتساب</span>
          </a>

          {/* Value Props / Guarantee badges */}
          <div style={{
            backgroundColor: '#f8f8fa',
            borderRadius: '14px',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            fontSize: '13px',
            color: '#363636'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Truck size={17} color="#f20d16" />
              <span>شحن سريع لجميع المحافظات مع إمكانية المعاينة قبل الاستلام</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldCheck size={17} color="#20d927" />
              <span>ضمان استبدال واسترجاع لمدة 14 يوم ضد عيوب الصناعة</span>
            </div>
          </div>
        </div>
      </div>

      {/* Description Section */}
      <div style={{
        marginTop: '30px',
        backgroundColor: '#ffffff',
        borderRadius: '24px',
        padding: '30px',
        border: '1px solid #e9e9ee'
      }}>
        <h3 style={{ fontSize: '18px', fontWeight: 900, marginBottom: '16px', color: '#101010' }}>
          وصف المنتج ومميزاته
        </h3>
        <p style={{
          fontSize: '15px',
          color: '#525252',
          lineHeight: '1.8',
          whiteSpace: 'pre-line',
          margin: 0
        }}>
          {description || 'منتج أصلي عالي الجودة من POWER MAX، مصمم خصيصاً ليمنحك المتانة والعملية وسهولة الاستخدام في منزلك.'}
        </p>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <div style={{ marginTop: '50px' }}>
          <h3 style={{ fontSize: '22px', fontWeight: 900, marginBottom: '20px', color: '#101010' }}>
            منتجات ذات صلة
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
            gap: '20px'
          }}>
            {related.map((prod) => (
              <ProductCard key={prod._id} product={prod} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
