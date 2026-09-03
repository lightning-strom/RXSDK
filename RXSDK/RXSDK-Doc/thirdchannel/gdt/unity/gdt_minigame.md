# Unity 微信小游戏广点通接入

## 一、接入说明

本文包含三个独立功能模块：

1. 基础转化事件：加载完成、创角、升级、订阅、教程、浏览、收藏、分享和支付。
2. IAA 行为事件：通过通用接口上报腾讯广告定义的 IAA 行为。
3. 激励直玩：获取和监听直玩广告蒙层状态。

### 支持版本

| 项目 | 版本 |
| --- | --- |
| 微信小游戏 UPM 包 | `com.ruixue.unitysdk.minigame.weixin` `1.6.38` |
| 瑞雪 Unity 基础包 | `com.ruixue.unitysdk.base` `1.6.38` |
| 微信小游戏 JSSDK | `4.0.2` |
| Unity 版本 | Unity 2022.3 及以上 |

### 安装 Unity 包

在 `Packages/manifest.json` 中加入：

```json
{
  "dependencies": {
    "com.ruixue.unitysdk.base": "1.6.38",
    "com.ruixue.unitysdk.minigame.weixin": "1.6.38"
  }
}
```

同一 Unity 工程中的 `com.ruixue.unitysdk.*` 包版本应保持一致。

### 发布前配置

1. 配置腾讯广告归因窗口期。
2. 在微信后台添加安全域名 `https://api.datanexus.qq.com`。
3. 使用微信 Unity 转换插件导出 WebGL 小游戏。

瑞雪 Unity 插件会在导出时注入 `tencent-sdk.js` 并设置 `wx.TencentSDK`。

## 二、基础转化事件

### 收藏和右上角分享

收藏和右上角分享监听不会自动注册。CP 应在瑞雪 SDK 初始化成功回调中显式调用：

```csharp
using System.Collections.Generic;
using RuiXue.MiniGame.WeiXin;

private void OnInitSuccess(string data)
{
    RXMiniGameWeiXin.RegisterGdtMenuEventListeners();
}
```

该接口会注册：

- 收藏小游戏：`onAddToFavorites`
- 右上角转发给朋友：`onShareAppMessage`
- 右上角分享到朋友圈：`onShareTimeline`

重复调用不会重复注册。

### 基础事件上报

```csharp
// loading 页面完成并进入游戏第一帧时上报
RXMiniGameWeiXin.LoadFinish();

// 创建游戏角色成功后上报，参数为角色 ID
RXMiniGameWeiXin.ReportCreateRole("role-id");

// 游戏角色等级提升后上报
RXMiniGameWeiXin.ReportUpdateLevel(
    new Dictionary<string, dynamic> { ["level"] = 10 });

// 玩家完成订阅操作后上报
RXMiniGameWeiXin.Subscribe();

// 玩家首次进入第 1 关的新手引导时上报
RXMiniGameWeiXin.TutorialStart();

// 玩家完成新手引导后上报
RXMiniGameWeiXin.ReportTutorialFinish();

// 玩家完成商城或活动浏览后上报；可选值为 Mall、Activity
RXMiniGameWeiXin.ReportViewContent("Mall");
```

### 支付上报

JSSDK 4.0.2 会自动查询公众号支付缓存订单并补报，禁止调用已废弃的
`ReportPurchase`，避免重复上报。

## 三、IAA 行为事件

