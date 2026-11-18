import { Suspense } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { LoadingState } from '@/components/common/LoadingState';
import { OfflineBanner } from '@/components/common/OfflineBanner';

export function RootLayout() {
  const { pathname } = useLocation();

  return (
    <div className="min-h-screen bg-[#f4f7fb] text-slate-900">
      <OfflineBanner />
      <main className="mx-auto max-w-[1160px] px-4 py-6 sm:px-6">
        {/* resetKeys: đổi route => thoát khỏi màn hình lỗi. Suspense: chờ chunk của page lazy. */}
        <ErrorBoundary resetKeys={[pathname]}>
          <Suspense fallback={<LoadingState message="Đang tải trang..." />}>
            <Outlet />
          </Suspense>
        </ErrorBoundary>
      </main>
    </div>
  );
}
