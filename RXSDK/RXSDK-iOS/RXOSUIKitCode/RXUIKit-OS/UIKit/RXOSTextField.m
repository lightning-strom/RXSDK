//
//  RXOSTextField.m
//  RXUIKit-OS
//
//  Created by 陈汉 on 2023/6/15.
//

#import "RXOSTextField.h"
#import "RXOSCommonTool.h"
#import "RXOSAreaBtn.h"
#import "RXCountryList.h"
#import "RXOSUIKitService.h"

#define TFY 0
#define BGH RXAC ? 36 : 46
#define BGW [RXOSCommonTool getScreenWidth] - (RXAC ? 59 : 50)

@interface RXOSTextField ()

@property (nonatomic, assign) UIKeyboardType keyboardType;
@property (nonatomic, assign) TFType type;
@property (nonatomic, assign) BOOL isSelect;
@property (nonatomic, assign) BOOL isRefresh;
@property (nonatomic, strong) UIView *bgView;
@property (nonatomic, strong) RXOSAreaBtn *areaBtn;

@end

@implementation RXOSTextField

- (instancetype)initWithPlaceholder:(NSString *)placeholder
                               type:(TFType)type
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
//    _clearBtn.frame = CGRectMake(BGW - 26, CGRectGetMidY(self.frame), 16, 16);
//    
////    _codeLbl.frame = CGRectMake(BGW - 101, 0, 104, BGH);
//    
//    if (self.type == TFType_pwdNormal) {
//        [self addSubview:self.bgView];
//        [self bringSubviewToFront:self.showPwdBtn];
//        [self bringSubviewToFront:_tf];
//        
//        if ([RXOSCommonTool isRTL]) {
//            _bgView.frame = CGRectMake(0, TFY, BGW, BGH);
//            _tf.frame = CGRectMake(RXAC ? 36 + 4 : 39 + 4, TFY, BGW - (RXAC ? 36 + 4 : 39 + 4), BGH);
//            UIView *tfRightView = [[UIView alloc] initWithFrame:CGRectMake(0, 0, 9, BGH)];
//            _tf.rightView = tfRightView;
//            _tf.rightViewMode = UITextFieldViewModeAlways;
//            _placeholderLbl.frame = CGRectMake(CGRectGetMinX(_tf.frame), 0, CGRectGetWidth(_tf.frame) - 12, BGH);
//            _showPwdBtn.frame = CGRectMake(4, RXAC ? 0 : 3, RXAC ? 36 : 39, RXAC ? 36 : 39);
//        } else {
//            _bgView.frame = CGRectMake(0, TFY, BGW, BGH);
//            _tf.frame = CGRectMake(0, TFY, BGW - (RXAC ? 36 : 39), BGH);
//            UIView *tfLeftView = [[UIView alloc] initWithFrame:CGRectMake(0, 0, 9, BGH)];
//            _tf.leftView = tfLeftView;
//            _tf.leftViewMode = UITextFieldViewModeAlways;
//            _placeholderLbl.frame = CGRectMake(RXAC ? 15 : 13, 0, BGW, BGH);
//            _showPwdBtn.frame = CGRectMake(CGRectGetMaxX(self.bgView.frame) - 4 - (RXAC ? 36 : 39), RXAC ? 0 : 3, RXAC ? 36 : 39, RXAC ? 36 : 39);
//        }
//  
//    } else if (self.type == TFType_loginCode) {
//        if ([RXOSUserUtility sharedManager].isCodeTFLoad) {
//            return;
//        }
////        [self addSubview:[self showPwdView]];
//        
//        self.codeLbl.hidden = NO;
//        
//        self.layer.masksToBounds = NO;
//        self.layer.cornerRadius = 0;
//        self.layer.borderColor = [UIColor clearColor].CGColor;
//        self.layer.borderWidth = 0;
//        
//        self.tf.layer.masksToBounds = YES;
//        self.tf.layer.cornerRadius = 5;
//        self.tf.layer.borderColor = [UIColor colorWithHexString:@"#E2F2F1"].CGColor;
//        self.tf.layer.borderWidth = 1;
//        
//        CGFloat btnW = [self.codeLbl.text widthForFont:self.codeLbl.font] - 14;
//        CGFloat bgW = [RXOSCommonTool getScreenWidth] - (RXAC ? 59 : 50);
//
//        if ([RXOSCommonTool isRTL]) {
//            btnW = [self.codeLbl.text widthForFont:self.codeLbl.font] - 38;
//            [self bringSubviewToFront:_tf];
//            _tf.frame = CGRectMake(btnW + 2, TFY, BGW - btnW - 2, BGH);
//            UIView *tfRightView = [[UIView alloc] initWithFrame:CGRectMake(0, 0, 9, BGH)];
//            _tf.rightView = tfRightView;
//            _tf.rightViewMode = UITextFieldViewModeAlways;
//            _placeholderLbl.frame = CGRectMake(CGRectGetMinX(_tf.frame), 0, CGRectGetWidth(_tf.frame) - (RXAC ? 13 : 13), BGH);
//            _codeLbl.frame = CGRectMake(0, 0, btnW, BGH);
//        } else {
//            _tf.frame = CGRectMake(0, TFY, bgW - btnW - 18, BGH);
//            UIView *tfLeftView = [[UIView alloc] initWithFrame:CGRectMake(0, 0, 9, BGH)];
//            _tf.leftView = tfLeftView;
//            _tf.leftViewMode = UITextFieldViewModeAlways;
//            _placeholderLbl.frame = CGRectMake(RXAC ? 15 : 13, 0, BGW, BGH);
//            _codeLbl.frame = CGRectMake(CGRectGetMaxX(self.tf.frame) + 4, 0, btnW + 14, BGH);
//        }
//    } else if (self.type == TFType_pwd) {
//        [self addSubview:self.bgView];
//        [self bringSubviewToFront:self.showPwdBtn];
//        
//        CGFloat btnW = [[RXLocation osLaunguage:_forgetPwdBtn.titleLabel.text] widthForFont:_forgetPwdBtn.titleLabel.font];
//        CGFloat bgW = [RXOSCommonTool getScreenWidth] - (RXAC ? 59 : 50);
//
//        self.layer.masksToBounds = NO;
//        self.layer.cornerRadius = 0;
//        self.layer.borderColor = [UIColor clearColor].CGColor;
//        self.layer.borderWidth = 0;
//        
//        self.bgView.layer.masksToBounds = YES;
//        self.bgView.layer.cornerRadius = 5;
//        self.bgView.layer.borderColor = [UIColor colorWithHexString:@"#E2F2F1"].CGColor;
//        self.bgView.layer.borderWidth = 1;
//        
//        self.bgView.frame = CGRectMake(0, TFY, bgW - btnW - 6, BGH);
//        
//        if ([RXOSCommonTool isRTL]) {
//            [self bringSubviewToFront:_tf];
//            _bgView.frame = CGRectMake(btnW + 6, TFY, bgW - btnW - 6, BGH);
//            _tf.frame = CGRectMake(RXAC ? 36 - 2: 39, TFY, bgW - btnW - 4 - (RXAC ? 36 : 39), BGH);
//            UIView *tfRightView = [[UIView alloc] initWithFrame:CGRectMake(0, 0, 9, BGH)];
//            _tf.rightView = tfRightView;
//            _tf.rightViewMode = UITextFieldViewModeAlways;
//            _placeholderLbl.frame = CGRectMake(CGRectGetMinX(_bgView.frame), 0, CGRectGetWidth(_tf.frame) + 25, BGH);
//            _forgetPwdBtn.frame = CGRectMake(0, 0, btnW, BGH);
//            _showPwdBtn.frame = CGRectMake(CGRectGetMinX(_bgView.frame), RXAC ? 0 : 3, RXAC ? 36 : 39, RXAC ? 36 : 39);
//        } else {
//            _bgView.frame = CGRectMake(0, TFY, bgW - btnW - 4, BGH);
//            _tf.frame = CGRectMake(0, TFY, bgW - btnW - 6 - (RXAC ? 36 : 39), BGH);
//            UIView *tfLeftView = [[UIView alloc] initWithFrame:CGRectMake(0, 0, 9, BGH)];
//            _tf.leftView = tfLeftView;
//            _tf.leftViewMode = UITextFieldViewModeAlways;
//            _placeholderLbl.frame = CGRectMake(RXAC ? 15 : 13, 0, BGW, BGH);
//            _forgetPwdBtn.frame = CGRectMake(CGRectGetMaxX(self.bgView.frame) + 4, 0, btnW, BGH);
//            _showPwdBtn.frame = CGRectMake(CGRectGetMaxX(self.bgView.frame) - 4 - (RXAC ? 36 : 39), RXAC ? 0 : 3, RXAC ? 36 : 39, RXAC ? 36 : 39);
//        }
//    } else if (self.type == TFType_loginArea) {
//        
//        
//    } else if (self.type == TFType_code) {
//        _tf.frame = CGRectMake(10, TFY, BGW - 10, BGH);
//        _placeholderLbl.frame = CGRectMake(RXAC ? 15 : 13, 0, BGW - 10, BGH);
//        
//        CGFloat codeW = [[RXLocation osLaunguage:_codeLbl.text] widthForFont:_codeLbl.font] + 1;
//        _codeLbl.frame = CGRectMake(BGW - codeW - 14, 0, codeW, RXAC ? 36 : 46);
//    } else {
//        if ([RXOSCommonTool isRTL]) {
//            _tf.frame = CGRectMake(10, TFY, BGW - 10, BGH);
//            UIView *tfRightView = [[UIView alloc] initWithFrame:CGRectMake(0, 0, 9, BGH)];
//            _tf.rightView = tfRightView;
//            _tf.rightViewMode = UITextFieldViewModeAlways;
//            _placeholderLbl.frame = CGRectMake(RXAC ? 15 : 13, 0, CGRectGetWidth(_tf.frame)  - (RXAC ? 15 : 13), BGH);
//        } else {
//            _tf.frame = CGRectMake(10, TFY, BGW - 10, BGH);
//            _placeholderLbl.frame = CGRectMake(RXAC ? 15 : 13, 0, BGW, BGH);
//        }
//    }
}

