//
//  RXApiVC.m
//  RuiXueDemo
//
//  Created by 陈汉 on 2021/12/22.
//

#import "RXApiVC.h"
#import <RXSDK_pure/RXSDK_pure.h>
//#import <RXSDK/RXSDK.h>
//#import <RXSDK_OS/RXSDK_OS.h>
#import <objc/runtime.h>
#import "ViewController1.h"
#import "LoginModel.h"
//#import <YYModel/YYModel.h>
#import <QuickLook/QuickLook.h>
//#import <AdServices/AdServices.h>

#import <Contacts/Contacts.h>
#import <AddressBook/AddressBookDefines.h>
#import <AddressBook/ABRecord.h>

@interface RXApiVC ()

@end

@implementation RXApiVC

- (void)viewDidLoad {
    [super viewDidLoad];
    
    self.view.backgroundColor = [UIColor whiteColor];
    
    [self setUI];
    
    [self requestAuthorizationForAddressBook];
}

- (void)requestAuthorizationForAddressBook {
    
    if ([[UIDevice currentDevice].systemVersion floatValue]>=9.0){
    
        CNAuthorizationStatus authorizationStatus = [CNContactStore authorizationStatusForEntityType:CNEntityTypeContacts];
        if (authorizationStatus == CNAuthorizationStatusNotDetermined) {
            CNContactStore *contactStore = [[CNContactStore alloc] init];
            [contactStore requestAccessForEntityType:CNEntityTypeContacts completionHandler:^(BOOL granted, NSError * _Nullable error) {
                if (granted) {
                    [self getmyAddressbook];
                } else {
                    NSLog(@"授权失败, error=%@", error);
                }
            }];
        } else {
            [self getmyAddressbook];
        }
        
    }else
    {
//        [HTools showTextOnlyHud:@"请升级系统" delay:1.0];
    }
}

- (void)getmyAddressbook {
    CNAuthorizationStatus authorizationStatus = [CNContactStore authorizationStatusForEntityType:CNEntityTypeContacts];
    if (authorizationStatus == CNAuthorizationStatusAuthorized) {
        NSLog(@"没有授权...");
    }
    
//    self.myDict = [[NSMutableDictionary alloc]init];
    
    // 获取指定的字段,并不是要获取所有字段，需要指定具体的字段
    NSArray *keysToFetch = @[CNContactGivenNameKey, CNContactFamilyNameKey, CNContactPhoneNumbersKey];
    CNContactFetchRequest *fetchRequest = [[CNContactFetchRequest alloc] initWithKeysToFetch:keysToFetch];
    CNContactStore *contactStore = [[CNContactStore alloc] init];
    
    [contactStore enumerateContactsWithFetchRequest:fetchRequest error:nil usingBlock:^(CNContact * _Nonnull contact, BOOL * _Nonnull stop) {
        NSLog(@"-------------------------------------------------------");
        
        NSString *givenName = contact.givenName;
        NSString *familyName = contact.familyName;
        NSLog(@"givenName=%@, familyName=%@", givenName, familyName);
        
        NSString *nameStr = [NSString stringWithFormat:@"%@%@",contact.familyName,contact.givenName];
        
        NSArray *phoneNumbers = contact.phoneNumbers;
        
//        for (CNLabeledValue *labelValue in phoneNumbers) {
//            NSString *label = labelValue.label;
//            phoneNumber = labelValue.value;
//            
//            NSLog(@"label=%@, phone=%@", label, phoneNumber.stringValue);
//            
//            
//        }
        
//        [_myDict setObject:phoneNumber.stringValue forKey:nameStr];
        
        
        //    *stop = YES; // 停止循环，相当于break；
        
    }];
    
    
//    NSLog(@"mydict is ==== %@",_myDict);
    
}

- (void)setUI
{
    // 注册
    UIButton *btn1 = [[UIButton alloc] initWithFrame:CGRectMake(10, 100, 130, 30)];
    [btn1 setTitle:@"注册" forState:UIControlStateNormal];
    [btn1 setBackgroundColor:[UIColor redColor]];
    [btn1 addTarget:self action:@selector(btnAction1) forControlEvents:UIControlEventTouchUpInside];
    [self.view addSubview:btn1];
    
    // 实名认证
    UIButton *btn2 = [[UIButton alloc] initWithFrame:CGRectMake(150, 100, 130, 30)];
    [btn2 setTitle:@"实名认证" forState:UIControlStateNormal];
    [btn2 setBackgroundColor:[UIColor redColor]];
    [btn2 addTarget:self action:@selector(btnAction2) forControlEvents:UIControlEventTouchUpInside];
    [self.view addSubview:btn2];
    
    // Facebook登录
    UIButton *btn3 = [[UIButton alloc] initWithFrame:CGRectMake(10, 150, 130, 30)];
    [btn3 setTitle:@"fb登录" forState:UIControlStateNormal];
    [btn3 setBackgroundColor:[UIColor redColor]];
    [btn3 addTarget:self action:@selector(btnAction3) forControlEvents:UIControlEventTouchUpInside];
    [self.view addSubview:btn3];
    
    // google登录
    UIButton *btn4 = [[UIButton alloc] initWithFrame:CGRectMake(150, 150, 130, 30)];
    [btn4 setTitle:@"google登录" forState:UIControlStateNormal];
    [btn4 setBackgroundColor:[UIColor redColor]];
    [btn4 addTarget:self action:@selector(btnAction4) forControlEvents:UIControlEventTouchUpInside];
    [self.view addSubview:btn4];
}

