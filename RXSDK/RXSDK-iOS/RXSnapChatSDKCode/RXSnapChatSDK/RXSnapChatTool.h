//
//  RXSnapChatTool.h
//  RXSnapChatSDK
//
//  Created by 陈汉 on 2024/4/3.
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

@interface RXSnapChatTool : NSObject

/**
 * 获取当前 ViewController
 */
+ (UIViewController *)currentViewController;

/**
 * 图片下载
 */
+ (void)downImage:(NSString *)imageUrl
         complete:(void(^)(NSData *imgData))complete;

@end

NS_ASSUME_NONNULL_END
