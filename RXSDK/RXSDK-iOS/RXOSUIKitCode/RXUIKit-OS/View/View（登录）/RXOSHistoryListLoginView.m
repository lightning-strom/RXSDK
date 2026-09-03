//
//  RXOSHistoryListLoginView.m
//  RXUIKit
//
//  Created by 陈汉 on 2023/3/20.
//

#import "RXOSHistoryListLoginView.h"
#import "RXOSReminderView.h"
#import "RXOSQuickLoginView.h"
#import "RXOSCloseBtn.h"

#define LoginBtnTag 100000
#define DeleteBtnTag 200000

@interface RXOSHistoryListLoginView () <UITableViewDelegate, UITableViewDataSource>

@property (nonatomic, assign) NSInteger orientation;  // 屏幕方向 1竖屏 2横屏
@property (nonatomic, strong) UIView *bgView;
@property (nonatomic, strong) NSMutableArray *loginTypes;
@property (nonatomic, strong) RXOSUILoginConfig *loginConfig;
@property (nonatomic, strong) RXOSCloseBtn *backBtn;
@property (nonatomic, strong) UILabel *titleLbl;
@property (nonatomic, strong) UITableView *mTableView;
@property (nonatomic, strong) NSMutableArray *accountList;
@property (nonatomic, assign) NSInteger selectIndex;
@property (nonatomic, copy) SelectAccountBlock selectAccountBlock;

@end

@implementation RXOSHistoryListLoginView

- (void)dealloc
{
    [[NSNotificationCenter defaultCenter] removeObserver:self];
}

- (instancetype)initWithLoginConfig:(RXOSUILoginConfig *)loginConfig
                           viewType:(RXUserType)viewType
                      selectAccount:(SelectAccountBlock)selectAccount
{
    self = [super initWithFrame:CGRectMake(0, 0, [UIApplication sharedApplication].keyWindow.frame.size.width, [UIApplication sharedApplication].keyWindow.frame.size.height)];
    if (self) {
        self.backgroundColor = [[UIColor blackColor] colorWithAlphaComponent:0];
        [[UIApplication sharedApplication].keyWindow addSubview:self];
        
        self.orientation = [RXOSCommonTool getInterfaceOrientation];
        self.loginConfig = loginConfig;
        self.accountList = [NSMutableArray arrayWithArray:[RXOSUserUtility sharedManager].accounts];
        self.selectAccountBlock = selectAccount;
        
        [self setUI];
        
        [self show];
        
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(loginCallBack:) name:noti_rxLogin object:nil];
    }
    return self;
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

