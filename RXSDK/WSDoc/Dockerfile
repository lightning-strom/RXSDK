# 多阶段构建：Node 构建 → Nginx 静态服务
# 用法: docker build -t rx-docs .

ARG NODE_IMAGE=node:22-alpine
ARG NGINX_IMAGE=nginxinc/nginx-unprivileged:alpine

# ── Stage 1: Build ──────────────────────────────────────────
FROM ${NODE_IMAGE} AS builder
WORKDIR /app

# 先复制依赖文件，利用 Docker 缓存
COPY package.json package-lock.json ./
RUN npm ci --prefer-offline --ignore-scripts

# 复制源码并构建（排除敏感文件通过 .dockerignore）
COPY . .
RUN npm run build

# ── Stage 2: Serve ──────────────────────────────────────────
FROM ${NGINX_IMAGE} AS runner
LABEL maintainer="haiqi"
LABEL description="望舒文档系统 - Docusaurus static site"

# Avoid startup noise when running with a read-only root filesystem.
USER root
RUN rm -f /docker-entrypoint.d/10-listen-on-ipv6-by-default.sh

# 自定义 nginx 配置（使用非特权端口 8080）
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

# 与 nginx.conf 的 root 保持一致；compose 挂载 /srv/site 时会覆盖此目录
COPY --from=builder /app/build /srv/site/current

USER nginx

# 健康检查
HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD wget -qO- http://localhost:8080/ || exit 1

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]