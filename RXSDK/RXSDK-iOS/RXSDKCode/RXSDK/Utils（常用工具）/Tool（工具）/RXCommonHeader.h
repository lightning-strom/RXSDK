//
//  RXCommonHeader.h
//  RXSDK
//
//  Created by 陈汉 on 2021/10/14.
//

#ifndef RXCommonHeader_h
#define RXCommonHeader_h


#import "UIImage+RXAddition.h"
#import "UIViewController+RXExtension.h"
#import "NSString+RXAddition.h"
#import "RXUserUtility.h"
#import "RXLoginManager.h"
#import "RXConfig.h"
#import "RXExtension.h"
#import "RXErrorTool.h"
#import "RX_CommonNetworkExcuteManager.h"
#import "RXUserActionLogManager.h"
#import "RXSubPackage.h"
#import "RXNotificationCenter.h"


#ifdef DEBUG
#define NSLog(...) NSLog(__VA_ARGS__)
#define sLog( s, ... ) printf("class: <%p %s:(%d) > method: %s \n%s\n", self, [[[NSString stringWithUTF8String:__FILE__] lastPathComponent] UTF8String], __LINE__, __PRETTY_FUNCTION__, [[NSString stringWithFormat:(s), ##__VA_ARGS__] UTF8String] )
#define debugMethod() NSLog(@"%s", __func__)
#else// 发布状态, 关闭LOG功能
#define NSLog(...)
#define sLog( s, ... )
#define debugMethod()
#endif


static NSString *const sdkVersion = @"4.0.8";

/* ------- notiKeys ------- */
static NSString *const noti_LoginFail = @"noti_LoginFail";
static NSString *const noti_passwordChange = @"noti_passwordChange";
static NSString *const noti_rxUILogin = @"noti_rxUILogin";
static NSString *const noti_rxCloseAuth = @"noti_rxCloseAuth";
static NSString *const noti_openNetwork = @"noti_openNetwork";
static NSString *const noti_slideCodeSuc = @"noti_slideCodeSuc";
static NSString *const noti_busRequestSuc = @"noti_busRequestSuc";

/* ------- keys ------- */

/* ------- 预制事件 ------- */
// 登录
static NSString *const rxlog_login_invoke = @"rxsdk_login_invoke";      // 调用接口
static NSString *const rxlog_login_request = @"rxsdk_login_request";    // 发起请求
static NSString *const rxlog_login_result = @"rxsdk_login_result";      // 服务端返回请求结果
static NSString *const rxlog_login_callback = @"rxsdk_login_callback";  // SDK将请求结果回调

// iap
static NSString *const rxlog_requestproduct = @"#rxsdk_requestproduct";  // 下单
static NSString *const rxlog_getproduct = @"#rxsdk_getproduct";          // 获取商品
static NSString *const rxlog_transactions = @"#rxsdk_transactions";      // iap流程
static NSString *const rxlog_notify = @"#rxsdk_notify";                  // 开始验证订单
static NSString *const rxlog_iapresult = @"#rxsdk_iapresult";            // 验证结果
static NSString *const rxlog_removeTransactionObserver = @"#rxsdk_removeTransactionObserver";  // 移除凭证

// 网络请求
static NSString *const rxlog_networkError = @"#rxsdk_networkError";      // 网络请求失败（非服务端返回）

// 投放
static NSString *const rxlog_bind_bigdata = @"#rxsdk_bind_bigdata";      // 上报归因回传数据
static NSString *const rxlog_ws_fail = @"#rxsdk_wssFail";                // websocket 连接失败

// 商业化
static NSString *const rxlog_business_window = @"#window_exposure";      // 商业化数据上报

//三方返回的 登录、分享，以及一些客户端错误码上报到大数据中
static NSString *const rxlog_error = @"#rx_error";
//上报事件类型
static NSString *const rxlog_error_init = @"rxlog_error_init";
static NSString *const rxlog_error_login = @"rxlog_error_login";
static NSString *const rxlog_error_iap  = @"rxlog_error_iap";
static NSString *const rxlog_error_share = @"rxlog_error_share";

// 获取设备安装应用列表
static NSString *const rxlog_apps = @"#device_applist";

// 获取公网 ip 地址
static NSString *const rx_publicUrl = @"http://ifconfig.me/ip";

#endif /* RXCommonHeader_h */
