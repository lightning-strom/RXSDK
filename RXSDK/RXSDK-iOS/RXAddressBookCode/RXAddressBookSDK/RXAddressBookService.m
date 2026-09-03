//
//  RXAddressBookService.m
//  RXAddressBookSDK
//
//  Created by 陈汉 on 2024/5/22.
//

#import "RXAddressBookService.h"
#import <Contacts/Contacts.h>
#import <AddressBook/AddressBookDefines.h>
#import <AddressBook/ABRecord.h>
#import <UIKit/UIKit.h>
#import <CommonCrypto/CommonCrypto.h>
#import <RXSDK_Pure/RXSDK_Pure.h>
#import <RXSDK_Pure/RXNotificationCenter.h>
#import <RXSDK_Pure/RXSubPackage.h>

@interface RXAddressBookService ()

@property (nonatomic, copy) RXGetAddressBookBlock block;
@property (nonatomic, strong) NSMutableArray *addressBookInfoList;

@end

@implementation RXAddressBookService

static RXAddressBookService *sharedSDK = nil;
static dispatch_once_t onceToken;

+ (instancetype)sharedSDK
{
    dispatch_once(&onceToken, ^{
        sharedSDK = [[RXAddressBookService alloc] init];
    });
    return sharedSDK;
}

- (instancetype)init
{
    self = [super init];
    if (self) {
        
        [RXSubPackage sharedSDK].aRXAB = YES;
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(abAction:) name:rxUserDefault_ab object:nil];
    }
    return self;
}

#pragma mark -- from main framework
- (void)abAction:(NSNotification *)noti
{
    RXGetAddressBookBlock callback = noti.userInfo[@"callback"];
    
    [self fetchContacts:callback];
}

- (void)regist
{
    NSLog(@"RXAddressBookSDK 初始化成功");
}

// 请求通讯录访问权限
- (void)requestContactsAccessWithCompletion:(void (^)(BOOL granted, NSError *error))completion
{
    CNContactStore *store = [[CNContactStore alloc] init];
    [store requestAccessForEntityType:CNEntityTypeContacts completionHandler:^(BOOL granted, NSError * _Nullable error) {
        dispatch_async(dispatch_get_main_queue(), ^{
            if (completion) {
                completion(granted, error);
            }
        });
    }];
}

/**
 * 获取通讯录信息
 */
- (void)fetchContacts:(RXGetAddressBookBlock)complete
{
    self.block = complete;
    
    CNContactStore *store = [[CNContactStore alloc] init];
    
    // 检查权限状态
    CNAuthorizationStatus status = [CNContactStore authorizationStatusForEntityType:CNEntityTypeContacts];
    if (status == CNAuthorizationStatusNotDetermined) {
        [self requestContactsAccessWithCompletion:^(BOOL granted, NSError *error) {
            if (granted) {
                // 排序耗时开启异步获取
                dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{
                    [self fetchContactsFromStore:store];
                });
            } else {
                NSLog(@"Access denied");
            }
        }];
    } else if (status == CNAuthorizationStatusAuthorized) {
        // 排序耗时开启异步获取
        dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{
            [self fetchContactsFromStore:store];
        });
    } else {
        NSLog(@"Access denied");
    }
}

