# Quản lý sản phẩm — React + TypeScript + Axios + Nested Routing (Tuần 7: Performance & Mini Project)

> **Live Demo Vercel:** [https://thuc-tap-tuan-7.vercel.app/products](https://thuc-tap-tuan-7.vercel.app/products)

Ứng dụng thực hành xây dựng hệ thống **Quản lý sản phẩm** hoàn chỉnh theo kiến trúc chuẩn doanh nghiệp:

- **Routing nhiều cấp (Nested Routes)** với `react-router-dom`:
  - `/` (`RootLayout`) -> `HomePage` (Trang chủ tổng quan)
  - `/products` (`ProductsLayout` + Breadcrumb động)
    - `/products` -> `ProductListPage` (Form thêm mới + Danh sách, tìm kiếm, lọc, phân trang, xuất Excel/CSV)
    - `/products/create` -> `ProductCreatePage` (Trang tạo sản phẩm mới)
    - `/products/:id` -> `ProductDetailPage` (Chi tiết sản phẩm qua URL param `:id`)
    - `/products/:id/edit` -> `ProductEditPage` (Chỉnh sửa sản phẩm qua URL param `:id`)
  - `/categories` -> `CategoriesPage` (Quản lý danh mục, tái sử dụng cùng Generic CRUD service)
  - `/login` -> `LoginPage` (Quản lý phiên đăng nhập / Bearer token & kiểm thử lỗi 401)
  - `*` -> `NotFoundPage`
- **API Service tách biệt khỏi UI** (`src/services/`) với **Axios instance + Interceptors**:
  - Request interceptor tự động gắn `Authorization: Bearer <token>` từ `tokenStorage` (key cấu hình qua `.env`) và `X-Request-Id`.
  - Response interceptor chuẩn hóa toàn bộ lỗi HTTP/mạng/timeout thành `AppApiError` và tự động xử lý `401 Unauthorized`.
- **TypeScript nâng cao (Generics & Utility Types)** (`src/types/`, `src/services/baseCrudService.ts`):
  - Generics: `ApiResponse<TData>`, `PaginatedData<TItem>`, `PaginatedApiResponse<TItem>`, `AsyncState<TData>`, `CrudService<TEntity, TCreatePayload, TUpdatePayload, TQueryParams>`, `createCrudService<...>()`.
  - Utility Types: `Omit`, `Partial`, `Pick`, `Record`, `keyof`, `FormErrors<TValues>`, `ProductStatusConfig`.
- **Biến môi trường (`.env`, `.env.development`, `.env.production`, `.env.example`)**:
  - Không hard-code URL hoặc token trong mã nguồn.
- **Xử lý đầy đủ 3 trạng thái Loading / Error / Empty** trên mọi màn hình, kèm `ErrorBoundary` chống trắng trang khi gặp sự cố.

## Khởi chạy dự án

### 1. Cài đặt dependencies
```bash
npm install
```

### 2. Chạy cả Backend API và Frontend cùng lúc (Khuyến nghị)
```bash
npm run dev
```
- Frontend Vite: `http://localhost:5173`
- Backend REST API: `http://localhost:3001/api`

### Các lệnh khác
- `npm run dev:client`: Chỉ chạy Vite frontend
- `npm run dev:server`: Chỉ chạy Express API server
- `npm run typecheck`: Kiểm tra TypeScript (`tsc --noEmit`)
- `npm test`: Chạy unit/component tests với Vitest
- `npm run build`: Build bản production (`dist/`)

### Lệnh bổ sung (Tuần 7)
- `npm run preview:prod`: build production rồi chạy bản build tại `http://localhost:4173` (dùng để đo Lighthouse / thử Service Worker)
- `npm run lighthouse`: chạy Lighthouse (cần bản preview đang chạy ở cổng 4173), xuất `reports/lighthouse.html`
- `npm run docker:up`: build và chạy toàn bộ ứng dụng bằng Docker (web: `http://localhost:8080`)

---

## Tuần 7 — Performance & Mini Project

| Yêu cầu | Thực hiện ở đâu |
| --- | --- |
| `memo` / `useMemo` / `useCallback` | `ProductTable` (dòng `ProductRow` memo riêng), `ProductFilterBar`, `Pagination`, `StatusBadge`, `ProductThumbnail` dùng `memo`; `ProductListPage` dùng `useCallback` cho handler, `useMemo` cho `filters`; `Pagination` dùng `useMemo` tính dãy số trang |
| Code splitting, Lazy loading, Suspense | `src/App.tsx` (mỗi page là một chunk qua `lazyRoute`), `src/utils/lazyRoute.ts`, `Suspense` trong `RootLayout`; `vite.config.ts` tách chunk vendor (`vendor-react`, `vendor-router`, `vendor-axios`) |
| Error Boundary toàn cục | `ErrorBoundary` ngoài cùng trong `App.tsx` + boundary trong `RootLayout` tự reset khi đổi route (`resetKeys`) |
| Unit test | `src/tests/*.test.tsx` (ErrorBoundary, Pagination, StatusBadge, ProductTable memo, OfflineBanner, lazy routes) cùng test cũ của tuần 5 |
| Service Worker | `public/sw.js`, `src/utils/registerServiceWorker.ts`, `public/offline.html`, `public/manifest.webmanifest` |
| Web Vitals / Lighthouse | Cải thiện `index.html` (font không chặn render, meta, favicon, manifest), ảnh có `width/height/loading=lazy`; báo cáo mẫu ở `docs/LIGHTHOUSE_REPORT.md` |
| Docker | `Dockerfile` (frontend + nginx), `Dockerfile.api` (Express), `docker-compose.yml`, `nginx.conf`, `.dockerignore` |
| Build production + Deploy | `vercel.json` (rewrite SPA, header cache cho `/assets` và `sw.js`) |

### Service Worker
- Chỉ đăng ký ở bản production (`import.meta.env.PROD`). Ở `npm run dev`, SW cũ trên localhost sẽ bị gỡ để không cache nhầm.
- Chiến lược: HTML dùng network-first (mất mạng thì dùng bản đã cache, không có thì `offline.html`); `/assets/*` cache-first; ảnh/font stale-while-revalidate; **`/api/*` không bao giờ được cache** nên dữ liệu CRUD luôn mới.
- Thử offline: `npm run preview:prod` → mở `http://localhost:4173`, duyệt vài trang → DevTools > Network > Offline → tải lại trang. DevTools > Application > Service Workers để kiểm tra trạng thái.
- Sau khi sửa `public/sw.js`, tăng `CACHE_VERSION` để xóa cache cũ.

### Docker
```bash
docker compose up --build        # web: http://localhost:8080 , API: /api (qua nginx)
docker compose down              # dừng (thêm -v để xóa luôn dữ liệu)
```
- Frontend được build với `.env.production` (`VITE_API_BASE_URL=/api`), nginx proxy `/api/` sang container `api`.
- Đặt `SESSION_SECRET` riêng khi chạy thật: `SESSION_SECRET=chuoi-bi-mat docker compose up --build`.

### Deploy lên Vercel
1. Push code lên GitHub, import repo vào Vercel (framework Vite, `vercel.json` đã cấu hình sẵn).
2. Biến môi trường: dùng `VITE_API_BASE_URL=/api` (đã có trong `.env.production`) vì API chạy cùng project qua `api/index.mjs`.
3. Lưu ý: trên Vercel, dữ liệu API lưu ở `/tmp` nên **không bền vững** (mất khi function khởi động lại). Phù hợp để demo, không dùng làm dữ liệu thật.
