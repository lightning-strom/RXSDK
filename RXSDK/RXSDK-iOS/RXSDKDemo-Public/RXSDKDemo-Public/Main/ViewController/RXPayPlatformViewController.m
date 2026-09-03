//
//  RXPayPlatformViewController.m
//  RXSDKDemo-Public
//
//  Created by root11 on 2024/6/26.
//

#import "RXPayPlatformViewController.h"
#import "CHMarco.h"
#import "CHSettingCellModel.h"
#import "RXBillingPointViewController.h"

@interface RXPayPlatformViewController ()<UITableViewDelegate, UITableViewDataSource>
@property (nonatomic, strong) UITableView *tableView;
@property (nonatomic, strong) NSMutableArray *payTypeArray;

@end

@implementation RXPayPlatformViewController

- (void)viewWillDisappear:(BOOL)animated{
    [super viewWillDisappear:animated];
    self.navigationController.navigationBar.hidden = YES;
}

- (void)viewWillAppear:(BOOL)animated{
    [super viewWillAppear:animated];
    self.navigationController.navigationBar.hidden = NO;
}

- (void)viewDidLoad {
    [super viewDidLoad];
    self.navigationController.navigationBar.tintColor = [UIColor blackColor];
    self.title = @"支付方式";
    self.navigationItem.leftBarButtonItem = [[UIBarButtonItem alloc] initWithImage:[UIImage imageNamed:@"back_black"] style:UIBarButtonItemStylePlain target:self action:@selector(backClick)];
    self.view.backgroundColor = [UIColor whiteColor];
    
//MARK: 支付平台：appstore、yeepay（wechat）、wechat、ruixue_h5_trade、unipin
    __block NSArray *payTypes = @[@"appstore", @"yeepay", @"wechat", @"ruixue_h5_trade"];//国内平台
    __block NSArray *payTitles = [NSArray array];
    __block NSArray *payImgs = [NSArray array];
    
    if ([CHUtility sharedManager].isOS) {//海外平台
        payTypes = @[@"appstore", @"unipin"];
    }
    
    [[CHUtility sharedManager] checkPayTypes:payTypes backBlock:^(NSArray * _Nonnull sloginTypes, NSArray * _Nonnull sloginTitles, NSArray * _Nonnull sloginImgs) {
        payTypes = sloginTypes;
        payTitles = sloginTitles;
        payImgs = sloginImgs;
    }];
    
    for (int i = 0; i < payTypes.count; i++) {
        CHSettingCellModel *model = [[CHSettingCellModel alloc] init];
        model.loginType = payTypes[i];
        model.title = payTitles[i];
        model.img = payImgs[i];
        [self.payTypeArray addObject:model];
    }

    [self setUI];
}

#pragma mark -- setUI
- (void)setUI{
    [self.view addSubview:self.tableView];
}

- (void)viewWillLayoutSubviews{
    [super viewWillLayoutSubviews];
    CGFloat statusBarHeight = [Tool getStatusBarHeight];
    self.tableView.sd_layout.topSpaceToView(self.view, statusBarHeight + 44)
    .leftEqualToView(self.view)
    .rightEqualToView(self.view)
    .bottomSpaceToView(self.view, 35);
}

#pragma mark - action
- (void)backClick{
    [self.navigationController popViewControllerAnimated:YES];
}

#pragma mark - lazy load
- (NSMutableArray *)payTypeArray{
    if (!_payTypeArray) {
        _payTypeArray = [[NSMutableArray alloc] init];
    }
    return _payTypeArray;
}

- (UITableView *)tableView{
    if (!_tableView) {
        _tableView = [[UITableView alloc] initWithFrame:CGRectZero style:UITableViewStylePlain];
        _tableView.backgroundColor = [UIColor clearColor];
        _tableView.separatorStyle = UITableViewCellSeparatorStyleSingleLine;
        _tableView.delegate = self;
        _tableView.dataSource = self;
//        _tableView.estimatedRowHeight = 100;
//        _tableView.rowHeight = UITableViewAutomaticDimension;
        _tableView.keyboardDismissMode = UIScrollViewKeyboardDismissModeOnDrag;
        if (@available(iOS 11.0, *) ) {
            _tableView.contentInsetAdjustmentBehavior = UIScrollViewContentInsetAdjustmentNever;
        }
        if (@available(iOS 15.0, *) ) {
            _tableView.sectionHeaderTopPadding = 0.0;
        }
    }
    return _tableView;
}

#pragma mark - tableview delegate
- (NSInteger)numberOfSectionsInTableView:(UITableView *)tableView {
    return 1;
}

- (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section {
    return self.payTypeArray.count;
}

- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath {
    
    static NSString *cellIdentifier = @"cell";
    RXLoginViewCell *cell = [tableView dequeueReusableCellWithIdentifier:cellIdentifier];
    if (cell == nil) {
        cell = [[RXLoginViewCell alloc] initWithStyle:UITableViewCellStyleDefault reuseIdentifier:cellIdentifier];
    }
    cell.selectionStyle = UITableViewCellSelectionStyleNone;
    
    if (self.payTypeArray.count > 0) {
        CHSettingCellModel *model = self.payTypeArray[indexPath.row];
        cell.model = model;
    }
    
    return cell;
}

#pragma mark - UITableViewDelegate

- (CGFloat)tableView:(UITableView *)tableView heightForRowAtIndexPath:(NSIndexPath *)indexPath{
    return 60;
}

- (void)tableView:(UITableView *)tableView didSelectRowAtIndexPath:(NSIndexPath *)indexPath {
    [tableView deselectRowAtIndexPath:indexPath animated:YES];
    CHSettingCellModel *model = self.payTypeArray[indexPath.row];
    RXBillingPointViewController *vc = [[RXBillingPointViewController alloc] init];
    vc.payType = model.loginType;
    [self.navigationController pushViewController:vc animated:YES];
    
}

@end
