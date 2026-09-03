//
//  RXGetBackPasswordView.h
//  RXSDK
//
//  Created by 陈汉 on 2021/10/8.
//

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

typedef enum : NSUInteger {
    GetBackPasswordType_default,
    GetBackPasswordType_code,
} GetBackPasswordType;

typedef void(^GetBackPasswordDoneBlcok)(void);

@interface RXGetBackPasswordView : UIView

// 获取验证码页面phone和code传@""
- (instancetype)initWithType:(GetBackPasswordType)type
                       phone:(NSString *)phone
                        code:(NSString *)code;

@property (nonatomic, copy) GetBackPasswordDoneBlcok doneBlock;

@end

NS_ASSUME_NONNULL_END
