#!/usr/bin/env bash
# 一键将 local_repo 下 AAR 模块发布到 Maven 仓库
# 用法:
#   ./scripts/publish_local_repo.sh              # 全部 → 阿里云
#   ./scripts/publish_local_repo.sh nexus        # 全部 → Nexus
#   ./scripts/publish_local_repo.sh both         # 全部 → 阿里云 + Nexus
#   ./scripts/publish_local_repo.sh qooapp gdt    # 指定模块 → 阿里云
#   ./scripts/publish_local_repo.sh nexus qooapp # 指定模块 → Nexus

set -e
cd "$(dirname "$0")/.."

TARGET_REPO="ali"
NAMES=()

for arg in "$@"; do
    if [ "$arg" = "nexus" ] || [ "$arg" = "ali" ] || [ "$arg" = "both" ]; then
        TARGET_REPO="$arg"
    else
        NAMES+=("$arg")
    fi
done

build_targets() {
    local task=$1
    local arr=()
    if [ ${#NAMES[@]} -gt 0 ]; then
        for name in "${NAMES[@]}"; do
            if [ -f "local_repo/$name/build.gradle" ]; then
                arr+=(":local_repo:$name:$task")
            else
                echo "Skip (no build.gradle): local_repo/$name"
            fi
        done
    else
        for dir in local_repo/*/; do
            [ -d "$dir" ] || continue
            name=$(basename "$dir")
            if [ -f "local_repo/$name/build.gradle" ]; then
                arr+=(":local_repo:$name:$task")
            fi
        done
    fi
    echo "${arr[@]}"
}

if [ "$TARGET_REPO" = "both" ]; then
    TARGETS_ALI=($(build_targets "publishReleasePublicationToAliRepository"))
    TARGETS_NEXUS=($(build_targets "publishReleasePublicationToNexusRepository"))
    if [ ${#TARGETS_ALI[@]} -eq 0 ]; then
        echo "No local_repo modules to publish."
        exit 0
    fi
    echo "Publishing ${#TARGETS_ALI[@]} local_repo module(s) to 阿里云..."
    ./gradlew --no-daemon "${TARGETS_ALI[@]}"
    echo "Publishing ${#TARGETS_NEXUS[@]} local_repo module(s) to Nexus..."
    ./gradlew --no-daemon "${TARGETS_NEXUS[@]}"
    echo "Done (both)."
    exit 0
fi

if [ "$TARGET_REPO" = "nexus" ]; then
    TASK="publishReleasePublicationToNexusRepository"
else
    TASK="publishReleasePublicationToAliRepository"
fi

TARGETS=($(build_targets "$TASK"))
if [ ${#TARGETS[@]} -eq 0 ]; then
    echo "No local_repo modules to publish."
    exit 0
fi

echo "Publishing ${#TARGETS[@]} local_repo module(s) to $TARGET_REPO..."
./gradlew --no-daemon "${TARGETS[@]}"
echo "Done."
