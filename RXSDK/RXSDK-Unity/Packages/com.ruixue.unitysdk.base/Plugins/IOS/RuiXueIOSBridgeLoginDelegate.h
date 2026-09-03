//
//  RuiXueIOSBridgeLoginDelegate.h
//  Unity-iPhone
//
//  Created by liyubo on 2023/12/16.
//

#ifndef RuiXue_IOSBridge_LoginDelegate_h
#define RuiXue_IOSBridge_LoginDelegate_h


@interface RuiXueIOSBridgeLoginDelegate : NSObject<RXLoginDelegate>

@property  RequestResponseCallBack  onLoginSuccess;
@property  RequestErrorCallBack  onLoginError;

@property  RequestResponseCallBack  onAntiSuccess;
@property  RequestErrorCallBack  onAntiError;

+(instancetype) shareInstance ;

/**
 * 登录回调
 * @param response 返回数据，登录失败返回nil
 * @param error 错误返回，登录成功返回nil
 */
- (void)rx_LoginCallBackWithResponse:(NSDictionary * _Nullable)response error:(RX_CommonRequestError *)error;

/**
 * 防沉迷回调
 * @param response 返回数据，登录失败返回nil
 * @param error 错误返回，登录成功返回nil
 */
- (void)rx_antiCallBackWithResponse:(NSDictionary *)response error:(NSError *)error;

@end

#endif /* RuiXueIOSBridgeLoginDelegate */
