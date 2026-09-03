//
//  RXGetBackPasswordView.h
//  RXSDK
//
//  Created by 陈汉 on 2021/10/8.
//

#import <UIKit/UIKit.h>
#import <RXSDK_Pure/RXSDK_Pure.h>

NS_ASSUME_NONNULL_BEGIN

typedef enum : NSUInteger {
    GetBackPasswordType_default,
    GetBackPasswordType_code,
} GetBackPasswordType;

typedef void(^GetBackPasswordComplete)(NSDictionary *response, RX_CommonRequestError *error);

typedef void(^GetBackPasswordDoneBlcok)(NSString *username);

typedef NSMutableDictionary *_Nullable(^PasswordRequestBlock)(NSMutableDictionary *params);

@interface RXGetBackPasswordView : UIView

// 获取验证码页面phone和code传@""
- (instancetype)initWithType:(GetBackPasswordType)type
                       phone:(NSString *)phone
                        code:(NSString *)code;

@property (nonatomic, copy) GetBackPasswordDoneBlcok doneBlock;
@property (nonatomic, copy) GetBackPasswordComplete complete;
@property (nonatomic, copy) PasswordRequestBlock requestBlock;
@property (nonatomic, strong) NSDictionary *params;
@property (nonatomic, strong) NSString *placeHolder;

@end

NS_ASSUME_NONNULL_END
