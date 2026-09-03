//
//  RXPrivacyLimitView.m
//  RXUIKit
//
//  Created by 陈汉 on 2024/1/30.
//

#import "RXPrivacyLimitView.h"
#import "RXUIKitService.h"
#import "RXCommonWKWebView.h"

@interface RXPrivacyLimitView () <UITextViewDelegate>

@property (nonatomic, strong) UIView *bgView;
@property (nonatomic, strong) UILabel *titleLbl;
@property (nonatomic, strong) UIScrollView *desBg;
@property (nonatomic, strong) UITextView *desLbl;
@property (nonatomic, strong) UIButton *button1;
@property (nonatomic, strong) UIButton *button2;
@property (nonatomic, assign) NSInteger orientation;  // 屏幕方向 1竖屏 2横屏
@property (nonatomic, copy) PrivacyLimitClickBlock clickBlock;

@end

@implementation RXPrivacyLimitView

- (void)dealloc
{
    [[NSNotificationCenter defaultCenter] removeObserver:self];
}

- (instancetype)initWithClickBlock:(PrivacyLimitClickBlock)clickBlock
{
    self = [super initWithFrame:CGRectMake(0, 0, [UIApplication sharedApplication].keyWindow.frame.size.width, [UIApplication sharedApplication].keyWindow.frame.size.height)];
    if (self) {
        self.backgroundColor = [[UIColor blackColor] colorWithAlphaComponent:0];
        [[UIApplication sharedApplication].keyWindow addSubview:self];
        
        self.orientation = [RXUICommonTool getInterfaceOrientation];
        self.clickBlock = clickBlock;
        
        [self setUI];
        [self show];
        
        // 监听屏幕旋转（横竖屏）
//        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(onDeviceOrientationDidChange)
//                             name:UIDeviceOrientationDidChangeNotification
//                                                       object:nil];
    }
    return self;
}

- (void)show
{
    [RXUICommonTool transformWithView:self.bgView];
    [UIView animateWithDuration:0.1 animations:^{
        self.backgroundColor = [[UIColor blackColor] colorWithAlphaComponent:0.5];
        [RXUICommonTool showWithAnimate:self.bgView];

        [self layoutSubviews];
    }];
}

- (void)hide
{
    [[NSNotificationCenter defaultCenter] removeObserver:self];
    [self removeFromSuperview];
    
}

#pragma mark -- <setUI>
- (void)setUI
{
    [self addSubview:self.bgView];
    [self.bgView addSubview:self.titleLbl];
    [self.bgView addSubview:self.desBg];
    [self.desBg addSubview:self.desLbl];
    [self.bgView addSubview:self.button1];
    [self.bgView addSubview:self.button2];
    
    [self layoutViews];
}

- (void)layoutViews
{
    UIView *window = [UIApplication sharedApplication].keyWindow;
    
    CGFloat bgW = RXAC ? 528 : 346;
    CGFloat bgH = RXAC ? 266 : 424;
    
    _bgView.frame = CGRectMake(0, 0, bgW, bgH);
    _bgView.center = window.center;
    
    _titleLbl.frame = CGRectMake(0, 21, bgW, 24);
    
    CGFloat scrollH = [self.desLbl.text heightForFont:self.desLbl.font width:bgW] + 30;
    
    _desBg.frame = CGRectMake(0, CGRectGetMaxY(_titleLbl.frame) + (RXAC ? 8 : 16), bgW, RXAC ? 150 : 276);
    _desBg.contentSize = CGSizeMake(bgW, scrollH);
    
    _desLbl.frame = CGRectMake(RXAC ? 29 : 25, 2, bgW - (RXAC ? 58 : 50), scrollH + 30);

    _button1.frame = CGRectMake(RXAC ? bgW / 2 - 180 - 12 : 25, bgH - (RXAC ? 27 + 43 : 25 + 48), RXAC ? 180 : 143, RXAC ? 43 : 48);
    
    _button2.frame = CGRectMake(RXAC ? CGRectGetMaxX(_button1.frame) + 12 : bgW - 143 - 25, CGRectGetMinY(_button1.frame), CGRectGetWidth(_button1.frame), CGRectGetHeight(_button1.frame));
    
    [self layoutSubviews];
}

