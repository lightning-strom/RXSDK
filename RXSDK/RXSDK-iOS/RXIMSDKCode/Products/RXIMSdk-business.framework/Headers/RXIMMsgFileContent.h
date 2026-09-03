//
//  RXIMMsgFileContent.h
//  RXIMSdk
//
//  Created by 陈汉 on 2021/9/13.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface RXIMMsgFileContent : NSObject

/** 文件名 */
@property (nonatomic, copy) NSString *name;
/** 文件源数据 */
@property (nonatomic, strong) NSData *file_data;
/** 文件资源url */
@property (nonatomic, copy) NSString *url;
/** 本地文件路径 */
@property(nonatomic, copy) NSString *path;
/** 文件格式，不含"." */
@property (nonatomic, strong) NSString *file_type;

@end

NS_ASSUME_NONNULL_END
