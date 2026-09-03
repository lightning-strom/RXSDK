//
//  RXLanguageService.h
//  RXLanguageKit
//
//  Created by 陈汉 on 2023/7/20.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface RXLanguageService : NSObject

/**
 * 国际化语言
 */
+ (NSString *)getTestWithLanguage:(NSString *)language
                             text:(NSString *)text;


@end

NS_ASSUME_NONNULL_END
