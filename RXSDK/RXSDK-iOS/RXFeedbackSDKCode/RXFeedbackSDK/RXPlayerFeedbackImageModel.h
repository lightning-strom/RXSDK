//
//  RXPlayerFeedbackImageModel.h
//  RXUIKit-OS
//
//  Created by root11 on 2024/9/12.
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>
#import <Photos/Photos.h>

NS_ASSUME_NONNULL_BEGIN

@interface RXPlayerFeedbackImageModel : NSObject
//video或者image
@property (nonatomic, strong) NSString *type;
//图片或视频截图
@property (nonatomic, strong) UIImage *screenimage;
//资源
@property (nonatomic, strong) PHAsset *asset;
//上传后的oss路径
@property (nonatomic, copy) NSString *uploadString;

@end

NS_ASSUME_NONNULL_END