- (void)btnAction4
{
//    [[RXGooleService sharedSDK] GLoginIn];
}

- (void)btnAction3
{
//    [[RXFacebookService sharedSDK] FBLoginWithPermissions:@[@"public_profile"]];
}

- (NSString *)imagePath
 {
     NSArray *pathcaches=NSSearchPathForDirectoriesInDomains(NSCachesDirectory, NSUserDomainMask, YES);
     NSString *cacheDirectory = [pathcaches objectAtIndex:0];
     return [cacheDirectory stringByAppendingString:@"1.jpg"];
}

- (void)btnAction2
{
//    [[RXApiService sharedSDK] approveWithRealName:@"陈汉" idCard:@"220581199403050975" complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
//
//    }];
    
    NSURL *fileUrl = [NSURL URLWithString:@"https://oss-anchor-v2.weile.com/share/link_contents/13.png"];
    
         NSString *imageUrl = @"https://oss-anchor-v2.weile.com/share/link_contents/13.png";
         NSURL *imageURL = [NSURL URLWithString:imageUrl];
         NSString *imagePath = [self imagePath];
    
         __block UIImage *image = [UIImage imageWithContentsOfFile:imagePath];
    
         if (image) {
             // 第二次启动App，缓存文件存在时，通过[UIImage imageWithContentsOfFile:]初始化
//             _imageView.image = image;
         } else {
             // 第一次启动APP，下载图片成功后，通过[UIImage imageWithData:]初始化
             dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{
                 NSData *data = [NSData dataWithContentsOfURL:imageURL];
                 if (data) {
                     dispatch_async(dispatch_get_main_queue(), ^{
                         [data writeToFile:imagePath atomically:YES];
                         image = [UIImage imageWithData:data];
                         NSLog(@"");
                     });
                 }
             });
         }
    //2-请求
//    NSMutableURLRequest *request=[NSMutableURLRequest requestWithURL:fileUrl];
//
//    AFHTTPSessionManager *mgr=[AFHTTPSessionManager manager];
//    NSURLSessionDownloadTask *task= [mgr downloadTaskWithRequest:request progress:nil destination:^NSURL * _Nonnull(NSURL * _Nonnull targetPath, NSURLResponse * _Nonnull response) {
//        NSURL *cacheURL= [[[NSFileManager defaultManager]URLsForDirectory:NSCachesDirectory inDomains:NSUserDomainMask]lastObject];
//        return [cacheURL URLByAppendingPathComponent:[response suggestedFilename]];
//    } completionHandler:^(NSURLResponse * _Nonnull response, NSURL * _Nullable filePath, NSError * _Nullable error) {
//
//        UIImage *img = [UIImage imageWithContentsOfFile:@"/var/mobile/Containers/Data/Application/B70E8E84-0634-4055-814F-6E3915F321D2/Library/Caches/13.png"];
//        NSLog(@"File downloaded to: %@", filePath);
//
//    }];
//    [task resume];
}

- (void)btnAction1
{
//    [[RXApiService sharedSDK] registWithExtDic:nil
//                                      username:@"18698646213"
//                                      password:@"111111a"
//                                   captchaCode:@""
//                                      nickname:nil
//                                     avatarUrl:nil
//                                      birthday:nil
//                                           sex:nil
//                                     refereeid:nil
//                                    registType:RegistTypeAccount
//                                  migrate_args:nil
//                                      complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
//
//    }];
    
//    dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(5 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
//        for (int i = 0; i < 50; i++) {
//            NSString *account = [NSString stringWithFormat:@"jxtest%ld", i];
//            NSLog(@"account = %@", account);
//            
//            [[RXApiService sharedSDK] registWithUsername:account
//                                                password:@"111111aA!"
//                                             captchaCode:nil
//                                                     ext:nil
//                                                complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
//                    
//            }];
//        }
//    });
    
    NSMutableDictionary *extDic = [NSMutableDictionary dictionary];
    NSMutableDictionary *customExt = [NSMutableDictionary dictionary];
    [customExt setValue:@{@"ios" : @"1"} forKey:@"bigdata_ext"];
    [extDic setValue:customExt forKey:@"custom_ext"];
    
    [[RXApiService sharedSDK] registWithUsername:@"114test1"
                                        password:@"Rx@123456"
                                     captchaCode:@""
                                             ext:extDic
                                        complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
        NSLog(@"");
    }];
}

@end
