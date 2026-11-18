/**
 * Đăng ký Service Worker (public/sw.js).
 * Chỉ chạy ở bản production để tránh cache làm khó debug khi dev (HMR).
 * Ở dev, gỡ SW cũ (nếu từng đăng ký trên localhost) để luôn thấy code mới nhất.
 */
export function registerServiceWorker(): void {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;

  if (!import.meta.env.PROD) {
    void navigator.serviceWorker
      .getRegistrations()
      .then((registrations) => registrations.forEach((registration) => void registration.unregister()))
      .catch(() => undefined);
    return;
  }

  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch((error: unknown) => {
      console.warn('[SW] Đăng ký Service Worker thất bại:', error);
    });
  });
}
