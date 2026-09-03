# iOS Public 类检测方法

> 本文档描述如何正确检测 RXSDK-iOS 项目中的 public 类

## 检测原理

在 iOS/Xcode 项目中，真正的 public 类是在 `project.pbxproj` 文件中通过 `ATTRIBUTES = (Public, );` 标记的头文件。

### 为什么不能直接扫描 .h 文件？

- 在 `.h` 头文件中声明的类不一定是 public 的
- Xcode Framework 项目通过 Build Phases → Headers 设置头文件的可见性
- 只有标记为 Public 的头文件才会在 Framework 中对外暴露

## 检测步骤

### 步骤 1：查找所有 project.pbxproj 文件

```bash
find /path/to/RXSDK-iOS -name "project.pbxproj" ! -path "*/Pods/*"
```

排除 `Pods` 目录，只检测自有项目。

### 步骤 2：提取 Public 标记的头文件

```bash
grep -h "ATTRIBUTES = (Public" project.pbxproj | grep "\.h in Headers"
```

示例输出：
```
4712845D27CDED2300B625E8 /* RXLogService.h in Headers */ = {isa = PBXBuildFile; fileRef = 4712845A27CDED2300B625E8 /* RXLogService.h */; settings = {ATTRIBUTES = (Public, ); }; };
```

### 步骤 3：提取头文件名

```bash
sed 's/.*\/\* \(.*\.h\) in Headers.*/\1/'
```

### 步骤 4：筛选有实现的类（可选）

排除纯头文件（协议、宏定义等），只保留同时有 `.h` 和 `.m` 的类：

```bash
# 检查是否存在对应的 .m 文件
base="${header%.h}"
find /path/to/RXSDK-iOS -name "${base}.m" ! -path "*/Pods/*"
```

## 完整检测脚本

```bash
#!/bin/bash
# 检测 RXSDK-iOS 中的 public 类

RXSDK_IOS_PATH="/path/to/RXSDK-iOS"

# 1. 提取所有 public 头文件
find "$RXSDK_IOS_PATH" -name "project.pbxproj" ! -path "*/Pods/*" \
    -exec grep -h "ATTRIBUTES = (Public" {} \; 2>/dev/null \
    | grep "\.h in Headers" \
    | sed 's/.*\/\* \(.*\.h\) in Headers.*/\1/' \
    | sort | uniq > /tmp/public_headers.txt

echo "Public 头文件总数: $(wc -l < /tmp/public_headers.txt)"

# 2. 筛选有 .m 实现的类
while read h; do
    base="${h%.h}"
    m_count=$(find "$RXSDK_IOS_PATH" -name "${base}.m" ! -path "*/Pods/*" 2>/dev/null | wc -l)
    if [ "$m_count" -gt 0 ]; then
        echo "$h"
    fi
done < /tmp/public_headers.txt > /tmp/public_classes.txt

echo "有实现的 Public 类数量: $(wc -l < /tmp/public_classes.txt)"
```

## 检测结果说明

| 类型 | 说明 |
|------|------|
| Public 头文件 | 在 project.pbxproj 中标记为 `ATTRIBUTES = (Public, )` 的 .h 文件 |
| 有实现的 Public 类 | 同时拥有 .h 和 .m 文件的 public 类 |
| 纯头文件 | 只有 .h 没有 .m 的文件（通常是协议、宏定义、常量等） |

## 注意事项

1. **排除 Pods**：第三方依赖的 public 类不计入统计
2. **Framework 项目**：只有 Framework target 才有 public/private 头文件设置
3. **App 项目**：普通 App 项目没有头文件可见性设置
4. **分类文件**：`NSObject+RXAddition.h` 这类分类文件也可能是 public 的

## 相关文件

- [public_classes.md](./public_classes.md) - Public 类列表
