//
//  RXPlayerFeedbackListView.m
//  RXUIKit-OS
//
//  Created by root11 on 2024/9/11.
//

#import "RXPlayerFeedbackListView.h"
#import "RXFeedbackTool.h"
#import <RXSDK_Pure/RX_CommonNetworkExcuteManager.h>
#import "RXPlayerFeedbackListViewCell.h"
#import "RXPlayerFeedbackDetailView.h"

@interface RXPlayerFeedbackListView ()<UITableViewDelegate, UITableViewDataSource>

@property (nonatomic, strong) UIView *bgView;
@property (nonatomic, strong) UILabel *titleLbl;
@property (nonatomic, strong) UIButton *closeBtn;
@property (nonatomic, strong) UITableView *tableView;
@property (nonatomic, strong) UIButton *cancelBtn;
@property (nonatomic, strong) NSMutableArray *feedbackListArray;
@property (nonatomic, assign) int pageNum;
@property (nonatomic, assign) BOOL haveData;//YES有数据，NO没数据
@property (nonatomic, assign) BOOL isLoading;

@end

@implementation RXPlayerFeedbackListView

- (void)dealloc
{
    [[NSNotificationCenter defaultCenter] removeObserver:self];
}

- (instancetype)init
{
    self = [super initWithFrame:CGRectMake(0, 0, [UIApplication sharedApplication].keyWindow.frame.size.width, [UIApplication sharedApplication].keyWindow.frame.size.height)];
    if (self) {
        self.backgroundColor = [[UIColor blackColor] colorWithAlphaComponent:0.5];
        [[UIViewController currentViewController].view addSubview:self];
        [[UIViewController currentViewController].view bringSubviewToFront:self];
                
        [self setUI];
        [self show];
        [self loadFeedbackList];
        
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(refreshFeedbackList) name:RXUINoti_refreshFeedbackList object:nil];
    }
    return self;
}

#pragma mark - noti
- (void)refreshFeedbackList{
    [self loadFeedbackList];
}

#pragma mark - request
- (void)loadFeedbackList{
    [RXFeedbackHUD showHUD];
    
    self.pageNum = 1;
    if (self.feedbackListArray.count > 0) {
        [self.feedbackListArray removeAllObjects];
    }
    self.haveData = YES;
    self.isLoading = YES;
    
    __weak typeof(self) weakSelf = self;
    [[RXApiService sharedSDK] getFeedbackListWithPage:self.pageNum size:20 status:0 complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
        if (!error) {
            [RXFeedbackHUD hideHUD];
            NSArray *listArray = response[@"data"][@"list"];
            weakSelf.feedbackListArray = [NSMutableArray arrayWithArray:listArray];
            [weakSelf.tableView reloadData];
            weakSelf.isLoading = NO;
            if (listArray.count == 20) {
                self.pageNum += 1;
                self.haveData = YES;
            }else{
                self.haveData = NO;
            }
        }else{
            weakSelf.isLoading = NO;
            [RXFeedbackHUD showErrorText:[RXFeedbackLocation osLaunguage:@"加载失败"]];
        }
    }];
}

- (void)loadFeedbackMoreList{
    [RXFeedbackHUD showHUD];
    self.isLoading = YES;
    
    __weak typeof(self) weakSelf = self;
    [[RXApiService sharedSDK] getFeedbackListWithPage:self.pageNum size:20 status:0 complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
        if (!error) {
            [RXFeedbackHUD hideHUD];
            NSArray *listArray = response[@"data"][@"list"];
            [weakSelf.feedbackListArray addObjectsFromArray:listArray];
            [weakSelf.tableView reloadData];
            weakSelf.isLoading = NO;
            if (listArray.count == 20) {
                self.pageNum += 1;
                self.haveData = YES;
            }else{
                self.haveData = NO;
            }
        }else{
            weakSelf.isLoading = NO;
            [RXFeedbackHUD showErrorText:[RXFeedbackLocation osLaunguage:@"加载失败"]];
        }
    }];
}

#pragma mark -- <setUI>

