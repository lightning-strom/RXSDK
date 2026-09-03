//
//  RXABManager.m
//  RXSDK-Pure
//
//  Created by 陈汉 on 2024/5/22.
//

#import "RXABManager.h"
#import "RXCommonHeader.h"
#import "DeviceKey.h"
#import <CommonCrypto/CommonCryptor.h>
#import <objc/message.h>

typedef void(^ABBlock)(NSMutableArray *addressBooks, NSString *hash);

@interface RXABManager ()

@property (nonatomic, strong) NSMutableDictionary *config;
@property (nonatomic, assign) NSInteger reportTS;
@property (nonatomic, copy) ABBlock abBlock;

@end

@implementation RXABManager

static RXABManager *sharedSDK = nil;
static dispatch_once_t onceToken;

+ (instancetype)sharedSDK
{
    dispatch_once(&onceToken, ^{
        sharedSDK = [[RXABManager alloc] init];
    });
    return sharedSDK;
}

- (instancetype)init
{
    self = [super init];
    if (self) {
        self.config = [NSMutableDictionary dictionaryWithDictionary:[RXUserUtility valueForKey:keyUserData_deviceUab]];
    }
    return self;
}

/**
 * 上报
 */
- (void)reportAddressBookList
{
    BOOL needReport = [self.config[@"of"] boolValue];
    
    // 判断两次上报间隔是否小于初始化下发的策略，小于不上报，大于上报, 0 每次登录上报
    NSInteger lastReportTS = [[RXUserUtility valueForKey:keyUserData_ABReportTS] integerValue];
    self.reportTS = [RXCommonTool getTimestamp] / 1000;
    NSInteger limit = [self.config[@"ts"] integerValue];
    NSInteger interval = labs(self.reportTS - lastReportTS);
    
    if (limit == 0 || (limit > 0 && (interval > limit))) {
        
    } else {
        NSLog(@"未达到上报条件");
        return;
    }
    
    if (needReport) {
        // 不存在给出提示
        if (![RXSubPackage sharedSDK].aRXAB) {
            NSLog(@"未接入RXAddressBookSDK");
            return;
        }
            
        __weak __typeof__(self) weakSelf = self;
        self.abBlock = ^(NSMutableArray *addressBooks, NSString *hash) {
            if (addressBooks.count > 0) {
                [weakSelf fetchAddressBookList:addressBooks hash:hash];
            }
        };
        
        NSMutableDictionary *notiDic = [NSMutableDictionary dictionary];
        [notiDic setValue:self.abBlock forKey:@"callback"];
        [RXNotificationCenter postNoti:rxUserDefault_ab object:nil userInfo:notiDic];
    }
}

- (void)fetchAddressBookList:(NSMutableArray *)addressBooks hash:(NSString *)hash
{
//    [self requestAddressBookInfo:addressBooks];
    
    NSMutableArray *addressBooksCache = [NSMutableArray arrayWithArray:[RXUserUtility valueForKey:keyUserData_ABList]];
    
    if (addressBooksCache.count > 0) {
        NSString *hashCache = [RXUserUtility valueForKey:keyUserData_ABHash];
        
        // 对比总表哈希值，和缓存不一致表示通讯录有变化，需要遍历找出有改动的数据
        if (![hashCache isEqualToString:hash]) {
            
            NSMutableArray *changeArr = [NSMutableArray array];
            // 对比每条数据的哈希值，和缓存不一致标识这条数据有变化，将有变化的数据提取出来
            for (NSMutableDictionary *addressBookInfo in addressBooks) {
                
                NSString *hashStr = [addressBookInfo valueForKey:@"hash"];
                
                BOOL isChange = YES;
                for (NSMutableDictionary *addressBookInfoCache in addressBooksCache) {
                    NSString *hashStrCache = [addressBookInfoCache valueForKey:@"hash"];
                    
                    if ([hashStr isEqualToString:hashStrCache]) {
                        isChange = NO;
                        break;
                    }
                }
                
                if (isChange) {
                    [changeArr addObject:addressBookInfo];
                }
            }
            
            if (changeArr.count > 0) {
                [self requestAddressBookInfo:changeArr];
                
                [RXUserUtility setValue:addressBooks ForKey:keyUserData_ABList];
                [RXUserUtility setValue:hash ForKey:keyUserData_ABHash];
            }
        }
        
    } else {
        [self requestAddressBookInfo:addressBooks];
        
        [RXUserUtility setValue:addressBooks ForKey:keyUserData_ABList];
        [RXUserUtility setValue:hash ForKey:keyUserData_ABHash];
    }
}

