//
//  RXLanguageService.m
//  RXLanguageKit
//
//  Created by 陈汉 on 2023/7/20.
//

#import "RXLanguageService.h"

@implementation RXLanguageService

/**
 * 国际化语言
 */
+ (NSString *)getTestWithLanguage:(NSString *)language
                             text:(NSString *)text
{
    @try {
        if (![text isKindOfClass:[NSString class]]) {
            return @"";
        }
        if (text.length == 0) {
            return text;
        }

        NSBundle *bundle = [NSBundle bundleForClass:[RXLanguageService class]];
        
        NSString *package = @"RXOSLocationEN";
        NSString *lowercaseLanguage = [language lowercaseString];
        if ([lowercaseLanguage isEqualToString:@"ja"]) { // 日语
            package = @"RXOSLocationJP";
        } else if ([lowercaseLanguage isEqualToString:@"id"]) { // 印尼语
            package = @"RXOSLocationID";
        } else if ([lowercaseLanguage isEqualToString:@"tc"]) { // 繁体中文
            package = @"RXOSLocationTC";
        } else if ([lowercaseLanguage isEqualToString:@"th"]) { // 泰文
            package = @"RXOSLocationTH";
        } else if ([lowercaseLanguage isEqualToString:@"tl"]) { // 菲律宾语
            package = @"RXOSLocationTL";
        } else if ([lowercaseLanguage isEqualToString:@"vi"]) { // 越南语
            package = @"RXOSLocationVI";
        } else if ([lowercaseLanguage isEqualToString:@"ar"]) { // 阿拉伯语
            package = @"RXOSLocationAR";
        }
        
        NSString *plistPath = [bundle pathForResource:package ofType:@"plist"];
        
        NSMutableDictionary *launguage = [[NSMutableDictionary alloc] initWithContentsOfFile:plistPath];
        
        NSString *osStr = text;
        
        NSString *value = [launguage objectForKey:text];
        
        if (value && value.length > 0) {
            osStr = value;
        }
        
        return osStr;
    } @catch (NSException *exception) {
        return text;
    } @finally {
        
    }
}

@end
