#!/usr/bin/env bash
# 校验 local_repo 下各模块：每个模块有且仅有一个 AAR，且 gradle.properties 含 pomGroupId/pomArtifactId/pomVersion
# 用法: ./scripts/validate_local_repo.sh
# 退出码: 0 全部通过，1 有校验失败

set -e
cd "$(dirname "$0")/.."
FAIL=0

for dir in local_repo/*/; do
    [ -d "$dir" ] || continue
    name=$(basename "$dir")
    if [ ! -f "local_repo/$name/build.gradle" ]; then
        continue
    fi

    # 1. 恰好一个 AAR
    aar_count=0
    for f in local_repo/"$name"/*.aar; do
        [ -f "$f" ] && aar_count=$((aar_count + 1))
    done
    if [ "$aar_count" -eq 0 ]; then
        echo "FAIL $name: 缺少 AAR 文件"
        FAIL=1
    elif [ "$aar_count" -gt 1 ]; then
        echo "FAIL $name: 只能有一个 AAR，当前有 $aar_count 个"
        FAIL=1
    fi

    # 2. gradle.properties 必选键
    prop="local_repo/$name/gradle.properties"
    if [ ! -f "$prop" ]; then
        echo "FAIL $name: 缺少 gradle.properties"
        FAIL=1
        continue
    fi
    missing=""
    for key in pomGroupId pomArtifactId pomVersion; do
        val=$(grep -E "^${key}=" "$prop" 2>/dev/null | cut -d= -f2- | tr -d '\r')
        if [ -z "$val" ]; then
            missing="$missing $key"
        fi
    done
    if [ -n "$missing" ]; then
        echo "FAIL $name: gradle.properties 缺少或为空:$missing"
        FAIL=1
    fi
done

if [ $FAIL -eq 1 ]; then
    echo "校验未通过，请修正后重试。"
    exit 1
fi
echo "local_repo 校验通过。"
