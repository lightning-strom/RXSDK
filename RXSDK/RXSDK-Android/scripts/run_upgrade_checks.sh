#!/usr/bin/env bash
# 依赖升级前后本地校验：单元测试 + 关键模块编译，与 CI 的 upgradeVerify 对齐
# 用法: ./scripts/run_upgrade_checks.sh
# 可选: ./scripts/run_upgrade_checks.sh --no-assemble  仅跑单元测试

set -e
cd "$(dirname "$0")/.."

DO_ASSEMBLE=true
for arg in "$@"; do
    [ "$arg" = "--no-assemble" ] && DO_ASSEMBLE=false
done

echo "=== 1/2 单元测试 ==="
./gradlew test --no-daemon -x lint

if [ "$DO_ASSEMBLE" = true ]; then
    echo "=== 2/2 关键模块编译 (rxsdk_base + app_rxsdk_demo) ==="
    ./gradlew :rxsdk_base:assembleRelease :demo:app_rxsdk_demo:assembleRelease --no-daemon
else
    echo "=== 2/2 跳过 assemble (--no-assemble) ==="
fi

echo "=== 升级校验通过 ==="
