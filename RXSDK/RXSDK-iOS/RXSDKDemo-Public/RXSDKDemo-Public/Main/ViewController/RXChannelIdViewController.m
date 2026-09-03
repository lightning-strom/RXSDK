//
//  RXChannelIdViewController.m
//  RXSDKDemo-Public
//
//  Created by root11 on 2024/6/21.
//

#import "RXChannelIdViewController.h"
#import "CHMarco.h"
#import "CHSettingViewController.h"

@interface RXChannelIdViewController ()<UITableViewDelegate, UITableViewDataSource>
@property (nonatomic, strong) UITableView *tableView;
@property (nonatomic, strong) NSMutableArray *channelIdArray;

@end

@implementation RXChannelIdViewController

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
    self.title = @"请选择channelId";
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
    [self.channelIdArray removeAllObjects];
    
    if (self.channelArray.count > 0) {
        for (NSDictionary *dict in self.channelArray) {
            [self.channelIdArray addObject: dict[@"id"]];
        }
        [self.tableView reloadData];
    }
    
}


#pragma mark - action
- (void)backClick{
    [self.navigationController popViewControllerAnimated:YES];
}

#pragma mark - lazy load
- (NSMutableArray *)channelIdArray{
    if (!_channelIdArray) {
        _channelIdArray = [[NSMutableArray alloc] init];
    }
    return _channelIdArray;
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
    return self.channelIdArray.count;
}

- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath {
    
    static NSString *cellIdentifier = @"cell";
    UITableViewCell *cell = [tableView dequeueReusableCellWithIdentifier:cellIdentifier];
    if (cell == nil) {
        cell = [[UITableViewCell alloc] initWithStyle:UITableViewCellStyleDefault reuseIdentifier:cellIdentifier];
    }
    cell.selectionStyle = UITableViewCellSelectionStyleNone;
    
    if (self.channelIdArray.count > 0) {
        cell.textLabel.text = self.channelIdArray[indexPath.row];
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
    NSString *channelId = self.channelIdArray[indexPath.row];
    self.model.channelId = channelId;
    
    CHSettingViewController *vc = [[CHSettingViewController alloc] init];
    vc.model = self.model;
    [self.navigationController pushViewController:vc animated:YES];
    
}


@end
