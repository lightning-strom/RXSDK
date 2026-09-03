#!/bin/bash
cd "$(dirname $0)" || exit

# 飞书 Webhook URL
WEBHOOK_URL="https://open.feishu.cn/open-apis/bot/v2/hook/73ae9013-ed01-437c-8a80-d0b7a8bd788e"

# 获取 Git 信息
BRANCH=$(git rev-parse --abbrev-ref HEAD)
COMMIT_HASH=$(git rev-parse --short HEAD)
COMMIT_AUTHOR=$(git log -1 --pretty=format:'%an')
COMMIT_MESSAGE=$(git log -1 --pretty=format:'%s')

# 读取 version.properties 文件
VERSION_PROPERTIES_FILE="./version.properties"

if [ -f "$VERSION_PROPERTIES_FILE" ]; then
  VERSION_NAME=$(grep -E "^versionName" "$VERSION_PROPERTIES_FILE" | awk -F= '{print $2}' | sed "s/['\"]//g" | xargs)
  VERSION_CODE=$(grep -E "^versionCode" "$VERSION_PROPERTIES_FILE" | awk -F= '{print $2}' | xargs)
else
  echo "⚠️ version.properties 文件未找到，使用默认值"
  VERSION_NAME="未知"
  VERSION_CODE="未知"
fi

# 构造消息
MESSAGE="✅ 打包完成！\n\
构建时间: $(TZ='Asia/Shanghai' date '+%Y-%m-%d %H:%M:%S')\n\
提交 hash: $COMMIT_HASH\n\
提交作者: $COMMIT_AUTHOR\n\
提交信息: $COMMIT_MESSAGE\n\
版本号: v$VERSION_NAME"

# 发送通知到飞书
curl -X POST -H "Content-Type: application/json" -d '{
  "msg_type": "text",
  "content": {
    "text": "'"$MESSAGE"'"
  }
}' "$WEBHOOK_URL"

exit 0