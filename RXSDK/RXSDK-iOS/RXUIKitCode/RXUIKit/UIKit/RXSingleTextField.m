//
//  RXSingleTextField.m
//  RXUIKit
//
//  Created by 陈汉 on 2025/6/24.
//

#import "RXSingleTextField.h"
#import "RXUICommonTool.h"

//#define TFY (CGRectGetHeight(self.frame) - 35) / 2
#define TFY 0

@interface RXSingleTextField ()

@property (nonatomic, assign) UIKeyboardType keyboardType;
@property (nonatomic, assign) SingleTFType type;
@property (nonatomic, assign) BOOL isSelect;
@property (nonatomic, assign) BOOL isRefresh;

@end

@implementation RXSingleTextField

- (instancetype)initWithPlaceholder:(NSString *)placeholder
                               type:(SingleTFType)type
                       keyboardType:(UIKeyboardType)keyboardType
{
    self = [super init];
    if (self) {
        self.placehoder = placeholder;
        self.keyboardType = keyboardType;
        self.type = type;
        
        [self setUI];
    }
    return self;
}

- (void)layoutSubviews
{
    _placeholderLbl.frame = CGRectMake(RXAC ? 15 : 13, 0, CGRectGetWidth(self.frame), CGRectGetHeight(self.frame));
    
    _clearBtn.frame = CGRectMake(CGRectGetWidth(self.frame) - 26, CGRectGetMidY(self.frame), 16, 16);
    
    _codeLbl.frame = CGRectMake(CGRectGetWidth(self.frame) - 50, 0, 104, CGRectGetHeight(self.frame));
    
    if (self.type == SingleTFType_pwd || self.type == SingleTFType_pwdNormal || self.type == SingleTFType_loginCode) {
        [self addSubview:[self showPwdView]];
        
        [self bringSubviewToFront:self.codeLbl];
        
//        _tf.frame = CGRectMake(10, 0, CGRectGetWidth(self.frame) - 160, CGRectGetHeight(self.frame));
    } else {
        _tf.frame = CGRectMake(RXAC ? 9 : 9, TFY, CGRectGetWidth(self.frame), CGRectGetHeight(self.frame));
    }
}

#pragma mark -- <setUI>
- (void)setUI
{
    self.layer.masksToBounds = YES;
    self.layer.cornerRadius = 5;
    self.layer.borderColor = [UIColor colorWithHexString:@"#E2F2F1"].CGColor;
    self.layer.borderWidth = 1;
    
    [self addSubview:self.tf];
    [self addSubview:self.placeholderLbl];
    [self addSubview:self.clearBtn];
    [self addSubview:self.codeLbl];
    
    if (self.type == SingleTFType_code) {
        self.codeLbl.hidden = NO;
    }
}

- (void)refreshView
{
    self.isRefresh = YES;
    [self showPwdView];
    [self showAnimate];
}

- (void)showAnimate
{
    dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(0.2 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
//        [UIView animateWithDuration:5 animations:^{
//            if (self.type = SingleTFType_pwd) {
//
//            }
//            self.line.frame = CGRectMake(0, RXAC ? 10 : 15, 1.5, CGRectGetHeight(self.bgView.frame) - (RXAC ? 20 : 30));
//    //        [self layoutSubviews];
//        }];
    });

}

