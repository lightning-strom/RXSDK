//
//  RXLimitsView.m
//  RXSDK
//
//  Created by 陈汉 on 2021/9/28.
//

#import "RXLimitsView.h"
#import "RXUICommonTool.h"
#import "RXLegalModel.h"
#import "NSObject+RXUIAdditon.h"

#import <AVFoundation/AVFoundation.h>
#import <CoreLocation/CoreLocation.h>

#define TitleArr @[@"电话", @"读取/储存", @"麦克风", @"相机", @"定位", @"通话"]
#define IconArr @[@"phoneCode", @"readwrite", @"sound", @"camera", @"location", @"phone"]

@interface RXLimitsView () <UITextFieldDelegate>

@property (nonatomic, strong) UIView *bgView;
@property (nonatomic, strong) UILabel *titleLbl;
@property (nonatomic, strong) UILabel *desLbl;
@property (nonatomic, strong) UIButton *confirmBtn;
@property (nonatomic, strong) UIButton *closeBtn;
@property (nonatomic, assign) NSInteger orientation;  // 屏幕方向 1竖屏 2横屏
@property (nonatomic, assign) BOOL needSet;
@property (nonatomic, strong) RXLegalData_permission *model;
@property (nonatomic, strong) CLLocationManager *locManager;
@property (nonatomic, copy) RXLimitsClickBlock clickBlock;
@property (nonatomic, strong) NSArray *keys;

@end

@implementation RXLimitsView

- (void)dealloc
{
    [[NSNotificationCenter defaultCenter] removeObserver:self];
}

- (instancetype)initWithKeys:(NSArray *)keys
                  clickBlock:(RXLimitsClickBlock)clickBlock
{
    self = [super initWithFrame:[UIApplication sharedApplication].keyWindow.frame];
    if (self) {
        self.backgroundColor = [[UIColor blackColor] colorWithAlphaComponent:0];
        [[UIApplication sharedApplication].keyWindow addSubview:self];
        
        self.orientation = [RXUICommonTool getInterfaceOrientation];
        self.needSet = YES;
        self.clickBlock = clickBlock;
        self.keys = keys;
        
        RXLegalData *model = [RXLegalData rxu_modelWithDictionary:[RXUIUserUtility sharedManager].legalModel];
        self.model = model.permissions;
        
        if (keys.count > 0) {
            NSMutableArray *limits = [NSMutableArray array];
            for (int i = 0; i < self.model.list.count; i++) {
                RXLegalData_permissionList *list = [RXLegalData_permissionList rxu_modelWithDictionary:self.model.list[i]];
                for (int j = 0; j < keys.count; j++) {
                    NSString *key = keys[j];
                    if ([list.key isEqualToString:key]) {
                        [limits addObject:list];
                    }
                }
            }
            self.model.list = limits;
        }
        
        [self setUI];
        [self show];
        
        // 监听屏幕旋转（横竖屏）
//        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(onDeviceOrientationDidChange)
//                             name:UIDeviceOrientationDidChangeNotification
//                                                       object:nil];
    }
    return self;
}

- (instancetype)initWithLegalData:(NSDictionary *)legalData
                       clickBlock:(RXLimitsClickBlock)clickBlock
{
    self = [super initWithFrame:[UIApplication sharedApplication].keyWindow.frame];
    if (self) {
        self.backgroundColor = [[UIColor blackColor] colorWithAlphaComponent:0];
        [[UIApplication sharedApplication].keyWindow addSubview:self];
        
        self.orientation = [RXUICommonTool getInterfaceOrientation];
        self.needSet = YES;
        self.clickBlock = clickBlock;
        
        RXLegalData *model = [RXLegalData rxu_modelWithDictionary:legalData];
        self.model = model.permissions;
        
        NSMutableArray *limits = [NSMutableArray array];
        for (int i = 0; i < self.model.list.count; i++) {
            RXLegalData_permissionList *list = [RXLegalData_permissionList rxu_modelWithDictionary:self.model.list[i]];
            if (list.enable) {
                [limits addObject:list];
            }
        }
        self.model.list = limits;
        
        [self setUI];
        [self show];
        
        // 监听屏幕旋转（横竖屏）
//        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(onDeviceOrientationDidChange)
//                             name:UIDeviceOrientationDidChangeNotification
//                                                       object:nil];
    }
    return self;
}