#pragma mark -- <setUI>
- (void)setUI
{
    self.layer.masksToBounds = YES;
    self.layer.cornerRadius = 5;
    self.layer.borderColor = [UIColor colorWithHexString:@"#E2F2F1"].CGColor;
    self.layer.borderWidth = 1;
    
    if (self.type == TFType_pwd) {
        [self.bgView addSubview:self.tf];
    } else {
        [self addSubview:self.tf];
    }
    
    [self addSubview:self.placeholderLbl];
    [self addSubview:self.clearBtn];
    [self addSubview:self.codeLbl];
    [self addSubview:self.forgetPwdBtn];
    [self addSubview:self.showPwdBtn];
    
    if (self.type == TFType_code) {
        self.codeLbl.hidden = NO;
    }
    
    _clearBtn.frame = CGRectMake(BGW - 26, CGRectGetMidY(self.frame), 16, 16);
    
//    _codeLbl.frame = CGRectMake(BGW - 101, 0, 104, BGH);
    
    if (self.type == TFType_pwdNormal) {
        [self addSubview:self.bgView];
        [self bringSubviewToFront:self.showPwdBtn];
        [self bringSubviewToFront:_tf];
        
        if ([RXOSCommonTool isRTL]) {
            _bgView.frame = CGRectMake(0, TFY, BGW, BGH);
            _tf.frame = CGRectMake(RXAC ? 36 + 4 : 39 + 4, TFY, BGW - (RXAC ? 36 + 4 : 39 + 4), BGH);
            UIView *tfRightView = [[UIView alloc] initWithFrame:CGRectMake(0, 0, 9, BGH)];
            _tf.rightView = tfRightView;
            _tf.rightViewMode = UITextFieldViewModeAlways;
            _placeholderLbl.frame = CGRectMake(CGRectGetMinX(_tf.frame), 0, CGRectGetWidth(_tf.frame) - 12, BGH);
            _showPwdBtn.frame = CGRectMake(4, RXAC ? 0 : 3, RXAC ? 36 : 39, RXAC ? 36 : 39);
        } else {
            _bgView.frame = CGRectMake(0, TFY, BGW, BGH);
            _tf.frame = CGRectMake(0, TFY, BGW - (RXAC ? 36 : 39), BGH);
            UIView *tfLeftView = [[UIView alloc] initWithFrame:CGRectMake(0, 0, 9, BGH)];
            _tf.leftView = tfLeftView;
            _tf.leftViewMode = UITextFieldViewModeAlways;
            _placeholderLbl.frame = CGRectMake(RXAC ? 15 : 13, 0, BGW, BGH);
            _showPwdBtn.frame = CGRectMake(CGRectGetMaxX(self.bgView.frame) - 4 - (RXAC ? 36 : 39), RXAC ? 0 : 3, RXAC ? 36 : 39, RXAC ? 36 : 39);
        }
  
    } else if (self.type == TFType_loginCode) {
//        if ([RXOSUserUtility sharedManager].isCodeTFLoad) {
//            return;
//        }
//        [self addSubview:[self showPwdView]];
        
        self.codeLbl.hidden = NO;
        
        self.layer.masksToBounds = NO;
        self.layer.cornerRadius = 0;
        self.layer.borderColor = [UIColor clearColor].CGColor;
        self.layer.borderWidth = 0;
        
        self.tf.layer.masksToBounds = YES;
        self.tf.layer.cornerRadius = 5;
        self.tf.layer.borderColor = [UIColor colorWithHexString:@"#E2F2F1"].CGColor;
        self.tf.layer.borderWidth = 1;
        
        CGFloat btnW = [[RXLocation osLaunguage:_codeLbl.text] widthForFont:_codeLbl.font];
        CGFloat bgW = [RXOSCommonTool getScreenWidth] - (RXAC ? 59 : 50);

        if ([RXOSCommonTool isRTL]) {
//            btnW = [self.codeLbl.text widthForFont:self.codeLbl.font] - 38;
            [self bringSubviewToFront:_tf];
            _tf.frame = CGRectMake(btnW + 2, TFY, BGW - btnW - 2, BGH);
            UIView *tfRightView = [[UIView alloc] initWithFrame:CGRectMake(0, 0, 9, BGH)];
            _tf.rightView = tfRightView;
            _tf.rightViewMode = UITextFieldViewModeAlways;
            _placeholderLbl.frame = CGRectMake(CGRectGetMinX(_tf.frame) + (RXAC ? 0 : 3), 0, CGRectGetWidth(_tf.frame) - (RXAC ? 13 : 13), BGH);
            _codeLbl.frame = CGRectMake(0, 0, btnW, BGH);
        } else {
            NSString *language = [RXOSCommonTool getLanguage];
//            if ([language isEqualToString:@"zh"]) {
//                btnW += 4;
//            } else if ([language isEqualToString:@"en"]) {
//                
//            }
            
            _tf.frame = CGRectMake(0, TFY, bgW - btnW - 4, BGH);
            UIView *tfLeftView = [[UIView alloc] initWithFrame:CGRectMake(0, 0, 9, BGH)];
            _tf.leftView = tfLeftView;
            _tf.leftViewMode = UITextFieldViewModeAlways;
            _placeholderLbl.frame = CGRectMake(RXAC ? 15 : 13, 0, BGW, BGH);
            _codeLbl.frame = CGRectMake(CGRectGetMaxX(self.tf.frame) + 4, 0, btnW, BGH);
        }
    } else if (self.type == TFType_pwd) {
        [self addSubview:self.bgView];
        [self bringSubviewToFront:self.showPwdBtn];
        
        CGFloat btnW = [[RXLocation osLaunguage:_forgetPwdBtn.titleLabel.text] widthForFont:_forgetPwdBtn.titleLabel.font];
        CGFloat bgW = [RXOSCommonTool getScreenWidth] - (RXAC ? 59 : 50);

        self.layer.masksToBounds = NO;
        self.layer.cornerRadius = 0;
        self.layer.borderColor = [UIColor clearColor].CGColor;
        self.layer.borderWidth = 0;
        
        self.bgView.layer.masksToBounds = YES;
        self.bgView.layer.cornerRadius = 5;
        self.bgView.layer.borderColor = [UIColor colorWithHexString:@"#E2F2F1"].CGColor;
        self.bgView.layer.borderWidth = 1;
        
        self.bgView.frame = CGRectMake(0, TFY, bgW - btnW - 6, BGH);
        
        if ([RXOSCommonTool isRTL]) {
            [self bringSubviewToFront:_tf];
            _bgView.frame = CGRectMake(btnW + 6, TFY, bgW - btnW - 6, BGH);
            _tf.frame = CGRectMake(RXAC ? 36 - 2: 39, TFY, bgW - btnW - 4 - (RXAC ? 36 : 39), BGH);
            UIView *tfRightView = [[UIView alloc] initWithFrame:CGRectMake(0, 0, 9, BGH)];
            _tf.rightView = tfRightView;
            _tf.rightViewMode = UITextFieldViewModeAlways;
            _placeholderLbl.frame = CGRectMake(CGRectGetMinX(_bgView.frame) + (RXAC ? 0 : 12), 0, CGRectGetWidth(_tf.frame) + 25, BGH);
            _forgetPwdBtn.frame = CGRectMake(0, 0, btnW, BGH);
            _showPwdBtn.frame = CGRectMake(CGRectGetMinX(_bgView.frame), RXAC ? 0 : 3, RXAC ? 36 : 39, RXAC ? 36 : 39);
        } else {
            _bgView.frame = CGRectMake(0, TFY, bgW - btnW - 4, BGH);
            _tf.frame = CGRectMake(0, TFY, bgW - btnW - 6 - (RXAC ? 36 : 39), BGH);
            UIView *tfLeftView = [[UIView alloc] initWithFrame:CGRectMake(0, 0, 9, BGH)];
            _tf.leftView = tfLeftView;
            _tf.leftViewMode = UITextFieldViewModeAlways;
            _placeholderLbl.frame = CGRectMake(RXAC ? 15 : 13, 0, BGW, BGH);
            _forgetPwdBtn.frame = CGRectMake(CGRectGetMaxX(self.bgView.frame) + 4, 0, btnW, BGH);
            _showPwdBtn.frame = CGRectMake(CGRectGetMaxX(self.bgView.frame) - 4 - (RXAC ? 36 : 39), RXAC ? 0 : 3, RXAC ? 36 : 39, RXAC ? 36 : 39);
        }
    } else if (self.type == TFType_loginArea) {
        
        
    } else if (self.type == TFType_code) {
        _tf.frame = CGRectMake(10, TFY, BGW - 10, BGH);
        _placeholderLbl.frame = CGRectMake(RXAC ? 15 : 13, 0, BGW - 10, BGH);
        
        CGFloat codeW = [[RXLocation osLaunguage:_codeLbl.text] widthForFont:_codeLbl.font] + 1;
        _codeLbl.frame = CGRectMake(BGW - codeW - 14, 0, codeW, RXAC ? 36 : 46);
    } else {
        if ([RXOSCommonTool isRTL]) {
            _tf.frame = CGRectMake(10, TFY, BGW - 10, BGH);
            UIView *tfRightView = [[UIView alloc] initWithFrame:CGRectMake(0, 0, 9, BGH)];
            _tf.rightView = tfRightView;
            _tf.rightViewMode = UITextFieldViewModeAlways;
            _placeholderLbl.frame = CGRectMake(RXAC ? 15 : 13, 0, CGRectGetWidth(_tf.frame)  - (RXAC ? 15 : 13), BGH);
        } else {
            _tf.frame = CGRectMake(10, TFY, BGW - 10, BGH);
            _placeholderLbl.frame = CGRectMake(RXAC ? 15 : 13, 0, BGW, BGH);
        }
    }
    
//    [self layoutIfNeeded];
    
}

