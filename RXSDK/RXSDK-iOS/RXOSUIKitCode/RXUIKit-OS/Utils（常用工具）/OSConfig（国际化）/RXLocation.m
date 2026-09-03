//
//  RXLocation.m
//  RXUIKit-OS
//
//  Created by 陈汉 on 2023/6/16.
//

#import "RXLocation.h"
#import "RXOSUIKitService.h"
#import "RXOSCommonTool.h"
#import <RXLanguageKit/RXLanguageKit.h>

@implementation RXLocation

+ (NSString *)osLaunguage:(NSString *)text
{
    if (![text isKindOfClass:[NSString class]]) {
        return @"";
    }
    if (text.length == 0) {
        return text;
    }

    RXOSUILoginConfig *config = [RXOSUserUtility sharedManager].loginConfig;
    
    NSString *setLanguage = [[NSUserDefaults standardUserDefaults] valueForKey:keyUser_setLanguage];
    if (setLanguage && setLanguage.length > 0) {
        config.language_default = setLanguage;
    }
    
//    NSBundle *bundle = [NSBundle bundleForClass:[RXOSUIKitService class]];
    
//    NSString *package = @"RXOSLocationEN";
//    if ([[config.language_default lowercaseString] isEqualToString:@"ja"]) {
//        package = @"RXOSLocationJP";
//    }
//
//    NSString *plistPath = [bundle pathForResource:package ofType:@"plist"];
//
//    NSMutableDictionary *launguage = [[NSMutableDictionary alloc] initWithContentsOfFile:plistPath];
    
    NSString *osStr = text;
    BOOL isOS = [[NSUserDefaults standardUserDefaults] boolForKey:keyUser_isOS];
    if (isOS) {
//        NSString *value = [launguage valueForKey:text];
        
        if ([[config.language_default lowercaseString] isEqualToString:@"zh"] || [[config.language_default lowercaseString] isEqualToString:@"zh-cn"]) {
            
        } else {
            osStr = [RXLanguageService getTestWithLanguage:[config.language_default lowercaseString] text:text];
//            if (value && value.length > 0) {
//                osStr = [launguage valueForKey:text];
//            }
        }
    }
    
    return osStr;
}

@end
