#!/usr/bin/env bash
# 一键在 local_repo 下新增一个 AAR 模块（自动创建目录、build.gradle、gradle.properties 并复制 AAR）
# 用法:
#   ./scripts/add_local_repo_aar.sh <path_to.aar> [artifactId] [groupId] [version]
# 示例:
#   ./scripts/add_local_repo_aar.sh ~/Downloads/foo-sdk-1.2.3.aar foo-sdk
#   ./scripts/add_local_repo_aar.sh ./my.aar mylib com.my.company 2.0.0
# 若只传 AAR 路径，artifactId 取文件名（去掉 .aar），groupId 默认 com.ruixue.thirdparty，version 默认 1.0.0

set -e
cd "$(dirname "$0")/.."

AAR_PATH="${1:?Usage: $0 <path_to.aar> [artifactId] [groupId] [version]}"
ARTIFACT_ID="${2:-}"
GROUP_ID="${3:-com.ruixue.thirdparty}"
VERSION="${4:-1.0.0}"

if [ ! -f "$AAR_PATH" ]; then
  echo "Error: AAR file not found: $AAR_PATH"
  exit 1
fi

AAR_BASENAME=$(basename "$AAR_PATH" .aar)
# 若未指定 artifactId，用文件名（去掉 .aar）；若文件名带版本号如 xxx-1.2.3，只取 xxx
if [ -z "$ARTIFACT_ID" ]; then
  ARTIFACT_ID="${AAR_BASENAME}"
  # 尝试从文件名解析版本： *-1.2.3 或 *-v1.2.3
  if [[ "$AAR_BASENAME" =~ -([0-9]+\.[0-9]+\.[0-9]+.*)$ ]]; then
    VERSION="${BASH_REMATCH[1]}"
    ARTIFACT_ID="${AAR_BASENAME%-${BASH_REMATCH[1]}}"
  fi
  if [[ "$ARTIFACT_ID" =~ ^(.+)-v[0-9] ]]; then
    ARTIFACT_ID="${BASH_REMATCH[1]}"
  fi
fi

# 模块目录名：只保留小写、数字、连字符（避免 Gradle 路径问题）
MODULE_NAME=$(echo "$ARTIFACT_ID" | sed 's/[^a-zA-Z0-9_-]/-/g' | tr '[:upper:]' '[:lower:]')
if [ -z "$MODULE_NAME" ]; then
  MODULE_NAME="$ARTIFACT_ID"
fi

DIR="local_repo/$MODULE_NAME"
if [ -d "$DIR" ] && [ -f "$DIR/build.gradle" ]; then
  echo "Error: Module already exists: $DIR (use a different artifactId or remove it first)"
  exit 1
fi

mkdir -p "$DIR"

# 只保留目录里的一个 aar：复制并重命名为简单名（避免带版本号的长文件名）
AAR_DEST="$DIR/$MODULE_NAME.aar"
cp "$AAR_PATH" "$AAR_DEST"
echo "Copied AAR to $AAR_DEST"

cat > "$DIR/build.gradle" << 'BUILD'
apply from: '../publish.gradle'
BUILD

cat > "$DIR/gradle.properties" << PROPS
pomGroupId=${GROUP_ID}
pomArtifactId=${ARTIFACT_ID}
pomVersion=${VERSION}
PROPS

echo "Created $DIR/build.gradle and gradle.properties"
echo ""
echo "  GroupId:    $GROUP_ID"
echo "  ArtifactId: $ARTIFACT_ID"
echo "  Version:    $VERSION"
echo ""
echo "Next: run ./scripts/validate_local_repo.sh then publish with:"
echo "  ./scripts/publish_local_repo.sh $MODULE_NAME"
echo "  or  ./scripts/publish_local_repo.sh both"
