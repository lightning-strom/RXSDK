//
//  RXOSPriView.m
//  RXUIKit
//
//  Created by 陈汉 on 2023/2/14.
//

#import "RXOSPriView.h"
#import "RXOSPrivacyView.h"
#import "RXOSCommonTool.h"
#import "RXOSAttributeLabel.h"
#import "RXOSCommonWKWebView.h"
#import "RXOSSelectBtn.h"
#import "RXOSCloseBtn.h"
#import <RXSDK_Pure/RXSDK_Pure.h>

#define SelectTag 10000

@interface RXOSPriView () <UITableViewDelegate, UITableViewDataSource>

@property (nonatomic, assign) NSInteger orientation;  // 屏幕方向 1竖屏 2横屏
@property (nonatomic, strong) UIView *bgView;
@property (nonatomic, strong) UILabel *titleLbl;
@property (nonatomic, strong) UILabel *desLbl;
@property (nonatomic, strong) RXOSCloseBtn *closeBtn;
@property (nonatomic, strong) UIButton *agreeBtn;
@property (nonatomic, strong) UIButton *startBtn;
@property (nonatomic, strong) UITableView *mTableView;
@property (nonatomic, strong) RXOSUILoginConfig *config;
@property (nonatomic, strong) NSMutableArray *selectBtns;

@end

@implementation RXOSPriView

- (void)dealloc
{
    [[NSNotificationCenter defaultCenter] removeObserver:self];
}

- (instancetype)init
{
    self = [super initWithFrame:CGRectMake(0, 0, [UIApplication sharedApplication].keyWindow.frame.size.width, [UIApplication sharedApplication].keyWindow.frame.size.height)];
    if (self) {
        self.backgroundColor = [[UIColor blackColor] colorWithAlphaComponent:0];
        [[UIApplication sharedApplication].keyWindow addSubview:self];
        
        self.orientation = [RXOSCommonTool getInterfaceOrientation];
        self.config = [RXOSUserUtility sharedManager].loginConfig;
        
        if (self.config.setShowPrivacy) {
            [self setUI];
            
            [self show];
        }
        
        // 监听屏幕旋转（横竖屏）
//        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(onDeviceOrientationDidChange)
//                             name:UIDeviceOrientationDidChangeNotification
//                                                       object:nil];
    }
    return self;
}

- (void)setAgreeBlock:(RXOSPriViewAgreeBlock)agreeBlock
{
    _agreeBlock = agreeBlock;
    if (!self.config.setShowPrivacy) {
        if (self.agreeBlock) {
            self.agreeBlock();
        }
        [self hide];
    }
}

- (void)setQuickAgreeBlock:(RXOSPriViewAgreeQuickBlock)quickAgreeBlock
{
    _quickAgreeBlock = quickAgreeBlock;
    if (!self.config.setShowPrivacy) {
        if (self.quickAgreeBlock) {
            self.quickAgreeBlock();
        }
        [self hide];
    }
}

- (BOOL)onDeviceOrientationDidChange{
    //获取当前设备Device
    UIDevice *device = [UIDevice currentDevice] ;
    //识别当前设备的旋转方向
    switch (device.orientation) {
        case UIDeviceOrientationLandscapeLeft:
            NSLog(@"屏幕向左橫置");
            self.orientation = 2;
            [self layoutViews];
            break;

        case UIDeviceOrientationLandscapeRight:
            NSLog(@"屏幕向右橫置");
            self.orientation = 2;
            [self layoutViews];
            break;

        case UIDeviceOrientationPortrait:
            NSLog(@"屏幕直立");
            self.orientation = 1;
            [self layoutViews];
            break;

        case UIDeviceOrientationPortraitUpsideDown:
            NSLog(@"屏幕直立，上下顛倒");
            self.orientation = 1;
            [self layoutViews];
            break;

        default:
            NSLog(@"无法识别");
            break;
    }
    return YES;
}

#pragma mark -- <setUI>
- (void)setUI
{
    [self addSubview:self.bgView];
    [self.bgView addSubview:self.closeBtn];
    [self.bgView addSubview:self.titleLbl];
    [self.bgView addSubview:self.desLbl];
    [self.bgView addSubview:self.startBtn];
    [self.bgView addSubview:self.agreeBtn];
    [self.bgView addSubview:self.mTableView];
    
    [self layoutViews];
}