#pragma mark -- <actions>
- (void)buttonAction1
{
    if (self.clickBlock) {
        self.clickBlock(NO);
    }
    
    [self hide];
}

- (void)buttonAction2
{
    if (self.clickBlock) {
        self.clickBlock(YES);
    }
   
    [self hide];
}

#pragma mark -- <RXAttributeLabelDelegate>
- (BOOL)textView:(UITextView *)textView shouldInteractWithURL:(NSURL *)URL inRange:(NSRange)characterRange interaction:(UITextItemInteraction)interaction {
    
    RXSdkInitConfig *config = [RXService sharedSDK].sdkConfig;
    NSMutableArray *clickTextList = [NSMutableArray array];
    NSMutableArray *clickTitleList = [NSMutableArray array];
    
    if (config.agreementMap.allKeys.count > 0) {
        for (int i = 0; i < config.agreementMap.allKeys.count; i++) {
            [clickTextList addObject:config.agreementMap.allKeys[i]];
            [clickTitleList addObject:config.agreementMap.allValues[i]];
        }
    } else {
        [clickTextList addObject:@"00001"];
        [clickTextList addObject:@"00002"];
        [clickTitleList addObject:@"《用户协议》"];
        [clickTitleList addObject:@"《隐私政策》"];
    }
    
    NSString *url = [URL absoluteString];
    url = [url substringFromIndex:18];
    
    NSInteger clickIndex = [url integerValue];
    
    NSString *clickKey = clickTextList[clickIndex];
    NSString *clickTitle = clickTitleList[clickIndex];
    
    if ([[clickKey substringToIndex:4] containsString:@"http"]) {
        RXCommonWKWebView *webView = [[RXCommonWKWebView alloc] initWithUrl:clickKey title:clickTitle content:nil];
    } else {
        [[RXUIKitService sharedSDK] setProtocolViewWithKey:clickKey keyList:@[clickKey]];
    }
    
    return YES;
}

#pragma mark -- <lazy>
- (UIView *)bgView
{
    if (!_bgView) {
        _bgView = [[UIView alloc] init];
        _bgView.backgroundColor = [UIColor colorWithHexString:@"fafafa"];
//        _bgView.backgroundColor = [UIColor redColor];
        _bgView.layer.cornerRadius = 5;
    }
    return _bgView;
}

- (UILabel *)titleLbl
{
    if (!_titleLbl) {
        _titleLbl = [[UILabel alloc] init];
        _titleLbl.textColor = [UIColor blackColor];
        RXSdkInitConfig *config = [RXService sharedSDK].sdkConfig;
        _titleLbl.text = config.agreementTitle;
        _titleLbl.font = [UIFont systemFontOfSize:21 weight:UIFontWeightMedium];
        _titleLbl.textAlignment = NSTextAlignmentCenter;
    }
    return _titleLbl;
}

