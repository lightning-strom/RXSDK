# 瑞雪 SDK 小游戏快速接入指南

## 概述

本文档介绍如何快速接入瑞雪 SDK 小游戏版本。详细 API 说明请参考 [小游戏接入规范](minigame-specification.md)。

## MCP 工具

使用 MCP 工具 `minigame` 时，需传入 `feature` 参数指定功能模块：

| feature | 功能描述 |
|---------|---------|
| `init` | 生成 SDK 初始化代码 |
| `login` | 登录代码 |
| `payment` | 支付代码 |
| `share` | 分享代码 |
| `ad` | 广告代码 |
| `tracking` | 数据埋点代码 |

---

## 快速接入流程

### 第一步：获取 SDK

将 RXSDK-JS 构建产物引入小游戏项目：

```bash
cd RXSDK-JS
npm install
npm run build
# 产物在 dist/ 目录
```

将 `dist/lib/` 目录复制到小游戏项目中。

### 第二步：初始化 SDK

在入口文件（如 `game.js`）中：

```javascript
import RxSdk from './lib/channel-sdk'

const sdk = new RxSdk({
    productId: 'your_product_id',
    channelId: 'your_channel_id',
    cpid: 'your_cpid',
    baseUrlList: ['https://api1.ruixueyun.com']
})
```

### 第三步：登录

```javascript
sdk.login({}, {
    complete(res) {
        if (res.code === 0) {
            console.log('登录成功', res.data.token)
            // 登录成功后可进行支付等操作
        }
    }
})
```

### 第四步：支付

```javascript
sdk.pay({
    amount: 100,
    product_name: '100钻石',
    product_desc: '游戏虚拟道具',
    cp_order_id: 'ORDER_' + Date.now(),
}, {
    complete(res) {
        if (res.code === 0) {
            console.log('支付成功')
        }
    }
})
```

### 第五步：分享

```javascript
sdk.share({
    share_type: 1,
    func: 'shareAppMessage',
    autoReport: true,
}, {
    complete(res) {
        if (res.code === 0) {
            console.log('分享成功')
        }
    }
})
```

---

## 微信后台配置

在微信公众平台完成以下配置：

1. **服务器域名**：添加瑞雪 API 域名到 request 合法域名
2. **业务域名**：如需 H5 页面，添加对应域名
3. **广告位**：在微信流量主后台创建广告位

---

## 支持的渠道

| 渠道 | 入口文件 | 构建命令 |
|------|----------|----------|
| 微信小游戏 | `index.wegame.ts` | `npm run build` |
| QQ 小游戏 | `index.qq.ts` | `npm run build` |
| 抖音小游戏 | `index.douyin.ts` | `npm run build` |
| H5（通用） | `index.h5_*.ts` | `npm run build:h5` |

---

## 常见问题

### Q: SDK 初始化失败？
A: 检查 `baseUrlList` 中的域名是否已添加到微信后台的 request 合法域名列表。

### Q: 支付回调没有触发？
A: 确认已正确配置微信支付商户信息，且 `cp_order_id` 全局唯一。

### Q: 分享图片不显示？
A: 分享图片需为 HTTPS 链接，尺寸推荐 5:4 比例。
