//
//  ViewController.m
//  RXSDKDemo-Public
//
//  Created by 陈汉 on 2024/1/2.
//

#import "ViewController.h"
#import "CHMarco.h"
#import "CHSettingViewController.h"
#import "RXCPIDViewController.h"
#import "RXLoginViewController.h"
#import <objc/runtime.h>
#import "RXOpenUrlViewController.h"
#import <RXSDK_Pure/RX_CommonNetworkExcuteManager.h>

#define SelectViewTag 100000

@interface ViewController ()

@property (nonatomic, assign) NSInteger interface; // 1横屏 2竖屏
@property (nonatomic, strong) UIButton *startBtn;

@property (nonatomic, strong) UIView *topBgView;
@property (nonatomic, strong) UIImageView *topImageView;
@property (nonatomic, strong) UIButton *backBtn;
@property (nonatomic, strong) UILabel *topTitleLbl;
@property (nonatomic, strong) UILabel *topDesLbl;
@property (nonatomic, strong) UIView *tapDebugView;
@property (nonatomic, strong) UIView *boltsDebugView;

@property (nonatomic, strong) UIView *bottomBgView;
@property (nonatomic, strong) UILabel *bottomDesLbl;
@property (nonatomic, strong) UIView *selectView1;
@property (nonatomic, strong) UIView *selectView2;

@property (nonatomic, assign) NSInteger selectIndex;

@end

@implementation ViewController

- (void)viewWillAppear:(BOOL)animated
{
    [super viewWillAppear:animated];
    [Tool sharedSDK].interface = 2;

    if (@available(iOS 16.0, *)) {
        // setNeedsUpdateOfSupportedInterfaceOrientations 方法是 UIViewController 的方法
        [self setNeedsUpdateOfSupportedInterfaceOrientations];
        NSArray *array = [[[UIApplication sharedApplication] connectedScenes] allObjects];
        UIWindowScene *scene = [array firstObject];
        // 屏幕方向
        UIInterfaceOrientationMask orientation = UIInterfaceOrientationMaskPortrait;
        UIWindowSceneGeometryPreferencesIOS *geometryPreferencesIOS = [[UIWindowSceneGeometryPreferencesIOS alloc] initWithInterfaceOrientations:orientation];
        // 开始切换
        [scene requestGeometryUpdateWithPreferences:geometryPreferencesIOS errorHandler:^(NSError * _Nonnull error) {
            NSLog(@"错误:%@", error);
        }];
    } else {
        [[UIDevice currentDevice] setValue:[NSNumber numberWithInt:UIInterfaceOrientationUnknown] forKey:@"orientation"];
            [[UIDevice currentDevice] setValue:[NSNumber numberWithInt:UIInterfaceOrientationPortrait] forKey:@"orientation"];
    }
}

- (void)viewDidLoad {
    [super viewDidLoad];
    
    self.view.backgroundColor = [UIColor whiteColor];
    
    [self setUI];
    [self versionRequest];
}

