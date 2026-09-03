# Unity UWA SDK 更新说明

- 更新日期：2026-08-11
- UWA 资源包：`UWA_GPM2.0_for_Unity_v1.5.3.5(0806-170253).unitypackage`
- Unity 包：`RXSDK-Unity/Packages/com.ruixue.unitysdk.uwa`
- 瑞雪 UPM 版本：保持 `4.0.3`

## 更新结果

本次从 UnityPackage 解包并更新了 UWA GPM 原厂 SDK，主要包含：

- 更新 `UWAGPM.cs`、`UWAGPM_Launcher.cs` 和 Editor 构建处理代码。
- 更新 Android `armeabi-v7a`、`arm64-v8a` 原生库。
- 更新 iOS `libuwa_gpm.a`。
- 新增 iOS `UwaGpmUnityShotGlue.h/.mm`。
- 引入 WebGL 静态库。
- 引入 Windows x86、x86_64 动态库。
- 新增 UWA 原厂 `LICENSE.md`。
- 未引入 OpenHarmony 资源，保持原瑞雪 UWA 包的平台策略。

## 保留的瑞雪适配

更新原厂 SDK 时，以下瑞雪文件不能被覆盖：

- `package.json`
- `README.md`
- `CHANGELOG.md`
- `Runtime/RuiXue.UWA.asmdef`
- `Runtime/RuiXueUWAGPM.cs`
- `Runtime/UWAGPM_EAPI.cs`
- `Runtime/IPerformReport.cs`
- `Runtime/PerformManceReport.cs`
- `Runtime/Impl/`
- `Runtime/link.xml`
- `Plugins/`
- `Samples~/`

原厂包中的 `package.json` 名称为 `com.youhu.unity_uwa_gpm`，不能覆盖瑞雪包的 `com.ruixue.unitysdk.uwa`。

原厂包带有 `Runtime/com.youhu.unity_uwa_gpm.asmdef`，不能与 `Runtime/RuiXue.UWA.asmdef` 同时放在同一目录。

## 数据 API 兼容

新版 UnityPackage 未包含 `UWAGPM_EAPI.cs`，但瑞雪的性能数据上报仍依赖：

- `UWAGPM.GetSDKInfo`
- `UWAGPM.SDKInfoType`

因此继续使用本目录中的 `UWAGPM_EAPI.cs`，并保留 Unity 包内对应文件及原 `.meta`。

## UnityPackage 解包方式

UnityPackage 本质上是 gzip 压缩的 tar 包，每个资源使用 GUID 目录保存：

```text
<guid>/
├── asset
├── asset.meta
└── pathname
```

更新时读取 `pathname`，仅重建 `Assets/UWA/UWA_GPM/` 下的资源。`asset` 是实际文件，`asset.meta` 是对应 Unity 元数据；只有 `.meta`、没有 `asset` 的条目表示目录。

解包后先与现有 `com.ruixue.unitysdk.uwa` 比较，再按“原厂文件替换、瑞雪适配保留”的原则同步，不能直接覆盖整个 UPM 目录。

## 平台资源规则

### OpenHarmony

替换前的瑞雪 UWA 包没有 OpenHarmony。本次资源包虽然包含 OpenHarmony `.so` 和 `etslib`，但未加入瑞雪 Unity 包。

以后更新时也不要默认引入新平台。必须先比较旧包的平台范围，并确认产品确实需要。

### Windows DLL

资源包中的以下文件同名但架构不同：

```text
Runtime/Plugins/x86/uwa_gpm.dll
Runtime/Plugins/x86_64/uwa_gpm.dll
```

原始 `.meta` 同时启用了 `Any Platform`，Android 构建会将两个 DLL 都识别为架构 `None`，产生错误：

```text
Cannot include plugin ... since plugin with the same name and architecture was already added
```

处理要求：

- x86 DLL 关闭 `Any Platform`，仅启用 Windows x86。
- x86_64 DLL 关闭 `Any Platform`，仅启用 Windows x86_64。
- 两个 DLL 都不能参与 Android 构建。

### 其他原生插件

- Android `arm64-v8a`：仅启用 Android ARM64。
- Android `armeabi-v7a`：仅启用 Android ARMv7。
- iOS `.a` 和 `.mm`：仅启用 iOS。
- WebGL `.a`：仅启用 WebGL，不能启用 `Any Platform`。

原厂 `UWAEditorLauncher.cs` 默认在 `Assets/UWA_GPM` 下查找 SDK，而瑞雪集成位于 `Packages/com.ruixue.unitysdk.uwa`。因此不能只依赖运行时脚本修正 PluginImporter，提交前必须检查各原生文件的 `.meta`。

## 验证

已执行：

```bash
dotnet build RuiXue.UWA.csproj --no-restore
dotnet build youhu.unity_uwa_gpm.Editor.csproj --no-restore
```

结果：

- `RuiXue.UWA`：0 个编译错误。
- UWA Editor：0 个编译错误。
- IDE Lint：无新增错误。
- 编译存在工程原有的程序集版本冲突和未使用变量警告，不阻塞生成。
- 未进行真机验证。

修改 PluginImporter `.meta` 后，需要等待 Unity 完成资源重新导入，再重新执行目标平台构建。

## 后续更新检查清单

- [ ] 确认 UnityPackage 文件和版本。
- [ ] 检查 Unity 仓库是否有未提交修改。
- [ ] 解包并重建 `Assets/UWA/UWA_GPM/`。
- [ ] 保留瑞雪 package、asmdef、封装、数据 API、Demo。
- [ ] 比较新旧平台目录，不默认增加 OpenHarmony。
- [ ] 检查所有原生插件的 `Any Platform` 和 CPU 配置。
- [ ] 编译 `RuiXue.UWA` 与 UWA Editor。
- [ ] 等待 Unity 重新导入并执行目标平台构建。
