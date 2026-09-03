//
//  RXKeyboard.m
//  RXSDK-Pure
//
//  Created by 陈汉 on 2025/5/15.
//

#import "RXKeyboard.h"
#import "RXCommonTool.h"

@interface RXKeyboard ()
@property (nonatomic, strong) NSMutableArray<UIView *> *lines;
@property (nonatomic, assign) BOOL isSetup;
@end

@interface UIColor (Hex)
+ (UIColor *)kbColorWithHexString:(NSString *)hexString;
@end

@implementation UIColor (Hex)
+ (UIColor *)kbColorWithHexString:(NSString *)hexString {
    unsigned rgbValue = 0;
    NSScanner *scanner = [NSScanner scannerWithString:hexString];
    [scanner setScanLocation:1]; // 跳过 '#'
    [scanner scanHexInt:&rgbValue];
    return [UIColor colorWithRed:((rgbValue & 0xFF0000) >> 16)/255.0 green:((rgbValue & 0xFF00) >> 8)/255.0 blue:(rgbValue & 0xFF)/255.0 alpha:1.0];
}
@end

@implementation RXKeyboard

- (instancetype)initWithKeyboardTextColor:(NSString *)keyboardTextColor
                       keyboardClickColor:(NSString *)keyboardClickColor
                              deleteImage:(NSString *)deleteImage
                                lineColor:(NSString *)lineColor
{
    self = [super init];
    if (self) {
        self.lines = [NSMutableArray array];
        self.isSetup = NO;
        
        self.keyboardTextColor = @"#131313";
        self.keyboardClickColor = @"#F9F9F9";
        self.deleteImage = @"rxkb_delete";
        self.lineColor = @"#F1F1F1";
        
        if (keyboardTextColor.length > 0) {
            self.keyboardTextColor = keyboardTextColor;
        }
        if (keyboardClickColor.length > 0) {
            self.keyboardClickColor = keyboardClickColor;
        }
        if (deleteImage.length > 0) {
            self.deleteImage = deleteImage;
        }
        if (lineColor.length > 0) {
            self.lineColor = lineColor;
        }
        
        // 键盘空白处背景色改为 #F1F1F1
//        self.backgroundColor = [UIColor colorWithRed:241/255.0 green:241/255.0 blue:241/255.0 alpha:1.0]; // #F1F1F1
        
        // 设置圆角
        self.layer.cornerRadius = 4;
        self.layer.masksToBounds = YES; // 确保子视图也被裁剪
    }
    return self;
}

- (void)dealloc {
    // 移除 KVO 监听 (如果之前添加了的话)
    // [self removeObserver:self forKeyPath:@"bounds"];
}

