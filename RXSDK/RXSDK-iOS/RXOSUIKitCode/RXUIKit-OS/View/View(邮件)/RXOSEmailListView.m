//
//  RXOSEmailListView.m
//  RXUIKit-OS
//
//  Created by root11 on 2024/7/23.
//

#import "RXOSEmailListView.h"
#import "RXOSEmailListViewCell.h"
#import "RXOSEmailDetailView.h"
#import <RXSDK_Pure/RX_CommonNetworkExcuteManager.h>

@interface RXOSEmailListView ()<UITableViewDelegate, UITableViewDataSource>

@property (nonatomic, assign) NSInteger orientation;  // 屏幕方向 1竖屏 2横屏
@property (nonatomic, strong) UIView *bgView;
@property (nonatomic, strong) UILabel *titleLbl;
@property (nonatomic, strong) UIButton *closeBtn;
@property (nonatomic, strong) UITableView *mTableView;
@property (nonatomic, strong) UIButton *deleteBtn;
@property (nonatomic, strong) UILabel *tipLabel;
@property (nonatomic, strong) UIButton *oneClickReceiveBtn;
@property (nonatomic, copy) NSString *cpUserId;
@property (nonatomic, copy) SelectAccountBlock selectAccountBlock;
@property (nonatomic, strong) NSMutableArray *emailListArray;

@end

@implementation RXOSEmailListView

- (void)dealloc
{
    [[NSNotificationCenter defaultCenter] removeObserver:self];
}

- (instancetype)initWithCpUserId:(NSString *)cpUserId
{
    self = [super initWithFrame:CGRectMake(0, 0, [UIApplication sharedApplication].keyWindow.frame.size.width, [UIApplication sharedApplication].keyWindow.frame.size.height)];
    if (self) {
        self.backgroundColor = [[UIColor blackColor] colorWithAlphaComponent:0.5];
//        [[UIApplication sharedApplication].keyWindow addSubview:self];
        [[UIViewController currentViewController].view addSubview:self];
        [[UIViewController currentViewController].view bringSubviewToFront:self];
        
        self.orientation = [RXOSCommonTool getInterfaceOrientation];
        
        self.cpUserId = cpUserId;
        
        [self setUI];
        [self show];
        [self loadEmailList];
        
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(refreshEmailList) name:RXUINoti_refreshEmailList object:nil];
    }
    return self;
}

#pragma mark - noti
- (void)refreshEmailList{
    [self loadEmailList];
}

#pragma mark - request
- (void)loadEmailList{
    [RXOSHUD showHUD];
    [self.emailListArray removeAllObjects];
    __weak typeof(self) weakSelf = self;
    [[RXApiService sharedSDK] getEmailListWithCpUserID:self.cpUserId complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
        if (!error) {
        [RXOSHUD hideHUD];
            if ([response[@"code"] integerValue] == 0) {
                NSInteger allCount = [response[@"data"][@"all_count"] integerValue];
                NSInteger notReceivedCount = [response[@"data"][@"not_received_count"] integerValue];
            if (allCount == 0) {//一键删除禁用
                [weakSelf setDeleBtnEnable:NO];
            }else{//一键删除启用
                [weakSelf setDeleBtnEnable:YES];
            }
            if (notReceivedCount == 0) {//一键领取禁用
                [weakSelf setReceiveBtnEnable:NO];
            }else{//一键领取启用
                [weakSelf setReceiveBtnEnable:YES];
            }
                NSArray *listArray = response[@"data"][@"list"];
            weakSelf.emailListArray = [NSMutableArray arrayWithArray:listArray];
            [weakSelf.mTableView reloadData];
        }else{
            [RXOSHUD showErrorText:[RXLocation osLaunguage:@"加载失败"]];
        }
        }else{
            [RXOSHUD showErrorText:[RXLocation osLaunguage:@"加载失败"]];
        }
    }];
}

