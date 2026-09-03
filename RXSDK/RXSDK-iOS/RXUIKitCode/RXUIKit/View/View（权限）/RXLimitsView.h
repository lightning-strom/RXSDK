//
//  RXLimitsView.h
//  RXSDK
//
//  Created by 陈汉 on 2021/9/28.
//

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

// status 0拒绝 1同意
typedef void(^RXLimitsClickBlock)(NSInteger status);

@interface RXLimitsView : UIView

- (instancetype)initWithKeys:(NSArray *)keys
                  clickBlock:(RXLimitsClickBlock)clickBlock;

- (instancetype)initWithLegalData:(NSDictionary *)legalData
                       clickBlock:(RXLimitsClickBlock)clickBlock;

@end

NS_ASSUME_NONNULL_END
