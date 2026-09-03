---
name: jssdk-channel-release
description: Packages RXSDK-JS channel SDK releases into JSSDKFile by version. Use when the user asks to update SDK_VERSION, build all channel SDKs, copy UMD artifacts to JSSDKFile, rename channel folders, rename JS files to index.js, or create a versioned JSSDKFile release such as v4.0.0.
---

# JSSDK Channel Release

## Scope

Use this skill for RXSDK-JS release packaging:

1. Update `build/common.config.ts` `SDK_VERSION`.
2. Build channel SDK artifacts with existing npm scripts.
3. Copy formal UMD files from `dist` into `JSSDKFile/v<version>/<channel-display-name>/index.js`.
4. Copy `src/tencent-sdk.js` into both WeChat package folders as `tencent-sdk.js`.
5. When updating the Unity WeChat MiniGame SDK, replace its embedded `channelSDK/index.js` with the built `wegame` basic package.
6. Validate the versioned `JSSDKFile` layout and any requested Unity sync.

Do not push unless the user explicitly asks. For full-channel packaging requests, automatically commit the completed release changes after validation. Do not commit unrelated dirty files.

## Inputs

Confirm or infer:

- Release version, for example `4.0.0`.
- Target version folder, normally `v${version}`, for example `v4.0.0`.
- Whether to include H5 channels. For “所有渠道”, include both mini/RPK channels and H5 channels.
- If the user does not specify a release version, infer the latest existing semantic version folder under `JSSDKFile/` (for example `v4.0.0`) and overwrite that version. If no version folder exists, ask the user for the version before building.

## Version Update

Edit only `build/common.config.ts`:

```ts
const SDK_VERSION = '4.0.0'
```

Use the exact version string requested by the user. In this repo the output file name may still contain `v2` because it is derived from `package.json` major version; do not rename the built artifact based on `SDK_VERSION`.

When the user omits the version, set `SDK_VERSION` from the inferred latest `JSSDKFile/v*` folder name by removing the leading `v`.

## Build Workflow

Before running long builds, check existing terminals to avoid duplicating a running build.

Run `npm run prebuild` first if the user expects a full release build. If it fails on existing TypeScript errors, report that and continue with individual channel builds when the requested deliverable is JS UMD files. Do not “fix” unrelated source errors unless the user asks.

Build individual scripts with `set +e` so one channel failure does not stop later channels:

```bash
bash -lc 'set +e
failed=0
for channel in huawei wegame wegame.full qq qq.full douyin alipay taobao gamebox 4399 vivo uc ks jd xiaomi meituan facebook baidu bilibili mgtv helpui open_data; do
  echo "\n==> build:$channel"
  npm run "build:$channel"
  rc=$?
  echo "<== build:$channel exit $rc"
  [ $rc -ne 0 ] && failed=1
done
exit $failed'
```

For H5 channels:

```bash
bash -lc 'set +e
failed=0
for channel in h5 adjust awy_h5 kuaiwan_h5 qiqi_h5 simo_h5 4399_h5 360_h5 xunlei_h5 haluo_h5 lenovo_h5 shandw_h5 h5_iqiyi uc_h5 baidu_h5 baidu_h5_new qunhei_h5 vng_h5 zuiyou_h5 quick_h5 gank_h5 gametok_h5 remian_h5 h5_test oppo_h5 xiaomi_h5 honor_h5 crypto_h5 ruixue_h5 ruixueh5_h5 oversea_h5; do
  echo "\n==> build:$channel"
  npm run "build:$channel"
  rc=$?
  echo "<== build:$channel exit $rc"
  [ $rc -ne 0 ] && failed=1
done
exit $failed'
```

Expected non-blocking failures in this repo may include:

- `prebuild` failing on existing TypeScript errors.
- A channel JS file being created, then the build failing in declaration generation because `dist/types/index.*.d.ts` is missing.
- Scripts whose entry/config file does not exist, such as some placeholder H5 or mobile store channels.

For packaging, copy any formal UMD JS that was actually generated.

Vivo release packaging uses `build:vivo` only. Do not build, copy, or publish `vivo_h5` / `h5_vivo` as a Vivo release artifact.

Oppo release packaging uses `build:oppo_h5` only. Do not build, copy, or publish `build:oppo` / `dist/oppo` as an Oppo release artifact.

