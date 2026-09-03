#!/bin/bash

# ============================================================
# 瑞雪 SDK Cocos2d-x 集成脚本
# 用法: ./install_sdk.sh <游戏项目根目录> [模块选项]
# 示例: ./install_sdk.sh /path/to/your/cocos2dx-game --all
#       ./install_sdk.sh /path/to/your/cocos2dx-game --ui --pay
#
# 模块选项:
#   --all    安装所有模块（默认）
#   --core   仅核心模块（init/login/logout/getUserInfo）
#   --ui     UI 模块（登录UI/用户中心/找回密码 等）
#   --pay    支付模块
#   --share  分享模块
#   --baidu  百度渠道模块（仅 Android）
# ============================================================

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# SDK 源码目录 (脚本所在目录)
SDK_DIR="$(cd "$(dirname "$0")" && pwd)"

# 打印带颜色的消息
print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 检查参数
if [ -z "$1" ]; then
    echo ""
    echo "============================================"
    echo "  瑞雪 SDK Cocos2d-x 集成脚本"
    echo "============================================"
    echo ""
    echo "用法: $0 <游戏项目根目录> [模块选项]"
    echo ""
    echo "模块选项:"
    echo "  --all    安装所有模块（默认）"
    echo "  --core   仅核心模块（init/login/logout/getUserInfo）"
    echo "  --ui     UI 模块（登录UI/用户中心/找回密码 等）"
    echo "  --pay    支付模块"
    echo "  --share  分享模块"
    echo "  --baidu  百度渠道模块（仅 Android）"
    echo ""
    echo "示例:"
    echo "  $0 /path/to/your/cocos2dx-game              # 安装所有模块"
    echo "  $0 /path/to/your/cocos2dx-game --core --ui   # 仅核心+UI"
    echo "  $0 ../MyGame --all                            # 安装所有模块"
    echo ""
    exit 1
fi

# 目标项目目录
TARGET_DIR="$(cd "$1" 2>/dev/null && pwd)" || {
    print_error "目标目录不存在: $1"
    exit 1
}

# 解析模块选项
shift
INSTALL_CORE=false
INSTALL_UI=false
INSTALL_PAY=false
INSTALL_SHARE=false
INSTALL_BAIDU=false
HAS_MODULE_OPTION=false

while [ $# -gt 0 ]; do
    case "$1" in
        --all)
            INSTALL_CORE=true
            INSTALL_UI=true
            INSTALL_PAY=true
            INSTALL_SHARE=true
            INSTALL_BAIDU=true
            HAS_MODULE_OPTION=true
            ;;
        --core)
            INSTALL_CORE=true
            HAS_MODULE_OPTION=true
            ;;
        --ui)
            INSTALL_UI=true
            HAS_MODULE_OPTION=true
            ;;
        --pay)
            INSTALL_PAY=true
            HAS_MODULE_OPTION=true
            ;;
        --share)
            INSTALL_SHARE=true
            HAS_MODULE_OPTION=true
            ;;
        --baidu)
            INSTALL_BAIDU=true
            HAS_MODULE_OPTION=true
            ;;
        *)
            print_warning "未知选项: $1"
            ;;
    esac
    shift
done

# 默认安装所有模块
if [ "$HAS_MODULE_OPTION" = false ]; then
    INSTALL_CORE=true
    INSTALL_UI=true
    INSTALL_PAY=true
    INSTALL_SHARE=true
    INSTALL_BAIDU=true
fi

# 核心模块始终安装
INSTALL_CORE=true

echo ""
echo "============================================"
echo "  瑞雪 SDK Cocos2d-x 集成脚本"
echo "============================================"
echo ""
print_info "SDK 源码目录: $SDK_DIR"
print_info "目标项目目录: $TARGET_DIR"
echo ""
print_info "安装模块:"
echo "  Core（核心）: 是"
echo "  UI（界面）  : $([ "$INSTALL_UI" = true ] && echo '是' || echo '否')"
echo "  Pay（支付） : $([ "$INSTALL_PAY" = true ] && echo '是' || echo '否')"
echo "  Share（分享）: $([ "$INSTALL_SHARE" = true ] && echo '是' || echo '否')"
echo "  Baidu（百度）: $([ "$INSTALL_BAIDU" = true ] && echo '是' || echo '否')"
echo ""

# 验证目标是 Cocos2d-x 项目
if [ ! -d "$TARGET_DIR/Classes" ]; then
    print_error "目标目录不是有效的 Cocos2d-x 项目 (未找到 Classes 目录)"
    exit 1
fi

# ==================== 1. 复制 C++ 源码 ====================
print_info "正在复制 C++ 源码..."

