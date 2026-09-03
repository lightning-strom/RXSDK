---
name: minigame-module-create
description: 创建 RXSDK 小游戏（JS）组件或渠道模块。触发场景：新建微信小游戏渠道、新建 H5 渠道、新建小游戏功能组件、新建海外社交登录组件。涵盖 TypeScript 入口文件、API 接口、Rollup 构建配置、渠道参数校验等完整流程。
---

# 小游戏（JS）组件库 / 渠道库创建规范

基于 RXSDK-JS 工程结构，指导创建新的小游戏渠道或功能组件。

## 模块分类

| 类型 | 文件位置 | 命名格式 | 用途 |
|------|----------|----------|------|
| 小游戏渠道 | `src/index.[channel].ts` | `index.wegame.ts`, `index.qq.ts` | 微信/QQ 等小游戏平台 |
| H5 渠道 | `src/index.h5_[channel].ts` | `index.h5_oppo.ts`, `index.h5_vivo.ts` | H5 网页渠道 |
| 海外组件 | `src/oversea/[name].ts` | `oversea/facebook.ts`, `oversea/google.ts` | 海外社交登录/分享 |
| 功能组件 | `src/index.[feature].ts` | `index.feedback.ts`, `index.social.ts` | 通用功能模块 |
| API 子模块 | `src/api/[name]/` | `api/huawei/`, `api/social/` | 渠道特定 API |

---

## 一、小游戏渠道创建流程

### 核心架构

```
SdkCommon (index.common.ts)     ← 基础功能（验证码、版本检查等）
    ↑ 继承
Sdk[Channel] (index.[channel].ts)  ← 渠道特定实现（登录、支付等）
```

### 目录结构

```
RXSDK-JS/
├── src/
│   ├── index.common.ts          # 公共基类
│   ├── index.[channel].ts       # 新渠道入口 ← 创建此文件
│   ├── api/
│   │   └── api.ts               # 公共 API 函数
│   └── utils/
│       └── checkConfig/
│           └── [channel].ts     # 渠道参数校验 ← 创建此文件
├── build/
│   └── rollup.config.[channel].ts  # 构建配置 ← 创建此文件
└── package.json                    # 注册 build/start 脚本
```

### Step 1: 创建渠道入口文件

`src/index.[channel].ts`：

```typescript
import SdkCommon from './index.common'
import { doRequest } from './api/request'
import { invalidInitParams, pubCheck } from '@/utils/paramsValid'
import { initParamsCheck } from '@/utils/checkConfig'

class Sdk[Channel] extends SdkCommon {

  constructor(initParams: ISdkInitParams) {
    super(initParams)
  }

  // 初始化
  public async init(params: object, callback: IMethodParams) {
    try {
      await pubCheck(initParamsCheck, callback, params)
      // 渠道初始化逻辑
    } catch (error) {
      callback.complete(handleError(error))
    }
  }

  // 登录
  public async login(params: object, callback: IMethodParams) {
    try {
      // 渠道登录逻辑
    } catch (error) {
      callback.complete(handleError(error))
    }
  }

  // 支付
  public async pay(params: object, callback: IMethodParams) {
    try {
      // 渠道支付逻辑
    } catch (error) {
      callback.complete(handleError(error))
    }
  }
}

export default Sdk[Channel]
```

### Step 2: 创建参数校验

`src/utils/checkConfig/[channel].ts`：

```typescript
export function [channel]PayCheckParams(params: any) {
  // 支付参数校验
}

export function [channel]LoginCheckParams(params: any) {
  // 登录参数校验
}
```

### Step 3: 创建 Rollup 构建配置

`build/rollup.config.[channel].ts`：

参考已有渠道的 rollup 配置，指定入口文件和输出目标。

### Step 4: 注册 npm scripts

在 `package.json` 的 `scripts` 中添加：

```json
{
  "build:[channel]": "cross-env NODE_ENV=production rollup -c build/rollup.config.[channel].ts",
  "start:[channel]": "cross-env NODE_ENV=development rollup -c build/rollup.config.[channel].ts -w"
}
```

---

## 二、H5 渠道创建流程

H5 渠道入口文件放在 `src/index.h5_[channel].ts`，通常依赖 `src/h5/` 下的公共模块：

| H5 公共模块 | 用途 |
|-------------|------|
| `h5/SdkCommon.ts` | H5 公共基类 |
| `h5/SdkCommomUI.ts` | H5 公共 UI |
| `h5/SDKUI.ts` | SDK UI 组件 |
| `h5/SdkHelpCenter.ts` | 帮助中心 |
| `h5/SdkSocial.ts` | 社交功能 |
| `h5/apis.ts` | H5 API 接口 |
| `h5/config.ts` | H5 配置 |

---

## 三、海外组件创建流程

海外社交登录/分享组件放在 `src/oversea/[name].ts`：

```typescript
// src/oversea/[name].ts
export function [name]Login(params: any) {
  // 海外登录实现
}

export function [name]Share(params: any) {
  // 海外分享实现
}
```

现有海外组件：`apple.ts`, `facebook.ts`, `google.ts`, `instagram.ts`, `tiktok.ts`, `zalo.ts`

---

## 四、API 子模块创建

渠道特定的 API 接口放在 `src/api/[name]/` 目录下：

```
src/api/
├── api.ts              # 公共 API（登录、注册、订单等）
├── request.ts          # 请求封装
├── log.ts              # 日志
├── huawei/             # 华为特定 API
├── social/             # 社交 API
├── feedback/           # 反馈 API
├── helpcenter/         # 帮助中心 API
└── wx-request/         # 微信请求封装
```

---

## 编码规范

### 方法模式

所有渠道方法采用统一的 `async + callback` 模式：

```typescript
public async methodName(params: ParamType, callback: IMethodParams) {
  try {
    await pubCheck(checkFunction, callback, params)
    let result = await someApi(params)
    callback.complete(result)
  } catch (error) {
    callback.complete(handleError(error))
  }
}
```

### 错误处理

统一使用 `handleError` 包装错误：

```typescript
import { handleError } from '@/utils/utils'
```

### 公共函数引用

```typescript
import { doRequest } from './api/request'         // 请求
import { pubCheck } from '@/utils/paramsValid'     // 参数校验
import { handleError, asyncFunc } from '@/utils/utils'  // 工具
import { SYSTEM_INFO } from '@/config'             // 系统信息
```

---

## 执行清单

```
小游戏模块创建清单：[模块名]

[ ] 1. 确认模块类型（小游戏渠道/H5渠道/海外组件/功能组件）
[ ] 2. 创建入口 TypeScript 文件
[ ] 3. 继承 SdkCommon 并实现渠道方法
[ ] 4. 创建参数校验函数
[ ] 5. 创建 Rollup 构建配置
[ ] 6. 注册 npm build/start 脚本
[ ] 7. 如需：创建渠道特定 API 子模块
[ ] 8. 编译验证
```
