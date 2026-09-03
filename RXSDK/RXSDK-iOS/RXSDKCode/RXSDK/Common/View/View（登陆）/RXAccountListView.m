//
//  RXAccountListView.m
//  RXSDK
//
//  Created by 陈汉 on 2022/2/21.
//

#import "RXAccountListView.h"
#import "RXCommonTool.h"
#import "TYAttributedLabel.h"
#import "RXUserInfoModel.h"
#import "RXPrivacyView.h"
#import "RXLoginModel.h"
#import "RXAddLoginView.h"
#import "YYWebImage.h"
#import "YYModel.h"
#import "RXAddLoginView.h"
#import "RXLoginBtn.h"

@interface RXAccountListView () <UITableViewDelegate, UITableViewDataSource>

@property (nonatomic, strong) UIView *bgView;
@property (nonatomic, strong) RXLoginBtn *loginBtn;
@property (nonatomic, strong) UIButton *closeBtn;
@property (nonatomic, strong) UITableView *mTableView;
@property (nonatomic, strong) UIView *line;
@property (nonatomic, assign) NSInteger orientation;  // 屏幕方向 1竖屏 2横屏
@property (nonatomic, assign) BOOL isSelect;
@property (nonatomic, strong) NSMutableArray *accounts;
@property (nonatomic, copy) LoginAddAccountBlock addAccountBlock;
@property (nonatomic, copy) LoginTypeBlock loginTypeBlock;
@property (nonatomic, strong) RXAddLoginView *addLoginView;
@property (nonatomic, strong) UILabel *placeholderLbl;

@end

@implementation RXAccountListView

- (void)dealloc
{
    [[NSNotificationCenter defaultCenter] removeObserver:self];
}

- (instancetype)initWithAddAccount:(LoginAddAccountBlock)addAccount
                         loginType:(LoginTypeBlock)loginType
{
    self = [super initWithFrame:CGRectMake(0, 0, [UIApplication sharedApplication].keyWindow.frame.size.width, [UIApplication sharedApplication].keyWindow.frame.size.height)];
    if (self) {
        self.backgroundColor = [[UIColor blackColor] colorWithAlphaComponent:0];
        [[UIApplication sharedApplication].keyWindow addSubview:self];
        
        self.orientation = [RXCommonTool getInterfaceOrientation];
        self.addAccountBlock = addAccount;
        self.loginTypeBlock = loginType;
        self.accounts = [RXUserUtility sharedManager].accounts;
        
        [self setUI];
        
        [self show];
        
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(addLoginNotiAction:) name:noti_addLogin object:nil];
        
        // 监听屏幕旋转（横竖屏）
//        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(onDeviceOrientationDidChange)
//                             name:UIDeviceOrientationDidChangeNotification
//                                                       object:nil];
    }
    return self;
}

- (void)addLoginNotiAction:(NSNotification *)noti
{
//    if (self.loginTypeBlock) {
//        self.loginTypeBlock(LoginTypeAccount);
//    }
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
    [self.bgView sd_addSubviews:@[self.closeBtn, self.loginBtn, self.mTableView, self.line, self.placeholderLbl]];
    
    [self layoutViews];
}

- (void)layoutViews
{
    
    UIView *window = [UIApplication sharedApplication].keyWindow;
    
    _bgView.sd_layout.centerXEqualToView(window)
    .topSpaceToView(self, window.frame.size.height)
    .widthIs(320)
    .heightIs(262);
    
    _closeBtn.sd_layout.topSpaceToView(self.bgView, -10)
    .leftSpaceToView(self.bgView, -10)
    .widthIs(38)
    .heightEqualToWidth();
    
    _mTableView.sd_layout.topSpaceToView(self.bgView, 0)
    .leftSpaceToView(self.bgView, 27)
    .rightSpaceToView(self.bgView, 27)
    .heightIs(178);
    
    _line.sd_layout.topSpaceToView(self.mTableView, 0)
    .leftSpaceToView(self.bgView, 0)
    .rightSpaceToView(self.bgView, 0)
    .heightIs(0.5);
    
    _loginBtn.sd_layout.topSpaceToView(self.line, 19)
    .leftSpaceToView(self.bgView, 27)
    .rightSpaceToView(self.bgView, 27)
    .heightIs(44);
    
    _placeholderLbl.sd_layout.topSpaceToView(self.bgView, 80)
    .leftSpaceToView(self.bgView, 0)
    .rightSpaceToView(self.bgView, 0)
    .heightIs(18);
    
    [self layoutSubviews];
}