## Unity WeChat MiniGame Sync

When the user asks to update the Unity WeChat MiniGame SDK from JSSDK `wegame`, first run `npm run build:wegame` from the `RXSDK-JS` root, then replace the Unity package runtime SDK with the generated `wegame` basic package:

```bash
cp "dist/wegame/channelSDK/index.js" "../RXSDK-Unity/Packages/com.ruixue.unitysdk.webgl.weixin/Plugins/WebGL/RXJsSdk_WeiXin/channelSDK/index.js"
```

Do not use `wegame.full` for this file unless the user explicitly requests the full package. The expected source map comment should reference `channel-sdk.wegame.v2.umd.js`, not `channel-sdk.wegame.full.v2.umd.js`.

## JSSDKFile Layout

Final layout:

```text
JSSDKFile/
├── README.md
└── v4.0.0/
    ├── 微信基础包/
    │   ├── index.js
    │   └── tencent-sdk.js
    ├── 微信全量包/
    │   ├── index.js
    │   └── tencent-sdk.js
    └── ...
```

Keep `JSSDKFile/.git` and `JSSDKFile/README.md` at the root. Put channel folders under the version folder.
Always include an unchanged copy of `src/tencent-sdk.js` in both `微信基础包/` and `微信全量包/`.

## Channel Display Names

Use this mapping when copying from `dist/<channel>`:

```python
CHANNEL_DISPLAY_NAMES = {
    'wegame': '微信基础包',
    'wegame.full': '微信全量包',
    'douyin': '抖音',
    'baidu': '百度RPK',
    'alipay': '支付宝',
    'gamebox': '好游快爆',
    '4399': '4399RPK',
    'h5_360': '360',
    'h5_4399': '4399H5',
    'h5_awy': '爱微游',
    'h5_gametok': 'GameTok',
    'h5_gank': '独角兽',
    'h5_haluo': '哈啰',
    'h5_honor': '荣耀',
    'h5_iqiyi': '爱奇艺',
    'h5_oppo': 'oppo',
    'h5_oversea': '海外',
    'h5_qiqi': '七七',
    'h5_quick': 'quick',
    'h5_qunhei': '群黑',
    'h5_remian': '热面',
    'h5_ruixue': '瑞雪',
    'h5_shandw': '闪电玩',
    'h5_simo': '司墨 007',
    'h5_uc': 'UC',
    'h5_vng': 'vng',
    'h5_xiaomi': '小米',
    'h5_xunlei': '迅雷',
    'h5_zuiyou': '最右',
    'huawei': '华为',
    'jd': '京东',
    'ks': '快手',
    'meituan': '美团',
    'mgtv': '芒好玩',
    'new_h5_baidu': '百度 H5',
    'taobao': '淘宝',
    'qq': 'QQ 基础包',
    'qq.full': 'QQ 全量包',
    'facebook': 'Facebook',
}
```

If a generated channel is not listed, keep its current channel folder name.

## Sync Script

After builds, run a script like this from the repo root. Replace `4.0.0` with the requested version.

