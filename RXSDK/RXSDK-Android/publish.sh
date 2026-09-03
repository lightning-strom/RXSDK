#!/bin/bash
set -euo pipefail
echo "开始发布版本任务"

RAW_VERSION=$(./gradlew -q printVersion | tail -n 1)
TAG="v${RAW_VERSION}"
echo "本次要发布的版本: ${TAG}"
TAG_EXISTS=$(git ls-remote --tags origin "${TAG}" | wc -l)
if [[ ${TAG_EXISTS} -gt 0 ]]; then
    echo -e "⚠️警告：远程仓库已存在版本 [${TAG}]"
    read -p "是否确认覆盖该版本？(y/N) " CONFIRM
    # 只接受小写y/大写Y作为确认，其他均视为取消
    if [[ "${CONFIRM}" != "y" && "${CONFIRM}" != "Y" ]]; then
        echo "❌ 用户取消覆盖操作，发布流程终止"
        exit 0
    fi
    git push origin ":refs/tags/${TAG}" || {
        echo "❌ 删除远端版本失败"
        exit 1
    }
fi

echo -e "\n开始执行发布操作..."
git tag -d "${TAG}" >/dev/null 2>&1 || true
git tag -a "${TAG}" -m "Auto release: ${TAG}"  >/dev/null 2>&1
echo "发布任务正在提交..."
if ! git push origin "${TAG}" >/dev/null 2>&1; then
    echo " 推送 ${TAG}失败，请检查网络或仓库权限"
    exit 1
fi
echo -e "\n${TAG} 版本发布任务已提交，请10分钟后查看发布结果！"