- (void)oneClickGainGift{
    [RXOSHUD showHUD];
    __weak typeof(self) weakSelf = self;
    [[RXApiService sharedSDK] receivePropsWithCpUserID:self.cpUserId type:2 emailID:0 complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
        if (!error) {
            if ([response[@"code"] integerValue] == 0) {
            [RXOSHUD showSuccessText:[RXLocation osLaunguage:@"领取成功"]];
            dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(2.0 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
                [weakSelf loadEmailList];
            });
        }else{
            [RXOSHUD showErrorText:[RXLocation osLaunguage:@"领取失败"]];
        }
        }else{
            [RXOSHUD showErrorText:[RXLocation osLaunguage:@"领取失败"]];
        }
    }];
}

- (void)oneClickDeleteGift{
    [RXOSHUD showHUD];
    __weak typeof(self) weakSelf = self;
    [[RXApiService sharedSDK] deleteEmailWithCpUserID:self.cpUserId type:2 emailID:0 complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
        if (!error) {
            if ([response[@"code"] integerValue] == 0) {
            [RXOSHUD showSuccessText:[RXLocation osLaunguage:@"删除成功"]];
            dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(2.0 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
                [weakSelf loadEmailList];
            });
        }else{
            [RXOSHUD showErrorText:[RXLocation osLaunguage:@"删除失败"]];
        }
        }else{
            [RXOSHUD showErrorText:[RXLocation osLaunguage:@"删除失败"]];
        }
    }];
}

#pragma mark -- <setUI>
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
        [RXOSCommonTool showWithAnimate:self.bgView];
        [self layoutSubviews];
    }];
}

- (void)hide
{
    [[NSNotificationCenter defaultCenter] removeObserver:self];
    [self removeFromSuperview];
}

- (void)setUI
{
    [self addSubview:self.bgView];
    [self.bgView addSubview:self.titleLbl];
    [self.bgView addSubview:self.closeBtn];
    [self.bgView addSubview:self.mTableView];
    [self.bgView addSubview:self.deleteBtn];
    [self.bgView addSubview:self.tipLabel];
    [self.bgView addSubview:self.oneClickReceiveBtn];
    
    [self layoutViews];
}