- (UIView *)showPwdView
{
    if (!self.bgView) {
        self.bgView = [[UIView alloc] init];
    }
    
//    UIView *line = [[UIView alloc] init];
//    line.backgroundColor = [UIColor colorWithHexString:@"#E2F2F1"];
//    line.hidden = YES;
    
    self.showPwdBtn = [UIButton buttonWithType:UIButtonTypeCustom];
    [self.showPwdBtn setBackgroundImage:[UIImage rxBundleImageNamed:@"rx_hidepwd"] forState:UIControlStateNormal];
    self.showPwdBtn.imageView.clipsToBounds = YES;
    if (self.type == SingleTFType_pwd) {
        self.showPwdBtn.hidden = YES;
    }
    [self.showPwdBtn addTarget:self action:@selector(showPwdBtnAction:) forControlEvents:UIControlEventTouchUpInside];
    
    self.line = [[UIView alloc] init];
    self.line.backgroundColor = [UIColor colorWithHexString:@"#E2F2F1"];
    
    self.forgetPwdBtn = [UIButton buttonWithType:UIButtonTypeCustom];
    [self.forgetPwdBtn setTitle:@"忘记密码" forState:UIControlStateNormal];
    [self.forgetPwdBtn setTitleColor:[UIColor colorWithHexString:@"#74D2CB"] forState:UIControlStateNormal];
    self.forgetPwdBtn.titleLabel.font = [UIFont systemFontOfSize:16.25 weight:UIFontWeightRegular];
    [self.forgetPwdBtn addTarget:self action:@selector(forgetPwdBtnAction:) forControlEvents:UIControlEventTouchUpInside];
    
    if (!self.isRefresh) {
        [self addSubview:self.bgView];
        [self.bgView addSubview:self.showPwdBtn];
        [self.bgView addSubview:self.line];
        [self.bgView addSubview:self.forgetPwdBtn];
    }
    
    [self bringSubviewToFront:self.codeLbl];
    
    self.bgView.frame = CGRectMake([RXUICommonTool getSingleScreenWidth] - (RXAC ? 40 + 70 : 58 + 126), 0, RXAC ? 130 : 130, RXAC ? 39 : 39);
    self.showPwdBtn.frame = CGRectMake(0, RXAC ? 0 : 0, RXAC ? 36 : 39, RXAC ? 39 : 39);
    self.forgetPwdBtn.frame = CGRectMake(0, 0, 80, CGRectGetHeight(self.bgView.frame));
    _tf.frame = CGRectMake(RXAC ? 9 : 9, TFY, CGRectGetWidth(self.frame) - 140, CGRectGetHeight(self.frame));

    self.showPwdBtn.hidden = YES;
    self.forgetPwdBtn.hidden = YES;
    [self.forgetPwdBtn setTitle:@"" forState:UIControlStateNormal];
    self.codeLbl.hidden = NO;
    dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(0.01 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
        self.bgView.frame = CGRectMake(RXAC ? 186 : 166, 0, RXAC ? 130 : 130, RXAC ? 39 : 39);
    });
    self.line.frame = CGRectMake(CGRectGetMaxX(self.showPwdBtn.frame) + (RXAC ? 4 : -2), RXAC ? 11 : 11, 1.5, CGRectGetHeight(self.bgView.frame) - (RXAC ? 22 : 22));
    _tf.frame = CGRectMake(RXAC ? 10 : 9, TFY, RXAC ? 174 : 160, CGRectGetHeight(self.frame));
    _placeholderLbl.frame = CGRectMake(RXAC ? 15 : 13, 0, CGRectGetWidth(self.frame), CGRectGetHeight(self.frame));
    
    _placeholderLbl.frame = CGRectMake(RXAC ? 15 : 13, 0, 200, CGRectGetHeight(self.frame));
    _codeLbl.frame = CGRectMake(RXAC ? 228 : 200, 0, 104, CGRectGetHeight(self.frame));
    
    return self.bgView;
}

- (void)changeType:(SingleTFType)type
{
    self.type = type;
    
    [self.bgView removeFromSuperview];
    self.bgView = nil;
    
//    [self addSubview:[self showPwdView]];
    
    [self bringSubviewToFront:self.codeLbl];
}

#pragma mark -- <actiosn>
- (void)codeTapAction:(UITapGestureRecognizer *)tap
{
    if (self.clearBlock) {
        self.clearBlock();
    }
}

- (void)clearBtnAction:(UIButton *)btn
{
    _tf.text = @"";
    _placeholderLbl.hidden = NO;
}

