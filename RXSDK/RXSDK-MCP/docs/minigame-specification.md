# 瑞雪 SDK 小游戏接入规范

> 更新日期：2026-04-02
> 版本：v1.0.0

## 概述

本文档定义微信小游戏/QQ 小游戏/H5 小游戏接入瑞雪 SDK 的详细规范，包含 MCP 工具使用指南和 API 接口说明。

## 系统要求

- **微信开发者工具**: 最新稳定版
- **基础库版本**: 2.0.0+
- **Node.js**: 6.0+（构建环境）

## 1. 安装 SDK

### 构建产物引入

将 SDK 构建产物（`dist/lib/channel-sdk.js`）复制到小游戏项目目录中。

```javascript
import RxSdk from './lib/channel-sdk'
```

### 构建自定义版本

```bash
cd RXSDK-JS
npm install
npm run build          # 微信小游戏
npm run build:h5       # H5 版本
```

## 2. SDK 初始化

```javascript
const sdk = new RxSdk({
    productId: 'your_product_id',    // 必填：应用 ID
    channelId: 'your_channel_id',    // 必填：渠道 ID
    cpid: 'your_cpid',              // 必填：CP 唯一 ID
    baseUrlList: [                   // 必填：域名列表
        'https://api1.ruixueyun.com'
    ]
})
```

## 3. 登录

```javascript
sdk.login({}, {
    complete(res) {
        if (res.code === 0) {
            console.log('登录成功', res.data)
            // res.data.token  - JWT Token
            // res.data.openid - 用户 OpenID
            // res.data.tid    - 用户 TID
        } else {
            console.error('登录失败', res.code, res.msg)
        }
    }
})
```

## 4. 支付

```javascript
sdk.pay({
    amount: 100,                    // 金额（分）
    product_name: '100钻石',
    product_desc: '游戏虚拟道具',
    cp_order_id: 'CP202401010001', // CP 订单号（唯一）
}, {
    complete(res) {
        if (res.code === 0) {
            console.log('支付成功')
        }
    }
})
```

## 5. 分享

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

## 6. 数据埋点

```javascript
sdk.track({
    event: '#custom_event',
    properties: {
        level: 10,
        score: 9999
    }
}, {
    complete(res) {}
})
```

## 7. 广告

### 激励视频

```javascript
sdk.showRewardedVideoAd({
    adUnitId: 'adunit-xxxxxxxxxx',
}, {
    complete(res) {
        if (res.code === 0) {
            // 发放奖励
        }
    }
})
```

### Banner 广告

```javascript
sdk.showBannerAd({
    adUnitId: 'adunit-xxxxxxxxxx',
    style: { left: 0, top: 0, width: 300 }
}, { complete(res) {} })

sdk.hideBannerAd()
sdk.destroyBannerAd()
```

## 8. 用户通行证

### 获取指定用户信息

```javascript
sdk.getUserInfoByField({
  user: ['openid', 'nickname', 'avatar', 'real_auth_name'],
  login: ['login_time', 'method'],
  current: ['ip', 'os'],
  aas: ['limit', 'aas']
}, { complete(res) { /* res.data */ } })

// 获取用户实名信息 + 用户绑定的登录方式信息
sdk.getUserInfoByField({
  user: ['real_auth_id', 'real_auth_name', 'real_auth_id_card', 'real_auth_time', 'age', 'sex'],
  account: ['method']
}, { complete(res) { /* res.data.user / res.data.account */ } })

// 仅查询用户绑定信息 / 绑定的登录方式
// 注意：“用户绑定的登录方式信息 / 查询用户绑定信息” 对应 account 当前应用下全部登录凭证列表字段。
sdk.getUserInfoByField({
  account: ['method']
}, { complete(res) { /* res.data.account */ } })
```

### 修改用户信息

```javascript
sdk.updateInfo({ nickname: '新昵称' }, { complete(res) {} })
```

### 账号绑定

```javascript
// 发送验证码
sdk.sendCaptcha({ phone: '13800138000', purpose: 'bindphone' }, { complete(res) {} })

// 绑定手机
sdk.bindPhone({ phone: '13800138000', captcha: '123456' }, { complete(res) {} })

// 绑定邮箱
sdk.bindEmail({ email: 'user@example.com', captcha: '123456' }, { complete(res) {} })
```

### 账号注销

```javascript
sdk.deregister({}, { complete(res) {} })
sdk.deregisterCancel({ complete(res) {} })
```

## 9. 其他功能

| 功能 | 方法 | 说明 |
|------|------|------|
| 游戏区服 | `getGameArea`, `createGameArea`, `putGameArea`, `delGameArea` | 区服 CRUD |
| 游戏角色 | `createGameCharacter`, `putGameCharacter`, `getGameCharacter` | 角色 CRUD |
| 反馈 | `createFeedback`, `getFeedbackList`, `getFeedbackDetail` | 意见反馈 |
| LBS | `reportLocation`, `deleteReportLocation`, `getNearlyPeasonByRadius` | 定位 |
| 公告 | `getAnnouncement`, `getTempNotice` | 公告系统 |
| 邮件 | `getEmailList`, `getEmailDetail`, `receiveEmail`, `delEmail` | 邮件系统 |
| 达人福利 | `getPromoDisplayKEY`, `exchangePromoCDKEY` | 福利码 |
| 版本检查 | `checkAppVersion`, `checkGameVersion`, `checkActivityVersion` | 版本更新 |
| 设备信息 | `setSubChannelId`, `getIp` | 子渠道、IP |

## API 回调规范

所有 API 采用统一的 callback 模式：

```javascript
sdk.methodName(params, {
    complete(res) {
        // res.code === 0 表示成功
        // res.msg  - 错误信息
        // res.data - 成功数据
        // res.thirdcode - 第三方错误码（如微信）
        // res.thirdmsg  - 第三方错误信息
    }
})
```

## 渠道列表

| 入口文件 | 渠道 |
|----------|------|
| `index.wegame.ts` | 微信小游戏 |
| `index.qq.ts` | QQ 小游戏 |
| `index.huawei.ts` | 华为快游戏 |
| `index.douyin.ts` | 抖音小游戏 |
| `index.taobao.ts` | 淘宝小游戏 |
| `index.h5_*.ts` | 各 H5 渠道 |