- (void)layoutViews
{
    UIView *window = [UIApplication sharedApplication].keyWindow;
    
    if (RXAC) {//横屏 左右100 上下30，间距尽量不动，其他等比例
        self.bgView.frame = CGRectMake(RXUScaleWidth(100), RXUScaleWidth(30), RXUScaleWidth(531), RXUScaleWidth(311));
        self.bgView.center = window.center;
        //横屏
        CGFloat bgViewWidth = self.bgView.frame.size.width;
        CGFloat bgViewHeight = self.bgView.frame.size.height;
        
        self.titleLbl.frame = CGRectMake(0, 0, bgViewWidth, RXUScaleWidth(45));
        
        self.mTableView.frame = CGRectMake(12, RXUScaleWidth(45), bgViewWidth - 24, bgViewHeight - RXUScaleWidth(89));
        
        if ([RXOSCommonTool isRTL]) {
            self.closeBtn.frame = CGRectMake(17, RXUScaleWidth(10), RXUScaleWidth(25), RXUScaleWidth(25));
            
            self.deleteBtn.frame = CGRectMake(bgViewWidth - 12 - RXUScaleWidth(27), bgViewHeight - 8 - RXUScaleWidth(27), RXUScaleWidth(27), RXUScaleWidth(27));
            
            self.oneClickReceiveBtn.frame = CGRectMake(12, bgViewHeight - 8 - RXUScaleWidth(27), RXUScaleWidth(100), RXUScaleWidth(27));
            //tipLabel多减去16的宽度，不过无影响
            self.tipLabel.textAlignment = NSTextAlignmentRight;
            self.tipLabel.frame = CGRectMake(self.deleteBtn.frame.origin.x - 16 - (bgViewWidth - CGRectGetMaxX(self.oneClickReceiveBtn.frame) - 12 - RXUScaleWidth(27) - 12 - 16), bgViewHeight - 8 - RXUScaleWidth(27), bgViewWidth - CGRectGetMaxX(self.oneClickReceiveBtn.frame) - 12 - RXUScaleWidth(27) - 12 - 16 , RXUScaleWidth(27));
            
        }else{
            self.closeBtn.frame = CGRectMake(bgViewWidth - 17 - RXUScaleWidth(25), RXUScaleWidth(10), RXUScaleWidth(25), RXUScaleWidth(25));
            
            self.deleteBtn.frame = CGRectMake(12, bgViewHeight - 8 - RXUScaleWidth(27), RXUScaleWidth(27), RXUScaleWidth(27));
            
            self.tipLabel.textAlignment = NSTextAlignmentLeft;
            self.tipLabel.frame = CGRectMake(CGRectGetMaxX(self.deleteBtn.frame) + 16, bgViewHeight - 8 - RXUScaleWidth(27), bgViewWidth - CGRectGetMaxX(self.deleteBtn.frame) - 16 - 12 - RXUScaleWidth(100), RXUScaleWidth(27));
            
            self.oneClickReceiveBtn.frame = CGRectMake(bgViewWidth - 12 - RXUScaleWidth(100), bgViewHeight - 8 - RXUScaleWidth(27), RXUScaleWidth(100), RXUScaleWidth(27));
        }
        
    }else{//竖屏 左右20，上下100，间距尽量不动，其他等比例
        self.bgView.frame = CGRectMake((RXUScreenWidth - RXUScaleWidth(313))/2, (RXUScreenHeight - RXUScaleWidth(455))/2, RXUScaleWidth(313), RXUScaleWidth(455));
        self.bgView.center = window.center;
        
        CGFloat bgViewWidth = self.bgView.frame.size.width;
        CGFloat bgViewHeight = self.bgView.frame.size.height;
        
        self.titleLbl.frame = CGRectMake(0, 0, bgViewWidth, RXUScaleWidth(45));
        
        
        self.mTableView.frame = CGRectMake(10, RXUScaleWidth(45), bgViewWidth - 20, bgViewHeight - RXUScaleWidth(45) - RXUScaleWidth(85));
        
        self.tipLabel.textAlignment = NSTextAlignmentCenter;
        self.tipLabel.frame = CGRectMake(10, bgViewHeight - 7 - RXUScaleWidth(27), bgViewWidth - 20, RXUScaleWidth(27));
        
        self.oneClickReceiveBtn.frame = CGRectMake((bgViewWidth - RXUScaleWidth(180))/2, bgViewHeight - 36 - RXUScaleWidth(33), RXUScaleWidth(180), RXUScaleWidth(33));
        
        if ([RXOSCommonTool isRTL]) {
            self.closeBtn.frame = CGRectMake(17, RXUScaleWidth(10), RXUScaleWidth(25), RXUScaleWidth(25));
            
            self.deleteBtn.frame = CGRectMake(bgViewWidth - 10 - RXUScaleWidth(33), bgViewHeight - 36 - RXUScaleWidth(33), RXUScaleWidth(33), RXUScaleWidth(33));
        }else{
            self.closeBtn.frame = CGRectMake(bgViewWidth - 17 - RXUScaleWidth(25), RXUScaleWidth(10), RXUScaleWidth(25), RXUScaleWidth(25));
            
            self.deleteBtn.frame = CGRectMake(10, bgViewHeight - 36 - RXUScaleWidth(33), RXUScaleWidth(33), RXUScaleWidth(33));
        }
    }
    [self layoutSubviews];
}

#pragma mark -- <actions>
- (void)deleteBtnAction{
    [self oneClickDeleteGift];
}

- (void)receiveBtnAction{
    [self oneClickGainGift];
}

- (void)setReceiveBtnEnable:(BOOL)enable{
    self.oneClickReceiveBtn.enabled = enable;
    if (enable) {
        self.oneClickReceiveBtn.backgroundColor = HexRGBAlpha(0x20C0B3, 1);
    }else{
        self.oneClickReceiveBtn.backgroundColor = HexRGBAlpha(0xD9D9D9, 1);
    }
}

