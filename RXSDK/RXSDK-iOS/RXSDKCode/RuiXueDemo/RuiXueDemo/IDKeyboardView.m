#import "IDKeyboardView.h"

@implementation IDKeyboardView

- (instancetype)initWithFrame:(CGRect)frame {
    self = [super initWithFrame:frame];
    if (self) {
        [self setupKeyboard];
    }
    return self;
}

- (void)setupKeyboard {
    // 按钮标题
    NSArray *titles = @[@"1",@"2",@"3",
                        @"4",@"5",@"6",
                        @"7",@"8",@"9",
                        @"X",@"0",@"←"];
    int row = 4, col = 3;
    CGFloat btnW = self.bounds.size.width / col;
    CGFloat btnH = 50;
    for (int i = 0; i < titles.count; i++) {
        int r = i / col, c = i % col;
        UIButton *btn = [UIButton buttonWithType:UIButtonTypeSystem];
        btn.frame = CGRectMake(c * btnW, r * btnH, btnW, btnH);
        [btn setTitle:titles[i] forState:UIControlStateNormal];
        btn.titleLabel.font = [UIFont systemFontOfSize:24];
        btn.tag = i;
        [btn addTarget:self action:@selector(keyPressed:) forControlEvents:UIControlEventTouchUpInside];
        [self addSubview:btn];
    }
    // 完成和取消按钮
    UIButton *doneBtn = [UIButton buttonWithType:UIButtonTypeSystem];
    doneBtn.frame = CGRectMake(self.bounds.size.width - 100, 0, 50, 40);
    [doneBtn setTitle:@"完成" forState:UIControlStateNormal];
    [doneBtn addTarget:self action:@selector(donePressed) forControlEvents:UIControlEventTouchUpInside];
    [self addSubview:doneBtn];

    UIButton *cancelBtn = [UIButton buttonWithType:UIButtonTypeSystem];
    cancelBtn.frame = CGRectMake(self.bounds.size.width - 50, 0, 50, 40);
    [cancelBtn setTitle:@"取消" forState:UIControlStateNormal];
    [cancelBtn addTarget:self action:@selector(cancelPressed) forControlEvents:UIControlEventTouchUpInside];
    [self addSubview:cancelBtn];
}

- (void)keyPressed:(UIButton *)btn {
    if (btn.tag == 11) { // 删除
        if ([self.delegate respondsToSelector:@selector(idKeyboardViewDidDelete)]) {
            [self.delegate idKeyboardViewDidDelete];
        }
    } else {
        NSString *input = [btn titleForState:UIControlStateNormal];
        if ([self.delegate respondsToSelector:@selector(idKeyboardViewDidInput:)]) {
            [self.delegate idKeyboardViewDidInput:input];
        }
    }
}

- (void)donePressed {
    if ([self.delegate respondsToSelector:@selector(idKeyboardViewDidFinish)]) {
        [self.delegate idKeyboardViewDidFinish];
    }
}

- (void)cancelPressed {
    if ([self.delegate respondsToSelector:@selector(idKeyboardViewDidCancel)]) {
        [self.delegate idKeyboardViewDidCancel];
    }
}

@end 