- (void)show
{
    [UIView animateWithDuration:0.15 animations:^{
        self.backgroundColor = [[UIColor blackColor] colorWithAlphaComponent:0.6];
        UIView *window = [UIApplication sharedApplication].keyWindow;
        self.bgView.sd_layout.topSpaceToView(self, window.frame.size.height / 2 - 262 / 2);
        [self layoutSubviews];
    }];
}

- (void)hide
{
    [UIView animateWithDuration:0.15 animations:^{
        UIView *window = [UIApplication sharedApplication].keyWindow;
        self.backgroundColor = [[UIColor blackColor] colorWithAlphaComponent:0];
        self.bgView.sd_layout.topSpaceToView(self, window.frame.size.height);
        [self layoutSubviews];
    }];
    
    dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(0.15 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
        [self removeFromSuperview];
    });
}

#pragma mark -- <tableViewDelegate && dataSource>
- (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section
{
    return self.accounts.count;
}

- (CGFloat)tableView:(UITableView *)tableView heightForRowAtIndexPath:(NSIndexPath *)indexPath
{
    if (indexPath.row == 0) {
        return 67;
    }
    return 50;
}

- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath
{
    NSString *cellIdentifier = [NSString stringWithFormat:@"cell%ld", indexPath.row];
    UITableViewCell *cell = [tableView dequeueReusableCellWithIdentifier:cellIdentifier];
    
    NSMutableDictionary *accountDic = self.accounts[indexPath.row];
    NSString *username = accountDic[@"username"];
    
    if (!cell) {
        cell = [[UITableViewCell alloc] initWithStyle:UITableViewCellStyleDefault reuseIdentifier:cellIdentifier];
        cell.backgroundColor = [UIColor clearColor];
        
        UIImageView *cellBg = [[UIImageView alloc] init];
        cellBg.backgroundColor = [UIColor whiteColor];
        cellBg.layer.cornerRadius = 4;
        cellBg.layer.borderColor = [UIColor colorWithHexString:@"e1e1e1"].CGColor;
        cellBg.layer.borderWidth = 0.5;
        [cell.contentView addSubview:cellBg];
        
        UIImageView *headImgView = [[UIImageView alloc] init];
        headImgView.image = [UIImage bundleImageNamed:@"loginAccount_normal"];
        [cellBg addSubview:headImgView];
        
        UILabel *cellLbl = [[UILabel alloc] init];
        cellLbl.font = [UIFont systemFontOfSize:15];
        cellLbl.text = username;
        [cellBg addSubview:cellLbl];
        
        UIImageView *rightArrow = [[UIImageView alloc] init];
        rightArrow.image = [UIImage bundleImageNamed:@"loginAccount_right"];
        [cellBg addSubview:rightArrow];
        
        if (indexPath.row == 0) {
            cellBg.sd_layout.topSpaceToView(cell.contentView, 25)
            .leftSpaceToView(cell.contentView, 0)
            .rightSpaceToView(cell.contentView, 0)
            .heightIs(42);
        } else {
            cellBg.sd_layout.topSpaceToView(cell.contentView, 8)
            .leftSpaceToView(cell.contentView, 0)
            .rightSpaceToView(cell.contentView, 0)
            .heightIs(42);
        }

        headImgView.sd_layout.topSpaceToView(cellBg, 4)
        .leftSpaceToView(cellBg, 13)
        .widthIs(33)
        .heightEqualToWidth();
        
        cellLbl.sd_layout.leftSpaceToView(headImgView, 8)
        .topSpaceToView(cellBg, 0)
        .bottomSpaceToView(cellBg, 0)
        .rightSpaceToView(cellBg, 40);
        
        rightArrow.sd_layout.topSpaceToView(cellBg, 15)
        .rightSpaceToView(cellBg, 24)
        .widthIs(12)
        .heightEqualToWidth();
    }
    
    cell.selectionStyle = UITableViewCellSelectionStyleNone;
    
    return cell;
}

- (void)tableView:(UITableView *)tableView didSelectRowAtIndexPath:(NSIndexPath *)indexPath
{
    NSMutableDictionary *accountDic = self.accounts[indexPath.row];
    NSString *username = accountDic[@"username"];
    NSString *password = accountDic[@"password"];
    [RXUserUtility savePhone:username];
    [RXUserUtility sharedManager].password = password;
    if (self.loginTypeBlock) {
        self.loginTypeBlock(LoginTypeAccount);
    }
    [self hide];
}

#pragma mark -- <actions>
- (void)loginBtnAction
{
    if (self.addAccountBlock) {
        self.addAccountBlock();
    }
}

#pragma mark -- <lazy>
- (UIView *)bgView
{
    if (!_bgView) {
        _bgView = [[UIView alloc] init];
        _bgView.backgroundColor = [UIColor colorWithHexString:@"fafafa"];
        _bgView.layer.cornerRadius = 8;
    }
    return _bgView;
}

- (RXLoginBtn *)loginBtn
{
    if (!_loginBtn) {
        _loginBtn = [RXLoginBtn buttonWithType:UIButtonTypeCustom];
        _loginBtn.adjustsImageWhenHighlighted = NO;
        [_loginBtn setImage:[UIImage bundleImageNamed:@"login_add"] forState:UIControlStateNormal];
        [_loginBtn setTitle:@"注册/添加账号" forState:UIControlStateNormal];
        [_loginBtn setTitleColor:[UIColor whiteColor] forState:UIControlStateNormal];
        _loginBtn.titleLabel.font = [UIFont systemFontOfSize:16];
        _loginBtn.backgroundColor = [UIColor colorWithHexString:@"31B14E"];
        _loginBtn.layer.cornerRadius = 4;
        [_loginBtn addTarget:self action:@selector(loginBtnAction) forControlEvents:UIControlEventTouchUpInside];
    }
    return _loginBtn;
}

- (UITableView *)mTableView
{
    if (!_mTableView) {
        _mTableView = [[UITableView alloc] init];
        _mTableView.backgroundColor = [UIColor colorWithHexString:@"fafafa"];
        _mTableView.delegate = self;
        _mTableView.dataSource = self;
        _mTableView.bounces = NO;
        _mTableView.separatorStyle = UITableViewCellSeparatorStyleNone;
        _mTableView.showsVerticalScrollIndicator = NO;
    }
    return _mTableView;
}

- (UIButton *)closeBtn
{
    if (!_closeBtn) {
        _closeBtn = [UIButton buttonWithType:UIButtonTypeCustom];
        _closeBtn.adjustsImageWhenHighlighted = NO;
        [_closeBtn setImage:[UIImage bundleImageNamed:@"login_back"] forState:UIControlStateNormal];
        [_closeBtn addTarget:self action:@selector(hide) forControlEvents:UIControlEventTouchUpInside];
    }
    return _closeBtn;
}

- (UIView *)line
{
    if (!_line) {
        _line = [[UIView alloc] init];
        _line.backgroundColor = [UIColor colorWithHexString:@"cecece"];
    }
    return _line;
}

- (UILabel *)placeholderLbl
{
    if (!_placeholderLbl) {
        _placeholderLbl = [[UILabel alloc] init];
        _placeholderLbl.text = @"暂无账号，请点击下方注册或添加账号";
        _placeholderLbl.font = [UIFont systemFontOfSize:15];
        _placeholderLbl.textAlignment = NSTextAlignmentCenter;
        _placeholderLbl.hidden = NO;
        if (self.accounts.count > 0) {
            _placeholderLbl.hidden = YES;
        }
    }
    return _placeholderLbl;
}

@end
