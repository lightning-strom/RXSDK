
//
//  RXIMLoginModel.h
//  RXIMSdk
//
//  Created by 陈汉 on 2021/8/30.
//

#import <Foundation/Foundation.h>
#import "RXIMBaseInterfaceModel.h"

NS_ASSUME_NONNULL_BEGIN

@interface RXIMLoginData : NSObject

@property (nonatomic, copy) NSString *aeskey; // AES密钥，16进制64个字符（实际为32个字节256位）
@property (nonatomic, copy) NSString *access_token; // 访问Token
@property (nonatomic, copy) NSString *refresh_token; // 刷新Token
@property (nonatomic, assign) NSInteger access_token_expire; // 访问Token剩余有效秒数
@property (nonatomic, assign) NSInteger refresh_token_expire; // 刷新Token剩余有效秒数

@end

@interface RXIMLoginModel : RXIMBaseInterfaceModel
@property (nonatomic, strong) RXIMLoginData *data; //登录返回数据
@end

@interface RXIMConnectSts : NSObject

@property (nonatomic, copy) NSString *end_point;
@property (nonatomic, copy) NSString *bucket;
@property (nonatomic, copy) NSString *domain;

@end

@interface RXIMConnectData : NSObject

@property (nonatomic, copy) NSMutableArray *entry_addrs; // socket连接地址
@property (nonatomic, assign) NSInteger conn_timeout_milli; //socket链接超时时间
@property (nonatomic, strong) NSDictionary *sts; //oss参数
@property (nonatomic, assign) BOOL business;    //是否支持业务会话

@end

@interface RXIMConnectModel : RXIMBaseInterfaceModel
@property (nonatomic, strong) RXIMConnectData *data; //登录返回数据
@end

NS_ASSUME_NONNULL_END
