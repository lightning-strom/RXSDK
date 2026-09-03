//
//  RXAddressBookService.h
//  RXAddressBookSDK
//
//  Created by 陈汉 on 2024/5/22.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

/**
 * @param addressBooks 通讯录详情
 * @param hash 通讯录哈希值，用于判断通讯录内容是否有变化
 */
typedef void(^RXGetAddressBookBlock)(NSMutableArray *addressBooks, NSString *hash);

@interface RXAddressBookService : NSObject

/**
 * 获取SDK实例（单例）
 */
+ (instancetype)sharedSDK;

/**
 * 初始化
 */
- (void)regist;

/**
 * 获取通讯录信息
 */
- (void)fetchContacts:(RXGetAddressBookBlock)complete;

@end

NS_ASSUME_NONNULL_END
