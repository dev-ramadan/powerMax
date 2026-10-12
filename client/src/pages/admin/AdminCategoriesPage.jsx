import React, { useState, useEffect } from 'react';
import { Layers, Plus, Edit2, Trash2, X } from 'lucide-react';
import { categoriesApi } from '../../services/api';
import { useToast } from '../../context/ToastContext';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

  const initialForm = {
    name: '',
    slug: '',
    description: '',
    image: '',
    sortOrder: 0,
    active: true
  };
  const [formData, setFormData] = useState(initialForm);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const res = await categoriesApi.adminList();
      setCategories(res.data?.categories || []);
    } catch (err) {
      console.error(err);
      showToast('فشل تحميل الأقسام', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const openCreateModal = () => {
    setEditingCategory(null);
    setFormData(initialForm);
    setIsModalOpen(true);
  };

  const openEditModal = (cat) => {
    setEditingCategory(cat);
    setFormData({
      name: cat.name || '',
      slug: cat.slug || '',
      description: cat.description || '',
      image: cat.image || '',
      sortOrder: cat.sortOrder || 0,
      active: cat.active !== false
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
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
    if (!formData.name.trim()) {
      showToast('يرجى إدخال اسم القسم', 'warning');
      return;
    }

    try {
      setModalLoading(true);
      const payload = {
        name: formData.name.trim(),
        slug: formData.slug.trim() || undefined,
        description: formData.description.trim(),
        image: formData.image.trim() || undefined,
        sortOrder: Number(formData.sortOrder) || 0,
        active: formData.active
      };

      if (editingCategory) {
        await categoriesApi.update(editingCategory._id, payload);
        showToast('تم تحديث القسم بنجاح', 'success');
      } else {
        await categoriesApi.create(payload);
        showToast('تمت إضافة القسم بنجاح', 'success');
      }

      closeModal();
      loadCategories();
    } catch (err) {
      console.error(err);
      showToast(err.response?.data?.message || 'فشل حفظ القسم', 'error');
    } finally {
      setModalLoading(false);
    }
  };

  const handleDelete = async (catId, catName) => {
    if (!window.confirm(`هل أنت متأكد من حذف قسم "${catName}"؟`)) {
      return;
    }
    try {
      await categoriesApi.delete(catId);
      showToast('تم حذف القسم بنجاح', 'success');
      loadCategories();
    } catch (err) {
      console.error(err);
      showToast('فشل حذف القسم', 'error');
    }
  };

  return (
    <div>
      {/* Title & Add Button */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px'
      }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 900, color: '#101010', margin: '0 0 6px 0' }}>
            أقسام المتجر ({categories.length})
          </h1>
          <p style={{ margin: 0, fontSize: '13px', color: '#747474' }}>
            إدارة تصنيفات وأقسام المنتجات المعروضة في المتجر
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: '#172cf4',
            color: '#ffffff',
            border: 'none',
            borderRadius: '12px',
            padding: '11px 20px',
            fontSize: '14px',
            fontWeight: 800,
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(23, 44, 244, 0.3)'
          }}
        >
          <Plus size={18} />
          <span>إضافة قسم جديد</span>
        </button>
      </div>

      {/* Categories Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px', color: '#747474' }}>
          جاري تحميل الأقسام...
        </div>
      ) : categories.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '50px', color: '#747474' }}>
          لا توجد أقسام مسجلة
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '20px'
        }}>
          {categories.map((cat) => (
            <div
              key={cat._id}
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '18px',
                border: '1px solid #e9e9ee',
                padding: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '12px',
                  backgroundColor: '#f8f8fa',
                  border: '1px solid #e9e9ee',
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {cat.image ? (
                    <img src={cat.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <Layers size={22} color="#172cf4" />
                  )}
                </div>

                <div>
                  <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 800, color: '#101010' }}>
                    {cat.name}
                  </h3>
                  <small style={{ color: '#747474' }}>/{cat.slug}</small>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => openEditModal(cat)}
                  style={{
                    backgroundColor: '#f0f0f3',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '6px 10px',
                    cursor: 'pointer'
                  }}
                  title="تعديل"
                >
                  <Edit2 size={15} />
                </button>

                <button
                  type="button"
                  onClick={() => handleDelete(cat._id, cat.name)}
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
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Category Modal */}
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
            maxWidth: '480px',
            backgroundColor: '#ffffff',
            borderRadius: '20px',
            padding: '24px',
            boxShadow: '0 20px 50px rgba(0,0,0,0.2)'
          }} onClick={(e) => e.stopPropagation()}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '20px'
            }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 900 }}>
                {editingCategory ? 'تعديل القسم' : 'إضافة قسم جديد'}
              </h3>
              <button
                type="button"
                onClick={closeModal}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#747474' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>
                  اسم القسم <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  required
                  placeholder="مثال: أدوات المطبخ"
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #d0d0d8' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>
                  الاسم اللطيف (Slug بالإنجليزية)
                </label>
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleFormChange}
                  placeholder="مثال: kitchen-tools"
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #d0d0d8' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>
                  رابط صورة / أيقونة القسم
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
                  ترتيب الظهور
                </label>
                <input
                  type="number"
                  name="sortOrder"
                  value={formData.sortOrder}
                  onChange={handleFormChange}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #d0d0d8' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={closeModal}
                  style={{ backgroundColor: '#f0f0f3', border: 'none', borderRadius: '10px', padding: '10px 18px', fontWeight: 700, cursor: 'pointer' }}
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={modalLoading}
                  style={{ backgroundColor: '#172cf4', color: '#fff', border: 'none', borderRadius: '10px', padding: '10px 22px', fontWeight: 800, cursor: modalLoading ? 'not-allowed' : 'pointer' }}
                >
                  {modalLoading ? 'جاري الحفظ...' : (editingCategory ? 'حفظ التعديل' : 'إضافة القسم')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
