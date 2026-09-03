# RXSDK Android

瑞雪 Android SDK，提供登录、支付、分享、公告、实名认证、推送等能力，支持国内渠道与海外平台。

## 工程结构

```
rxsdk-android/
├── rxsdk_base/          # SDK 核心（网络、账号、埋点、工具类）
├── rxsdk_base_ui/       # SDK UI 组件（登录、注册、用户中心等）
├── overseas/            # 海外模块（Google、Facebook、Line、TikTok 等）
├── channel/             # 渠道模块（华为、OPPO、vivo、小米、B站 等）
├── push/                # 推送模块（华为、小米、OPPO、vivo、魅族）
├── demo/                # Demo 应用（app_rxsdk_demo 为主入口）
├── local_repo/          # 三方 AAR 托管与发布
├── scripts/             # 工具脚本（发布、校验、升级检查等）
├── .gitlab-ci.yml       # CI 流水线配置
├── tasks.sh             # 批量发布脚本
└── CHANGELOG            # 变更日志
```

## 环境要求

| 依赖 | 版本 |
|------|------|
| JDK | 11 |
| Gradle | 7.6 |
| AGP | 7.4.x |
| Android SDK | API 34+ |
| minSdkVersion | 22 |

## 快速开始

```bash
# 编译 Demo
./gradlew :demo:app_rxsdk_demo:assembleDebug

# 跑单元测试
./gradlew :rxsdk_base:testDebugUnitTest

# 发布到阿里云
./tasks.sh publishReleasePublicationToAliRepository

# 发布到睿学
./tasks.sh publishReleasePublicationToRuixueRepository
```

## local_repo 三方 AAR 管理

```bash
# 一键添加 AAR
./scripts/add_local_repo_aar.sh ~/Downloads/foo-1.2.3.aar

# 校验所有模块
./scripts/validate_local_repo.sh

# 查看所有模块 GAV
./scripts/list_local_repo.sh

# 发布到阿里云
./scripts/publish_local_repo.sh ali

# 发布到 Nexus
./scripts/publish_local_repo.sh nexus

# 发布到阿里云 + Nexus
./scripts/publish_local_repo.sh both
```

详见 [local_repo/readme.txt](local_repo/readme.txt)

## Demo 测试按钮

- **动态按钮**（推荐）：只改 `demo/app_rxsdk_demo/.../config/DemoTestButtons.java`，加一行配置即可
- **固定入口按钮**：改 `card_test_entry.xml` + `DemoClickHandler.java` 加一行 `ActivityRoute`

## CI 流水线

| Job | 说明 | 触发方式 |
|-----|------|----------|
| test-unit | 单元测试 | 手动 |
| verify-after-upgrade | 依赖升级后编译验证 | 手动 |
| report-dependency-updates | 依赖可更新报告 | 手动 |
| publish-on-tag | 按 tag 全量发布 | 手动（tag: v*.*.*） |
| publish-all-modules | 全量发布所有模块 | 手动 |
| publish-to-aliyun | 发布到阿里云 | 手动 |
| publish-to-ruixue | 发布到睿学 | 手动 |
| publish-local-repo-to-aliyun | 三方 AAR → 阿里云 | 手动 |
| publish-local-repo-to-nexus | 三方 AAR → Nexus | 手动 |

## Maven 仓库

- 瑞雪 Maven：[查看](https://packages.aliyun.com/repos/2168735-release-Zcdy1x/packages)
- Maven Central：[查看](https://repo.maven.apache.org/maven2/)
- 阿里云效 Maven：[查看](https://developer.aliyun.com/mvn/guide)
- Search Maven：[查看](https://search.maven.org/)

### 项目 build.gradle 仓库配置

```groovy
allprojects {
    repositories {
        google()
        mavenCentral()
        jcenter { url 'https://maven.aliyun.com/nexus/content/repositories/jcenter' }
        maven { url 'https://developer.huawei.com/repo/' }
        maven { url 'https://artifact.bytedance.com/repository/ttgamesdk/' }
        // 瑞雪 Maven
        maven {
            credentials {
                username '600685104fb2132a19e09a29'
                password 'amU0hYqA3J-U'
            }
            url 'https://packages.aliyun.com/maven/repository/2168735-release-Zcdy1x/'
        }
    }
}
```
