#import "RXKeyboardPanel.h"
#import "RXCommonTool.h"

@interface RXKeyboardPanel () <RXKeyboardViewDelegate, UITextFieldDelegate>
@property (nonatomic, strong) RXKeyboard *keyboard;
@property (nonatomic, strong) UIButton *doneBtn;
@property (nonatomic, strong) UIButton *cancelBtn;
@property (nonatomic, strong) UIButton *clearBtn;
@property (nonatomic, assign) BOOL isShow;
@property (nonatomic, strong) UIView *bgView1;
@property (nonatomic, strong) UIView *bgView2;
@property (nonatomic, strong) NSString *bgViewColor1;
@property (nonatomic, strong) NSString *bgViewColor2;
@property (nonatomic, strong) NSString *backImage;
@property (nonatomic, strong) NSString *finishImage;
@property (nonatomic, strong) NSString *unfinishImage;
@property (nonatomic, strong) NSString *deleteImage;
@property (nonatomic, strong) NSString *keyboardTextColor;
@property (nonatomic, strong) NSString *keyboardClickColor;
@property (nonatomic, strong) NSString *textColor;
@property (nonatomic, strong) NSString *placeholderColor;
@property (nonatomic, strong) NSTimer *deleteTimer;
@end

@interface UIColor (Hex)
+ (UIColor *)kbpColorWithHexString:(NSString *)hexString;
@end

@implementation UIColor (Hex)
+ (UIColor *)kbpColorWithHexString:(NSString *)hexString {
    unsigned rgbValue = 0;
    NSScanner *scanner = [NSScanner scannerWithString:hexString];
    [scanner setScanLocation:1]; // 跳过 '#'
    [scanner scanHexInt:&rgbValue];
    return [UIColor colorWithRed:((rgbValue & 0xFF0000) >> 16)/255.0 green:((rgbValue & 0xFF00) >> 8)/255.0 blue:(rgbValue & 0xFF)/255.0 alpha:1.0];
}
@end

@implementation RXKeyboardPanel

- (instancetype)init
{
    self = [super init];
    if (self) {
    }
    return self;
}