- (void)setupKeyboard {
    if (self.isSetup) {
        return;
    }
    
    // 按钮标题
    NSArray *titles = @[@"1", @"2", @"3",
                        @"4", @"5", @"6",
                        @"7", @"8", @"9",
                        @"X", @"0", @"删除"];
    int row = 4, col = 3;
    // 按钮宽高计算移到 layoutSubviews
    // CGFloat btnW = self.bounds.size.width / col;
    // CGFloat btnH = 50;
    
    // 创建背景图片
    UIImage *normalImage = [self imageWithColor:[UIColor whiteColor]];
    UIImage *highlightedImage = [self imageWithColor:[UIColor kbColorWithHexString:self.keyboardClickColor]]; // #F9F9F9
    UIColor *buttonTitleColor = [UIColor kbColorWithHexString:self.keyboardTextColor]; // #131313
    
    // 清除旧的子视图和线条，防止重复添加
    for (UIView *subview in self.subviews) {
        [subview removeFromSuperview];
    }
    [self.lines removeAllObjects];
    
    for (int i = 0; i < titles.count; i++) {
        UIButton *btn = [UIButton buttonWithType:UIButtonTypeCustom]; // Use Custom type for background images
        
        NSString *title = titles[i];
        if ([title isEqualToString:@"删除"]) {
            // 设置删除图标，这里使用一个系统图标作为示例
            UIImage *deleteImage = [UIImage rxPBundleImageNamed:self.deleteImage]; // 使用系统图标
            if (!deleteImage) {
                // 如果系统版本不支持或没有该图标，可以加载自己的图片
                // deleteImage = [UIImage imageNamed:@"your_delete_icon_name"];
            }
            [btn setImage:deleteImage forState:UIControlStateNormal];
            // 可以调整图片颜色
            [btn setTintColor:buttonTitleColor]; // 将删除图标颜色设置为 #131313
            [btn setTitle:@"" forState:UIControlStateNormal]; // 清空标题
            
            // 添加长按手势识别器
            UILongPressGestureRecognizer *longPressGesture = [[UILongPressGestureRecognizer alloc] initWithTarget:self action:@selector(handleLongPress:)];
            longPressGesture.minimumPressDuration = 0.5; // 设置长按触发时间为0.5秒
            [btn addGestureRecognizer:longPressGesture];
        } else {
            [btn setTitle:title forState:UIControlStateNormal];
            [btn setTitleColor:buttonTitleColor forState:UIControlStateNormal];
        }
        
        [btn setBackgroundImage:normalImage forState:UIControlStateNormal];
        [btn setBackgroundImage:highlightedImage forState:UIControlStateHighlighted];
        btn.titleLabel.font = [UIFont systemFontOfSize:RXAC ? 22 : 26];
        btn.tag = i;
        [btn addTarget:self action:@selector(keyPressed:) forControlEvents:UIControlEventTouchUpInside];
        [self addSubview:btn];
    }
    
    // 添加分割线（横线row-1条，竖线col-1条）
    for (int i = 1; i < row; i++) {
        UIView *line = [[UIView alloc] init];
        line.backgroundColor = [UIColor kbColorWithHexString:self.lineColor];
        [self addSubview:line];
        [self.lines addObject:line];
    }
    for (int i = 1; i < col; i++) {
        UIView *line = [[UIView alloc] init];
        line.backgroundColor = [UIColor kbColorWithHexString:self.lineColor];
        [self addSubview:line];
        [self.lines addObject:line];
    }
    
    self.isSetup = YES;
    NSLog(@"RXKeyboard setup finished.");
}

- (void)keyPressed:(UIButton *)btn {
    NSString *title = [btn titleForState:UIControlStateNormal];
    
    if ([title isEqualToString:@"删除"] || btn.tag == 11) {
        [self.delegate rxKeyboardViewDidDelete];
    } else {
        NSString *input = [btn titleForState:UIControlStateNormal];
        if (input.length == 0 && btn.tag == 11) {
            return; // 这是删除按钮，已处理
        }
        [self.delegate rxKeyboardViewDidInput:input];
    }
}

