# 微信小游戏 IAA 接入

## 模块定位

IAA 模块用于上报广告变现游戏中的业务行为。

接入前必须先完成《微信小游戏广点通基础接入》。

本文不包含激励直玩状态，激励直玩请参考《微信小游戏激励直玩接入》。

## 行为定义

行为名称和触发时机以
[腾讯广告 IAA 微信小游戏采集行为列表](https://doc.weixin.qq.com/doc/w3_AE8AdwaBACcCNQJfr07c0QriMRK01?scode=AJEAIQdfAAoeQ1iW1EAQAA_gboAOA)
为准。

不要自行创建未定义的行为名称，也不要将同一行为通过多个接口重复上报。

## 上报接口

```javascript
sdk.reportGdt(actionType, actionParam)
```

- `actionType`：腾讯广告行为名称。
- `actionParam`：行为附加参数，可传空对象。

## 调用示例

```javascript
// 示例行为名仅用于演示，实际名称以腾讯广告 IAA 行为列表为准
sdk.reportGdt('QUEST', {
  outer_action_id: 'quest-1001',
  quest_id: 'chapter-1-10',
  success: true,
})
```

## 参数规则

- Key 必须以字母开头。
- Key 只能包含字母、数字和下划线。
- Key 最长 255 个字符。
- Value 支持 String、Number、Boolean 或 Object。
- Object 内的值只能是 String、Number 或 Boolean。
- 需要防重的事件可传 `outer_action_id`，建议使用业务唯一 ID。

## 上报时机

1. 仅在业务行为实际完成后上报。
2. 不要在循环定时器、帧更新或页面刷新时无条件调用。
3. 付费、奖励等需要防重的行为必须使用稳定的 `outer_action_id`。
4. 同一行为不要同时调用基础事件接口和 `reportGdt`。

## 验证

1. 在微信开发者工具中触发目标行为。
2. 检查控制台 GDT 上报日志。
3. 使用真机再次触发事件。
4. 在腾讯广告后台确认行为名称和参数正确到达。
