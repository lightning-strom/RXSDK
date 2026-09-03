# 脚本说明

本目录存放与 **UPM 发布**、**Android Gradle 依赖切换**、**README 维护** 相关的脚本。

## UPM 发布：`publish-upm.sh`

将 `Packages/com.ruixue.*` 发布到 npm 兼容的私有 Registry（与 `manifest.json` 中 Scoped Registry 一致）。

**前置**：Node.js；已配置 `.npmrc` 或 `npm login --registry=...`。

```bash
# 发布全部（先批量写入版本号，再 npm publish）
./scripts/publish-upm.sh --version 1.6.18

# 仅本地打包试跑（npm pack，不访问 registry）
./scripts/publish-upm.sh --version 1.6.18 --dry-run

# 只发布单个包
./scripts/publish-upm.sh --version 1.6.18 com.ruixue.unitysdk.base
```

环境变量 **`REGISTRY_URL`** 可覆盖默认 registry。

依赖：`bump-package-version.js`（批量改 `package.json` 里的 `version` 与 `com.ruixue.*` 依赖版本）。

---

## Android 国内 / 海外依赖切换

修改 `Assets/Plugins/Android/mainTemplate.gradle` 中 `rxsdk_weile`（国内）与 `rxsdk_overseas`（海外）的注释/启用状态。

```bash
./scripts/android-deps-overseas.sh   # 海外
./scripts/android-deps-domestic.sh   # 国内
```

切换后请在 Unity 中重新 **Build** Android。

---

## 批量生成各包 README：`generate-readmes.mjs`

根据每个包 `package.json` 的 `name`、`displayName`、`description`、`dependencies`、`samples` 生成 `Packages/.../README.md`。

```bash
node scripts/generate-readmes.mjs
```

修改模板时编辑该文件后重新执行即可。

---

## 其他

- `.npmrc.example` 若在仓库根目录存在，可复制为 `.npmrc` 并填写 token（勿将含密钥的 `.npmrc` 提交至公开仓库）。