- (void)layoutViews
{
    
    UIView *window = [UIApplication sharedApplication].keyWindow;
    
    _bgView.frame = CGRectMake(0, 0, [RXOSCommonTool getScreenWidth], RXAC ? 271 : 271);
    _bgView.center = window.center;
    
    _titleLbl.frame = CGRectMake(0, 21, CGRectGetWidth(_bgView.frame), 24);
    
    CGFloat desY = CGRectGetMaxY(_titleLbl.frame) + 20;
    if ([RXOSUserUtility sharedManager].privacieTitles.count >= 3) {
        desY -= 5;
    }
    _desLbl.frame = CGRectMake(0, RXAC ? 53 : 55, CGRectGetWidth(_bgView.frame), 22);
        
    if ([RXOSCommonTool isRTL]) {
        _closeBtn.frame = CGRectMake(CGRectGetWidth(_bgView.frame) - (RXAC ? 24 + 18 : 21 + 28), RXAC ? 12 : 16, 28, 28);
        _agreeBtn.frame = CGRectMake(RXAC ? 29 : 25, CGRectGetHeight(_bgView.frame) - (RXAC ? 43 + 26 : 43 + 25), RXAC ? 156 : 143, RXAC ? 43 : 43);
        _startBtn.frame = CGRectMake(CGRectGetWidth(_bgView.frame) - (RXAC ? CGRectGetWidth(_agreeBtn.frame) + 29 : CGRectGetWidth(_agreeBtn.frame) + 25), CGRectGetMinY(_agreeBtn.frame), CGRectGetWidth(_agreeBtn.frame), CGRectGetHeight(_agreeBtn.frame));
    } else {
        _closeBtn.frame = CGRectMake(RXAC ? 24 : 21, RXAC ? 12 : 16, 28, 28);
        _startBtn.frame = CGRectMake(RXAC ? 29 : 25, CGRectGetHeight(_bgView.frame) - (RXAC ? 43 + 26 : 43 + 25), RXAC ? 156 : 143, RXAC ? 43 : 43);
        _agreeBtn.frame = CGRectMake(CGRectGetWidth(_bgView.frame) - (RXAC ? CGRectGetWidth(_startBtn.frame) + 29 : CGRectGetWidth(_startBtn.frame) + 25), CGRectGetMinY(_startBtn.frame), CGRectGetWidth(_startBtn.frame), CGRectGetHeight(_startBtn.frame));
    }
    
    _mTableView.frame = CGRectMake(RXAC ? 29 : 25, RXAC ? 81 : 81, CGRectGetWidth(_bgView.frame) - (RXAC ? 58 : 50), RXAC ? 107 : 107);
    
    [self layoutSubviews];
}

- (void)show
{
    [RXOSCommonTool transformWithView:self.bgView];
    [UIView animateWithDuration:0.1 animations:^{
        self.backgroundColor = [[UIColor blackColor] colorWithAlphaComponent:0.5];
        
        [RXOSCommonTool showWithAnimate:self.bgView];
        
        [self layoutSubviews];
    }];
}

- (void)hide
{
//    [UIView animateWithDuration:0.1 animations:^{
//        UIView *window = [UIApplication sharedApplication].keyWindow;
//        self.backgroundColor = [[UIColor blackColor] colorWithAlphaComponent:0];
//        self.bgView.sd_layout.topSpaceToView(self, window.frame.size.height);
//        [self layoutSubviews];
//    }];
//
//    dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(0.15 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
    [[NSNotificationCenter defaultCenter] removeObserver:self];
    [self removeFromSuperview];
    
//    });
}

#pragma mark -- <actions>
- (void)closeBtnAction
{
    // 事件上报
    NSMutableDictionary *trackDic = [NSMutableDictionary dictionary];
    [trackDic setValue:@"1" forKey:@"agreement_action"];
    [[RXLogService sharedSDK] addLogSingleFirstLoginWithEvent:rxlog_agreement_process distinctId:@"" properties:trackDic];
    
    [self hide];
}

- (void)agreeBtnAction
{
    if (self.isQuickLogin) {
        if (self.quickAgreeBlock) {
            self.quickAgreeBlock();
        }
    } else {
        if (self.agreeBlock) {
            self.agreeBlock();
        }
    }

    [self hide];
}

- (void)selectAction:(UIButton *)btn
{
    btn.selected = !btn.selected;
    if (btn.isSelected) {
        [btn setImage:[UIImage rxOSBundleImageNamed:@"rx_priSelect"] forState:UIControlStateNormal];
    } else {
        [btn setImage:[UIImage rxOSBundleImageNamed:@"rx_priUnSelect"] forState:UIControlStateNormal];
    }
    
    BOOL allSelect = YES;
    for (int i = 0; i < _selectBtns.count; i++) {
        UIButton *selectBtn = _selectBtns[i];
        if (!selectBtn.isSelected) {
            allSelect = NO;
        }
    }
    
    if (allSelect) {
        _agreeBtn.userInteractionEnabled = YES;
        [_agreeBtn setBackgroundColor:[UIColor colorWithHexString:@"#20C0B3"]];
    } else {
        _agreeBtn.userInteractionEnabled = NO;
        [_agreeBtn setBackgroundColor:[UIColor colorWithHexString:@"b3e6e2"]];
    }
}

