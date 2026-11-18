import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { ProductTable } from '@/components/products/ProductTable';
import type { Product } from '@/types/product';

// Đếm số lần StatusBadge (con của mỗi dòng) được render => đo được re-render của từng dòng.
const badgeRenders = vi.hoisted(() => vi.fn());
vi.mock('@/components/common/StatusBadge', () => ({
  StatusBadge: ({ status }: { status: string }) => {
    badgeRenders(status);
    return status;
  },
}));

function makeProduct(id: string, name: string): Product {
  return {
    id,
    name,
    categoryId: 'cat-1',
    categoryName: 'Điện thoại',
    price: 1000000,
    quantity: 10,
    status: 'IN_STOCK',
    description: '',
    imageUrl: '',
    createdAt: '2024-04-10T09:00:00.000Z',
    updatedAt: '2024-04-10T09:00:00.000Z',
  };
}

const PRODUCT_A = makeProduct('a', 'Sản phẩm A');
const PRODUCT_B = makeProduct('b', 'Sản phẩm B');
const onRequestDelete = vi.fn();

function Harness({ products, tick }: { products: Product[]; tick: number }) {
  return (
    <MemoryRouter>
      {/* `tick` mô phỏng component cha render lại (ví dụ gõ vào ô tìm kiếm) */}
      <span data-testid="tick">{tick}</span>
      <ProductTable products={products} page={1} limit={5} onRequestDelete={onRequestDelete} />
    </MemoryRouter>
  );
}

describe('ProductTable (React.memo)', () => {
  it('không render lại các dòng khi cha render lại nhưng props không đổi', () => {
    badgeRenders.mockClear();
    const products = [PRODUCT_A, PRODUCT_B];

    const { rerender } = render(<Harness products={products} tick={1} />);
    expect(badgeRenders).toHaveBeenCalledTimes(2);

    rerender(<Harness products={products} tick={2} />);
    expect(screen.getByTestId('tick')).toHaveTextContent('2');
    expect(badgeRenders).toHaveBeenCalledTimes(2);
  });

  it('chỉ render lại dòng có dữ liệu thay đổi', () => {
    badgeRenders.mockClear();

    const { rerender } = render(<Harness products={[PRODUCT_A, PRODUCT_B]} tick={1} />);
    expect(badgeRenders).toHaveBeenCalledTimes(2);

    rerender(
      <Harness products={[PRODUCT_A, { ...PRODUCT_B, name: 'Sản phẩm B (đã sửa)' }]} tick={1} />
    );
    expect(screen.getByText('Sản phẩm B (đã sửa)')).toBeInTheDocument();
    expect(badgeRenders).toHaveBeenCalledTimes(3);
  });

  it('gọi onRequestDelete với đúng sản phẩm khi bấm nút xóa', () => {
    render(<Harness products={[PRODUCT_A, PRODUCT_B]} tick={1} />);
    fireEvent.click(screen.getByRole('button', { name: 'Xóa Sản phẩm B' }));
    expect(onRequestDelete).toHaveBeenCalledWith(PRODUCT_B);
  });
});
