# iOS 新建类文件并引入 Xcode 项目流程

> 创建日期：2026-01-20
>
> 本文档描述如何在 RXSDKCode 项目中新建类文件，并正确引入 Xcode 工程

---

## 概述

在 RXSDKCode 项目中新建类时，需要完成以下步骤：

1. 创建 `.h` 和 `.m` 文件
2. 修改 `project.pbxproj` 将文件加入工程
3. 如果是 Public 类，需要在 `RXSDK_Pure.h` 中添加 import

---

## 步骤详解

### 步骤 1：创建源文件

在目标目录下创建 `.h` 和 `.m` 文件。

**示例**：在 `RXSDK/Common/` 目录下创建 `RXSDK` 类

```
RXSDK-iOS/RXSDKCode/RXSDK/Common/
├── RXSDK.h      ← 新建
├── RXSDK.m      ← 新建
├── RXService.h
├── RXService.m
└── ...
```

---

### 步骤 2：修改 project.pbxproj

需要在 `RXSDK.xcodeproj/project.pbxproj` 文件中添加 4 处内容：

#### 2.1 添加 PBXBuildFile（构建文件引用）

在 `/* Begin PBXBuildFile section */` 区域添加：

```
/* 普通类（非 Public） */
<UUID1> /* ClassName.h in Headers */ = {isa = PBXBuildFile; fileRef = <UUID3> /* ClassName.h */; };
<UUID2> /* ClassName.m in Sources */ = {isa = PBXBuildFile; fileRef = <UUID4> /* ClassName.m */; };

/* Public 类（需要添加 ATTRIBUTES = (Public, )） */
<UUID1> /* ClassName.h in Headers */ = {isa = PBXBuildFile; fileRef = <UUID3> /* ClassName.h */; settings = {ATTRIBUTES = (Public, ); }; };
<UUID2> /* ClassName.m in Sources */ = {isa = PBXBuildFile; fileRef = <UUID4> /* ClassName.m */; };
```

#### 2.2 添加 PBXFileReference（文件引用）

在 `/* Begin PBXFileReference section */` 区域添加：

```
<UUID3> /* ClassName.h */ = {isa = PBXFileReference; lastKnownFileType = sourcecode.c.h; path = ClassName.h; sourceTree = "<group>"; };
<UUID4> /* ClassName.m */ = {isa = PBXFileReference; lastKnownFileType = sourcecode.c.objc; path = ClassName.m; sourceTree = "<group>"; };
```

#### 2.3 添加到文件组（PBXGroup）

找到目标文件夹对应的 PBXGroup，在其 `children` 数组中添加文件引用：

```
47879F5627003DCC00533832 /* Common */ = {
    isa = PBXGroup;
    children = (
        ...
        <UUID3> /* ClassName.h */,
        <UUID4> /* ClassName.m */,
        ...
    );
    path = Common;
    sourceTree = "<group>";
};
```

#### 2.4 添加到构建阶段

**Headers 构建阶段**（`PBXHeadersBuildPhase`）：

```
files = (
    ...
    <UUID1> /* ClassName.h in Headers */,
    ...
);
```

**Sources 构建阶段**（`PBXSourcesBuildPhase`）：

```
files = (
    ...
    <UUID2> /* ClassName.m in Sources */,
    ...
);
```

---

### 步骤 3：Public 类额外操作

如果类需要设置为 **Public**（对外暴露），还需要：

#### 3.1 在 RXSDK_Pure.h 中添加 import

```objc
// RXSDK-Pure/RXSDK_Pure.h

#import <RXSDK_Pure/RXService.h>
#import <RXSDK_Pure/RXSDK_Pure.h>      // ← 新增
#import <RXSDK_Pure/RXApiService.h>
...
```

#### 3.2 确保 PBXBuildFile 包含 Public 属性

```
settings = {ATTRIBUTES = (Public, ); };
```

---

## UUID 生成规则

Xcode 使用 24 位十六进制字符作为 UUID。可以使用以下格式：

```
AABBCC012F0120260001AAAA  // 示例格式
```

**建议**：参考现有文件的 UUID 格式，确保唯一性。

---

## 完整示例

以创建 `RXSDK` 类（Public 类型）为例：

### 1. PBXBuildFile

```
AABBCC012F0120260001AAAA /* RXSDK.h in Headers */ = {isa = PBXBuildFile; fileRef = AABBCC032F0120260001AAAA /* RXSDK.h */; settings = {ATTRIBUTES = (Public, ); }; };
AABBCC022F0120260001AAAA /* RXSDK.m in Sources */ = {isa = PBXBuildFile; fileRef = AABBCC042F0120260001AAAA /* RXSDK.m */; };
```

### 2. PBXFileReference

```
AABBCC032F0120260001AAAA /* RXSDK.h */ = {isa = PBXFileReference; lastKnownFileType = sourcecode.c.h; path = RXSDK.h; sourceTree = "<group>"; };
AABBCC042F0120260001AAAA /* RXSDK.m */ = {isa = PBXFileReference; lastKnownFileType = sourcecode.c.objc; path = RXSDK.m; sourceTree = "<group>"; };
```

### 3. PBXGroup (Common)

```
AABBCC032F0120260001AAAA /* RXSDK.h */,
AABBCC042F0120260001AAAA /* RXSDK.m */,
```

### 4. PBXHeadersBuildPhase

```
AABBCC012F0120260001AAAA /* RXSDK.h in Headers */,
```

### 5. PBXSourcesBuildPhase

```
AABBCC022F0120260001AAAA /* RXSDK.m in Sources */,
```

### 6. RXSDK_Pure.h

```objc
#import <RXSDK_Pure/RXSDK_Pure.h>
```

---

## 注意事项

1. **UUID 必须唯一**：不能与现有 UUID 重复
2. **Public 类必须在 umbrella header 中 import**：否则外部无法访问
3. **文件路径必须正确**：`path` 字段要与实际文件名一致
4. **修改后需重新打开 Xcode**：project.pbxproj 修改后需重新加载

---

## 相关文档

- [Public 类检测方法](./public_class_detection.md)
- [Public 类列表](./public_classes.md)
