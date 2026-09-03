# RXSDK AI 工程化技术方案

> 本文档描述 RXSDK 项目在 AI 辅助开发方面的整体技术方案，分为**外部接入（MCP）**和**内部维护（Skills）**两大方向。

**最后更新**：2026-03-06  
**版本**：v1.0

---

## 目录

- [一、方案概览](#一方案概览)
- [二、外部接入：MCP 服务](#二外部接入mcp-服务)
  - [2.1 设计目标](#21-设计目标)
  - [2.2 系统架构](#22-系统架构)
  - [2.3 MCP Server 实现](#23-mcp-server-实现)
  - [2.4 工具体系](#24-工具体系)
  - [2.5 Agentic MCP 自动化接入](#25-agentic-mcp-自动化接入)
  - [2.6 模板引擎](#26-模板引擎)
  - [2.7 接入流程](#27-接入流程)
  - [2.8 分发与配置](#28-分发与配置)
- [三、内部维护：Skills 体系](#三内部维护skills-体系)
  - [3.1 设计目标](#31-设计目标)
  - [3.2 Skills 架构](#32-skills-架构)
  - [3.3 code-gen-spec：代码生成规范](#33-code-gen-spec代码生成规范)
  - [3.4 Rules 规则体系](#34-rules-规则体系)
  - [3.5 Skills 与 MCP 的协作关系](#35-skills-与-mcp-的协作关系)
  - [3.6 团队协作流程](#36-团队协作流程)
- [四、平台覆盖矩阵](#四平台覆盖矩阵)
- [五、技术路线图](#五技术路线图)

---

## 一、方案概览

RXSDK 是一套覆盖 iOS、Android、Unity、Cocos2dx、JS 小游戏、Harmony、Steam 等多平台的游戏 SDK。面对多端接入复杂度高、功能模块多、接入文档厚重等痛点，我们围绕 Cursor IDE 构建了 **AI 工程化体系**，从两个方向解决问题：

```
┌──────────────────────────────────────────────────────────────────┐
│                      RXSDK AI 工程化体系                         │
├─────────────────────────────┬────────────────────────────────────┤
│       外部接入（MCP）        │         内部维护（Skills）          │
│                             │                                    │
│  面向：游戏项目接入方         │  面向：SDK 开发维护团队             │
│  目标：简化接入流程           │  目标：规范多端开发流程             │
│  方式：自然语言驱动代码生成   │  方式：规范约束 + 自动化工作流      │
│                             │                                    │
│  ruixue-sdk-mcp             │  code-gen-spec                     │
│  ├── iOS 工具（21 个）       │  ├── 功能开发规范                   │
│  ├── Android 工具（18 个）   │  ├── MCP 生成规范                   │
│  └── Agentic 自动化接入      │  ├── iOS 工程配置规范               │
│                             │  └── Cursor Rules 规则体系          │
└─────────────────────────────┴────────────────────────────────────┘
```

**核心价值**：

| 维度 | 传统方式 | AI 工程化 |
|------|---------|----------|
| 接入成本 | 阅读文档 → 手写代码 → 调试 | 自然语言描述 → AI 生成代码 → 验证 |
| 开发规范 | 人工 Review + 口头约定 | Skills 强制约束 + 自动检查 |
| 多端一致性 | 各端独立开发，容易遗漏 | 按序开发（iOS→Android→Unity→Cocos2dx），禁止跳过 |
| 知识传递 | 依赖人员经验 | 编码到 MCP 模板和 Skills 规范中 |

---

## 二、外部接入：MCP 服务

### 2.1 设计目标

将 SDK 接入知识（依赖配置、初始化代码、功能调用、参数规范）编码到 MCP Server 中，使接入方通过 Cursor AI 用自然语言即可完成 SDK 接入，无需深入阅读文档。

**解决的核心痛点**：

1. SDK 模块多（登录、支付、分享、社交等 20+ 功能），接入方不知从何入手
2. 多渠道差异（华为、小米、OPPO 等），配置细节容易出错
3. 国内/海外版本差异，参数和依赖不同
4. 接入文档厚重，查找效率低

### 2.2 系统架构

```
┌─────────────────────────────────────────────────────────────────┐
│                        Cursor IDE                               │
│  ┌──────────────────────┐    ┌──────────────────────────────┐   │
│  │    用户对话           │    │    AI Agent                   │   │
│  │  "帮我接入瑞雪SDK"    │───→│  理解意图 → 调用 MCP 工具     │   │
│  └──────────────────────┘    │  → 执行操作步骤               │   │
│                              └───────────┬──────────────────┘   │
│                                          │ MCP 协议              │
│  ┌───────────────────────────────────────┴──────────────────┐   │
│  │              ruixue-sdk-mcp (Go)                          │   │
│  │                                                           │   │
│  │  ┌──────────┐  ┌───────────┐  ┌──────────────────────┐   │   │
│  │  │ ios 工具  │  │android工具│  │   模板引擎            │   │   │
│  │  │ 21个功能  │  │ 18个功能  │  │ templates/ios/*.tpl   │   │   │
│  │  │          │  │           │  │ templates/android/*.tpl│   │   │
│  │  └──────────┘  └───────────┘  └──────────────────────┘   │   │
│  └───────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

### 2.3 MCP Server 实现

**技术栈**：Go 语言实现，通过 npx 分发，跨平台编译。

**项目结构**：

```
RXSDK-MCP/
├── rxsdk-mcp-server/               # Go 源码
│   ├── main.go                     # 入口，MCP 协议处理
│   ├── ios.go                      # iOS 工具注册和分发
│   ├── android.go                  # Android 工具注册和分发
│   ├── templates/
│   │   ├── ios/                    # iOS 模板（21 个 .tpl 文件）
│   │   └── android/                # Android 模板（18 个 .tpl 文件）
│   └── gen_mcp_server.sh           # 跨平台编译脚本
│
└── ruixue-sdk-mcp/                 # npm 发布包
    ├── package.json                # npx 入口定义
    ├── bin/index.js                # 平台检测，启动对应 Go 二进制
    └── go-bin/                     # 编译产物
        ├── ruixue-sdk-mcp-darwin   # macOS ARM64
        ├── ruixue-sdk-mcp-linux    # Linux AMD64
        └── ruixue-sdk-mcp.exe      # Windows AMD64
```

**编译流程**：

```bash
cd RXSDK-MCP/rxsdk-mcp-server && bash gen_mcp_server.sh
```

脚本执行：Go 交叉编译 → 输出三平台二进制 → 移动到 npm 包的 `go-bin/` 目录。

### 2.4 工具体系

MCP Server 对外暴露两个工具：`ios` 和 `android`，通过 `feature` 参数分发到不同功能模块。

#### iOS 工具（21 个 feature）

| 分类 | feature | 说明 |
|------|---------|------|
| **基础接入** | `init` | SDK 初始化代码 |
| | `setup` | **自动化接入**（Agentic MCP） |
| | `project_config` | Xcode 工程配置 |
| | `dependency` | CocoaPods 依赖 |
| **用户通行证** | `passport` | 登录/注册/用户信息 |
| | `captcha` | 验证码发送/验证 |
| | `real_auth` | 实名认证 |
| | `account_binding` | 账号绑定（手机/邮箱） |
| | `password` | 密码管理 |
| | `deregister` | 账号注销 |
| **游戏功能** | `game_area` | 游戏区服 |
| | `game_character` | 游戏角色 |
| | `iap` | 内购支付/补单 |
| **社交** | `share` | 分享功能 |
| | `feedback` | 反馈 |
| | `lbs` | 位置服务 |
| | `friends` | 好友 |
| | `rank` | 排行榜 |
| | `social` | 社交综合 |
| **其他** | `tracking` | 数据埋点 |
| | `legal_ui` | 合规 UI |
| | `promo` | 达人福利 |
| | `announcement` | 公告/邮件 |
| | `device` | 设备信息 |
| | `store_review` | App Store 评分 |
| | `user_center` | 用户中心 |
| **组件** | `dns` | DNS 配置 |
| | `openinstall` | Openinstall 集成 |
| | `wechat_config` | 微信配置 |
| | `gpm` | GPM |
| | `bytedance_ad` | 字节广告 |
| | `tencent_ad` | 腾讯广告 |
| | `adjust` | Adjust 归因 |
| | `firebase` | Firebase |
| | `asa` | Apple Search Ads |
| | `game_center` | Game Center |
| | `google` | Google 登录 |
| | `facebook` | Facebook 登录 |
| | `line` | LINE 登录 |
| | `zalo` | Zalo 登录 |
| | `tiktok` | TikTok 登录 |
| | `instagram` | Instagram 登录 |
| | `reddit` | Reddit 登录 |

#### Android 工具（18 个 feature）

| 分类 | feature | 说明 |
|------|---------|------|
| **基础接入** | `init` | SDK 初始化代码 |
| | `agent` | 完整接入流程指南 |
| | `dependency` | Gradle 依赖配置 |
| | `setup` | **自动化接入**（Agentic MCP） |
| **用户登录** | `login` | UI 登录（SDK 内置界面） |
| | `login_api` | API 登录（自定义界面） |
| | `payment` | 支付（微信/支付宝） |
| **用户通行证** | `passport` | 通行证 |
| | `captcha` | 验证码 |
| | `real_auth` | 实名认证 |
| | `account_binding` | 账号绑定 |
| | `password` | 密码管理 |
| | `deregister` | 账号注销 |
| **社交** | `social` | 社交 |
| | `friends` | 好友 |
| | `lbs` | 位置服务 |
| | `rank` | 排行榜 |
| **游戏功能** | `game_area` | 游戏区服 |
| | `game_character` | 游戏角色 |
| **其他** | `share` | 分享 |
| | `feedback` | 反馈 |
| | `tracking` | 数据埋点 |
| | `update` | 热更新 |
| | `legal` | 合规 |
| | `legal_ui` | 合规 UI |
| | `promo` | 达人福利 |
| | `announcement` | 公告 |
| | `device` | 设备信息 |
| | `user_center` | 用户中心 |

#### 常用参数

| 参数 | 类型 | 说明 | 适用场景 |
|------|------|------|---------|
| `feature` | string（必填） | 功能模块标识 | 所有调用 |
| `workspacePath` | string | 项目根目录绝对路径 | setup, 组件配置 |
| `region` | string | `domestic`（国内）/ `overseas`（海外） | setup, project_config |
| `channel` | string | SDK 渠道（如 `rxsdk_weile`） | dependency, setup (Android) |
| `version` | string | SDK 版本号 | dependency (Android) |
| `gradleType` | string | Gradle DSL 类型 | setup (Android) |

### 2.5 Agentic MCP 自动化接入

区别于传统 MCP 仅返回代码片段，Agentic MCP 返回**结构化的操作步骤列表**，由 Cursor AI Agent 按步骤执行实际操作。

**工作流程**：

```
用户: "帮我接入瑞雪 iOS SDK"
  │
  ▼
Cursor AI: 识别意图 → 调用 ios 工具 (feature: setup)
  │
  ▼
MCP Server: 返回步骤列表
  [
    { type: "check_file",  target: "Podfile" },
    { type: "run_command", target: "pod init" },
    { type: "edit_file",   target: "Podfile", content: "pod 'RXSDK'" },
    { type: "run_command", target: "pod install" },
    { type: "user_input",  content: "请使用 .xcworkspace 打开项目" }
  ]
  │
  ▼
Cursor AI: 逐步执行，每步需用户确认
  │
  ▼
完成接入
```

**步骤结构定义**：

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | string | 步骤唯一标识 |
| `type` | enum | `check_file` / `create_file` / `edit_file` / `run_command` / `user_input` |
| `description` | string | 步骤描述 |
| `target` | string | 目标文件路径或命令 |
| `content` | string | 文件内容或提示信息 |
| `onSuccess` | string | 成功后跳转的步骤 ID |
| `onFailure` | string | 失败后跳转的步骤 ID |

**安全机制**：
- MCP Server 本身不执行任何系统命令，只返回操作描述
- 所有文件修改和命令执行由 Cursor IDE 完成，需用户确认
- 支持分支跳转（成功/失败路径不同）

#### iOS 自动化接入示例

```
用户: 帮我接入瑞雪 iOS SDK
```

AI 自动执行：
1. 检测项目是否有 Podfile → 无则执行 `pod init`
2. 添加瑞雪 SDK 依赖到 Podfile
3. 执行 `pod install`
4. 提醒使用 `.xcworkspace` 打开项目

#### Android 自动化接入示例

```
用户: 帮我接入瑞雪 Android SDK，渠道是华为
```

AI 自动执行：
1. 检测 Gradle DSL 类型（Groovy / Kotlin）
2. 在 settings.gradle 或 build.gradle 添加 Maven 仓库
3. 在 app/build.gradle 添加 SDK 依赖
4. 配置 Jetifier
5. 提示同步 Gradle

### 2.6 模板引擎

每个功能模块对应一个 `.tpl` 模板文件，包含功能说明、API 签名、代码示例和参数规范。

**模板结构**（以 `templates/ios/passport.tpl` 为例）：

```
功能模块说明
├── 概述：功能简介
├── 前置条件：依赖、初始化要求
├── API 列表：方法签名 + 参数说明
├── 代码示例：Objective-C 调用代码
├── 回调处理：成功/失败回调格式
└── 注意事项：常见问题和最佳实践
```

MCP Server 收到请求后：
1. 根据 `feature` 参数定位模板文件
2. 渲染模板（替换参数变量如 region、channel）
3. 返回结构化内容供 AI 生成代码

### 2.7 接入流程

接入方只需两步即可使用：

**第一步：配置 MCP**

编辑 `~/.cursor/mcp.json`：

```json
{
  "mcpServers": {
    "ruixue-sdk-mcp": {
      "command": "npx",
      "args": ["-y", "ruixue-sdk-mcp", "--stdio"]
    }
  }
}
```

**第二步：自然语言对话**

```
帮我接入瑞雪 SDK              → 完整接入流程（推荐）
添加登录代码                   → UI 登录
添加 API 登录代码              → 自定义界面登录
添加微信支付                   → 微信支付
我要上架华为应用商店            → 指定渠道配置
接入 Facebook 登录             → 海外三方登录
```

### 2.8 分发与配置

**npm 分发**：通过 `npx ruixue-sdk-mcp` 一键安装运行，自动检测平台选择对应二进制。

**编译发布流程**：

```bash
# 1. 修改模板或 Go 代码
vim rxsdk-mcp-server/templates/ios/xxx.tpl

# 2. 交叉编译三平台
cd rxsdk-mcp-server && bash gen_mcp_server.sh

# 3. 发布 npm 包
cd ../ruixue-sdk-mcp && npm publish
```

---

## 三、内部维护：Skills 体系

### 3.1 设计目标

通过 Cursor Skills + Rules 机制，将 SDK 多端开发的流程规范、命名约定、架构约束编码为可执行的 AI 指令，确保团队在 AI 辅助开发时自动遵循统一标准。

**解决的核心痛点**：

1. 多端开发顺序不统一，容易跳过平台导致功能缺失
2. 新成员不熟悉项目规范，产出代码质量参差不齐
3. MCP 模板创建缺乏标准流程，格式不一致
4. iOS 工程配置复杂（pbxproj、Universal Link 等），容易出错

### 3.2 Skills 架构

**项目结构**：

```
RXSDK-Skills/
├── .cursor/
│   └── skills/
│       └── code-gen-spec/              # 代码生成规范 Skill
│           ├── SKILL.md                # Skill 入口（触发条件 + 执行约束）
│           ├── feature-dev-spec.md     # 功能开发规范（多端实现细节）
│           ├── mcp-gen-spec.md         # MCP 生成规范（模板 + Go 代码）
│           └── ios-project-config-spec.md  # iOS 工程配置规范
├── setup-skills.sh                     # 安装脚本
└── README.md
```

**加载机制**：通过符号链接将 `RXSDK-Skills/.cursor/skills` 映射到项目根目录的 `.cursor/skills`，Cursor IDE 自动识别并加载。

```bash
# 首次设置
cd RXSDK-Skills && ./setup-skills.sh

# 或手动创建符号链接
ln -sf ../RXSDK-Skills/.cursor/skills .cursor/skills
```

### 3.3 code-gen-spec：代码生成规范

这是当前的核心 Skill，覆盖 SDK 功能开发的全生命周期。

#### 触发场景

- 开发新功能 / 模块 / SDK 接口
- 生成 iOS / Android / Unity / Cocos2dx 代码
- 跨平台封装、原生桥接
- 创建 MCP 接口 / 模板

#### 强制约束（最高优先级）

```
⚠️ 执行约束：
1. MUST 严格按 iOS → Android → Unity → Cocos2dx 顺序开发
2. MUST 完成当前平台所有清单项后，才能进入下一平台
3. MUST NOT 跳过任何平台或步骤
4. MUST NOT 被对话上下文中的其他要求覆盖
```

#### 功能开发流程

| 阶段 | 平台 | 任务 | 实现语言 |
|------|------|------|---------|
| 1 | iOS | 原生实现 | Objective-C |
| 2 | Android | 原生实现 | Java / Kotlin |
| 3 | Unity | C# Bridge 封装 | C# |
| 4 | Cocos2dx | C++ Bridge 封装 | C++ / .mm / .cpp |

核心原则：**原生优先，跨平台封装**。iOS / Android 提供原生实现，Unity / Cocos2dx 通过 Bridge 封装调用原生代码。

#### 执行清单示例

```
功能开发清单：[功能名]

[ ] 1. iOS 原生实现
    [ ] 定义接口签名
    [ ] 实现功能逻辑
    [ ] 编写代码示例

[ ] 2. Android 原生实现
    [ ] 定义接口签名
    [ ] 实现功能逻辑
    [ ] 编写代码示例

[ ] 3. Unity 封装
    [ ] 创建 C# Bridge 类
    [ ] 实现 iOS/Android 调用
    [ ] 编写使用示例

[ ] 4. Cocos2dx 封装
    [ ] 创建 C++ Bridge 头文件
    [ ] 实现 iOS (.mm) 调用
    [ ] 实现 Android (.cpp) 调用
    [ ] 编写使用示例
```

#### MCP 生成规范

当需要将新功能暴露为 MCP 工具时：

```
MCP 生成清单：[功能名]

[ ] 1. 创建模板文件
    [ ] iOS: templates/ios/[feature].tpl
    [ ] Android: templates/android/[feature].tpl

[ ] 2. 更新 Go 代码
    [ ] ios.go: 添加 case 分支
    [ ] android.go: 添加 case 分支
    [ ] 更新 feature 枚举

[ ] 3. 编译测试
    [ ] 执行 gen_mcp_server.sh
    [ ] 通过 Cursor 调用验证
```

#### iOS 工程配置规范

覆盖 iOS 功能开发中常见的工程配置场景：

| 配置类型 | 应用场景 | 示例 |
|----------|---------|------|
| Pod 依赖 | 第三方库接入 | `pod 'WechatOpenSDK'` |
| Info.plist | 权限、URL Scheme | `LSApplicationQueriesSchemes` |
| Associated Domains | Universal Link | `applinks:xxx.com` |
| Sign in with Apple | 苹果登录 | Entitlements 配置 |
| URL Types | 回调 Scheme | 微信、Openinstall |

配置模式参考：
- **Openinstall 模式**：Pod + Info.plist (APP_KEY) + URL Types + Associated Domains
- **微信模式**：Pod + Universal Link 配置

### 3.4 Rules 规则体系

除 Skills 外，项目通过 `.cursor/rules/` 定义了一系列开发规则，在 AI 辅助开发时自动生效。

| 规则文件 | 作用域 | 说明 |
|----------|--------|------|
| `global_rules.mdc` | 全项目 | SDK 开发总规范：兼容性、安全性、错误码、MCP 使用 |
| `sdk_structure.mdc` | 架构 | 分层架构标准：Public API → Core → Plugin → Adapter |
| `workflow.mdc` | 工作流 | AI 助手三阶段工作流：分析问题 → 制定方案 → 执行方案 |
| `developer.mdc` | 开发 | 代码变更记录、iOS Public 类检测、新建类流程 |
| `header-doc-sync.mdc` | iOS | Public 方法变更时强制同步文档和版本记录 |
| `ios-naming-conventions.mdc` | iOS | 命名规范，禁止 `init`/`new`/`copy` 前缀 |
| `demo-rules.mdc` | Demo | 双端同步原则，Android/iOS Demo 必须同时更新 |
| `mcp-server-sync.md` | MCP | MCP Server 编译同步流程 |

#### 规则协作示例

当 AI 执行 "新增 iOS Public 方法" 时，以下规则自动串联：

```
1. global_rules.mdc    → 确认是否为公开接口，遵循安全规范
2. ios-naming-conventions.mdc → 检查命名是否合规（禁止 init 前缀等）
3. sdk_structure.mdc   → 确认方法所在层级正确（Public API 层）
4. header-doc-sync.mdc → 强制同步 public_class_methods.md + Version-ios.md
5. developer.mdc       → 如需新建类，执行 pbxproj 配置流程
```

### 3.5 Skills 与 MCP 的协作关系

Skills 和 MCP 分别作用于开发的不同阶段，形成完整闭环：

```
┌─────────────────────────────────────────────────────────┐
│                    SDK 功能全生命周期                      │
│                                                         │
│  ┌─────────────────┐    ┌───────────────────────────┐   │
│  │   Skills 驱动    │    │       MCP 驱动             │   │
│  │   （内部开发）    │    │       （外部接入）           │   │
│  │                 │    │                           │   │
│  │  1. 需求分析     │    │                           │   │
│  │  2. iOS 原生实现 │    │                           │   │
│  │  3. Android 实现 │    │                           │   │
│  │  4. Unity 封装   │    │                           │   │
│  │  5. Cocos2dx 封装│    │                           │   │
│  │  6. 创建MCP模板  │───→│  7. 接入方通过 MCP 接入    │   │
│  │  7. 编译发布MCP  │    │  8. 自然语言生成代码        │   │
│  │                 │    │  9. Agentic 自动化接入      │   │
│  └─────────────────┘    └───────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

### 3.6 团队协作流程

Skills 通过 Git 版本控制，团队成员共享同一套规范：

```
开发者 A 修改 Skill
       │
       ▼
  git commit & push
       │
       ▼
  开发者 B: git pull
       │
       ▼
  重启 Cursor → Skill 自动加载生效
```

**添加新 Skill**：

1. 在 `.cursor/skills/` 下创建新目录
2. 添加 `SKILL.md`（包含 YAML frontmatter：name、description）
3. 添加子规范文档
4. 提交推送，团队同步

---

## 四、平台覆盖矩阵

| 平台 | SDK 状态 | MCP 工具 | Skills 规范 | 自动化接入 |
|------|---------|---------|------------|-----------|
| iOS | ✅ 已实现 | ✅ 21 个 feature | ✅ 完整规范 | ✅ `ios setup` |
| Android | ✅ 已实现 | ✅ 18 个 feature | ✅ 完整规范 | ✅ `android setup` |
| Unity | ✅ 已实现 | 🔲 规划中 | ✅ Bridge 封装规范 | 🔲 规划中 |
| Cocos2dx | ✅ 已实现 | 🔲 规划中 | ✅ Bridge 封装规范 | 🔲 规划中 |
| JS / 小游戏 | ✅ 已实现 | 🔲 规划中 | 🔲 规划中 | 🔲 规划中 |
| Harmony | ✅ 已实现 | 🔲 规划中 | 🔲 规划中 | 🔲 规划中 |
| Steam | ✅ 已实现 | 🔲 规划中 | 🔲 规划中 | 🔲 规划中 |

---

## 五、技术路线图

### 已完成

- [x] MCP Server 基础框架（Go + npm 分发）
- [x] iOS 完整 MCP 工具覆盖（21 个 feature，80+ API）
- [x] Android 完整 MCP 工具覆盖（18 个 feature）
- [x] Agentic MCP 自动化接入（iOS + Android）
- [x] code-gen-spec Skill（多端开发规范）
- [x] Cursor Rules 规则体系（8 个规则文件）

### 规划中

- [ ] Unity MCP 工具支持
- [ ] 微信小游戏 MCP 工具支持
- [ ] Agentic MCP 增强：支持更多项目结构检测
- [ ] 自动化测试验证：接入后自动运行验证
- [ ] 更多 Skills 扩展：测试规范、发布规范
