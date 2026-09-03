#!/usr/bin/env bash
# 列出 local_repo 下所有模块及其 GAV（groupId:artifactId:version），便于引用与核对
# 用法: ./scripts/list_local_repo.sh

cd "$(dirname "$0")/.."

printf "%-28s %s\n" "MODULE" "GROUP_ID:ARTIFACT_ID:VERSION"
echo "--------------------------------------------------------------------------------"

for dir in local_repo/*/; do
    [ -d "$dir" ] || continue
    name=$(basename "$dir")
    if [ ! -f "local_repo/$name/build.gradle" ]; then
        continue
    fi
    prop="local_repo/$name/gradle.properties"
    if [ ! -f "$prop" ]; then
        printf "%-28s %s\n" "$name" "(no gradle.properties)"
        continue
    fi
    g=$(grep -E "^pomGroupId=" "$prop" 2>/dev/null | cut -d= -f2- | tr -d '\r')
    a=$(grep -E "^pomArtifactId=" "$prop" 2>/dev/null | cut -d= -f2- | tr -d '\r')
    v=$(grep -E "^pomVersion=" "$prop" 2>/dev/null | cut -d= -f2- | tr -d '\r')
    if [ -z "$g" ] || [ -z "$a" ] || [ -z "$v" ]; then
        printf "%-28s %s\n" "$name" "(${g:-?}:${a:-?}:${v:-?})"
    else
        printf "%-28s %s:%s:%s\n" "$name" "$g" "$a" "$v"
    fi
done
