// 选择按钮元素
const button = document.getElementById('open-browser');

// 为按钮添加点击事件监听器
button.addEventListener('click', function() {
    // 定义要打开的URL
    const url = "

    // 使用window.open()方法唤起系统浏览器
    window.open(url, '_blank'); // '_blank'表示在新标签中打开
});
