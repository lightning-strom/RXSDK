# 微信小游戏激励直玩接入

## 模块定位

激励直玩模块用于识别用户是否通过腾讯广告直玩场景进入游戏，以及当前是否处于广告蒙层。

接入前必须先完成《微信小游戏广点通基础接入》。

IAA 自定义行为上报请参考《微信小游戏 IAA 接入》。

其他直玩配置参考
[腾讯营销小游戏激励直玩能力文档](https://docs.qq.com/doc/DUG9ScmRYRkxXa3hu?nlc=1)。

## 支持条件

| 平台 | 微信基础库最低版本 |
| --- | --- |
| iOS | 3.15.0 |
| Android | 3.11.2 |

低于上述版本的用户不会填充直玩广告，无需 CP 额外兼容。

## 状态字段

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `isInDirectGameAd` | `boolean` | 当前是否处于直玩广告场景 |
| `isInMask` | `boolean` | 当前是否处于广告蒙层 |
| `isEndByAbnormal` | `boolean` | 直玩流程是否异常结束，仅状态变化回调有效 |

常见状态组合：

| 状态 | 含义 |
| --- | --- |
| `isInDirectGameAd=true`、`isInMask=true` | 正在直玩广告中，蒙层尚未戳破 |
| `isInDirectGameAd=true`、`isInMask=false` | 正在直玩广告中，蒙层已戳破 |
| 三个字段均为 `false` | 倒计时结束，用户选择继续游戏 |
| `isInDirectGameAd=false`、`isInMask=false`、`isEndByAbnormal=true` | 直玩流程异常结束 |

## 获取初始状态

```javascript
const status = sdk.getDirectAdStatusSync()
if (status) {
  const { isInDirectGameAd, isInMask } = status
  console.log('是否处于直玩广告:', isInDirectGameAd)
  console.log('是否处于广告蒙层:', isInMask)
}
```

普通用户或微信基础库不支持该能力时，接口可能返回 `undefined`。

## 监听状态变化

```javascript
sdk.onDirectAdStatusChange((status) => {
  const {
    isInDirectGameAd,
    isInMask,
    isEndByAbnormal,
  } = status
  console.log('是否处于直玩广告:', isInDirectGameAd)
  console.log('是否处于广告蒙层:', isInMask)
  console.log('是否异常结束:', isEndByAbnormal)
})
```

## SDK 自动处理

瑞雪 JSSDK 4.0.2 会在初始化成功后自动：

1. 获取初始直玩状态。
2. 监听后续状态变化。
3. 上报 `direct_ad` 状态事件。
4. 在蒙层期间缓存需要延迟的 GDT 事件。
5. 蒙层结束或用户继续游戏后发送缓存事件。

CP 不需要手动上报 `direct_ad`，只需在游戏玩法需要适配蒙层时读取或监听状态。

## 推荐接入流程

1. 正常初始化瑞雪 SDK。
2. 初始化成功后读取一次 `getDirectAdStatusSync`。
3. 注册一次 `onDirectAdStatusChange`。
4. `isInMask=true` 时暂停不应在蒙层中触发的游戏交互。
5. `isInMask=false` 时恢复交互。
6. 不要自行缓存或重复补报瑞雪 SDK 已管理的 GDT 事件。

## 验证

1. 使用满足基础库要求的微信版本。
2. 分别验证普通启动和腾讯广告直玩入口。
3. 检查蒙层未戳破、蒙层戳破、继续游戏和异常结束四类状态。
4. 确认状态变化不会导致业务重复注册或重复上报。
5. 在腾讯广告后台确认 `direct_ad` 状态事件到达。
