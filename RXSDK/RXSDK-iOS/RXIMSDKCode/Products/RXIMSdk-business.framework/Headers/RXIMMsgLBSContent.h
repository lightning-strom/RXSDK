//
//  RXIMMsgLBSContent.h
//  RXIMSdk
//
//  Created by 陈汉 on 2021/9/13.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface RXIMMsgLBSContent : NSObject

/** 地理位置名称 */
@property (nonatomic,copy) NSString *name;
/** 位置封面图片数据 */
@property (nonatomic,copy) NSData *cover_data;
/** 位置封面图片 */
@property (nonatomic,copy) NSString *cover_url;
/** 纬度 */
@property(nonatomic) double latitude;
/** 经度 */
@property(nonatomic) double longitude;

@end

NS_ASSUME_NONNULL_END