- (BOOL)onDeviceOrientationDidChange{
    //获取当前设备Device
    UIDevice *device = [UIDevice currentDevice];
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
//    [UIView animateWithDuration:0.1 animations:^{
//        self.backgroundColor = [[UIColor blackColor] colorWithAlphaComponent:0];
//
//        CGFloat bgH = self.orientation == 2 ? 335 : 320;
//
//        if (self.model.list.count < 4) {
//            bgH -= 70;
//        }
//        self.bgView.sd_layout.bottomSpaceToView(self, -bgH);
//        [self layoutSubviews];
//    }];
    
//    dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(0.15 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
    [[NSNotificationCenter defaultCenter] removeObserver:self];
    [self removeFromSuperview];
    
//    });
}

#pragma mark -- <setUI>
- (void)setUI
{
    [self addSubview:self.bgView];
    [self.bgView addSubview:self.titleLbl];
    [self.bgView addSubview:self.desLbl];
    [self.bgView addSubview:self.confirmBtn];
    [self.bgView addSubview:self.closeBtn];
    
    [self layoutViews];
}

- (void)layoutViews
{
    UIView *window = [UIApplication sharedApplication].keyWindow;

    CGFloat bgW = RXAC ? 519 : 366;
    CGFloat bgH = RXAC ? 364 : 426;
    
    if (self.model.list.count < 4) {
        bgH -= 70;
    }
    
    _bgView.frame = CGRectMake(0, 0, bgW, bgH);
    _bgView.center = window.center;
    
    _titleLbl.frame = CGRectMake(0, 28, bgW, 26);
    
    _desLbl.frame = CGRectMake(RXAC ? 35 : 22, 70, bgW - (RXAC ? 70 : 44), RXAC ? 44 : 66);
    
    _closeBtn.frame = CGRectMake(RXAC ? 35 : 22, CGRectGetHeight(_bgView.frame) - 48 - 30, RXAC ? 216 : 153, 48);
    
    _confirmBtn.frame = CGRectMake(CGRectGetWidth(_bgView.frame) - (RXAC ? 216 + 35 : 153 + 22), CGRectGetMinY(_closeBtn.frame), CGRectGetWidth(_closeBtn.frame), CGRectGetHeight(_closeBtn.frame));
    
    if (self.needSet) {
        NSInteger count = 0;
        for (int i = 0; i < self.model.list.count; i++) {
            if (i == 3) count = 0;
            
            CGFloat viewW = RXAC ? 144 : 101;
            CGFloat viewH = RXAC ? 64 : 76;
            CGFloat viewX = (RXAC ? 35 : 22) + (viewW + (RXAC ? 9 : 10)) * count;
            CGFloat viewY = RXAC ? 130 : 162;
            
            if (i > 2) {
                viewY = RXAC ? 204 : 247;
            }
            
            RXLegalData_permissionList *list = [[RXLegalData_permissionList alloc] init];
            list = self.model.list[i];
            
            UIView *limitView = [self createLimitViewWithTitle:list.name icon:IconArr[i] des:list.content];
            [self.bgView addSubview:limitView];
            
            limitView.frame = CGRectMake(viewX, viewY, viewW, viewH);
            
            count++;
            if (i == 5) self.needSet = NO;
        }
    }
    [self layoutSubviews];
}

#pragma mark -- <getters && setters>
- (UIView *)createLimitViewWithTitle:(NSString *)title
                                icon:(NSString *)icon
                                 des:(NSString *)des
{
    UIView *limitView = [[UIView alloc] init];
    limitView.backgroundColor = [UIColor colorWithHexString:@"ECFAF9"];
    limitView.layer.cornerRadius = 6;
    
    UILabel *titleLbl = [[UILabel alloc] init];
    titleLbl.text = title;
    titleLbl.font = [UIFont boldSystemFontOfSize:15];
    titleLbl.textColor = [UIColor colorWithHexString:@"034C46"];
    
    UILabel *desLbl = [[UILabel alloc] init];
    desLbl.text = des;
    desLbl.textColor = [UIColor colorWithHexString:@"347C75"];
    desLbl.numberOfLines = 2;
    desLbl.font = [UIFont systemFontOfSize:11];
    
//    UIImageView *iconImgView = [[UIImageView alloc] init];
//    iconImgView.image = [UIImage rxBundleImageNamed:icon];
    
    [limitView addSubview:titleLbl];
    [limitView addSubview:desLbl];
    
    titleLbl.frame = CGRectMake(9, 9, 80, 15);
    desLbl.frame = CGRectMake(9, RXAC ? 22 : 28, RXAC ? 144 - 18 : 101 - 18, RXAC ? 28 : 36);
    
    CGFloat desH = [des heightForFont:desLbl.font width:CGRectGetWidth(desLbl.frame)] + 2;
    desLbl.frame = CGRectMake(9, RXAC ? 28 : 28, RXAC ? 144 - 18 : 101 - 18, RXAC ? desH : 36);
    
//    [limitView addSubview:iconImgView];
    
    
//    iconImgView.sd_layout.topSpaceToView(limitView, 6)
//    .leftSpaceToView(limitView, 8)
//    .widthIs(14)
//    .heightEqualToWidth();
    
    return limitView;
}

