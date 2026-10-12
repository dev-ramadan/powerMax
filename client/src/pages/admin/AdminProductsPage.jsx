import React, { useState, useEffect } from 'react';
import {
  Package,
  Plus,
  Search,
  Edit2,
  Trash2,
  Check,
  X,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { productsApi, categoriesApi } from '../../services/api';
import { useToast } from '../../context/ToastContext';

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const { showToast } = useToast();

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

  const initialForm = {
    name: '',
    slug: '',
    category: '',
    price: '',
    compareAtPrice: '',
    stock: '',
    sku: '',
    image: '',
    description: '',
    featured: false,
    active: true
  };
  const [formData, setFormData] = useState(initialForm);

  const loadData = async () => {
    try {
      setLoading(true);
      const [prodRes, catRes] = await Promise.all([
        productsApi.adminList({ limit: 100 }),
        categoriesApi.list()
      ]);
      setProducts(prodRes.data?.items || []);
      setCategories(catRes.data?.categories || []);
    } catch (err) {
      console.error(err);
      showToast('فشل تحميل المنتجات والأقسام', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openCreateModal = () => {
    setEditingProduct(null);
    setFormData({
      ...initialForm,
      category: categories[0]?._id || ''
    });
    setIsModalOpen(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name || '',
      slug: product.slug || '',
      category: product.category?._id || product.category || '',
      price: product.price || '',
      compareAtPrice: product.compareAtPrice || '',
      stock: product.stock || 0,
      sku: product.sku || '',
      image: product.image || '',
      description: product.description || '',
      featured: product.featured || false,
      active: product.active !== false
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.price) {
      showToast('يرجى ملء الاسم والسعر على الأقل', 'warning');
      return;
    }

    try {
      setModalLoading(true);
      const payload = {
        name: formData.name.trim(),
        slug: formData.slug.trim() || undefined,
        category: formData.category,
        price: Number(formData.price),
        compareAtPrice: formData.compareAtPrice ? Number(formData.compareAtPrice) : undefined,
        stock: Number(formData.stock) || 0,
        sku: formData.sku.trim() || undefined,
        image: formData.image.trim() || undefined,
        description: formData.description.trim(),
        featured: formData.featured,
        active: formData.active
      };

      if (editingProduct) {
        await productsApi.update(editingProduct._id, payload);
        showToast('تم تحديث المنتج بنجاح', 'success');
      } else {
        await productsApi.create(payload);
        showToast('تمت إضافة المنتج بنجاح', 'success');
      }

      closeModal();
      loadData();
    } catch (err) {
      console.error(err);
      showToast(err.response?.data?.message || 'حدث خطأ أثناء حفظ المنتج', 'error');
    } finally {
      setModalLoading(false);
    }
  };

  const handleDelete = async (productId, productName) => {
    if (!window.confirm(`هل أنت متأكد من حذف المنتج "${productName}"؟`)) {
      return;
    }
    try {
      await productsApi.delete(productId);
      showToast('تم حذف المنتج بنجاح', 'success');
      loadData();
    } catch (err) {
      console.error(err);
      showToast('فشل حذف المنتج', 'error');
    }
  };

  const filteredProducts = products.filter(p => {
    const matchSearch = search.trim() === '' ||
      p.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.sku?.toLowerCase().includes(search.toLowerCase());
    const matchCategory = !categoryFilter ||
      (p.category?._id === categoryFilter || p.category === categoryFilter);
    return matchSearch && matchCategory;
  });

  return (
    <div>
      {/* Title & Add Button */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '16px',
        marginBottom: '24px'
      }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 900, color: '#101010', margin: '0 0 6px 0' }}>
            إدارة المنتجات ({products.length})
          </h1>
          <p style={{ margin: 0, fontSize: '13px', color: '#747474' }}>
            إضافة وتعديل أسعار ومخزون منتجات المتجر
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: '#f20d16',
            color: '#ffffff',
            border: 'none',
            borderRadius: '12px',
            padding: '11px 20px',
            fontSize: '14px',
            fontWeight: 800,
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(242, 13, 22, 0.3)'
          }}
        >
          <Plus size={18} />
          <span>إضافة منتج جديد</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div style={{
        backgroundColor: '#ffffff',
        padding: '16px 20px',
        borderRadius: '16px',
        border: '1px solid #e9e9ee',
        marginBottom: '20px',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: '14px'
      }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ابحث باسم المنتج أو الكود SKU..."
            style={{
              width: '100%',
              padding: '9px 36px 9px 12px',
              borderRadius: '10px',
              border: '1px solid #d0d0d8',
              fontSize: '13px'
            }}
          />
          <Search size={16} color="#747474" style={{ position: 'absolute', right: '12px', top: '11px' }} />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          style={{
            padding: '9px 14px',
            borderRadius: '10px',
            border: '1px solid #d0d0d8',
            fontSize: '13px',
            backgroundColor: '#fff',
            cursor: 'pointer'
          }}
        >
          <option value="">جميع الأقسام</option>
          {categories.map(c => (
            <option key={c._id} value={c._id}>{c.name}</option>
          ))}
        </select>
      </div>

      {/* Products Table */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '20px',
        border: '1px solid #e9e9ee',
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
      }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '50px', color: '#747474' }}>
            جاري تحميل المنتجات...
          </div>
        ) : filteredProducts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '50px', color: '#747474' }}>
            لم يتم العثور على أي منتج يطابق البحث
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right', fontSize: '13px' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8f8fa', borderBottom: '1px solid #e9e9ee', color: '#747474' }}>
                  <th style={{ padding: '12px 16px' }}>المنتج</th>
                  <th style={{ padding: '12px 16px' }}>القسم</th>
                  <th style={{ padding: '12px 16px' }}>السعر</th>
                  <th style={{ padding: '12px 16px' }}>المخزون</th>
                  <th style={{ padding: '12px 16px' }}>الحالة</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left' }}>إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((p) => {
                  const catName = p.categoryName || p.category?.name || 'عام';
                  const isLow = p.stock <= 5;
                  return (
                    <tr key={p._id} style={{ borderBottom: '1px solid #f0f0f3' }}>
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <img
                            src={p.image || '/logo.png'}
                            alt=""
                            style={{
                              width: '46px',
                              height: '46px',
                              borderRadius: '8px',
                              objectFit: 'cover',
                              border: '1px solid #e9e9ee',
                              backgroundColor: '#f8f8fa'
                            }}
                            onError={(e) => { e.currentTarget.src = '/logo.png'; }}
                          />
                          <div>
                            <div style={{ fontWeight: 800, color: '#101010', lineHeight: '1.3' }}>{p.name}</div>
                            {p.sku && <small style={{ color: '#747474' }}>SKU: {p.sku}</small>}
                          </div>
                        </div>
                      </td>

                      <td style={{ padding: '12px 16px', color: '#525252' }}>
                        {catName}
                      </td>

                      <td style={{ padding: '12px 16px' }}>
                        <strong style={{ color: '#f20d16', fontSize: '14px' }}>
                          {p.price.toLocaleString('ar-EG')} ج.م
                        </strong>
                        {p.compareAtPrice > p.price && (
                          <del style={{ display: 'block', fontSize: '11px', color: '#a8a8b4' }}>
                            {p.compareAtPrice.toLocaleString('ar-EG')} ج.م
                          </del>
                        )}
                      </td>

                      <td style={{ padding: '12px 16px' }}>
                        <span style={{
                          fontWeight: 700,
                          color: isLow ? '#ef4444' : '#10b981',
                          backgroundColor: isLow ? '#fee2e2' : '#ecfdf5',
                          padding: '3px 8px',
                          borderRadius: '6px'
                        }}>
                          {p.stock} قطعة
                        </span>
                      </td>

                      <td style={{ padding: '12px 16px' }}>
                        <span style={{
                          fontSize: '11px',
                          fontWeight: 700,
                          padding: '3px 8px',
                          borderRadius: '6px',
                          backgroundColor: p.active !== false ? '#ecfdf5' : '#f0f0f3',
                          color: p.active !== false ? '#059669' : '#747474'
                        }}>
                          {p.active !== false ? 'نشط ومتاح' : 'معطل'}
                        </span>
                        {p.featured && (
                          <span style={{
                            fontSize: '11px',
                            fontWeight: 700,
                            padding: '3px 8px',
                            borderRadius: '6px',
                            backgroundColor: '#eff6ff',
                            color: '#2563eb',
                            marginRight: '6px'
                          }}>
                            مميز
                          </span>
                        )}
                      </td>

                      <td style={{ padding: '12px 16px', textAlign: 'left' }}>
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                          <button
                            type="button"
                            onClick={() => openEditModal(p)}
                            style={{
                              backgroundColor: '#f0f0f3',
                              border: 'none',
                              borderRadius: '8px',
                              padding: '6px 10px',
                              cursor: 'pointer',
                              color: '#101010'
                            }}
                            title="تعديل"
                          >
                            <Edit2 size={15} />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDelete(p._id, p.name)}
                            style={{
                              backgroundColor: '#fee2e2',
                              border: 'none',
                              borderRadius: '8px',
                              padding: '6px 10px',
                              cursor: 'pointer',
                              color: '#ef4444'
                            }}
                            title="حذف"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 2500,
          backgroundColor: 'rgba(0,0,0,0.5)',
          backdropFilter: 'blur(3px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }} onClick={closeModal} dir="rtl">
          <div style={{
            width: '100%',
            maxWidth: '650px',
            maxHeight: '90vh',
            backgroundColor: '#ffffff',
            borderRadius: '24px',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 20px 50px rgba(0,0,0,0.2)'
          }} onClick={(e) => e.stopPropagation()}>
            <div style={{
              padding: '18px 24px',
              borderBottom: '1px solid #e9e9ee',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 900 }}>
                {editingProduct ? 'تعديل بيانات المنتج' : 'إضافة منتج جديد'}
              </h3>
              <button
                type="button"
                onClick={closeModal}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#747474' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} style={{ padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>
                  اسم المنتج <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  required
                  placeholder="مثال: طقم حلل جرانيت 10 قطع"
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #d0d0d8' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>
                    القسم
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleFormChange}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #d0d0d8', backgroundColor: '#fff' }}
                  >
                    {categories.map(c => (
                      <option key={c._id} value={c._id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>
                    كود المنتج (SKU)
                  </label>
                  <input
                    type="text"
                    name="sku"
                    value={formData.sku}
                    onChange={handleFormChange}
                    placeholder="مثال: PM-HLL-001"
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #d0d0d8' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>
                    السعر الحالي (ج.م) <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleFormChange}
                    required
                    min="0"
                    placeholder="3499"
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #d0d0d8' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>
                    السعر قبل الخصم
                  </label>
                  <input
                    type="number"
                    name="compareAtPrice"
                    value={formData.compareAtPrice}
                    onChange={handleFormChange}
                    min="0"
                    placeholder="3999"
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #d0d0d8' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>
                    الكمية بالمخزون
                  </label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleFormChange}
                    min="0"
                    placeholder="25"
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #d0d0d8' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>
                  رابط الصورة الرئيسية
                </label>
                <input
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleFormChange}
                  placeholder="https://..."
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #d0d0d8' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>
                  وصف المنتج
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleFormChange}
                  rows={3}
                  placeholder="اكتب وصفاً مفصلاً للمنتج ومواصفاته..."
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #d0d0d8' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '20px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 700 }}>
                  <input
                    type="checkbox"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleFormChange}
                  />
                  <span>منتج مميز (يظهر في الصفحة الرئيسية)</span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 700 }}>
                  <input
                    type="checkbox"
                    name="active"
                    checked={formData.active}
                    onChange={handleFormChange}
                  />
                  <span>نشط ومتاح للبيع في المتجر</span>
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={closeModal}
                  style={{
                    backgroundColor: '#f0f0f3',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '10px 20px',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  إلغاء
                </button>

                <button
                  type="submit"
                  disabled={modalLoading}
                  style={{
                    backgroundColor: '#f20d16',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '10px 24px',
                    fontWeight: 800,
                    cursor: modalLoading ? 'not-allowed' : 'pointer'
                  }}
                >
                  {modalLoading ? 'جاري الحفظ...' : (editingProduct ? 'حفظ التعديلات' : 'إضافة المنتج')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
