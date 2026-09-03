//
//  RXCPIDViewController.m
//  RXSDKDemo-Public
//
//  Created by root11 on 2024/6/21.
//

#import "RXCPIDViewController.h"
#import "CHMarco.h"
#import "CHSettingCellModel.h"
#import "RXProductIdViewController.h"

@interface RXCPIDViewController ()<UITableViewDelegate, UITableViewDataSource>
@property (nonatomic, strong) UITableView *tableView;
@property (nonatomic, strong) NSMutableArray *CPIDArray;

@end

@implementation RXCPIDViewController

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
    [self setUI];
    [self loadData];
}

- (void)setUI{
    //navigation
    self.navigationController.navigationBar.tintColor = [UIColor blackColor];
    self.title = @"请选择CPID环境";
    self.navigationItem.leftBarButtonItem = [[UIBarButtonItem alloc] initWithImage:[UIImage imageNamed:@"back_black"] style:UIBarButtonItemStylePlain target:self action:@selector(backClick)];
    self.view.backgroundColor = [UIColor whiteColor];
    //tableView
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

- (void)loadData{
    [self.CPIDArray removeAllObjects];
    if ([CHUtility sharedManager].isOS) {//海外
        CHSettingCellModel *model = [[CHSettingCellModel alloc] init];
        model.cpid = @"119";
        model.title = @"海外-瑞雪测试119";
        [self.CPIDArray addObject:model];
        CHSettingCellModel *model1 = [[CHSettingCellModel alloc] init];
        model1.cpid = @"120";
        model1.title = @"海外-瑞雪验收120";
        [self.CPIDArray addObject:model1];
        
    }else{//国内
        CHSettingCellModel *model = [[CHSettingCellModel alloc] init];
        model.cpid = @"112";
        model.title = @"国内-瑞雪验收112";
        [self.CPIDArray addObject:model];
        
        CHSettingCellModel *model1 = [[CHSettingCellModel alloc] init];
        model1.cpid = @"114";
        model1.title = @"国内-瑞雪测试114";
        [self.CPIDArray addObject:model1];
    }
    
    [self.tableView reloadData];
}


#pragma mark - action
- (void)backClick{
    [self.navigationController popViewControllerAnimated:YES];
}

#pragma mark - lazy load
- (NSMutableArray *)CPIDArray{
    if (!_CPIDArray) {
        _CPIDArray = [[NSMutableArray alloc] init];
    }
    return _CPIDArray;
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
    return self.CPIDArray.count;
}

- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath {
    
    static NSString *cellIdentifier = @"cell";
    UITableViewCell *cell = [tableView dequeueReusableCellWithIdentifier:cellIdentifier];
    if (cell == nil) {
        cell = [[UITableViewCell alloc] initWithStyle:UITableViewCellStyleDefault reuseIdentifier:cellIdentifier];
    }
    cell.selectionStyle = UITableViewCellSelectionStyleNone;
    
    if (self.CPIDArray.count > 0) {
        CHSettingCellModel *model = self.CPIDArray[indexPath.row];
        cell.textLabel.text = model.title;
        cell.textLabel.textAlignment = NSTextAlignmentCenter;
    }
    
    return cell;
}

#pragma mark - UITableViewDelegate

- (CGFloat)tableView:(UITableView *)tableView heightForRowAtIndexPath:(NSIndexPath *)indexPath{
    return 60;
}

- (void)tableView:(UITableView *)tableView didSelectRowAtIndexPath:(NSIndexPath *)indexPath {
    [tableView deselectRowAtIndexPath:indexPath animated:YES];
    
    CHSettingCellModel *model = self.CPIDArray[indexPath.row];
    RXProductIdViewController *vc = [[RXProductIdViewController alloc] init];
    
    __block MBProgressHUD *hud = [MBProgressHUD showHUDAddedTo:self.view animated:YES];
    hud.label.text = @"数据加载中...";
    
    if ([model.cpid isEqualToString:@"112"]) {
        model.baseUrl = baseUrl112;
        vc.model = model;
        
        RXSdkInitConfig *config = [[RXSdkInitConfig alloc] init];
        config.productId = @"SDK";
        config.channelId = @"iOSOS";
        config.cpId = @"112";
        config.baseUrlList = @[baseUrl112];
        config.isUseDNS = YES;
        
        [[RXService sharedSDK] initWithConfig:config complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
            [hud hideAnimated:YES];
            if (!error) {
                NSLog(@"初始化成功");
                [self.navigationController pushViewController:vc animated:YES];
            } else {
                [self.view makeToast:@"初始化失败" duration:1.5 position:CSToastPositionCenter];
            }
        }];
    }else if ([model.cpid isEqualToString:@"114"]){
        model.baseUrl = baseUrl114;
        vc.model = model;
        
        RXSdkInitConfig *config = [[RXSdkInitConfig alloc] init];
        config.productId = @"1002";
        config.channelId = @"iOS";
        config.cpId = @"114";
        config.baseUrlList = @[baseUrl114];
        config.isUseDNS = YES;
        
        [[RXService sharedSDK] initWithConfig:config complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
            [hud hideAnimated:YES];
            if (!error) {
                NSLog(@"初始化成功");
                [self.navigationController pushViewController:vc animated:YES];
            } else {
                [self.view makeToast:@"初始化失败" duration:1.5 position:CSToastPositionCenter];
            }
        }];
    }else if ([model.cpid isEqualToString:@"119"]){
        model.baseUrl = baseUrl119;
        vc.model = model;
        
        RXSdkInitConfig *config = [[RXSdkInitConfig alloc] init];
        config.productId = @"SDK";
        config.channelId = @"iOSOS";
        config.cpId = @"119";
        config.baseUrlList = @[baseUrl119];
        config.isUseDNS = YES;
        
        [[RXService sharedSDK] initWithConfig:config complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
            [hud hideAnimated:YES];
            if (!error) {
                NSLog(@"初始化成功");
                [self.navigationController pushViewController:vc animated:YES];
            } else {
                [self.view makeToast:@"初始化失败" duration:1.5 position:CSToastPositionCenter];
            }
        }];
    }else if ([model.cpid isEqualToString:@"120"]){
        model.baseUrl = baseUrl120;
        vc.model = model;
        
        RXSdkInitConfig *config = [[RXSdkInitConfig alloc] init];
        config.productId = @"SDK";
        config.channelId = @"iOS";
        config.cpId = @"120";
        config.baseUrlList = @[baseUrl120];
        config.isUseDNS = YES;
        
        [[RXService sharedSDK] initWithConfig:config complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
            [hud hideAnimated:YES];
            if (!error) {
                NSLog(@"初始化成功");
                [self.navigationController pushViewController:vc animated:YES];
            } else {
                [self.view makeToast:@"初始化失败" duration:1.5 position:CSToastPositionCenter];
            }
        }];
    }

}

@end
