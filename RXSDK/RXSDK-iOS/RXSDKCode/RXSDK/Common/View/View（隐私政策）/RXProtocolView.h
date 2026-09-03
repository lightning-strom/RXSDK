//
//  RXProtocolView.h
//  RXSDK
//
//  Created by 陈汉 on 2021/10/11.
//

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

typedef void(^ProtocolBlock)(BOOL isAgree);

@interface RXProtocolView : UIView

- (instancetype)initWithKey:(NSString *)key
                      block:(ProtocolBlock)block;

@end

NS_ASSUME_NONNULL_END
