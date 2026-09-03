//
//  RXGPMSDKDemoUITestsLaunchTests.m
//  RXGPMSDKDemoUITests
//
//  Created by root11 on 2024/8/27.
//

#import <XCTest/XCTest.h>

@interface RXGPMSDKDemoUITestsLaunchTests : XCTestCase

@end

@implementation RXGPMSDKDemoUITestsLaunchTests

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