- (void)refreshView
{
    self.isRefresh = YES;
    [self showPwdView];
}

- (UIView *)showPwdView
{
//    if (self.showPwdBtn) return nil;
//
//    self.bgView = [[UIView alloc] init];
    if (!self.bgView) {
        self.bgView = [[UIView alloc] init];
    }
    UIView *line = [[UIView alloc] init];
//    line.backgroundColor = [UIColor colorWithHexString:@"#E2F2F1"];
//    line.hidden = YES;
    
//    self.showPwdBtn = [UIButton buttonWithType:UIButtonTypeCustom];
//    [self.showPwdBtn setBackgroundImage:[UIImage rxOSBundleImageNamed:@"rx_hidepwd"] forState:UIControlStateNormal];
//    self.showPwdBtn.imageView.clipsToBounds = YES;
//    if (self.type == TFType_pwd) {
//        self.showPwdBtn.hidden = YES;
//    }
//    [self.showPwdBtn addTarget:self action:@selector(showPwdBtnAction:) forControlEvents:UIControlEventTouchUpInside];
    
    self.line = [[UIView alloc] init];
    self.line.backgroundColor = [UIColor colorWithHexString:@"#E2F2F1"];
    
//    self.forgetPwdBtn = [UIButton buttonWithType:UIButtonTypeCustom];
//    [self.forgetPwdBtn setTitle:[RXLocation osLaunguage:@"忘记密码"] forState:UIControlStateNormal];
//    self.forgetPwdBtn.titleLabel.textAlignment = NSTextAlignmentRight;
//    [self.forgetPwdBtn setTitleColor:[UIColor colorWithHexString:@"#74D2CB"] forState:UIControlStateNormal];
//    self.forgetPwdBtn.titleLabel.font = [UIFont systemFontOfSize:16 weight:UIFontWeightRegular];
//    [self.forgetPwdBtn addTarget:self action:@selector(forgetPwdBtnAction:) forControlEvents:UIControlEventTouchUpInside];
        
    [self addSubview:self.bgView];
//        [self.bgView addSubview:self.showPwdBtn];
    [self.bgView addSubview:self.line];
    [self addSubview:self.forgetPwdBtn];
    
    [self bringSubviewToFront:self.codeLbl];
    
    CGFloat forgetPwdBtnW = [[RXLocation osLaunguage:_forgetPwdBtn.titleLabel.text] widthForFont:_forgetPwdBtn.titleLabel.font] + 1;
    CGFloat showPwdW = forgetPwdBtnW + 16 + (RXAC ? 36 : 39);
    
    self.showPwdBtn.frame = CGRectMake([RXOSCommonTool getScreenWidth] - (RXAC ? 58 : 50) - showPwdW, RXAC ? 0 : 3, RXAC ? 36 : 39, RXAC ? 36 : 39);
//    self.line.frame = CGRectMake(CGRectGetMaxX(self.showPwdBtn.frame), RXAC ? 10 : 15, 1.5, RXAC ? 36 - 20 : 46 - 30);
    self.showPwdBtn.frame = CGRectMake(0, RXAC ? 0 : 3, RXAC ? 36 : 39, RXAC ? 36 : 39);
//    self.forgetPwdBtn.frame = CGRectMake(CGRectGetMaxX(self.line.frame) + 6, 0, forgetPwdBtnW, RXAC ? 36 : 46);
    _tf.frame = CGRectMake(RXAC ? 10 : 10, TFY, BGW - showPwdW - 2, BGH);
    _placeholderLbl.frame = CGRectMake(RXAC ? 15 : 13, 0, CGRectGetWidth(_tf.frame), BGH);
    self.codeLbl.hidden = YES;
    
    if (self.type == TFType_pwdNormal) {
        self.line.hidden = YES;
        self.forgetPwdBtn.hidden = YES;
        self.showPwdBtn.frame = CGRectMake([RXOSCommonTool getScreenWidth] - (RXAC ? 58 + 42 : 50 + 43), RXAC ? 0 : 3, RXAC ? 36 : 39, RXAC ? 36 : 39);
//        self.showPwdBtn.frame = CGRectMake(BGW - (RXAC ? 180 : 43), RXAC ? 0 : 3, RXAC ? 36 : 39, RXAC ? 36 : 39);
        _tf.frame = CGRectMake(10, TFY, [RXOSCommonTool getScreenWidth] - (RXAC ? 58 + 42 : 50 + 43) - 60, RXAC ? 36 : 46);
        _placeholderLbl.frame = CGRectMake(RXAC ? 15 : 13, 0, CGRectGetWidth(_tf.frame), RXAC ? 36 : 46);
    } else if (self.type == TFType_loginCode) {
        
//        self.showPwdBtn.hidden = YES;
//        [self.forgetPwdBtn setTitle:@"" forState:UIControlStateNormal];
//        
//        CGFloat codeW = [[RXLocation osLaunguage:_codeLbl.text] widthForFont:_codeLbl.font] + 1;
//        
//        self.codeLbl.hidden = NO;
//        
//        _codeLbl.frame = CGRectMake(BGW - codeW - 14, 0, codeW, RXAC ? 36 : 46);
//        self.line.frame = CGRectMake(CGRectGetMinX(_codeLbl.frame) - (RXAC ? 8 : 8), RXAC ? 10 : 13, 2, RXAC ? 36 - 20 : 46 - 26);
//        
//        line.frame = CGRectMake(CGRectGetMinX(_codeLbl.frame) - (RXAC ? 4 : 4), RXAC ? 10 : 13, 2, RXAC ? 36 - 20 : 46 - 30);
//        _tf.frame = CGRectMake(10, TFY, BGW - 60, BGH);
//        _placeholderLbl.frame = CGRectMake(RXAC ? 15 : 13, 0, CGRectGetWidth(_tf.frame), BGH);
//        self.forgetPwdBtn.frame = CGRectMake(CGRectGetMaxX(self.line.frame) + 4, 0, 0, RXAC ? 36 : 46);
        
        self.layer.masksToBounds = NO;
        self.layer.cornerRadius = 0;
        self.layer.borderColor = [UIColor clearColor].CGColor;
        self.layer.borderWidth = 0;
        
        self.tf.layer.masksToBounds = YES;
        self.tf.layer.cornerRadius = 5;
        self.tf.layer.borderColor = [UIColor colorWithHexString:@"#E2F2F1"].CGColor;
        self.tf.layer.borderWidth = 1;
        
        CGFloat btnW = [[RXLocation osLaunguage:self.codeLbl.text] widthForFont:self.codeLbl.font];
        CGFloat bgW = [RXOSCommonTool getScreenWidth] - (RXAC ? 59 : 50);
        
        self.forgetPwdBtn.hidden = YES;
        [self.forgetPwdBtn setTitle:@"" forState:UIControlStateNormal];
        self.codeLbl.hidden = NO;
        
        if ([RXOSCommonTool isRTL]) {
            self.bgView.frame = CGRectMake(RXAC ? 108 : 163, 0, 0, RXAC ? 36 : 46);
            _tf.frame = CGRectMake(btnW + 2, TFY, BGW - btnW, CGRectGetHeight(self.bgView.frame));
            UIView *tfRightView = [[UIView alloc] initWithFrame:CGRectMake(0, 0, 9, CGRectGetHeight(self.bgView.frame))];
            _tf.leftView = tfRightView;
            _tf.leftViewMode = UITextFieldViewModeAlways;
            _placeholderLbl.frame = CGRectMake(RXAC ? -8 : -8, 0, BGW, BGH);
            _codeLbl.frame = CGRectMake(0, 0, btnW, CGRectGetHeight(self.bgView.frame));
        } else {
            self.bgView.frame = CGRectMake(RXAC ? 108 : 163, 0, 0, RXAC ? 36 : 46);
            _tf.frame = CGRectMake(0, TFY, bgW - btnW - 18, CGRectGetHeight(self.bgView.frame));
            UIView *tfLeftView = [[UIView alloc] initWithFrame:CGRectMake(0, 0, 9, CGRectGetHeight(self.bgView.frame))];
            _tf.leftView = tfLeftView;
            _tf.leftViewMode = UITextFieldViewModeAlways;
            _placeholderLbl.frame = CGRectMake(RXAC ? 15 : 13, 0, BGW, BGH);
            _codeLbl.frame = CGRectMake(CGRectGetMaxX(self.tf.frame) + 4, 0, btnW + 14, CGRectGetHeight(self.bgView.frame));
        }

    } else if (self.type == TFType_loginArea) {
        [self.showPwdBtn removeFromSuperview];
        [self.line removeFromSuperview];
        [self.forgetPwdBtn removeFromSuperview];
        self.showPwdBtn = nil;
        self.line = nil;
        self.forgetPwdBtn = nil;
        
        self.areaBtn = [[RXOSAreaBtn alloc] init];
        [self.areaBtn setTitle:[self getAreaCode] forState:UIControlStateNormal];
        [self.areaBtn setTitleColor:[UIColor colorWithHexString:@"#131313"] forState:UIControlStateNormal];
        self.areaBtn.titleLabel.font = [UIFont systemFontOfSize:16 weight:UIFontWeightMedium];
        [self.areaBtn setImage:[UIImage rxOSBundleImageNamed:@"rx_areaArrow"] forState:UIControlStateNormal];
        [self.areaBtn addTarget:self action:@selector(areaBtnAction) forControlEvents:UIControlEventTouchUpInside];
        [self addSubview:self.areaBtn];
        
        CGFloat titleW = [self.areaBtn.titleLabel.text widthForFont:self.areaBtn.titleLabel.font] + 1;
        NSMutableString *mutCode = [NSMutableString stringWithString:self.areaBtn.titleLabel.text];
        
        if ([RXOSCommonTool isRTL]) {
            self.areaBtn.frame = CGRectMake(BGW - (titleW + 20), RXAC ? 3 : 8, titleW + 20, 30);
            self.tf.frame = CGRectMake(0, TFY, BGW - CGRectGetWidth(self.areaBtn.frame) + 2, BGH);
            self.placeholderLbl.frame = CGRectMake(CGRectGetMinX(self.tf.frame) + 1, 0, CGRectGetWidth(self.tf.frame) - 12, BGH);

            for (int i = 0; i < 6 - mutCode.length; i++) {
                if (self.areaBtn.titleLabel.text.length < 5) {
                    [mutCode insertString:@"0" atIndex:0];
                }
            }
        } else {
            self.areaBtn.frame = CGRectMake(15, RXAC ? 3 : 8, titleW + 20, 30);
            self.tf.frame = CGRectMake(CGRectGetMaxX(self.areaBtn.frame) - 4, TFY, BGW - CGRectGetMaxX(self.areaBtn.frame) - 20, BGH);
            self.placeholderLbl.frame = CGRectMake(CGRectGetMinX(self.tf.frame) + 1, 0, BGW, BGH);
            
            for (int i = 0; i < 6 - mutCode.length; i++) {
                if (self.areaBtn.titleLabel.text.length < 5) {
                    [mutCode insertString:@"0" atIndex:1];
                }
            }
        }
                
        [RXOSUserUtility sharedManager].areaCode = mutCode;
        
//        _codeLbl.frame = CGRectMake(BGW - 108, 0, 104, BGH);
    } else if (self.type == TFType_pwd) {
        self.layer.masksToBounds = NO;
        self.layer.cornerRadius = 0;
        self.layer.borderColor = [UIColor clearColor].CGColor;
        self.layer.borderWidth = 0;
        
        self.bgView.layer.masksToBounds = YES;
        self.bgView.layer.cornerRadius = 5;
        self.bgView.layer.borderColor = [UIColor colorWithHexString:@"#E2F2F1"].CGColor;
        self.bgView.layer.borderWidth = 1;
        
        CGFloat btnW = [self.forgetPwdBtn.titleLabel.text widthForFont:self.forgetPwdBtn.titleLabel.font];
        CGFloat bgW = [RXOSCommonTool getScreenWidth] - (RXAC ? 59 : 50);
        
        self.forgetPwdBtn.hidden = NO;
        self.bgView.frame = CGRectMake(RXAC ? 109 : 183, 0, 130, RXAC ? 36 : 46);
//        self.line.frame = CGRectMake(CGRectGetMaxX(self.showPwdBtn.frame), RXAC ? 10 : 15, 1.5, CGRectGetHeight(self.bgView.frame) - (RXAC ? 20 : 30));
        
        if ([RXOSCommonTool isRTL]) {
            _tf.frame = CGRectMake(0, TFY, bgW - btnW - 6, CGRectGetHeight(self.bgView.frame));
            UIView *tfRightView = [[UIView alloc] initWithFrame:CGRectMake(0, 0, 9, CGRectGetHeight(self.bgView.frame))];
            _tf.rightView = tfRightView;
            _tf.leftViewMode = UITextFieldViewModeAlways;
            self.forgetPwdBtn.frame = CGRectMake(CGRectGetMaxX(self.tf.frame) + 4, 0, btnW, CGRectGetHeight(self.bgView.frame));
            _placeholderLbl.frame = CGRectMake(RXAC ? 15 : 13, 0, CGRectGetWidth(_tf.frame) - 9, BGH);
        } else {
            _tf.frame = CGRectMake(0, TFY, bgW - btnW - 6, CGRectGetHeight(self.bgView.frame));
            UIView *tfLeftView = [[UIView alloc] initWithFrame:CGRectMake(0, 0, 9, CGRectGetHeight(self.bgView.frame))];
            _tf.leftView = tfLeftView;
            _tf.leftViewMode = UITextFieldViewModeAlways;
            self.forgetPwdBtn.frame = CGRectMake(CGRectGetMaxX(self.tf.frame) + 4, 0, btnW, CGRectGetHeight(self.bgView.frame));
            _placeholderLbl.frame = CGRectMake(RXAC ? 15 : 13, 0, BGW, BGH);
        }
    }
    
    return self.bgView;
}

