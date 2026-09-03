#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
自动生成 Android 应用图标
生成各种尺寸的 ic_launcher.png 和 ic_launcher_round.png

依赖: pip install Pillow
"""

import os
from PIL import Image, ImageDraw, ImageFont

# 图标尺寸定义 (Android 标准)
ICON_SIZES = {
    'mipmap-mdpi': 48,
    'mipmap-hdpi': 72,
    'mipmap-xhdpi': 96,
    'mipmap-xxhdpi': 144,
    'mipmap-xxxhdpi': 192,
}

# 颜色定义
BACKGROUND_COLOR = (98, 0, 238)  # #6200EE (purple_500)
TEXT_COLOR = (255, 255, 255)  # 白色
ACCENT_COLOR = (3, 218, 197)  # #03DAC5 (teal_200)


def create_icon(size, is_round=False):
    """
    创建应用图标
    
    Args:
        size: 图标尺寸
        is_round: 是否为圆形图标
    
    Returns:
        PIL Image 对象
    """
    # 创建图像，支持透明通道
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # 计算边距和中心
    margin = size // 8
    center_x = size // 2
    center_y = size // 2
    
    # 绘制背景
    if is_round:
        # 圆形背景
        draw.ellipse(
            [margin, margin, size - margin, size - margin],
            fill=BACKGROUND_COLOR
        )
    else:
        # 圆角矩形背景
        corner_radius = size // 6
        draw.rounded_rectangle(
            [margin, margin, size - margin, size - margin],
            radius=corner_radius,
            fill=BACKGROUND_COLOR
        )
    
    # 绘制文字 "RX" (瑞雪 SDK 缩写)
    try:
        # 尝试使用系统字体
        font_size = size // 3
        font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", font_size)
    except:
        try:
            # 尝试使用默认字体
            font = ImageFont.load_default()
        except:
            font = None
    
    text = "RX"
    if font:
        # 计算文字位置（居中）
        bbox = draw.textbbox((0, 0), text, font=font)
        text_width = bbox[2] - bbox[0]
        text_height = bbox[3] - bbox[1]
        text_x = center_x - text_width // 2
        text_y = center_y - text_height // 2
    else:
        # 使用默认字体时的估算
        text_width = size // 3
        text_height = size // 4
        text_x = center_x - text_width // 2
        text_y = center_y - text_height // 2
    
    # 绘制文字
    draw.text(
        (text_x, text_y),
        text,
        fill=TEXT_COLOR,
        font=font
    )
    
    # 添加装饰性圆点
    dot_size = size // 20
    dot_y = center_y + text_height // 2 + dot_size * 2
    draw.ellipse(
        [center_x - dot_size, dot_y - dot_size,
         center_x + dot_size, dot_y + dot_size],
        fill=ACCENT_COLOR
    )
    
    return img


def generate_all_icons():
    """生成所有尺寸的图标"""
    base_dir = os.path.dirname(os.path.abspath(__file__))
    res_dir = os.path.join(base_dir, 'app', 'src', 'main', 'res')
    
    print("开始生成应用图标...")
    
    for mipmap_dir, size in ICON_SIZES.items():
        mipmap_path = os.path.join(res_dir, mipmap_dir)
        
        # 确保目录存在
        os.makedirs(mipmap_path, exist_ok=True)
        
        # 生成普通图标
        icon = create_icon(size, is_round=False)
        icon_path = os.path.join(mipmap_path, 'ic_launcher.png')
        icon.save(icon_path, 'PNG')
        print(f"✓ 生成 {mipmap_dir}/ic_launcher.png ({size}x{size})")
        
        # 生成圆形图标
        icon_round = create_icon(size, is_round=True)
        icon_round_path = os.path.join(mipmap_path, 'ic_launcher_round.png')
        icon_round.save(icon_round_path, 'PNG')
        print(f"✓ 生成 {mipmap_dir}/ic_launcher_round.png ({size}x{size})")
    
    print("\n所有图标生成完成！")
    print(f"图标位置: {res_dir}/mipmap-*/")


if __name__ == '__main__':
    try:
        generate_all_icons()
    except ImportError:
        print("错误: 需要安装 Pillow 库")
        print("请运行: pip install Pillow")
    except Exception as e:
        print(f"生成图标时出错: {e}")
        import traceback
        traceback.print_exc()
