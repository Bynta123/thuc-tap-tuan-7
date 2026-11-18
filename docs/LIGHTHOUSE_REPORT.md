# Báo cáo Web Vitals / Lighthouse (trước và sau tối ưu)

> File này là **mẫu để điền số liệu thật**. Số liệu phải đo trên máy của bạn, không điền số ước đoán.

## Cách đo
1. `npm run preview:prod` (bản build production, KHÔNG đo trên `npm run dev`).
2. Mở Chrome ở chế độ ẩn danh (tránh extension làm sai điểm), vào `http://localhost:4173`.
3. DevTools > Lighthouse > chọn Mobile, tick Performance / Accessibility / Best Practices / SEO > Analyze.
   Hoặc chạy `npm run lighthouse` (kết quả ở `reports/lighthouse.html`).
4. Mỗi trang đo 3 lần, lấy giá trị trung bình hoặc trung vị.

## Cách có số liệu "trước"
Dùng `git stash` hoặc checkout bản tuần 5 (chưa tối ưu), build, đo, ghi vào cột Trước. Sau đó quay lại bản tuần 7 và đo cột Sau.

## Kết quả

| Trang | Chỉ số | Trước | Sau |
| --- | --- | --- | --- |
| `/products` | Performance (điểm) | | 99 |
| `/products` | LCP | | 0.8 s |
| `/products` | CLS | | 0 |
| `/products` | INP / TBT | | 100 ms |
| `/products` | Tổng JS tải ban đầu (KB) | | 130.4 KB |
| `/home` | Performance (điểm) | | 96 |
| `/home` | LCP | | 2.6 s |

Ngưỡng "tốt" của Core Web Vitals: LCP ≤ 2.5s, CLS ≤ 0.1, INP ≤ 200ms.

## Đo re-render bằng React DevTools Profiler
1. Cài extension React Developer Tools, mở tab Profiler.
2. Bấm Record, gõ vài ký tự vào ô "Tìm kiếm theo tên sản phẩm", dừng Record.
3. Bản tuần 5: `ProductTable` và `Pagination` render lại mỗi lần gõ. Bản tuần 7: chúng không xuất hiện trong danh sách component đã render (hoặc hiện "Did not render").
4. Chụp màn hình trước/sau và dán vào đây.

## Những thay đổi đã làm để cải thiện điểm
- Code splitting theo route + tách chunk vendor (giảm JS tải ban đầu).
- Font Google tải không chặn render (`media="print"` + `onload`), có `font-display: swap`.
- Thêm favicon, `meta description`, `theme-color`, manifest (giảm lỗi Best Practices / SEO).
- Ảnh sản phẩm có `width`, `height`, `loading="lazy"`, `decoding="async"` (giảm CLS).
- Service Worker cache file tĩnh, header cache dài cho `/assets/*` (lần truy cập sau nhanh hơn).
