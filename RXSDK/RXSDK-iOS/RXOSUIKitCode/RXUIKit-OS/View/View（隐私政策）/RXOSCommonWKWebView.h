//
//  RXOSCommonWKWebView.h
//  RXUIKit
//
//  Created by 陈汉 on 2023/3/3.
//

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

@interface RXOSCommonWKWebView : UIView

- (instancetype)initWithUrl:(NSString *)url
                      title:(NSString *)title
                    content:(NSString *)content;

@end

NS_ASSUME_NONNULL_END
