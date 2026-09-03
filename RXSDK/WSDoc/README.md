# 望舒文档系统

本项目是望舒开发者文档站，基于 [Docusaurus](https://docusaurus.io/) 构建。

- 文档主目录：`docs/`
- 当前主维护版本：`docs`（导航显示为 `v4.x`）
- 历史版本快照目录：`versioned_docs/`（执行版本快照后生成）

## 快速开始

```bash
npm install
npm run start
```

本地启动后，默认访问 `http://localhost:3000/`。

### 局域网访问（同网段设备预览）

```bash
npm run start -- --host 0.0.0.0 --port 3000
```

访问地址示例：`http://<你的局域网IP>:3000/`（例如 `http://10.10.3.33:3000/`）。

## 常用命令

```bash
# 本地开发
npm run start

# 生产构建
npm run build

# 本地预览 build 产物
npm run serve

# 历史链接批量清理（迁移文档推荐先执行）
npm run fix:legacy-links

# 创建文档版本快照（示例：v3.5）
npm run docs:version v3.5
```

### `start` / `build` / `serve` 区别

- `npm run start`：开发模式，实时热更新，日常编辑用。
- `npm run build`：生产构建，检查可发布产物并输出 `build/`。
- `npm run serve`：只托管 `build/` 静态文件；若未先 `build`，访问通常会是 404。

## 文档版本管理

- `docs/` 始终是当前维护版本（最新版本）。
- 执行 `npm run docs:version <版本号>` 后，会把当前文档拍快照到 `versioned_docs/`。
- 版本下拉来自 Docusaurus 版本系统，适合维护 `v4.x` + 旧版本只读文档。

### v3.5 历史版本说明

- `versioned_docs/version-v3.5/` 为历史快照，允许存在部分旧链接格式。
- 当前构建已无 MDX 编译错误（不会阻塞构建）。
- 若需要进一步清理历史坏链 warning，可继续对 `version-v3.5` 做链接治理。

## 链接治理（迁移文档）

如果文档中包含历史 `.md` / `.html` 链接或旧 `#/view` 链接，可执行：

```bash
npm run fix:legacy-links
npm run build
```

脚本会按已配置规则重写 `docs/**/*.mdx` 中的历史链接模式，减少坏链。

## v3.5 历史版链接治理

针对 `versioned_docs/version-v3.5` 的旧版文档链接优化：

```bash
# 分析残留 doc.ruixueyun.com 外链频次
npm run analyze:v35-links

# 批量替换高频 UUID 外链为站内路径
npm run fix:v35-links

# 修复相对路径 (../ ./) 为绝对路径 /docs/v3.5/...
npm run fix:v35-relative

# 注入 v3.5 → v4.x 交叉引导 banner
npm run inject:v35-v4-banner
```

- 映射规则：`scripts/v35-uuid-map.json`（149 条 UUID → 站内路径）
- 频次报告：`scripts/v35-uuid-frequency.json`
- 交叉引导：`scripts/v35-v4-crosslinks.json`（24 组 v3.5 → v4 对照）
- 未映射的低频 UUID 保留原始外链，不影响构建

## 文档编写约定（MDX vs JSX）

- 默认使用 **MDX 语法**（标题、列表、代码块、`:::tip` 等）。
- MDX 指令渲染异常或需要复杂展示时，允许使用 **JSX 组件**（如 `Admonition`）兜底。
- 内容稳定后优先回归 MDX 写法，提升可读性与维护效率。

## 部署

### 方式一：GitHub Pages

```bash
# 使用 SSH
USE_SSH=true npm run deploy

# 不使用 SSH
GIT_USER=<你的 GitHub 用户名> npm run deploy
```

执行后会构建并推送到 `gh-pages` 分支。

### 方式二：Docker 容器（内网部署）

```bash
# 一键构建 + 启动（使用 docker-compose）
bash scripts/deploy.sh

# 或手动执行
docker compose up -d --build
```

- 默认监听 `80` 端口，可通过 `docker-compose.yml` 修改端口映射
- Nginx 配置位于 `docker/nginx.conf`，已针对 `/docs/` 路径优化（真实文件优先，404 而非 SPA fallback）
- 访问地址：`http://10.10.3.33:3000/`（根据实际服务器 IP 调整）

### 镜像构建推送与登记

```bash
# 构建并推送指定 tag 的最新镜像，同时登记镜像信息
make release TAG=v1.0.2

# 仅构建并推送镜像
make push-image TAG=v1.0.2

# 仅登记镜像信息
make save-image TAG=v1.0.2

# Docker Hub 镜像源限流时，可指定已同步到内网/可用镜像源的基础镜像
make release TAG=v1.0.2 NGINX_IMAGE=<mirror>/nginxinc/nginx-unprivileged:alpine
```

`TAG` 会同步用于镜像地址与登记接口的 `branch_name`，例如：
`haiqi-registry.cn-beijing.cr.aliyuncs.com/haiqiruixue/rx-docs:v1.0.2`。
