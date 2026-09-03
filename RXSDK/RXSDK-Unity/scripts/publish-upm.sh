#!/usr/bin/env bash
# 将 Packages 下的 com.ruixue.* 包发布到 UPM 私有源（npm 兼容的 registry）
#
# 环境变量:
#   REGISTRY_URL   registry 地址，默认 http://60.205.123.114:4873
# 若需登录，可在项目根目录配置 .npmrc，例如:
#   registry=http://60.205.123.114:4873
#   //60.205.123.114:4873/:_authToken="YOUR_TOKEN"
# 手动登录备注（明文凭证不建议提交到公开仓库）:
#   username: admin
#   password: xinze123
#
# 用法: ./scripts/publish-upm.sh [--version x.y.z] [--dry-run] [--tag <tag>] [<包名>]
# 示例: ./scripts/publish-upm.sh --version 1.6.18
#       ./scripts/publish-upm.sh --version 1.6.18 --dry-run
#       ./scripts/publish-upm.sh com.ruixue.unitysdk.base

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
PACKAGES_DIR="$REPO_ROOT/Packages"

# 与 Packages/manifest.json 中 scopedRegistries 保持一致
REGISTRY_URL="${REGISTRY_URL:-http://60.205.123.114:4873}"

VERSION=""
DRY_RUN=""
NPM_TAG=""
SINGLE_PACKAGE=""

while [[ $# -gt 0 ]]; do
  case $1 in
    --version|-v)
      VERSION="$2"
      shift 2
      ;;
    --dry-run)
      DRY_RUN="--dry-run"
      shift
      ;;
    --tag)
      NPM_TAG="$2"
      shift 2
      ;;
    -*)
      echo "未知参数: $1"
      echo "用法: $0 [--version x.y.z] [--dry-run] [--tag <tag>] [<包名>]"
      exit 1
      ;;
    *)
      SINGLE_PACKAGE="$1"
      shift
      ;;
  esac
done

# 批量替换所有 com.ruixue 包的 version 及对 com.ruixue 依赖的版本号
bump_all_versions() {
  local new_ver="$1"
  [[ -z "$new_ver" ]] && return 1
  for pkg_dir in "$PACKAGES_DIR"/com.ruixue.*; do
    [[ -d "$pkg_dir" ]] || continue
    local pkg_json="$pkg_dir/package.json"
    [[ -f "$pkg_json" ]] || continue
    node "$SCRIPT_DIR/bump-package-version.js" "$pkg_json" "$new_ver" || exit 1
    echo "  已设版本: $(basename "$pkg_dir") -> $new_ver"
  done
}

# 发布单个包（正式发布或 dry-run：仅本地 npm pack，不请求 registry）
publish_package() {
  local pkg_dir="$1"
  local pkg_name
  pkg_name=$(node -e "console.log(require('$pkg_dir/package.json').name)")
  echo ">>> 发布 $pkg_name ..."
  if [[ -n "$DRY_RUN" ]]; then
    (cd "$pkg_dir" && npm pack 2>&1 && rm -f com.ruixue.*.tgz) || return 1
  else
    (cd "$pkg_dir" && npm publish --registry "$REGISTRY_URL" ${NPM_TAG:+--tag "$NPM_TAG"})
  fi
}

# 按依赖顺序：先发布无 com.ruixue 依赖的包（如 base），再发布其余
sort_packages_by_deps() {
  local base_first=()
  local rest=()
  for pkg_dir in "$PACKAGES_DIR"/com.ruixue.*; do
    [[ -d "$pkg_dir" ]] || continue
    [[ -f "$pkg_dir/package.json" ]] || continue
    local name
    name=$(node -e "console.log(require('$pkg_dir/package.json').name)" 2>/dev/null) || continue
    if [[ "$name" == "com.ruixue.unitysdk.base" ]]; then
      base_first+=("$pkg_dir")
    else
      rest+=("$pkg_dir")
    fi
  done
  printf '%s\n' "${base_first[@]}" "${rest[@]}"
}

echo "Registry: $REGISTRY_URL"
[[ -n "$DRY_RUN" ]] && echo "（仅试运行：本地 npm pack，不请求 registry）"
echo ""

if [[ -n "$SINGLE_PACKAGE" ]]; then
  pkg_path="$PACKAGES_DIR/$SINGLE_PACKAGE"
  if [[ ! -d "$pkg_path" ]] || [[ ! -f "$pkg_path/package.json" ]]; then
    echo "错误: 未找到包 $SINGLE_PACKAGE"
    exit 1
  fi
  if [[ -n "$VERSION" ]]; then
    node "$SCRIPT_DIR/bump-package-version.js" "$pkg_path/package.json" "$VERSION" || exit 1
    echo "已设版本: $SINGLE_PACKAGE -> $VERSION"
    echo ""
  fi
  publish_package "$pkg_path"
  exit 0
fi

# 发布全部：必须指定 --version，先批量替换版本号
if [[ -z "$VERSION" ]]; then
  echo "错误: 发布全部时必须指定 --version x.y.z"
  echo "示例: $0 --version 1.6.18"
  exit 1
fi
echo ">>> 批量替换版本号为: $VERSION"
bump_all_versions "$VERSION"
echo ""

# 发布所有 com.ruixue 包（base 优先）
while IFS= read -r pkg_dir; do
  [[ -z "$pkg_dir" ]] && continue
  publish_package "$pkg_dir" || exit 1
done < <(sort_packages_by_deps)

echo ""
echo "全部发布完成。"
