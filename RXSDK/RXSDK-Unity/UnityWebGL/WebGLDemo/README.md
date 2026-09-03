# RXH5 WebGL 模板

这是一个专为 Unity WebGL 游戏设计的 RXH5 模板，包含完整的游戏启动页面和游戏页面。

## 文件结构

```
RXH5/
├── index.html          # 游戏启动页面
├── game.html           # 游戏主页面
├── TemplateData/       # 模板资源文件夹
│   ├── style.css       # 样式文件
│   ├── favicon.ico     # 网站图标
│   └── *.png          # 各种图片资源
└── README.md          # 说明文档
```

## 在 Unity 中使用此模板

### 1. 选择模板
1. 打开 Unity 项目
2. 进入 `File → Build Settings`
3. 选择 `WebGL` 平台
4. 点击 `Player Settings`
5. 在 `WebGL Settings` 中找到 `Resolution and Presentation`
6. 在 `WebGL Template` 下拉菜单中选择 `RXH5`

### 2. 配置项目信息
在 `Player Settings` 中设置：
- **Company Name**: 您的公司名称
- **Product Name**: 您的游戏名称
- **Product Version**: 游戏版本号

### 3. 构建游戏
1. 点击 `Build` 按钮
2. 选择输出目录
3. Unity 会自动使用 RXH5 模板生成游戏文件

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

## 模板变量

Unity 会自动替换以下变量：

- `{{{ PRODUCT_NAME }}}` - 游戏名称
- `{{{ PRODUCT_VERSION }}}` - 游戏版本
- `{{{ COMPANY_NAME }}}` - 公司名称
- `{{{ LOADER_FILENAME }}}` - 加载器文件名
- `{{{ DATA_FILENAME }}}` - 数据文件名
- `{{{ FRAMEWORK_FILENAME }}}` - 框架文件名
- `{{{ CODE_FILENAME }}}` - 代码文件名

## 自定义配置

### 修改启动页面样式
在 `index.html` 中修改 CSS 样式：
```css
.game-title {
    font-size: 2.5em;
    /* 自定义样式 */
}
```

### 修改游戏页面配置
在 `game.html` 中修改游戏配置：
```javascript
var config = {
    // 自定义配置
    showBanner: unityShowBanner,
};
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

## 故障排除

### 常见问题

1. **模板不显示在 Unity 中**
   - 确认模板文件夹在 `Assets/WebGLTemplates/` 目录下
   - 重启 Unity 编辑器

2. **游戏无法加载**
   - 检查 Build 文件夹是否存在
   - 确认文件路径正确
   - 检查浏览器控制台错误

3. **移动端显示异常**
   - 确认 viewport meta 标签正确
   - 检查 CSS 媒体查询

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