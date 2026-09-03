# RuiXue.MiniGame.DouYin

抖音小游戏 支持sdk，集成瑞雪js sdk 给其他模块提供 WebGL  实现。 因为暂时抖音官方 WebGL 环境 js 接口支持不完全，部分接口实现需要直接依赖 C# 的StarkSDK。

## 包信息

| 项 | 内容 |
|----|------|
| UPM 名称 | `com.ruixue.unitysdk.minigame.douyin` |
| 依赖 | `com.ruixue.unitysdk.base` @ `1.6.17`<br>`com.ruixue.unitysdk.share` @ `1.6.17`<br>`com.ruixue.unitysdk.pay` @ `1.6.17` |

## 安装

1. 在 Unity 工程 **Packages/manifest.json** 中配置瑞雪 Scoped Registry（见仓库根目录 README）。
2. 在 `dependencies` 中加入（版本号与项目统一）：

```json
"com.ruixue.unitysdk.minigame.douyin": "x.y.z"
```

3. 若依赖中包含其它 `com.ruixue.*` 包，**版本号需与 `com.ruixue.unitysdk.base` 保持一致**。

## 使用说明

- 先完成 **RuiXue.Base**（`com.ruixue.unitysdk.base`）初始化，再调用本模块 API（除非本包文档另有说明）。
- 详细接入与平台差异以**瑞雪内部接口文档**为准；本 README 仅作仓库导航。

## 示例（Samples）

- **RuiXueMiniGameDouYinAllApiDemo**：示例工程（`Samples~/AllApiDemo`）

## 相关文件

- 变更记录：同目录下 `CHANGELOG.md`（若有）
- 仓库总览：[`README.md`](../../README.md)
