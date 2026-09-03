//
//  RXRedditAuthManager.m
//  RXRedditSDK
//
//  Created by root11 on 2024/4/11.
//

#import "RXRedditAuthManager.h"
#import <UIKit/UIKit.h>



#define redditAccessTokenKey @"redditAccessToken"//token key
#define redditSaveTokenDateKey @"redditCurrentDate"//存储token 的时间key
#define redditTokenExpiresKey @"redditTokenExpiresDate"//过期时间key
#define redditModHash @"redditModhash"//根据token请求回来的modHash key
//获取modhash的接口
static NSString * const kRedditMeURL = @"https://oauth.reddit.com/api/v1/me";
//static NSString * const kRedditMeURL = @"https://oauth.reddit.com/api/me.json";


@interface RXRedditAuthManager ()

@property (nonatomic, copy) RedditAuthCompletionBlock authCompletionBlock;

@end

@implementation RXRedditAuthManager

static RXRedditAuthManager *sharedSDK = nil;

+ (instancetype)sharedSDK {
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        sharedSDK = [[self alloc] init];
    });
    return sharedSDK;
}

- (instancetype)init {
    self = [super init];
    if (self) {
        // 初始化属性
    }
    return self;
}

+ (instancetype)allocWithZone:(struct _NSZone *)zone {
    static dispatch_once_t once_Token;
    dispatch_once(&once_Token, ^{
        sharedSDK = [super allocWithZone:zone];
        
    });
    return sharedSDK;
}

- (id)copyWithZone:(NSZone *)zone {
    return sharedSDK;
}

- (id)mutableCopyWithZone:(NSZone *)zone {
    return sharedSDK;
}

/**
 * 分享之前，检查本地是否存储accesstoken,是否过期
 */
- (void)checkAccessTokenAndModHashWithCompletion:(RedditAuthCompletionBlock)completion{
    
    self.authCompletionBlock = completion;
    
    NSString *accessToken = [[NSUserDefaults standardUserDefaults] objectForKey:redditAccessTokenKey];
//    NSString *modhash = [[NSUserDefaults standardUserDefaults] objectForKey:redditModHash];

    if (accessToken) {
        NSString *saveDate = [[NSUserDefaults standardUserDefaults] objectForKey:redditSaveTokenDateKey];
        NSString *expiresSeconds = [[NSUserDefaults standardUserDefaults] objectForKey:redditTokenExpiresKey];
        
        if ([self isTokenSaveDate:saveDate expiresSeconds:expiresSeconds]) {//过期,重新登录授权
            NSString *accesstoken = nil;
//            NSString *modhash = nil;
            NSMutableDictionary *errorDic = nil;
            if (self.authCompletionBlock) {
                self.authCompletionBlock(YES, accesstoken, errorDic);
            }
        }else{//未过期，返回modhash
            NSDictionary *errorDic = nil;
            if (self.authCompletionBlock) {
                self.authCompletionBlock(NO, accessToken, errorDic);
            }
        }
    }else{//不存在token，重新登录授权
        NSString *accesstoken = nil;
        NSDictionary *errorDic = nil;
        if (self.authCompletionBlock) {
            self.authCompletionBlock(YES, accesstoken, errorDic);
        }
    }
}

//判断token是否过期，YES已过期，NO未过期
- (BOOL)isTokenSaveDate:(NSString *)saveDate expiresSeconds:(NSString *)seconds{

    // 创建日期格式化器
    NSDateFormatter *dateFormatter = [[NSDateFormatter alloc] init];
    [dateFormatter setDateFormat:@"yyyy-MM-dd HH:mm:ss"];
    // 将存储的时间字符串转换为NSDate对象
    NSDate *storedDate = [dateFormatter dateFromString:saveDate];
    // 获取过期日期后的日期
    NSInteger expirationSeconds = [seconds integerValue];
    NSDate *expirationDate = [storedDate dateByAddingTimeInterval:expirationSeconds];
    // 获取当前时间
    NSDate *currentDate = [NSDate date];
    // 比较当前时间和过期时间
    NSComparisonResult result = [currentDate compare:expirationDate];

    if (result == NSOrderedAscending || result == NSOrderedSame) { //未过期
        return NO;
    } else {//已过期
        return YES;
    }
}

/**
 * 存储accesstoken，并获取modHash存储到本地
 */
