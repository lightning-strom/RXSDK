//
//  RXDestroyAccountView.h
//  RXSDK
//
//  Created by 陈汉 on 2021/12/20.
//

#import <UIKit/UIKit.h>
#import "RXUICommonTool.h"

NS_ASSUME_NONNULL_BEGIN

typedef enum : NSUInteger {
    DestroyType_unRepeal,  // 不可撤销
    DestroyType_refuse,    // 被拒绝
    DestroyType_repeal,    // 可撤销
} DestroyType;

typedef void(^DestroyClickBlock)(DestroyClickType clickType);
typedef void(^DIYDestroyClickBlock)(NSString *btnTitle);

@interface RXDestroyAccountView : UIView

@property (nonatomic, strong) NSString *deregisterType;

- (instancetype)initWithType:(DestroyType)type
                      reason:(NSString *)reason
                  clickBlock:(DestroyClickBlock)clickBlock;

- (instancetype)initWithBtnTitle:(NSString *)btnTitle
                          reason:(NSString *)reason
                   diyClickBlock:(DIYDestroyClickBlock)diyClickBlock;

@end

NS_ASSUME_NONNULL_END