- (void)setPlacehoder:(NSString *)placehoder
{
    self.placeholderLbl.text = placehoder;
}

- (void)showPwdBtnAction:(UIButton *)btn
{
    btn.selected = !btn.selected;
    
    if (btn.selected) {
        _tf.secureTextEntry = NO;
        [btn setBackgroundImage:[UIImage rxBundleImageNamed:@"rx_showpwd"] forState:UIControlStateNormal];
    } else {
        _tf.secureTextEntry = YES;
        [btn setBackgroundImage:[UIImage rxBundleImageNamed:@"rx_hidepwd"] forState:UIControlStateNormal];
    }
    
    if (self.showPwdBtnBlock) {
        self.showPwdBtnBlock(_tf.isSecureTextEntry);
    }
}

- (void)forgetPwdBtnAction:(UIButton *)btn
{
    if (self.type == SingleTFType_loginCode) {
        if (self.sendCodeBlock) {
            self.sendCodeBlock();
        }
    } else {
        if (self.forgetBlock) {
            self.forgetBlock();
        }
    }
}

#pragma mark -- <lazy>
- (UILabel *)placeholderLbl
{
    if (!_placeholderLbl) {
        _placeholderLbl = [[UILabel alloc] init];
        _placeholderLbl.text = self.placehoder;
        _placeholderLbl.textColor = [UIColor colorWithHexString:@"#A5CACA"];
        _placeholderLbl.font = [UIFont systemFontOfSize:16 weight:UIFontWeightRegular];
    }
    return _placeholderLbl;
}

- (UITextField *)tf
{
    if (!_tf) {
        _tf = [[UITextField alloc] init];
        _tf.textColor = [UIColor blackColor];
        _tf.tintColor = [UIColor colorWithHexString:@"#0B9E92"];
        _tf.font = [UIFont systemFontOfSize:16 weight:UIFontWeightRegular];
        _tf.keyboardType = self.keyboardType;
//        if (self.keyboardType != UIKeyboardTypeNumberPad) {
            _tf.returnKeyType = UIReturnKeyDone;
//        }
        if (self.type == SingleTFType_pwd || self.type == SingleTFType_pwdNormal) {
            _tf.secureTextEntry = YES;
        }
    }
    return _tf;
}

- (UILabel *)codeLbl
{
    if (!_codeLbl) {
        _codeLbl = [[UILabel alloc] init];
        _codeLbl.textColor = [UIColor colorWithHexString:@"#74D2CB"];
        _codeLbl.hidden = YES;
        _codeLbl.font = [UIFont systemFontOfSize:16 weight:UIFontWeightRegular];
        _codeLbl.textAlignment = NSTextAlignmentCenter;
        _codeLbl.userInteractionEnabled = YES;
        
        NSString *text = @"获取验证码";
        NSDictionary *attribtDic = @{NSUnderlineStyleAttributeName: [NSNumber numberWithInteger:NSUnderlineStyleSingle], NSUnderlineColorAttributeName:[UIColor clearColor]};

        NSMutableAttributedString *attribtStr = [[NSMutableAttributedString alloc]initWithString:text attributes:attribtDic];
        _codeLbl.attributedText = attribtStr;
        
        UITapGestureRecognizer *tap = [[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(codeTapAction:)];
        [_codeLbl addGestureRecognizer:tap];
    }
    return _codeLbl;
}

- (UIButton *)clearBtn
{
    if (!_clearBtn) {
        _clearBtn = [UIButton buttonWithType:UIButtonTypeCustom];
        _clearBtn.hidden = YES;
        [_clearBtn setImage:[UIImage rxBundleImageNamed:@"tfclose"] forState:UIControlStateNormal];
        [_clearBtn addTarget:self action:@selector(clearBtnAction:) forControlEvents:UIControlEventTouchUpInside];
    }
    return _clearBtn;
}

@end
