//
//  RXIMMsgFaceContent.h
//  RXIMSdk
//
//  Created by 陈汉 on 2021/9/11.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface RXIMMsgFaceContent:NSObject

/** 表情包id */
@property (nonatomic, copy) NSString *package_id;
/** 该表情再本包中的id，如果本地有该表情包缓存，直接使用id显示 */
@property (nonatomic, copy) NSString *face_id;
/** 该表情在云端的地址，如native本地没有该表情包，则用此地址单独下载该表情，下载后按表情包方式缓存 */
@property (nonatomic, copy) NSString *face_url;
/** 表情文件格式，不含"." */
@property (nonatomic, copy) NSString *face_file_type;
/** 表情文件大小，单位：byte */
@property (nonatomic, assign) NSInteger size;

@end

NS_ASSUME_NONNULL_END
