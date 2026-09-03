//
//  RXChannelIdViewController.h
//  RXSDKDemo-Public
//
//  Created by root11 on 2024/6/21.
//

#import <UIKit/UIKit.h>
#import "CHSettingCellModel.h"

NS_ASSUME_NONNULL_BEGIN

@interface RXChannelIdViewController : UIViewController

@property (nonatomic, strong) CHSettingCellModel *model;//初始化model

@property (nonatomic, strong) NSArray *channelArray;//渠道数组

@end

NS_ASSUME_NONNULL_END
