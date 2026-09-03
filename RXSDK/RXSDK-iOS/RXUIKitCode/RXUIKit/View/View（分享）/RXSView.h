//
//  RXSView.h
//  RXShareKit
//
//  Created by 陈汉 on 2022/5/25.
//

#import <UIKit/UIKit.h>
#import "RXSTool.h"

NS_ASSUME_NONNULL_BEGIN

@interface RXSView : UIView

- (instancetype)initWithShareTypes:(NSArray *)shareTypes
                             round:(BOOL)round
                        clickBlock:(RXShareClickBlock)clickBlock;

@end

NS_ASSUME_NONNULL_END
