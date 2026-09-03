# local_repo 三方 AAR 来源与版本追踪

本文件记录 `local_repo/` 下各子模块对应的三方 AAR 来源与官方下载/文档链接，便于版本升级时追踪。

| 模块目录 | 说明 | 来源 / 官方链接 |
| --- | --- | --- |
| adjust_sign | Adjust 签名相关 | 待补充 |
| amap-loc | 高德定位 | [高德开放平台](https://lbs.amap.com/) |
| auth_number_product | 阿里号码认证 | 阿里云 / 阿里移动安全 待补充 |
| berry | 虎牙联运 Berry SDK | 联运包 `berry-1.4.5-698.aar`（GAV `com.huya.sdk:berry:1.4.5-698`）；渠道模块 `channel/rxsdk_huya` |
| bridge-core | 桥接核心库 | 待补充 |
| bridge-library | 桥接库 | 待补充 |
| game-oaid | 游戏 OAID | 待补充 |
| gamesdk | OPPO/近端 游戏 SDK | [OPPO 开放平台](https://open.oppomobile.com/) |
| gamesdk-common | 游戏 SDK 公共库 | 同上 |
| gdt | 腾讯广点通 | [腾讯优量汇](https://e.qq.com/) |
| gsc_android_library | GSC 库 | 待补充 |
| jfsdk | 金服 SDK | 待补充 |
| jfsdk_base | 金服 SDK 基础 | 待补充 |
| jfsdk_core | 金服 SDK 核心 | 待补充 |
| kwaisdk-base | 快手 SDK 基础 | [快手游戏联运 SDK 下载](https://ks-game-docs.kuaishou.com/guide/activity/2.SDKDownload.html#_2-3-1-%E8%81%94%E8%BF%90sdk-%E5%9F%BA%E7%A1%80%E7%89%88%E6%9C%AC) |
| kwai_monitor | 快手监测/归因 MonitorSDK | `monitorsdk-1.0.17.aar`（GAV `com.kwai.monitor:monitorsdk:1.0.17`）；本地包来源 `Android-MonitorSDK-1.0.17` |
| leidian | 雷电模拟器 `ldmnq` | `2.5.34`（官方包；AAR Manifest 为 2.5.22）；无内置支付宝 |
| net-sdk | 九游网游 SDK | 官方包 `九游网游SDK9.8.10.2_7.8.5.0` → `net-sdk-9.8.10.2-260603104630.aar`（GAV `cn.uc.gamesdk:net-sdk:9.8.10.2`）；渠道模块 `channel/rxsdk_9game` |
| push-internal | 推送内部库 | 待补充 |
| qooapp | QooApp | [QooApp](https://www.qoo-app.com/) |
| rxsdk_im | 即时通讯 | 待补充 |
| sdk007 | 007 SDK | 待补充 |
| shlogin | 手机号登录 | 待补充 |
| tencent-dns | 腾讯 HTTPDNS | [腾讯云 HTTPDNS](https://cloud.tencent.com/product/httpdns) |
| ugpsdk-net | 九游支付 SDK | 官方包 `九游网游SDK9.8.10.2_7.8.5.0` → `ugpsdk-net-7.8.5.0-product-release.aar`（GAV `cn.uc.paysdk:ugpsdk-net:7.8.5.0`）；渠道模块 `channel/rxsdk_9game` |
| vivounionsdk | VIVO 联运 SDK | [VIVO 开放平台](https://dev.vivo.com.cn/) |
| yofunlibrary | 悠米库 | 待补充 |

## 使用说明

- 新增 AAR 时请在本表增加一行并尽量填写「来源/官方链接」。
- 升级某模块 AAR 时，可先到对应链接查看 release notes 与兼容性说明。
- 可与 `scripts/check_vendor_versions.py` 及 CI 依赖报告配合，定期检查可升级版本。
- 发布前建议执行 `./scripts/validate_local_repo.sh` 做模块与配置校验；查看所有模块 GAV 用 `./scripts/list_local_repo.sh`。