#pragma mark -- <actions>
- (void)closeBtnAction
{
    if (self.clickBlock) {
        self.clickBlock(0);
    }
    [self hide];
}

- (void)confirmBtnAction
{
    if (self.clickBlock) {
        self.clickBlock(1);
    }
//    for (int i = 0; i < self.model.list.count; i++) {
//        RXLegalData_permissionList *list = [RXLegalData_permissionList yy_modelWithDictionary:self.model.list[i]];
//
//        if ([list.key isEqualToString:@"mic"]) {
//            // 麦克权限请求
//            [AVCaptureDevice requestAccessForMediaType:AVMediaTypeAudio completionHandler:^(BOOL granted) {
//
//            }];
//        } else if ([list.key isEqualToString:@"camera"]) {
//            // 相机权限请求
//            [AVCaptureDevice requestAccessForMediaType:AVMediaTypeVideo completionHandler:^(BOOL granted) {
//
//            }];
//        } else if ([list.key isEqualToString:@"locate"]) {
//            [self.locManager requestAlwaysAuthorization];
//        }
//    }
    [self hide];
}

#pragma mark -- <lazy>
- (UIView *)bgView
{
    if (!_bgView) {
        _bgView = [[UIView alloc] init];
        _bgView.backgroundColor = [UIColor whiteColor];
        _bgView.layer.cornerRadius = 6;
    }
    return _bgView;
}

- (UILabel *)titleLbl
{
    if (!_titleLbl) {
        _titleLbl = [[UILabel alloc] init];
        _titleLbl.text = @"权限获取";
        _titleLbl.textColor = [UIColor blackColor];
        _titleLbl.font = [UIFont boldSystemFontOfSize:24];
        _titleLbl.textAlignment = NSTextAlignmentCenter;
    }
    return _titleLbl;
}

- (UILabel *)desLbl
{
    if (!_desLbl) {
        _desLbl = [[UILabel alloc] init];
        _desLbl.text = @"为了游戏的正常体验，将向您申请以下权限，若您需要关闭权限，请于系统设置进行关闭授权，但可能影响部分功能的正常使用。";
        _desLbl.numberOfLines = 3;
        _desLbl.textColor = [UIColor blackColor];
        _desLbl.font = [UIFont systemFontOfSize:15];
    }
    return _desLbl;
}

- (UIButton *)confirmBtn
{
    if (!_confirmBtn) {
        _confirmBtn = [UIButton buttonWithType:UIButtonTypeCustom];
        [_confirmBtn setBackgroundColor:[UIColor colorWithHexString:@"20C0B3"]];
        [_confirmBtn setTitle:@"确认" forState:UIControlStateNormal];
        [_confirmBtn setTitleColor:[UIColor colorWithHexString:@"F2FFFB"] forState:UIControlStateNormal];
        _confirmBtn.titleLabel.font = [UIFont systemFontOfSize:20];
        [_confirmBtn addTarget:self action:@selector(confirmBtnAction) forControlEvents:UIControlEventTouchUpInside];
        _confirmBtn.layer.cornerRadius = 6;
    }
    return _confirmBtn;
}

- (UIButton *)closeBtn
{
    if (!_closeBtn) {
        _closeBtn = [UIButton buttonWithType:UIButtonTypeCustom];
        [_closeBtn setTitle:@"以后再说" forState:UIControlStateNormal];
        [_closeBtn setTitleColor:[UIColor colorWithHexString:@"20C0B3"] forState:UIControlStateNormal];
        _closeBtn.titleLabel.font = [UIFont systemFontOfSize:20];
        _closeBtn.layer.masksToBounds = YES;
        _closeBtn.layer.cornerRadius = 6;
        _closeBtn.layer.borderColor = [UIColor colorWithHexString:@"20C0B3"].CGColor;
        _closeBtn.layer.borderWidth = 1;
        [_closeBtn addTarget:self action:@selector(closeBtnAction) forControlEvents:UIControlEventTouchUpInside];
    }
    return _closeBtn;
}

- (CLLocationManager *)locManager
{
    if (!_locManager) {
        _locManager = [[CLLocationManager alloc] init];
        [_locManager requestWhenInUseAuthorization];
    }
    return _locManager;
}

@end
