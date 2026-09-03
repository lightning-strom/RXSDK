//
//  RXOSRegistView.h
//  RXSDK
//
//  Created by 陈汉 on 2021/9/30.
//

#import <UIKit/UIKit.h>
#import "RXOSCommonTool.h"
#import "RXOSCommonHeader.h"

NS_ASSUME_NONNULL_BEGIN

typedef enum : NSUInteger {
    RegistViewType_regist,
    RegistViewType_password,
    RegistViewType_binding,
} RegistViewType;

typedef void(^RegistCallBack)(BOOL success, NSString *username, NSString *password);
typedef void(^BindingCallBack)(NSDictionary *response, RX_CommonRequestError *error);

@interface RXOSRegistView : UIView

@property (nonatomic, copy) BindingCallBack bindingBlock;
@property (nonatomic, strong) NSString *username;
@property (nonatomic, strong) NSString *captchaCode;

- (instancetype)initWithType:(RegistViewType)type
                      extDic:(NSMutableDictionary * __nullable)extDic
                    complete:(void(^)(BOOL success, NSString *username, NSString *password))complete;

- (void)hide;

@end

NS_ASSUME_NONNULL_END
