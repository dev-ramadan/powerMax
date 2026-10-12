import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, SlidersHorizontal, X, ArrowUpDown } from 'lucide-react';
import ProductCard from '../components/common/ProductCard';
import { productsApi, categoriesApi } from '../services/api';

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters state from URL query
  const currentCategory = searchParams.get('category') || '';
  const currentSearch = searchParams.get('search') || '';
  const currentSort = searchParams.get('sort') || 'newest';

  const [searchInput, setSearchInput] = useState(currentSearch);

  useEffect(() => {
    setSearchInput(currentSearch);
  }, [currentSearch]);

  useEffect(() => {
    // Load categories once
    categoriesApi.list()
      .then(res => setCategories(res.data?.categories || []))
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        const params = {
          limit: 36
        };
        if (currentCategory) params.category = currentCategory;
        if (currentSearch) params.search = currentSearch;
        if (currentSort) params.sort = currentSort;

        const res = await productsApi.list(params);
        setProducts(res.data?.items || []);
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, [currentCategory, currentSearch, currentSort]);

  const handleCategoryChange = (slug) => {
    const next = new URLSearchParams(searchParams);
    if (slug) {
      next.set('category', slug);
    } else {
      next.delete('category');
    }
    setSearchParams(next);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const next = new URLSearchParams(searchParams);
    if (searchInput.trim()) {
      next.set('search', searchInput.trim());
    } else {
      next.delete('search');
    }
    setSearchParams(next);
  };

  const handleSortChange = (e) => {
    const next = new URLSearchParams(searchParams);
    next.set('sort', e.target.value);
    setSearchParams(next);
  };

  const handleClearFilters = () => {
    setSearchParams({});
    setSearchInput('');
  };

  return (
    <div style={{ maxWidth: '1280px', margin: '30px auto 60px auto', padding: '0 20px' }} dir="rtl">
      {/* Header & Title */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 900, color: '#101010', margin: '0 0 8px 0' }}>
          منتجات POWER MAX
        </h1>
        <p style={{ margin: 0, fontSize: '14px', color: '#747474' }}>
          تصفح تشكيلتنا المتكاملة من أدوات المطبخ ومستلزمات البيت العصري
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div style={{
        backgroundColor: '#ffffff',
        padding: '16px 20px',
        borderRadius: '16px',
        border: '1px solid #e9e9ee',
        boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
        marginBottom: '24px',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px'
      }}>
        {/* Search input */}
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '8px', flex: '1', minWidth: '260px' }}>
          <div style={{ position: 'relative', width: '100%' }}>
            <input
              type="search"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="ابحث بالاسم أو الموديل..."
              style={{
                width: '100%',
                padding: '9px 38px 9px 14px',
                borderRadius: '10px',
                border: '1px solid #d0d0d8',
                fontSize: '14px'
              }}
            />
            <Search size={16} color="#747474" style={{ position: 'absolute', right: '12px', top: '12px' }} />
          </div>
          <button
            type="submit"
            style={{
              backgroundColor: '#f20d16',
              color: '#ffffff',
              border: 'none',
              borderRadius: '10px',
              padding: '0 16px',
              fontWeight: 700,
              fontSize: '13px',
              cursor: 'pointer'
            }}
          >
            بحث
          </button>
        </form>

        {/* Sort Select */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ArrowUpDown size={16} color="#747474" />
          <span style={{ fontSize: '13px', fontWeight: 600, color: '#525252' }}>الترتيب:</span>
          <select
            value={currentSort}
            onChange={handleSortChange}
            style={{
              padding: '8px 12px',
              borderRadius: '10px',
              border: '1px solid #d0d0d8',
              backgroundColor: '#ffffff',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            <option value="newest">الأحدث وصولاً</option>
            <option value="price_asc">السعر: من الأقل للأعلى</option>
            <option value="price_desc">السعر: من الأعلى للأقل</option>
            <option value="popular">الأكثر مبيعاً</option>
          </select>
        </div>
      </div>

      {/* Category Pills */}
      <div style={{
        display: 'flex',
        gap: '8px',
        overflowX: 'auto',
        paddingBottom: '12px',
        marginBottom: '20px',
        whiteSpace: 'nowrap'
      }}>
        <button
          type="button"
          onClick={() => handleCategoryChange('')}
          style={{
            padding: '8px 16px',
            borderRadius: '9999px',
            border: 'none',
            fontSize: '13px',
            fontWeight: 700,
            cursor: 'pointer',
            backgroundColor: currentCategory === '' ? '#f20d16' : '#ffffff',
            color: currentCategory === '' ? '#ffffff' : '#363636',
            boxShadow: '0 2px 6px rgba(0,0,0,0.04)'
          }}
        >
          الكل ({products.length})
        </button>
        {categories.map((cat) => {
          const isSelected = currentCategory === cat.slug;
          return (
            <button
              key={cat._id}
              type="button"
              onClick={() => handleCategoryChange(cat.slug)}
              style={{
                padding: '8px 16px',
                borderRadius: '9999px',
                border: 'none',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer',
                backgroundColor: isSelected ? '#f20d16' : '#ffffff',
                color: isSelected ? '#ffffff' : '#363636',
                boxShadow: '0 2px 6px rgba(0,0,0,0.04)'
              }}
            >
              {cat.name}
            </button>
          );
        })}
      </div>

      {/* Active Filter Indicators */}
      {(currentCategory || currentSearch) && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '20px',
          fontSize: '13px'
        }}>
          <span style={{ color: '#747474' }}>تصفية مفعلة:</span>
          {currentCategory && (
            <span style={{
              backgroundColor: '#eeeeff',
              color: '#172cf4',
              padding: '4px 10px',
              borderRadius: '6px',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              قسم: {categories.find(c => c.slug === currentCategory)?.name || currentCategory}
              <X size={13} style={{ cursor: 'pointer' }} onClick={() => handleCategoryChange('')} />
            </span>
          )}
          {currentSearch && (
            <span style={{
              backgroundColor: '#fff0f0',
              color: '#f20d16',
              padding: '4px 10px',
              borderRadius: '6px',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              بحث: "{currentSearch}"
              <X size={13} style={{ cursor: 'pointer' }} onClick={() => {
                const next = new URLSearchParams(searchParams);
                next.delete('search');
                setSearchParams(next);
              }} />
            </span>
          )}
          <button
            type="button"
            onClick={handleClearFilters}
            style={{
              background: 'none',
              border: 'none',
              color: '#ef4444',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
              marginRight: '8px'
            }}
          >
            إلغاء التصفية
          </button>
        </div>
      )}

      {/* Products Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#747474' }}>
          جاري تحميل المنتجات...
        </div>
      ) : products.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          border: '1px solid #e9e9ee'
        }}>
          <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#202020', marginBottom: '8px' }}>
            لم نجد منتجات مطابقة للبحث
          </h3>
          <p style={{ fontSize: '14px', color: '#747474', marginBottom: '16px' }}>
            جرب كلمات بحث مختلفة أو تصفح باقي الأقسام
          </p>
          <button
            type="button"
            onClick={handleClearFilters}
            style={{
              backgroundColor: '#f20d16',
              color: '#ffffff',
              border: 'none',
              borderRadius: '10px',
              padding: '10px 20px',
              fontSize: '14px',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            عرض جميع المنتجات
          </button>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))',
          gap: '20px'
        }}>
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
