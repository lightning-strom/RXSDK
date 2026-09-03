//
//  RXLBSModel.h
//  RXLBSKit
//
//  Created by 陈汉 on 2022/4/26.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface RXLBSModel : NSObject

///格式化地址
@property (nonatomic, copy) NSString *formattedAddress;

///国家
@property (nonatomic, copy) NSString *country;

///省/直辖市
@property (nonatomic, copy) NSString *province;

///市
@property (nonatomic, copy) NSString *city;

///区
@property (nonatomic, copy) NSString *district;

///城市编码
@property (nonatomic, copy) NSString *citycode;

///区域编码
@property (nonatomic, copy) NSString *adcode;

///街道名称
@property (nonatomic, copy) NSString *street;

///门牌号
@property (nonatomic, copy) NSString *number;

///兴趣点名称
@property (nonatomic, copy) NSString *POIName;

///所属兴趣点名称
@property (nonatomic, copy) NSString *AOIName;

///经度
@property (nonatomic, assign) double longitude;

///纬度
@property (nonatomic, assign) double latitude;

@end

NS_ASSUME_NONNULL_END