- (void)priTapAction:(UITapGestureRecognizer *)tap
{
    NSString *url = @"";
    NSArray *privacies = [RXOSUserUtility sharedManager].privacies;
    NSArray *privacieTitles = [RXOSUserUtility sharedManager].privacieTitles;
    
    if (privacieTitles.count > 0) {
        NSString *title = privacieTitles[tap.view.tag - SelectTag];
        title = [title stringByReplacingOccurrencesOfString:@"《" withString:@""];
        title = [title stringByReplacingOccurrencesOfString:@"》" withString:@""];
        RXOSCommonWKWebView *webView = [[RXOSCommonWKWebView alloc] initWithUrl:privacies[tap.view.tag - SelectTag] title:title content:nil];
    } else {
        
    }
}

#pragma mark -- <tableViewDelegate && dataSource>
- (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section
{
    return self.config.privacieTitles.count;
}

- (CGFloat)tableView:(UITableView *)tableView heightForRowAtIndexPath:(NSIndexPath *)indexPath
{
    CGFloat cellH = 32;
    if (indexPath.row == 0) {
        cellH = 36;
    }
    return cellH;
}

- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath
{
    NSString *cellIdentifier = [NSString stringWithFormat:@"cell%ld", indexPath.row];
    UITableViewCell *cell = [tableView dequeueReusableCellWithIdentifier:cellIdentifier];

    if (!cell) {
        cell = [[UITableViewCell alloc] initWithStyle:UITableViewCellStyleDefault reuseIdentifier:cellIdentifier];
        cell.backgroundColor = [UIColor clearColor];
        cell.contentView.backgroundColor = [UIColor clearColor];
        
        RXOSSelectBtn *selectBtn = [[RXOSSelectBtn alloc] init];
        [selectBtn setImage:[UIImage rxOSBundleImageNamed:@"rx_priUnSelect"] forState:UIControlStateNormal];
        [selectBtn addTarget:self action:@selector(selectAction:) forControlEvents:UIControlEventTouchUpInside];

        UILabel *priDes = [[UILabel alloc] init];
        priDes.text = self.config.privacieTitles[indexPath.row];
        priDes.font = [UIFont systemFontOfSize:14 weight:UIFontWeightRegular];
        priDes.textColor = [UIColor colorWithHexString:@"#16958A"];
        priDes.userInteractionEnabled = YES;
        priDes.tag = SelectTag + indexPath.row;

        UITapGestureRecognizer *tap = [[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(priTapAction:)];
        [priDes addGestureRecognizer:tap];

        NSMutableAttributedString *content = [[NSMutableAttributedString alloc] initWithString:priDes.text];
        NSRange contentRange = {0, [content length]};
        [content addAttribute:NSUnderlineStyleAttributeName value:[NSNumber numberWithInteger:NSUnderlineStyleSingle] range:contentRange];

        priDes.attributedText = content;

        [cell.contentView addSubview:selectBtn];
        [cell.contentView addSubview:priDes];
        
        if ([RXOSCommonTool isRTL]) {
            selectBtn.frame = CGRectMake(CGRectGetWidth(cell.contentView.frame) - 6 - (RXAC ? 32 : 52), 0, 32, 32);
            priDes.frame = CGRectMake(RXAC ? 0 : 10, 0, CGRectGetWidth(cell.contentView.frame) - (CGRectGetWidth(cell.contentView.frame) - CGRectGetMinX(selectBtn.frame)), 31);
        } else {
            selectBtn.frame = CGRectMake(13, 0, 32, 32);
            priDes.frame = CGRectMake(CGRectGetMaxX(selectBtn.frame), 0, CGRectGetWidth(_bgView.frame) - (RXAC ? 58 + 60 : 50 + 32), 31);
        }
        
        
        [self.selectBtns addObject:selectBtn];
        
        if (indexPath.row == 0) {
            if ([RXOSCommonTool isRTL]) {
                selectBtn.frame = CGRectMake(CGRectGetWidth(cell.contentView.frame) - 6 - (RXAC ? 32 : 52), 6, 32, 32);
                priDes.frame = CGRectMake(RXAC ? 0 : 10, 6, CGRectGetWidth(cell.contentView.frame) - (CGRectGetWidth(cell.contentView.frame) - CGRectGetMinX(selectBtn.frame)), 31);
            } else {
                selectBtn.frame = CGRectMake(13, 6, 32, 32);
                priDes.frame = CGRectMake(CGRectGetMaxX(selectBtn.frame), 6, CGRectGetWidth(_bgView.frame) - (RXAC ? 58 + 60 : 50 + 32), 31);
            }
        }
        
        cell.selectionStyle = UITableViewCellSelectionStyleNone;
    }

    return cell;
}

#pragma mark -- <lazy>
- (UIView *)bgView
{
    if (!_bgView) {
        _bgView = [[UIView alloc] init];
        _bgView.backgroundColor = [UIColor whiteColor];
        _bgView.layer.cornerRadius = 5;
    }
    return _bgView;
}

- (UILabel *)titleLbl
{
    if (!_titleLbl) {
        _titleLbl = [[UILabel alloc] init];
        _titleLbl.text = @"游戏条款";
        _titleLbl.textColor = [UIColor blackColor];
        _titleLbl.font = [UIFont systemFontOfSize:21 weight:UIFontWeightMedium];
        _titleLbl.textAlignment = NSTextAlignmentCenter;
    }
    return _titleLbl;
}

- (UILabel *)desLbl
{
    if (!_desLbl) {
        _desLbl = [[UILabel alloc] init];
        _desLbl.text = @"请全部同意并开始游戏";
        _desLbl.textColor = [UIColor colorWithHexString:@"#BBBBBB"];
        _desLbl.font = [UIFont systemFontOfSize:11 weight:UIFontWeightRegular];
        _desLbl.textAlignment = NSTextAlignmentCenter;
    }
    return _desLbl;
}

- (RXOSCloseBtn *)closeBtn
{
    if (!_closeBtn) {
        _closeBtn = [RXOSCloseBtn buttonWithType:UIButtonTypeCustom];
        _closeBtn.adjustsImageWhenHighlighted = NO;
        UIImage *backImage = [UIImage rxOSBundleImageNamed:@"rx_back"];
        if ([RXOSCommonTool isRTL]) {
            UIImage *flipImage = [UIImage imageWithCGImage:backImage.CGImage scale:backImage.scale orientation:UIImageOrientationDown];
            [_closeBtn setImage:flipImage forState:UIControlStateNormal];
        } else {
            [_closeBtn setImage:backImage forState:UIControlStateNormal];
        }
        [_closeBtn addTarget:self action:@selector(closeBtnAction) forControlEvents:UIControlEventTouchUpInside];
    }
    return _closeBtn;
}

- (UIButton *)agreeBtn
{
    if (!_agreeBtn) {
        _agreeBtn = [UIButton buttonWithType:UIButtonTypeCustom];
        [_agreeBtn setTitle:[RXLocation osLaunguage:@"开始游戏"] forState:UIControlStateNormal];
        [_agreeBtn setTitleColor:[UIColor whiteColor] forState:UIControlStateNormal];
        [_agreeBtn setTitleColor:[UIColor colorWithHexString:@"F2FFFB"] forState:UIControlStateNormal];
        [_agreeBtn setBackgroundColor:[UIColor colorWithHexString:@"b3e6e2"]];
        _agreeBtn.titleLabel.font = [UIFont systemFontOfSize:18 weight:UIFontWeightMedium];
        _agreeBtn.userInteractionEnabled = NO;
        _agreeBtn.layer.cornerRadius = 5;
        [_agreeBtn addTarget:self action:@selector(agreeBtnAction) forControlEvents:UIControlEventTouchUpInside];
    }
    return _agreeBtn;
}

- (UIButton *)startBtn
{
    if (!_startBtn) {
        _startBtn = [UIButton buttonWithType:UIButtonTypeCustom];
        [_startBtn setTitle:[RXLocation osLaunguage:@"同意协议并开始"] forState:UIControlStateNormal];
        [_startBtn setTitleColor:[UIColor colorWithHexString:@"#20C0B3"] forState:UIControlStateNormal];
        _startBtn.titleLabel.font = [UIFont systemFontOfSize:18 weight:UIFontWeightMedium];
        _startBtn.layer.borderColor = [UIColor colorWithHexString:@"#20C0B3"].CGColor;
        _startBtn.layer.borderWidth = 1;
        _startBtn.layer.cornerRadius = 5;
        [_startBtn addTarget:self action:@selector(agreeBtnAction) forControlEvents:UIControlEventTouchUpInside];
    }
    return _startBtn;
}

- (UITableView *)mTableView
{
    if (!_mTableView) {
        _mTableView = [[UITableView alloc] init];
        _mTableView.backgroundColor = [UIColor whiteColor];
        _mTableView.delegate = self;
        _mTableView.dataSource = self;
//        _mTableView.bounces = NO;
        _mTableView.separatorStyle = UITableViewCellSeparatorStyleNone;
        _mTableView.showsVerticalScrollIndicator = NO;
        _mTableView.backgroundColor = [UIColor colorWithHexString:@"#F0FFFD"];
        _mTableView.layer.cornerRadius = 7;
    }
    return _mTableView;
}

- (NSMutableArray *)selectBtns
{
    if (!_selectBtns) {
        _selectBtns = [NSMutableArray array];
    }
    return _selectBtns;
}

@end