#pragma mark -- setUI
- (void)setUI
{
    [self.view sd_addSubviews:@[self.topBgView, self.topImageView, self.boltsDebugView, self.tapDebugView, self.topTitleLbl, self.topDesLbl, self.bottomBgView, self.startBtn, self.bottomDesLbl]];
    
    _topBgView.sd_layout.topSpaceToView(self.view, 0)
    .leftSpaceToView(self.view, 0)
    .rightSpaceToView(self.view, 0)
    .heightIs(kScaleWidth(310));
    
    _topImageView.sd_layout.topSpaceToView(self.view, -34)
    .rightSpaceToView(self.view, -54)
    .widthIs(kScaleWidth(215))
    .heightEqualToWidth();
    
    _boltsDebugView.sd_layout.topSpaceToView(self.view, 0)
    .leftSpaceToView(self.view, 0)
    .widthIs(kScaleWidth(100))
    .heightIs(kScaleWidth(200));
    
    _tapDebugView.sd_layout.topSpaceToView(self.view, 0)
    .rightSpaceToView(self.view, 0)
    .widthIs(kScaleWidth(215))
    .heightEqualToWidth();
    
    _topTitleLbl.sd_layout.topSpaceToView(self.view, kScaleWidth(142))
    .leftSpaceToView(self.view, kScaleWidth(40))
    .widthIs(200)
    .heightIs(40);
    
    _topDesLbl.sd_layout.topSpaceToView(_topTitleLbl, 8)
    .leftEqualToView(_topTitleLbl)
    .widthIs(200)
    .heightIs(16);
    
    _bottomBgView.sd_layout.topSpaceToView(_topBgView, -15)
    .bottomSpaceToView(self.view, 0)
    .leftSpaceToView(self.view, 0)
    .rightSpaceToView(self.view, 0);
    
    _startBtn.sd_layout.bottomSpaceToView(self.view, 70)
    .leftSpaceToView(self.view, 39)
    .rightSpaceToView(self.view, 39)
    .heightIs(54);
    
    _bottomDesLbl.sd_layout.topSpaceToView(_startBtn, 18)
    .leftSpaceToView(self.view, 0)
    .rightSpaceToView(self.view, 0)
    .heightIs(26);
    
    self.selectView1 = [self areaView:@"国内版" des:@"CHINA" img:kImageNamed(@"main_china") tag:SelectViewTag + 1];
    self.selectView2 = [self areaView:@"海外版" des:@"Other countries" img:kImageNamed(@"main_os") tag:SelectViewTag + 2];
    
    [_bottomBgView addSubview:_selectView1];
    [_bottomBgView addSubview:_selectView2];
    
    _selectView1.sd_layout.topSpaceToView(_bottomBgView, kScaleWidth(44))
    .leftSpaceToView(_bottomBgView, kScaleWidth(44))
    .widthIs(134)
    .heightIs(207);
    
    _selectView2.sd_layout.topSpaceToView(_bottomBgView, kScaleWidth(44))
    .rightSpaceToView(_bottomBgView, kScaleWidth(44))
    .widthIs(134)
    .heightIs(207);
    
    [self.view layoutSubviews];
    
    [self.topBgView.layer addSublayer:[UIView setGradualChangingColor:self.topBgView fromColor:[UIColor colorWithHexString:@"#70E1DA"] toColor:[UIColor colorWithHexString:@"#4AC4CE"] gradualType:GradualTypeHorizontal]];
    
    self.bottomBgView.layer.mask = [UIView drawCornerRadiusWithRect:CGRectMake(0, 0, self.bottomBgView.width_sd, self.bottomBgView.height_sd) corners:UIRectCornerTopLeft | UIRectCornerTopRight size:CGSizeMake(15, 15)];
}