- (void)setDeleBtnEnable:(BOOL)enable{
    self.deleteBtn.enabled = enable;
    if (enable) {
        [self.deleteBtn setImage:[UIImage rxOSBundleImageNamed:@"rx_deleteEmail"] forState:UIControlStateNormal];
    }else{
        [self.deleteBtn setImage:[UIImage rxOSBundleImageNamed:@"rx_deleteEmail_disable"] forState:UIControlStateNormal];
    }
}

#pragma mark -- <UITableViewDelegate && UITableViewDataSource>
- (NSInteger)numberOfSectionsInTableView:(UITableView *)tableView
{
    return 1;
}

- (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section
{
    return self.emailListArray.count;
}

- (CGFloat)tableView:(UITableView *)tableView heightForRowAtIndexPath:(NSIndexPath *)indexPath
{
    return RXUScaleWidth(36);
}

- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath
{
    RXOSEmailListViewCell *cell = [tableView dequeueReusableCellWithIdentifier:@"cell"];
    if (!cell) {
        cell = [[RXOSEmailListViewCell alloc] initWithStyle:UITableViewCellStyleDefault reuseIdentifier:@"cell"];
    }
    cell.selectionStyle = UITableViewCellSelectionStyleNone;
    cell.backgroundColor = [UIColor clearColor];
    if (self.emailListArray.count > 0) {
        NSDictionary *dic = self.emailListArray[indexPath.row];
        if ([dic[@"status"] integerValue] == 3) {//未读
            cell.customImageView.image = [UIImage rxOSBundleImageNamed:@"rx_mailUnRead"];
            cell.titleLabel.text = dic[@"title"];
            cell.titleLabel.font = [UIFont boldSystemFontOfSize:RXUScaleWidth(14)];
            cell.timeLabel.text = dic[@"send_at"];
            cell.timeLabel.font = [UIFont boldSystemFontOfSize:RXUScaleWidth(12)];
        }else{
            cell.customImageView.image = [UIImage rxOSBundleImageNamed:@"rx_mailRead"];
            cell.titleLabel.text = dic[@"title"];
            cell.titleLabel.font = [UIFont systemFontOfSize:RXUScaleWidth(14)];
            cell.timeLabel.text = dic[@"send_at"];
            cell.timeLabel.font = [UIFont systemFontOfSize:RXUScaleWidth(12)];
        }
        
    }
    
    return cell;
}

- (void)tableView:(UITableView *)tableView didSelectRowAtIndexPath:(NSIndexPath *)indexPath
{
    if (self.emailListArray.count > 0) {
        NSDictionary *dic = self.emailListArray[indexPath.row];
        RXOSEmailDetailView *view = [[RXOSEmailDetailView alloc] initWithCpUserId:self.cpUserId emailId:dic[@"rx_mail_id"]];
    }
}

#pragma mark -- <lazy>
- (UIView *)bgView
{
    if (!_bgView) {
        _bgView = [[UIView alloc] init];
        _bgView.backgroundColor = [UIColor whiteColor];
        _bgView.layer.cornerRadius = 4;
    }
    return _bgView;
}

- (UILabel *)titleLbl
{
    if (!_titleLbl) {
        _titleLbl = [[UILabel alloc] init];
        _titleLbl.text = [RXLocation osLaunguage:@"邮件"];
        _titleLbl.textColor = [UIColor blackColor];
        _titleLbl.backgroundColor = [UIColor clearColor];
        _titleLbl.font = [UIFont systemFontOfSize:RXUScaleWidth(18) weight:UIFontWeightMedium];
        _titleLbl.textAlignment = NSTextAlignmentCenter;
    }
    return _titleLbl;
}

- (UIButton *)closeBtn
{
    if (!_closeBtn) {
        _closeBtn = [UIButton buttonWithType:UIButtonTypeCustom];
        [_closeBtn setImage:[UIImage rxOSBundleImageNamed:@"rx_close"] forState:UIControlStateNormal];
        [_closeBtn addTarget:self action:@selector(hide) forControlEvents:UIControlEventTouchUpInside];
        [_closeBtn setImageEdgeInsets:UIEdgeInsetsMake(4, 4, 4, 4)];
    }
    return _closeBtn;
}

- (UITableView *)mTableView
{
    if (!_mTableView) {
        _mTableView = [[UITableView alloc] initWithFrame:CGRectZero style:UITableViewStylePlain];
        _mTableView.backgroundColor = HexRGBAlpha(0xF7F7F7, 1);
        _mTableView.separatorStyle = UITableViewCellSeparatorStyleNone;
        _mTableView.dataSource = self;
        _mTableView.delegate = self;
        _mTableView.showsVerticalScrollIndicator = NO;
        _mTableView.showsHorizontalScrollIndicator = NO;
        _mTableView.keyboardDismissMode = UIScrollViewKeyboardDismissModeOnDrag;
        _mTableView.layer.cornerRadius = 4;
        if (@available(iOS 11.0, *)) {
            _mTableView.contentInsetAdjustmentBehavior = UIScrollViewContentInsetAdjustmentNever;
        }
        if (@available(iOS 15.0, *)) {
            _mTableView.sectionHeaderTopPadding = 0.0;
        }
    }
    return _mTableView;
}

- (UIButton *)deleteBtn{
    if (!_deleteBtn) {
        _deleteBtn = [UIButton buttonWithType:UIButtonTypeCustom];
        [_deleteBtn setImage:[UIImage rxOSBundleImageNamed:@"rx_deleteEmail"] forState:UIControlStateNormal];
        [_deleteBtn addTarget:self action:@selector(deleteBtnAction) forControlEvents:UIControlEventTouchUpInside];
        _deleteBtn.layer.cornerRadius = 4;
    }
    return _deleteBtn;
}

- (UILabel *)tipLabel{
    if (!_tipLabel) {
        _tipLabel = [[UILabel alloc] init];
        _tipLabel.text = [RXLocation osLaunguage:@"超过一周的邮件自动删除"];
        _tipLabel.textColor = HexRGBAlpha(0x797979, 1);
        _tipLabel.backgroundColor = [UIColor clearColor];
        _tipLabel.font = [UIFont systemFontOfSize:RXUScaleWidth(10) weight:UIFontWeightRegular];
        _tipLabel.textAlignment = NSTextAlignmentLeft;
        _tipLabel.numberOfLines = 0;
        _tipLabel.lineBreakMode = NSLineBreakByWordWrapping;
    }
    return _tipLabel;
}

- (UIButton *)oneClickReceiveBtn{
    if (!_oneClickReceiveBtn) {
        _oneClickReceiveBtn = [UIButton buttonWithType:UIButtonTypeCustom];
        [_oneClickReceiveBtn addTarget:self action:@selector(receiveBtnAction) forControlEvents:UIControlEventTouchUpInside];
        _oneClickReceiveBtn.layer.cornerRadius = 4;
        _oneClickReceiveBtn.backgroundColor = HexRGBAlpha(0x20C0B3, 1);
        [_oneClickReceiveBtn setTitle:[RXLocation osLaunguage:@"一键领取"] forState:UIControlStateNormal];
        [_oneClickReceiveBtn.titleLabel setFont:[UIFont systemFontOfSize:RXUScaleWidth(12) weight:UIFontWeightMedium]];
        [_oneClickReceiveBtn setTitleColor:[UIColor whiteColor] forState:UIControlStateNormal];
        _oneClickReceiveBtn.titleLabel.lineBreakMode = NSLineBreakByWordWrapping;
        _oneClickReceiveBtn.titleLabel.numberOfLines = 0;
    }
    return _oneClickReceiveBtn;
}

- (NSMutableArray *)emailListArray{
    if (!_emailListArray) {
        _emailListArray = [[NSMutableArray alloc] init];
    }
    return _emailListArray;
}

@end
