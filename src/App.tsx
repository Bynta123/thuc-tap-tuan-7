import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { ProductsLayout } from '@/components/layout/ProductsLayout';
import { RootLayout } from '@/components/layout/RootLayout';
import { AuthProvider } from '@/contexts/AuthContext';
import { ToastProvider } from '@/contexts/ToastContext';
import { lazyRoute } from '@/utils/lazyRoute';

// Code splitting: mỗi page là 1 chunk riêng, chỉ tải khi người dùng vào route tương ứng.
const HomePage = lazyRoute(() => import('@/pages/HomePage'), 'HomePage');
const CategoriesPage = lazyRoute(() => import('@/pages/CategoriesPage'), 'CategoriesPage');
const LoginPage = lazyRoute(() => import('@/pages/LoginPage'), 'LoginPage');
const NotFoundPage = lazyRoute(() => import('@/pages/NotFoundPage'), 'NotFoundPage');
const ProductListPage = lazyRoute(() => import('@/pages/ProductListPage'), 'ProductListPage');
const ProductCreatePage = lazyRoute(() => import('@/pages/ProductCreatePage'), 'ProductCreatePage');
const ProductDetailPage = lazyRoute(() => import('@/pages/ProductDetailPage'), 'ProductDetailPage');
const ProductEditPage = lazyRoute(() => import('@/pages/ProductEditPage'), 'ProductEditPage');

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<RootLayout />}>
        <Route index element={<Navigate to="/products" replace />} />
        <Route path="home" element={<HomePage />} />

        <Route path="products" element={<ProductsLayout />}>
          <Route index element={<ProductListPage />} />
          <Route path="create" element={<ProductCreatePage />} />
          <Route path=":id" element={<Outlet />}>
            <Route index element={<ProductDetailPage />} />
            <Route path="edit" element={<ProductEditPage />} />
          </Route>
        </Route>

        <Route path="categories" element={<CategoriesPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export function App() {
  return (
    // Error Boundary ngoài cùng: bắt lỗi của cả provider/layout (boundary trong RootLayout chỉ bắt lỗi của page).
    <ErrorBoundary>
      <BrowserRouter>
        <ToastProvider>
          <AuthProvider>
            <AppRoutes />
          </AuthProvider>
        </ToastProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
