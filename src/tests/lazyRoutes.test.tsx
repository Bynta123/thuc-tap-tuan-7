import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { AppRoutes } from '@/App';

describe('Lazy loading + Suspense', () => {
  it('hiển thị fallback khi chunk đang tải, sau đó render page', async () => {
    render(
      <MemoryRouter initialEntries={['/duong-dan-khong-ton-tai']}>
        <AppRoutes />
      </MemoryRouter>
    );

    // Page được import động nên lần render đầu tiên là fallback của Suspense.
    expect(screen.getByRole('status')).toHaveTextContent('Đang tải trang...');

    expect(await screen.findByText('Không tìm thấy trang')).toBeInTheDocument();
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });
});
