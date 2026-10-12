import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Eye, Heart, Sparkles } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { showToast } = useToast();

  if (!product) return null;

  const {
    _id,
    name,
    slug,
    price = 0,
    compareAtPrice = 0,
    categoryName,
    category,
    image,
    images = [],
    stock = 0,
    featured = false
  } = product;

  const displayImage = image || images[0] || '/logo.png';
  const displayCategory = categoryName || (typeof category === 'object' ? category?.name : category) || 'POWER MAX';
  const hasDiscount = compareAtPrice > price;
  const discountPercent = hasDiscount ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100) : 0;
  const isOutOfStock = stock <= 0;
  const productUrl = `/product/${slug || _id}`;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) {
      showToast('عفواً، نفدت كمية هذا المنتج حالياً', 'warning');
      return;
    }
    addToCart(product, 1);
    showToast(`تمت إضافة "${name}" إلى سلتك`, 'success');
  };

  return (
    <article
      style={{
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        overflow: 'hidden',
        border: '1px solid #e9e9ee',
        boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        height: '100%'
      }}
      className="pm-card"
      dir="rtl"
    >
      {/* Product Image Area */}
      <div style={{
        position: 'relative',
        width: '100%',
        paddingTop: '85%',
        backgroundColor: '#f8f8fa',
        overflow: 'hidden'
      }}>
        <Link to={productUrl} style={{ position: 'absolute', inset: 0 }}>
          <img
            src={displayImage}
            alt={name}
            loading="lazy"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.3s ease'
            }}
            onError={(e) => {
              e.currentTarget.src = 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=600&q=80';
            }}
          />
        </Link>

        {/* Badges */}
        <div style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          display: 'flex',
          flexDirection: 'column',
          gap: '5px',
          zIndex: 2
        }}>
          {hasDiscount && (
            <span style={{
              backgroundColor: '#f20d16',
              color: '#ffffff',
              fontSize: '11px',
              fontWeight: 800,
              padding: '4px 8px',
              borderRadius: '6px',
              boxShadow: '0 2px 6px rgba(242,13,22,0.3)'
            }}>
              خصم {discountPercent}%
            </span>
          )}
          {featured && (
            <span style={{
              backgroundColor: '#172cf4',
              color: '#ffffff',
              fontSize: '11px',
              fontWeight: 700,
              padding: '3px 8px',
              borderRadius: '6px'
            }}>
              مميز ★
            </span>
          )}
        </div>

        {/* Stock Status Badge */}
        {isOutOfStock && (
          <div style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: 'rgba(255,255,255,0.85)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            color: '#c80009',
            fontSize: '14px',
            zIndex: 3
          }}>
            نفد من المخزون
          </div>
        )}
      </div>

      {/* Product Info */}
      <div style={{
        padding: '14px',
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        justifyContent: 'space-between'
      }}>
        <div>
          <span style={{
            fontSize: '11px',
            fontWeight: 700,
            color: '#747474',
            backgroundColor: '#f0f0f3',
            padding: '2px 8px',
            borderRadius: '4px',
            display: 'inline-block',
            marginBottom: '6px'
          }}>
            {displayCategory}
          </span>

          <Link
            to={productUrl}
            style={{
              textDecoration: 'none',
              color: '#101010',
              fontWeight: 700,
              fontSize: '14px',
              lineHeight: '1.4',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              minHeight: '38px',
              marginBottom: '10px'
            }}
          >
            {name}
          </Link>
        </div>

        <div>
          {/* Price Row */}
          <div style={{
            display: 'flex',
            alignItems: 'baseline',
            gap: '8px',
            marginBottom: '12px'
          }}>
            <span style={{ fontSize: '18px', fontWeight: 900, color: '#f20d16' }}>
              {price.toLocaleString('ar-EG')} ج.م
            </span>
            {hasDiscount && (
              <del style={{ fontSize: '13px', color: '#a8a8b4', fontWeight: 600 }}>
                {compareAtPrice.toLocaleString('ar-EG')} ج.م
              </del>
            )}
          </div>

          {/* Action Buttons */}
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            style={{
              width: '100%',
              backgroundColor: isOutOfStock ? '#e9e9ee' : '#080808',
              color: isOutOfStock ? '#a8a8b4' : '#ffffff',
              border: 'none',
              borderRadius: '10px',
              padding: '10px 14px',
              fontSize: '13px',
              fontWeight: 700,
              cursor: isOutOfStock ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              transition: 'background-color 0.15s ease'
            }}
            onMouseEnter={(e) => {
              if (!isOutOfStock) e.currentTarget.style.backgroundColor = '#f20d16';
            }}
            onMouseLeave={(e) => {
              if (!isOutOfStock) e.currentTarget.style.backgroundColor = '#080808';
            }}
          >
            <ShoppingBag size={15} />
            <span>{isOutOfStock ? 'غير متوفر' : 'أضف للسلة'}</span>
          </button>
        </div>
      </div>
    </article>
  );
}