TARGET_RUIXUE_DIR="$TARGET_DIR/Classes/RuixueSDK"
if [ -d "$TARGET_RUIXUE_DIR" ]; then
    print_warning "目标已存在 RuixueSDK 目录，将备份为 RuixueSDK.bak"
    rm -rf "$TARGET_RUIXUE_DIR.bak"
    mv "$TARGET_RUIXUE_DIR" "$TARGET_RUIXUE_DIR.bak"
fi

mkdir -p "$TARGET_RUIXUE_DIR"
mkdir -p "$TARGET_RUIXUE_DIR/android"
mkdir -p "$TARGET_RUIXUE_DIR/ios"

# 核心文件（始终复制）
cp "$SDK_DIR/Classes/RuixueSDK/RuixueBridge.h" "$TARGET_RUIXUE_DIR/"
cp "$SDK_DIR/Classes/RuixueSDK/RuixueBridge.cpp" "$TARGET_RUIXUE_DIR/"
cp "$SDK_DIR/Classes/RuixueSDK/android/RuixueBridge_android.cpp" "$TARGET_RUIXUE_DIR/android/"
cp "$SDK_DIR/Classes/RuixueSDK/ios/RuixueBridge_ios.mm" "$TARGET_RUIXUE_DIR/ios/"
cp "$SDK_DIR/Classes/RuixueSDK/ios/RuixueSDKWrapper.h" "$TARGET_RUIXUE_DIR/ios/"
cp "$SDK_DIR/Classes/RuixueSDK/ios/RuixueSDKWrapper.mm" "$TARGET_RUIXUE_DIR/ios/"
print_success "核心 C++/iOS 源码复制完成"

# UI 模块
if [ "$INSTALL_UI" = true ]; then
    cp "$SDK_DIR/Classes/RuixueSDK/ios/RuixueSDKWrapper+UI.h" "$TARGET_RUIXUE_DIR/ios/"
    cp "$SDK_DIR/Classes/RuixueSDK/ios/RuixueSDKWrapper+UI.mm" "$TARGET_RUIXUE_DIR/ios/"
    print_success "UI 模块 iOS 源码复制完成"
fi

# Pay 模块
if [ "$INSTALL_PAY" = true ]; then
    cp "$SDK_DIR/Classes/RuixueSDK/ios/RuixueSDKWrapper+Pay.h" "$TARGET_RUIXUE_DIR/ios/"
    cp "$SDK_DIR/Classes/RuixueSDK/ios/RuixueSDKWrapper+Pay.mm" "$TARGET_RUIXUE_DIR/ios/"
    print_success "Pay 模块 iOS 源码复制完成"
fi

# Share 模块
if [ "$INSTALL_SHARE" = true ]; then
    cp "$SDK_DIR/Classes/RuixueSDK/ios/RuixueSDKWrapper+Share.h" "$TARGET_RUIXUE_DIR/ios/"
    cp "$SDK_DIR/Classes/RuixueSDK/ios/RuixueSDKWrapper+Share.mm" "$TARGET_RUIXUE_DIR/ios/"
    print_success "Share 模块 iOS 源码复制完成"
fi

# ==================== 2. 复制 Android 文件 ====================
print_info "正在复制 Android 文件..."

# 检查 Android 项目目录
ANDROID_PROJ=""
if [ -d "$TARGET_DIR/proj.android" ]; then
    ANDROID_PROJ="$TARGET_DIR/proj.android"
elif [ -d "$TARGET_DIR/proj.android-studio" ]; then
    ANDROID_PROJ="$TARGET_DIR/proj.android-studio"
fi

if [ -n "$ANDROID_PROJ" ]; then
    # 复制核心 Java 文件
    TARGET_JAVA_DIR="$ANDROID_PROJ/app/src/com/ruixue/sdk"
    mkdir -p "$TARGET_JAVA_DIR"
    cp "$SDK_DIR/proj.android/app/src/com/ruixue/sdk/RuixueSDK.java" "$TARGET_JAVA_DIR/"
    print_success "核心 Java 文件复制完成"
    
    # UI 模块
    if [ "$INSTALL_UI" = true ]; then
        cp "$SDK_DIR/proj.android/app/src/com/ruixue/sdk/RuixueSDKUI.java" "$TARGET_JAVA_DIR/"
        print_success "UI 模块 Java 文件复制完成"
    fi
    
    # Pay 模块
    if [ "$INSTALL_PAY" = true ]; then
        cp "$SDK_DIR/proj.android/app/src/com/ruixue/sdk/RuixueSDKPay.java" "$TARGET_JAVA_DIR/"
        print_success "Pay 模块 Java 文件复制完成"
    fi
    
    # Share 模块
    if [ "$INSTALL_SHARE" = true ]; then
        cp "$SDK_DIR/proj.android/app/src/com/ruixue/sdk/RuixueSDKShare.java" "$TARGET_JAVA_DIR/"
        print_success "Share 模块 Java 文件复制完成"
    fi

    # 百度渠道模块
    if [ "$INSTALL_BAIDU" = true ]; then
        TARGET_XML_DIR="$ANDROID_PROJ/app/res/xml"
        mkdir -p "$TARGET_XML_DIR"
        cp "$SDK_DIR/proj.android/app/res/xml/provider_paths.xml" "$TARGET_XML_DIR/"
        print_success "百度渠道 provider_paths.xml 复制完成"
    fi
    
    # 复制 styles.xml
    TARGET_VALUES_DIR="$ANDROID_PROJ/app/res/values"
    TARGET_VALUES_V28_DIR="$ANDROID_PROJ/app/res/values-v28"
    mkdir -p "$TARGET_VALUES_DIR"
    mkdir -p "$TARGET_VALUES_V28_DIR"
    
    if [ -f "$SDK_DIR/proj.android/app/res/values/styles.xml" ]; then
        cp "$SDK_DIR/proj.android/app/res/values/styles.xml" "$TARGET_VALUES_DIR/"
        print_success "styles.xml 复制完成"
    fi
    
    if [ -f "$SDK_DIR/proj.android/app/res/values-v28/styles.xml" ]; then
        cp "$SDK_DIR/proj.android/app/res/values-v28/styles.xml" "$TARGET_VALUES_V28_DIR/"
        print_success "values-v28/styles.xml 复制完成"
    fi