- (void)changeType:(TFType)type
{
//    return;
    self.type = type;
    
//    [self.bgView removeFromSuperview];
    [self.showPwdBtn removeFromSuperview];
    [self.line removeFromSuperview];
    [self.forgetPwdBtn removeFromSuperview];
//    self.bgView = nil;
//    self.showPwdBtn = nil;
    self.line = nil;
    self.forgetPwdBtn = nil;
    
    [self addSubview:[self showPwdView]];
}

- (void)changeArea:(NSString *)areaCode
{
    if (areaCode.length > 4) {
        NSInteger zeroCount = 0;
        for (int i = 1; i < 5; i++) {
            NSString *subStr = [areaCode substringWithRange:NSMakeRange(i, 1)];
            if ([subStr isEqualToString:@"0"]) {
                zeroCount++;
            } else {
                break;
            }
        }
        if (zeroCount > 0) {
            areaCode = [areaCode stringByReplacingCharactersInRange:NSMakeRange(1, zeroCount) withString:@""];
        }
    }
    
    [self.areaBtn setTitle:areaCode forState:UIControlStateNormal];
    NSMutableString *mutCode = [NSMutableString stringWithString:self.areaBtn.titleLabel.text];
    for (int i = 0; i < 6 - mutCode.length; i++) {
        if (self.areaBtn.titleLabel.text.length < 5) {
            [mutCode insertString:@"0" atIndex:1];
        }
    }
    
    CGFloat titleW = [self.areaBtn.titleLabel.text widthForFont:self.areaBtn.titleLabel.font] + 1;
    self.areaBtn.frame = CGRectMake(15, RXAC ? 3 : 8, titleW + 20, 30);
    self.tf.frame = CGRectMake(CGRectGetMaxX(self.areaBtn.frame) - 4, TFY, BGW - CGRectGetMaxX(self.areaBtn.frame) - 20, BGH);
    self.placeholderLbl.frame = CGRectMake(CGRectGetMinX(self.tf.frame) + 1, 0, BGW, BGH);
    
    [RXOSUserUtility sharedManager].areaCode = mutCode;
}

