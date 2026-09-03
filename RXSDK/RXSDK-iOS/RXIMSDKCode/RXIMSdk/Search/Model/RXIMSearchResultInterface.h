//
//  RXIMSearchResultInterface.h
//  RXIMSdk-business
//
//  Created by weiyongjian on 2023/1/18.
//

#import "RXIMBaseInterfaceModel.h"
#import "RXIMSearchResultModel.h"

NS_ASSUME_NONNULL_BEGIN

@interface RXIMSearchResultInterface : RXIMBaseInterfaceModel

@property (nonatomic, strong) RXIMSearchResultData *data;

@end

NS_ASSUME_NONNULL_END