- (void)show
{
    [RXFeedbackTool transformWithView:self.bgView];
    [UIView animateWithDuration:0.1 animations:^{
        [RXFeedbackTool showWithAnimate:self.bgView];
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
    [self.bgView addSubview:self.tableView];
    [self.bgView addSubview:self.cancelBtn];
    
    [self layoutViews];
}

- (void)layoutViews
{
    UIView *window = [UIApplication sharedApplication].keyWindow;
    
    if (RXAC) {
        self.bgView.frame = CGRectMake(0, 0, RXUScaleWidth(531), RXUScaleWidth(270));
        self.bgView.center = window.center;
        //横屏
        CGFloat bgViewWidth = self.bgView.frame.size.width;
        CGFloat bgViewHeight = self.bgView.frame.size.height;
        
        self.titleLbl.frame = CGRectMake(0, 0, bgViewWidth, RXUScaleWidth(45));
        
        self.tableView.frame = CGRectMake(12, self.titleLbl.frame.size.height, bgViewWidth - 24, bgViewHeight - RXUScaleWidth(89));
        
        if ([RXFeedbackTool isRTL]) {
            self.closeBtn.frame = CGRectMake(17, RXUScaleWidth(10), RXUScaleWidth(25), RXUScaleWidth(25));
                        
            self.cancelBtn.frame = CGRectMake(12, bgViewHeight - 8 - RXUScaleWidth(27), RXUScaleWidth(100), RXUScaleWidth(27));
            
        }else{
            self.closeBtn.frame = CGRectMake(bgViewWidth - 17 - RXUScaleWidth(25), RXUScaleWidth(10), RXUScaleWidth(25), RXUScaleWidth(25));
            
            self.cancelBtn.frame = CGRectMake(bgViewWidth - 12 - RXUScaleWidth(100), bgViewHeight - 8 - RXUScaleWidth(27), RXUScaleWidth(100), RXUScaleWidth(27));
        }
        
    }else{
        self.bgView.frame = CGRectMake(0, 0, RXUScaleWidth(313), RXUScaleWidth(480));
        self.bgView.center = window.center;
        
        CGFloat bgViewWidth = self.bgView.frame.size.width;
        CGFloat bgViewHeight = self.bgView.frame.size.height;
        
        self.titleLbl.frame = CGRectMake(0, 0, bgViewWidth, RXUScaleWidth(45));
        
        self.tableView.frame = CGRectMake(10, RXUScaleWidth(45), bgViewWidth - 20, bgViewHeight - RXUScaleWidth(45) - RXUScaleWidth(65));
        
        self.cancelBtn.frame = CGRectMake((bgViewWidth - RXUScaleWidth(180))/2, bgViewHeight - 16 - RXUScaleWidth(33), RXUScaleWidth(180), RXUScaleWidth(33));
        
        if ([RXFeedbackTool isRTL]) {
            self.closeBtn.frame = CGRectMake(17, RXUScaleWidth(10), RXUScaleWidth(25), RXUScaleWidth(25));
        }else{
            self.closeBtn.frame = CGRectMake(bgViewWidth - 17 - RXUScaleWidth(25), RXUScaleWidth(10), RXUScaleWidth(25), RXUScaleWidth(25));
        }
    }
    [self layoutSubviews];
}

#pragma mark -- <actions>
- (void)cancelBtnAction{
    [self hide];
}

- (void)closeBtnClick{
    [self hide];
}

#pragma mark -- <UITableViewDelegate && UITableViewDataSource>
- (NSInteger)numberOfSectionsInTableView:(UITableView *)tableView
{
    return 1;
}

- (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section
{
    return self.feedbackListArray.count;
}

- (CGFloat)tableView:(UITableView *)tableView heightForRowAtIndexPath:(NSIndexPath *)indexPath
{
    return RXUScaleWidth(36);
}

- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath
{
    RXPlayerFeedbackListViewCell *cell = [tableView dequeueReusableCellWithIdentifier:@"cell"];
    if (!cell) {
        cell = [[RXPlayerFeedbackListViewCell alloc] initWithStyle:UITableViewCellStyleDefault reuseIdentifier:@"cell"];
    }
    cell.selectionStyle = UITableViewCellSelectionStyleNone;
    cell.backgroundColor = [UIColor clearColor];
    if (self.feedbackListArray.count > 0) {
        NSDictionary *dic = self.feedbackListArray[indexPath.row];
        if ([dic[@"status"] integerValue] == 1) {//未处理
            cell.titleLabel.text = dic[@"content"];
            cell.titleLabel.textColor = HexRGBAlpha(0x444444, 1.0);
            cell.titleLabel.font = [UIFont boldSystemFontOfSize:RXUScaleWidth(12)];
            cell.statusLabel.text = [RXFeedbackLocation osLaunguage:@"待回复"];
            cell.statusLabel.font = [UIFont boldSystemFontOfSize:RXUScaleWidth(12)];
            cell.statusLabel.textColor = HexRGBAlpha(0xDC6E6E, 1.0);
            cell.timeLabel.text = dic[@"created_at"];
            cell.timeLabel.font = [UIFont boldSystemFontOfSize:RXUScaleWidth(10)];
        }else{
            cell.titleLabel.text = dic[@"content"];
            cell.titleLabel.textColor = HexRGBAlpha(0x797979, 1.0);
            cell.titleLabel.font = [UIFont systemFontOfSize:RXUScaleWidth(12)];
            cell.statusLabel.text = [RXFeedbackLocation osLaunguage:@"已处理"];
            cell.statusLabel.font = [UIFont systemFontOfSize:RXUScaleWidth(12)];
            cell.statusLabel.textColor = HexRGBAlpha(0x20C0B3, 1.0);
            cell.timeLabel.text = dic[@"recover_at"];
            cell.timeLabel.font = [UIFont systemFontOfSize:RXUScaleWidth(10)];
        }
        
    }
    
    return cell;
}

- (void)tableView:(UITableView *)tableView didSelectRowAtIndexPath:(NSIndexPath *)indexPath
{
    if (self.feedbackListArray.count > 0) {
        NSDictionary *dic = self.feedbackListArray[indexPath.row];
        RXPlayerFeedbackDetailView *view = [[RXPlayerFeedbackDetailView alloc] initWithFeedbackID:[dic[@"id"] integerValue]];
    }
}

#pragma mark - UIScrollViewDelegate
- (void)scrollViewDidEndDecelerating:(UIScrollView *)scrollView{
    if (self.isLoading) {
        return;
    }
    
    CGFloat offsetY = scrollView.contentOffset.y;
    CGFloat contentHeight = scrollView.contentSize.height;
    CGFloat height = scrollView.frame.size.height;
    // 当即将停止拖动，并且接近底部时触发加载
    if (offsetY + height >= contentHeight - 40) {
        if (self.haveData) {
            [self loadFeedbackMoreList];
        }
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
        _titleLbl.text = [RXFeedbackLocation osLaunguage:@"我的反馈"];
        _titleLbl.textColor = [UIColor blackColor];
        _titleLbl.backgroundColor = [UIColor clearColor];
        _titleLbl.font = [UIFont systemFontOfSize:RXUScaleWidth(16) weight:UIFontWeightMedium];
        _titleLbl.textAlignment = NSTextAlignmentCenter;
    }
    return _titleLbl;
}

- (UIButton *)closeBtn
{
    if (!_closeBtn) {
        _closeBtn = [UIButton buttonWithType:UIButtonTypeCustom];
        [_closeBtn setImage:[UIImage rxFeedbackBundleImageNamed:@"rx_close"] forState:UIControlStateNormal];
        [_closeBtn addTarget:self action:@selector(closeBtnClick) forControlEvents:UIControlEventTouchUpInside];
        [_closeBtn setImageEdgeInsets:UIEdgeInsetsMake(4, 4, 4, 4)];
    }
    return _closeBtn;
}

- (UITableView *)tableView
{
    if (!_tableView) {
        _tableView = [[UITableView alloc] initWithFrame:CGRectZero style:UITableViewStylePlain];
        _tableView.backgroundColor = HexRGBAlpha(0xF7F7F7, 1);
        _tableView.separatorStyle = UITableViewCellSeparatorStyleNone;
        _tableView.dataSource = self;
        _tableView.delegate = self;
        _tableView.showsVerticalScrollIndicator = NO;
        _tableView.showsHorizontalScrollIndicator = NO;
        _tableView.keyboardDismissMode = UIScrollViewKeyboardDismissModeOnDrag;
        _tableView.layer.cornerRadius = 4;
        if (@available(iOS 11.0, *)) {
            _tableView.contentInsetAdjustmentBehavior = UIScrollViewContentInsetAdjustmentNever;
        }
        if (@available(iOS 15.0, *)) {
            _tableView.sectionHeaderTopPadding = 0.0;
        }
    }
    return _tableView;
}

- (UIButton *)cancelBtn{
    if (!_cancelBtn) {
        _cancelBtn = [UIButton buttonWithType:UIButtonTypeCustom];
        [_cancelBtn addTarget:self action:@selector(cancelBtnAction) forControlEvents:UIControlEventTouchUpInside];
        _cancelBtn.layer.cornerRadius = 4;
        _cancelBtn.backgroundColor = HexRGBAlpha(0xDC6E6E, 1);
        [_cancelBtn setTitle:[RXFeedbackLocation osLaunguage:@"关闭"] forState:UIControlStateNormal];
        [_cancelBtn.titleLabel setFont:[UIFont systemFontOfSize:RXUScaleWidth(12) weight:UIFontWeightMedium]];
        [_cancelBtn setTitleColor:[UIColor whiteColor] forState:UIControlStateNormal];
        _cancelBtn.titleLabel.lineBreakMode = NSLineBreakByWordWrapping;
        _cancelBtn.titleLabel.numberOfLines = 0;
    }
    return _cancelBtn;
}

- (NSMutableArray *)feedbackListArray{
    if (!_feedbackListArray) {
        _feedbackListArray = [[NSMutableArray alloc] init];
    }
    return _feedbackListArray;
}


@end
