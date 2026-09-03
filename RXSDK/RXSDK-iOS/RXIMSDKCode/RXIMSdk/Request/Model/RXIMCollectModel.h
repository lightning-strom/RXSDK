//
//  RXIMCollectModel.h
//  RXIMSdk
//
//  Created by weiyongjian on 2022/12/13.
//

#import <Foundation/Foundation.h>
#import "RXIMBaseInterfaceModel.h"
#import "RximmessageP.pbobjc.h"

NS_ASSUME_NONNULL_BEGIN

@interface RXIMCollectData : NSObject

@property(nonatomic,strong) NSString *cp_id;

@property(nonatomic,strong) NSString *user_id;

@property(nonatomic,strong) NSArray *msgids;

@end

@interface RXIMCollectModel : RXIMBaseInterfaceModel

@property (nonatomic, strong) RXIMCollectData *data; // 收藏列表返回的数据

@end

@interface RXIMCollectMsgData : NSObject

@property(nonatomic,strong) NSString *cp_id;

@property(nonatomic,strong) NSString *user_id;

@property(nonatomic,strong) NSArray *msgs;

@end

@interface RXIMCollectMsgModel : RXIMBaseInterfaceModel

@property (nonatomic, strong) RXIMCollectMsgData *data; // 收藏列表返回的数据

@end


NS_ASSUME_NONNULL_END