#pragma mark -- <actiosn>
- (void)areaBtnAction
{
    [self endEditing:YES];
    RXCountryList *countryList = [[RXCountryList alloc] initWithComplete:^(NSString * _Nonnull code) {
        [self.areaBtn setTitle:code forState:UIControlStateNormal];
        
//        CGFloat titleW = [self.areaBtn.titleLabel.text widthForFont:self.areaBtn.titleLabel.font] + 1;
//        self.areaBtn.frame = CGRectMake(15, RXAC ? 3 : 8, titleW + 20, 30);
//        self.tf.frame = CGRectMake(CGRectGetMaxX(self.areaBtn.frame) - 4, 0, BGW - CGRectGetMaxX(self.areaBtn.frame) - 20, BGH);
//        self.placeholderLbl.frame = CGRectMake(CGRectGetMinX(self.tf.frame) + 1, 0, BGW, BGH);
        
        CGFloat titleW = [self.areaBtn.titleLabel.text widthForFont:self.areaBtn.titleLabel.font] + 1;
        
        if ([RXOSCommonTool isRTL]) {
            self.areaBtn.frame = CGRectMake(BGW - (titleW + 20), RXAC ? 3 : 8, titleW + 20, 30);
            self.tf.frame = CGRectMake(0, TFY, BGW - CGRectGetWidth(self.areaBtn.frame) + 2, BGH);
            self.placeholderLbl.frame = CGRectMake(CGRectGetMinX(self.tf.frame) + 1, 0, CGRectGetWidth(self.tf.frame) - 12, BGH);

        } else {
            self.areaBtn.frame = CGRectMake(15, RXAC ? 3 : 8, titleW + 20, 30);
            self.tf.frame = CGRectMake(CGRectGetMaxX(self.areaBtn.frame) - 4, TFY, BGW - CGRectGetMaxX(self.areaBtn.frame) - 20, BGH);
            self.placeholderLbl.frame = CGRectMake(CGRectGetMinX(self.tf.frame) + 1, 0, BGW, BGH);
        }
        
        NSMutableString *mutCode = [NSMutableString stringWithString:code];
        for (int i = 0; i < 6 - mutCode.length; i++) {
            if (code.length < 5) {            
                [mutCode insertString:@"0" atIndex:1];
            }
        }
        [RXOSUserUtility sharedManager].areaCode = mutCode;
    }];
}

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
        [btn setBackgroundImage:[UIImage rxOSBundleImageNamed:@"rx_showpwd"] forState:UIControlStateNormal];
    } else {
        _tf.secureTextEntry = YES;
        [btn setBackgroundImage:[UIImage rxOSBundleImageNamed:@"rx_hidepwd"] forState:UIControlStateNormal];
    }
}

