//
//  RXIMMsgFileContent_pb.h
//  RXIMSdk
//
//  Created by weiyongjian on 2022/7/15.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface RXIMMsgFileContent_pb : NSObject

/** 文件名 */
@property (nonatomic, copy) NSString *name;
/** 文件资源url */
@property (nonatomic, copy) NSString *url;
/** 文件格式，不含"." */
@property (nonatomic, strong) NSString *file_type;
/** 文件大小，单位：byte */
@property (nonatomic, assign) NSInteger size;

@end

NS_ASSUME_NONNULL_END
