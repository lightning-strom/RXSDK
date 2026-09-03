//
//  RXProductIdViewController.m
//  RXSDKDemo-Public
//
//  Created by root11 on 2024/6/21.
//

#import "RXProductIdViewController.h"
#import "CHMarco.h"
#import "RXChannelIdViewController.h"
#import <RXSDK_Pure/RX_CommonNetworkExcuteManager.h>
#import <RXSDK_Pure/RXConfig.h>

@interface RXProductIdViewController ()<UITableViewDelegate, UITableViewDataSource>
@property (nonatomic, strong) UITableView *tableView;
@property (nonatomic, strong) NSMutableArray *productArray;

@end

@implementation RXProductIdViewController

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
    self.title = @"请选择productId";
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
    [self.productArray removeAllObjects];
    NSMutableDictionary *dic = [NSMutableDictionary dictionary];
    RX_CommonRequest *request = [[RX_CommonRequest alloc] initWithApiName:@"v1/publicapi/public/apps" andParams:dic requsetMethod:RequestMethod_Get];
    request.baseUrl = [RXConfig sharedManager].apiDomain;
    request.headParams = [RX_CommonNetworkExcuteManager headParams];
    
    __weak typeof(self) weakSelf = self;
    [[RX_CommonNetworkExcuteManager commonRequestClient] beginRequest:request success:^(id  _Nullable responseObject) {
        weakSelf.productArray = [NSMutableArray arrayWithArray:responseObject[@"data"]];
        [weakSelf.tableView reloadData];
        
    } failure:^(RX_CommonRequestError * _Nullable error) {
        NSLog(@"请求错误");
    }];

    
}


#pragma mark - action
- (void)backClick{
    [self.navigationController popViewControllerAnimated:YES];
}

#pragma mark - lazy load
- (NSMutableArray *)productArray{
    if (!_productArray) {
        _productArray = [[NSMutableArray alloc] init];
    }
    return _productArray;
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
    return self.productArray.count;
}

- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath {
    
    static NSString *cellIdentifier = @"cell";
    UITableViewCell *cell = [tableView dequeueReusableCellWithIdentifier:cellIdentifier];
    if (cell == nil) {
        cell = [[UITableViewCell alloc] initWithStyle:UITableViewCellStyleDefault reuseIdentifier:cellIdentifier];
    }
    cell.selectionStyle = UITableViewCellSelectionStyleNone;
    
    if (self.productArray.count > 0) {
        NSDictionary *dict = self.productArray[indexPath.row];
        cell.textLabel.text = dict[@"product_id"];
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
    NSDictionary *dict = self.productArray[indexPath.row];
    NSString *productId = dict[@"product_id"];
    self.model.productId = productId;
    
    RXChannelIdViewController *vc = [[RXChannelIdViewController alloc] init];
    vc.model = self.model;
    vc.channelArray = dict[@"channels"];
    [self.navigationController pushViewController:vc animated:YES];
    
}

@end