// 从 CNContactStore 中获取联系人信息
- (void)fetchContactsFromStore:(CNContactStore *)store
{
    self.addressBookInfoList = [NSMutableArray array];
    
    NSError *error = nil;
    NSMutableArray *contacts = [NSMutableArray array];
    
    // 设置需要获取的联系人属性
    NSArray *keys = @[CNContactGivenNameKey, CNContactFamilyNameKey, CNContactPhoneNumbersKey, CNContactEmailAddressesKey];
    CNContactFetchRequest *request = [[CNContactFetchRequest alloc] initWithKeysToFetch:keys];
    
    // 获取联系人
    [store enumerateContactsWithFetchRequest:request error:&error usingBlock:^(CNContact * _Nonnull contact, BOOL * _Nonnull stop) {
        [contacts addObject:contact];
    }];
    
    if (error) {
        NSLog(@"Error fetching contacts: %@", error);
    } else {
        for (CNContact *contact in contacts) {
            NSMutableDictionary *addressBookInfo = [NSMutableDictionary dictionary];
            NSMutableArray *phoneArr = [NSMutableArray array];
            NSMutableArray *emailArr = [NSMutableArray array];
            
            NSString *identifier = [NSString stringWithFormat:@"%@", contact.identifier];
            [addressBookInfo setValue:identifier forKey:@"identifier"];
            
            NSString *fullName = [NSString stringWithFormat:@"%@%@", contact.familyName, contact.givenName];
            [addressBookInfo setValue:fullName forKey:@"name"];
            
            for (CNLabeledValue *phoneNumber in contact.phoneNumbers) {
                CNPhoneNumber *number = phoneNumber.value;
                [phoneArr addObject:number.stringValue];
            }
            if (phoneArr.count > 0) {
                [addressBookInfo setValue:phoneArr forKey:@"phones"];
            }
            
            for (CNLabeledValue *email in contact.emailAddresses) {
                [emailArr addObject:email.value];
            }
            if (emailArr.count > 0) {
                [addressBookInfo setValue:emailArr forKey:@"emails"];
            }
            
            NSString *hashString = [self hashForContact:contact];
            [addressBookInfo setValue:hashString forKey:@"hash"];
            
            [self.addressBookInfoList addObject:addressBookInfo];
        }
    }
    
    NSString *hashStr = [self hashForContacts:contacts];
    
    if (self.block) {
        self.block(self.addressBookInfoList, hashStr);
    }
}

/**
 * 总表生成 hash
 */
- (NSString *)hashForContacts:(NSArray<CNContact *> *)contacts {
    // Create a string that combines all relevant contact information
    NSMutableString *combinedString = [NSMutableString string];
    for (CNContact *contact in contacts) {
        [combinedString appendFormat:@"%@%@%@", contact.identifier, contact.givenName, contact.familyName];
        for (CNLabeledValue *phoneNumber in contact.phoneNumbers) {
            [combinedString appendString:[phoneNumber.value stringValue]];
        }
    }

    // Generate SHA256 hash
    const char *str = [combinedString UTF8String];
    unsigned char hash[CC_SHA256_DIGEST_LENGTH];
    CC_SHA256(str, (CC_LONG)strlen(str), hash);
    
    NSMutableString *hashString = [NSMutableString stringWithCapacity:CC_SHA256_DIGEST_LENGTH * 2];
    for (int i = 0; i < CC_SHA256_DIGEST_LENGTH; i++) {
        [hashString appendFormat:@"%02x", hash[i]];
    }
    
    return hashString;
}

/**
 * 单挑数据生成 hash
 */
- (NSString *)hashForContact:(CNContact *)contact {
    // Create a string that combines all relevant contact information
    NSMutableString *combinedString = [NSMutableString string];
    [combinedString appendFormat:@"%@%@%@", contact.identifier, contact.givenName, contact.familyName];
    for (CNLabeledValue *phoneNumber in contact.phoneNumbers) {
        [combinedString appendString:[phoneNumber.value stringValue]];
    }

    // Generate SHA256 hash
    const char *str = [combinedString UTF8String];
    unsigned char hash[CC_SHA256_DIGEST_LENGTH];
    CC_SHA256(str, (CC_LONG)strlen(str), hash);
    
    NSMutableString *hashString = [NSMutableString stringWithCapacity:CC_SHA256_DIGEST_LENGTH * 2];
    for (int i = 0; i < CC_SHA256_DIGEST_LENGTH; i++) {
        [hashString appendFormat:@"%02x", hash[i]];
    }
    
    return hashString;
}

@end
