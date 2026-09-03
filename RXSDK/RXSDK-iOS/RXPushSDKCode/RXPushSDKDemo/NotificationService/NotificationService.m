//
//  NotificationService.m
//  NotificationService
//
//  Created by 陈汉 on 2025/5/12.
//

#import "NotificationService.h"
#import <RXPushSDK/RXPushSDK.h>
#import <RXSDK_Pure/RXSDK_Pure.h>

@interface NotificationService ()

@property (nonatomic, strong) void (^contentHandler)(UNNotificationContent *contentToDeliver);
@property (nonatomic, strong) UNMutableNotificationContent *bestAttemptContent;

@end

@implementation NotificationService

- (void)didReceiveNotificationRequest:(UNNotificationRequest *)request withContentHandler:(void (^)(UNNotificationContent * _Nonnull))contentHandler {
    self.contentHandler = contentHandler;
    self.bestAttemptContent = [request.content mutableCopy];
    
    // Modify the notification content here...
 
//    [[RXPushService sharedSDK] pushReceivedWithUserInfo1:self.bestAttemptContent.userInfo complete:^(NSString * _Nonnull msg) {
//        self.bestAttemptContent.title = [NSString stringWithFormat:@"%@111 -- %@", self.bestAttemptContent.title, msg];
//        self.contentHandler(self.bestAttemptContent);
//    }];
    
    [[RXPushService sharedSDK] pushReceivedWithUserInfo:self.bestAttemptContent.userInfo];
    
    self.contentHandler(self.bestAttemptContent);
}

- (void)serviceExtensionTimeWillExpire {
    // Called just before the extension will be terminated by the system.
    // Use this as an opportunity to deliver your "best attempt" at modified content, otherwise the original push payload will be used.
//    self.contentHandler(self.bestAttemptContent);
}

@end
