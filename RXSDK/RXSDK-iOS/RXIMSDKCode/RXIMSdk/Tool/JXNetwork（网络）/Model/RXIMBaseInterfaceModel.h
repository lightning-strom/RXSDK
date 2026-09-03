//
//  RXIMBaseInterfaceModel.h
//  RXIMSdk
//
//  Created by weiyongjian on 2021/6/9.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface RXIMBaseInterfaceModel : NSObject

/*!
 @brief 返回码，0代表操作成功，非0代表操作失败。
 */
@property(nonatomic,assign) int32_t code;
/*!
 @brief 返回描述信息，status非0时不为空
 */
@property(nonatomic,copy)NSString *msg;

/**
* 是否请求成功
@return True/False
 */
-(BOOL)isSuccess;

@end

NS_ASSUME_NONNULL_END
