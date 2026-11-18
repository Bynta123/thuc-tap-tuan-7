import { act, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { OfflineBanner } from '@/components/common/OfflineBanner';

function setNavigatorOnline(value: boolean) {
  Object.defineProperty(window.navigator, 'onLine', {
    configurable: true,
    get: () => value,
  });
}

describe('OfflineBanner', () => {
  afterEach(() => {
    // Xóa thuộc tính tự định nghĩa để trả về getter mặc định của jsdom.
    Reflect.deleteProperty(window.navigator, 'onLine');
  });

  it('không hiển thị gì khi đang online', () => {
    setNavigatorOnline(true);
    render(<OfflineBanner />);
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('hiện banner khi mất mạng và ẩn lại khi có mạng', () => {
    setNavigatorOnline(true);
    render(<OfflineBanner />);

    act(() => {
      setNavigatorOnline(false);
      window.dispatchEvent(new Event('offline'));
    });
    expect(screen.getByRole('status')).toHaveTextContent('Bạn đang offline');

    act(() => {
      setNavigatorOnline(true);
      window.dispatchEvent(new Event('online'));
    });
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });
});
