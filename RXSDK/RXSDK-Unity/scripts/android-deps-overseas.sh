#!/usr/bin/env bash
# 将 mainTemplate.gradle 切为「海外」依赖（rxsdk_overseas）
set -e
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
GRADLE="$ROOT/Assets/Plugins/Android/mainTemplate.gradle"
if [[ ! -f "$GRADLE" ]]; then
  echo "未找到 $GRADLE"
  exit 1
fi
sed -i.bak \
  -e "s|^    implementation 'com.ruixue:rxsdk_weile:|//    implementation 'com.ruixue:rxsdk_weile:|" \
  -e "s|^//    implementation 'com.ruixue:rxsdk_overseas:|    implementation 'com.ruixue:rxsdk_overseas:|" \
  "$GRADLE"
rm -f "$GRADLE.bak" 2>/dev/null || true
echo "已切换为海外依赖（overseas）。请用 Unity 重新导出/打包 Android。"
