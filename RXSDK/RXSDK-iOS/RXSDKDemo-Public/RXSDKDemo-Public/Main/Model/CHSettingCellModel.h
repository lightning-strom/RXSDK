//
//  CHSettingCellModel.h
//  RXSDKDemo-Public
//
//  Created by 陈汉 on 2024/1/3.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface CHSettingCellModel : NSObject

@property (nonatomic, strong) NSString *img;
@property (nonatomic, strong) NSString *title;
@property (nonatomic, strong) NSString *loginType;
@property (nonatomic, strong) NSString *btntitle1;
@property (nonatomic, strong) NSString *btntitle2;

@property (nonatomic, copy) NSString *cpidTitle;
@property (nonatomic, copy) NSString *cpid;//国内、海外的cpid
@property (nonatomic, copy) NSString *productId;//产品id
@property (nonatomic, copy) NSString *channelId;//渠道id
@property (nonatomic, copy) NSString *baseUrl;//url域名

@end

NS_ASSUME_NONNULL_END
