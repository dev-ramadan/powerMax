import React, { useState, useEffect } from 'react';
import { Sparkles, Plus, Edit2, Trash2, X, Check } from 'lucide-react';
import { bridalApi } from '../../services/api';
import { useToast } from '../../context/ToastContext';

export default function AdminBridalPage() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

  const initialForm = {
    name: '',
    slug: '',
    price: '',
    compareAtPrice: '',
    badge: 'الأكثر طلباً',
    image: '',
    description: '',
    itemsText: '',
    active: true
  };
  const [formData, setFormData] = useState(initialForm);

  const loadPackages = async () => {
    try {
      setLoading(true);
      const res = await bridalApi.adminList();
      setPackages(res.data?.packages || []);
    } catch (err) {
      console.error(err);
      showToast('فشل تحميل باقات العروسة', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPackages();
  }, []);

  const openCreateModal = () => {
    setEditingPackage(null);
    setFormData(initialForm);
    setIsModalOpen(true);
  };

  const openEditModal = (pkg) => {
    setEditingPackage(pkg);
    const itemsStr = (pkg.items || [])
      .map(i => (typeof i === 'object' ? (i.title || i.name) : i))
      .join('\n');

    setFormData({
      name: pkg.name || '',
      slug: pkg.slug || '',
      price: pkg.price || '',
      compareAtPrice: pkg.compareAtPrice || '',
      badge: pkg.badge || '',
      image: pkg.image || '',
      description: pkg.description || '',
      itemsText: itemsStr,
      active: pkg.active !== false
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingPackage(null);
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
      showToast('يرجى إدخال اسم وسعر الباقة', 'warning');
      return;
    }

    try {
      setModalLoading(true);
      const itemsArray = formData.itemsText
        .split('\n')
        .map(s => s.trim())
        .filter(Boolean);

      const payload = {
        name: formData.name.trim(),
        slug: formData.slug.trim() || undefined,
        price: Number(formData.price),
        compareAtPrice: formData.compareAtPrice ? Number(formData.compareAtPrice) : undefined,
        badge: formData.badge.trim() || undefined,
        image: formData.image.trim() || undefined,
        description: formData.description.trim(),
        items: itemsArray,
        active: formData.active
      };

      if (editingPackage) {
        await bridalApi.update(editingPackage._id, payload);
        showToast('تم تحديث باقة العروسة بنجاح', 'success');
      } else {
        await bridalApi.create(payload);
        showToast('تمت إضافة باقة العروسة بنجاح', 'success');
      }

      closeModal();
      loadPackages();
    } catch (err) {
      console.error(err);
      showToast('فشل حفظ الباقة', 'error');
    } finally {
      setModalLoading(false);
    }
  };

  const handleDelete = async (pkgId, pkgName) => {
    if (!window.confirm(`هل أنت متأكد من حذف باقة "${pkgName}"؟`)) {
      return;
    }
    try {
      await bridalApi.delete(pkgId);
      showToast('تم حذف الباقة بنجاح', 'success');
      loadPackages();
    } catch (err) {
      console.error(err);
      showToast('فشل حذف الباقة', 'error');
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
            باقات وعروض جهاز العروسة ({packages.length})
          </h1>
          <p style={{ margin: 0, fontSize: '13px', color: '#747474' }}>
            تخصيص باقات تجهيز البيت الجديد ومحتوياتها وخصوماتها
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
          <span>إضافة باقة جديدة</span>
        </button>
      </div>

      {/* Packages Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px', color: '#747474' }}>
          جاري تحميل باقات العروسة...
        </div>
      ) : packages.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '50px', color: '#747474' }}>
          لا توجد باقات عروسة مضافة حالياً
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '24px'
        }}>
          {packages.map((pkg) => (
            <div
              key={pkg._id}
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '20px',
                border: '1px solid #e9e9ee',
                padding: '24px',
                boxShadow: '0 4px 14px rgba(0,0,0,0.03)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                  <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 900, color: '#101010' }}>
                    {pkg.name}
                  </h3>
                  {pkg.badge && (
                    <span style={{
                      backgroundColor: '#ffd21f',
                      color: '#080808',
                      fontSize: '11px',
                      fontWeight: 800,
                      padding: '3px 8px',
                      borderRadius: '6px'
                    }}>
                      {pkg.badge}
                    </span>
                  )}
                </div>

                <div style={{ fontSize: '20px', fontWeight: 900, color: '#f20d16', marginBottom: '12px' }}>
                  {pkg.price?.toLocaleString('ar-EG')} ج.م
                  {pkg.compareAtPrice > pkg.price && (
                    <del style={{ fontSize: '13px', color: '#a8a8b4', marginRight: '8px' }}>
                      {pkg.compareAtPrice?.toLocaleString('ar-EG')} ج.م
                    </del>
                  )}
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <h4 style={{ margin: '0 0 8px 0', fontSize: '13px', color: '#525252' }}>
                    المكونات ({pkg.items?.length || 0}):
                  </h4>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12px', color: '#747474' }}>
                    {pkg.items?.slice(0, 4).map((item, idx) => (
                      <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Check size={13} color="#10b981" />
                        <span>{typeof item === 'object' ? (item.title || item.name) : item}</span>
                      </li>
                    ))}
                    {(pkg.items?.length || 0) > 4 && (
                      <li style={{ color: '#172cf4', fontWeight: 700 }}>
                        + {(pkg.items.length - 4)} أصناف إضافية...
                      </li>
                    )}
                  </ul>
                </div>
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderTop: '1px solid #f0f0f3',
                paddingTop: '16px',
                marginTop: '10px'
              }}>
                <span style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  color: pkg.active !== false ? '#059669' : '#747474'
                }}>
                  {pkg.active !== false ? '● نشط ومعروض' : '○ معطل'}
                </span>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={() => openEditModal(pkg)}
                    style={{
                      backgroundColor: '#f0f0f3',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '6px 12px',
                      cursor: 'pointer'
                    }}
                  >
                    <Edit2 size={15} />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(pkg._id, pkg.name)}
                    style={{
                      backgroundColor: '#fee2e2',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '6px 12px',
                      cursor: 'pointer',
                      color: '#ef4444'
                    }}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

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
            maxWidth: '560px',
            backgroundColor: '#ffffff',
            borderRadius: '24px',
            overflow: 'hidden',
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
                {editingPackage ? 'تعديل باقة العروسة' : 'إضافة باقة جديدة'}
              </h3>
              <button
                type="button"
                onClick={closeModal}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#747474' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>
                  اسم الباقة <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  required
                  placeholder="مثال: باقة العروسة الشاملة VIP"
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #d0d0d8' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
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
                    placeholder="7999"
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
                    placeholder="9500"
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #d0d0d8' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>
                  شارة العرض (Badge)
                </label>
                <input
                  type="text"
                  name="badge"
                  value={formData.badge}
                  onChange={handleFormChange}
                  placeholder="مثال: العرض الذهبي / الأكثر طلباً"
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #d0d0d8' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>
                  مكونات وأصناف الباقة (اكتب كل صنف في سطر منفصل)
                </label>
                <textarea
                  name="itemsText"
                  value={formData.itemsText}
                  onChange={handleFormChange}
                  rows={4}
                  placeholder={`طقم حلل استانلس 10 قطع\nطقم أطباق سفرة 24 قطعة\nطقم مجات زجاج 6 قطع\nمنظم أدوات مطبخ`}
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
                  style={{ backgroundColor: '#f20d16', color: '#fff', border: 'none', borderRadius: '10px', padding: '10px 22px', fontWeight: 800, cursor: modalLoading ? 'not-allowed' : 'pointer' }}
                >
                  {modalLoading ? 'جاري الحفظ...' : (editingPackage ? 'حفظ التعديل' : 'إضافة الباقة')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
