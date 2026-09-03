<span style="color:#ff0000; background-color:#f8f8f8;">微信小游戏 SDK 4.0.2 以上支持。</span>

官方文档：[广点通](https://doc.weixin.qq.com/doc/w3_ANYALQY-AEkzz9MDrwwS7KEbhTij7?scode=AJEAIQdfAAo2w8EWjLABgASwbKACc)

## 功能模块

- 基础转化事件：本文档。
- IAA 行为事件：《微信小游戏 IAA 接入》。
- 激励直玩：《微信小游戏激励直玩接入》。

:::warning
使用 sdk 回传必须先进行 [配置窗口期参数](https://doc.ruixueyun.com/main/#/view?path=ef3e1aa5-35ab-4604-bc88-3718090925ee) <br>

在微信后台配置安全域名:https://api.datanexus.qq.com 一定要在小游戏发布前配置好，避免缓存原
因导致安全域名不能及时生效,影响数据上报。
:::
:::tip
1. 瑞雪sdk使用腾讯广告小游戏SDK进行上报使用自动采集，[自动采集行为说明](https://doc.weixin.qq.com/doc/w3_ANYALQY-AEkzz9MDrwwS7KEbhTij7?scode=AJEAIQdfAAo2w8EWjLABgASwbKACc)
3. 小游戏启动、注册、沉默唤起等非自动采集行为瑞雪sdk会自动上报无需cp上报
4. 创角、游戏等级提升、收藏小游戏、分享小游戏、支付完成、浏览商城、浏览活动、完成新手引导等非自动采集行为需cp方自行上报
5. 瑞雪sdk v3.9.54版本以上使用腾讯广告小游戏SDK进行上报需要额外引入tencent-sdk.js文件，tencent-sdk.js 在网盘目录中，用法实例如下
```javascript
// 1、将tencent-sdk.js 放入打包后的游戏根目录下
// 2、在游戏引擎打包好后的game.js中顶部引用tencent-sdk.js

// 打包后的game.js

import { SDK } from './tencent-sdk'

// 是否打开调试模式, 建议仅在调试期间开启
SDK.setDebug(true)

wx.TencentSDK = SDK
```

![](https://haiqi-ruixue-test.oss-cn-beijing.aliyuncs.com/docOnline/20241225-182817-1735122587986.jpg)
 :::

:::tip
文档中列举的是基础必报事件，其余场景必报事件可参考官方文档。
官方文档中的 sdk.track 可调用 `sdk.reportGdt` 进行上报，[广点通通用上报方法](https://doc.ruixueyun.com/main/#/view?viewPath=6044c196-dcb3-4ee4-af0f-ce147a50b009&title=%E5%B9%BF%E7%82%B9%E9%80%9A%E9%80%9A%E7%94%A8%E4%B8%8A%E6%8A%A5%E6%96%B9%E6%B3%95&tab=&index=1)

腾讯广告-IAA微信小游戏采集行为列表：[IAA](https://doc.weixin.qq.com/doc/w3_AE8AdwaBACcCNQJfr07c0QriMRK01?scode=AJEAIQdfAAoeQ1iW1EAQAA_gboAOA)

腾讯营销-小游戏激励直玩能力文档：[激励直玩](https://docs.qq.com/doc/DUG9ScmRYRkxXa3hu?nlc=1)

:::

## 完成加载(LOAD_FINISH)
:::tip
loading页面完成，进入游戏第一帧上报。
:::

```javascript
sdk.reportGdt('LOAD_FINISH',{})
```

## 接入创建角色

**调用示例**

```javascript
sdk.reportCreateRole('role_id_xxxx')
```


## 接入游戏等级提升

**调用示例**

```javascript
sdk.reportUpdateLevel({
    attr1: 'xxx',
    attr2: 'xxx',
    attr3: 'xxx',
})
```

## 收藏上报广点通

:::tip
在用户收藏小游戏的时候上报，操作为点击右上角三个点拉起弹层
<span style='color:red'>必须在初始化成功后调用。</span><br>

:::

**调用示例**

```javascript
sdk = new Sdk(
		{
			productId: 'test',
			channelId: 'test',
			cpid: '114',
            baseUrlList: ['https://cn-api-test.ruixuecloud.com'],
			complete: (data) => {
			    // 右上角三个点
                wx.onAddToFavorites(() => {
                  sdk.reportAddToFavorites('default')
                })
            }
        }
)
```

## 分享上报广点通

:::tip
在用户分享小游戏的时候上报，
<span style='color:red'>仅右上角三个点分享（包括转发给朋友、分享到朋友圈），其他分享方式无需上报。必须在初始化成功后调用。</span>
:::

**调用示例**

```javascript
sdk = new Sdk(
		{
			productId: 'test',
			channelId: 'test',
			cpid: '114',
            baseUrlList: ['https://cn-api-test.ruixuecloud.com'],
			complete: (data) => {
			    // 右上角三个点分享，type参数值：转发给朋友（APP_MESSAGE）/分享到朋友圈（TIME_LINE）
                wx.onShareAppMessage(() => {
                  sdk.reportShareAppMessage('APP_MESSAGE')
                })
    
                wx.onShareTimeline(() => {
                  sdk.reportShareAppMessage('TIME_LINE')
                })
            }
        }
)
```

## 订阅(SUBSCRIBE)

:::tip
玩家完成订阅操作，勾选订阅协议并点击确认），系统返回订阅成功结果时上报。
:::

```javascript
sdk.reportGdt('SUBSCRIBE',{})
```

## 支付上报广点通（废弃）

:::tip
- <span style='color:red'> **v3.10.13** </span>以后版本瑞雪内部缓存**公众号支付**订单，在从客服支付界面返回游戏后查询缓存订单状态自动上报广点通，或者在用户支付完成后未返回游戏的情况下，在下次登录游戏后查询缓存订单及订单状态进行补报，无需游戏端额外处理 **公众号支付**发货后上报广点通
<br/>
- **注意:** 
  1) <span style='color:red'> **sdk.reportPurchase**</span>调用会报错，升级到<span style='color:red'>**v3.10.13** </span>以上版本的游戏需要去掉原来在用户使用**公众号支付**发货后上报广点通的代码

   2) <span style='color:red'>**v3.10.13** </span> 以前版本在用户公众号支付发货后仍需调用<span style='color:red'>**sdk.reportPurchase**</span>上报广点通
:::

**调用示例**

```javascript
sdk._reportPurchase(600) // 金额（分）
```


## 浏览（商城/活动）上报广点通

:::tip
在用户完成浏览后上报。
:::

**调用示例**

```javascript
sdk.reportViewContent('Mall') // Mall: 浏览商城 Activity: 浏览活动
```

## 新手引导开始(TUTORIAL_START)

:::tip
玩家首次进入游戏后，触发游戏第 1 关新手引导流程时上报。为规范数据统计口径，本事件中的 “新手引导”唯一对应游戏第 1 关，即所有新手引导流程（含功能讲解、操作教学、玩法演示等）均内嵌于第 1 关，不单独设置 “第 0 关” 作为新手引导场景。

:::

```javascript
sdk.reportGdt('TUTORIAL_START',{})
```

## 完成新手指引(TUTORIAL_FINISH)


:::tip
在用户完成游戏新手指引教程或者完成教程关卡后上报 TUTORIAL_FINISH 行为。
:::

**调用示例**

```javascript
sdk.reportTutorialFinish()
```


## 广点通通用上报方法

| **参数**          | **参数类型** | **是否必传** | **描述**                                                                      |
|-----------------| ------------ |----------|-----------------------------------------------------------------------------|
| **action_type**   | string       | 是        | 行为名称, [查看行为枚举值](https://datanexus.qq.com/doc/develop/guider/interface/enum#action-type)。    |
| **action_param**   | object| 否        |为用户行为事件添加自定义属性，类型：Object。    |

**调用示例**


:::tip
1. 行为参数 action_param 是【Key-Value】类型；Key只可以为String类型，只能包含字母、数字和下划线，必须以字母开头，长度不能超过255；Value可以是String/Number/Boolean/Object其中一种，当Value为Object时，它的元素只能为String/Number/Boolean中的一种。
2. action_param参数中支持传一个自定义行为ID，参考key为【outer_action_id】，仅付费行为担心重复上报才需要传此参数，值建议用订单id。
:::

```javascript
sdk.reportGdt('QUEST',{
    outer_action_id: "pay_20240804_789",
    product_id: 101,
    amount: 9.9
})
```