- (void)saveAccessToken:(NSString *)accessToken expires_inSeconds:(NSString *)seconds operationType:(NSInteger)type{
    //存储token、存储当前时间、存储过期时间
    [[NSUserDefaults standardUserDefaults] setObject:accessToken forKey:redditAccessTokenKey];
    
    // 获取当前时间 并存储
    NSDate *currentDate = [NSDate date];
    // 创建日期格式化器
    NSDateFormatter *dateFormatter = [[NSDateFormatter alloc] init];
    [dateFormatter setDateFormat:@"yyyy-MM-dd HH:mm:ss"];
    // 将日期转换为字符串
    NSString *currentDateString = [dateFormatter stringFromDate:currentDate];
    // 将字符串存储在NSUserDefaults中
    [[NSUserDefaults standardUserDefaults] setObject:currentDateString forKey:redditSaveTokenDateKey];
   
    //存储过期时间
    [[NSUserDefaults standardUserDefaults] setObject:seconds forKey:redditTokenExpiresKey];
    
    if (type == 1) {//分享
        NSDictionary *errorDic = nil;
        if (self.authCompletionBlock) {
            self.authCompletionBlock(NO, accessToken, errorDic);
        }
    }
    
    
    /*
    //根据token获取modeHash...
    __weak typeof(self) weakSelf = self;
    [self getModhashWithAccessToken:accessToken completion:^(NSString *modhash, NSError *error) {
        if (modhash && modhash.length > 0) {
            NSDictionary *errorDic = nil;
            if (weakSelf.authCompletionBlock) {
                weakSelf.authCompletionBlock(NO, accessToken, modhash, errorDic);
            }
        }else{
            NSString *accessToken = nil;
            NSString *modhash = nil;
            NSMutableDictionary *errorDic = [NSMutableDictionary dictionary];
            [errorDic setValue:@(error.code) forKey:@"code"];
            [errorDic setValue:error.localizedDescription forKey:@"msg"];
            
            if (weakSelf.authCompletionBlock) {
                weakSelf.authCompletionBlock(NO, accessToken, modhash, errorDic);
            }
        }

    }];
    */
}

/*
//根据token获取modhash
- (void)getModhashWithAccessToken:(NSString *)accessToken completion:(void(^)(NSString *modhash, NSError *error))completion {
    NSURL *meURL = [NSURL URLWithString:kRedditMeURL];
    NSMutableURLRequest *request = [NSMutableURLRequest requestWithURL:meURL];
    [request setValue:[NSString stringWithFormat:@"Bearer %@", accessToken] forHTTPHeaderField:@"Authorization"];
    
    __weak typeof(self) weakSelf = self;
    [[[NSURLSession sharedSession] dataTaskWithRequest:request completionHandler:^(NSData *data, NSURLResponse *response, NSError *error) {
        __strong typeof(weakSelf) strongSelf = weakSelf;
        if (strongSelf) {
            if (error == nil) {
                NSDictionary *meDict = [NSJSONSerialization JSONObjectWithData:data options:0 error:nil];
                NSString *modhash = meDict[@"data"][@"modhash"];
                if (modhash) {
                    [strongSelf saveModhash:modhash];
                    completion(modhash, nil);
                } else {
                    completion(nil, [NSError errorWithDomain:@"RedditAuthError" code:0 userInfo:@{NSLocalizedDescriptionKey: @"Modhash not found in response."}]);
                }
            } else {
                completion(nil, error);
            }
        }
    }] resume];
}

- (void)saveModhash:(NSString *)modhash {
    [[NSUserDefaults standardUserDefaults] setObject:modhash forKey:redditModHash];
}
*/
/*
// 将字典转换为查询字符串
- (NSString *)queryStringFromDictionary:(NSDictionary *)dictionary {
    NSMutableArray *parts = [NSMutableArray array];
    for (NSString *key in dictionary) {
        NSString *encodedKey = [self percentEscapeString:key];
        NSString *encodedValue = [self percentEscapeString:dictionary[key]];
        NSString *part = [NSString stringWithFormat:@"%@=%@", encodedKey, encodedValue];
        [parts addObject:part];
    }
    return [parts componentsJoinedByString:@"&"];
}

// URL编码
- (NSString *)percentEscapeString:(NSString *)string {
    NSCharacterSet *allowedCharacters = [NSCharacterSet characterSetWithCharactersInString:@"abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-._~"];
    return [string stringByAddingPercentEncodingWithAllowedCharacters:allowedCharacters];
}
*/

@end
