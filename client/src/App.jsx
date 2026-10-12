import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Common Storefront Components
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import CartDrawer from './components/common/CartDrawer';
import WhatsAppButton from './components/common/WhatsAppButton';

// Storefront Pages
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import BridalPackagesPage from './pages/BridalPackagesPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import TrackOrderPage from './pages/TrackOrderPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';

// Admin Components & Pages
import AdminRoute from './components/admin/AdminRoute';
import AdminLayout from './components/admin/AdminLayout';
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminProductsPage from './pages/admin/AdminProductsPage';
import AdminCategoriesPage from './pages/admin/AdminCategoriesPage';
import AdminOrdersPage from './pages/admin/AdminOrdersPage';
import AdminBridalPage from './pages/admin/AdminBridalPage';
import AdminSettingsPage from './pages/admin/AdminSettingsPage';

// Storefront Wrapper Layout
function StorefrontLayout({ children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <CartDrawer />
      <main style={{ flex: 1 }}>
        {children}
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      {/* ─── Storefront Routes ────────────────────────────────────────── */}
      <Route
        path="/"
        element={
          <StorefrontLayout>
            <HomePage />
          </StorefrontLayout>
        }
      />
      <Route
        path="/products"
        element={
          <StorefrontLayout>
            <ProductsPage />
          </StorefrontLayout>
        }
      />
      <Route
        path="/product/:slug"
        element={
          <StorefrontLayout>
            <ProductDetailPage />
          </StorefrontLayout>
        }
      />
      <Route
        path="/bridal"
        element={
          <StorefrontLayout>
            <BridalPackagesPage />
          </StorefrontLayout>
        }
      />
      <Route
        path="/cart"
        element={
          <StorefrontLayout>
            <CartPage />
          </StorefrontLayout>
        }
      />
      <Route
        path="/checkout"
        element={
          <StorefrontLayout>
            <CheckoutPage />
          </StorefrontLayout>
        }
      />
      <Route
        path="/order-success/:orderId"
        element={
          <StorefrontLayout>
            <OrderSuccessPage />
          </StorefrontLayout>
        }
      />
      <Route
        path="/track-order"
        element={
          <StorefrontLayout>
            <TrackOrderPage />
          </StorefrontLayout>
        }
      />
      <Route
        path="/login"
        element={
          <StorefrontLayout>
            <LoginPage />
          </StorefrontLayout>
        }
      />
      <Route
        path="/register"
        element={
          <StorefrontLayout>
            <RegisterPage />
          </StorefrontLayout>
        }
      />
      <Route
        path="/profile"
        element={
          <StorefrontLayout>
            <ProfilePage />
          </StorefrontLayout>
        }
      />

      {/* ─── Admin Auth ──────────────────────────────────────────────── */}
      <Route path="/admin/login" element={<AdminLoginPage />} />

      {/* ─── Protected Admin Dashboard ──────────────────────────────── */}
      <Route path="/admin" element={<AdminRoute />}>
        <Route element={<AdminLayout />}>
          <Route index element={<AdminDashboardPage />} />
          <Route path="products" element={<AdminProductsPage />} />
          <Route path="categories" element={<AdminCategoriesPage />} />
          <Route path="orders" element={<AdminOrdersPage />} />
          <Route path="bridal" element={<AdminBridalPage />} />
          <Route path="settings" element={<AdminSettingsPage />} />
        </Route>
      </Route>

      {/* ─── Fallback 404 ────────────────────────────────────────────── */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
