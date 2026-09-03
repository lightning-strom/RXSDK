//
//  RXIMMsgLBSContent_pb.h
//  RXIMSdk
//
//  Created by weiyongjian on 2022/7/8.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface RXIMMsgLBSContent_pb : NSObject

/** 地理位置名称 */
@property(nonatomic, copy) NSString *name;
/** 地理位置信息 */
@property (nonatomic,copy) NSString *address;
/** 位置封面图片 */
@property (nonatomic,copy) NSString *cover_url;
/** 纬度 */
@property(nonatomic) double latitude;
/** 经度 */
@property(nonatomic) double longitude;

@end

NS_ASSUME_NONNULL_END
