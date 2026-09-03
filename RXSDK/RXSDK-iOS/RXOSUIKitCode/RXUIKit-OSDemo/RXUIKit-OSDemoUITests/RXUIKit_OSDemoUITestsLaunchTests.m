//
//  RXUIKit_OSDemoUITestsLaunchTests.m
//  RXUIKit-OSDemoUITests
//
//  Created by 陈汉 on 2023/6/15.
//

#import <XCTest/XCTest.h>

@interface RXUIKit_OSDemoUITestsLaunchTests : XCTestCase

@end

@implementation RXUIKit_OSDemoUITestsLaunchTests

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
