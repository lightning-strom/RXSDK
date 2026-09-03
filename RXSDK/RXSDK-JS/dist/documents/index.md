# 瑞雪 Javascript SDK 接入指南

[[toc]]

## 1. SDK 下载地址

开发版相比正式版仅多了一些控制台日志

| 名称 | 正式版 | 开发版 | 变更日志 |
| --- | --- | --- | --- |
| 微信小游戏 | [v2.7.6](https://res.weileapp.com/file/wegame/?version=2) | [v2.7.6](https://res.weileapp.com/file/wegame/?version=2&dev=1) | [CHANGELOG](./CHANGELOG.html) |

## 2. 说明

### 2.1 支持平台

| 名称 | 标识 | 说明 |
| --- | --- | --- |
| 微信小游戏 | wegame | - |

### 2.2 方法调用参数 `callbacks`

无特殊说明外, `callbacks` 都为以下结构

| 名称 | 说明 | 类型 | 可选 | 可选值 | 默认值 |
| --- | --- | --- | --- | --- | --- |
| complete | 执行后的回调方法 | function({code, msg, data}) | 否 | - | - |

### 2.3 回调返回值

无特殊说明外, 回调(`complete`)都会返回下面的数据

| 名称 | 说明 | 类型 | 可能为空 | 可选值 |
| --- | --- | --- | --- | --- |
| code | 0 为成功, 其他为失败(1000000 为 SDK 未知错误码) | number | 否 | - |
| msg | 结果消息 | string | 否 | - |

## 3. 接入流程

> PLATFORM 替换成对应平台标识(2.1 支持平台)

### 3.1 初始化参数说明

| 名称 | 说明 | 类型 | 可选 | 可选值 | 默认值 |
| --- | --- | --- | --- | --- | --- |
| appId | 瑞雪提供的唯一标识 | string | 否 | - | - |
| httpApi | 瑞雪提供的 `API` 地址 | string | 否 | - |
| channelAppId | 三方渠道(如爱奇艺)的 `APPID` | string | 是 | - |

### 3.2 项目中引入

```typescript
import SDK from 'path/to/channel-sdk.PLATFORM.umd.js'

const sdk = new SDK({
    appId: 'xxxxxx',
    httpApi: 'https://xxx.com',
    channelAppId: 'xxxx',
})
// => See this in your browser console: ChannelSDK Launched
```

### 3.3 通过 `<script>` 引入

```html
<!-- 引入 SDK -->
<script type="text/javascript" src="js/channel-sdk.PLATFORM.umd.js"></script>

<!-- 初始化SDK -->
<script>
window.SDK = new channelSDK({
    appId: 'xxxxxx',
    httpApi: 'https://xxx.com',
    channelAppId: 'xxxx',
})
// => See this in your browser console: ChannelSDK Launched
</script>
```

### 3.4 关于 `.dev` 文件

> 该文件为开发对接时使用版本, 与正式版本区别:
>
> 1. 在控制台输出 SDK 自身的一些日志
> 2. 米大师支付默认为沙箱环境, 详见 8.2.1.1

## 4. 登录

登录并获取用户信息

### 4.1 接口原型

```typescript
public async login (callbacks, params)
```

### 4.2 参数说明

#### 4.2.1 params

| 名称 | 说明 | 类型 | 可选 | 可选值 | 默认值 |
| --- | --- | --- | --- | --- | --- |
| version | 登录方式, 为 `normal` 时会弹出授权确认 | string | 是 | base/normal(仅微信小游戏) | base |
| desc | 声明获取用户个人信息后的用途，不超过30个字符 | string | 是 | - | 用于获取用户昵称和头像 |

### 4.3 回调返回值

| 名称 | 说明 | 类型 | 可能为空 | 可选值 |
| --- | --- | --- | --- | --- |
| token | 登录 token | string | 否 | - |
| openid | 瑞雪 openid | string | 否 | - |
| username | 用户名 | string | 否 | - |
| nickname | 昵称 | string | 否 | - |
| avtarUrl | 头像 | string | 否 | - |
| wechatAvatarUrl | 微信头像 | string | 否 | - |
| sex | 性别 | number | 否 | 0(女)/1(男) |
| timestamp | 登录时间戳 | number | 否 | - |
| ext | 其他数据 | object | 否 | - |
| ext.switchIgf | 是否开启支付 | boolean | 否 | - |
| ext.switchIgfLevel | 开启支付最低等级 | number | 否 | - |
| ext.switchIgfMaxLevel | 开启支付最高等级 | number | 否 | - |

### 4.4 示例

```typescript
sdk.login({
  complete: (data: IResponseLogin) => {
    console.log(data)
  },
})
```

## 5. 分享(2.0)

调用分享。通过参数中的 `method` 控制，传入 `method` 后，分享行为以 `method` 为准。不传入的时候走后台埋点调度(普通分享达到配置次数后会转为定向分享)。

1. 好友/群分享, SDK 会自动拉起好友列表(method === 2, 默认行为)
2. 指定分享需要游戏自行绘制好友列表并显示(method === 8)

### 5.1 接口原型

```typescript
public async share (callbacks, params)
```

### 5.2 参数说明

#### 5.2.1 params

| 名称 | 说明 | 类型 | 可选 | 可选值 | 默认值 |
| --- | --- | --- | --- | --- | --- |
| func | 管理后台配置的埋点名称 | string | 否 | - | - |
| method | 分享方法, 小游戏仅支持2、8 | number | 是 | 1(朋友圈) / 2(群、好友消息) / 8(指定好友) | 2 |
| query | 拼接到分享 url 的参数(foo=bar&count=1) | string | 是 | - | - |
| transmitargs | 透传参数, 原样返回 | string | 是 | - | - |
| custom | 自定义参数, 统计用 | string | 是 | - | - |
| title | 自定义分享标题, 覆盖后台埋点标题 | string | 是 | - | - |
| imageUrl | 自定义分享图片, 覆盖后台埋点图片 | string | 是 | - | - |

### 5.3 回调返回值

#### 5.3.1 普通分享

| 名称 | 说明 | 类型 | 可能为空 | 可选值 |
| --- | --- | --- | --- | --- |
| data | 埋点及分享次数等相关信息 | object | 否 | - |
| data.share_limit | 埋点次数信息 | object | 否 | - |
| data.share_limit.funcs_num | 该埋点该用户累计拉取数据总次数 | number | 否 | - |
| data.share_limit.funcs_sn | 该埋点该用户累计成功总次数(正常分享) | number | 否 | - |
| data.share_limit.funcs_fn | 该埋点该用户累计失败总次数(正常分享) | number | 否 | - |
| data.share_limit.funcs_stf_sn | 埋点指定好友成功次数(指定分享) | number | 否 | - |
| data.share_limit.funcs_stf_fn | 埋点指定好友失败次数(指定分享)(取消分享看有上报就记录) | number | 否 | - |
| data.share_limit.funcs_ad_sn | 埋点广告成功次数 | number | 否 | - |
| data.share_limit.funcs_ad_fn | 埋点广告失败次数 | number | 否 | - |
| data.share_limit.funcs_day_num | 该埋点该用户当天累计拉取数据总次数 | number | 否 | - |
| data.share_limit.funcs_day_sn | 该埋点该用户当天累计成功总次数(正常分享) | number | 否 | - |
| data.share_limit.funcs_day_fn | 该埋点该用户当天累计失败次数(正常分享) | number | 否 | - |
| data.share_limit.funcs_stf_day_sn | 埋点该用户当天指定好友成功次数(指定分享) | number | 否 | - |
| data.share_limit.funcs_stf_day_fn | 埋点该用户当天指定好友失败次数(指定分享)(取消分享看有上报就记录) | number | 否 | - |
| data.share_limit.funcs_ad_day_sn | 埋点该用户当天广告成功次数 | number | 否 | - |
| data.share_limit.funcs_ad_day_fn | 埋点该用户当天广告失败次数 | number | 否 | - |
| data.share_limit.share_day_num | 该用户所有埋点当天总拉取分享次数 | number | 否 | - |
| data.share_limit.share_day_sn | 该用户所有埋点当天总分享成功次数(正常分享) | number | 否 | - |
| data.share_limit.share_day_fn | 该用户所有埋点当天总分享失败次数(正常分享) | number | 否 | - |
| data.share_limit.stf_day_sn | 该用户当天指定分享好友成功总次数(指定分享) | number | 否 | - |
| data.share_limit.stf_day_fn | 该用户当天指定分享好友失败总次数(指定分享)(取消分享看有上报就记录) | number | 否 | - |
| data.share_limit.ad_day_sn | 用户当天看广告成功次数 | number | 否 | - |
| data.share_limit.ad_day_fn | 用户当天看广告失败次数(关闭广告或者其他错误) | number | 否 | - |
| data.share_limit.active_day_sn | 该用户所有活动埋点的当天成功次数 | number | 否 | - |
| data.share_limit.share_num | 该用户所有埋点总拉取分享次数 | number | 否 | - |
| data.share_limit.share_sn | 该用户所有埋点总分享成功次数(正常分享) | number | 否 | - |
| data.share_limit.share_fn | 该用户所有埋点总分享失败次数(正常分享) | number | 否 | - |
| data.share_limit.stf_sn | 该用户总的指定分享好友成功总次数(指定分享) | number | 否 | - |
| data.share_limit.stf_fn | 该用户所有埋点当天总拉取分享次数(指定分享)(取消分享看有上报就记录) | number | 否 | - |
| data.share_limit.ad_sn | 该用户总的看广告成功次数 | number | 否 | - |
| data.share_limit.ad_fn | 该用户总的看广告失败次数 | number | 否 | - |
| data.share_limit.fission_num | 用户总共拉新人数 | number | 否 | - |
| data.funcs | 埋点信息 | object | 否 | - |
| data.funcs.id | 埋点 ID | number | 否 | - |
| data.funcs.appid | 埋点所属应用 ID | string | 否 | - |
| data.funcs.funcTag | 埋点标识 | string | 否 | - |
| data.funcs.funcTitle | 埋点标题 | string | 否 | - |
| data.funcs.shareType | 埋点配置的分享类型 | number | 否 | 1(正常)/2(定向)/3(调度) |
| data.funcs.active | 是否活动埋点 | number | 否 | 1(活动)/2(非活动) |
| data.funcs.rejectMsg | 拒绝信息 | string | 否 | - |
| data.funcs.status | 状态 | number | 否 | 1 |
| data.funcs.ctime | 创建时间 | string | 否 | - |
| data.share_content | 埋点内容 | object | 否 | - |
| data.share_content.title | 分享标题 | string | 否 | - |
| data.share_content.url | 分享地址 | string | 否 | - |
| data.share_content.wxid | 内容 WXID | string | 否 | - |
| data.share_content.domain | 内容域名 | string | 否 | - |
| data.share_content.material | 分享素材类型 | string | 否 | url/image/card/a2m(app分享到小游戏)/text |
| data.share_content.materialid | 分享素材 ID | number | 否 | - |
| data.share_content.image | 素材图标或图片地址 | string | 否 | - |
| data.share_content.content | 分享内容 | string | 否 | - |
| data.share_content.gh_id | material a2m使用 | string | 否 | - |
| data.share_content.active | 是否活动埋点 | number | 否 | 1(活动)/2(非活动) |
| data.transmitargs | 透传参数 | string | 否 | - |
| data.custom | 自定义参数 | string | 否 | - |
| data.share_type | 分享方式(普通/指定分享) | string | 否 | normal/stf |

#### 5.3.2 指定分享(method === 8, 仅微信)

除以上数据外, 有以下额外数据

| 名称 | 说明 | 类型 | 可能为空 | 可选值 |
| --- | --- | --- | --- | --- |
| method | 分享方法 | number | 否 | 8 |

### 5.4 示例

```typescript
// ====== 普通分享 ======
sdk.share({
  complete: (data) => {
    console.log(data)
  },
}, {
  func: 'sign',
  method: 2, // 可不传
  transmitargs: 'demo',
  custom: 'demo-custom',
  query: 'foo=bar&do=1'
})
// 成功示例 => {"code":0,"msg":"ok","data":{"share_limit":{"funcs_num":0,...}...}}
// 失败示例 => {"code":5000005,"msg":"分享至不同好友或群即可领取奖励, 请重新分析!","data":{"share_limit":{"funcs_num":0,...}...}}

// ===== 指定分享 ======
sdk.share({
  complete: (data) => {
    console.log(data)
  },
}, {
  func: 'sign',
  forcemethod: 8, // 此处为8
  transmitargs: 'demo',
  custom: 'demo-custom',
})
// 成功示例 => {"code":0,"msg":"ok","method":8,"data":{"share_limit":{"funcs_num":0,...}...}}
// 失败示例 => 同普通分享
```

## 6. 获取埋点信息

### 6.1 接口原型

```typescript
public async getShareLimit (callbacks, params)
```

### 6.2 参数说明

#### 6.2.1 params

| 名称 | 说明 | 类型 | 可选 | 可选值 | 默认值 |
| --- | --- | --- | --- | --- | --- |
| func_tags | 管理后台配置的埋点名称 | string[] | 是 | - | - |

### 6.3 回调返回值

| 名称 | 说明 | 类型 | 可能为空 | 可选值 |
| --- | --- | --- | --- | --- |
| funcs | 各埋点信息, `key`为参数`func_tags`的值 | object | 否 | - |
| funcs[key] | 具体埋点信息 | object | 否 | - |
| funcs[key].funcs_num | 该埋点该用户累计拉取数据总次数 | number | 否 | - |
| funcs[key].funcs_sn | 该埋点该用户累计成功总次数(正常分享) | number | 否 | - |
| funcs[key].funcs_fn | 该埋点该用户累计失败总次数(正常分享) | number | 否 | - |
| funcs[key].funcs_stf_sn | 埋点指定好友成功次数(指定分享) | number | 否 | - |
| funcs[key].funcs_stf_fn | 埋点指定好友失败次数(指定分享)(取消分享看有上报就记录) | number | 否 | - |
| funcs[key].funcs_ad_sn | 埋点广告成功次数 | number | 否 | - |
| funcs[key].funcs_ad_fn | 埋点广告失败次数 | number | 否 | - |
| funcs[key].funcs_day_num | 该埋点该用户当天累计拉取数据总次数 | number | 否 | - |
| funcs[key].funcs_day_sn | 该埋点该用户当天累计成功总次数(正常分享) | number | 否 | - |
| funcs[key].funcs_day_fn | 该埋点该用户当天累计失败次数(正常分享) | number | 否 | - |
| funcs[key].funcs_stf_day_sn | 埋点该用户当天指定好友成功次数(指定分享) | number | 否 | - |
| funcs[key].funcs_stf_day_fn | 埋点该用户当天指定好友失败次数(指定分享)(取消分享看有上报就记录) | number | 否 | - |
| funcs[key].funcs_ad_day_sn | 埋点该用户当天广告成功次数 | number | 否 | - |
| funcs[key].funcs_ad_day_fn | 埋点该用户当天广告失败次数 | number | 否 | - |
| ---------分割线---------- | 以上参数同分享返回参数 `data.share_limit` 的部分参数 | - | - | - |
| limit | 所有埋点总次数, 当天次数 | object | 否 | - |
| limit.share_day_num | 该用户所有埋点当天总拉取分享次数 | number | 否 | - |
| limit.share_day_sn | 该用户所有埋点当天总分享成功次数(正常分享) | number | 否 | - |
| limit.share_day_fn | 该用户所有埋点当天总分享失败次数(正常分享) | number | 否 | - |
| limit.stf_day_sn | 该用户当天指定分享好友成功总次数(指定分享) | number | 否 | - |
| limit.stf_day_fn | 该用户当天指定分享好友失败总次数(指定分享)(取消分享看有上报就记录) | number | 否 | - |
| limit.ad_day_sn | 用户当天看广告成功次数 | number | 否 | - |
| limit.ad_day_fn | 用户当天看广告失败次数(关闭广告或者其他错误) | number | 否 | - |
| limit.active_day_sn | 该用户所有活动埋点的当天成功次数 | number | 否 | - |
| limit.share_num | 该用户所有埋点总拉取分享次数 | number | 否 | - |
| limit.share_sn | 该用户所有埋点总分享成功次数(正常分享) | number | 否 | - |
| limit.share_fn | 该用户所有埋点总分享失败次数(正常分享) | number | 否 | - |
| limit.stf_sn | 该用户总的指定分享好友成功总次数(指定分享) | number | 否 | - |
| limit.stf_fn | 该用户所有埋点当天总拉取分享次数(指定分享)(取消分享看有上报就记录) | number | 否 | - |
| limit.ad_sn | 该用户总的看广告成功次数 | number | 否 | - |
| limit.ad_fn | 该用户总的看广告失败次数 | number | 否 | - |
| limit.fission_num | 用户总共拉新人数 | number | 否 | - |
| ---------分割线---------- | 以上参数同分享返回参数 `data.share_limit` 的其余参数 | - | - | - |
| limit.dispatch_share_num | 调度用累计总次数, 普通分享转为指定分享次数, 拉新后清零 | number | 否 | - |
| limit.reject_num | 用户普通分享连续失败次数 | number | 否 | - |

### 6.4 示例

```typescript
sdk.getShareLimit({
  complete: (data) => {
    if (data.code === 0) {
      console.log(data)
    }
  }
}, {
  func_tags: ['shareBuyStep', 'test'],
})
// 返回示例
{
  code: 0,
  msg: 'ok',
  data: {
    funcs: {
      shareBuyStep: {
        funcs_num: 0,
        // ...其余数据
      },
      test: {
        funcs_num: 0,
        // ...其余数据
      },
    },
    limit: {
      share_day_num: 0,
      // ...其余数据
    },
  }
}
```

## 7. 获取分享数据

### 7.1 接口原型

```typescript
public async getShareData (callbacks, params)
```

### 7.2 参数说明

#### 7.2.1 params

与分享 `share` 方法相同

### 7.3 回调返回值

与分享 `share` 普通分享结果相同

### 7.4 示例

参考 `share` 示例

## 8. 支付

下单并拉起支付

### 8.1 接口原型

```typescript
public async pay (callbacks, params)
```

### 8.2 参数说明

#### 8.2.1 params

| 名称 | 说明 | 类型 | 可选 | 可选值 | 默认值 |
| --- | --- | --- | --- | --- | --- |
| goodsTag | 瑞雪配置的商品 tag | string | 否 | - | - |
| goodsName | 商品名称 | string | 否 | - | - |
| tradeNo | 游戏订单号 | string | 否 | - | - |
| amount | 金额/分 | number | 否 | - | - |
| type | 支付方式 | string | 是 | wechath5(H5微信支付)/minigame(米大师)/weile(微乐客户端)/ios_minigame(iOS动态调度)/qq/wxpub(微信公众号)/jxzx(小程序吉祥臻选) | 见具体渠道 |
| transmitArgs | 透传参数, 为字符串时需要为 `JSON` 字符串 | string/object | 是 | - | - |
| land | 游戏方向 | number | 是 | 0(竖屏)/1(横屏) | - |
| is_debug | 是否调试 | number | 是 | 0/1 | 0 |
| ext | 其他, 详见具体渠道 | object | - | - | - |
| ext[ext.payChannel] | 支付渠道 | number | 是 | 0(钻石支付)/1(微信)/2(支付宝)/3(iap支付)/4(微信公众号) | - |
| ext.order_level | 支付等级, 与策划定义的IOS小程序支付不同等级走不同的小程序支付 | number/string | 是 | - | - |

##### 8.2.1.1 微信小游戏

| 名称 | 说明 | 类型 | 可选 | 可选值 | 默认值 |
| --- | --- | --- | --- | --- | --- |
| envVersion | 小程序支付时打开的小程序版本 | string | 是 | develop(开发)/trial(体验)/release(正式) | 0 |
| env | 米大师支付环境 | number | 是 | 0/1 | 开发版 SDK 为1, 正式版 SDK 为 0 |
| type | - | - | - | - | iOS: ios_minigame/安卓: minigame |

##### 8.2.1.2 微乐客户端

| 名称 | 说明 | 类型 | 可选 | 可选值 | 默认值 |
| --- | --- | --- | --- | --- | --- |
| autoExchange | 自动兑换钻石 | boolean | 是 | - | - |
| ext[ext.feeType] | 支付方式 | number | 是 | 0(钻石)/1(人民币) | - |
| type | - | - | - | - | weile |

##### 8.2.1.3 QQ

| 名称 | 说明 | 类型 | 可选 | 可选值 | 默认值 |
| --- | --- | --- | --- | --- | --- |
| ext.zone_id | 游戏服务器大区 ID | string | 否 | - | - |
| type | - | - | - | - | iOS: wxpub/安卓: minigame |

##### 8.2.1.4 美团

| 名称 | 说明 | 类型 | 可选 | 可选值 | 默认值 |
| --- | --- | --- | --- | --- | --- |
| goodsDesc | 商品描述 | string | 否 | - | - |
| goodsUrl | 商品图片 | string | 否 | - | - |

### 8.3 回调返回值

> **此处成功回调仅代表拉起支付成功, 实际支付结果请从服务端确认**

### 8.4 示例

```typescript
sdk.pay({
  complete: (data: any) => {
    console.log(data)
  },
}, {
  goodsTag: 'zs10',
  goodsName: '测试商品',
  tradeNo: 'demo',
  transmitArgs: 'demo',
  amount: 100, // 1元

  // *** QQ 小游戏时必须传 ***
  ext: {
    zone_id: '1', // 游戏服务器大区 ID
  },
})
// => {"code": 0}
```

## 9 获取用户信息

### 9.1 接口原型

```typescript
public getUserInfo ()
```

### 9.2 参数说明

无

### 9.3 返回值

与登录(login)返回结果相同

### 9.4 示例

```typescript
const userInfo = sdk.getUserInfo()
```

## 10 广告

### 10.1 辅助方法

以下辅助方法参数都为广告类型, 可选值为 `rewarded`(激励视频, 默认), `banner`(横幅), `interstitial`(插屏)

| 名称 | 说明 | 示例 |
| --- | --- | --- |
| hasAd | 检测是否有可用广告 | `sdk.hasAd()` / `sdk.hasAd('banner')` |
| getAd | 获取广告实例, **请不要用 `desctory` 方法销毁广告实例** | `sdk.getAd()` / `sdk.getAd('banner')` |

### 10.2 激励视频广告

#### 10.2.1 接口原型

```typescript
public async rewardedVideoAd (callbacks, params)
```

#### 10.2.2 参数说明

| 名称 | 说明 | 类型 | 可选 | 可选值 | 默认值 |
| --- | --- | --- | --- | --- | --- |
| func | 瑞雪配置的埋点名称 | string | 否 | - | - |
| transmitargs | 透传参数 | string | 是 | - | - |
| custom | 自定义参数 | string | 是 | - | - |
| adUnitId | 微信小游戏广告ID | string | 微信小游戏必传 | - | - |
| isCheck | 首次检测用户是否有可用广告, 之后请使用 `hasAd` | boolean | 是 | - | - |

#### 10.2.3 返回值

| 名称 | 说明 | 类型 | 可能为空 | 可选值 |
| --- | --- | --- | --- | --- |
| isEnded | 是否看完 | boolean | 否 | - |
| ad_days_limit | 控制类广告埋点每日可看广告总数, 0 代表不限制 | number | 否 | - |
| share_days_limit | 控制类分享埋点每日可分享总数, 0 代表不限制 | number | 否 | - |
| use_controller_ad | 控制类广告埋点用户当天已看广告数, 0 代表不限制 | number | 否 | - |
| use_controller_share | 控制类分享埋点用户当天已分享数, 0 代表不限制 | number | 否 | - |
| transmitargs | 透传参数 | string | 是 | - |

此处会原样返回小游戏的 `code`, 释义及解决方案见[小游戏视频广告错误码](https://developers.weixin.qq.com/miniprogram/dev/api/ad/RewardedVideoAd.onError.html)

#### 10.2.4 示例

```typescript
sdk.rewardedVideoAd({
  complete: (data) => {
    console.log(data)
  },
}, {
  func: 'sign',
  transmitargs: 'demo',
  custom: 'demo-custom',
  adUnitId: 'adunit-c337136xxx',
})
// => {"code":0,"msg":"ok","transmitargs":"demo","isEnded":true}
```

### 10.3 横幅广告

#### 10.3.1 接口原型

```typescript
public async bannerAd (callbacks, params)
```

#### 10.3.2 参数说明

| 名称 | 说明 | 类型 | 可选 | 可选值 | 默认值 |
| --- | --- | --- | --- | --- | --- |
| - | 同视频激励广告 | - | - | - | - |
| adIntervals | 广告显示时间 | number | 是 | - | - |
| style | 广告样式 | object | 否 | - | - |
| style.left | 广告左上角坐标 | number | 否 | - | - |
| style.top | 广告左上角坐标 | number | 否 | - | - |
| style.width | 广告宽度 | number | 否 | - | - |
| style.height | 广告高度 | number | 否 | - | - |

#### 10.3.3 返回值

| 名称 | 说明 | 类型 | 可能为空 | 可选值 |
| --- | --- | --- | --- | --- |
| ad | 广告实例 | object | 否 | - |

#### 10.3.4 示例

```typescript
sdk.bannerAd({
  complete: (data) => {
    console.log(data)
  },
}, {
  adUnitId: 'adunit-c337136xxx',
  style: {
    left: 0,
    top: 0,
    width: 375,
    height: 100,
  },
  adIntervals: 30,
})
// => {"code":0,"msg":"ok","ad":XXX}
```

### 10.4 插屏广告

#### 10.4.1 接口原型

```typescript
public async interstitialAd (callbacks, params)
```

#### 10.4.2 参数说明

| 名称 | 说明 | 类型 | 可选 | 可选值 | 默认值 |
| --- | --- | --- | --- | --- | --- |
| - | 同视频激励广告 | - | - | - | - |

#### 10.4.3 返回值

| 名称 | 说明 | 类型 | 可能为空 | 可选值 |
| --- | --- | --- | --- | --- |
| ad | 广告实例 | object | 否 | - |

#### 10.4.4 示例

```typescript
sdk.interstitialAd({
  complete: (data) => {
    console.log(data)
  },
}, {
  adUnitId: 'adunit-c337136xxx',
})
// => {"code":0,"msg":"ok","ad":XXX}
```

## 11. 校验公众号及小游戏授权(红包)

检测用户是否关注公众号、公众号授权及小游戏强制授权过

### 11.1 接口原型

```typescript
public async checkAuthorization  (callbacks)
```

### 11.2 参数说明

无

### 11.3 返回值

| 名称 | 说明 | 类型 | 可能为空 | 可选值 |
| --- | --- | --- | --- | --- |
| data | 返回数据 | object | 否 | - |
| data.code | 授权结果`code` | number | 否 | 0(授权且关注)/6000011(小游戏未授权)/6000012(已关注未授权)/6000013(未关注) |

当 `code` 为 `6000011` 时需要强制授权登录一次，`6000012` 及 `6000013` 时 SDK 会跳转到公众号关注界面，游戏继续显示操作按钮即可

### 11.4 示例

```typescript
sdk.checkAuthorization({
  complete: (data) => {
    if (data.code === 0) {
      console.log('授权正常')
      // 正常操作...
      return
    }
    if (data.code === 6000011) {
      sdk.login({
        complete: () => {
          // 登录后可重新检测
        }
      }, { version: 'normal' })
    }
  }
})
```

## 12. 打开 WEB 客服

通过客服会话打开 web 客服

### 12.1 接口原型

```typescript
public async openCustomerService  (callbacks)
```

### 12.2 参数说明

无

### 12.3 返回值

无

### 12.4 示例

```typescript
sdk.openCustomerService({
  complete: (data) => {
    if (data.code === 0) {
      console.log('调用正常')
      // 正常操作...
      return
    }
  }
})
```

## 13. 脏词检测

检测文本是否含有脏词

### 13.1 接口原型

```typescript
public async checkMsgSecurity(callbacks, params)
```

### 13.2 参数说明

| 名称 | 说明 | 类型 | 可选 | 可选值 | 默认值 |
| --- | --- | --- | --- | --- | --- |
| content | 检测字符串 | string | 否 | - | - |

### 13.3 返回值

| 名称 | 说明 | 类型 | 可能为空 | 可选值 |
| --- | --- | --- | --- | --- |
| first_sensitive | 检测出的第一个敏感词(不能作为是否有脏词的依据, 请使用 `code !== 0`) | string | 是 | - |

### 13.4 示例

```typescript
sdk.checkMsgSecurity({
  complete: console.log,
}, {
  content: '***',
})
// => {"code":8000001,"msg":"risky content rid: 6006bdcf-08193f0b","first_sentive":""}
```

## 14. 关闭游戏接口

关闭退出当前游戏(不是所有渠道都支持)

### 14.1 接口原型

```typescript
public async closeGame(callbacks, params)
```

### 14.2 参数说明

无

### 14.3 返回值

无

### 14.4 示例

```typescript
sdk.closeGame({
  complete: (data: any) => {
    console.log(data)
  }
})
```

## 15. 角色上传

特殊渠道需要上传角色信息

### 15.1 接口原型

```typescript
public async roleLogin(callbacks, params)
```

### 15.2 参数说明

| 名称 | 说明 | 类型 | 可选 | 可选值 | 默认值 |
| --- | --- | --- | --- | --- | --- |
| id | 用户 ID | string/number | 否 | - | - |
| nickname | 昵称 | string | 否 | - | - |
| sex | 性别 | number | 是 | 0/1 | - |
| isNew | 是否新用户 | number | 是 | 0/1 | - |
| level | 等级 | number | 是 | - | - |
| isVip | 是否 VIP | number | 是 | 0/1 | - |
| vipLevel | VIP 等级 | number | 是 | - | - |
| type | 游戏类型 | string | 是 | - | 休闲 |
| power | 综合能力, 如战斗力 | string/number | 是 | - | 0 |
| money | 钻石或金币等数量 | number | 是 | - | - |
| act | 动作 | number | 是 | 1(创建)/2(登录) | - |
| serverId | 所在大区(服务器) | string/number | 是 | - | 0 |
| serverName | 所在大区(服务器)名称 | string | 是 | - | '' |

### 15.3 返回值

无

### 15.4 示例

```typescript
sdk.roleLogin({
  complete: (data: any) => {
    console.log(data)
  },
  {
    id: 123,
    level: 1,
    nickname: '测试',
    serverId: 123,
    serverName: '大区',
    act: 1,
    power: 100,
  }
})
```

## 错误码定义

| 错误码 | 错误消息 | 说明 |
| --- | --- | --- |
| 1000000 | 系统错误 | 服务器系统错误及 SDK 默认错误 |
| 1000001 | 接口未找到 | - |
| 1000002 | 请求超时 | - |
| 1000003 | 未授权 | - |
| 1000004 | 参数错误 | - |
| 2000001 | 短信验证码发送失败 | - |
| 2000002 | 响应消息解码失败 | - |
| 2000003 | 短信验证码校验失败 | - |
| 3000001 | 用户已存在 | - |
| 3000002 | 用户注册失败 | - |
| 3000003 | 用户不存在 | - |
| 3000004 | 用户密码错误 | - |
| 3000005 | 用户封停 | - |
| 3000006 | 三方渠道不支持 | - |
| 3000007 | 三方验证失败 | - |
| 3000008 | 三方验证失败（小米会话错误，客户端收到此错误码时引导玩家重新授权） | - |
| 3000009 | 三方用户注册失败 | - |
| 4000001 | 支付验证错误 | - |
| 4000002 | 商品数据错误 | - |
| 4000003 | 订单处理失败 | - |
| 4000004 | 服务下单失败 | - |
| 4000005 | 订单保存失败 | - |
| 4000006 | 支付方式错误 | - |
| 4000007 | 订单获取失败（订单不存在） | - |
| 4000008 | 订单已经完成，重复请求 | - |
| 4000009 | 订单校验失败 | - |
| 4000010 | 订单更新失败，重复请求 | - |
| 5000001 | 功能点无效 | - |
| 5000002 | 没有分享内容 | - |
| 5000003 | 验证错误 | - |
| 5000004 | 分享失败 | - |
| 5000005 | 分享失败 | - |
| 5000006 | 用户主动关闭广告 | - |
| 5000007 | 没有获取可用广告 | - |
| 5000008 | 分享类型错误 | - |
| 5000010 | 用户信息错误 | - |
| 5000011 | 功能点已经停用 | - |
| 5000012 | 用户信息获取失败 | - |
| 5000013 | 该奖励的次数已达本日限额 | - |