- (UITextView *)desLbl
{
    if (!_desLbl) {
        _desLbl = [[UITextView alloc] init];
        RXSdkInitConfig *config = [RXService sharedSDK].sdkConfig;
        NSMutableArray *clickTextList = [NSMutableArray array];
        NSMutableArray *clickTitleList = [NSMutableArray array];
        
        if (config.agreementMap.allKeys.count > 0) {
            for (int i = 0; i < config.agreementMap.allKeys.count; i++) {
                [clickTextList addObject:config.agreementMap.allKeys[i]];
                [clickTitleList addObject:config.agreementMap.allValues[i]];
            }
        } else {
            [clickTextList addObject:@"00001"];
            [clickTextList addObject:@"00002"];
            [clickTitleList addObject:@"《用户协议》"];
            [clickTitleList addObject:@"《隐私政策》"];
        }

        NSString *text = @"<body style=\"color: black; font-size: 15px;\">在您使用我们服务前，请您务必审慎阅读、充分理解";
        for (int i = 0; i < clickTextList.count; i++) {
            if (i > 0) {
                text = [NSString stringWithFormat:@"%@、<a href='labelAction://type%d'>%@</a>", text, i, clickTitleList[i]];
            } else {
                text = [NSString stringWithFormat:@"%@<a href='labelAction://type%d'>%@</a>", text, i, clickTitleList[i]];
            }
        }
        text = [NSString stringWithFormat:@"%@的各条款。同时,您应特别注意前述协议中免除或者限制我们责任的条款、对您权利进行限制的条款、约定争议解决方式和司法管辖的条款。如您已详细阅读并同意", text];
        
        for (int i = 0; i < clickTextList.count; i++) {
            if (i > 0) {
                text = [NSString stringWithFormat:@"%@、<a href='labelAction://type%d'>%@</a>", text, i, clickTitleList[i]];
            } else {
                text = [NSString stringWithFormat:@"%@<a href='labelAction://type%d'>%@</a>", text, i, clickTitleList[i]];
            }
        }
        text = [NSString stringWithFormat:@"%@请点击\"同意\"开始使用我们的服务。", text];
        
        _desLbl.text = text;
        _desLbl.textColor = [UIColor blackColor];
        _desLbl.scrollEnabled = NO;
        _desLbl.editable = NO;
        _desLbl.backgroundColor = [UIColor clearColor];
        _desLbl.delegate = self;
        _desLbl.font = [UIFont systemFontOfSize:15 weight:UIFontWeightRegular];
        
        NSData *htmlData = [text dataUsingEncoding:NSUnicodeStringEncoding];
        NSAttributedString *attribute = [[NSAttributedString alloc] initWithData:htmlData options:@{NSDocumentTypeDocumentAttribute : NSHTMLTextDocumentType} documentAttributes:NULL error:nil];
        _desLbl.linkTextAttributes = @{NSForegroundColorAttributeName:[UIColor colorWithHexString:@"20C0B3"],NSFontAttributeName:[UIFont systemFontOfSize:15]};
        _desLbl.attributedText = attribute;

    }
    return _desLbl;
}

- (UIButton *)button1
{
    if (!_button1) {
        _button1 = [UIButton buttonWithType:UIButtonTypeCustom];
        NSString *title = @"不同意";
        
        [_button1 setTitle:title forState:UIControlStateNormal];
        [_button1 setTitleColor:[UIColor colorWithHexString:@"20C0B3"] forState:UIControlStateNormal];
        _button1.titleLabel.font = [UIFont systemFontOfSize:18 weight:UIFontWeightMedium];
        _button1.layer.borderWidth = 1;
        _button1.layer.cornerRadius = 5;
        _button1.layer.borderColor = [UIColor colorWithHexString:@"#20C0B3"].CGColor;
        [_button1 addTarget:self action:@selector(buttonAction1) forControlEvents:UIControlEventTouchUpInside];
    }
    return _button1;
}

- (UIButton *)button2
{
    if (!_button2) {
        _button2 = [UIButton buttonWithType:UIButtonTypeCustom];
        NSString *title = @"同意";

        [_button2 setTitle:title forState:UIControlStateNormal];
        [_button2 setTitleColor:[UIColor colorWithHexString:@"#F2FFFB"] forState:UIControlStateNormal];
        [_button2 setBackgroundColor:[UIColor colorWithHexString:@"#20C0B3"]];
        _button2.titleLabel.font = [UIFont systemFontOfSize:18 weight:UIFontWeightMedium];
        _button2.layer.borderWidth = 1;
        _button2.layer.borderColor = [UIColor colorWithHexString:@"#20C0B3"].CGColor;
        _button2.layer.cornerRadius = 5;
        [_button2 addTarget:self action:@selector(buttonAction2) forControlEvents:UIControlEventTouchUpInside];
    }
    return _button2;
}

- (UIScrollView *)desBg
{
    if (!_desBg) {
        _desBg = [[UIScrollView alloc] init];
        _desBg.showsVerticalScrollIndicator = NO;
        _desBg.backgroundColor = [UIColor clearColor];
    }
    return _desBg;
}

@end
