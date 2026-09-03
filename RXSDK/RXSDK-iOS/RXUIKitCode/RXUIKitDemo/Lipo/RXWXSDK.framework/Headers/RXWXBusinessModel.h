//
//  RXWXBusinessModel.h
//  RXWXSDK
//
//  Created by 陈汉 on 2025/6/13.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface RXWXBusinessModel : NSObject

/**
 * 业务类型
 */
@property (nonatomic, strong) NSString *businessType;
/**
 * query
 */
@property (nonatomic, strong) NSString *query;

@end

NS_ASSUME_NONNULL_END