- (void)requestAddressBookInfo:(NSMutableArray *)addressBookList
{
    NSMutableDictionary *addressBookListDic = [NSMutableDictionary dictionary];
    [addressBookListDic setValue:addressBookList forKey:@"address_books"];
    
    NSMutableDictionary *dic = [NSMutableDictionary dictionary];
//    [dic setValue:[self encryptData:addressBookList] forKey:@"data"];
    
    NSString *keyString = [self getEncryptKey];
    NSData *keyData = [keyString dataUsingEncoding:NSUTF8StringEncoding];
    NSData *jsonData = [NSJSONSerialization dataWithJSONObject:addressBookList options:NSJSONWritingPrettyPrinted error:nil];

    NSData *encryptedData = [self AES256EncryptData:jsonData withKey:keyData iv:nil];
    
    NSString *base64EncodedString = [encryptedData base64EncodedStringWithOptions:0];
    
//    NSData *dec = [self AES256DecryptData:encryptedData withKey:keyData iv:nil];
//    NSString *decodedString = [[NSString alloc] initWithData:dec encoding:NSUTF8StringEncoding];
    
    [dic setValue:base64EncodedString forKey:@"data"];
    
    NSString *urlStr = [NSString stringWithFormat:@"v1/%@/ph/uab", self.config[@"ph"]];
    
    RX_CommonRequest *request = [[RX_CommonRequest alloc] initWithApiName:urlStr andParams:dic requsetMethod:RequestMethod_Post];
    request.baseUrl = [RXConfig sharedManager].apiDomain;
    request.headParams = [RX_CommonNetworkExcuteManager headParams];
    
    [[RX_CommonNetworkExcuteManager commonRequestClient] beginRequest:request success:^(id  _Nullable responseObject) {
        NSData *jsonData = [NSJSONSerialization dataWithJSONObject:responseObject options:NSJSONWritingPrettyPrinted error:nil];
        NSString *jsonString = [[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];
        NSLog(@"通讯录上报成功:\n %@", jsonString);
        
        // 记录上报时间，实时性要求不高
        [RXUserUtility setValue:@(self.reportTS) ForKey:keyUserData_appsInfo_reportTS];
        
    } failure:^(RX_CommonRequestError * _Nullable error) {
        NSLog(@"通讯录上报失败:\n %@", error.error);
    }];
}

- (NSString *)getEncryptKey
{
    NSString *device = [DeviceKey getDeviceIDInKeychain];
    NSString *openid = [RXUserUtility valueForKey:keyUserData_openId];
    
    NSString *encrypt = [NSString stringWithFormat:@"%@%@", device, openid];
    
    encrypt = [RXCommonTool md532BitlowerWithStr:encrypt];
    
    return encrypt;
}

- (NSData *)AES256EncryptData:(NSData *)data withKey:(NSData *)key iv:(NSData *)iv {
    return [self AES256Operation:kCCEncrypt data:data key:key iv:iv];
}

- (NSData *)AES256DecryptData:(NSData *)data withKey:(NSData *)key iv:(NSData *)iv {
    return [self AES256Operation:kCCDecrypt data:data key:key iv:iv];
}

- (NSData *)AES256Operation:(CCOperation)operation data:(NSData *)data key:(NSData *)key iv:(NSData *)iv {
    // Ensure the key length is 32 bytes (256 bits)
    if (key.length != kCCKeySizeAES256) {
        NSLog(@"Error: Key length must be 32 bytes for AES-256");
        return nil;
    }

    // Ensure the IV length is 16 bytes (128 bits)
//    if (iv.length != kCCBlockSizeAES128) {
//        NSLog(@"Error: IV length must be 16 bytes for AES");
//        return nil;
//    }

    size_t outLength;
    NSMutableData *output = [NSMutableData dataWithLength:data.length + kCCBlockSizeAES128];

    CCCryptorStatus result = CCCrypt(operation,
                                     kCCAlgorithmAES,
                                     kCCOptionPKCS7Padding | kCCOptionECBMode,
                                     key.bytes,
                                     kCCKeySizeAES256,
                                     NULL,
                                     data.bytes,
                                     data.length,
                                     output.mutableBytes,
                                     output.length,
                                     &outLength);

    if (result == kCCSuccess) {
        output.length = outLength;
        return output;
    } else {
        NSLog(@"Error: Failed to perform AES operation, status: %d", result);
        return nil;
    }
}

@end
