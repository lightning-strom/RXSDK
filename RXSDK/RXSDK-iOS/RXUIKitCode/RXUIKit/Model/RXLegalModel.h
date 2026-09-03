//
//  RXLegalModel.h
//  RXSDK
//
//  Created by 陈汉 on 2021/9/29.
//

#import <Foundation/Foundation.h>
#import "RXUICommonTool.h"

NS_ASSUME_NONNULL_BEGIN

@interface RXLegalData_antiAddiction_user : NSObject
@property (nonatomic, copy) NSString *timeFrom;
@property (nonatomic, copy) NSString *timeTo;
@property (nonatomic, assign) NSInteger phyd;
@property (nonatomic, assign) NSInteger phcj;
@property (nonatomic, assign) NSInteger phqm;
@property (nonatomic, assign) NSInteger phld;
@property (nonatomic, assign) NSInteger phdw;
@property (nonatomic, assign) NSInteger phzq;
@property (nonatomic, assign) NSInteger phgq;
@end

// 未成年限制
@interface RXLegalData_antiAddiction : NSObject
//@property (nonatomic, copy) RXLegalData_antiAddiction_user *useLimit;
//@property (nonatomic, copy) RXLegalData_antiAddiction_pay *payLimits;
@end

// 实名认证
@interface RXLegalData_realNameAuth : NSObject
@property (nonatomic, copy) NSString *title;
@property (nonatomic, copy) NSString *content;
@end

// 未成年
@interface RXLegalData_minor : NSObject
@property (nonatomic, assign) NSInteger suitableAge;
@property (nonatomic, copy) NSString *suitableAgeIconUrl;
@end

// 权限list
@interface RXLegalData_permissionList : NSObject
@property (nonatomic, copy) NSString *key;
@property (nonatomic, copy) NSString *name;
@property (nonatomic, copy) NSString *content;
@property (nonatomic, assign) BOOL enable;
@end

// 权限
@interface RXLegalData_permission : NSObject
@property (nonatomic, copy) NSString *title;
@property (nonatomic, copy) NSString *content;
@property (nonatomic, strong) NSMutableArray *list;
@end

// 隐私
@interface RXLegalData_term : NSObject
@property (nonatomic, copy) NSString *title;
@property (nonatomic, copy) NSString *key;
@property (nonatomic, copy) NSString *content;
@end

@interface RXLegalData : NSObject
@property (nonatomic, strong) NSMutableArray *terms;
@property (nonatomic, strong) RXLegalData_permission *permissions;
@property (nonatomic, strong) RXLegalData_minor *minors;
@property (nonatomic, strong) RXLegalData_realNameAuth *realNameAuth;
@property (nonatomic, strong) RXLegalData_antiAddiction *antiAddiction;
@end

@interface RXLegalModel : NSObject
@property (nonatomic, strong) RXLegalData *data;
@end

NS_ASSUME_NONNULL_END
