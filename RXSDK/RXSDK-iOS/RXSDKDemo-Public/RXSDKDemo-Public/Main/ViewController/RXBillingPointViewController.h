//
//  RXBillingPointViewController.h
//  RXSDKDemo-Public
//
//  Created by root11 on 2024/6/24.
//

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

@interface RXBillingPointViewController : UIViewController

//appstore、yeepay（wechat）、wechat、ruixue_h5_trade、unipin
@property (nonatomic, strong) NSString *payType;

@end

NS_ASSUME_NONNULL_END