- (void)forgetPwdBtnAction:(UIButton *)btn
{
    if (self.type == TFType_loginCode) {
        if (self.sendCodeBlock) {
            self.sendCodeBlock();
        }
    } else {
        if (self.forgetBlock) {
            self.forgetBlock();
        }
    }
}

- (NSString *)getAreaCode
{
    NSString *code = @"+1";
    
    NSBundle *bundle = [NSBundle bundleForClass:[RXOSUIKitService class]];
    NSString *plistPathEN = [bundle pathForResource:@"sortedNameEN" ofType:@"plist"];
    
    NSMutableDictionary *dic = [[NSMutableDictionary alloc] initWithContentsOfFile:plistPathEN];
    
    NSString *countryCode = [RXOSCommonTool getCountryCode];
    
    RXOSUILoginConfig *config = [RXOSUserUtility sharedManager].loginConfig;
    NSString *language = config.language_default;
//    if ([[config.language_default lowercaseString] isEqualToString:@"ja"] || [[config.language_default lowercaseString] isEqualToString:@"ja-jp"]) {
//        language = @"JP";
//    } else if ([[config.language_default lowercaseString] isEqualToString:@"en"]) {
//        language = @"US";
//    } else if ([[config.language_default lowercaseString] isEqualToString:@"cn"] || [[config.language_default lowercaseString] isEqualToString:@"zh-cn"]) {
//        language = @"CN";
//    }
    
    language = countryCode;
    
    for (int i = 0; i < dic.allKeys.count; i++) {
        NSMutableArray *arr = [dic valueForKey:dic.allKeys[i]];
        
        for (int j = 0; j < arr.count; j++) {
            NSString *codeItem = arr[j];
            NSArray *codeComponent = [codeItem componentsSeparatedByString:@"+"];
            NSString *codeStr = [NSString stringWithFormat:@"%@", codeComponent[1]];
            NSArray *codeArr = [codeStr componentsSeparatedByString:@"&"];
            
            if (codeArr.count > 1) {
                NSString *country = codeArr[1];
                if ([country isEqualToString:language]) {
                    code = codeArr[0];
                    if ([RXOSCommonTool isRTL]) {
                        code = [NSString stringWithFormat:@"%@+", [code stringByReplacingOccurrencesOfString:@" " withString:@""]];
                    } else {
                        code = [NSString stringWithFormat:@"+%@", [code stringByReplacingOccurrencesOfString:@" " withString:@""]];
                    }
                }
            }
        }
    }
    
    return code;
}

