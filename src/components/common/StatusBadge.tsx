import { memo } from 'react';
import type { ProductStatus } from '@/types/product';
import { PRODUCT_STATUS_CONFIG } from '@/utils/formatters';

interface StatusBadgeProps {
  status: ProductStatus;
}

function StatusBadgeComponent({ status }: StatusBadgeProps) {
  const config = PRODUCT_STATUS_CONFIG[status];
  return (
    <span
      className={`inline-flex items-center justify-center rounded-full px-3 py-1 text-xs font-medium whitespace-nowrap ${config.badgeClassName}`}
    >
      {config.label}
    </span>
  );
}

/** memo: badge chỉ phụ thuộc `status` nên không cần render lại khi component cha render. */
export const StatusBadge = memo(StatusBadgeComponent);
