//
//  RXIMSessionInterfaceModel.h
//  RXIMSdk
//
//  Created by weiyongjian on 2022/7/19.
//

#import <Foundation/Foundation.h>
#import "RXIMBaseInterfaceModel.h"
#import "RXIMSessionServer.h"

NS_ASSUME_NONNULL_BEGIN

@interface RXIMSessionInterfaceModel :RXIMBaseInterfaceModel

@property (nonatomic,strong) RXIMSessionServer *data;

@end

@interface RXIMSessionsInterfaceModel :RXIMBaseInterfaceModel

@property (nonatomic,strong) NSArray<RXIMSessionServer *> *data;

@end

NS_ASSUME_NONNULL_END
