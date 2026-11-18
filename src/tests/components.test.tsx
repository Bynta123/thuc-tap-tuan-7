import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Pagination } from '@/components/common/Pagination';
import { StatusBadge } from '@/components/common/StatusBadge';

describe('StatusBadge', () => {
  it.each([
    ['IN_STOCK', 'Còn hàng'],
    ['LOW_STOCK', 'Sắp hết'],
    ['OUT_OF_STOCK', 'Hết hàng'],
  ] as const)('hiển thị nhãn đúng cho trạng thái %s', (status, label) => {
    render(<StatusBadge status={status} />);
    expect(screen.getByText(label)).toBeInTheDocument();
  });
});

describe('Pagination', () => {
  function setup(page: number, totalPages = 3) {
    const onPageChange = vi.fn();
    const onLimitChange = vi.fn();
    render(
      <Pagination
        page={page}
        limit={5}
        totalPages={totalPages}
        onPageChange={onPageChange}
        onLimitChange={onLimitChange}
      />
    );
    return { onPageChange, onLimitChange };
  }

  it('đánh dấu trang hiện tại và vô hiệu hóa nút "Trang trước" ở trang 1', () => {
    setup(1);
    expect(screen.getByRole('button', { name: '1' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('button', { name: 'Trang trước' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Trang sau' })).toBeEnabled();
  });

  it('vô hiệu hóa nút "Trang sau" ở trang cuối', () => {
    setup(3);
    expect(screen.getByRole('button', { name: 'Trang sau' })).toBeDisabled();
  });

  it('gọi onPageChange khi bấm số trang hoặc nút điều hướng', () => {
    const { onPageChange } = setup(2);
    fireEvent.click(screen.getByRole('button', { name: '3' }));
    expect(onPageChange).toHaveBeenLastCalledWith(3);

    fireEvent.click(screen.getByRole('button', { name: 'Trang trước' }));
    expect(onPageChange).toHaveBeenLastCalledWith(1);
  });

  it('gọi onLimitChange khi đổi số bản ghi mỗi trang', () => {
    const { onLimitChange } = setup(1);
    fireEvent.change(screen.getByLabelText('Số bản ghi mỗi trang'), { target: { value: '10' } });
    expect(onLimitChange).toHaveBeenCalledWith(10);
  });

  it('chỉ hiển thị tối đa 5 số trang', () => {
    setup(5, 20);
    const pageButtons = screen
      .getAllByRole('button')
      .filter((button) => /^\d+$/.test(button.textContent ?? ''));
    expect(pageButtons).toHaveLength(5);
  });
});
