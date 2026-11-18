import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';

let shouldThrow = true;

function Bomb() {
  if (shouldThrow) throw new Error('Boom từ component con');
  return <p>Nội dung bình thường</p>;
}

describe('ErrorBoundary', () => {
  beforeEach(() => {
    shouldThrow = true;
    // React in lỗi ra console.error khi boundary bắt lỗi; tắt để output test gọn.
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('hiển thị màn hình lỗi thay vì trắng trang khi component con ném lỗi', () => {
    render(
      <ErrorBoundary>
        <Bomb />
      </ErrorBoundary>
    );

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('Ứng dụng gặp sự cố hiển thị')).toBeInTheDocument();
    expect(screen.getByText('Boom từ component con')).toBeInTheDocument();
  });

  it('gọi onError với lỗi đã bắt được', () => {
    const onError = vi.fn();
    render(
      <ErrorBoundary onError={onError}>
        <Bomb />
      </ErrorBoundary>
    );

    expect(onError).toHaveBeenCalledTimes(1);
    expect(onError.mock.calls[0]?.[0]).toBeInstanceOf(Error);
  });

  it('nút "Thử khôi phục" render lại nội dung khi lỗi đã hết', () => {
    render(
      <ErrorBoundary>
        <Bomb />
      </ErrorBoundary>
    );

    shouldThrow = false;
    fireEvent.click(screen.getByRole('button', { name: /Thử khôi phục/ }));

    expect(screen.getByText('Nội dung bình thường')).toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('tự reset khi resetKeys đổi (ví dụ chuyển route)', () => {
    const { rerender } = render(
      <ErrorBoundary resetKeys={['/products']}>
        <Bomb />
      </ErrorBoundary>
    );
    expect(screen.getByRole('alert')).toBeInTheDocument();

    shouldThrow = false;
    rerender(
      <ErrorBoundary resetKeys={['/home']}>
        <Bomb />
      </ErrorBoundary>
    );

    expect(screen.getByText('Nội dung bình thường')).toBeInTheDocument();
  });
});
