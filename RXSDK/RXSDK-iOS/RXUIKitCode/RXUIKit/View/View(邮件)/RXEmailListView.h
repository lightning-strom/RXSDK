//
//  RXEmailListView.h
//  RXUIKit-OS
//
//  Created by root11 on 2024/7/23.
//

#import <UIKit/UIKit.h>
#import "RXUICommonTool.h"

NS_ASSUME_NONNULL_BEGIN

typedef void(^AccountDeleteBlock)(void);
typedef void(^SelectAccountBlock)(NSMutableDictionary *userInfo);
typedef void(^LoginComplete)(NSDictionary *response, RX_CommonRequestError *error);
typedef NSDictionary *_Nullable(^LoginTypeBlock)(NSDictionary *loginEvent, LoginType loginType);

@interface RXEmailListView : UIView

@property (nonatomic, copy) LoginComplete loginComplete;
@property (nonatomic, copy) LoginTypeBlock loginTypeBlock;
@property (nonatomic, copy) AccountDeleteBlock deleteBlock;

- (instancetype)initWithCpUserId:(NSString *)cpUserId;


@end

NS_ASSUME_NONNULL_END