- (void)layoutSubviews {
    [super layoutSubviews];
    
    if (!self.isSetup) {
        [self setupKeyboard];
    }
    
    int row = 4, col = 3;
    // 根据键盘的当前 bounds 计算标准按钮宽高
    CGFloat standardBtnW = self.bounds.size.width / col;
    CGFloat standardBtnH = self.bounds.size.height / row;
    
    int lineIdx = 0;
    
    for (UIView *subview in self.subviews) {
        if ([subview isKindOfClass:[UIButton class]]) {
            UIButton *btn = (UIButton *)subview;
            int r = (int)btn.tag / col;
            int c = (int)btn.tag % col;
            
            // 所有按钮都使用标准网格单元的 frame
            btn.frame = CGRectMake(c * standardBtnW, r * standardBtnH, standardBtnW, standardBtnH);

            // 根据tag调整对齐方式和图片/文字位置
            if (btn.tag == 0 && [[btn titleForState:UIControlStateNormal] isEqualToString:@"按下"]) { // 如果第一个按钮是"按下"
                btn.contentHorizontalAlignment = UIControlContentHorizontalAlignmentRight;
                btn.contentVerticalAlignment = UIControlContentVerticalAlignmentCenter;
                btn.contentEdgeInsets = UIEdgeInsetsMake(0, 0, 0, 20); // 调整右边距
                // 确保没有图片相关的内边距影响文本对齐
                 btn.imageEdgeInsets = UIEdgeInsetsZero;
                 btn.titleEdgeInsets = UIEdgeInsetsZero;
            } else if (btn.tag == 11) { // 删除按钮的tag是11
                // 删除按钮的图片固定大小为 22x22，并在按钮内部居中
                CGFloat imageSize = 24;
                // 计算图片居中所需的内边距
                CGFloat horizontalPadding = (standardBtnW - imageSize) / 2.0;
                CGFloat verticalPadding = (standardBtnH - imageSize) / 2.0;

                // 设置图片的内边距，使其固定大小并居中
                btn.imageEdgeInsets = UIEdgeInsetsMake(verticalPadding, horizontalPadding, verticalPadding, horizontalPadding);
                // 确保内容模式是 Aspect Fit
                btn.imageView.contentMode = UIViewContentModeScaleAspectFit;

                // 删除按钮没有标题，文本相关的对齐和内边距可以忽略或置零
                 btn.contentHorizontalAlignment = UIControlContentHorizontalAlignmentCenter; // 虽然只显示图片，这里也设置为居中
                 btn.contentVerticalAlignment = UIControlContentVerticalAlignmentCenter;
                 btn.contentEdgeInsets = UIEdgeInsetsZero;
                 btn.titleEdgeInsets = UIEdgeInsetsZero;

            } else {
                // 其他数字或字母按钮居中对齐
                btn.contentHorizontalAlignment = UIControlContentHorizontalAlignmentCenter;
                btn.contentVerticalAlignment = UIControlContentVerticalAlignmentCenter;
                btn.contentEdgeInsets = UIEdgeInsetsZero;
                 btn.imageEdgeInsets = UIEdgeInsetsZero; // 确保没有图片相关的内边距
                 btn.titleEdgeInsets = UIEdgeInsetsZero; // 确保没有文字相关的内边距
            }
        }
    }
    
    // 布局分割线
    lineIdx = 0;
    // 横向分割线
    for (int i = 1; i < row; i++, lineIdx++) {
        if (lineIdx < self.lines.count) {
            UIView *line = self.lines[lineIdx];
            // 使用标准按钮高度来定位横线
            line.frame = CGRectMake(0, i * standardBtnH, self.bounds.size.width, 1);
        }
    }
    // 纵向分割线
    for (int i = 1; i < col; i++, lineIdx++) {
         if (lineIdx < self.lines.count) {
            UIView *line = self.lines[lineIdx];
            // 使用标准按钮宽度来定位竖线
            line.frame = CGRectMake(i * standardBtnW, 0, 1, self.bounds.size.height);
         }
    }
}

- (UIImage *)imageWithColor:(UIColor *)color {
    CGRect rect = CGRectMake(0, 0, 1, 1);
    UIGraphicsBeginImageContext(rect.size);
    CGContextRef context = UIGraphicsGetCurrentContext();
    CGContextSetFillColorWithColor(context, color.CGColor);
    CGContextFillRect(context, rect);
    UIImage *image = UIGraphicsGetImageFromCurrentImageContext();
    UIGraphicsEndImageContext();
    return image;
}

// 处理长按手势
- (void)handleLongPress:(UILongPressGestureRecognizer *)gesture {
    if (gesture.state == UIGestureRecognizerStateBegan) {
        // 长按开始
        [self.delegate rxKeyboardViewDidBeginLongPressDelete];
    } else if (gesture.state == UIGestureRecognizerStateEnded ||
               gesture.state == UIGestureRecognizerStateCancelled) {
        // 长按结束
        [self.delegate rxKeyboardViewDidEndLongPressDelete];
    }
}

@end