- (UIView *)areaView:(NSString *)title des:(NSString *)des img:(UIImage *)img tag:(NSInteger)tag
{
    UIView *bgView = [[UIView alloc] init];
    bgView.tag = tag;
    bgView.backgroundColor = [UIColor whiteColor];
    bgView.layer.cornerRadius = 15;
    bgView.userInteractionEnabled = YES;
    bgView.layer.borderColor = [UIColor colorWithHexString:@"#6EDFD9"].CGColor;
    
    UITapGestureRecognizer *tap = [[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(tapAction:)];
    [bgView addGestureRecognizer:tap];
    
    UILabel *titleLbl = [[UILabel alloc] init];
    titleLbl.text = title;
    titleLbl.textColor = [UIColor blackColor];
    titleLbl.font = [UIFont boldSystemFontOfSize:20];
    titleLbl.textAlignment = NSTextAlignmentCenter;
    
    UILabel *desLbl = [[UILabel alloc] init];
    desLbl.text = des;
    desLbl.textColor = [UIColor colorWithHexString:@"#8B8B8B"];
    desLbl.font = [UIFont systemFontOfSize:12];
    desLbl.textAlignment = titleLbl.textAlignment;
    
    UIImageView *imgView = [[UIImageView alloc] init];
    imgView.image = img;
    
    [bgView sd_addSubviews:@[titleLbl, desLbl, imgView]];
    
    titleLbl.sd_layout.topSpaceToView(bgView, 44)
    .leftSpaceToView(bgView, 0)
    .rightSpaceToView(bgView, 0)
    .heightIs(22);
    
    desLbl.sd_layout.topSpaceToView(titleLbl, 2)
    .leftSpaceToView(bgView, 0)
    .rightSpaceToView(bgView, 0)
    .heightIs(14);
    
    imgView.sd_layout.topSpaceToView(desLbl, 14)
    .leftSpaceToView(bgView, 37)
    .widthIs(60)
    .heightEqualToWidth();
    
    return bgView;
}

#pragma mark -- actions
- (void)tapAction:(UITapGestureRecognizer *)tap
{
    self.startBtn.titleLabel.textColor = [UIColor whiteColor];
    [self.startBtn setBackgroundColor:[UIColor colorWithHexString:@"70E1DA"]];
    self.startBtn.userInteractionEnabled = YES;
    
    NSInteger tag = tap.view.tag - SelectViewTag;
    self.selectIndex = tag;
    if (tag == 1) {
        self.selectView1.layer.borderWidth = 2;
        self.selectView2.layer.borderWidth = 0;
        [CHUtility sharedManager].isOS = NO;
    } else {
        self.selectView2.layer.borderWidth = 2;
        self.selectView1.layer.borderWidth = 0;
        [CHUtility sharedManager].isOS = YES;
    }
}

- (void)startBtnAction:(UIButton *)btn
{
    if ([CHUtility sharedManager].isDebug) {
        RXCPIDViewController *vc = [[RXCPIDViewController alloc] init];
        [self.navigationController pushViewController:vc animated:YES];
    }else{
        CHSettingViewController *settingVC = [[CHSettingViewController alloc] init];
        [self.navigationController pushViewController:settingVC animated:YES];
    }
}

- (void)fiveTapAction{
    RXLoginViewController *loginVC= [[RXLoginViewController alloc] init];
    [self.navigationController pushViewController:loginVC animated:YES];
}

- (void)fourTapAction{
    RXOpenUrlViewController *openurlVC = [[RXOpenUrlViewController alloc] init];
    [self.navigationController pushViewController:openurlVC animated:YES];
}

#pragma mark -- request
- (void)versionRequest
{
    // 构建请求URL
    NSString *bundleId = @"com.ruixue.sdkpublic";
    NSString *urlString = [NSString stringWithFormat:@"https://itunes.apple.com/lookup?bundleId=%@", bundleId];
    NSURL *url = [NSURL URLWithString:urlString];

    // 创建NSURLSession对象
    NSURLSession *session = [NSURLSession sharedSession];

    // 创建NSURLSessionDataTask来发送GET请求
    NSURLSessionDataTask *dataTask = [session dataTaskWithURL:url completionHandler:^(NSData *data, NSURLResponse *response, NSError *error) {
        if (error) {
            NSLog(@"Error: %@", error.localizedDescription);
        } else {
            // 处理获取的数据
            NSString *result = [[NSString alloc] initWithData:data encoding:NSUTF8StringEncoding];
            NSData *jsonData = [result dataUsingEncoding:NSUTF8StringEncoding];
            NSError *error = nil;
            NSDictionary *jsonDictionary = [NSJSONSerialization JSONObjectWithData:jsonData options:kNilOptions error:&error];
            if (error) {
                NSLog(@"Error parsing JSON: %@", error.localizedDescription);
            } else {
                NSString *onlineVersion = jsonDictionary[@"results"][0][@"version"];
                NSString *auditVersion = [[[NSBundle mainBundle]infoDictionary] objectForKey:@"CFBundleShortVersionString"];
                NSComparisonResult result = [onlineVersion compare:auditVersion options:NSNumericSearch];
                if (result == NSOrderedAscending) {//线上版本小于本地版本，提审模式
//                    [Tool sharedSDK].isAudit = YES;
                    [Tool sharedSDK].isAudit = NO;
                } else if (result == NSOrderedDescending) {//线上版本大于本地版本，普通模式
                    [Tool sharedSDK].isAudit = NO;
                } else {//线上版本等于本地版本，普通模式
                    [Tool sharedSDK].isAudit = NO;
                }
            }
        }
    }];

    // 开始请求
    [dataTask resume];
}

#pragma mark -- lazy
- (UIView *)topBgView
{
    if (!_topBgView) {
        _topBgView = [[UIView alloc] init];
    }
    return _topBgView;
}

- (UIImageView *)topImageView
{
    if (!_topImageView) {
        _topImageView = [[UIImageView alloc] init];
        _topImageView.image = kImageNamed(@"main_bg");
    }
    return _topImageView;
}

- (UIView *)tapDebugView{
    if (!_tapDebugView) {
        _tapDebugView = [[UIView alloc] init];
        _tapDebugView.backgroundColor = [UIColor clearColor];
        _tapDebugView.userInteractionEnabled = YES;
        UITapGestureRecognizer *fiveTapGes = [[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(fiveTapAction)];
        fiveTapGes.numberOfTapsRequired = 5;
        [_tapDebugView addGestureRecognizer:fiveTapGes];
    }
    return _tapDebugView;
}

- (UIView *)boltsDebugView{
    if (!_boltsDebugView) {
        _boltsDebugView = [[UIView alloc] init];
        _boltsDebugView.backgroundColor = [UIColor clearColor];
        _boltsDebugView.userInteractionEnabled = YES;
        UITapGestureRecognizer *fiveTapGes = [[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(fourTapAction)];
        fiveTapGes.numberOfTapsRequired = 4;
        [_boltsDebugView addGestureRecognizer:fiveTapGes];
    }
    return _boltsDebugView;
}

- (UILabel *)topTitleLbl
{
    if (!_topTitleLbl) {
        _topTitleLbl = [[UILabel alloc] init];
        _topTitleLbl.textColor = [UIColor whiteColor];
        _topTitleLbl.font = [UIFont boldSystemFontOfSize:32];
        _topTitleLbl.text = @"Welcome";
    }
    return _topTitleLbl;
}

- (UILabel *)topDesLbl
{
    if (!_topDesLbl) {
        _topDesLbl = [[UILabel alloc] init];
        _topDesLbl.textColor = [UIColor whiteColor];
        _topDesLbl.font = [UIFont systemFontOfSize:12];
        _topDesLbl.text = [NSString stringWithFormat:@"version - %@", Version];
    }
    return _topDesLbl;
}

- (UIView *)bottomBgView
{
    if (!_bottomBgView) {
        _bottomBgView = [[UIView alloc] init];
        _bottomBgView.backgroundColor = [UIColor colorWithHexString:@"#F6F5FA"];
    }
    return _bottomBgView;
}

- (UILabel *)bottomDesLbl
{
    if (!_bottomDesLbl) {
        _bottomDesLbl = [[UILabel alloc] init];
        _bottomDesLbl.text = @"可在配置页面重新选择";
        _bottomDesLbl.textColor = [UIColor colorWithHexString:@"#819895"];
        _bottomDesLbl.font = [UIFont systemFontOfSize:12];
        _bottomDesLbl.textAlignment = NSTextAlignmentCenter;
    }
    return _bottomDesLbl;
}

- (UIButton *)startBtn
{
    if (!_startBtn) {
        _startBtn = [UIButton buttonWithType:UIButtonTypeCustom];
        [_startBtn setTitle:@"确认" forState:UIControlStateNormal];
        _startBtn.titleLabel.font = [UIFont boldSystemFontOfSize:20];
        _startBtn.titleLabel.textColor = [UIColor colorWithHexString:@"#C1C0C7"];
        [_startBtn setBackgroundColor:[UIColor colorWithHexString:@"#E4E3E8"]];
        [_startBtn addTarget:self action:@selector(startBtnAction:) forControlEvents:UIControlEventTouchUpInside];
        _startBtn.layer.cornerRadius = 15;
        _startBtn.userInteractionEnabled = NO;
    }
    return _startBtn;
}

@end
