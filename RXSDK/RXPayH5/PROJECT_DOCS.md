# RX-Pay-H5 项目技术文档

> 版本：1.0.0  
> 最后更新：2026-01-22

---

## 目录

1. [项目概述](#1-项目概述)
2. [技术架构](#2-技术架构)
3. [项目结构](#3-项目结构)
4. [路由系统](#4-路由系统)
5. [页面功能详解](#5-页面功能详解)
6. [组件详解](#6-组件详解)
7. [状态管理](#7-状态管理)
8. [网络请求](#8-网络请求)
9. [API 接口详解](#9-api-接口详解)
10. [数据加密机制](#10-数据加密机制)
11. [客户端交互（JsBridge）](#11-客户端交互jsbridge)
12. [多语言国际化](#12-多语言国际化)
13. [本地缓存策略](#13-本地缓存策略)
14. [支付业务流程](#14-支付业务流程)
15. [样式与适配](#15-样式与适配)
16. [构建与部署](#16-构建与部署)
17. [开发指南](#17-开发指南)

---

## 1. 项目概述

### 1.1 项目简介

RX-Pay-H5 是一个移动端 H5 支付页面项目，设计用于嵌入在原生客户端 App（Android/iOS）的 WebView 中运行。项目提供了一个完整的支付流程界面，支持多种第三方支付渠道，包括 MyCard、PayerMax、Checkout、UTG 等。

### 1.2 核心功能

- **支付方式选择**：展示可用的支付方式列表，用户可选择偏好的支付渠道
- **银行卡管理**：支持绑定、选择、删除银行卡（针对 Checkout 支付）
- **支付结果展示**：根据支付状态展示成功、失败或待处理页面
- **多语言支持**：支持 9 种语言，包括 RTL（从右到左）语言
- **客户端交互**：通过 JsBridge 与原生 App 进行双向通信

### 1.3 应用场景

- 游戏内购支付
- 虚拟商品购买
- 会员充值
- 跨境支付

---

## 2. 技术架构

### 2.1 技术栈

| 分类 | 技术 | 版本 | 说明 |
|------|------|------|------|
| **框架** | Vue.js | 3.4.21 | 渐进式前端框架，使用 Composition API |
| **语言** | TypeScript | 5.2.2 | JavaScript 的超集，提供类型安全 |
| **构建工具** | Vite | 5.2.0 | 下一代前端构建工具，开发体验极佳 |
| **路由** | Vue Router | 4.3.2 | Vue.js 官方路由管理器 |
| **状态管理** | Pinia | 2.1.7 | Vue.js 官方推荐的状态管理库 |
| **UI 组件库** | Vant | 4.9.0 | 轻量级移动端组件库 |
| **样式方案** | Tailwind CSS | 3.4.3 | 原子化 CSS 框架 |
| **CSS 预处理** | Sass | 1.77.0 | CSS 预处理器 |
| **HTTP 客户端** | Axios | 0.21.4 | 基于 Promise 的 HTTP 库 |
| **国际化** | vue-i18n | 9.13.1 | Vue.js 国际化插件 |
| **移动端适配** | amfe-flexible | 2.2.1 | 可伸缩布局方案 |
| **调试工具** | eruda | 2.3.3 | 移动端调试面板（开发环境） |

### 2.2 架构图

```
┌─────────────────────────────────────────────────────────────────┐
│                        原生客户端 App                            │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                      WebView 容器                          │  │
│  │  ┌─────────────────────────────────────────────────────┐  │  │
│  │  │                   H5 支付页面                         │  │  │
│  │  │  ┌─────────────────────────────────────────────┐    │  │  │
│  │  │  │               Vue 3 Application              │    │  │  │
│  │  │  │  ┌─────────┐ ┌─────────┐ ┌─────────────┐   │    │  │  │
│  │  │  │  │  Pages  │ │Components│ │   Hooks     │   │    │  │  │
│  │  │  │  └────┬────┘ └────┬────┘ └──────┬──────┘   │    │  │  │
│  │  │  │       │           │             │          │    │  │  │
│  │  │  │  ┌────┴───────────┴─────────────┴────┐     │    │  │  │
│  │  │  │  │            Pinia Store             │     │    │  │  │
│  │  │  │  └────────────────┬──────────────────┘     │    │  │  │
│  │  │  │                   │                        │    │  │  │
│  │  │  │  ┌────────────────┴──────────────────┐     │    │  │  │
│  │  │  │  │         Utils & Services          │     │    │  │  │
│  │  │  │  │  ┌─────────┐  ┌────────────────┐  │     │    │  │  │
│  │  │  │  │  │ Request │  │   Crypto/AES   │  │     │    │  │  │
│  │  │  │  │  └────┬────┘  └────────────────┘  │     │    │  │  │
│  │  │  │  └───────┼───────────────────────────┘     │    │  │  │
│  │  │  └──────────┼─────────────────────────────────┘    │  │  │
│  │  └─────────────┼──────────────────────────────────────┘  │  │
│  │                │                                         │  │
│  │  ┌─────────────┴─────────────┐                          │  │
│  │  │        JsBridge           │ ◄──► 原生方法调用          │  │
│  │  └───────────────────────────┘                          │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────────────┬────────────────────────────────┘
                                 │
                                 ▼
                    ┌────────────────────────┐
                    │     后端 API 服务器      │
                    │   ruixueyun.com        │
                    └────────────────────────┘
```

### 2.3 数据流向

```
用户操作 → Vue 组件 → Hooks/Actions → API 请求 → 后端服务
                ↑                           │
                └─── 响应数据 ◄──────────────┘
```

---

## 3. 项目结构

### 3.1 目录结构

```
rx-pay-h5/
├── public/                      # 静态资源目录
│   └── vite.svg                 # Vite 图标
│
├── src/                         # 源代码目录
│   ├── main.ts                  # 应用入口文件
│   ├── App.vue                  # 根组件
│   ├── vite-env.d.ts            # Vite 环境类型声明
│   │
│   ├── assets/                  # 资源文件
│   │   ├── images/              # 图片资源
│   │   │   ├── card.png         # 银行卡图标
│   │   │   ├── close.png        # 关闭图标
│   │   │   ├── setting.png      # 设置图标
│   │   │   ├── success_v.png    # 成功状态图（竖屏）
│   │   │   ├── success_h.png    # 成功状态图（横屏）
│   │   │   ├── fail_v.png       # 失败状态图（竖屏）
│   │   │   ├── fail_h.png       # 失败状态图（横屏）
│   │   │   ├── pending_v.png    # 待处理状态图（竖屏）
│   │   │   └── pending_h.png    # 待处理状态图（横屏）
│   │   └── vue.svg              # Vue 图标
│   │
│   ├── components/              # 公共组件
│   │   └── bank-card-list/      # 银行卡列表组件
│   │       └── index.vue
│   │
│   ├── hooks/                   # 组合式函数
│   │   └── useParams.ts         # 参数处理 Hook
│   │
│   ├── pages/                   # 页面组件
│   │   ├── home.vue             # 支付首页
│   │   └── result.vue           # 支付结果页
│   │
│   ├── router/                  # 路由配置
│   │   └── index.ts
│   │
│   ├── store/                   # 状态管理
│   │   ├── index.ts             # Store 入口
│   │   └── modules/
│   │       └── local.ts         # 本地语言模块
│   │
│   ├── styles/                  # 全局样式
│   │   ├── global.scss          # 全局样式
│   │   ├── reset.scss           # 样式重置
│   │   ├── tailwind.css         # Tailwind 引入
│   │   └── variables.scss       # SCSS 变量
│   │
│   ├── types/                   # 类型定义
│   │   └── auto-import.d.ts     # 自动导入类型
│   │
│   └── utils/                   # 工具函数
│       ├── utils.ts             # 通用工具
│       ├── cache.ts             # 缓存管理
│       ├── lang.ts              # 语言字典
│       ├── array.ts             # 数组工具
│       └── request/             # 请求相关
│           ├── apis.ts          # API 定义
│           ├── request.ts       # Axios 封装
│           ├── crypto-js.ts     # 加密工具
│           └── crypto.js        # CryptoJS 库
│
├── dist/                        # 构建输出目录
├── sdkh5/                       # SDK H5 输出目录
│
├── index.html                   # HTML 入口
├── package.json                 # 项目配置
├── vite.config.ts               # Vite 配置
├── tsconfig.json                # TypeScript 配置
├── tsconfig.node.json           # Node TypeScript 配置
├── tailwind.config.js           # Tailwind 配置
├── postcss.config.cjs           # PostCSS 配置
├── prettier.config.cjs          # Prettier 配置
├── components.d.ts              # 组件类型声明
├── .gitignore                   # Git 忽略配置
├── .gitlab-ci.yml               # GitLab CI 配置
└── README.md                    # 项目说明
```

### 3.2 入口文件（main.ts）

```typescript
import 'amfe-flexible'           // 移动端适配
import './styles/global.scss'    // 全局样式
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { Notify, Loading } from 'vant'
import 'vant/lib/index.css'

// 版本控制与缓存清理
const version = '1.0.1'
const cacheNeedsCleared = true

if (cacheNeedsCleared) {
  const currentVersion = localStorage.getItem('version')
  if (currentVersion && currentVersion !== version) {
    localStorage.clear()
  }
  localStorage.setItem('version', version)
}

// 创建 Vue 实例
const app = createApp(App)
app.use(router)
app.use(Notify)
app.use(Loading)
app.mount('#app')
```

**功能说明：**
- 引入 `amfe-flexible` 实现移动端 rem 适配
- 版本控制机制：当版本号变化时自动清空 localStorage
- 注册 Vant 的 Notify 和 Loading 插件

---

## 4. 路由系统

### 4.1 路由配置（router/index.ts）

```typescript
import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import Home from '../pages/home.vue'
import Result from '../pages/result.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/result',
    name: 'Result',
    component: Result
  }
]

const router = createRouter({
  history: createWebHashHistory('/static/pay'),
  routes
})

export default router
```

### 4.2 路由详解

| 路由路径 | 组件名称 | 完整 URL 示例 | 功能说明 |
|----------|----------|---------------|----------|
| `/` | Home | `https://domain.com/static/pay/#/` | 支付首页，展示支付方式选择 |
| `/result` | Result | `https://domain.com/static/pay/#/result?status=SUCCESS` | 支付结果页，展示支付状态 |

### 4.3 路由模式

项目使用 **Hash 模式**（`createWebHashHistory`），原因如下：
- WebView 环境兼容性更好
- 避免服务器端配置
- 支持在无服务器环境下运行

---

## 5. 页面功能详解

### 5.1 支付首页（home.vue）

#### 5.1.1 页面功能

支付首页是用户进入支付流程的第一个页面，主要功能包括：

1. **展示支付金额**
   - 顶部固定展示当前订单金额
   - 格式：货币符号 + 金额（千分位格式）
   - 示例：`$ 99.99`

2. **支付方式列表**
   - 展示后端返回的可用支付方式
   - 每个支付方式显示图标
   - 支持单选操作
   - 智能排序：用户成功使用过的支付方式会优先展示

3. **更多支付方式**
   - 当支付方式数量超过限制时显示"更多支付方式"按钮
   - 点击展开全部支付方式
   - 竖屏默认显示 12 个，横屏默认显示 8 个

4. **保存支付信息**
   - 复选框控制是否保存支付信息
   - 默认勾选
   - 用于 Checkout 等支付方式的卡片记忆功能

5. **立即支付按钮**
   - 触发支付流程
   - 显示加载状态

#### 5.1.2 核心代码逻辑

```typescript
// 页面挂载时的初始化流程
onMounted(() => {
  // 1. 获取客户端传递的初始化参数
  getInitParams()
  
  // 2. 设置原生标题栏
  setTitle(order_info.value.goods_name)
  setBackVisible(false)
  
  // 3. 加载 Checkout SDK（用于风控）
  loadCheckoutSdk()
  
  // 4. 获取支付方式列表
  getH5PageApi({
    goods_tag: order_info.value.goods_tag,
    country: country_code.value
  }).then((res: any) => {
    if (res.code === 0) {
      // 处理支付方式列表
      const platforms = res.data.platform || []
      tableData.value = moveItemsToFront(platforms)  // 常用支付方式排前面
      foreign_price.value = res.data.foreign_price
      setting_id.value = res.data.setting_id
      currency_symbol.value = res.data.currency
      
      // 默认选中第一个
      if (tableData.value.length) {
        currentId.value = tableData.value[0].id
      }
    }
  })
})
```

#### 5.1.3 支付确认流程

```typescript
const handleConfirm = () => {
  // 1. 获取支付类型详情
  getPayTypeApi({
    h5_setting_id: setting_id.value,
    h5_platform_id: currentId.value,
    country_code: country_code.value
  }).then((res: any) => {
    pay_type.value = res.data.pay_type
    pay_token.value = res.data.pay_token
    tag.value = res.data.tag
    
    // 2. Checkout 支付且有绑定卡时，弹出卡片选择
    const cards = res.data.cards || []
    if (res.data.pay_type == 'checkout' && 
        (res.data.tag == 'card' || res.data.tag == '__NORMAL__') && 
        cards.length) {
      bankRef.value.openDialog(cards, pay_token.value)
    } else {
      // 3. 直接发起支付
      handleDirectPay()
    }
  })
}
```

#### 5.1.4 下单接口调用

```typescript
const handlePay = async () => {
  // 构建支付参数
  let pay_card_info: any = {
    pay_token: pay_token.value,
    save_card: save_card.value
  }
  
  // 如果选择了已保存的卡
  if (card_id.value) {
    pay_card_info.card_id = card_id.value
    pay_card_info.use_save_card = true
  }
  
  // Checkout 风控数据
  if (pay_type.value == 'checkout' && checkout_sdk_loaded.value) {
    const risk = window.Risk.init(checkout_public_key.value)
    const deviceSessionId = await risk.publishRiskData()
    pay_card_info.deviceSessionId = deviceSessionId
  }
  
  // 调用下单接口
  orderApi({
    ...order_info.value,
    ext: {
      ...(order_info.value.ext || {}),
      country_code: country_code.value,
      return_url: `${window.location.origin}/static/pay/#/result?status=PENDING`,
      ...pay_card_info
    },
    h5_setting_id: setting_id.value,
    h5_platform_id: currentId.value
  }).then((res: any) => {
    // 根据支付类型跳转
    switch (res.data.pay_type) {
      case 'mycard':
        window.location.href = res.data.ext.TransactionUrl
        break
      case 'payermax':
        window.location.href = res.data.ext.redirectUrl
        break
      case 'utg':
        // UTG 支付：解码 base64 并写入页面
        const decodedHtml = atob(res.data.ext.url)
        document.open()
        document.write(decodedHtml)
        document.close()
        break
      default:
        window.location.href = res.data.ext.url
    }
  })
}
```

#### 5.1.5 响应式布局

页面支持横竖屏自适应：

```typescript
const isVertical = ref(window.orientation !== 90 && window.orientation !== -90)

// 列表样式根据方向调整
const itemStyle = computed(() => {
  const colCount = isVertical.value ? 2 : 4  // 竖屏2列，横屏4列
  return `width: ${Math.floor(innerWidth.value / colCount)}px`
})

// 按钮宽度调整
const buttonWidth = isVertical.value ? '292px' : '480px'
```

---

### 5.2 支付结果页（result.vue）

#### 5.2.1 页面功能

支付结果页展示支付完成后的状态信息：

1. **状态展示**
   - SUCCESS：支付成功
   - FAILED：支付失败
   - PENDING：状态获取失败/待处理
   - CLOSED：关闭（自动返回首页）

2. **状态图片**
   - 根据状态和屏幕方向展示不同图片
   - 横竖屏各有一套状态图

3. **状态文案**
   - 标题：支付成功/支付失败/状态获取失败
   - 提示语：引导用户联系客服
   - 失败原因（如有）

4. **确认按钮**
   - 点击后通过 URL Scheme 回调客户端

#### 5.2.2 状态判断逻辑

```typescript
// 从 URL 获取状态参数
const getUrlParams = (url: string) => {
  const paramsRegex = /[?&]+([^=&]+)=([^&]*)/gi
  const params: any = {}
  let match
  while (match = paramsRegex.exec(url)) {
    params[match[1]] = match[2]
  }
  return params
}

const status = ref<any>(getUrlParams(window.location.href).status)

const isSuccess = computed(() => status.value == 'SUCCESS')
const isFail = computed(() => status.value == 'FAILED')
const isPending = computed(() => status.value == 'PENDING')
const isClosed = computed(() => status.value == 'CLOSED')
```

#### 5.2.3 状态图片选择

```typescript
const statusImg = computed(() => {
  if (isSuccess.value) {
    return isVertical.value ? success_v : success_h
  }
  if (isFail.value) {
    return isVertical.value ? fail_v : fail_h
  }
  if (isPending.value) {
    return isVertical.value ? pending_v : pending_h
  }
})
```

#### 5.2.4 客户端回调

```typescript
const handleConfirm = () => {
  if (isSuccess.value) {
    window.location.href = 'ruixue://pay/success'
  } else if (isFail.value) {
    window.location.href = 'ruixue://pay/failure'
  } else if (isPending.value) {
    window.location.href = 'ruixue://pay/failure?code=4300&msg='
  }
}
```

#### 5.2.5 页面初始化

```typescript
onMounted(() => {
  // CLOSED 状态自动返回首页
  if (isClosed.value) {
    router.replace('/')
  }
  
  // 设置原生标题栏
  if (isSuccess.value) {
    setTitle(successText.value)
  }
  if (isFail.value) {
    setTitle(failText.value)
  }
  if (isPending.value) {
    setTitle(pendingText.value)
  }
})
```

---

## 6. 组件详解

### 6.1 银行卡列表组件（bank-card-list）

#### 6.1.1 组件功能

银行卡列表组件是一个弹窗组件，用于管理和选择已绑定的银行卡：

1. **卡片展示**
   - 展示用户已绑定的银行卡列表
   - 显示卡号（脱敏）和银行卡图标
   - 标记"最近使用"的卡片

2. **卡片选择**
   - 单选模式：选择一张卡进行支付
   - 选中状态高亮显示

3. **卡片管理（编辑模式）**
   - 多选模式：可选择多张卡
   - 删除功能：删除选中的卡片
   - 删除确认弹窗

4. **使用其他卡**
   - 跳过已保存卡片，使用新卡支付

#### 6.1.2 组件 Props

```typescript
interface Props {
  onConfirm: Function      // 确认回调
  langText: {              // 多语言文本
    payText: string
    selectCardText: string
    selectCardEditText: string
    promptText: string
    deleteText: string
    confirmDeleteText: string
    confirmText: string
    cancelText: string
    useOtherCardText: string
    confirmUseOtherCardText: string
    bankCardPayText: string
    recentlyText: string
    cardNumberText: string
  }
  language: string         // 当前语言
  cacheKey: string         // 缓存键
}
```

#### 6.1.3 组件暴露方法

```typescript
defineExpose({
  openDialog  // 打开弹窗，传入卡片列表和 pay_token
})

// 使用方式
function openDialog(_cards: any[], _pay_token: string) {
  cards.value = _cards.map((item, idx) => ({ 
    ...item, 
    lastest: idx == 0  // 第一张标记为最近使用
  }))
  pay_token.value = _pay_token
  currentIndex.value = [0]  // 默认选中第一张
  isSetting.value = false
  show.value = true
}
```

#### 6.1.4 编辑模式切换

```typescript
function handleSetting() {
  isSetting.value = !isSetting.value
  if (isSetting.value) {
    currentIndex.value = []     // 编辑模式清空选择
  } else {
    currentIndex.value = [0]    // 退出编辑模式选中第一张
  }
}
```

#### 6.1.5 卡片删除逻辑

```typescript
function handleDelete() {
  showConfirmDialog({
    title: props.langText?.promptText,
    message: props.langText?.confirmDeleteText,
    cancelButtonText: props.langText?.cancelText,
    confirmButtonText: props.langText?.confirmText
  }).then(() => {
    // 获取要删除的卡片 ID
    const ids = cards.value.length == 1 
      ? [cards.value[0].id] 
      : currentIndex.value.map(i => cards.value[i].id)
    
    // 调用删除接口
    deleteCardApi({
      pay_token: pay_token.value,
      id: ids.join(',')
    }).then((res: any) => {
      if (res.code == 0) {
        // 从列表中移除
        cards.value = cards.value.filter(card => !ids.includes(card.id))
        currentIndex.value = []
        
        // 如果全部删除则关闭弹窗
        if (cards.value.length == 0) {
          closeDialog()
        }
      }
    })
  })
}
```

#### 6.1.6 布局适配

```typescript
// 根据卡片数量和屏幕方向调整布局
// 竖屏：2 列
// 横屏：3-4 列（根据卡片数量）

<template v-if="isVertical">
  <!-- 竖屏布局：2列 -->
  <ul class="w-[298px] overflow-scroll flex flex-wrap">
    <li class="box-border mt-[7px] px-[10px]">
      <!-- 卡片 128x78 -->
    </li>
  </ul>
</template>

<template v-else>
  <!-- 横屏布局：根据数量调整 -->
  <ul v-if="cards.length == 3 || cards.length >= 5">
    <!-- 3列布局 -->
  </ul>
  <ul v-if="cards.length == 4 || cards.length == 2">
    <!-- 2列居中布局 -->
  </ul>
</template>
```

---

## 7. 状态管理

### 7.1 Store 配置（store/index.ts）

```typescript
import type { App } from "vue"
import { createPinia } from "pinia"

const store = createPinia()

export function setupStore(app: App<Element>) {
  app.use(store)
}

export { store }
```

### 7.2 本地语言模块（store/modules/local.ts）

```typescript
import { defineStore } from 'pinia'
import { store } from '@/store'

interface LocalState {
  local: string
}

export const useLocalStore = defineStore({
  id: 'local',
  state: (): LocalState => ({
    local: 'zh'  // 默认中文
  }),
  getters: {
    getLocal(): string {
      return this.local
    }
  },
  actions: {
    setLocal(local: string) {
      this.local = local
    }
  }
})

// 在 setup 外部使用
export function useLocalStoreWithOut() {
  return useLocalStore(store)
}
```

**注意**：当前项目主要通过 `useParams` Hook 管理语言状态，Store 模块可用于扩展。

---

## 8. 网络请求

### 8.1 Axios 封装（utils/request/request.ts）

#### 8.1.1 基础配置

```typescript
import axios from 'axios'
import { SYSTEM_INFO } from '@/utils/utils'
import { showNotify } from 'vant'
import {
  isJsonString,
  generateMD5,
  cpkey,
  AesEncryptBase64String,
  AesDecryptBase64String
} from './crypto-js'

const request = axios.create()
```

#### 8.1.2 错误码定义

```typescript
const COMMON_ERROR_CODE = {
  UNKNOW_NETWORK_ERROR: 1000,    // 未知网络错误
  TIMEOUT: 1131,                  // 超时
  REQUEST_ABORTED: 1132,          // 请求中断
  NETWORK_ERROR: 1100,            // 网络错误
  NOT_FOUND: 1401,                // 未找到
  INTERNAL_SERVER_ERROR: 1500,    // 服务器内部错误
  PARAMS_ERROR: 2000,             // 参数错误
  INIT_PARAMS_ERROR: 2001,        // 初始化参数错误
  API_NOT_EXIST: 2002,            // API 不存在
  PAY_PARAMS_ERROR: 4000,         // 支付参数错误
  // ... 其他错误码
}
```

#### 8.1.3 请求处理流程

```typescript
export async function service(options: any, lower?: boolean): Promise<any> {
  try {
    // 1. 生成加密密钥
    const devicecode = SYSTEM_INFO.request_headers['ruixue-devicecode']
    const key = generateMD5(devicecode + cpkey)
    const cpof = SYSTEM_INFO.cpof || false
    
    // 2. 构建请求头
    const headers: any = {
      'ruixue-accesstoken': SYSTEM_INFO.request_headers['ruixue-accesstoken'],
      'ruixue-channelid': SYSTEM_INFO.request_headers['ruixue-channelid'],
      'ruixue-productid': SYSTEM_INFO.request_headers['ruixue-productid'],
      'ruixue-cpid': SYSTEM_INFO.request_headers['ruixue-cpid'],
      'ruixue-traceid': SYSTEM_INFO.request_headers['ruixue-traceid'],
      'ruixue-language': SYSTEM_INFO.request_headers['ruixue-language'],
      'ruixue-tzoffset': SYSTEM_INFO.request_headers['ruixue-tzoffset'],
      'ruixue-platformid': 3,
      'ruixue-version': 'v3.10.0',
      'ruixue-devicecode': devicecode
    }
    
    // 3. 加密处理（如果开启）
    let data = options.data || {}
    if (cpof && !lower) {
      headers['ruixue-encipher'] = '1'
      headers['Content-Type'] = 'text/plan'
      data = aesEncryptBase64String(data)
    }
    
    // 4. 发送请求
    const result = await axios({
      url: SYSTEM_INFO.domain + options.url,
      method: options.method,
      headers,
      data,
      params: options.params || ''
    })
    
    // 5. 处理响应
    const res = result.data
    if (res.code === 0) {
      // 解密响应数据
      if (res.data && cpof && !lower) {
        const decrypted = aesDecryptBase64String(res.data)
        res.data = isJsonString(decrypted) ? JSON.parse(decrypted) : decrypted
      }
      return Promise.resolve(res)
    } else if ([302015, 302016].includes(res.code)) {
      // 服务端解密失败，降级重试
      return service(options, true)
    } else {
      // 显示错误提示
      const msg = res.msg || res.message || 'Error'
      showNotify({ type: 'warning', message: msg })
      return Promise.reject({ code: res.code, msg, data: res.data })
    }
  } catch (e: any) {
    const msg = e.msg || e.message || 'Error'
    showNotify({ type: 'warning', message: msg })
    return Promise.reject({ code: COMMON_ERROR_CODE.UNKNOW_NETWORK_ERROR, msg })
  }
}

export { service as doRequest }
```

---

## 9. API 接口详解

### 9.1 接口列表（utils/request/apis.ts）

```typescript
import { doRequest as request } from './request'

// 创建订单
export function orderApi(data: any) {
  return request({
    url: '/v1/ke/order',
    method: 'POST',
    data
  })
}

// 获取 H5 支付页面配置
export function getH5PageApi(params: any) {
  return request({
    url: '/v1/ke/platform_h5/page',
    method: 'GET',
    params
  })
}

// 获取支付类型（登录状态）
export function getPayTypeApi(params: any) {
  return request({
    url: '/v1/ke/platform_h5/hw/pay_type',
    method: 'GET',
    params
  })
}

// 获取支付类型（未登录状态）
export function getPayTypeUnLoginApi(params: any) {
  return request({
    url: '/v1/ke/platform_h5/hw/pay_type_unlogin',
    method: 'GET',
    params
  })
}

// 通过 client_token 查询绑定的卡
export function getCardByClientTokenApi(client_token: any) {
  return request({
    url: '/v1/ke/platform_h5/hw/query_card_by_client_token',
    method: 'GET',
    params: { client_token }
  })
}

// 删除已绑定的银行卡
export function deleteCardApi(data: any) {
  return request({
    url: '/v1/ke/platform_h5/hw/delete_card',
    method: 'POST',
    data
  })
}
```

### 9.2 接口详细说明

#### 9.2.1 获取支付页面配置

**接口地址**：`GET /v1/ke/platform_h5/page`

**请求参数**：
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| goods_tag | string | 是 | 商品标签 |
| country | string | 是 | 国家代码 |

**响应数据**：
```json
{
  "code": 0,
  "data": {
    "platform": [
      {
        "id": "platform_001",
        "icon": "https://xxx/icon.png",
        "name": "支付宝"
      }
    ],
    "foreign_price": 9900,
    "setting_id": "setting_001",
    "currency": "USD"
  }
}
```

#### 9.2.2 创建订单

**接口地址**：`POST /v1/ke/order`

**请求参数**：
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| goods_tag | string | 是 | 商品标签 |
| goods_name | string | 是 | 商品名称 |
| openid | string | 是 | 用户 OpenID |
| env | number | 是 | 环境（1:测试，2:生产） |
| h5_setting_id | string | 是 | H5 配置 ID |
| h5_platform_id | string | 是 | 支付平台 ID |
| ext | object | 否 | 扩展参数 |
| ext.country_code | string | 否 | 国家代码 |
| ext.return_url | string | 否 | 支付回调 URL |
| ext.pay_token | string | 否 | 支付令牌 |
| ext.card_id | string | 否 | 银行卡 ID |
| ext.use_save_card | boolean | 否 | 是否使用已保存的卡 |
| ext.save_card | boolean | 否 | 是否保存卡信息 |
| ext.deviceSessionId | string | 否 | Checkout 风控 ID |

**响应数据**：
```json
{
  "code": 0,
  "data": {
    "pay_type": "checkout",
    "ext": {
      "url": "https://checkout.com/pay/xxx",
      "TransactionUrl": "https://mycard.com/xxx",
      "redirectUrl": "https://payermax.com/xxx"
    }
  }
}
```

#### 9.2.3 获取支付类型

**接口地址**：`GET /v1/ke/platform_h5/hw/pay_type`

**请求参数**：
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| h5_setting_id | string | 是 | H5 配置 ID |
| h5_platform_id | string | 是 | 支付平台 ID |
| country_code | string | 是 | 国家代码 |

**响应数据**：
```json
{
  "code": 0,
  "data": {
    "pay_type": "checkout",
    "pay_token": "token_xxx",
    "tag": "card",
    "cards": [
      {
        "id": "card_001",
        "card_no": "**** **** **** 1234"
      }
    ],
    "ext": {
      "checkout_public_key": "pk_xxx"
    }
  }
}
```

#### 9.2.4 删除银行卡

**接口地址**：`POST /v1/ke/platform_h5/hw/delete_card`

**请求参数**：
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| pay_token | string | 是 | 支付令牌 |
| id | string | 是 | 卡 ID（多个用逗号分隔） |

**响应数据**：
```json
{
  "code": 0,
  "msg": "success"
}
```

---

## 10. 数据加密机制

### 10.1 加密工具（utils/request/crypto-js.ts）

#### 10.1.1 密钥生成

```typescript
export const cpkey = '4ca7dacc9332d74e1292c83f0aa3b376'

// 密钥 = MD5(devicecode + cpkey)
const key = generateMD5(devicecode + cpkey)
```

#### 10.1.2 AES-CBC 加密

```typescript
/**
 * AES-CBC 加密字符串
 * @param data 需要加密的字符串
 * @param key 加密密钥（32位）
 * @param iv 初始化向量（16位，取 key 前16位）
 * @returns Base64 编码的加密结果
 */
export function AesEncryptBase64String(data: any, key: any, iv: any) {
  const keyWordArray = CryptoJS.enc.Utf8.parse(key)
  const ivWordArray = CryptoJS.enc.Utf8.parse(iv)
  
  const encrypted = CryptoJS.AES.encrypt(data, keyWordArray, {
    iv: ivWordArray,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  })
  
  return encrypted.toString()
}
```

#### 10.1.3 AES-CBC 解密

```typescript
/**
 * AES-CBC 解密字符串
 * @param encryptedData Base64 编码的加密字符串
 * @param key 加密密钥
 * @param iv 初始化向量
 * @returns 解密后的原始字符串
 */
export function AesDecryptBase64String(encryptedData: any, key: any, iv: any) {
  const keyWordArray = CryptoJS.enc.Utf8.parse(key)
  const ivWordArray = CryptoJS.enc.Utf8.parse(iv)
  
  const decrypted = CryptoJS.AES.decrypt(encryptedData, keyWordArray, {
    iv: ivWordArray,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  })
  
  return decrypted.toString(CryptoJS.enc.Utf8)
}
```

#### 10.1.4 MD5 生成

```typescript
export function generateMD5(message: string) {
  return CryptoJS.MD5(message).toString()
}
```

### 10.2 加密流程

```
┌─────────────────────────────────────────────────────────────┐
│                       加密请求流程                           │
├─────────────────────────────────────────────────────────────┤
│  1. 检查 cpof 标志（是否开启加密）                            │
│     ↓                                                       │
│  2. 生成密钥：key = MD5(devicecode + cpkey)                  │
│     ↓                                                       │
│  3. 生成 IV：iv = key.substring(0, 16)                       │
│     ↓                                                       │
│  4. 加密请求体：encryptedData = AES_CBC(JSON.stringify(data))│
│     ↓                                                       │
│  5. 设置请求头：ruixue-encipher = '1'                        │
│     ↓                                                       │
│  6. 发送请求                                                 │
│     ↓                                                       │
│  7. 解密响应：decryptedData = AES_CBC_Decrypt(response.data) │
└─────────────────────────────────────────────────────────────┘
```

---

## 11. 客户端交互（JsBridge）

### 11.1 平台检测

```typescript
// 判断是否为 Android 平台
const isAndroid = computed(() => !!window.JsBridge)
```

### 11.2 获取初始化参数

#### Android 端

```typescript
// Android 通过 JsBridge 获取
const params = JSON.parse(window.JsBridge.getInitParams())
```

#### iOS 端

```typescript
// iOS 通过全局变量获取
const params = window.getInitParams
```

#### 统一封装

```typescript
const getInitParams = () => {
  initParams.value = isAndroid.value 
    ? JSON.parse(window.JsBridge.getInitParams()) 
    : window.getInitParams
    
  // 解析各个参数
  api_params.value = JSON.parse(initParams.value.api_params)
  init_data.value = JSON.parse(initParams.value.init_data || null)
  request_headers.value = JSON.parse(initParams.value.request_headers)
  device.value = JSON.parse(initParams.value.device)
  order_info.value = JSON.parse(initParams.value.order_info)
  country_code.value = order_info.value.country_code
  
  // 保存语言设置
  localStorage.setItem('language', api_params.value.language)
  
  // 配置系统信息
  Object.assign(SYSTEM_INFO, {
    request_headers: request_headers.value,
    domain: api_params.value.domain,
    cpof: init_data.value?.cp?.of || false
  })
}
```

### 11.3 初始化参数结构

```typescript
interface InitParams {
  // 初始化数据
  init_data: {
    cp: {
      of: boolean  // 是否开启加密
    }
  }
  
  // 订单信息
  order_info: {
    country_code: string    // 国家代码
    goods_tag: string       // 商品标签
    goods_name: string      // 商品名称
    currency_symbol: string // 货币符号
    openid: string          // 用户 OpenID
    indulge_auth: number    // 防沉迷认证
    pay_type: string        // 支付类型
    currency: string        // 货币
    source: string          // 来源
    sub_channel_id: string  // 子渠道 ID
    age: number             // 年龄
    env: number             // 环境（1:测试，2:生产）
    return_url: string      // 回调 URL
    ext: object             // 扩展参数
  }
  
  // API 参数
  api_params: {
    country_code: string    // 国家代码
    productid: string       // 产品 ID
    devicecode: string      // 设备码
    cpid: string            // CP ID
    domain: string          // API 域名
    language: string        // 语言
    platformid: string      // 平台 ID
    version: string         // 版本
    channelid: string       // 渠道 ID
    tzoffset: string        // 时区偏移
  }
  
  // 设备信息
  device: {
    tabbarSafeHeight: number  // 底部安全区高度
    naviBarHeight: number     // 导航栏高度
  }
  
  // 请求头
  request_headers: {
    'ruixue-channelid': string
    'ruixue-accesstoken': string
    'ruixue-devicecode': string
    'ruixue-traceid': string
    'ruixue-language': string
    'ruixue-platformid': string
    'ruixue-tzoffset': string
    'ruixue-cpid': string
    'ruixue-version': string
    'ruixue-productid': string
  }
}
```

### 11.4 设置原生标题栏

```typescript
const setTitle = (str: string) => {
  try {
    if (isAndroid.value) {
      window.JsBridge.setTitle(str)
    } else {
      window.webkit.messageHandlers.setTitle.postMessage(str)
    }
  } catch (e) {
    // 降级方案：修改 document.title
    document.title = str
  }
}
```

### 11.5 控制返回按钮

```typescript
const setBackVisible = (bool: boolean) => {
  try {
    if (isAndroid.value) {
      window.JsBridge.setBackVisible(bool)
    }
  } catch (e) {
    // iOS 暂不支持
  }
}
```

### 11.6 支付结果回调

```typescript
// 支付成功
window.location.href = 'ruixue://pay/success'

// 支付失败
window.location.href = 'ruixue://pay/failure'

// 状态异常
window.location.href = 'ruixue://pay/failure?code=4300&msg='
```

---

## 12. 多语言国际化

### 12.1 支持的语言

| 语言代码 | 语言名称 | RTL 支持 |
|----------|----------|----------|
| zh | 简体中文 | 否 |
| tc | 繁体中文 | 否 |
| en | 英语 | 否 |
| ja | 日语 | 否 |
| th | 泰语 | 否 |
| vi | 越南语 | 否 |
| tl | 他加禄语（菲律宾） | 否 |
| id | 印尼语 | 否 |
| ar | 阿拉伯语 | **是** |

### 12.2 多语言实现方式

项目通过 `useParams` Hook 实现多语言，采用计算属性动态获取文案：

```typescript
const payText = computed(() => {
  const languageDict: any = {
    zh: '立即支付',
    tc: '立即支付',
    en: 'Pay now',
    ja: '今すぐ支払う',
    th: 'จ่ายทันที',
    vi: 'Thanh toán',
    tl: 'Bayad na',
    id: 'Bayar sekarang',
    ar: 'ادفع الآن'
  }
  return api_params.value.language 
    ? languageDict[api_params.value.language] 
    : 'Pay now'
})
```

### 12.3 多语言文本列表

```typescript
const langTextDict = computed(() => {
  return {
    payText: payText.value,                           // 立即支付
    selectCardText: selectCardText.value,             // 请先选择支付卡号
    selectCardEditText: selectCardEditText.value,     // 选择信用卡进行编辑
    promptText: promptText.value,                     // 提示
    deleteText: deleteText.value,                     // 删除
    confirmDeleteText: confirmDeleteText.value,       // 是否确认删除
    confirmText: confirmText.value,                   // 确认
    cancelText: cancelText.value,                     // 取消
    useOtherCardText: useOtherCardText.value,         // 使用其他卡号
    confirmUseOtherCardText: confirmUseOtherCardText.value,  // 是否使用下方信息进行支付
    bankCardPayText: bankCardPayText.value,           // 银行卡支付
    recentlyText: recentlyText.value,                 // 最近使用
    cardNumberText: cardNumberText.value,             // 卡号：
    morePayType: morePayType.value,                   // 更多支付方式
    morePayTypePlaceholder: morePayTypePlaceholder.value,  // 请选择支付方式
    saveCardText: saveCardText.value,                 // 允许保存支付信息
    checkoutLoadingText: checkoutLoadingText.value    // checkout sdk 加载中
  }
})
```

### 12.4 RTL 布局支持

针对阿拉伯语等 RTL 语言，需要调整布局方向：

```vue
<template>
  <!-- 设置 dir 属性 -->
  <div :dir="api_params.language === 'ar' ? 'rtl' : ''">
    <!-- 内容 -->
  </div>
  
  <!-- 条件渲染不同布局 -->
  <header v-if="props.language == 'ar'" class="flex justify-between items-center">
    <!-- RTL 布局：关闭按钮在左侧 -->
    <div class="flex items-center">
      <img class="w-[12px] h-[12px] me-[18px]" :src="close" @click="closeDialog" />
      <img class="w-[18px] h-[18px]" :src="setting" @click="handleSetting" />
    </div>
    <span>银行卡支付</span>
  </header>
  
  <header v-else class="flex justify-between items-center">
    <!-- LTR 布局：关闭按钮在右侧 -->
    <span>银行卡支付</span>
    <div class="flex items-center">
      <img class="w-[18px] h-[18px] me-[18px]" :src="setting" @click="handleSetting" />
      <img class="w-[12px] h-[12px]" :src="close" @click="closeDialog" />
    </div>
  </header>
</template>
```

### 12.5 按国家的语言字典

`utils/lang.ts` 提供了按国家代码的语言映射：

```typescript
export const langDict = {
  'CN': { payText: '立即支付', lang: '中国' },
  'US': { payText: 'Pay Now', lang: '美国' },
  'JP': { payText: '即時支払い', lang: '日本' },
  'TH': { payText: 'จ่ายตอนนี้', lang: '泰国' },
  'VN': { payText: 'Thanh toán ngay', lang: '越南' },
  'ID': { payText: 'Bayar Sekarang', lang: '印度尼西亚' },
  'SA': { payText: 'الدفع الفوري', lang: '沙特阿拉伯' },
  // ... 100+ 国家
}
```

---

## 13. 本地缓存策略

### 13.1 缓存管理工具（utils/cache.ts）

```typescript
import { isString } from 'lodash'

// 获取卡片缓存
export const getCardStore = (CARD_KEY: string) => {
  const cards = localStorage.getItem(CARD_KEY)
  if (cards && isString(cards) && JSON.parse(cards) instanceof Object) {
    return JSON.parse(cards)
  }
  return []
}

// 保存卡片到缓存
export const setCardStore = (card: any, CARD_KEY: string) => {
  const cards = getCardStore(CARD_KEY)
  const idx = cards.findIndex((item: any) => item.id == card.id)
  if (!idx) {
    cards.unshift(card)
    localStorage.setItem(CARD_KEY, JSON.stringify(cards))
  }
}

// 从缓存删除卡片
export const removeCardStore = (card: any, CARD_KEY: string) => {
  const cards = getCardStore(CARD_KEY)
  const idx = cards.findIndex((item: any) => item.id == card.id)
  if (idx > -1) {
    cards.splice(idx, 1)
    localStorage.setItem(CARD_KEY, JSON.stringify(cards))
  }
}
```

### 13.2 缓存键说明

| 缓存键 | 类型 | 说明 |
|--------|------|------|
| `version` | string | 应用版本号，用于版本更新时清理缓存 |
| `language` | string | 当前语言设置 |
| `cacheSuccessPayTypes` | string[] | 成功支付过的支付方式 ID 列表 |
| `{pay_token}_{openid}` | Card[] | 已绑定的银行卡信息（未登录场景） |

### 13.3 支付方式排序缓存

```typescript
// 获取缓存的成功支付方式
function getCacheSuccessPayTypes() {
  const cache = localStorage.getItem('cacheSuccessPayTypes')
  return cache ? JSON.parse(cache) : []
}

// 保存成功的支付方式（移到最前面）
function setCacheSuccessPayTypes() {
  const cacheList = getCacheSuccessPayTypes()
  const index = cacheList.indexOf(currentId.value)
  
  if (index > -1) {
    // 已存在，移到最前面
    const item = cacheList.splice(index, 1)[0]
    cacheList.unshift(item)
  } else {
    // 不存在，添加到最前面
    cacheList.unshift(currentId.value)
  }
  
  localStorage.setItem('cacheSuccessPayTypes', JSON.stringify(cacheList))
}

// 根据缓存排序支付方式列表
function moveItemsToFront(arr: any[]) {
  const indices = getCacheSuccessPayTypes()
  const temp: any[] = []
  
  indices.forEach((item: any) => {
    const ids = arr.map(i => i.id)
    const index = ids.indexOf(item)
    if (index > -1) {
      const _item = arr[index]
      arr.splice(index, 1)
      temp.push(_item)
    }
  })
  
  cachePayTypesNum.value = temp.length
  return temp.concat(arr)  // 缓存的排前面，其他的排后面
}
```

### 13.4 版本控制与缓存清理

```typescript
// main.ts
const version = '1.0.1'
const cacheNeedsCleared = true

if (cacheNeedsCleared) {
  const currentVersion = localStorage.getItem('version')
  
  if (currentVersion) {
    // 版本不一致时清空缓存
    if (currentVersion !== version) {
      localStorage.clear()
      localStorage.setItem('version', version)
    }
  } else {
    localStorage.setItem('version', version)
  }
}
```

---

## 14. 支付业务流程

### 14.1 完整支付流程图

```
┌──────────────────────────────────────────────────────────────────────────┐
│                              客户端 App                                   │
│  ┌────────────────────────────────────────────────────────────────────┐  │
│  │  1. 用户点击购买按钮                                                 │  │
│  │  2. 客户端准备初始化参数（订单信息、设备信息、请求头等）                 │  │
│  │  3. 打开 WebView 加载 H5 支付页面                                    │  │
│  │  4. 通过 JsBridge 传递初始化参数                                     │  │
│  └──────────────────────────────────┬─────────────────────────────────┘  │
└─────────────────────────────────────┼────────────────────────────────────┘
                                      ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                           H5 支付页面 - 初始化                             │
│  ┌────────────────────────────────────────────────────────────────────┐  │
│  │  1. 调用 getInitParams() 获取客户端参数                              │  │
│  │  2. 解析 order_info、api_params、device、request_headers            │  │
│  │  3. 配置 SYSTEM_INFO（域名、请求头、加密开关等）                       │  │
│  │  4. 设置原生标题栏 setTitle(goods_name)                              │  │
│  │  5. 加载 Checkout SDK（用于风控）                                    │  │
│  │  6. 调用 getH5PageApi() 获取支付方式列表                             │  │
│  └──────────────────────────────────┬─────────────────────────────────┘  │
└─────────────────────────────────────┼────────────────────────────────────┘
                                      ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                         H5 支付页面 - 支付方式选择                          │
│  ┌────────────────────────────────────────────────────────────────────┐  │
│  │  1. 展示支付金额（货币符号 + 格式化金额）                              │  │
│  │  2. 展示支付方式列表（根据用户历史偏好排序）                            │  │
│  │  3. 用户选择支付方式                                                 │  │
│  │  4. 用户勾选"保存支付信息"选项（可选）                                 │  │
│  │  5. 用户点击"立即支付"按钮                                           │  │
│  └──────────────────────────────────┬─────────────────────────────────┘  │
└─────────────────────────────────────┼────────────────────────────────────┘
                                      ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                          获取支付类型详情                                  │
│  ┌────────────────────────────────────────────────────────────────────┐  │
│  │  调用 getPayTypeApi() 获取：                                         │  │
│  │  - pay_type: 支付类型（checkout/mycard/payermax/utg 等）             │  │
│  │  - pay_token: 支付令牌                                               │  │
│  │  - tag: 标签（card/__NORMAL__ 等）                                   │  │
│  │  - cards: 已绑定的银行卡列表（Checkout 类型）                          │  │
│  │  - ext.checkout_public_key: Checkout 公钥（Checkout 类型）           │  │
│  └──────────────────────────────────┬─────────────────────────────────┘  │
└─────────────────────────────────────┼────────────────────────────────────┘
                                      ▼
                    ┌─────────────────┴─────────────────┐
                    ▼                                   ▼
┌─────────────────────────────────┐  ┌─────────────────────────────────────┐
│   Checkout 类型 && 有绑定卡      │  │          其他情况                    │
│  ┌───────────────────────────┐  │  │  ┌─────────────────────────────┐    │
│  │  弹出银行卡选择弹窗         │  │  │  │  直接进入下单流程            │    │
│  │  - 展示已绑定卡片列表       │  │  │  └──────────────┬──────────────┘    │
│  │  - 用户选择卡片或新卡       │  │  │                 │                   │
│  │  - 支持删除已绑定卡片       │  │  │                 │                   │
│  └─────────────┬─────────────┘  │  └─────────────────┼───────────────────┘
└────────────────┼────────────────┘                    │
                 │                                     │
                 ▼                                     ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                              创建订单                                     │
│  ┌────────────────────────────────────────────────────────────────────┐  │
│  │  调用 orderApi() 创建订单：                                          │  │
│  │                                                                    │  │
│  │  请求参数：                                                          │  │
│  │  - 订单基础信息（goods_tag、goods_name、openid、env 等）              │  │
│  │  - h5_setting_id、h5_platform_id                                   │  │
│  │  - ext.country_code                                                │  │
│  │  - ext.return_url（支付回调 URL）                                    │  │
│  │  - ext.pay_token                                                   │  │
│  │  - ext.save_card（是否保存卡信息）                                   │  │
│  │  - ext.card_id（选择的卡 ID，如有）                                  │  │
│  │  - ext.use_save_card（是否使用已保存的卡）                            │  │
│  │  - ext.deviceSessionId（Checkout 风控 ID）                          │  │
│  │                                                                    │  │
│  │  响应数据：                                                          │  │
│  │  - pay_type: 支付类型                                               │  │
│  │  - ext.url / ext.TransactionUrl / ext.redirectUrl: 支付跳转链接     │  │
│  └──────────────────────────────────┬─────────────────────────────────┘  │
└─────────────────────────────────────┼────────────────────────────────────┘
                                      ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                           跳转第三方支付                                   │
│  ┌────────────────────────────────────────────────────────────────────┐  │
│  │  根据 pay_type 进行不同处理：                                         │  │
│  │                                                                    │  │
│  │  case 'mycard':                                                    │  │
│  │    window.location.href = res.data.ext.TransactionUrl              │  │
│  │                                                                    │  │
│  │  case 'payermax':                                                  │  │
│  │    window.location.href = res.data.ext.redirectUrl                 │  │
│  │                                                                    │  │
│  │  case 'utg':                                                       │  │
│  │    const html = atob(res.data.ext.url)  // Base64 解码              │  │
│  │    document.open()                                                 │  │
│  │    document.write(html)                                            │  │
│  │    document.close()                                                │  │
│  │                                                                    │  │
│  │  default:                                                          │  │
│  │    window.location.href = res.data.ext.url                         │  │
│  └──────────────────────────────────┬─────────────────────────────────┘  │
└─────────────────────────────────────┼────────────────────────────────────┘
                                      ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                          第三方支付页面                                    │
│  ┌────────────────────────────────────────────────────────────────────┐  │
│  │  用户在第三方支付页面完成支付操作                                       │  │
│  │  支付完成后，第三方支付平台回调 return_url                             │  │
│  │  URL 示例：/static/pay/#/result?status=SUCCESS                      │  │
│  └──────────────────────────────────┬─────────────────────────────────┘  │
└─────────────────────────────────────┼────────────────────────────────────┘
                                      ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                            支付结果页                                     │
│  ┌────────────────────────────────────────────────────────────────────┐  │
│  │  根据 URL 参数 status 展示对应状态：                                   │  │
│  │                                                                    │  │
│  │  SUCCESS:                                                          │  │
│  │    - 展示成功图标和文案                                              │  │
│  │    - 设置标题"支付成功"                                              │  │
│  │                                                                    │  │
│  │  FAILED:                                                           │  │
│  │    - 展示失败图标和文案                                              │  │
│  │    - 设置标题"支付失败"                                              │  │
│  │    - 展示失败原因（如有）                                            │  │
│  │                                                                    │  │
│  │  PENDING:                                                          │  │
│  │    - 展示待处理图标和文案                                            │  │
│  │    - 设置标题"支付状态获取失败"                                       │  │
│  │                                                                    │  │
│  │  CLOSED:                                                           │  │
│  │    - 自动返回首页                                                   │  │
│  └──────────────────────────────────┬─────────────────────────────────┘  │
└─────────────────────────────────────┼────────────────────────────────────┘
                                      ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                           回调客户端                                      │
│  ┌────────────────────────────────────────────────────────────────────┐  │
│  │  用户点击"确认"按钮后，通过 URL Scheme 回调客户端：                     │  │
│  │                                                                    │  │
│  │  支付成功: ruixue://pay/success                                     │  │
│  │  支付失败: ruixue://pay/failure                                     │  │
│  │  状态异常: ruixue://pay/failure?code=4300&msg=                       │  │
│  └────────────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────────┘
```

### 14.2 未登录状态支付流程

当用户未登录（无 accesstoken）时，银行卡信息需要通过本地缓存管理：

```
1. 用户选择支付方式，点击支付
2. 调用 /v1/ke/platform_h5/hw/pay_type_unlogin 获取 pay_token
3. 使用 pay_token + openid 作为 key 读取本地缓存的卡列表
4. 如果有卡：弹出卡片选择弹窗
5. 如果使用新卡支付：
   - 生成 client_token（UUID）
   - 在 ext 中传入 client_token
6. 支付完成后：
   - 调用 /v1/ke/platform_h5/hw/query_card_by_client_token
   - 传入下单时的 client_token
   - 获取卡信息后存入本地缓存
```

---

## 15. 样式与适配

### 15.1 移动端适配方案

项目使用 `amfe-flexible` + `postcss-pxtorem` 实现移动端适配：

```javascript
// main.ts
import 'amfe-flexible'

// postcss.config.cjs
module.exports = {
  plugins: {
    'postcss-pxtorem': {
      rootValue: 37.5,  // 设计稿宽度/10
      propList: ['*']
    }
  }
}
```

### 15.2 Tailwind CSS 配置

```javascript
// tailwind.config.js
module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {}
  },
  plugins: []
}
```

### 15.3 安全区域适配

针对 iPhone X 等异形屏设备的安全区域适配：

```typescript
const safeHeight = computed(() => {
  if (isAndroid.value || !isVertical.value) {
    return device.value.tabbarSafeHeight || 0
  }
  return (device.value.naviBarHeight || 0) + (device.value.tabbarSafeHeight || 0)
})

// 应用到底部按钮
<div :style="`padding-bottom: ${safeHeight + 20}px`">
```

### 15.4 横竖屏适配

```typescript
const isVertical = ref(window.orientation !== 90 && window.orientation !== -90)

// 根据方向调整布局
const containerStyle = computed(() => {
  return `padding-bottom: ${safeHeight.value + 84 + 34}px`
})

const itemStyle = computed(() => {
  const colCount = isVertical.value ? 2 : 4
  return `width: ${Math.floor(innerWidth.value / colCount)}px`
})
```

---

## 16. 构建与部署

### 16.1 开发环境

```bash
# 安装依赖
yarn install

# 启动开发服务器
yarn dev
# 服务运行在 http://localhost:666
```

### 16.2 生产构建

```bash
# 构建生产版本
yarn build

# 预览生产构建
yarn preview
```

### 16.3 Vite 配置

```typescript
// vite.config.ts
export default defineConfig(({ command }) => ({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '#': path.resolve(__dirname, 'src/types')
    }
  },
  plugins: [
    vue(),
    AutoImport({
      imports: ['vue', 'vue-router'],
      dts: 'src/types/auto-import.d.ts',
      resolvers: [VantResolver()]
    }),
    Components({
      resolvers: [VantResolver()]
    }),
    legacy({
      targets: ['chrome 52'],  // 兼容 Chrome 52+
      additionalLegacyPolyfills: ['regenerator-runtime/runtime'],
      renderLegacyChunks: true,
      polyfills: [
        'es.symbol',
        'es.promise',
        'es.promise.finally',
        'es/map',
        'es/set',
        // ... 更多 polyfills
      ]
    })
  ],
  base: '/static/pay',  // 部署基础路径
  server: {
    host: '0.0.0.0',
    port: 666,
    proxy: {
      '/v1': {
        target: 'https://os-api-test.ruixueyun.com/',
        changeOrigin: true
      }
    }
  }
}))
```

### 16.4 构建输出

```
dist/
├── index.html
├── assets/
│   ├── index-[hash].js        # 主 JS 文件
│   ├── index-[hash].css       # 主 CSS 文件
│   ├── index-legacy-[hash].js # 兼容版 JS 文件
│   └── [images]               # 图片资源
└── vite.svg
```

### 16.5 GitLab CI/CD

项目配置了 `.gitlab-ci.yml` 用于自动化部署。

---

## 17. 开发指南

### 17.1 添加新的支付方式

1. 在 `handlePay` 函数中添加新的 `pay_type` 处理：

```typescript
switch (res.data.pay_type) {
  case 'new_payment':
    window.location.href = res.data.ext.paymentUrl
    break
  // ... 其他类型
}
```

### 17.2 添加新的语言

1. 在 `useParams.ts` 中的各个文本计算属性中添加新语言：

```typescript
const payText = computed(() => {
  const languageDict: any = {
    // ... 现有语言
    ko: '지금 결제'  // 韩语
  }
  return languageDict[api_params.value.language] || 'Pay now'
})
```

2. 在 `result.vue` 中同样添加对应翻译

### 17.3 调试模式

开发环境可启用 eruda 调试面板：

```typescript
// main.ts
import eruda from 'eruda'
eruda.init()
```

### 17.4 开发环境测试参数

在 `useParams.ts` 中有测试参数模板，开发时可临时使用：

```typescript
const params = JSON.stringify({
  init_data: JSON.stringify({ cp: { of: false } }),
  order_info: JSON.stringify({
    country_code: 'CN',
    goods_tag: '842000099',
    goods_name: '测试商品',
    // ...
  }),
  // ...
})

// 使用测试参数
// initParams.value = JSON.parse(params)
```

---

## 附录

### A. 错误码对照表

| 错误码 | 说明 |
|--------|------|
| 0 | 成功 |
| 1000 | 未知网络错误 |
| 1100 | 网络错误 |
| 1131 | 超时 |
| 1132 | 请求中断 |
| 1401 | 未找到 |
| 1500 | 服务器内部错误 |
| 2000 | 参数错误 |
| 2001 | 初始化参数错误 |
| 2002 | API 不存在 |
| 4000 | 支付参数错误 |
| 4300 | 支付状态获取失败 |
| 302015 | 服务端解密失败 |
| 302016 | 服务端解密失败 |

### B. URL Scheme 协议

| Scheme | 说明 |
|--------|------|
| `ruixue://pay/success` | 支付成功 |
| `ruixue://pay/failure` | 支付失败 |
| `ruixue://pay/failure?code=4300&msg=` | 支付状态异常 |

### C. 支持的支付类型

| pay_type | 说明 | 跳转方式 |
|----------|------|----------|
| checkout | Checkout 支付 | ext.url |
| mycard | MyCard 支付 | ext.TransactionUrl |
| payermax | PayerMax 支付 | ext.redirectUrl |
| utg | UTG 支付 | Base64 解码后写入 document |
| 其他 | 通用跳转 | ext.url |

---

**文档版本记录**

| 版本 | 日期 | 修改说明 |
|------|------|----------|
| 1.0.0 | 2026-01-22 | 初始版本 |
