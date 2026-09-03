//
//  TestNetworkStatus.m
//  RuiXueDemo
//
//  Created by 陈汉 on 2025/5/30.
//

#import "TestNetworkStatus.h"
#import <Network/Network.h> // 添加Network框架

@interface TestNetworkStatus ()

@end

@implementation TestNetworkStatus

- (void)viewDidLoad {
    [super viewDidLoad];
    
    [self setupNetworkMonitoring];
}

// 添加网络监听方法
- (void)setupNetworkMonitoring {
    nw_path_monitor_t networkMonitor = nw_path_monitor_create();
    
    nw_path_monitor_set_queue(networkMonitor, dispatch_get_main_queue());
    
    nw_path_monitor_set_update_handler(networkMonitor, ^(nw_path_t _Nonnull path) {
        if (nw_path_get_status(path) == nw_path_status_satisfied) {
            NSLog(@"网络连接已授权并可用");
            // 在这里处理网络首次连接的逻辑
        } else {
            NSLog(@"网络未连接或未授权");
        }
    });
    
    nw_path_monitor_start(networkMonitor);
}

/*
#pragma mark - Navigation

// In a storyboard-based application, you will often want to do a little preparation before navigation
- (void)prepareForSegue:(UIStoryboardSegue *)segue sender:(id)sender {
    // Get the new view controller using [segue destinationViewController].
    // Pass the selected object to the new view controller.
}
*/

@end
