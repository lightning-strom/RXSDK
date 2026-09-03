# Steamworks Unity集成指南

## 安装方法

### 方法一：使用 Unity Package Manager（推荐）

1. 打开 Unity 项目，进入菜单栏的 `Window` > `Package Manager`
2. 点击窗口左上角的 `+` 按钮
3. 选择 `从 Git URL 添加软件包...`（Add package from git URL...）
4. 输入以下 URL 获取最新版本：

   ```
   https://github.com/rlabrecque/Steamworks.NET.git?path=/com.rlabrecque.steamworks.net#2024.8.0
   ```

5. 点击 `添加` 按钮，等待下载和安装完成

### 方法二：使用 .unitypackage 文件

1. 访问 [Steamworks.NET GitHub 发布页面](https://github.com/rlabrecque/Steamworks.NET/releases)
2. 下载最新版本的 `.unitypackage` 文件
3. 在 Unity 中，选择 `Assets` > `导入包` > `自定义包...`
4. 选择下载的 `.unitypackage` 文件并导入所有内容

## 配置步骤

1. 安装完成后，Steamworks.NET 会自动在项目根目录创建 `steam_appid.txt` 文件
2. 打开此文件，将默认的 AppID `480` 替换为您自己的 Steam AppID
   > **注意**：请确保将文件保存为 ASCII 或不带 BOM 的 UTF-8 格式
3. 关闭并重新启动 Unity 项目，以加载更新后的 AppID
