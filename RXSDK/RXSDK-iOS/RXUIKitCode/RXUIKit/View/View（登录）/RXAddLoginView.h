//
//  RXAddLoginView.h
//  RXSDK
//
//  Created by 陈汉 on 2021/9/29.
//

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

typedef void(^RegistCallBack)(BOOL success, NSString *username, NSString *password);

@interface RXAddLoginView : UIView

- (instancetype)initWithIsSelect:(BOOL)isSelect
                          extDic:(NSMutableDictionary * __nullable)extDic
                        complete:(void(^)(BOOL success, NSString *username, NSString *password))complete;

- (void)hide;

@end

NS_ASSUME_NONNULL_END
