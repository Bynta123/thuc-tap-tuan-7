import { useSyncExternalStore } from 'react';
import { WifiOff } from 'lucide-react';

function subscribe(onChange: () => void): () => void {
  window.addEventListener('online', onChange);
  window.addEventListener('offline', onChange);
  return () => {
    window.removeEventListener('online', onChange);
    window.removeEventListener('offline', onChange);
  };
}

const getSnapshot = (): boolean => navigator.onLine;
const getServerSnapshot = (): boolean => true;

/** Hook đọc trạng thái mạng của trình duyệt (re-render khi online/offline đổi). */
export function useOnlineStatus(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function OfflineBanner() {
  const isOnline = useOnlineStatus();
  if (isOnline) return null;

  return (
    <div
      role="status"
      className="flex items-center justify-center gap-2 bg-amber-500 px-4 py-2 text-[13px] font-medium text-white"
    >
      <WifiOff className="h-4 w-4" />
      <span>Bạn đang offline. Giao diện vẫn mở được từ bộ nhớ đệm, nhưng dữ liệu cần kết nối mạng.</span>
    </div>
  );
}
