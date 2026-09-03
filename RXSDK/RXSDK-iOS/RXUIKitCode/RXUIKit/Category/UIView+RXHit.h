//
//  UIView+RXHit.h
//  RXSDK
//
//  Created by 陈汉 on 2021/10/15.
//

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

typedef UIView * (^STHitTestViewBlock)(CGPoint point, UIEvent *event, BOOL *returnSuper);
typedef BOOL (^STPointInsideBlock)(CGPoint point, UIEvent *event, BOOL *returnSuper);

@interface UIView (RXHit)

/// althought this is strong ,but i deal it with copy
@property(nonatomic, strong) STHitTestViewBlock hitTestBlock;

@property(nonatomic, strong) STPointInsideBlock pointInsideBlock;

@end

NS_ASSUME_NONNULL_END
