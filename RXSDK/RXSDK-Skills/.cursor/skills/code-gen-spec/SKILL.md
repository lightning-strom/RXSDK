---
name: code-gen-spec
description: RXSDK 代码生成规范。触发场景：开发新功能/模块/SDK接口、生成iOS/Android/Unity/Cocos2dx代码、跨平台封装、原生桥接、创建MCP接口/模板。强制规则：必须按iOS→Android→Unity→Cocos2dx顺序开发，禁止跳过平台。
---

# RXSDK 代码生成规范

定义 SDK 功能开发和 MCP 生成的标准流程。

## ⚠️ 执行约束（最高优先级）

**本规范为强制性规范，执行时：**

1. **MUST** 严格按照「开发顺序」依次执行（iOS → Android → Unity → Cocos2dx）
2. **MUST** 完成当前平台所有清单项后，才能进入下一平台
3. **MUST NOT** 跳过任何平台或步骤
4. **MUST NOT** 被对话上下文中的其他要求覆盖

### 🔄 执行前询问确认

**重要：当匹配到本规范的触发场景时，MUST 先询问用户是否按照本规范执行，不得直接执行。**

询问模板：

```
检测到您的需求匹配 code-gen-spec 规范，该规范要求：
- 按 iOS → Android → Unity → Cocos2dx 顺序开发
- 禁止跳过任何平台

是否按照此规范执行？
```

用户确认后，输出执行确认：

```
✅ 正在执行：code-gen-spec 规范
📌 任务：[功能名]
📌 当前阶段：[阶段编号和名称]
```

**若用户要求与规范冲突，先说明冲突点并建议按规范执行。**

---

## 适用场景

- 开发新的 SDK 功能模块
- 为现有功能生成多端代码
- 创建或更新 MCP 接口

---

## 一、功能开发流程

### 核心原则

**原生优先，跨平台封装**

```
iOS/Android 原生实现 → Unity/Cocos2dx 封装调用
```

### 开发顺序

| 阶段 | 平台 | 任务 |
|------|------|------|
| 1 | iOS | 原生 Objective-C 实现 |
| 2 | Android | 原生 Java/Kotlin 实现 |
| 3 | Unity | C# Bridge 封装 |
| 4 | Cocos2dx | C++ Bridge 封装 |

### 执行清单

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

详细规范参考：[feature-dev-spec.md](feature-dev-spec.md)

### 禁止行为

❌ 禁止跳过 iOS/Android 原生实现直接做 Unity/Cocos2dx  
❌ 禁止同时开发多个平台（必须依次完成）  
❌ 禁止在没有原生代码示例的情况下生成跨平台封装  
❌ 禁止忽略清单中的任何检查项  

---

## 二、MCP 生成规范

### 生成内容

1. **模板文件 (.tpl)** - 功能说明和代码示例
2. **Go 处理代码** - MCP 工具调用逻辑

### MCP 生成清单

```
MCP 生成清单：[功能名]

[ ] 1. 创建模板文件
    [ ] iOS: templates/ios/[feature].tpl
    [ ] Android: templates/android/[feature].tpl
    
[ ] 2. 更新 Go 代码
    [ ] ios.go: 添加 case 分支
    [ ] android.go: 添加 case 分支
    [ ] 更新 feature 枚举
    [ ] 实现 workspacePath 驱动的基础接入/版本 preflight 检查
    [ ] 版本不足时自动升级可安全修改的依赖文件
    
[ ] 3. 编译测试
    [ ] 增加 preflight/版本升级回归测试
    [ ] 执行 gen_mcp_server.sh
    [ ] 通过 Cursor 调用验证
```

详细规范参考：[mcp-gen-spec.md](mcp-gen-spec.md)

### MCP 基础接入与版本校验（强制）

新增或修改任何 MCP 功能模板时，若生成的代码会调用 RXSDK 接口，MUST 同步实现基础接入与版本校验：