#pragma mark -- <lazy>
- (UILabel *)placeholderLbl
{
    if (!_placeholderLbl) {
        _placeholderLbl = [[UILabel alloc] init];
        _placeholderLbl.text = self.placehoder;
        _placeholderLbl.textColor = [UIColor colorWithHexString:@"#A5CACA"];
        _placeholderLbl.font = [UIFont systemFontOfSize:16 weight:UIFontWeightRegular];
        
        if ([RXOSCommonTool isRTL]) {
            _placeholderLbl.textAlignment = NSTextAlignmentRight;
        } else {
            _placeholderLbl.textAlignment = NSTextAlignmentLeft;
        }
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
        
        if ([RXOSCommonTool isRTL]) {
            _tf.textAlignment = NSTextAlignmentRight;
        } else {
            _tf.textAlignment = NSTextAlignmentLeft;
        }
//        if (self.keyboardType != UIKeyboardTypeNumberPad) {
            _tf.returnKeyType = UIReturnKeyDone;
//        }
        if (self.type == TFType_pwd || self.type == TFType_pwdNormal) {
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
        [_clearBtn setImage:[UIImage rxOSBundleImageNamed:@"tfclose"] forState:UIControlStateNormal];
        [_clearBtn addTarget:self action:@selector(clearBtnAction:) forControlEvents:UIControlEventTouchUpInside];
    }
    return _clearBtn;
}

- (UIButton *)forgetPwdBtn
{
    if (!_forgetPwdBtn) {
        _forgetPwdBtn = [UIButton buttonWithType:UIButtonTypeCustom];
        [_forgetPwdBtn setTitle:[RXLocation osLaunguage:@"忘记密码"] forState:UIControlStateNormal];
        _forgetPwdBtn.titleLabel.textAlignment = NSTextAlignmentRight;
        [_forgetPwdBtn setTitleColor:[UIColor colorWithHexString:@"#74D2CB"] forState:UIControlStateNormal];
        _forgetPwdBtn.titleLabel.font = [UIFont systemFontOfSize:16 weight:UIFontWeightRegular];
        [_forgetPwdBtn addTarget:self action:@selector(forgetPwdBtnAction:) forControlEvents:UIControlEventTouchUpInside];
    }
    return _forgetPwdBtn;
}

- (UIButton *)showPwdBtn
{
    if (!_showPwdBtn) {
        _showPwdBtn = [UIButton buttonWithType:UIButtonTypeCustom];
        [_showPwdBtn setBackgroundImage:[UIImage rxOSBundleImageNamed:@"rx_hidepwd"] forState:UIControlStateNormal];
        _showPwdBtn.imageView.clipsToBounds = YES;
        _showPwdBtn.hidden = YES;
        [_showPwdBtn addTarget:self action:@selector(showPwdBtnAction:) forControlEvents:UIControlEventTouchUpInside];
    }
    return _showPwdBtn;
}

- (UIView *)bgView
{
    if (!_bgView) {
        _bgView = [[UIView alloc] init];
    }
    return _bgView;
}

@end
