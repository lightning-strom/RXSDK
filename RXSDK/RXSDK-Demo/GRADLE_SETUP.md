# Gradle 设置说明

## 问题修复

如果遇到以下错误：
```
'org.gradle.api.artifacts.Dependency org.gradle.api.artifacts.dsl.DependencyHandler.module(java.lang.Object)'
```

## 解决方案

### 1. 下载 Gradle Wrapper JAR

如果 `gradle/wrapper/gradle-wrapper.jar` 文件不存在，需要下载：

**方法一：使用命令行**
```bash
cd rxsdk-demo
curl -L -o gradle/wrapper/gradle-wrapper.jar \
  https://raw.githubusercontent.com/gradle/gradle/v7.6.0/gradle/wrapper/gradle-wrapper.jar
```

**方法二：使用 Android Studio**
1. 打开项目
2. Android Studio 会自动下载 Gradle wrapper

**方法三：从其他项目复制**
```bash
cp ruixue_sdk_android/gradle/wrapper/gradle-wrapper.jar rxsdk-demo/gradle/wrapper/
```

### 2. 设置执行权限（macOS/Linux）

```bash
chmod +x gradlew
```

### 3. 验证配置

运行以下命令验证配置：
```bash
./gradlew --version
```

### 4. 同步项目

在 Android Studio 中：
1. File -> Sync Project with Gradle Files
2. 或点击工具栏的 "Sync Now"

## 常见问题

### Q: Gradle 版本兼容性警告
A: 当前项目使用 Gradle 7.6，与 Gradle 10.0 存在一些不兼容的 API。这是正常的，不影响构建。

### Q: 依赖下载失败
A: 检查网络连接，或配置代理：
```properties
# gradle.properties
systemProp.http.proxyHost=your.proxy.host
systemProp.http.proxyPort=your.proxy.port
```

### Q: 权限错误
A: 确保 gradlew 文件有执行权限：
```bash
chmod +x gradlew
```
