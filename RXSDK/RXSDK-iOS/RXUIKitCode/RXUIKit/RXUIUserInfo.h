//
//  RXUIUserInfo.h
//  RXUIKit
//
//  Created by 陈汉 on 2023/3/20.
//

#import <Foundation/Foundation.h>
#import <RXSDK_Pure/RXSDK_Pure.h>

NS_ASSUME_NONNULL_BEGIN

@interface RXUIUserInfo : NSObject

@property (nonatomic, assign) LoginType loginType;
@property (nonatomic, copy) NSString *openid;
@property (nonatomic, copy) NSString *login_openid;
@property (nonatomic, copy) NSString *nickname;
@property (nonatomic, copy) NSString *username;
@property (nonatomic, copy) NSString *password;

@end

NS_ASSUME_NONNULL_END
