//
//  RXOSLegalModel.h
//  RXUIKit-OS
//
//  Created by 陈汉 on 2023/6/16.
//

#import <Foundation/Foundation.h>
#import "RXOSCommonTool.h"

NS_ASSUME_NONNULL_BEGIN

@interface RXOSLegalData_antiAddiction_user : NSObject
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
@interface RXOSLegalData_antiAddiction : NSObject
//@property (nonatomic, copy) RXLegalData_antiAddiction_user *useLimit;
//@property (nonatomic, copy) RXLegalData_antiAddiction_pay *payLimits;
@end

// 实名认证
@interface RXOSLegalData_realNameAuth : NSObject
@property (nonatomic, copy) NSString *title;
@property (nonatomic, copy) NSString *content;
@end

// 未成年
@interface RXOSLegalData_minor : NSObject
@property (nonatomic, assign) NSInteger suitableAge;
@property (nonatomic, copy) NSString *suitableAgeIconUrl;
@end

// 权限list
@interface RXOSLegalData_permissionList : NSObject
@property (nonatomic, copy) NSString *key;
@property (nonatomic, copy) NSString *name;
@property (nonatomic, copy) NSString *content;
@property (nonatomic, assign) BOOL enable;
@end

// 权限
@interface RXOSLegalData_permission : NSObject
@property (nonatomic, copy) NSString *title;
@property (nonatomic, copy) NSString *content;
@property (nonatomic, strong) NSMutableArray *list;
@end

// 隐私
@interface RXOSLegalData_term : NSObject
@property (nonatomic, copy) NSString *title;
@property (nonatomic, copy) NSString *key;
@property (nonatomic, copy) NSString *content;
@end

@interface RXOSLegalData : NSObject
@property (nonatomic, strong) NSMutableArray *terms;
@property (nonatomic, strong) RXOSLegalData_permission *permissions;
@property (nonatomic, strong) RXOSLegalData_minor *minors;
@property (nonatomic, strong) RXOSLegalData_realNameAuth *realNameAuth;
@property (nonatomic, strong) RXOSLegalData_antiAddiction *antiAddiction;
@end

@interface RXOSLegalModel : NSObject
@property (nonatomic, strong) RXOSLegalData *data;
@end

NS_ASSUME_NONNULL_END
