//
//  RXFeedbackUserUtility.h
//  RXUIKit-OS
//
//  Created by 陈汉 on 2023/6/15.
//

#import <Foundation/Foundation.h>
#import "RXFeedbackUILoginConfig.h"
#import "RXFeedbackCommonHeader.h"

NS_ASSUME_NONNULL_BEGIN

typedef NSDictionary *_Nullable(^LoginTypeBlock)(NSDictionary *loginEvent, LoginType loginType);

@interface RXFeedbackUserUtility : NSObject

@property (nonatomic, copy) NSString *universallink;
@property (nonatomic, copy) NSString *aliAuthToken;
@property (nonatomic, copy) NSNumber *loginType;
@property (nonatomic, strong) UIImage *logoImage;
@property (nonatomic, strong) NSMutableArray *accounts;
@property (nonatomic, strong) NSMutableDictionary *extDic;
@property (nonatomic, assign) BOOL closeEmailRegister;
@property (nonatomic, assign) BOOL isCodeTFLoad;

+ (instancetype)sharedManager;

/** 保存登录成功的账号 */
+ (void)saveAccounts:(NSMutableArray *)accounts;

/** 保存password */
+ (void)savePassword:(NSString *)password;

/** 保存loginModel */
+ (void)saveLoginModel:(NSDictionary *)loginModel;

/** 保存loginType */
+ (void)saveLoginType:(NSNumber *)loginType;

/** 保存logo */
+ (void)saveLogoImage:(UIImage *)logoImage;

/** 非本地保存 **/
@property (nonatomic, assign) BOOL isFirstView;
@property (nonatomic, strong) NSMutableArray *loginTypes;
@property (nonatomic, copy) NSString *username;
@property (nonatomic, copy) NSString *password;
@property (nonatomic, strong) NSArray *privacies;
@property (nonatomic, strong) NSArray *privacieTitles;
@property (nonatomic, strong) RXFeedbackUILoginConfig *loginConfig;
@property (nonatomic, copy) LoginTypeBlock loginTypeBlock;
@property (nonatomic, strong) NSMutableDictionary *loginData;
@property (nonatomic, strong) NSMutableDictionary *apiLoginData;
@property (nonatomic, strong) NSMutableDictionary *legalModel;
@property (nonatomic, strong) NSMutableDictionary *inProfile;
@property (nonatomic, strong) NSString *cpid;
@property (nonatomic, strong) NSString *productId;
@property (nonatomic, strong) NSString *channelId;
@property (nonatomic, strong) NSString *areaCode;
@property (nonatomic, strong) NSArray *baseUrlList;
@property (nonatomic, assign) BOOL osVersible;
@property (nonatomic, assign) BOOL isShowServiceCenter;
@property (nonatomic, strong) NSString *protocolKey;
@property (nonatomic, strong) NSArray *protocolKeyList;

@end

NS_ASSUME_NONNULL_END
