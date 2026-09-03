//
//  RXUIUserUtility.h
//  RXUIKit
//
//  Created by 陈汉 on 2022/2/19.
//

#import <Foundation/Foundation.h>
#import "RXUIUserInfo.h"
#import "RXLoginUIConfig.h"
#import "RXUserCenterConfig.h"

NS_ASSUME_NONNULL_BEGIN

typedef NSDictionary *_Nullable(^LoginTypeBlock)(NSDictionary *loginEvent, LoginType loginType);
typedef void(^LoginComplete)(NSDictionary *response, RX_CommonRequestError *error);

@interface RXUIUserUtility : NSObject

@property (nonatomic, copy) NSString *universallink;
@property (nonatomic, copy) NSString *aliAuthToken;
@property (nonatomic, copy) NSString *wxAppid;  // 微信appid
@property (nonatomic, copy) NSNumber *loginType;
@property (nonatomic, strong) UIImage *logoImage;
@property (nonatomic, strong) NSMutableArray *accounts;
@property (nonatomic, strong) NSMutableDictionary *extDic;

+ (instancetype)sharedManager;

/** 保存登录成功的账号 */
+ (void)saveAccounts:(NSMutableArray *)accounts;

/** 保存password */
+ (void)savePassword:(NSString *)password;

/** 保存loginModel */
+ (void)saveLoginModel:(NSDictionary *)loginModel;

/** 保存LoginType */
+ (void)saveLoginType:(NSNumber *)loginType;

/** 保存微信appid */
+ (void)saveWXAppid:(NSString *)wxAppid;

/** 保存logo */
+ (void)saveLogoImage:(UIImage *)logoImage;

/** 非本地保存 **/
@property (nonatomic, assign) BOOL isFirstView;
@property (nonatomic, strong) NSMutableArray *loginTypes;
@property (nonatomic, copy) NSString *username;
@property (nonatomic, copy) NSString *password;
@property (nonatomic, strong) NSArray *privacies;
@property (nonatomic, strong) NSArray *privacieTitles;
@property (nonatomic, strong) RXLoginUIConfig *loginConfig;
@property (nonatomic, strong) RXUserCenterConfig *userCenterConfig;
@property (nonatomic, copy) LoginTypeBlock loginTypeBlock;
@property (nonatomic, strong) NSMutableDictionary *loginData;
@property (nonatomic, strong) NSMutableDictionary *apiLoginData;
@property (nonatomic, strong) NSMutableDictionary *legalModel;
@property (nonatomic, strong) NSMutableDictionary *inProfile;
@property (nonatomic, strong) NSString *cpid;
@property (nonatomic, strong) NSString *productId;
@property (nonatomic, strong) NSString *channelId;
@property (nonatomic, strong) NSArray *baseUrlList;
@property (nonatomic, assign) BOOL isShowServiceCenter;
@property (nonatomic, assign) RXPasswordStrength passwordType;
@property (nonatomic, strong) NSString *pwdPattern;
@property (nonatomic, assign) BOOL isAuthFirst;
@property (nonatomic, assign) BOOL isAuthShow;
@property (nonatomic, assign) BOOL isLoginViewShow;
@property (nonatomic, assign) BOOL isClickQuickAuth;
@property (nonatomic, strong) NSString *protocolKey;
@property (nonatomic, strong) NSArray *protocolKeyList;

@property (nonatomic, assign) BOOL isNewLogin;
@property (nonatomic, strong) RXLoginUIModel *loginUIModel;
@property (nonatomic, copy) LoginComplete loginComplete;

@property (nonatomic, assign) BOOL allowExtensionPointIdentifier;

@end

NS_ASSUME_NONNULL_END
