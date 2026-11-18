import { lazy, type ComponentType, type LazyExoticComponent } from 'react';

const RELOAD_FLAG = 'pm_chunk_reload';

/**
 * Bọc React.lazy cho page dùng named export (`export function XxxPage`).
 *
 * Sau mỗi lần deploy, tên file chunk (hash) thay đổi. Người dùng đang mở bản cũ sẽ gặp lỗi
 * "Failed to fetch dynamically imported module" khi vào trang mới. Ta tự reload 1 lần để lấy
 * bản mới; nếu vẫn lỗi thì ném lỗi ra cho ErrorBoundary xử lý (tránh vòng lặp reload).
 */
export function lazyRoute<TModule extends Record<string, unknown>, TKey extends keyof TModule>(
  loader: () => Promise<TModule>,
  exportName: TKey
): LazyExoticComponent<ComponentType<Record<string, never>>> {
  return lazy(async () => {
    try {
      const module = await loader();
      window.sessionStorage.removeItem(RELOAD_FLAG);
      return { default: module[exportName] as ComponentType<Record<string, never>> };
    } catch (error) {
      if (window.sessionStorage.getItem(RELOAD_FLAG) !== '1') {
        window.sessionStorage.setItem(RELOAD_FLAG, '1');
        window.location.reload();
        // Giữ Suspense ở trạng thái loading trong lúc trang reload.
        return new Promise<never>(() => undefined);
      }
      throw error;
    }
  });
}
