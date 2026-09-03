# RXH5 WebGL 模板

这是一个专为 Unity WebGL 游戏设计的 RXH5 模板，包含完整的游戏启动页面和游戏页面。

## 文件结构

```
RXH5Template/
├── index.html          # 游戏启动页面
├── game.html           # 游戏主页面
├── TemplateData/       # 模板资源文件夹
│   ├── style.css       # 样式文件
│   ├── favicon.ico     # 网站图标
│   └── *.png          # 各种图片资源
└── README.md          # 说明文档
```

## 功能特性

### index.html (启动页面)
- 🎨 现代化的渐变背景设计
- 📱 响应式布局，支持移动端
- 🎮 游戏 Logo 展示
- ⚡ 一键启动游戏功能
- ⌨️ 键盘快捷键支持 (Enter/Space)
- 👆 触摸事件支持

### game.html (游戏页面)
- 🎯 完整的 Unity WebGL 游戏加载
- 📊 实时加载进度显示
- 🔄 返回首页功能
- 🖥️ 全屏模式支持
- ⚠️ 错误和警告消息处理
- 📱 移动端优化适配
- ⌨️ 键盘快捷键 (ESC 返回)

## 使用方法

### 1. 部署到 Web 服务器

将整个 `RXH5Template` 文件夹上传到您的 Web 服务器，确保：
- 服务器支持 HTTP/HTTPS
- 正确配置 MIME 类型
- 启用 gzip 压缩

### 2. Unity 构建配置

在 Unity 中配置 WebGL 构建设置：

1. **File → Build Settings → WebGL**
2. **Player Settings → WebGL Settings**：
   - Resolution and Presentation → WebGL Template: 选择自定义模板
   - Publishing Settings → Compression Format: 选择 gzip

### 3. 自定义配置

#### 修改游戏标题和版本
在 `game.html` 中修改：
```javascript
var config = {
    companyName: "您的公司名",
    productName: "您的游戏名",
    productVersion: "1.0.0",
    // ...
};
```

#### 修改启动页面样式
在 `index.html` 中修改 CSS 样式：
```css
.game-title {
    font-size: 2.5em;
    /* 自定义样式 */
}
```

## 浏览器兼容性

- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 11+
- ✅ Edge 79+
- ✅ 移动端浏览器

## 性能优化建议

1. **启用 gzip 压缩**
2. **使用 CDN 加速**
3. **优化图片资源**
4. **启用浏览器缓存**
5. **使用 WebP 格式图片**

## 自定义开发

### 添加新的功能按钮

在 `index.html` 中添加：
```html
<button class="btn" onclick="customFunction()">
    自定义功能
</button>
```

### 修改加载动画

在 `game.html` 中自定义加载进度条样式：
```css
#unity-progress-bar-full {
    background: linear-gradient(90deg, #your-color1, #your-color2);
}
```

### 添加音效

在 `index.html` 中添加：
```javascript
function playSound() {
    const audio = new Audio('path/to/sound.mp3');
    audio.play();
}
```

## 故障排除

### 常见问题

1. **游戏无法加载**
   - 检查 Build 文件夹是否存在
   - 确认文件路径正确
   - 检查浏览器控制台错误

2. **移动端显示异常**
   - 确认 viewport meta 标签正确
   - 检查 CSS 媒体查询

3. **全屏功能不工作**
   - 确认用户手势触发
   - 检查浏览器权限设置

### 调试方法

1. 打开浏览器开发者工具
2. 查看 Console 标签页的错误信息
3. 检查 Network 标签页的资源加载情况
4. 使用移动端模拟器测试

## 版本历史

- **v1.0.0**: 初始版本，包含基础功能
- 支持 Unity WebGL 游戏加载
- 响应式设计
- 移动端优化

## 技术支持

如有问题，请检查：
1. Unity 版本兼容性
2. 浏览器支持情况
3. 服务器配置
4. 文件权限设置

---

© 2024 RXH5 Template. 专为 Unity WebGL 游戏设计。 