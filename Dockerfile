# ---------- Stage 1: build frontend (Vite) ----------
FROM node:22-alpine AS build
WORKDIR /app

# Copy file khai báo dependency trước để tận dụng cache layer của Docker
COPY package.json package-lock.json ./
RUN npm ci

COPY . .
# Dùng .env.production (VITE_API_BASE_URL=/api) -> trình duyệt gọi API cùng origin, nginx sẽ proxy sang service "api"
RUN npm run build

# ---------- Stage 2: phục vụ file tĩnh bằng nginx ----------
FROM nginx:1.27-alpine AS web
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://127.0.0.1/ >/dev/null || exit 1
CMD ["nginx", "-g", "daemon off;"]
