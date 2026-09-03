//
//  RXPrivacyView.h
//  RXSDK
//
//  Created by 陈汉 on 2021/9/29.
//

#import <UIKit/UIKit.h>
#import <WebKit/WebKit.h>

NS_ASSUME_NONNULL_BEGIN

@interface RXPrivacyView : UIView

- (instancetype)initWithKey:(NSString *)key
                  legalData:(NSDictionary *)legalData;

//@property (nonatomic, strong) WKWebView *webView;

@end

NS_ASSUME_NONNULL_END