IAA 模块用于上报广告变现游戏中的业务行为。行为名称和触发时机以
[腾讯广告 IAA 微信小游戏采集行为列表](https://doc.weixin.qq.com/doc/w3_AE8AdwaBACcCNQJfr07c0QriMRK01?scode=AJEAIQdfAAoeQ1iW1EAQAA_gboAOA)
为准。

### 上报接口

```csharp
public static void ReportGdt(
    string actionType,
    Dictionary<string, object> actionParam = null);
```

- `actionType`：腾讯广告行为名称。
- `actionParam`：行为附加参数，可为空。

### 调用示例

```csharp
using System.Collections.Generic;
using RuiXue.MiniGame.WeiXin;

// 示例行为名仅用于演示，实际名称以腾讯广告 IAA 行为列表为准
RXMiniGameWeiXin.ReportGdt(
    "QUEST",
    new Dictionary<string, object>
    {
        ["outer_action_id"] = "quest-1001",
        ["quest_id"] = "chapter-1-10",
        ["success"] = true
    });
```

### 参数规则

- Key 必须以字母开头。
- Key 只能包含字母、数字和下划线。
- Key 最长 255 个字符。
- Value 支持 String、Number、Boolean 或 Object。
- Object 内的值只能是 String、Number 或 Boolean。
- 需要防重的事件可传 `outer_action_id`，建议使用业务唯一 ID。

### 上报时机

1. 仅在业务行为实际完成后上报。
2. 同一行为不要同时通过基础事件接口和 `ReportGdt` 重复上报。
3. 需要防重的付费或奖励事件必须提供稳定的 `outer_action_id`。
4. 不要在 Update、循环定时器或页面刷新时无条件上报。

## 四、激励直玩

激励直玩用于识别用户是否通过腾讯广告直玩场景进入游戏，以及当前是否处于广告蒙层。

其他直玩配置参考
[腾讯营销小游戏激励直玩能力文档](https://docs.qq.com/doc/DUG9ScmRYRkxXa3hu?nlc=1)。

### 支持条件

| 平台 | 微信基础库最低版本 |
| --- | --- |
| iOS | 3.15.0 |
| Android | 3.11.2 |

低于上述版本的用户不会填充直玩广告，无需 CP 额外兼容。

### 状态字段

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `isInDirectGameAd` | `bool` | 当前是否处于直玩广告场景 |
| `isInMask` | `bool` | 当前是否处于广告蒙层 |
| `isEndByAbnormal` | `bool` | 直玩流程是否异常结束，仅状态变化回调有效 |

常见状态组合：

| 状态 | 含义 |
| --- | --- |
| `isInDirectGameAd=true`、`isInMask=true` | 正在直玩广告中，蒙层尚未戳破 |
| `isInDirectGameAd=true`、`isInMask=false` | 正在直玩广告中，蒙层已戳破 |
| 三个字段均为 `false` | 倒计时结束，用户选择继续游戏 |
| `isInDirectGameAd=false`、`isInMask=false`、`isEndByAbnormal=true` | 直玩流程异常结束 |

### 获取初始状态

在瑞雪 SDK 初始化成功后调用：

```csharp
var status = RXMiniGameWeiXin.GetDirectAdStatusSync();
if (status != null)
{
    Debug.Log($"是否处于直玩广告：{status.isInDirectGameAd}");
    Debug.Log($"是否处于广告蒙层：{status.isInMask}");
}
```

普通用户或微信基础库不支持该能力时，接口可能返回 `null`。

### 监听状态变化

```csharp
RXMiniGameWeiXin.OnDirectAdStatusChange(status =>
{
    Debug.Log($"是否处于直玩广告：{status.isInDirectGameAd}");
    Debug.Log($"是否处于广告蒙层：{status.isInMask}");
    Debug.Log($"是否异常结束：{status.isEndByAbnormal}");

    if (!status.isInMask)
    {
        // 蒙层结束后恢复对应的游戏交互
    }
});
```

监听应只注册一次，避免业务回调被重复执行。

### SDK 自动处理

瑞雪 JSSDK 4.0.2 会在初始化成功后自动：

1. 获取初始直玩状态。
2. 监听后续状态变化。
3. 上报 `direct_ad` 状态事件。
4. 在蒙层期间缓存需要延迟的 GDT 事件。
5. 蒙层结束或用户继续游戏后发送缓存事件。

CP 不需要手动上报 `direct_ad`，只需在游戏玩法需要适配蒙层时读取或监听状态。

### 推荐接入流程

1. 正常初始化瑞雪 SDK。
2. 初始化成功后读取一次 `GetDirectAdStatusSync`。
3. 注册一次 `OnDirectAdStatusChange`。
4. `isInMask=true` 时暂停不应在蒙层中触发的游戏交互。
5. `isInMask=false` 时恢复交互。
6. 不要自行缓存或重复补报瑞雪 SDK 已管理的 GDT 事件。

## 五、接入验证

1. 检查导出目录是否包含 `tencent-sdk.js`。
2. 检查 `game.js` 是否已导入瑞雪微信小游戏 Bridge。
3. 确认微信后台已配置 `https://api.datanexus.qq.com`。
4. 分别触发基础转化事件和 IAA 行为事件。
5. 检查普通启动和腾讯广告直玩入口。
6. 验证蒙层未戳破、蒙层戳破、继续游戏和异常结束四类状态。
7. 使用微信开发者工具和真机分别验证。
8. 检查小游戏控制台日志，并在腾讯广告后台确认事件到达。
