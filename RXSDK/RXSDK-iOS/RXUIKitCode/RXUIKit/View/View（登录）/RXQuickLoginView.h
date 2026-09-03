//
//  RXQuickLoginView.h
//  RXUIKit
//
//  Created by 陈汉 on 2023/3/16.
//

#import <UIKit/UIKit.h>
#import "RXUICommonTool.h"
#import "RXLoginUIConfig.h"

NS_ASSUME_NONNULL_BEGIN

typedef void(^ClickBlock)(LoginType loginType);
typedef NSDictionary *_Nullable(^LoginTypeBlock)(NSDictionary *loginEvent, LoginType loginType);
typedef void(^LoginComplete)(NSDictionary *response, RX_CommonRequestError *error);

@interface RXQuickLoginView : UIView

@property (nonatomic, assign) BOOL isFirstViewLoad; // 是否直接展示
@property (nonatomic, copy) ClickBlock clickBlock;
@property (nonatomic, assign) RXUserType viewType;
@property (nonatomic, strong) UIView *quickBgView;

- (instancetype)initWithLoginConfig:(RXLoginUIConfig *)loginConfig
                           viewType:(RXUserType)viewType
                         loginEvent:(NSDictionary *(^)(NSDictionary *loginEvent, LoginType loginType))loginEvent
                           complete:(void(^)(NSDictionary *response, RX_CommonRequestError *error))complete;

- (void)refreshUIWithViewType:(RXUserType)viewType;

// 创建无限重复动画方法
- (void)startInfiniteAnimationForLabel:(UIImageView *)label;

// 停止动画
- (void)stopAnimation;

@end

NS_ASSUME_NONNULL_END
