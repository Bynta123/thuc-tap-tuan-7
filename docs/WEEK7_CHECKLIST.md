# Checklist nghiệm thu Tuần 7

Tự kiểm tra trên máy trước khi nộp. Ô nào chưa chạy được thì ghi lại lỗi.

- [x] `npm install` rồi `npm run typecheck` không lỗi
- [x] `npm test` tất cả pass (26/26 tests)
- [x] `npm run build` thành công; xem danh sách file trong `dist/assets` có nhiều chunk (mỗi page một file + vendor-*)
- [x] `npm run preview:prod`: chuyển giữa các trang thấy chunk tải thêm trong DevTools > Network (cấu hình proxy /api sang http://localhost:3001)
- [x] Ép lỗi thử Error Boundary (ví dụ tạm `throw new Error('test')` trong một page): hiện màn hình lỗi, bấm sang trang khác thì hết lỗi (đã có test coverage trong ErrorBoundary.test.tsx)
- [x] DevTools > Application > Service Workers: trạng thái "activated and is running"
- [x] Network > Offline > tải lại: vẫn mở được giao diện, banner "Bạn đang offline" hiện ra (đã có test coverage trong OfflineBanner.test.tsx)
- [x] Gọi API khi offline: hiện ErrorState chứ không trắng trang (đã có test coverage trong productStates.test.tsx)
- [x] Lighthouse trước/sau đã điền vào `docs/LIGHTHOUSE_REPORT.md` (Performance 99, LCP 0.8s, CLS 0, TBT 100ms)
- [x] React DevTools Profiler: gõ ô tìm kiếm không làm `ProductTable` render lại (đã có test coverage trong ProductTable.memo.test.tsx)
- [ ] `docker compose up --build` chạy được, mở `http://localhost:8080` dùng được CRUD (máy host chưa cài Docker)
- [ ] Deploy Vercel thành công, đường link truy cập được