else
    print_warning "未找到 Android 项目目录，跳过 Android 文件复制"
fi

# ==================== 3. 生成集成提示 ====================
echo ""
echo "============================================"
print_success "SDK 文件复制完成！"
echo "============================================"
echo ""
echo "接下来请完成以下配置:"
echo ""
echo -e "${YELLOW}【Android 配置】${NC}"
echo "1. 在 app/build.gradle 添加依赖:"
echo "   implementation 'com.ruixue:rxsdk_base:最新版本'  // 必选"
if [ "$INSTALL_UI" = true ]; then
    echo "   implementation 'com.ruixue:rxsdk_base_ui:最新版本'  // UI 模块"
fi
if [ "$INSTALL_PAY" = true ]; then
    echo "   implementation 'com.ruixue:rxsdk_xingyi:4.0.14'  // 星驿 App 支付"
    echo "   implementation 'com.ruixue:rxsdk_h5pay:4.0.14'   // 星驿 H5 支付"
fi
if [ "$INSTALL_BAIDU" = true ]; then
    echo "   implementation 'com.ruixue:rxsdk_baidu_wangxun:4.0.18'  // 百度渠道（仅 Android）"
    echo ""
    echo "   百度渠道还需将示例工程 proguard-rules.pro 中的"
    echo "   \"# Baidu channel\" 规则同步到目标 app/proguard-rules.pro。"
fi
echo ""
echo "2. 在 app/jni/Android.mk 添加源文件:"
echo "   LOCAL_SRC_FILES := \\"
echo "       ../../Classes/RuixueSDK/RuixueBridge.cpp \\"
echo "       ../../Classes/RuixueSDK/android/RuixueBridge_android.cpp \\"
echo "       ... 其他文件"
echo ""
echo "3. 在 AndroidManifest.xml 的 activity 中修改主题:"
echo "   android:theme=\"@style/AppTheme\""
echo ""
echo "4. 在 MainActivity 中初始化:"
echo "   import com.ruixue.sdk.RuixueSDK;"
echo "   RuixueSDK.setActivity(this);"
echo ""
echo -e "${YELLOW}【iOS 配置】${NC}"
echo "1. 在 Podfile 添加依赖:"
echo "   pod 'RXSDK_Pure'  # 必选"
if [ "$INSTALL_UI" = true ]; then
    echo "   pod 'RXUIKit'     # UI 模块"
fi
echo ""
echo "2. 执行 pod install"
echo ""
echo "3. 在 Xcode 中添加 RuixueSDK 源文件到项目"
echo ""
echo -e "${YELLOW}【模块说明】${NC}"
echo "• 未安装的模块在调用时会返回错误 JSON (code=-2)，不会崩溃"
echo "• Android: 未包含的 Java 文件对应的功能自动降级"
echo "• iOS: 使用 __has_include 自动检测 framework 是否可用"
echo ""
echo -e "${YELLOW}【C++ 调用示例】${NC}"
echo "   #include \"RuixueSDK/RuixueBridge.h\""
echo ""
echo "   // 初始化"
echo "   std::string config = R\"({\"cpid\":\"xxx\",\"productId\":\"xxx\"})\";"
echo "   ruixue::RuixueBridge::getInstance()->init(config, [](const std::string& response) {"
echo "       // 处理初始化结果"
echo "   });"
echo ""
echo "   // 显示登录 UI（需 UI 模块）"
echo "   ruixue::RuixueBridge::getInstance()->showLoginUI(\"{}\", [](const std::string& response) {"
echo "       // 处理登录结果"
echo "   });"
echo ""
echo "============================================"
echo ""
