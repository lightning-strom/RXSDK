# RuiXue.MiniGame.WeiXin

微信小游戏支持 sdk，集成瑞雪js sdk 给其他模块提供 WebGL  实现。

## 包信息

| 项 | 内容 |
|----|------|
| UPM 名称 | `com.ruixue.unitysdk.minigame.weixin` |
| 依赖 | `com.ruixue.unitysdk.base` @ `1.6.17` |

## 安装

1. 在 Unity 工程 **Packages/manifest.json** 中配置瑞雪 Scoped Registry（见仓库根目录 README）。
2. 在 `dependencies` 中加入（版本号与项目统一）：

```json
"com.ruixue.unitysdk.minigame.weixin": "x.y.z"
```

3. 若依赖中包含其它 `com.ruixue.*` 包，**版本号需与 `com.ruixue.unitysdk.base` 保持一致**。

## 使用说明

- 先完成 **RuiXue.Base**（`com.ruixue.unitysdk.base`）初始化，再调用本模块 API（除非本包文档另有说明）。
- 详细接入与平台差异以**瑞雪内部接口文档**为准；本 README 仅作仓库导航。

## 示例（Samples）

- **AllInOneDemo**：包含所有瑞雪 js sdk 接口的示例 demo（`Samples~/AllApiDemo`）

## GDT / IAA 上报

微信小游戏 JSSDK 4.0.2 支持以下 Unity API：

```csharp
RXMiniGameWeiXin.LoadFinish();
RXMiniGameWeiXin.Subscribe();
RXMiniGameWeiXin.TutorialStart();
RXMiniGameWeiXin.ReportGdt("QUEST", new Dictionary<string, object>
{
    ["outer_action_id"] = "quest-1001"
});

RXMiniGameWeiXin.ReportCreateRole("role-id");
RXMiniGameWeiXin.ReportUpdateLevel(new Dictionary<string, dynamic> { ["level"] = 10 });
RXMiniGameWeiXin.ReportTutorialFinish();
RXMiniGameWeiXin.ReportViewContent("Mall");
```

收藏和右上角分享监听不会自动注册，CP 需在 SDK 初始化成功回调中显式调用：

```csharp
RXMiniGameWeiXin.RegisterGdtMenuEventListeners();
```

支付由 JSSDK 4.0.2
查询缓存订单并自动补报，不要调用已废弃的 `ReportPurchase`，以免重复上报。

直玩广告接口 `GetDirectAdStatusSync`、`OnDirectAdStatusChange` 仅属于本 WebGL
微信小游戏包，不属于移动端 `com.ruixue.unitysdk.gdt`。

## 相关文件

- 变更记录：同目录下 `CHANGELOG.md`（若有）
- 仓库总览：[`README.md`](../../README.md)
