import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function AdminRoute() {
  const { user, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 20px', color: '#747474' }} dir="rtl">
        جاري التحقق من الصلاحيات...
      </div>
    );
  }

  if (!user || !isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
}
