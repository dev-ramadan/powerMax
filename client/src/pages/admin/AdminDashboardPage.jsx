import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  DollarSign,
  ShoppingBag,
  Package,
  Users,
  AlertTriangle,
  ArrowUpRight,
  Clock,
  Truck,
  CheckCircle2,
  TrendingUp
} from 'lucide-react';
import { adminApi, ordersApi } from '../../services/api';
import { useToast } from '../../context/ToastContext';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const loadStats = async () => {
    try {
      setLoading(true);
      const res = await adminApi.getStats();
      setStats(res.data?.stats);
    } catch (err) {
      console.error('Error fetching admin stats', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  const handleQuickStatusChange = async (orderId, newStatus) => {
    try {
      await ordersApi.updateStatus(orderId, { status: newStatus });
      showToast('تم تحديث حالة الطلب بنجاح', 'success');
      loadStats();
    } catch (err) {
      console.error(err);
      showToast('فشل تحديث حالة الطلب', 'error');
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 20px', color: '#747474' }}>
        جاري تحميل مؤشرات المتجر...
      </div>
    );
  }

  const {
    totalRevenue = 0,
    totalOrders = 0,
    totalProducts = 0,
    totalCustomers = 0,
    pendingOrders = 0,
    shippedOrders = 0,
    deliveredOrders = 0,
    recentOrders = [],
    lowStockProducts = []
  } = stats || {};

  return (
    <div>
      {/* Title */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 900, color: '#101010', margin: '0 0 6px 0' }}>
          نظرة عامة على المتجر
        </h1>
        <p style={{ margin: 0, fontSize: '13px', color: '#747474' }}>
          متابعة مباشرة للإيرادات والطلبات والمخزون
        </p>
      </div>

      {/* KPI Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '18px',
        marginBottom: '26px'
      }}>
        {/* Total Revenue */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          border: '1px solid #e9e9ee',
          padding: '20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#747474' }}>إجمالي المبيعات</span>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: '#ecfdf5', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <TrendingUp size={20} />
            </div>
          </div>
          <div style={{ fontSize: '24px', fontWeight: 900, color: '#101010' }}>
            {totalRevenue.toLocaleString('ar-EG')} ج.م
          </div>
          <div style={{ fontSize: '11px', color: '#10b981', marginTop: '6px', fontWeight: 700 }}>
            إجمالي دخل الطلبات
          </div>
        </div>

        {/* Total Orders */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          border: '1px solid #e9e9ee',
          padding: '20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#747474' }}>إجمالي الطلبات</span>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: '#eff6ff', color: '#172cf4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShoppingBag size={20} />
            </div>
          </div>
          <div style={{ fontSize: '24px', fontWeight: 900, color: '#101010' }}>
            {totalOrders}
          </div>
          <div style={{ fontSize: '11px', color: '#172cf4', marginTop: '6px', fontWeight: 700 }}>
            {pendingOrders} طلبات قيد الانتظار
          </div>
        </div>

        {/* Total Products */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          border: '1px solid #e9e9ee',
          padding: '20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#747474' }}>المنتجات في المتجر</span>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: '#fff7ed', color: '#f97316', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Package size={20} />
            </div>
          </div>
          <div style={{ fontSize: '24px', fontWeight: 900, color: '#101010' }}>
            {totalProducts}
          </div>
          <div style={{ fontSize: '11px', color: '#f97316', marginTop: '6px', fontWeight: 700 }}>
            {lowStockProducts.length} منتجات منخفضة المخزون
          </div>
        </div>

        {/* Total Customers */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          border: '1px solid #e9e9ee',
          padding: '20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#747474' }}>قاعدة العملاء</span>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: '#fdf2f8', color: '#db2777', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Users size={20} />
            </div>
          </div>
          <div style={{ fontSize: '24px', fontWeight: 900, color: '#101010' }}>
            {totalCustomers}
          </div>
          <div style={{ fontSize: '11px', color: '#747474', marginTop: '6px' }}>
            عملاء مسجلين
          </div>
        </div>
      </div>

      {/* Main Grid: Recent Orders & Low Stock */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
        gap: '24px',
        alignItems: 'flex-start'
      }}>
        {/* Recent Orders Table */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '20px',
          border: '1px solid #e9e9ee',
          padding: '22px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
          gridColumn: 'span 2'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '18px'
          }}>
            <h3 style={{ fontSize: '17px', fontWeight: 900, color: '#101010', margin: 0 }}>
              أحدث الطلبات
            </h3>
            <Link
              to="/admin/orders"
              style={{ fontSize: '13px', fontWeight: 700, color: '#172cf4', textDecoration: 'none' }}
            >
              عرض كل الطلبات ←
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '30px', color: '#747474', fontSize: '14px' }}>
              لا توجد طلبات حتى الآن
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right', fontSize: '13px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #e9e9ee', color: '#747474' }}>
                    <th style={{ padding: '10px 12px' }}>رقم الطلب</th>
                    <th style={{ padding: '10px 12px' }}>العميل</th>
                    <th style={{ padding: '10px 12px' }}>المحافظة</th>
                    <th style={{ padding: '10px 12px' }}>المبلغ</th>
                    <th style={{ padding: '10px 12px' }}>الحالة</th>
                    <th style={{ padding: '10px 12px' }}>تحديث</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((ord) => (
                    <tr key={ord._id} style={{ borderBottom: '1px solid #f8f8fa' }}>
                      <td style={{ padding: '12px', fontWeight: 800, color: '#f20d16' }}>
                        {ord.orderNumber}
                      </td>
                      <td style={{ padding: '12px', fontWeight: 700, color: '#202020' }}>
                        {ord.shippingAddress?.fullName || 'عميل'}
                      </td>
                      <td style={{ padding: '12px', color: '#525252' }}>
                        {ord.shippingAddress?.city || 'مصر'}
                      </td>
                      <td style={{ padding: '12px', fontWeight: 800, color: '#101010' }}>
                        {ord.total?.toLocaleString('ar-EG')} ج.م
                      </td>
                      <td style={{ padding: '12px' }}>
                        <span style={{
                          fontSize: '11px',
                          fontWeight: 700,
                          padding: '3px 8px',
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
                      <td style={{ padding: '12px' }}>
                        <select
                          value={ord.status}
                          onChange={(e) => handleQuickStatusChange(ord._id, e.target.value)}
                          style={{
                            padding: '4px 8px',
                            borderRadius: '6px',
                            border: '1px solid #d0d0d8',
                            fontSize: '12px',
                            cursor: 'pointer'
                          }}
                        >
                          <option value="pending">قيد الانتظار</option>
                          <option value="processing">جاري التجهيز</option>
                          <option value="shipped">تم الشحن</option>
                          <option value="delivered">تم التوصيل</option>
                          <option value="cancelled">إلغاء</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Low Stock Alerts */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '20px',
          border: '1px solid #e9e9ee',
          padding: '22px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <AlertTriangle size={18} color="#f97316" />
            <h3 style={{ fontSize: '16px', fontWeight: 900, color: '#101010', margin: 0 }}>
              تنبيهات المخزون
            </h3>
          </div>

          {lowStockProducts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '20px', color: '#10b981', fontSize: '13px', fontWeight: 600 }}>
              ✓ جميع المنتجات بحالة جيدة في المخزون
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {lowStockProducts.map((p) => (
                <div
                  key={p._id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 12px',
                    borderRadius: '10px',
                    backgroundColor: '#fff7ed',
                    fontSize: '13px'
                  }}
                >
                  <span style={{ fontWeight: 700, color: '#c2410c' }}>{p.name}</span>
                  <strong style={{ color: '#ea580c' }}>متبقي: {p.stock}</strong>
                </div>
              ))}
            </div>
          )}

          <div style={{ marginTop: '20px' }}>
            <Link
              to="/admin/products"
              style={{
                display: 'block',
                textAlign: 'center',
                padding: '10px',
                borderRadius: '10px',
                backgroundColor: '#f8f8fa',
                color: '#202020',
                fontSize: '13px',
                fontWeight: 700,
                textDecoration: 'none'
              }}
            >
              إدارة وتحديث المخزون
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
