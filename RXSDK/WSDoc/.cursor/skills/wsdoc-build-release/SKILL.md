---
name: wsdoc-build-release
description: 执行望舒文档站 Docker 镜像发布，自动读取 ACR 当前最高语义化版本并递增 patch，通过 Makefile 的 make release 推送和登记镜像。用户提到推送文档镜像、make release、发布版本、登记镜像或文档发布时使用。
---

# 望舒文档构建发布

## 发布原则

- 推送镜像执行 makefile，make release，版本号获取当前镜像服务的版本号加 1。
- 要先将 build 之后的代码推送到仓库中，再执行后续 make release 逻辑。
- 当前镜像服务指 ACR 远程仓库，不使用本地 Docker 标签、Git Tag 或聊天记录作为版本来源。
- 发布只执行 Makefile 镜像流程，不触发 GitLab CI。
- `make release` 负责推送镜像并调用 `save_image` 登记镜像信息，不直接操作 K8s Deployment。

| 用户目标 | 命令 |
| --- | --- |
| 本地验证 | `npm run build` |
| 本地构建镜像 | `make build-image TAG=vX.Y.Z` |
| 推送并登记镜像 | `make release TAG=vX.Y.Z` |
| 重新登记已有镜像 | `make save-image TAG=vX.Y.Z` |

默认 `make` 只执行 `help`，绝不把它描述成构建或发布。

## 通用规则

1. 操作前读取最新的 `Makefile`，以仓库当前配置为准。
2. 发布属于外部写操作。只有用户明确要求“发布、推送、登记、部署”时才执行。
3. 用户要求发布时，视为授权提交并推送本次相关代码；必须遵循 Git 安全流程，禁止带入凭证或无关改动。
4. 发布版本必须使用 `vX.Y.Z` 格式；用户未指定时自动查询 ACR 并递增 patch，禁止使用 `latest`。
5. 不输出、记录或要求用户在聊天中粘贴仓库密码。需要登录时运行交互式 `docker login`，或让用户完成登录。
6. 任一步失败立即停止，不得继续登记未成功推送的镜像。
7. 只从不会触发 CI 的开发分支发布；当前分支是 `master` 时停止，不得通过推送 `master` 触发 CI。

## 发布顺序

以下步骤不可跳过或调换：

1. 确认当前处于开发分支，检查工作区、完整 diff 和近期提交风格。
2. 执行 `npm run build`，必须构建成功且存在 `build/index.html`。
3. 只暂存本次相关源码、配置和文档；不要提交 `build/`、缓存、日志或凭证文件。
4. 创建提交并推送当前分支，确认本地分支与远程同步。
5. 查询 ACR 当前最高语义化版本并计算下一版本。
6. 使用下一版本执行 `make release`。
7. 验证远程镜像存在，并检查 `save_image` 返回 `"code":200`。

推送当前开发分支：

```bash
BRANCH="$(git branch --show-current)"
test "$BRANCH" != "master"
git push origin "$BRANCH"
git status --short --branch
```

## 自动计算版本号

镜像仓库：

```text
haiqi-registry.cn-beijing.cr.aliyuncs.com/haiqiruixue/rx-docs
```

1. 使用 `regctl tag ls` 查询远程标签。macOS 缺少命令时执行 `brew install regclient`。
2. 只保留匹配 `^v[0-9]+\.[0-9]+\.[0-9]+$` 的标签。
3. 按数字语义化版本排序，取最高版本作为当前版本。
4. 将 patch 位加 1，例如当前 `v1.0.8`，本次发布使用 `v1.0.9`。
5. 用户明确指定版本号时，以用户指定值为准，但必须高于远程当前版本。
6. 查询失败、无登录权限或没有合法版本时停止并说明原因，不猜测版本。

查询与计算示例：

```bash
REPOSITORY="haiqi-registry.cn-beijing.cr.aliyuncs.com/haiqiruixue/rx-docs"
CURRENT_TAG="$(
  regctl tag ls "$REPOSITORY" |
  python3 -c 'import re,sys; tags=[x.strip() for x in sys.stdin if re.fullmatch(r"v\d+\.\d+\.\d+", x.strip())]; print(max(tags, key=lambda x: tuple(map(int, x[1:].split(".")))))'
)"
NEXT_TAG="$(
  python3 -c 'import sys; a,b,c=map(int,sys.argv[1][1:].split(".")); print(f"v{a}.{b}.{c+1}")' "$CURRENT_TAG"
)"
```

## 本地生产构建

执行：

```bash
npm run build
```

成功标准：

- 命令退出码为 0。
- `build/index.html` 存在。
- 日志包含静态文件生成成功信息。

warning 可以汇报，但不能把 warning 当作构建失败。

## 镜像发布

### 1. 前置检查

```bash
docker --version
docker info --format '{{.ServerVersion}}'
docker buildx version
make print-image TAG=vX.Y.Z
```

若 Docker daemon 未运行，启动 Docker Desktop并等待 `docker info` 成功。

### 2. 构建但不推送

用户只要求本地镜像时：

```bash
make build-image TAG=vX.Y.Z
```

完成后验证：

```bash
docker image inspect haiqi-registry.cn-beijing.cr.aliyuncs.com/haiqiruixue/rx-docs:vX.Y.Z
```

### 3. 推送并登记

用户明确要求完整镜像发布时：

```bash
make release TAG="$NEXT_TAG" \
  NODE_IMAGE=docker.m.daocloud.io/library/node:22-alpine \
  NGINX_IMAGE=docker.m.daocloud.io/nginxinc/nginx-unprivileged:alpine
```

必须分别确认两个结果：

1. Docker push 没有出现 `denied`、`unauthorized` 或网络错误。
2. `save_image` 接口响应 JSON 中 `"code":200`。

注意：`curl` 即使收到业务错误也可能退出码为 0。必须检查响应体，不能仅凭 `make` 或 `curl` 退出码判断登记成功。

若推送返回权限错误：

```bash
docker login haiqi-registry.cn-beijing.cr.aliyuncs.com
```

登录完成后重新执行发布。不要单独运行 `make save-image` 来绕过失败的镜像推送。

### 4. 仅登记已存在镜像

仅当用户确认对应标签的镜像已在仓库中时执行：

```bash
make save-image TAG=vX.Y.Z
```

成功标准是响应体包含：

```json
{"code":200}
```

`版本号格式不对` 或其他业务错误均表示失败。

## K8s 生效说明

镜像发布成功不等于 K8s 已滚动更新。需要发布平台或具备 kubeconfig 的操作者将 Deployment 镜像切换到新标签。本 Skill 不触发 CI，也不在缺少集群权限时猜测线上已生效。

发布后至少验证：

```bash
docker buildx imagetools inspect \
  "haiqi-registry.cn-beijing.cr.aliyuncs.com/haiqiruixue/rx-docs:$NEXT_TAG"
```

## 完成汇报

简洁列出：

- 执行的流程与版本号。
- 构建、推送、登记、远程镜像验证各自状态。
- 最终镜像完整名称或线上 URL。
- 明确说明是否已执行 K8s Deployment 更新。
- 若失败，给出实际错误和下一步，不宣称部分成功等于发布成功。
