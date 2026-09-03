#!/bin/bash
# 简单的图标生成脚本（使用 macOS sips 工具）
# 注意：此脚本需要先有一个基础图标文件

echo "应用图标生成工具"
echo "=================="
echo ""
echo "由于需要 Pillow 库，请选择以下方式之一："
echo ""
echo "方式一：安装 Pillow 后运行 Python 脚本"
echo "  pip3 install --user Pillow"
echo "  python3 generate_icon.py"
echo ""
echo "方式二：使用在线工具"
echo "  1. 访问 https://romannurik.github.io/AndroidAssetStudio/icons-launcher.html"
echo "  2. 上传图标或使用文字生成"
echo "  3. 下载并解压到 app/src/main/res/ 目录"
echo ""
echo "方式三：手动创建"
echo "  创建 512x512 图标，然后使用工具缩放为不同尺寸"
echo ""
echo "详细说明请查看 ICON_GENERATION.md"
