import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  Search,
  Eye,
  CheckCircle,
  Truck,
  Clock,
  XCircle,
  MessageCircle,
  X
} from 'lucide-react';
import { ordersApi } from '../../services/api';
import { useToast } from '../../context/ToastContext';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');
  const { showToast } = useToast();

  // Selected Order Modal
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [statusNote, setStatusNote] = useState('');
  const [updating, setUpdating] = useState(false);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const params = { limit: 100 };
      if (statusFilter) params.status = statusFilter;
      const res = await ordersApi.adminList(params);
      setOrders(res.data?.items || []);
    } catch (err) {
      console.error(err);
      showToast('فشل تحميل قائمة الطلبات', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [statusFilter]);

  const openOrderModal = (ord) => {
    setSelectedOrder(ord);
    setNewStatus(ord.status);
    setStatusNote('');
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    if (!selectedOrder) return;

    try {
      setUpdating(true);
      await ordersApi.updateStatus(selectedOrder._id, {
        status: newStatus,
        note: statusNote.trim() || undefined
      });
      showToast('تم تحديث حالة الطلب بنجاح', 'success');
      setSelectedOrder(null);
      loadOrders();
    } catch (err) {
      console.error(err);
      showToast('فشل تحديث حالة الطلب', 'error');
    } finally {
      setUpdating(false);
    }
  };

  const filteredOrders = orders.filter(o => {
    if (!search.trim()) return true;
    const s = search.toLowerCase();
    return (
      o.orderNumber?.toLowerCase().includes(s) ||
      o.shippingAddress?.fullName?.toLowerCase().includes(s) ||
      o.shippingAddress?.phone?.includes(s)
    );
  });

  return (
    <div>
      {/* Title */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 900, color: '#101010', margin: '0 0 6px 0' }}>
          إدارة الطلبات والمبيعات ({orders.length})
        </h1>
        <p style={{ margin: 0, fontSize: '13px', color: '#747474' }}>
          متابعة وتحديث حالات طلبات الشحن والتوصيل للعملاء
        </p>
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
        justifyContent: 'space-between',
        gap: '14px'
      }}>
        {/* Status Tabs */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
          {[
            { key: '', label: 'الكل' },
            { key: 'pending', label: 'قيد الانتظار' },
            { key: 'processing', label: 'جاري التجهيز' },
            { key: 'shipped', label: 'تم الشحن' },
            { key: 'delivered', label: 'تم التوصيل' },
            { key: 'cancelled', label: 'ملغي' }
          ].map(tab => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setStatusFilter(tab.key)}
              style={{
                padding: '7px 14px',
                borderRadius: '8px',
                border: 'none',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer',
                backgroundColor: statusFilter === tab.key ? '#f20d16' : '#f0f0f3',
                color: statusFilter === tab.key ? '#ffffff' : '#363636'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div style={{ position: 'relative', width: '260px' }}>
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ابحث برقم الطلب أو الهاتف..."
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
      </div>

      {/* Orders Table */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '20px',
        border: '1px solid #e9e9ee',
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
      }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '50px', color: '#747474' }}>
            جاري تحميل الطلبات...
          </div>
        ) : filteredOrders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '50px', color: '#747474' }}>
            لا توجد طلبات مطابقة للبحث
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right', fontSize: '13px' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8f8fa', borderBottom: '1px solid #e9e9ee', color: '#747474' }}>
                  <th style={{ padding: '12px 16px' }}>رقم الطلب</th>
                  <th style={{ padding: '12px 16px' }}>العميل والهاتف</th>
                  <th style={{ padding: '12px 16px' }}>العنوان والمحافظة</th>
                  <th style={{ padding: '12px 16px' }}>الأصناف</th>
                  <th style={{ padding: '12px 16px' }}>المبلغ الإجمالي</th>
                  <th style={{ padding: '12px 16px' }}>الحالة</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left' }}>تفاصيل</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((ord) => (
                  <tr key={ord._id} style={{ borderBottom: '1px solid #f0f0f3' }}>
                    <td style={{ padding: '12px 16px', fontWeight: 800, color: '#f20d16' }}>
                      {ord.orderNumber}
                    </td>

                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ fontWeight: 700, color: '#101010' }}>
                        {ord.shippingAddress?.fullName || 'عميل'}
                      </div>
                      <div style={{ fontSize: '12px', color: '#747474', direction: 'ltr', textAlign: 'right' }}>
                        {ord.shippingAddress?.phone}
                      </div>
                    </td>

                    <td style={{ padding: '12px 16px', color: '#525252' }}>
                      <div>{ord.shippingAddress?.city}</div>
                      <small style={{ color: '#747474' }}>{ord.shippingAddress?.address?.slice(0, 30)}...</small>
                    </td>

                    <td style={{ padding: '12px 16px', fontWeight: 600 }}>
                      {ord.items?.length || 0} منتجات
                    </td>

                    <td style={{ padding: '12px 16px', fontWeight: 900, color: '#101010' }}>
                      {ord.total?.toLocaleString('ar-EG')} ج.م
                    </td>

                    <td style={{ padding: '12px 16px' }}>
                      <span style={{
                        fontSize: '11px',
                        fontWeight: 700,
                        padding: '4px 8px',
                        borderRadius: '6px',
                        backgroundColor:
                          ord.status === 'delivered' ? '#ecfdf5' :
                          ord.status === 'shipped' ? '#eff6ff' :
                          ord.status === 'cancelled' ? '#fef2f2' : '#fefce8',
                        color:
                          ord.status === 'delivered' ? '#059669' :
                          ord.status === 'shipped' ? '#2563eb' :
                          ord.status === 'cancelled' ? '#dc2626' : '#ca8a04'
                      }}>
                        {ord.status === 'pending' ? 'قيد الانتظار' :
                         ord.status === 'processing' ? 'جاري التجهيز' :
                         ord.status === 'shipped' ? 'تم الشحن' :
                         ord.status === 'delivered' ? 'تم التوصيل' : 'ملغي'}
                      </span>
                    </td>

                    <td style={{ padding: '12px 16px', textAlign: 'left' }}>
                      <button
                        type="button"
                        onClick={() => openOrderModal(ord)}
                        style={{
                          backgroundColor: '#f0f0f3',
                          border: 'none',
                          borderRadius: '8px',
                          padding: '6px 12px',
                          fontSize: '12px',
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                      >
                        عرض
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
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
        }} onClick={() => setSelectedOrder(null)} dir="rtl">
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
            {/* Header */}
            <div style={{
              padding: '20px 24px',
              borderBottom: '1px solid #e9e9ee',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div>
                <h3 style={{ margin: '0 0 4px 0', fontSize: '18px', fontWeight: 900 }}>
                  طلب رقم: <span style={{ color: '#f20d16' }}>{selectedOrder.orderNumber}</span>
                </h3>
                <small style={{ color: '#747474' }}>
                  بتاريخ: {new Date(selectedOrder.createdAt).toLocaleString('ar-EG')}
                </small>
              </div>

              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#747474' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div style={{ padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Customer and shipping info */}
              <div style={{
                backgroundColor: '#f8f8fa',
                borderRadius: '14px',
                padding: '16px',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '12px',
                fontSize: '13px'
              }}>
                <div>
                  <span style={{ color: '#747474', display: 'block' }}>الاسم:</span>
                  <strong>{selectedOrder.shippingAddress?.fullName}</strong>
                </div>
                <div>
                  <span style={{ color: '#747474', display: 'block' }}>الموبايل:</span>
                  <strong style={{ direction: 'ltr', display: 'inline-block' }}>{selectedOrder.shippingAddress?.phone}</strong>
                  {selectedOrder.shippingAddress?.phone && (
                    <a
                      href={`https://wa.me/2${selectedOrder.shippingAddress.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`مرحباً أستاذ ${selectedOrder.shippingAddress.fullName}، بخصوص طلبك رقم ${selectedOrder.orderNumber} من POWER MAX:`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        color: '#25D366',
                        marginRight: '8px',
                        textDecoration: 'none',
                        fontWeight: 700
                      }}
                    >
                      <MessageCircle size={14} />
                      واتساب
                    </a>
                  )}
                </div>
                <div>
                  <span style={{ color: '#747474', display: 'block' }}>المحافظة:</span>
                  <strong>{selectedOrder.shippingAddress?.city}</strong>
                </div>
                <div>
                  <span style={{ color: '#747474', display: 'block' }}>طريقة الدفع:</span>
                  <strong>{selectedOrder.paymentMethod === 'cod' ? 'الدفع عند الاستلام' : selectedOrder.paymentMethod}</strong>
                </div>
                <div style={{ gridColumn: 'span 2' }}>
                  <span style={{ color: '#747474', display: 'block' }}>العنوان بالتفصيل:</span>
                  <strong>{selectedOrder.shippingAddress?.address}</strong>
                </div>
              </div>

              {/* Items List */}
              <div>
                <h4 style={{ margin: '0 0 10px 0', fontSize: '14px', fontWeight: 800 }}>
                  الأصناف المطلوبة:
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {selectedOrder.items?.map((item, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '10px 14px',
                        borderRadius: '10px',
                        backgroundColor: '#ffffff',
                        border: '1px solid #e9e9ee',
                        fontSize: '13px'
                      }}
                    >
                      <div>
                        <strong>{item.productName}</strong>
                        <div style={{ fontSize: '11px', color: '#747474' }}>الكمية: {item.quantity} × {item.unitPrice} ج.م</div>
                      </div>
                      <strong style={{ color: '#f20d16' }}>{item.lineTotal?.toLocaleString('ar-EG')} ج.م</strong>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status Update Form */}
              <form
                onSubmit={handleUpdateStatus}
                style={{
                  backgroundColor: '#fff',
                  border: '1.5px solid #e9e9ee',
                  borderRadius: '16px',
                  padding: '18px'
                }}
              >
                <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: 800 }}>
                  تحديث حالة الطلب:
                </h4>
                <div style={{ display: 'flex', gap: '12px', marginBottom: '10px' }}>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    style={{
                      flex: 1,
                      padding: '10px',
                      borderRadius: '10px',
                      border: '1px solid #d0d0d8',
                      fontSize: '13px',
                      fontWeight: 700
                    }}
                  >
                    <option value="pending">قيد الانتظار</option>
                    <option value="processing">جاري التجهيز والتغليف</option>
                    <option value="shipped">تم الشحن مع المندوب</option>
                    <option value="delivered">تم التوصيل بنجاح</option>
                    <option value="cancelled">ملغي</option>
                  </select>

                  <button
                    type="submit"
                    disabled={updating}
                    style={{
                      backgroundColor: '#10b981',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '10px',
                      padding: '10px 20px',
                      fontWeight: 800,
                      cursor: updating ? 'not-allowed' : 'pointer'
                    }}
                  >
                    {updating ? 'جاري الحفظ...' : 'تأكيد التحديث'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
