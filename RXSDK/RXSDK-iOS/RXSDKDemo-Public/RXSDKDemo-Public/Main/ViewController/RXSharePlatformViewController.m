//
//  RXSharePlatformViewController.m
//  RXSDKDemo-Public
//
//  Created by root11 on 2024/6/24.
//

#import "RXSharePlatformViewController.h"
#import "CHMarco.h"
#import "CHSettingCellModel.h"
#import "RXSharePointViewController.h"

@interface RXSharePlatformViewController ()<UITableViewDelegate, UITableViewDataSource>
@property (nonatomic, strong) UITableView *tableView;
@property (nonatomic, strong) NSMutableArray *shareTypeArray;

@end

@implementation RXSharePlatformViewController

- (void)viewWillDisappear:(BOOL)animated{
    [super viewWillDisappear:animated];
    self.navigationController.navigationBar.hidden = YES;
}

- (void)viewWillAppear:(BOOL)animated{
    [super viewDidAppear:animated];
    self.navigationController.navigationBar.hidden = NO;
}

- (void)viewDidLoad {
    [super viewDidLoad];
    self.navigationController.navigationBar.tintColor = [UIColor blackColor];
    self.title = @"分享方式";
    self.navigationItem.leftBarButtonItem = [[UIBarButtonItem alloc] initWithImage:[UIImage imageNamed:@"back_black"] style:UIBarButtonItemStylePlain target:self action:@selector(backClick)];
    self.view.backgroundColor = [UIColor whiteColor];
    
//MARK: 分享平台：wechat、system、facebook、messenger、line、tiktok、zalo、snapchat
    __block NSArray *loginTypes = @[@"wechat", @"system"];//国内平台
    __block NSArray *loginTitles = [NSArray array];
    __block NSArray *loginImgs = [NSArray array];
    
    if ([CHUtility sharedManager].isOS) {//海外平台
        loginTypes = @[@"system", @"facebook", @"messenger", @"line", @"tiktok", @"zalo", @"snapchat"];
    }
    
    [[CHUtility sharedManager] checkPlatformShareTypes:loginTypes backBlock:^(NSArray * _Nonnull sloginTypes, NSArray * _Nonnull sloginTitles, NSArray * _Nonnull sloginImgs) {
        loginTypes = sloginTypes;
        loginTitles = sloginTitles;
        loginImgs = sloginImgs;
    }];
    
    for (int i = 0; i < loginTypes.count; i++) {
        CHSettingCellModel *model = [[CHSettingCellModel alloc] init];
        model.title = loginTitles[i];
        model.img = loginImgs[i];
        model.loginType = loginTypes[i];
        [self.shareTypeArray addObject:model];
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
- (NSMutableArray *)shareTypeArray{
    if (!_shareTypeArray) {
        _shareTypeArray = [[NSMutableArray alloc] init];
    }
    return _shareTypeArray;
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
    return self.shareTypeArray.count;
}

- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath {
    
    static NSString *cellIdentifier = @"cell";
    RXLoginViewCell *cell = [tableView dequeueReusableCellWithIdentifier:cellIdentifier];
    if (cell == nil) {
        cell = [[RXLoginViewCell alloc] initWithStyle:UITableViewCellStyleDefault reuseIdentifier:cellIdentifier];
    }
    cell.selectionStyle = UITableViewCellSelectionStyleNone;

    if (self.shareTypeArray.count > 0) {
        CHSettingCellModel *model = self.shareTypeArray[indexPath.row];
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
    CHSettingCellModel *model = self.shareTypeArray[indexPath.row];
//    wechat、system、facebook、messenger、line、tiktok、zalo、snapchat
    RXSharePointViewController *vc = [[RXSharePointViewController alloc] init];
    vc.shareType = model.loginType;
    [self.navigationController pushViewController:vc animated:YES];
    
}

#pragma mark - 分享上报方法
- (void)reportWithFunc:(NSString *)func platform:(NSString *)platform region:(NSString *)region transmits:(NSString *)transmits scheduling_event:(BOOL)scheduling_event scheduling_type:(NSString *)scheduling_type properties:(NSDictionary *)properties{
//    transmits拼接示例
//    transmits = @"sharefromtype=value&sharetype=value";
    
    NSCharacterSet *encodeSet = [NSCharacterSet characterSetWithCharactersInString:@"!*'();:@&=+$,/?%#[]"];
    NSString *encode = [transmits stringByAddingPercentEncodingWithAllowedCharacters:encodeSet];
    
    [[RXShareService sharedSDK] shareSchedulingReportWithFunc:func platform:platform region:region transmits:encode scheduling_event:scheduling_event scheduling_type:scheduling_type properties:properties complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
            
    }];
}


@end