```bash
python3 - <<'PY'
from pathlib import Path
import shutil

version = '4.0.0'
display_names = {
    'wegame': '微信基础包',
    'wegame.full': '微信全量包',
    'douyin': '抖音',
    'baidu': '百度RPK',
    'alipay': '支付宝',
    'gamebox': '好游快爆',
    '4399': '4399RPK',
    'h5_360': '360',
    'h5_4399': '4399H5',
    'h5_awy': '爱微游',
    'h5_gametok': 'GameTok',
    'h5_gank': '独角兽',
    'h5_haluo': '哈啰',
    'h5_honor': '荣耀',
    'h5_iqiyi': '爱奇艺',
    'h5_oppo': 'oppo',
    'h5_oversea': '海外',
    'h5_qiqi': '七七',
    'h5_quick': 'quick',
    'h5_qunhei': '群黑',
    'h5_remian': '热面',
    'h5_ruixue': '瑞雪',
    'h5_shandw': '闪电玩',
    'h5_simo': '司墨 007',
    'h5_uc': 'UC',
    'h5_vng': 'vng',
    'h5_xiaomi': '小米',
    'h5_xunlei': '迅雷',
    'h5_zuiyou': '最右',
    'huawei': '华为',
    'jd': '京东',
    'ks': '快手',
    'meituan': '美团',
    'mgtv': '芒好玩',
    'new_h5_baidu': '百度 H5',
    'taobao': '淘宝',
    'qq': 'QQ 基础包',
    'qq.full': 'QQ 全量包',
    'facebook': 'Facebook',
}

root = Path('.').resolve()
version_dir = root / 'JSSDKFile' / f'v{version}'
version_dir.mkdir(parents=True, exist_ok=True)

copied = []
for src in sorted((root / 'dist').glob('*/channel-sdk.*.v*.umd.js')):
    if '.dev.' in src.name:
        continue
    channel = src.parent.name
    if channel in {'keleSdk', 'h5_vivo', 'oppo'}:
        continue
    display = display_names.get(channel, channel)
    dest_dir = version_dir / display
    dest_dir.mkdir(parents=True, exist_ok=True)
    dest = dest_dir / 'index.js'
    shutil.copy2(src, dest)
    copied.append(dest.relative_to(root))

tencent_sdk = root / 'src' / 'tencent-sdk.js'
for display in ('微信基础包', '微信全量包'):
    dest = version_dir / display / 'tencent-sdk.js'
    dest.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(tencent_sdk, dest)
    copied.append(dest.relative_to(root))

for dest in copied:
    print(dest)
print(f'copied={len(copied)}')
PY
```

## Validation

Run these checks and summarize results:

```bash
python3 - <<'PY'
from pathlib import Path

version = '4.0.0'
root = Path('JSSDKFile') / f'v{version}'
js_files = sorted(root.glob('**/*.js'))
unexpected_names = [p for p in js_files if p.name not in {'index.js', 'tencent-sdk.js'}]
remaining_artifact_names = sorted(root.glob('**/channel-sdk*.js'))
empty_dirs = [p for p in root.glob('**/') if p.is_dir() and not any(p.iterdir())]
source_tencent_sdk = Path('src/tencent-sdk.js').read_bytes()
wechat_tencent_sdks = [
    root / '微信基础包' / 'tencent-sdk.js',
    root / '微信全量包' / 'tencent-sdk.js',
]
invalid_tencent_sdks = [
    p for p in wechat_tencent_sdks
    if not p.is_file() or p.read_bytes() != source_tencent_sdk
]

print(f'js_files={len(js_files)}')
print('unexpected_names=' + (','.join(str(p) for p in unexpected_names) if unexpected_names else 'none'))
print('remaining_channel_sdk_js=' + str(len(remaining_artifact_names)))
print('empty_dirs=' + (','.join(str(p) for p in empty_dirs) if empty_dirs else 'none'))
print('invalid_tencent_sdks=' + (','.join(str(p) for p in invalid_tencent_sdks) if invalid_tencent_sdks else 'none'))
PY

git -C JSSDKFile status --short
```

Optionally verify the requested version string appears in copied SDKs:

```bash
python3 - <<'PY'
from pathlib import Path

version = '4.0.0'
root = Path('JSSDKFile') / f'v{version}'
missing = [str(p) for p in sorted(root.glob('**/index.js')) if version not in p.read_text(errors='ignore')]
print('missing_version_string=' + (','.join(missing) if missing else 'none'))
PY
```

Some JS-only channels may not contain `SDK_VERSION`; report them as a warning, not as a packaging failure.

## Git Commit

After a full-channel packaging request completes validation, automatically commit the release changes:

1. Commit generated release artifacts in the nested `JSSDKFile` git repository. Include the target version directory, for example `v4.0.0/`, and any root release metadata that changed. Use a message like `Update JSSDK v4.0.0 channel packages`.
2. If `build/common.config.ts` was changed for `SDK_VERSION`, commit that tracked RXSDK-JS change separately in the RXSDK-JS repository with a message like `Update JSSDK release version to 4.0.0`.
3. Before committing, inspect `git status`, `git diff`, and recent `git log` for the repository being committed. Do not commit unrelated dirty files, demo build outputs, credentials, or ignored/generated files outside the release artifact set.
4. If there are no relevant changes in a repository, do not create an empty commit.
5. Never push unless the user explicitly asks.

For Unity WeChat MiniGame sync requests, also verify that the Unity runtime `index.js` matches the generated `dist/wegame/channelSDK/index.js` and that it no longer references the `wegame.full` source map.
