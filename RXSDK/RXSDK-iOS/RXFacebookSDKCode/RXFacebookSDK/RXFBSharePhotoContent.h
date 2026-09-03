//
//  RXFBSharePhotoContent.h
//  RXFacebookSDK
//
//  Created by 陈汉 on 2023/7/28.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface RXFBSharePhotoContent : NSObject

/**
 * 分享的图片集
 * 支持 UIImage/NSData/Url 类型
 */
@property (nonatomic, copy) NSArray * _Nonnull photos;
/**
 * 共享内容的URL
 */
@property (nonatomic, copy) NSURL * _Nullable contentURL;
/**
 * 话题标签
 */
@property (nonatomic, strong) NSString * _Nullable hashtag;
/**
 * 要用此内容标记的位置的ID
 */
@property (nonatomic, copy) NSString * _Nullable placeID;
/**
 * 当用户从提要上的共享内容中点击链接时，要添加到referrer URL的值
 */
@property (nonatomic, copy) NSString * _Nullable ref;
/**
 * 对于Messenger中的共享，此pageID将用于将应用程序映射到页面并附加共享属性
 */
@property (nonatomic, copy) NSString * _Nullable pageID;

@end

NS_ASSUME_NONNULL_END