- (void)show
{
    [RXOSCommonTool transformWithView:self.bgView];
    [UIView animateWithDuration:0.1 animations:^{
//        self.backgroundColor = [[UIColor blackColor] colorWithAlphaComponent:0.5];
        self.backgroundColor = [UIColor clearColor];
        
        [RXOSCommonTool showWithAnimate:self.bgView];
        
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
    [self.bgView addSubview:self.backBtn];
    [self.bgView addSubview:self.mTableView];
    
    NSMutableArray *imageArr = [NSMutableArray array];
    NSMutableArray *titleArr = [NSMutableArray array];
    NSMutableArray *colorArr = [NSMutableArray array];
    for (int i = 0; i < self.loginTypes.count; i++) {
        RXUserType userType = [RXOSCommonTool getUserType:self.loginTypes[i]];
        switch (userType) {
            case RXUserType_visitor:
            {
                [imageArr addObject:@"rx_loginMore_visitor"];
                [titleArr addObject:@"游客"];
                [colorArr addObject:@"#3B89FD"];
                break;
            }
            case RXUserType_apple:
            {
                [imageArr addObject:@"rx_loginMore_apple"];
                [titleArr addObject:@"Apple"];
                [colorArr addObject:@"#000000"];
                break;
            }
            case RXUserType_w:
            {
                [imageArr addObject:@"rx_loginMore_wechat"];
                [titleArr addObject:@"微信"];
                [colorArr addObject:@"#20C0B3"];
                break;
            }
            case RXUserType_auth:
            {
                [imageArr addObject:@"rx_loginMore_auth"];
                [titleArr addObject:@"一键登录"];
                [colorArr addObject:@"#000000"];
                break;
            }
            case RXUserType_account:
            {
                [imageArr addObject:@"rx_loginMore_username"];
                [titleArr addObject:@"账号"];
                [colorArr addObject:@"#000000"];
                break;
            }
            case RXUserType_code:
            {
                [imageArr addObject:@"rx_loginMore_code"];
                [titleArr addObject:@"验证码"];
                [colorArr addObject:@"#000000"];
                break;
            }
        }
    }
    
    [self layoutViews];
}

- (void)layoutViews
{
    UIView *window = [UIApplication sharedApplication].keyWindow;
    
//    self.bgView.frame = CGRectMake(0, 0, 344, 240);
    self.bgView.frame = CGRectMake(0, 0, [RXOSCommonTool getScreenWidth], RXAC ? 302 : 334);
    self.bgView.center = window.center;
    
    if ([RXOSCommonTool isRTL]) {
        self.backBtn.frame = CGRectMake(CGRectGetWidth(self.bgView.frame) - (RXAC ? 24 + 28: 21 + 28), 16, 28, 28);
    } else {
        self.backBtn.frame = CGRectMake(RXAC ? 24 : 21, 16, 28, 28);
    }
    
    self.titleLbl.frame = CGRectMake(0, 21, [RXOSCommonTool getScreenWidth], 24);
    
    self.mTableView.frame = CGRectMake(0, CGRectGetMaxY(_titleLbl.frame) + 10, [RXOSCommonTool getScreenWidth], CGRectGetHeight(self.bgView.frame) - 83);
    
    [self layoutSubviews];
}

#pragma mark -- <UITableViewDelegate && UITableViewDataSource>
- (NSInteger)numberOfSectionsInTableView:(UITableView *)tableView
{
    return 1;
}

- (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section
{
    return [NSMutableArray arrayWithArray:[RXOSUserUtility sharedManager].accounts].count;
}

- (CGFloat)tableView:(UITableView *)tableView heightForRowAtIndexPath:(NSIndexPath *)indexPath
{
    return RXAC ? 48 : 55;
}

- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath
{
    UITableViewCell *cell = [tableView dequeueReusableCellWithIdentifier:@"cell"];
//    if (!cell) {
        cell = [[UITableViewCell alloc] initWithStyle:UITableViewCellStyleDefault reuseIdentifier:@"cell"];
        cell.selectionStyle = UITableViewCellSelectionStyleNone;
    cell.backgroundColor = _bgView.backgroundColor;
//    }
    
    
    NSMutableArray *arr = [NSMutableArray arrayWithArray:[RXOSUserUtility sharedManager].accounts];
    NSMutableDictionary *userInfo = [RXOSUserUtility sharedManager].accounts[indexPath.row];
    
    UIView *cellBg = [[UIView alloc] init];
//    cellBg.backgroundColor = [UIColor colorWithHexString:@"#F4FAFA"];
    cellBg.layer.borderColor = [UIColor colorWithHexString:@"#E2F2F1"].CGColor;
    cellBg.layer.borderWidth = 1;
    cellBg.layer.cornerRadius = 5;
    [cell.contentView addSubview:cellBg];
    
    UIImageView *headImgView = [[UIImageView alloc] init];
    headImgView.image = [UIImage rxOSBundleImageNamed:[RXOSCommonTool getIconWithLoginType:[userInfo[@"loginType"] integerValue] username:userInfo[@"username"]]];
    [cellBg addSubview:headImgView];
    
    UILabel *nameLbl = [[UILabel alloc] init];
    nameLbl.textColor = [UIColor blackColor];
    
    NSString *nickname = userInfo[@"nickname"];
    long loginType = [userInfo[@"loginType"] longValue];
    if ((loginType == 1 || loginType == 10) && [[nickname substringToIndex:1] isEqualToString:@"+"]) {
        nickname = [RXOSCommonTool usernameSec:nickname];
        if (nickname.length > 4) {
            NSInteger zeroCount = 0;
            for (int i = 1; i < 5; i++) {
                NSString *subStr = [nickname substringWithRange:NSMakeRange(i, 1)];
                if ([subStr isEqualToString:@"0"]) {
                    zeroCount++;
                } else {
                    break;
                }
            }
            if (zeroCount > 0) {
                nickname = [nickname stringByReplacingCharactersInRange:NSMakeRange(1, zeroCount) withString:@""];
            }
        }
    }
    nameLbl.text = nickname;
    
    nameLbl.font = [UIFont systemFontOfSize:16 weight:UIFontWeightRegular];
    [cellBg addSubview:nameLbl];
    
    UIButton *deleteBtn = [UIButton buttonWithType:UIButtonTypeCustom];
    deleteBtn.tag = DeleteBtnTag + indexPath.row;
    [deleteBtn setImage:[UIImage rxOSBundleImageNamed:@"rx_login_delete"] forState:UIControlStateNormal];
    [deleteBtn addTarget:self action:@selector(deleteBtnAction:) forControlEvents:UIControlEventTouchUpInside];
    
    [cellBg addSubview:deleteBtn];
    
    cellBg.frame = CGRectMake(RXAC ? 29 : 25, 8, (RXAC ? 324 : 295), RXAC ? 39 : 46);
    
    if ([RXOSCommonTool isRTL]) {
        deleteBtn.frame = CGRectMake(11, RXAC ? 8 : 11.5, 23, 23);
        nameLbl.frame = CGRectMake(42, 0, CGRectGetWidth(cellBg.frame) - 42 - 23 - 25, RXAC ? 39 : 46);
        headImgView.frame = CGRectMake(CGRectGetWidth(cellBg.frame) - 35, RXAC ? 7 : 10.5, 25, 25);
        
        nameLbl.textAlignment = NSTextAlignmentRight;
    } else {
        headImgView.frame = CGRectMake(11, RXAC ? 8 : 11.5, 23, 23);
        nameLbl.frame = CGRectMake(42, 0, 190, RXAC ? 39 : 46);
        deleteBtn.frame = CGRectMake(CGRectGetWidth(cellBg.frame) - 33, RXAC ? 7 : 10.5, 25, 25);
    }
    
    self.selectIndex = indexPath.row;
    
    return cell;
}

- (void)tableView:(UITableView *)tableView didSelectRowAtIndexPath:(NSIndexPath *)indexPath
{
    NSMutableDictionary *selectDic = [RXOSUserUtility sharedManager].accounts[indexPath.row];
    
    if ([selectDic[@"loginType"] integerValue] == 1) {
        [RXOSUserUtility sharedManager].username = selectDic[@"username"];
        [RXOSUserUtility sharedManager].password = selectDic[@"password"];
    } else {
        [RXOSUserUtility sharedManager].username = selectDic[@"username"];
    }
    
    if (self.selectAccountBlock) {
        self.selectAccountBlock(selectDic);
    }
    
    [self hide];
}

#pragma mark -- <actions>
- (void)deleteBtnAction:(UIButton *)btn
{
    RXOSReminderView *reMinderView = [[RXOSReminderView alloc] initWithDesStr:@"确定删除该账号？" title:@"提示" complete:^{
        NSMutableArray *accounts = [NSMutableArray arrayWithArray:[RXOSUserUtility sharedManager].accounts];
        if (accounts.count > 0) {
            [accounts removeObjectAtIndex:btn.tag - DeleteBtnTag];
            [RXOSUserUtility saveAccounts:accounts];
            [self.mTableView reloadData];
            
            if (accounts.count <= 0) {
                [RXOSUserUtility sharedManager].isFirstView = YES;
                
                RXOSQuickLoginView *loginView = [[RXOSQuickLoginView alloc] initWithLoginConfig:self.loginConfig loginEvent:self.loginTypeBlock complete:self.loginComplete];
                if (self.deleteBlock) {
                    self.deleteBlock();
                }
                
                [self hide];
            } else {
                NSMutableDictionary *selectDic = accounts[0];
                
                if (self.selectAccountBlock) {
                    self.selectAccountBlock(selectDic);
                }
            }
        }
    }];
}

- (void)loginCallBack:(NSNotification *)noti
{
    NSMutableDictionary *notiDic = [NSMutableDictionary dictionaryWithDictionary:noti.userInfo];
    
    NSDictionary *loginModel = notiDic[@"loginData"];
    NSInteger code = [loginModel[@"code"] integerValue];
    NSString *tipString = loginModel[@"msg"];
    if (loginModel && code == 0) {
//        [SVProgressHUD showSuccessWithStatus:@"登录成功"];
        [RXOSHUD hideHUD];
        
        [RXOSUserUtility saveLoginModel:loginModel];
        [self hide];
    } else {
        [RXOSHUD showErrorText:tipString];
    }
    
    NSNumber *loginType = notiDic[@"loginType"];
    if (loginType) {
        [RXOSUserUtility saveLoginType:loginType];
    }
}

#pragma mark -- <lazy>
- (UIView *)bgView
{
    if (!_bgView) {
        _bgView = [[UIView alloc] init];
        _bgView.backgroundColor = [UIColor whiteColor];
        _bgView.layer.cornerRadius = 7;
    }
    return _bgView;
}

- (RXOSCloseBtn *)backBtn
{
    if (!_backBtn) {
        _backBtn = [RXOSCloseBtn buttonWithType:UIButtonTypeCustom];
        UIImage *backImage = [UIImage rxOSBundleImageNamed:@"rx_back"];
        if ([RXOSCommonTool isRTL]) {
            UIImage *flipImage = [UIImage imageWithCGImage:backImage.CGImage scale:backImage.scale orientation:UIImageOrientationDown];
            [_backBtn setImage:flipImage forState:UIControlStateNormal];
        } else {
            [_backBtn setImage:backImage forState:UIControlStateNormal];
        }
        [_backBtn addTarget:self action:@selector(hide) forControlEvents:UIControlEventTouchUpInside];
    }
    return _backBtn;
}

- (UILabel *)titleLbl
{
    if (!_titleLbl) {
        _titleLbl = [[UILabel alloc] init];
        _titleLbl.text = @"切换账号";
        _titleLbl.textColor = [UIColor blackColor];
        _titleLbl.font = [UIFont systemFontOfSize:21 weight:UIFontWeightMedium];
        _titleLbl.textAlignment = NSTextAlignmentCenter;
    }
    return _titleLbl;
}

- (UITableView *)mTableView
{
    if (!_mTableView) {
        _mTableView = [[UITableView alloc] initWithFrame:CGRectZero style:UITableViewCellStyleDefault];
        _mTableView.backgroundColor = _bgView.backgroundColor;
        _mTableView.dataSource = self;
        _mTableView.delegate = self;
        _mTableView.separatorStyle = UITableViewCellSeparatorStyleNone;
    }
    return _mTableView;
}

@end

