//
//  RXAppListSDKTests_RXAppListSDK_xcodeproj_RXAppListSDKDemoUITestsLaunchTests.m
//  RXAppListSDKTests RXAppListSDK.xcodeproj RXAppListSDKDemoUITests
//
//  Created by 陈汉 on 2024/3/28.
//

#import <XCTest/XCTest.h>

@interface RXAppListSDKTests_RXAppListSDK_xcodeproj_RXAppListSDKDemoUITestsLaunchTests : XCTestCase

@end

@implementation RXAppListSDKTests_RXAppListSDK_xcodeproj_RXAppListSDKDemoUITestsLaunchTests

+ (BOOL)runsForEachTargetApplicationUIConfiguration {
    return YES;
}

- (void)setUp {
    self.continueAfterFailure = NO;
}

- (void)testLaunch {
    XCUIApplication *app = [[XCUIApplication alloc] init];
    [app launch];

    // Insert steps here to perform after app launch but before taking a screenshot,
    // such as logging into a test account or navigating somewhere in the app

    XCTAttachment *attachment = [XCTAttachment attachmentWithScreenshot:XCUIScreen.mainScreen.screenshot];
    attachment.name = @"Launch Screen";
    attachment.lifetime = XCTAttachmentLifetimeKeepAlways;
    [self addAttachment:attachment];
}

@end
