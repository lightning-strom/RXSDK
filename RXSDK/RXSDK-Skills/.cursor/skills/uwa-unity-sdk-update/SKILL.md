---
name: uwa-unity-sdk-update
description: Updates the embedded UWA GPM Unity SDK in com.ruixue.unitysdk.uwa from a .unitypackage while preserving RuiXue wrappers and supported-platform policy. Use when the user asks to upgrade, replace, unpack, or troubleshoot the Unity UWA/UWA GPM SDK.
---

# UWA Unity SDK Update

## Scope

Update the vendor UWA GPM files embedded in:

`RXSDK-Unity/Packages/com.ruixue.unitysdk.uwa`

The source is normally a `.unitypackage` under:

`RXSDK-Doc/thirdchannel/uwa`

Do not publish, commit, or push unless the user explicitly asks.

## Preserve RuiXue Files

Never replace these files with the vendor package:

- `package.json` and `package.json.meta`
- `README.md`
- `CHANGELOG.md`
- `Runtime/RuiXue.UWA.asmdef`
- `Runtime/RuiXueUWAGPM.cs`
- `Runtime/UWAGPM_EAPI.cs` and its `.meta`
- `Runtime/IPerformReport.cs`
- `Runtime/PerformManceReport.cs`
- `Runtime/Impl/`
- `Runtime/link.xml`
- `Plugins/`
- `Samples~/`

`UWAGPM_EAPI.cs` provides the existing `GetSDKInfo` and `SDKInfoType` compatibility API. The vendor package may omit it, but RuiXue code still depends on it.

Do not import the vendor `package.json`; it changes the package name to `com.youhu.unity_uwa_gpm`.
Do not import the vendor runtime asmdef when `Runtime/RuiXue.UWA.asmdef` exists; two asmdefs in the same directory can break Unity compilation.

## Workflow

### 1. Inspect Before Replacing

1. Check the Unity repository status and do not overwrite unrelated changes.
2. List the existing UWA package files.
3. List the `.unitypackage` entries with `tar -tzf`.
4. Reconstruct the package in a temporary directory from each GUID directory's `pathname`, `asset`, and `asset.meta`.
5. Compare the reconstructed package with the current UWA package.

A UnityPackage stores assets like this:

```text
<guid>/
├── asset
├── asset.meta
└── pathname
```

Only process paths below `Assets/UWA/UWA_GPM/`.

### 2. Replace Vendor Files

Replace these vendor-owned areas when present:

- `Editor/`
- `Runtime/ManagedLibs/`
- `Runtime/Plugins/`
- `Runtime/UWAGPM.cs`
- `Runtime/UWAGPM_Launcher.cs`
- Vendor license files

Preserve the RuiXue files listed above. If a vendor file disappears in the new package, determine whether RuiXue code still references it before deleting it.

### 3. Keep the Existing Platform Policy

Compare platform directories before and after extraction. Do not add a new platform merely because it exists in the vendor package.

- Keep Android and iOS unless the user requests otherwise.
- Do not add OpenHarmony when the previous RuiXue package did not include it.
- Ask before adding other new platform payloads when product scope is unclear.
- If Windows x86/x86_64 or WebGL payloads are retained, verify their importer metadata explicitly.

Remove both the platform directory and its sibling `.meta` when excluding a platform.

### 4. Validate PluginImporter Metadata

Architecture-specific native plugins must not enable `Any Platform`.

For `x86/uwa_gpm.dll`:

- `Any` must be disabled.
- `Standalone: Win` must be enabled with x86-compatible settings.
- Win64 and Android must be disabled.

For `x86_64/uwa_gpm.dll`:

- `Any` must be disabled.
- `Standalone: Win64` must be enabled with x86_64-compatible settings.
- Win32 and Android must be disabled.

For Android `.so` files:

- `arm64-v8a` must use Android CPU `ARM64`.
- `armeabi-v7a` must use Android CPU `ARMv7`.
- Other platforms must be disabled.

For iOS libraries and source plugins:

- Enable iOS only.
- Disable Android, Editor, and standalone platforms.

For WebGL libraries:

- Enable WebGL only.
- Disable `Any Platform`.

Do not rely solely on the vendor `UWAEditorLauncher.cs` to repair metadata. Its default root lookup searches under `Assets/UWA_GPM`, while this integration lives under `Packages/com.ruixue.unitysdk.uwa`.

The Android error below means multiple same-name plugins were enabled for Android:

```text
Cannot include plugin ... since plugin with the same name and architecture was already added
```

Inspect the conflicting `.meta` files first and disable `Any Platform` for non-Android plugins.

### 5. Verify

Run:

```bash
dotnet build "RuiXue.UWA.csproj" --no-restore
dotnet build "youhu.unity_uwa_gpm.Editor.csproj" --no-restore
```

Then:

1. Check IDE lints for the UWA package.
2. Confirm `UWAGPM_EAPI.cs` still compiles with the new partial classes.
3. Confirm excluded platform files are absent from Git status.
4. Let Unity reimport changed `.meta` files.
5. Run the requested Unity target build.

For iOS verification, use a connected physical device when available. If no device is available, report “未进行真机验证”; do not use simulator validation as a substitute.

## Completion Report

Report:

- Vendor SDK version and source package.
- Replaced vendor areas.
- Preserved RuiXue compatibility files.
- Added or excluded platforms.
- Build and lint results.
- Any existing warnings that did not block compilation.
