{{define "unity_native_dependency_upgrade"}}
# ==================== 原生 SDK 版本校验与自动升级指南 ====================
native_version_check:
  unity:
    min_version: "{{.UnityMinVersion}}"
    packages:
{{range .UnityPackages}}
      {{.Name}}: "{{.Version}}"
{{end}}
    check: "检查 Unity 项目 Packages/manifest.json 中 {{.UnityPackageNames}} 版本是否满足最低要求"
    auto_upgrade:
{{range .UnityUpgradeSteps}}
      - "{{.}}"
{{end}}
      - "保存 manifest.json 后让 Unity Package Manager 自动 resolve；如 packages-lock.json 仍锁旧版本，可同步改版本或让 Unity 重新生成"
  android:
    min_version: "{{.AndroidMinVersion}}"
    check: "检查 Assets/Plugins/Android/mainTemplate.gradle 中 rxVersion 是否 >= {{.AndroidMinVersion}}；已导出的 Android 工程也要同步检查 build.gradle 依赖版本"
    auto_upgrade:
      - "优先编辑 Unity 工程 Assets/Plugins/Android/mainTemplate.gradle，将 def rxVersion 或 com.ruixue:* 依赖版本改为 {{.AndroidMinVersion}} 或更高"
      - "如果项目已经导出 Android Studio 工程，同步修改导出工程中的 build.gradle 依赖版本"
      - "修改后执行 Gradle Sync / 重新构建，确保重新拉取 com.ruixue:*:{{.AndroidMinVersion}}+"
    failure_if_not_upgraded: "{{.AndroidFailure}}"
  ios:
    min_versions:
{{range .IOSPods}}
      {{.Name}}: "{{.Version}}"
{{end}}
    check: "检查 Unity iOS 导出工程 Podfile / PodfileTemplate 中 {{.IOSPodNames}} 版本"
    auto_upgrade:
{{range .IOSUpgradeSteps}}
      - "{{.}}"
{{end}}
    failure_if_not_upgraded: "{{.IOSFailure}}"
{{end}}