- (instancetype)initWithKeyboardStyle:(RXKeyboardStyle)keyboardStyle
{
    self = [super init];
    if (self) {
        self.bgViewColor1 = @"#E4E4E4";
        self.bgViewColor2 = @"#F1F1F1";
        self.textColor = @"#000000";
        self.backImage = @"rxkb_back";
        self.finishImage = @"rxkb_finish";
        self.unfinishImage = @"rxkb_unfinish";
        self.deleteImage = @"rxkb_delete";
        self.keyboardTextColor = @"#131313";
        self.keyboardClickColor = @"#F9F9F9";
        
        if (keyboardStyle == RXKeyboardStyleLight) {
            self.bgViewColor1 = @"#D2F0F6";
            self.bgViewColor2 = @"#E3F4F7";
            self.textColor = @"#05403B";
            self.backImage = @"rxkb_back_light";
            self.finishImage = @"rxkb_finish_light";
            self.unfinishImage = @"rxkb_unfinish_light";
            self.deleteImage = @"rxkb_delete_light";
            self.keyboardTextColor = @"#05403B";
            self.keyboardClickColor = @"#EDF8FA";
        }

        // 创建 bgView1 (输入框和按钮的背景视图)
        _bgView1 = [[UIView alloc] init];
        _bgView1.backgroundColor = [UIColor kbpColorWithHexString:self.bgViewColor1]; // #E4E4E4
        [self addSubview:_bgView1];

        // 创建 bgView2 (键盘的背景视图)
        _bgView2 = [[UIView alloc] init];
        _bgView2.backgroundColor = [UIColor kbpColorWithHexString:self.bgViewColor2]; // #F1F1F1
        [self addSubview:_bgView2];

        // 初始化控件，并添加到相应的 bgView 中
        _textField = [[UITextField alloc] init];
        _textField.layer.cornerRadius = 4;
        _textField.font = [UIFont systemFontOfSize:19];
        _textField.placeholder = @"请输入……";
        _textField.delegate = self;
        _textField.backgroundColor = [UIColor whiteColor];
        _textField.tintColor = [UIColor kbpColorWithHexString:self.textColor];
        _textField.textColor = [UIColor kbpColorWithHexString:self.textColor];
        _textField.inputView = [[UIView alloc] init];
        _textField.textAlignment = NSTextAlignmentLeft;
        
        // 设置 placeholder 颜色
        NSAttributedString *attributedPlaceholder = [[NSAttributedString alloc] initWithString:@"请输入……"
                                                                                   attributes:@{NSForegroundColorAttributeName: [UIColor kbpColorWithHexString:@"#ADADAD"]}];
        _textField.attributedPlaceholder = attributedPlaceholder;
        
        // 添加左右内边距
        UIView *leftPaddingView = [[UIView alloc] initWithFrame:CGRectMake(0, 0, 10, 0)];
        UIView *rightPaddingView = [[UIView alloc] initWithFrame:CGRectMake(0, 0, 50, 0)];
        _textField.leftView = leftPaddingView;
        _textField.rightView = rightPaddingView;
        _textField.leftViewMode = UITextFieldViewModeAlways;
        _textField.rightViewMode = UITextFieldViewModeAlways;
        
        _clearBtn = [UIButton buttonWithType:UIButtonTypeCustom];
//        [_clearBtn setImage:[UIImage rxPBundleImageNamed:@"rxkb_clear_light"] forState:normal];
        [_clearBtn setTitle:@"清空" forState:normal];
        [_clearBtn setTitleColor:[UIColor kbpColorWithHexString:@"#ADADAD"] forState:normal];
        _clearBtn.hidden = YES;
        [_clearBtn addTarget:self action:@selector(clearBtnAction) forControlEvents:UIControlEventTouchUpInside];
        [_textField addSubview:_clearBtn];
        
        // 监听文本变化
        [_textField addTarget:self action:@selector(textFieldDidChange:) forControlEvents:UIControlEventEditingChanged];
        [_bgView1 addSubview:_textField];

        // 确定按钮
        _doneBtn = [UIButton buttonWithType:UIButtonTypeCustom]; // 改为 Custom 类型
        // [_doneBtn setTitle:@"完成" forState:UIControlStateNormal]; // 移除标题
        // [_doneBtn setTitleColor:[UIColor colorWithRed:19/255.0 green:19/255.0 blue:19/255.0 alpha:1.0] forState:UIControlStateNormal]; // 移除标题颜色
        // [_doneBtn setTitleColor:[UIColor colorWithRed:249/255.0 green:249/255.0 blue:249/255.0 alpha:1.0] forState:UIControlStateHighlighted]; // 移除高亮标题颜色
        [_doneBtn addTarget:self action:@selector(donePressed) forControlEvents:UIControlEventTouchUpInside];
        [_bgView1 addSubview:_doneBtn]; // 添加到 bgView1

        // 取消按钮
        _cancelBtn = [UIButton buttonWithType:UIButtonTypeCustom]; // 改为 Custom 类型
        // [_cancelBtn setTitle:@"取消" forState:UIControlStateNormal]; // 移除标题
        // [_cancelBtn setTitleColor:[UIColor colorWithRed:19/255.0 green:19/255.0 blue:19/255.0 alpha:1.0] forState:UIControlStateNormal]; // 移除标题颜色
        // [_cancelBtn setTitleColor:[UIColor colorWithRed:249/255.0 green:249/255.0 blue:249/255.0 alpha:1.0] forState:UIControlStateHighlighted]; // 移除高亮标题颜色
        [_cancelBtn addTarget:self action:@selector(cancelPressed) forControlEvents:UIControlEventTouchUpInside];
        [_bgView1 addSubview:_cancelBtn]; // 添加到 bgView1
        
        // 设置取消按钮图片 (假设 rxkb_back 是取消按钮的图标)
        [_cancelBtn setImage:[UIImage rxPBundleImageNamed:self.backImage] forState:UIControlStateNormal];

        _keyboard = [[RXKeyboard alloc] initWithKeyboardTextColor:self.keyboardTextColor keyboardClickColor:self.keyboardClickColor deleteImage:self.deleteImage lineColor:self.bgViewColor2];
        _keyboard.keyboardTextColor = self.keyboardTextColor;
        _keyboard.keyboardClickColor = self.keyboardClickColor;
        _keyboard.deleteImage = self.deleteImage;
        _keyboard.delegate = self;
        [_bgView2 addSubview:_keyboard]; // 添加到 bgView2
        
        // 设置默认动画时间
        self.animationDuration = 0.25;

        UITapGestureRecognizer *tap = [[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(tapAction:)];
        UITapGestureRecognizer *tap1 = [[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(tapAction:)];
        [_bgView1 addGestureRecognizer:tap];
        [_bgView2 addGestureRecognizer:tap1];
        
        // 监听屏幕旋转
        [[NSNotificationCenter defaultCenter] addObserver:self
                                                 selector:@selector(onOrientationChange)
                                                     name:UIDeviceOrientationDidChangeNotification
                                                   object:nil];
    }
    return self;
}

- (void)tapAction:(UITapGestureRecognizer *)tap
{
    
}

- (void)dealloc {
    [[NSNotificationCenter defaultCenter] removeObserver:self];
    // 移除对 textField 的监听
    [_textField removeTarget:self action:@selector(textFieldDidChange:) forControlEvents:UIControlEventEditingChanged];
    // 确保定时器被释放
    [self.deleteTimer invalidate];
    self.deleteTimer = nil;
}

// 横竖屏切换时重新布局
- (void)onOrientationChange {
    UIInterfaceOrientation orientation = [UIApplication sharedApplication].statusBarOrientation;
    switch (orientation) {
        case UIInterfaceOrientationLandscapeLeft:
            NSLog(@"屏幕向左橫置");
            break;
            
        case UIInterfaceOrientationLandscapeRight:
            NSLog(@"屏幕向右橫置");
            break;
            
        case UIInterfaceOrientationPortrait:
            NSLog(@"屏幕直立");
            break;
            
        case UIInterfaceOrientationPortraitUpsideDown:
            NSLog(@"屏幕直立，上下顛倒");
            break;
            
        default:
            NSLog(@"无法识别");
            break;
    }
    
//    [self setNeedsLayout];
//    [self layoutIfNeeded];
//    // 保证panel始终贴在底部 (这里的 panelHeight 计算需要调整，使用 calculatedPanelHeight)
//    if (self.superview) {
//        UIEdgeInsets safeInsets = UIEdgeInsetsZero;
//        if (@available(iOS 11.0, *)) {
//            safeInsets = self.safeAreaInsets;
//        }
//        CGFloat standardTopAreaHeight = 6 + 44 + 6; // topMargin + textFieldHeight + topMargin
//        CGFloat standardKeyboardHeight = 4 * 50;
//        CGFloat calculatedPanelHeight = standardTopAreaHeight + standardKeyboardHeight + safeInsets.bottom;
//
//        self.frame = CGRectMake(0, self.superview.bounds.size.height - calculatedPanelHeight, self.superview.bounds.size.width, calculatedPanelHeight);
//    }
}

- (void)layoutSubviews {
    [super layoutSubviews];
    CGFloat panelWidth = self.bounds.size.width;
    CGFloat btnWidth = 44; // 按钮固定尺寸
    CGFloat btnHeight = 44; // 按钮固定尺寸
    // CGFloat btnSpacing = 8; // 这个变量在bgView1的布局中不再使用
    CGFloat textFieldHeight = 44;
    CGFloat topMargin = 9;

    // 获取安全区
    UIEdgeInsets safeInsets = UIEdgeInsetsZero;
    if (@available(iOS 11.0, *)) {
        safeInsets = self.safeAreaInsets;
    }
    
    // 获取当前界面方向 - 此变量在bgView1布局中未直接使用，保留
    UIInterfaceOrientation orientation = [UIApplication sharedApplication].statusBarOrientation;
    
    // 计算 bgView1 的 frame (顶部区域)
    CGFloat standardTopAreaHeight = topMargin + textFieldHeight + topMargin; // 6 + 44 + 6 = 56
    _bgView1.frame = CGRectMake(0, 0, panelWidth, standardTopAreaHeight);

    // 计算 bgView2 的 frame (键盘区域)
    CGFloat keyboardHeight = self.bounds.size.height - standardTopAreaHeight; // bgView2 高度占据剩余垂直空间，减去底部安全区
    _bgView2.frame = CGRectMake(0, standardTopAreaHeight, panelWidth, keyboardHeight);

    // --- 布局 bgView1 内部的控件 (取消按钮、输入框、确定按钮) ---
    CGFloat bg1_Width = _bgView1.bounds.size.width;
    
    // 定义间距
    // 使用和键盘相同的左右边距来实现对齐
    CGFloat horizontalPadding = RXAC ? 126 : 8;
    CGFloat interButtonSpacing = 8; // 按钮与输入框之间的间距

    // 垂直居中Y坐标
    CGFloat centerY_bg1 = topMargin + textFieldHeight / 2.0; // bgView1 垂直中心y坐标

    // 计算取消按钮的 frame (左侧)
    CGFloat cancelBtnX = horizontalPadding;
    _cancelBtn.frame = CGRectMake(cancelBtnX, centerY_bg1 - btnHeight/2.0, 0, btnHeight);

    // 计算确定按钮的 frame (右侧)
    CGFloat doneBtnX = bg1_Width - horizontalPadding - btnWidth;
    _doneBtn.frame = CGRectMake(doneBtnX, centerY_bg1 - btnHeight/2.0, btnWidth, btnHeight);

    // 计算输入框的 frame (在取消按钮和确定按钮之间)
    CGFloat textFieldX_bg1 = CGRectGetMaxX(_cancelBtn.frame);
    CGFloat textFieldRightX = _doneBtn.frame.origin.x - interButtonSpacing; // 输入框右侧 x 坐标是确定按钮左侧减去间距
    CGFloat textFieldWidth_bg1 = textFieldRightX - textFieldX_bg1;

    _textField.frame = CGRectMake(textFieldX_bg1, centerY_bg1 - textFieldHeight/2.0, textFieldWidth_bg1, textFieldHeight);

    CGFloat clearBtnW = CGRectGetHeight(_textField.frame) - 15;
//    _clearBtn.frame = CGRectMake(CGRectGetWidth(_textField.frame) - 38, 7.5, clearBtnW, clearBtnW);
    _clearBtn.frame = CGRectMake(CGRectGetWidth(_textField.frame) - 50, 0, 50, textFieldHeight);

    // --- 布局 bgView2 内部的键盘 ---
    CGFloat bg2_Width = _bgView2.bounds.size.width;
    CGFloat bg2_Height = _bgView2.bounds.size.height;
    // 键盘左右间距 108 (相对于 bgView2 内部) - 这里保持原样，它们用于计算键盘自身的宽度
    CGFloat leftMargin_bg2 = RXAC ? 126 : 8;
    CGFloat rightMargin_bg2 = RXAC ? 126 : 8;

    CGFloat keyboardWidth_bg2 = bg2_Width - leftMargin_bg2 - rightMargin_bg2;
    
    _keyboard.frame = CGRectMake(leftMargin_bg2, 8, keyboardWidth_bg2, bg2_Height - safeInsets.bottom - (RXAC ? 16 : 8)); // 键盘 x 坐标从 leftMargin_bg2 开始，宽度为 keyboardWidth_bg2，y 坐标从 8 开始，高度减去底部安全区和8的间隔

    // 调整 showInView 和 hide 中的 panelHeight calculation
    // panelHeight 应该等于 顶部 bgView1 高度 + 标准键盘高度 + 底部安全区
    // bgView1 的标准高度就是 standardTopAreaHeight
    CGFloat standardKeyboardHeight = 4 * 50; // 标准键盘区域高度 (不含bgView2上下padding和safearea)
    CGFloat calculatedPanelHeight = standardTopAreaHeight + standardKeyboardHeight + 8 + safeInsets.bottom; // 顶部区域 + 标准键盘高度 + 键盘区域底部padding + 底部安全区
    self.keyboardHeight = calculatedPanelHeight;
    
    // 注意：layoutSubviews 可能会在旋转或其他布局变化时多次调用，确保 bgView1 和 bgView2 已经被创建。
    // 它们在 initWithFrame 中创建，所以这里不用担心 nil。
    
    // 首次布局或旋转后更新按钮状态
    [self updateDoneButtonState];
}

#pragma mark - Show/Hide

- (void)setDefaultText:(NSString *)defaultText {
    _defaultText = defaultText;
    self.textField.text = defaultText;
    // 设置光标位置到文本末尾
    if (defaultText.length > 0) {
        UITextPosition *endPosition = [self.textField positionFromPosition:self.textField.beginningOfDocument offset:defaultText.length];
        self.textField.selectedTextRange = [self.textField textRangeFromPosition:endPosition toPosition:endPosition];
    }
    // 设置默认文本后更新按钮状态
    [self updateDoneButtonState];
}

- (void)showInView:(UIView *)parentView {
    @try {
        if (self.isShow) {
            return;
        }
        
        self.isShow = YES;
        
        // Recalculate panel height based on current orientation and safe area
        UIEdgeInsets safeInsets = UIEdgeInsetsZero;
        if (@available(iOS 11.0, *)) {
            safeInsets = self.safeAreaInsets;
        }
        CGFloat standardTopAreaHeight = 6 + 44 + 6; // topMargin + textFieldHeight + topMargin
        CGFloat standardKeyboardHeight = 4 * (RXAC ? 43 : 66);
        CGFloat calculatedPanelHeight = standardTopAreaHeight + standardKeyboardHeight + 8 + safeInsets.bottom + (RXAC ? 16 : 8); // 顶部区域 + 标准键盘高度 + 键盘区域底部padding + 底部安全区
        self.keyboardHeight = calculatedPanelHeight;
        
        self.frame = CGRectMake(0, parentView.bounds.size.height, parentView.bounds.size.width, calculatedPanelHeight);
        [parentView addSubview:self];

        if (self.animationDuration == 0) {
            self.animationDuration = 0.25;
        }
        
        [UIView animateWithDuration:self.animationDuration delay:0 options:UIViewAnimationOptionCurveEaseOut animations:^{
            self.frame = CGRectMake(0, parentView.bounds.size.height - calculatedPanelHeight, parentView.bounds.size.width, calculatedPanelHeight);
        } completion:^(BOOL finished) {
            
        }];
        
        [self.delegate rxKeyboardPanelDidShow];

        [self.textField becomeFirstResponder];
        
        // 显示面板后更新按钮状态
        [self updateDoneButtonState];
    } @catch (NSException *exception) {
        NSLog(@"%@", exception);
    } @finally {
        
    }
}

- (void)hide {
    
    @try {
        self.isShow = NO;
        
        // Recalculate panel height based on current orientation and safe area
        UIEdgeInsets safeInsets = UIEdgeInsetsZero;
        if (@available(iOS 11.0, *)) {
            safeInsets = self.safeAreaInsets;
        }
        CGFloat standardTopAreaHeight = 6 + 44 + 6; // topMargin + textFieldHeight + topMargin
        CGFloat standardKeyboardHeight = 4 * 50;
        CGFloat calculatedPanelHeight = standardTopAreaHeight + standardKeyboardHeight + 8 + safeInsets.bottom; // 顶部区域 + 标准键盘高度 + 键盘区域底部padding + 底部安全区

        if (self.animationDuration == 0) {
            self.animationDuration = 0.25;
        }
        
        [UIView animateWithDuration:self.animationDuration delay:0 options:UIViewAnimationOptionCurveEaseIn animations:^{
            self.frame = CGRectMake(0, self.superview.bounds.size.height, self.superview.bounds.size.width, calculatedPanelHeight);
        } completion:^(BOOL finished) {
            [self removeFromSuperview];
        }];
        
        [self.delegate rxKeyboardPanelDidHide];
    } @catch (NSException *exception) {
        NSLog(@"%@", exception);
    } @finally {
        
    }
}

#pragma mark - RXKeyboardDelegate

- (void)rxKeyboardViewDidInput:(NSString *)input {
    @try {
        // 处理输入和删除时更新按钮状态
    //    NSString *currentText = self.textField.text;
    //    UITextRange *selectedRange = self.textField.selectedTextRange;
    //    NSInteger cursorOffset = [self.textField offsetFromPosition:self.textField.beginningOfDocument toPosition:selectedRange.start];
    //
    //    NSMutableString *newText = [NSMutableString stringWithString:currentText ?: @""];
    //    [newText insertString:input atIndex:cursorOffset];
    //    self.textField.text = newText;
        [self.textField insertText:input];

    //    // 更新光标位置
    //    UITextPosition *newPosition = [self.textField positionFromPosition:self.textField.beginningOfDocument offset:cursorOffset + input.length];
    //    self.textField.selectedTextRange = [self.textField textRangeFromPosition:newPosition toPosition:newPosition];

        // 转发代理方法
        [self.delegate rxKeyboardPanelDidInput:input];
        [self updateDoneButtonState]; // 输入后更新状态
    } @catch (NSException *exception) {
        NSLog(@"%@", exception);
    } @finally {
        
    }
}

- (void)rxKeyboardViewDidDelete {
    @try {
        [self.textField deleteBackward];
        
        // 转发代理方法
        [self.delegate rxKeyboardPanelDidDelete];
        [self updateDoneButtonState];
    } @catch (NSException *exception) {
        NSLog(@"%@", exception);
    } @finally {
        
    }

}

// 添加长按开始删除方法
- (void)rxKeyboardViewDidBeginLongPressDelete {
    // 创建定时器，每0.1秒执行一次删除
    self.deleteTimer = [NSTimer scheduledTimerWithTimeInterval:0.1 
                                                      target:self 
                                                    selector:@selector(handleDeleteTimer:) 
                                                    userInfo:nil 
                                                     repeats:YES];
}

// 添加长按结束删除方法
- (void)rxKeyboardViewDidEndLongPressDelete {
    // 停止并释放定时器
    [self.deleteTimer invalidate];
    self.deleteTimer = nil;
}

// 处理定时器触发的删除操作
- (void)handleDeleteTimer:(NSTimer *)timer {
    [self rxKeyboardViewDidDelete];
}

- (void)rxKeyboardViewDidFinish {
    @try {
        NSString *result = self.textField.text;
        // 只有当按钮enabled时才触发完成操作
        if (self.doneBtn.enabled) {
            [self hide];
            // 转发代理方法，传入当前输入结果
            [self.delegate rxKeyboardPanelDidFinish:result];
        }
    } @catch (NSException *exception) {
        NSLog(@"%@", exception);
    } @finally {
        
    }

}

- (void)rxKeyboardViewDidCancel {
    @try {
        self.textField.text = @"";
        [self hide];
        // 转发代理方法
        [self.delegate rxKeyboardPanelDidCancel];
    } @catch (NSException *exception) {
        NSLog(@"%@", exception);
    } @finally {
        
    }
}

#pragma mark - UITextFieldDelegate

- (BOOL)textFieldShouldBeginEditing:(UITextField *)textField {
    return YES;
}

- (void)textFieldDidBeginEditing:(UITextField *)textField {
    // 如果有默认文本，光标位置在末尾；否则在开始位置
    if (textField.text.length > 0) {
        UITextPosition *endPosition = [textField positionFromPosition:textField.beginningOfDocument offset:textField.text.length];
        textField.selectedTextRange = [textField textRangeFromPosition:endPosition toPosition:endPosition];
    } else {
        [textField setSelectedTextRange:[textField textRangeFromPosition:textField.beginningOfDocument toPosition:textField.beginningOfDocument]];
    }
     [self updateDoneButtonState]; // 开始编辑时更新按钮状态
}

// 监听 TextField 文本变化的方法
- (void)textFieldDidChange:(UITextField *)textField {
    [self updateDoneButtonState];
}


#pragma mark - 按钮状态更新

- (void)updateDoneButtonState {
    BOOL hasText = self.textField.text.length > 0;
    self.doneBtn.enabled = hasText;
    
    UIImage *image = hasText ? [UIImage rxPBundleImageNamed:self.finishImage] : [UIImage rxPBundleImageNamed:self.unfinishImage];
    [self.doneBtn setImage:image forState:UIControlStateNormal];
    
    self.clearBtn.hidden = !hasText;
    
    // 根据 enabled 状态调整图片颜色或透明度（如果需要）
    // self.doneBtn.tintColor = hasText ? [UIColor blueColor] : [UIColor grayColor];
    // self.doneBtn.alpha = hasText ? 1.0 : 0.5;
}


#pragma mark - 按钮事件

- (void)donePressed {
    [self rxKeyboardViewDidFinish];
}
- (void)cancelPressed {
    [self rxKeyboardViewDidCancel];
}

- (void)clearBtnAction {
    self.textField.text = @"";
    
    [self updateDoneButtonState];
}

@end