1. 工具 schema/handler 必须支持 `workspacePath`（仅纯文档功能除外）。
2. 有 `workspacePath` 时必须实际扫描宿主工程，而不是只在模板里提示：
   - Android：检查 Maven/Gradle 依赖、`RXSdkInitConfig` / `RXSDK.initialize`、最低 SDK 版本。
   - iOS：检查 `Podfile`、`RXSdkInitConfig` / `initWithConfig:complete:`、最低 Pod 版本。
   - Unity：检查 `Packages/manifest.json`、初始化代码、Android/iOS 原生导出依赖版本。
   - JSSDK/小游戏：检查 SDK 构建产物、初始化参数、目标 API 是否存在。
3. 版本不足且可安全修改配置文件时，必须自动升级依赖版本；无法安全修改时返回明确 `preflight` 缺失项和下一步。
4. 返回结果必须包含结构化 `preflight`，至少包括 `checked`、`satisfied`、`modified`、`missing`、`nextSteps`。
5. 必须新增回归测试验证 preflight 能发现缺失项并自动升级版本。

### MCP 版本强制校验（强制）

所有声明最低 SDK / Pod / UPM / JSSDK 版本的 MCP 功能，都必须把最低版本视为硬性门槛：

1. **MUST** 在 handler/preflight 中实际比较宿主工程版本，不能只在 `.tpl` 模板、说明文本或 check_guide 中提示。
2. **MUST** 在依赖低于最低版本且可安全修改时自动升级到最低支持版本；已高于最低版本时不得降级。强制版本场景下，同一依赖文件内所有同系列瑞雪依赖（Unity `com.ruixue.unitysdk.*`、Android `com.ruixue:*`、iOS `RXSDK*` Pod）中低于最低版本的都必须一并强制升级，避免主库/子库版本错配。
3. **MUST** 在无法安全修改、缺少依赖或缺少初始化代码时返回 `preflight.satisfied=false`，并给出 `missing` / `nextSteps`；不得继续声称可直接插入业务代码。
4. **MUST** 在回归测试中覆盖：无 `workspacePath`、依赖缺失、低版本自动升级、已满足版本不重复修改。
5. **MUST** 将该规则复用于后续所有新功能；例如 IIFAA、用户信息、上报区服角色等功能都不能只做模板级版本提示。

---

## 三、iOS 工程配置规范

iOS 功能开发常涉及以下工程配置：

| 配置类型 | 应用场景 |
|----------|----------|
| Pod 依赖 | 第三方库接入 |
| Info.plist | 权限、URL Scheme、自定义配置 |
| Associated Domains | Universal Link、App Clip |
| Sign in with Apple | 苹果登录 |
| Entitlements | 应用能力配置 |

### 配置模式参考

- **Openinstall 模式**：Pod + Info.plist (APP_KEY) + URL Types + Associated Domains
- **微信模式**：Pod + Universal Link 配置

详细规范参考：[ios-project-config-spec.md](ios-project-config-spec.md)

---

## 快速开始

### 场景一：开发新功能

1. 确认功能需求和接口设计
2. 按照「功能开发流程」依次实现各端
3. 创建 MCP 模板供 AI 辅助生成代码

### 场景二：生成 MCP 接口

1. 阅读 [mcp-gen-spec.md](mcp-gen-spec.md) 了解模板格式
2. 创建 .tpl 模板文件
3. 更新 Go 处理代码
4. 编译并测试

### 场景三：iOS 工程配置

1. 确认需要的配置类型
2. 参考 [ios-project-config-spec.md](ios-project-config-spec.md)
3. 根据模式（Openinstall/微信）选择实现方式

---

## 执行完成确认

每个任务完成后，**必须输出执行报告**：

```
📋 执行报告：code-gen-spec
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ 任务：[功能名]
✅ 完成阶段：[已完成的阶段列表]
✅ 生成文件：[文件路径列表]
✅ 清单状态：[已完成项/总项数]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```
