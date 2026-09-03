//
//  RXIMMsgConvTipsContent.h
//  RXIMSdk
//
//  Created by weiyongjian on 2022/6/29.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface RXIMMsgConvTipsContent : NSObject

/** 提示内容 */
@property (nonatomic, copy) NSString *text;
/** 当type==1时，text中提及的用户Id列表 */
@property (nonatomic, copy) NSArray *userids;
/** 提示内容类型，0：普通文本，直接提示；1：标识文本中有标记参数，需要进行替换 */
@property (nonatomic, assign) NSInteger type;

@end

NS_ASSUME_NONNULL_END
