//
//  RXSTool.m
//  RXShareKit
//
//  Created by 陈汉 on 2022/5/25.
//

#import "RXSTool.h"

@interface RXSTool ()

@end

@implementation RXSTool

/**
 *十六进制转RGB
 */
+ (UIColor *)colorWithHexString:(NSString *)hexString
{
    NSString *cString = [[hexString stringByTrimmingCharactersInSet:[NSCharacterSet whitespaceAndNewlineCharacterSet]] uppercaseString];
    
    // String should be 6 or 8 characters
    if ([cString length] < 6) {
        return [UIColor clearColor];
    }
    // 判断前缀
    if ([cString hasPrefix:@"0X"])
        cString = [cString substringFromIndex:2];
    if ([cString hasPrefix:@"#"])
        cString = [cString substringFromIndex:1];
    if ([cString length] != 6)
        return [UIColor clearColor];
    // 从六位数值中找到RGB对应的位数并转换
    NSRange range;
    range.location = 0;
    range.length = 2;
    //R、G、B
    NSString *rString = [cString substringWithRange:range];
    range.location = 2;
    NSString *gString = [cString substringWithRange:range];
    range.location = 4;
    NSString *bString = [cString substringWithRange:range];
    // Scan values
    unsigned int r, g, b;
    [[NSScanner scannerWithString:rString] scanHexInt:&r];
    [[NSScanner scannerWithString:gString] scanHexInt:&g];
    [[NSScanner scannerWithString:bString] scanHexInt:&b];
    
    return [UIColor colorWithRed:((float) r / 255.0f) green:((float) g / 255.0f) blue:((float) b / 255.0f) alpha:1.0f];
}

/**
 * 获取图片
 */
+ (UIImage *)rxBundleImageNamed:(NSString *)imageName
{
    NSBundle *bundle = [NSBundle bundleForClass:[RXShareKitService class]];
    NSURL *url = [bundle URLForResource:@"RXShareKit" withExtension:@"bundle"];
    NSBundle *imageBundle = [NSBundle bundleWithURL:url];
    
    UIImage *image = [UIImage imageWithContentsOfFile:[imageBundle pathForResource:imageName ofType:@"png"]];
    
    return image;
}

/**
 * 获取按钮名称
 */
+ (NSString *)getShareTitle:(NSInteger)shareType
{
    NSArray *languageArr = [RXSTool getLanguageCountry];
    BOOL isOS = NO;
    if (languageArr.count > 1) {
        if (![languageArr[1] isEqualToString:@"CN"]) {
            isOS = YES;
        }
    }
    
    NSString *title = @"";
    switch (shareType) {
        case RXShareType_wfriend:
            title = isOS ? @"wechat" : @"微信好友";
            break;
        case RXShareType_wcricle:
            title = isOS ? @"friend" : @"朋友圈";
            break;
        case RXShareType_qq:
            title = isOS ? @"QQ" : @"QQ";
            break;
        case RXShareType_sina:
            title = isOS ? @"sina" : @"微博";
            break;
        default:
            break;
    }
    
    return title;
}

/**
 * 获取图片名称
 */
+ (NSString *)getShareImage:(NSInteger)shareType
{
    NSString *imageName = @"";
    switch (shareType) {
        case RXShareType_wfriend:
            imageName = @"rx_socialize_wechat";
            break;
        case RXShareType_wcricle:
            imageName = @"rx_socialize_wxcircle";
            break;
        case RXShareType_qq:
            imageName = @"rx_socialize_qq";
            break;
        case RXShareType_sina:
            imageName = @"rx_socialize_sina";
            break;
        default:
            break;
    }
    
    return imageName;
}

/**
 * 模型转换
 */
+ (RXShareType)fetchShareType:(NSInteger)shareTypeInt
{
    RXShareType shareType;
    switch (shareTypeInt) {
        case 0:
            shareType = RXShareType_wfriend;
            break;
        case 1:
            shareType = RXShareType_wcricle;
            break;
        case 2:
            shareType = RXShareType_qq;
            break;
        case 3:
            shareType = RXShareType_sina;
            break;
        default:
            break;
    }
    return shareType;
}

/**
 * 获取手机语言地区
 */
+ (NSMutableArray *)getLanguageCountry
{
    NSMutableArray *langArr = [NSMutableArray array];
    NSString *langStr = [[[NSUserDefaults standardUserDefaults] objectForKey:@"AppleLanguages"] firstObject];
    NSArray *compontArr = [langStr componentsSeparatedByString:@"-"];
    if (compontArr.count > 2) {
        NSString *language = [NSString stringWithFormat:@"%@-%@", compontArr[0], compontArr[1]];
        [langArr addObject:language];
        [langArr addObject:compontArr[2]];
    } else if (compontArr.count == 2) {
        [langArr addObjectsFromArray:compontArr];
    } else {
        compontArr = @[@"zh-Hans", @"CN"];
        [langArr addObjectsFromArray:compontArr];
    }
    return langArr;
}

@end
