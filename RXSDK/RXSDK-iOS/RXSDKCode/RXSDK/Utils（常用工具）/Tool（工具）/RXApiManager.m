//
//  RXApiManager.m
//  RXSDK
//
//  Created by 陈汉 on 2021/9/29.
//

#import "RXApiManager.h"
#import "RXConfig.h"
#import "RXCommonHeader.h"
#import "DeviceKey.h"

@implementation RXApiManager

/**
 * 获取法务信息
 */
+ (RX_CommonRequest *)getCommonConfig
{
    NSString *urlStr = [NSString stringWithFormat:@"%@?channel_id=%@", [RXCommonApiManager getCommonConfigUrl], [RXUserUtility sharedManager].channelId];
    
    RX_CommonRequest *request = [[RX_CommonRequest alloc] initWithApiName:urlStr andParams:nil requsetMethod:RequestMethod_Get];
    request.baseUrl = [RXConfig sharedManager].apiDomain;
    request.headParams = [RX_CommonNetworkExcuteManager headParams];
    return request;
}

/**
 * 登录
 * @param extDic 扩展字段，可传nil
 * @param username 非账号登录传空，账号注册为账号，手机注册为手机号，邮箱注册为邮箱
 * @param password 非账号登录传空
 * @param migrate_args 任意合法的 json 类型, 比如 string, nujber，账号迁移用的参数, 调用 CP account-query 及 account-queryandbind 接口时透传给 CP
 * @param loginType 登录类型
 * @param sign_fields 指定对登录成功后返回的特定字段, 使用 CPKEY 计算签名. CP 服务器可重新计算签名并与登录返回的签名比对, 作为对瑞雪登录数据的校验. 支持的字段包括: nickname, avatar, openid, region, sex, age, 计算签名的逻辑会对指定字段进行排序, 此处传参与顺序无关。类型为字符串数组 @[@"nickname",@"avatar"]  非必须
 */
+ (RX_CommonRequest *)loginWithExtDic:(NSMutableDictionary * __nullable)extDic
                             username:(NSString *)username
                             password:(NSString *)password
                          sign_fields:(NSArray * _Nullable)sign_fields
                            loginType:(LoginType)loginType
                         migrate_args:(id _Nullable)migrate_args
{
    NSMutableDictionary *dic = [NSMutableDictionary dictionary];
    NSMutableDictionary *adDic = [RXUserUtility sharedManager].pasteboardDic;
    NSMutableDictionary *extDic1 = [NSMutableDictionary dictionaryWithDictionary:extDic];
    
    switch (loginType) {
        case LoginTypeAuth:
        {
            [dic setValue:@"quickphone" forKey:@"method"];
            [RXUserUtility saveMethod:@"quickphone"];
            break;
        }
        case LoginTypeEmail:
        {
            [dic setValue:@"email" forKey:@"method"];
            [RXUserUtility saveMethod:@"email"];
            break;
        }
        case LoginTypeApple:
        {
            [dic setValue:@"apple" forKey:@"method"];
            [RXUserUtility saveMethod:@"apple"];
            break;
        }
        case LoginTypeW:
        {
            [dic setValue:@"wechat" forKey:@"method"];
            [RXUserUtility saveMethod:@"wechat"];
            break;
        }
        case LoginTypeVisitor:
        {
            [dic setValue:@"guest" forKey:@"method"];
            [RXUserUtility saveMethod:@"guest"];
            break;
        }
        case LoginTypeAccount:
        {
            [dic setValue:@"username" forKey:@"method"];
            [dic setValue:username forKey:@"username"];
            [dic setValue:[RXCommonTool md532BitUpperWithStr:password] forKey:@"password"];
            [RXUserUtility saveMethod:@"username"];
            break;
        }
        case LoginTypeVirtual:
        {
            [dic setValue:@"virtual" forKey:@"method"];
            [RXUserUtility saveMethod:@"virtual"];
            break;
        }
        case LoginTypeFacebook:
        {
            [dic setValue:@"facebook" forKey:@"method"];
            [RXUserUtility saveMethod:@"facebook"];
            break;
        }
        case LoginTypeGoogle:
        {
            [dic setValue:@"google" forKey:@"method"];
            [RXUserUtility saveMethod:@"google"];
            break;
        }
        case LoginTypeVK:
        {
            [dic setValue:@"vk" forKey:@"method"];
            [RXUserUtility saveMethod:@"vk"];
            break;
        }
        default:
        {
            [dic setValue:[RXUserUtility sharedManager].method forKey:@"method"];
        }
            break;
    }
    
    if (![RXUserUtility sharedManager].isFirstLogin) {
        NSMutableDictionary *deviceDic = [NSMutableDictionary dictionary];
        [deviceDic setValue:[RXCommonTool getIDFA] forKey:@"idfa"];
        [dic setValue:deviceDic forKey:@"device"];
        [dic setValue:[RXUserUtility sharedManager].distinct_id forKey:@"distinct_id"];
    }
    
    [dic setValue:extDic1 forKey:@"ext"];
    if (adDic && adDic.allKeys.count > 0) {
        [dic setValue:adDic forKey:@"user_source"];
    }
    [dic setValue:@([[RXCommonTool getNowTimeTimestamp] integerValue]) forKey:@"ts"];
    [dic setValue:migrate_args forKey:@"migrate_args"];
    [dic setValue:sign_fields forKey:@"sign_fields"];
    
    RX_CommonRequest *request = [[RX_CommonRequest alloc] initWithApiName:[RXCommonApiManager getLoginUrl] andParams:dic requsetMethod:RequestMethod_Post];
    request.baseUrl = [RXConfig sharedManager].apiDomain;
    request.headParams = [RX_CommonNetworkExcuteManager headParams];
    return request;
}

/**
 * 二次登录
 * @param loginOpenId 登录返回的login_openid
 * @param sign_fields 指定对登录成功后返回的特定字段, 使用 CPKEY 计算签名. CP 服务器可重新计算签名并与登录返回的签名比对, 作为对瑞雪登录数据的校验. 支持的字段包括: nickname, avatar, openid, region, sex, age, 计算签名的逻辑会对指定字段进行排序, 此处传参与顺序无关。类型为字符串数组 @[@"nickname",@"avatar"]  非必须
 * @param extDic 扩展字段，可传nil
 */
+ (RX_CommonRequest *)loginWithLoginOpenId:(NSString *)loginOpenId
                               sign_fields:(NSArray * _Nullable)sign_fields
                                    extDic:(NSMutableDictionary * __nullable)extDic
{
    NSMutableDictionary *dic = [NSMutableDictionary dictionary];
    NSMutableDictionary *extDic1 = [NSMutableDictionary dictionaryWithDictionary:extDic];
    NSMutableDictionary *adDic = [RXUserUtility sharedManager].pasteboardDic;
    NSMutableDictionary *deviceDic = [NSMutableDictionary dictionary];
    
    [dic setValue:loginOpenId forKey:@"login_openid"];
    [dic setValue:[RXUserUtility sharedManager].method forKey:@"method"];
    [deviceDic setValue:[RXCommonTool getIDFA] forKey:@"idfa"];
    [dic setValue:deviceDic forKey:@"device"];
    [dic setValue:adDic forKey:@"user_source"];
    [dic setValue:extDic1 forKey:@"ext"];
    [dic setValue:sign_fields forKey:@"sign_fields"];
    
    RX_CommonRequest *request = [[RX_CommonRequest alloc] initWithApiName:[RXCommonApiManager getQuickLoginUrl] andParams:dic requsetMethod:RequestMethod_Post];
    request.baseUrl = [RXConfig sharedManager].apiDomain;
    request.headParams = [RX_CommonNetworkExcuteManager headParams];
    return request;
}

/**
 * 注册
 * @param extDic 扩展字段  非必须
 * @param username 账号注册为账号，手机注册为手机号，邮箱注册为邮箱  必须
 * @param password 密码  必须
 * @param captchaCode 验证码  必须
 * @param nickname 昵称  非必须
 * @param avatarUrl 头像地址  非必须
 * @param birthday 出生日期（例2000-01-01）  非必须
 * @param sex 性别,1:男,0:女  非必须
 * @param refereeid 推荐人id  非必须
 * @param migrate_args 任意合法的 json 类型, 比如 string, nujber，账号迁移用的参数, 调用 CP account-query 及 account-queryandbind 接口时透传给 CP
 * @param registType 注册类型  必须
 */
+ (RX_CommonRequest *)registWithExtDic:(NSMutableDictionary * _Nullable)extDic
                              username:(NSString *)username
                              password:(NSString *)password
                           captchaCode:(NSString *)captchaCode
                              nickname:(NSString * _Nullable)nickname
                             avatarUrl:(NSString * _Nullable)avatarUrl
                              birthday:(NSString * _Nullable)birthday
                                   sex:(NSString * _Nullable)sex
                             refereeid:(NSString * _Nullable)refereeid
                            registType:(RegistType)registType
                          migrate_args:(id _Nullable)migrate_args
{
    NSMutableDictionary *dic = [NSMutableDictionary dictionary];
    NSMutableDictionary *extDic1 = [NSMutableDictionary dictionaryWithDictionary:extDic];
    NSMutableDictionary *adDic = [RXUserUtility sharedManager].pasteboardDic;
    
//    switch (registType) {
//        case RegistTypeAccount:
//            [dic setValue:@(1) forKey:@"type"];
//            break;
//        case RegistTypePhone:
//            [dic setValue:@(2) forKey:@"type"];
//            break;
//        case RegistTypeEmail:
//            [dic setValue:@(3) forKey:@"type"];
//            break;
//        default:
//            break;
//    }
    
    if (![RXUserUtility sharedManager].isFirstLogin) {
        NSMutableDictionary *deviceDic = [NSMutableDictionary dictionary];
        [deviceDic setValue:[RXCommonTool getIDFA] forKey:@"idfa"];
        [dic setValue:deviceDic forKey:@"device"];
        [dic setValue:[RXUserUtility sharedManager].distinct_id forKey:@"distinct_id"];
    }
    [dic setValue:extDic1 forKey:@"ext"];
    if (adDic && adDic.allKeys.count > 0) {
        [dic setValue:adDic forKey:@"user_source"];
    }
    [dic setValue:username forKey:@"username"];
    [dic setValue:[RXCommonTool md532BitUpperWithStr:password] forKey:@"password"];
    [dic setValue:captchaCode forKey:@"captcha_code"];
    [dic setValue:nickname forKey:@"nickname"];
    [dic setValue:avatarUrl forKey:@"avatarUrl"];
    [dic setValue:birthday forKey:@"birthday"];
    if (sex && sex.length > 0) {
        [dic setValue:@([sex integerValue]) forKey:@"sex"];
    }
    [dic setValue:refereeid forKey:@"refereeid"];
    [dic setValue:migrate_args forKey:@"migrate_args"];
    
    RX_CommonRequest *request = [[RX_CommonRequest alloc] initWithApiName:[RXCommonApiManager getRegistUrl] andParams:dic requsetMethod:RequestMethod_Post];
    request.baseUrl = [RXConfig sharedManager].apiDomain;
    request.headParams = [RX_CommonNetworkExcuteManager headParams];
    return request;
}

/**
 * 刷新token
 */
+ (RX_CommonRequest *)refreshTokenRequest
{
    RX_CommonRequest *request = [[RX_CommonRequest alloc] initWithApiName:[RXCommonApiManager getRefreshTokenUrl] andParams:nil requsetMethod:RequestMethod_Get];
    request.baseUrl = [RXConfig sharedManager].apiDomain;
    
    NSMutableDictionary *header = [RX_CommonNetworkExcuteManager headParams];
    [header setValue:[RXUserUtility sharedManager].refresh forKey:@"ruixue-refreshtoken"];
    request.headParams = header;
    
    return request;
}

/**
 * 绑定邮箱
 * @param captchaCode 验证码
 * @param password 密码
 * @param email 邮箱
 * @param migrate_args 任意合法的 json 类型, 比如 string, nujber，账号迁移用的参数, 调用 CP account-query 及 account-queryandbind 接口时透传给 CP
 */
+ (RX_CommonRequest *)bindingEmailWithCaptchaCode:(NSString *)captchaCode
                                        password:(NSString *)password
                                           email:(NSString *)email
                                     migrate_args:(id _Nullable)migrate_args
{
    NSMutableDictionary *dic = [NSMutableDictionary dictionary];
    [dic setValue:captchaCode forKey:@"captcha_code"];
    if (password && password.length > 0) {
        [dic setValue:[RXCommonTool md532BitUpperWithStr:password] forKey:@"password"];
    }
    [dic setValue:email forKey:@"email"];
    [dic setValue:migrate_args forKey:@"migrate_args"];
    
    RX_CommonRequest *request = [[RX_CommonRequest alloc] initWithApiName:[RXCommonApiManager getBindingEmailUrl] andParams:dic requsetMethod:RequestMethod_Post];
    request.baseUrl = [RXConfig sharedManager].apiDomain;
    request.headParams = [RX_CommonNetworkExcuteManager headParams];
    
    return request;
}

/**
 * 解绑邮箱
 * @param captchaCode 验证码
 * @param email 邮箱
 */
+ (RX_CommonRequest *)reliveBindingEmailWithCaptchaCode:(NSString *)captchaCode
                                                 email:(NSString *)email
{
    NSMutableDictionary *dic = [NSMutableDictionary dictionary];
    [dic setValue:captchaCode forKey:@"captchaCode"];
    [dic setValue:email forKey:@"email"];
    
    RX_CommonRequest *request = [[RX_CommonRequest alloc] initWithApiName:[RXCommonApiManager getReliveBindingEmailUrl] andParams:dic requsetMethod:RequestMethod_Post];
    request.baseUrl = [RXConfig sharedManager].apiDomain;
    request.headParams = [RX_CommonNetworkExcuteManager headParams];
    
    return request;
}

/**
 * 绑定手机
 * @param captchaCode 验证码
 * @param password 密码
 * @param phone 手机号
 * @param migrate_args 任意合法的 json 类型, 比如 string, nujber，账号迁移用的参数, 调用 CP account-query 及 account-queryandbind 接口时透传给 CP
 */
+ (RX_CommonRequest *)bindingPhoneWithCaptchaCode:(NSString *)captchaCode
                                         password:(NSString *)password
                                            phone:(NSString *)phone
                                     migrate_args:(id _Nullable)migrate_args
{
    NSMutableDictionary *dic = [NSMutableDictionary dictionary];
    [dic setValue:captchaCode forKey:@"captcha_code"];
    if (password && password.length > 0) {
        [dic setValue:[RXCommonTool md532BitUpperWithStr:password] forKey:@"password"];
    }
    [dic setValue:phone forKey:@"phone"];
    [dic setValue:migrate_args forKey:@"migrate_args"];
    
    RX_CommonRequest *request = [[RX_CommonRequest alloc] initWithApiName:[RXCommonApiManager getBindingPhoneUrl] andParams:dic requsetMethod:RequestMethod_Post];
    request.baseUrl = [RXConfig sharedManager].apiDomain;
    request.headParams = [RX_CommonNetworkExcuteManager headParams];
    
    return request;
}

/**
 * 解绑手机
 * @param captchaCode 验证码
 * @param phone 手机号
 */
+ (RX_CommonRequest *)reliveBindingPhoneWithCaptchaCode:(NSString *)captchaCode
                                                 phone:(NSString *)phone
{
    NSMutableDictionary *dic = [NSMutableDictionary dictionary];
    [dic setValue:captchaCode forKey:@"captchaCode"];
    [dic setValue:phone forKey:@"phone"];
    
    RX_CommonRequest *request = [[RX_CommonRequest alloc] initWithApiName:[RXCommonApiManager getReliveBindingPhoneUrl] andParams:dic requsetMethod:RequestMethod_Post];
    request.baseUrl = [RXConfig sharedManager].apiDomain;
    request.headParams = [RX_CommonNetworkExcuteManager headParams];
    
    return request;
}

/**
 * 获取验证码
 * @param type 验证码类型
 * @param target 发送的目标（手机或邮箱）
 * @param purpose 用途
 */
+ (RX_CommonRequest *)getCaptchaCodeWithType:(CaptchaType)type
                                     target:(NSString *)target
                                    purpose:(NSString *)purpose
{
    NSMutableDictionary *dic = [NSMutableDictionary dictionary];
    switch (type) {
        case CaptchaType_phone:
            [dic setValue:target forKey:@"phone"];
            break;
        case CaptchaType_email:
            [dic setValue:target forKey:@"email"];
            break;
        default:
            break;
    }
    [dic setValue:purpose forKey:@"purpose"];
    
    RX_CommonRequest *request = [[RX_CommonRequest alloc] initWithApiName:[RXCommonApiManager getCaptchaUrl] andParams:dic requsetMethod:RequestMethod_Post];
    request.baseUrl = [RXConfig sharedManager].apiDomain;
    request.headParams = [RX_CommonNetworkExcuteManager headParams];
    
    return request;
}

/**
 * 实名认证
 * @param realName 真实姓名
 * @param idCard 身份证
 */
+ (RX_CommonRequest *)approveWithRealName:(NSString *)realName
                                  idCard:(NSString *)idCard
{
    NSMutableDictionary *dic = [NSMutableDictionary dictionary];
    [dic setValue:realName forKey:@"realname"];
    [dic setValue:idCard forKey:@"idcard"];
    
    NSString *url = [NSString stringWithFormat:@"%@?openid=%@", [RXCommonApiManager getApproveUrl], [RXUserUtility sharedManager].openId];
    
    RX_CommonRequest *request = [[RX_CommonRequest alloc] initWithApiName:url andParams:dic requsetMethod:RequestMethod_Post];
    request.baseUrl = [RXConfig sharedManager].apiDomain;
    request.headParams = [RX_CommonNetworkExcuteManager headParams];
    
    return request;
}

/**
 * 获取用户信息
 */
+ (RX_CommonRequest *)getUserInfo
{
    NSMutableDictionary *dic = [NSMutableDictionary dictionary];
    [dic setValue:[RXUserUtility sharedManager].method forKey:@"method"];
    [dic setValue:[RXUserUtility sharedManager].openId forKey:@"openid"];
    
    RX_CommonRequest *request = [[RX_CommonRequest alloc] initWithApiName:[RXCommonApiManager getUserInfoUrl] andParams:dic requsetMethod:RequestMethod_Post];
    request.baseUrl = [RXConfig sharedManager].apiDomain;
    request.headParams = [RX_CommonNetworkExcuteManager headParams];
    
    return request;
}

/**
 * 修改用户信息
 * @param avatarUrl 头像url 非必传
 * @param nickname 用户昵称 非必传
 * @param sex 性别 1男 0女 非必传
 * @param w_avatarurl 微信原始头像 非必传
 */
+ (RX_CommonRequest *)updateUserInfoWithAvatarUrl:(NSString *)avatarUrl
                                         nickname:(NSString *)nickname
                                              sex:(NSString *)sex
                                      w_avatarurl:(NSString *)w_avatarurl
{
    NSMutableDictionary *dic = [NSMutableDictionary dictionary];
    [dic setValue:avatarUrl forKey:@"avatarUrl"];
    [dic setValue:nickname forKey:@"nickname"];
    [dic setValue:@([sex integerValue]) forKey:@"sex"];
    [dic setValue:w_avatarurl forKey:@"wechat_avatarurl"];
    
    RX_CommonRequest *request = [[RX_CommonRequest alloc] initWithApiName:[RXCommonApiManager getUpdateUserInfoUrl] andParams:dic requsetMethod:RequestMethod_Post];
    request.baseUrl = [RXConfig sharedManager].apiDomain;
    request.headParams = [RX_CommonNetworkExcuteManager headParams];
    
    return request;
}

/**
 * 修改密码
 * @param oldPwd 旧密码
 * @param newPwd 新密码
 */
+ (RX_CommonRequest *)updatePasswordWithOldPwd:(NSString *)oldPwd
                                       newPwd:(NSString *)newPwd
{
    NSMutableDictionary *dic = [NSMutableDictionary dictionary];
    [dic setValue:[RXCommonTool md532BitUpperWithStr:newPwd] forKey:@"new_password"];
    [dic setValue:[RXCommonTool md532BitUpperWithStr:oldPwd] forKey:@"old_password"];
    
    RX_CommonRequest *request = [[RX_CommonRequest alloc] initWithApiName:[RXCommonApiManager getUpdatePasswordUrl] andParams:dic requsetMethod:RequestMethod_Post];
    request.baseUrl = [RXConfig sharedManager].apiDomain;
    request.headParams = [RX_CommonNetworkExcuteManager headParams];
    
    return request;
}

/**
 * 重置密码
 * @param username 用户名
 * @param password 密码
 * @param captchaCode 验证码
 * @param migrate_args 任意合法的 json 类型, 比如 string, nujber，账号迁移用的参数, 调用 CP account-query 及 account-queryandbind 接口时透传给 CP
 */
+ (RX_CommonRequest *)resetPasswordWithUsername:(NSString *)username
                                      password:(NSString *)password
                                   captchaCode:(NSString *)captchaCode
                                   migrate_args:(id _Nullable)migrate_args;
{
    NSMutableDictionary *dic = [NSMutableDictionary dictionary];
    [dic setValue:username forKey:@"username"];
    [dic setValue:[RXCommonTool md532BitUpperWithStr:password] forKey:@"password"];
    [dic setValue:captchaCode forKey:@"captcha_code"];
    [dic setValue:migrate_args forKey:@"migrate_args"];
    
    RX_CommonRequest *request = [[RX_CommonRequest alloc] initWithApiName:[RXCommonApiManager getResetPasswordUrl] andParams:dic requsetMethod:RequestMethod_Post];
    request.baseUrl = [RXConfig sharedManager].apiDomain;
    request.headParams = [RX_CommonNetworkExcuteManager headParams];
    
    return request;
}

/**
 * 上报位置信息
 * @param lon 经度
 * @param lat 纬度
 * @param types 用户类型定义
 */
+ (RX_CommonRequest *)reportLocationWithLon:(double)lon
                                       lat:(double)lat
                                     types:(NSArray *)types
                                   
{
    NSMutableDictionary *dic = [NSMutableDictionary dictionary];
    [dic setValue:@(lon) forKey:@"lon"];
    [dic setValue:@(lat) forKey:@"lat"];
    [dic setValue:types forKey:@"types"];
    
    RX_CommonRequest *request = [[RX_CommonRequest alloc] initWithApiName:[RXCommonApiManager getReportLocationUrl] andParams:dic requsetMethod:RequestMethod_Post];
    request.baseUrl = [RXConfig sharedManager].apiDomain;
    request.headParams = [RX_CommonNetworkExcuteManager headParams];
    
    return request;
}

/**
 * 删除位置信息
 * @param types 用户类型定义
 */
+ (RX_CommonRequest *)deleteLocationWithTypes:(NSArray *)types
{
    NSMutableDictionary *dic = [NSMutableDictionary dictionary];
    [dic setValue:types forKey:@"types"];
    RX_CommonRequest *request = [[RX_CommonRequest alloc] initWithApiName:[RXCommonApiManager getDeleteLocationUrl] andParams:dic requsetMethod:RequestMethod_Post];
    request.baseUrl = [RXConfig sharedManager].apiDomain;
    request.headParams = [RX_CommonNetworkExcuteManager headParams];
    return request;
}

/**
 * 获取附近人
 * @param lon 经度
 * @param lat 纬度
 * @param radius 半径（米）
 * @param count 查询数量，-1为全部
 * @param page 页数，从1开始
 * @param page_size 每页数量
 * @param type 查询类型
 */
+ (RX_CommonRequest *)getRadiusAccountWithLon:(double)lon
                                         lat:(double)lat
                                      radius:(NSInteger)radius
                                       count:(NSInteger)count
                                        page:(NSInteger)page
                                   page_size:(NSInteger)page_size
                                        type:(NSString *)type
{
    NSMutableDictionary *dic = [NSMutableDictionary dictionary];
    [dic setValue:@(lon) forKey:@"lon"];
    [dic setValue:@(lat) forKey:@"lat"];
    [dic setValue:@(radius) forKey:@"radius"];
    [dic setValue:@(count) forKey:@"count"];
    [dic setValue:@(page) forKey:@"page"];
    [dic setValue:@(page_size) forKey:@"page_size"];
    [dic setValue:type forKey:@"type"];
    
    RX_CommonRequest *request = [[RX_CommonRequest alloc] initWithApiName:[RXCommonApiManager getRadiusAccountUrl] andParams:dic requsetMethod:RequestMethod_Post];
    request.baseUrl = [RXConfig sharedManager].apiDomain;
    request.headParams = [RX_CommonNetworkExcuteManager headParams];
    
    return request;
}

/**
 * 设置用户自定义信息
 * @param custom 自定义信息，最大长度为 512 字节
 */
+ (RX_CommonRequest *)setUserCustomWithCustom:(NSString *)custom
{
    NSMutableDictionary *dic = [NSMutableDictionary dictionary];
    [dic setValue:custom forKey:@"custom"];
    
    RX_CommonRequest *request = [[RX_CommonRequest alloc] initWithApiName:[RXCommonApiManager getSetUserCustomUrl] andParams:dic requsetMethod:RequestMethod_Post];
    request.baseUrl = [RXConfig sharedManager].apiDomain;
    request.headParams = [RX_CommonNetworkExcuteManager headParams];
    
    return request;
}

/**
 * 添加自定义关系
 * @param target 目标openId  必须
 * @param types 自定义关系类型列表，value必须为BOOL  必须
 * @param target_remarks 用户给Target设置的备注信息（最长512字符） 非必须
 * @param user_remarks Target给用户设置的备注信息（最长512字符） 非必须
 */
+ (RX_CommonRequest *)addRelationWithTarget:(NSString *)target
                                     types:(NSDictionary *)types
                            target_remarks:(NSString * _Nullable)target_remarks
                              user_remarks:(NSString * _Nullable)user_remarks
{
    NSMutableDictionary *dic = [NSMutableDictionary dictionary];
    [dic setValue:target forKey:@"target"];
    [dic setValue:types forKey:@"types"];
    [dic setValue:target_remarks forKey:@"target_remarks"];
    [dic setValue:user_remarks forKey:@"user_remarks"];
    
    RX_CommonRequest *request = [[RX_CommonRequest alloc] initWithApiName:[RXCommonApiManager getAddRelationUrl] andParams:dic requsetMethod:RequestMethod_Post];
    request.baseUrl = [RXConfig sharedManager].apiDomain;
    request.headParams = [RX_CommonNetworkExcuteManager headParams];
    
    return request;
}

/**
 * 删除自定义关系
 * @param target 目标openId
 * @param types 自定义关系类型列表，value必须为BOOL  必须
 */
+ (RX_CommonRequest *)deleteRelationWithTarget:(NSString *)target
                                        types:(NSDictionary *)types
{
    NSMutableDictionary *dic = [NSMutableDictionary dictionary];
    [dic setValue:target forKey:@"target"];
    [dic setValue:types forKey:@"types"];
    
    RX_CommonRequest *request = [[RX_CommonRequest alloc] initWithApiName:[RXCommonApiManager getDeleteRelationUrl] andParams:dic requsetMethod:RequestMethod_Post];
    request.baseUrl = [RXConfig sharedManager].apiDomain;
    request.headParams = [RX_CommonNetworkExcuteManager headParams];
    
    return request;
}

/**
 * 更新用户自定义关系备注
 * @param target 目标openId
 * @param target_remarks 用户给Target设置的备注信息（最长512字符）
 * @param type 自定义关系类型
 */
+ (RX_CommonRequest *)updateRemarksWithTarget:(NSString *)target
                              target_remarks:(NSString *)target_remarks
                                        type:(NSString *)type
{
    NSMutableDictionary *dic = [NSMutableDictionary dictionary];
    [dic setValue:target forKey:@"target"];
    [dic setValue:target_remarks forKey:@"target_remarks"];
    [dic setValue:type forKey:@"type"];
    
    RX_CommonRequest *request = [[RX_CommonRequest alloc] initWithApiName:[RXCommonApiManager getUpdateRemarkUrl] andParams:dic requsetMethod:RequestMethod_Post];
    request.baseUrl = [RXConfig sharedManager].apiDomain;
    request.headParams = [RX_CommonNetworkExcuteManager headParams];
    
    return request;
}

/**
 * 获取自定关系列表
 * @param type 自定义关系类型
 */
+ (RX_CommonRequest *)getRelationListWithType:(NSString *)type
{
    NSMutableDictionary *dic = [NSMutableDictionary dictionary];
    [dic setValue:type forKey:@"type"];
    
    RX_CommonRequest *request = [[RX_CommonRequest alloc] initWithApiName:[RXCommonApiManager getRelationListUrl] andParams:dic requsetMethod:RequestMethod_Post];
    request.baseUrl = [RXConfig sharedManager].apiDomain;
    request.headParams = [RX_CommonNetworkExcuteManager headParams];
    
    return request;
}

/**
 * 添加好友
 * @param target 目标openId  必须
 * @param target_remarks 用户给Target设置的备注信息（最长512字符） 非必须
 * @param user_remarks Target给用户设置的备注信息（最长512字符） 非必须
 */
+ (RX_CommonRequest *)addFriendWithTarget:(NSString *)target
                          target_remarks:(NSString * _Nullable)target_remarks
                            user_remarks:(NSString * _Nullable)user_remarks
{
    NSMutableDictionary *dic = [NSMutableDictionary dictionary];
    [dic setValue:target forKey:@"target"];
    [dic setValue:target_remarks forKey:@"target_remarks"];
    [dic setValue:user_remarks forKey:@"user_remarks"];
    
    RX_CommonRequest *request = [[RX_CommonRequest alloc] initWithApiName:[RXCommonApiManager getAddFriendUrl] andParams:dic requsetMethod:RequestMethod_Post];
    request.baseUrl = [RXConfig sharedManager].apiDomain;
    request.headParams = [RX_CommonNetworkExcuteManager headParams];
    
    return request;
}

/**
 * 删除好友
 * @param target 目标openId  必须
 */
+ (RX_CommonRequest *)deleteFriendWithTarget:(NSString *)target
{
    NSMutableDictionary *dic = [NSMutableDictionary dictionary];
    [dic setValue:target forKey:@"target"];
    
    RX_CommonRequest *request = [[RX_CommonRequest alloc] initWithApiName:[RXCommonApiManager getDeleteFriendUrl] andParams:dic requsetMethod:RequestMethod_Post];
    request.baseUrl = [RXConfig sharedManager].apiDomain;
    request.headParams = [RX_CommonNetworkExcuteManager headParams];
    
    return request;
}

/**
 * 更新好友备注
 * @param target 目标openId  必须
 * @param target_remarks 用户给Target设置的备注信息（最长512字符） 必须
 */
+ (RX_CommonRequest *)updateFriendRemarkWithTarget:(NSString *)target
                                   target_remarks:(NSString *)target_remarks
{
    NSMutableDictionary *dic = [NSMutableDictionary dictionary];
    [dic setValue:target forKey:@"target"];
    [dic setValue:target_remarks forKey:@"target_remarks"];
    
    RX_CommonRequest *request = [[RX_CommonRequest alloc] initWithApiName:[RXCommonApiManager getUpdateFriendRemarkUrl] andParams:dic requsetMethod:RequestMethod_Post];
    request.baseUrl = [RXConfig sharedManager].apiDomain;
    request.headParams = [RX_CommonNetworkExcuteManager headParams];
    
    return request;
}

/**
 * 获取好友列表
 */
+ (RX_CommonRequest *)getFriendList
{
    RX_CommonRequest *request = [[RX_CommonRequest alloc] initWithApiName:[RXCommonApiManager getFriendListUrl] andParams:nil requsetMethod:RequestMethod_Post];
    request.baseUrl = [RXConfig sharedManager].apiDomain;
    request.headParams = [RX_CommonNetworkExcuteManager headParams];
    
    return request;
}

/**
 * 创建排行榜
 * @param rankId 类型 1:日榜 3:月榜 4:季榜 5:半年榜 6:年榜 99:长期榜单  必须
 */
+ (RX_CommonRequest *)createRankWithRankId:(NSString *)rankId
{
    NSMutableDictionary *dic = [NSMutableDictionary dictionary];
    [dic setValue:rankId forKey:@"rankid"];
    
    RX_CommonRequest *request = [[RX_CommonRequest alloc] initWithApiName:[RXCommonApiManager getCreateRankUrl] andParams:dic requsetMethod:RequestMethod_Post];
    request.baseUrl = [RXConfig sharedManager].apiDomain;
    request.headParams = [RX_CommonNetworkExcuteManager headParams];
    
    return request;
}

/**
 * 获取排行榜
 * @param rankId  必须
 * @param userId  必须
 */
+ (RX_CommonRequest *)getRankListWithRankId:(NSString *)rankId
                                    userId:(NSInteger)userId
{
    NSMutableDictionary *dic = [NSMutableDictionary dictionary];
    [dic setValue:rankId forKey:@"rankid"];
    [dic setValue:@(userId) forKey:@"userid"];
    
    RX_CommonRequest *request = [[RX_CommonRequest alloc] initWithApiName:[RXCommonApiManager getRankListUrl] andParams:dic requsetMethod:RequestMethod_Post];
    request.baseUrl = [RXConfig sharedManager].apiDomain;
    request.headParams = [RX_CommonNetworkExcuteManager headParams];
    
    return request;
}

/**
 * 上报排行榜分数
 * @param rankId 排行榜标识  必须
 * @param openId 用户openId  必须
 * @param score 分数  必须
 * @param userId 用户userId  必须
 */
+ (RX_CommonRequest *)reportRankScoreWithRankId:(NSString *)rankId
                                        openId:(NSString *)openId
                                         score:(NSInteger)score
                                        userId:(NSInteger)userId
{
    NSMutableDictionary *dic = [NSMutableDictionary dictionary];
    [dic setValue:rankId forKey:@"rankid"];
    [dic setValue:openId forKey:@"openid"];
    [dic setValue:@(score) forKey:@"score"];
    [dic setValue:@(userId) forKey:@"userid"];
    
    RX_CommonRequest *request = [[RX_CommonRequest alloc] initWithApiName:[RXCommonApiManager getReportRankScoreUrl] andParams:dic requsetMethod:RequestMethod_Post];
    request.baseUrl = [RXConfig sharedManager].apiDomain;
    request.headParams = [RX_CommonNetworkExcuteManager headParams];
    
    return request;
}

/**
 * 获取openId
 * @param userId 用户userId  必须
 */
+ (RX_CommonRequest *)getOpenIdWithUserId:(NSInteger)userId
{
    NSMutableDictionary *dic = [NSMutableDictionary dictionary];
    [dic setValue:@(userId) forKey:@"userid"];
    
    RX_CommonRequest *request = [[RX_CommonRequest alloc] initWithApiName:[RXCommonApiManager getOpenIdUrl] andParams:dic requsetMethod:RequestMethod_Post];
    request.baseUrl = [RXConfig sharedManager].apiDomain;
    request.headParams = [RX_CommonNetworkExcuteManager headParams];
    
    return request;
}

/**
 * 获取分享信息
 * @param func 埋点标识  必须
 * @param region 地区码  必须
 * @param platform 分享平台
 * @param transmits 透传参数，原样返回， 请使用key=value形式，并对值使用urlencode，返回时会原样返回  非必须
 */
+ (RX_CommonRequest *)getShareInfoWithFunc:(NSString *)func
                                   region:(NSString *)region
                                 platform:(NSString *)platform
                                transmits:(NSString * _Nullable)transmits
{
    NSMutableDictionary *dic = [NSMutableDictionary dictionary];
    [dic setValue:[RXUserUtility sharedManager].productId forKey:@"product_id"];
    [dic setValue:[RXUserUtility sharedManager].channelId forKey:@"channel_id"];
    [dic setValue:[RXUserUtility sharedManager].subchannelid forKey:@"sub_channel_id"];
    [dic setValue:func forKey:@"func"];
    [dic setValue:region forKey:@"region"];
    [dic setValue:@"app" forKey:@"type"];
    [dic setValue:platform forKey:@"platform"];
    [dic setValue:transmits forKey:@"transmits"];
    
    RX_CommonRequest *request = [[RX_CommonRequest alloc] initWithApiName:[RXCommonApiManager getShareInfoUrl] andParams:dic requsetMethod:RequestMethod_Post];
    request.baseUrl = [RXConfig sharedManager].apiDomain;
    request.headParams = [RX_CommonNetworkExcuteManager headParams];
    
    return request;
}

/**
 * 获取指定埋点次数信息
 * @param func_tags 埋点标识数组  必须
 */
//+ (RX_CommonRequest *)getShareLimitInfoWithFunc_tags:(NSArray *)func_tags
//{
//    NSMutableDictionary *dic = [NSMutableDictionary dictionary];
//    [dic setValue:func_tags forKey:@"func_tags"];
//
//    RX_CommonRequest *request = [[RX_CommonRequest alloc] initWithApiName:[RXCommonApiManager getShareLimitInfoUrl] andParams:dic requsetMethod:RequestMethod_Post];
//    request.baseUrl = [RXConfig sharedManager].apiDomain;
//    request.headParams = [RX_CommonNetworkExcuteManager headParams];
//
//    return request;
//}

/**
 * 分享上报
 */
//+ (RX_CommonRequest *)getshareReportWithParam:(NSDictionary *)param
//{
//    RX_CommonRequest *request = [[RX_CommonRequest alloc] initWithApiName:[RXCommonApiManager getShareReportUrl] andParams:param requsetMethod:RequestMethod_Post];
//    request.baseUrl = [RXConfig sharedManager].apiDomain;
//    request.headParams = [RX_CommonNetworkExcuteManager headParams];
//
//    return request;
//}

/**
 * 大厅更新检查
 * @param region 地区码  非必须
 * @param client_version 客户端大厅当前版本  非必须
 * @param type 脚本类型，默认lua，可选json，u3d等  非必须
 * @param json 输出文件后缀，默认lua，可选json 非必须
 */
+ (RX_CommonRequest *)checkUpdate_AppWithRegion:(NSString *)region
                                 client_version:(NSString *)client_version
                                           type:(NSString *)type
                                           json:(NSString *)json
                                          isGet:(BOOL)isGet
{
    NSString *urlStr = [NSString stringWithFormat:@"%@/%@/%@/%@/%@", [RXCommonApiManager getCheckUpdate_appUrl], [RXUserUtility sharedManager].productId, [RXUserUtility sharedManager].channelId, client_version, [DeviceKey getDeviceIDInKeychain]];
    if (region && region.length > 0) {
        urlStr = [NSString stringWithFormat:@"%@%ld", urlStr, [region integerValue]];
    }
    if (type && type.length > 0) {
        urlStr = [NSString stringWithFormat:@"%@?type=%@", urlStr, type];
        if (json && json.length > 0) {
            urlStr = [NSString stringWithFormat:@"%@&format=%@", urlStr, json];
        } else {
            urlStr = [NSString stringWithFormat:@"%@&format=json", urlStr];
        }
    } else {
        if (json && json.length > 0) {
            urlStr = [NSString stringWithFormat:@"%@?format=%@", urlStr, json];
        } else {
            urlStr = [NSString stringWithFormat:@"%@?format=json", urlStr];
        }
    }
    
    RequestMethod method = RequestMethod_Get;
    if (!isGet) {
        method = RequestMethod_Post;
    }
    RX_CommonRequest *request = [[RX_CommonRequest alloc] initWithApiName:urlStr andParams:nil requsetMethod:method];
    request.baseUrl = [RXConfig sharedManager].apiDomain;
    request.headParams = [RX_CommonNetworkExcuteManager headParams];
    
    return request;
}

/**
 * 活动更新检查
 * @param game_version 当前游戏版本  必须
 * @param game_check_version 指定游戏版本  非必须
 * @param short_name 活动短名  必须
 * @param type 脚本类型，默认lua，可选json，u3d等  非必须
 * @param json 输出文件后缀，默认lua，可选json 非必须
 */
+ (RX_CommonRequest *)checkUpdate_ActivityWithGame_version:(NSInteger)game_version
                                        game_check_version:(NSString *)game_check_version
                                                short_name:(NSString *)short_name
                                                      type:(NSString *)type
                                                      json:(NSString *)json
{
    NSString *urlStr = [NSString stringWithFormat:@"%@/%@/%ld", [RXCommonApiManager getCheckUpdate_activityUrl], short_name, game_version];
    if (game_check_version && game_check_version.length > 0) {
        urlStr = [NSString stringWithFormat:@"%@%ld", urlStr, [game_check_version integerValue]];
    }
    if (type && type.length > 0) {
        urlStr = [NSString stringWithFormat:@"%@?type=%@", urlStr, type];
        if (json && json.length > 0) {
            urlStr = [NSString stringWithFormat:@"%@&format=%@", urlStr, json];
        } else {
            urlStr = [NSString stringWithFormat:@"%@&format=json", urlStr];
        }
    } else {
        if (json && json.length > 0) {
            urlStr = [NSString stringWithFormat:@"%@?format=%@", urlStr, json];
        } else {
            urlStr = [NSString stringWithFormat:@"%@?format=json", urlStr];
        }
    }
    
    RX_CommonRequest *request = [[RX_CommonRequest alloc] initWithApiName:urlStr andParams:nil requsetMethod:RequestMethod_Post];
    request.baseUrl = [RXConfig sharedManager].apiDomain;
    request.headParams = [RX_CommonNetworkExcuteManager headParams];
    
    return request;
}

/**
 * 游戏更新检查
 * @param game_id 游戏ID  必须
 * @param game_version 当前游戏版本  必须
 * @param game_check_version 指定游戏版本  非必须
 * @param type 脚本类型，默认lua，可选json，u3d等  非必须
 * @param json 输出文件后缀，默认lua，可选json  非必须
 */
+ (RX_CommonRequest *)checkUpdate_GameWithGame_id:(NSInteger)game_id
                                     game_version:(NSInteger)game_version
                               game_check_version:(NSString *)game_check_version
                                             type:(NSString *)type
                                             json:(NSString *)json
{
    NSString *urlStr = [NSString stringWithFormat:@"%@/%ld/%ld", [RXCommonApiManager getCheckUpdate_gameUrl], game_id, game_version];
    if (game_check_version && game_check_version.length > 0) {
        urlStr = [NSString stringWithFormat:@"%@%ld", urlStr, [game_check_version integerValue]];
    }
    if (type && type.length > 0) {
        urlStr = [NSString stringWithFormat:@"%@?type=%@", urlStr, type];
        if (json && json.length > 0) {
            urlStr = [NSString stringWithFormat:@"%@&format=%@", urlStr, json];
        } else {
            urlStr = [NSString stringWithFormat:@"%@&format=json", urlStr];
        }
    } else {
        if (json && json.length > 0) {
            urlStr = [NSString stringWithFormat:@"%@?format=%@", urlStr, json];
        } else {
            urlStr = [NSString stringWithFormat:@"%@?format=json", urlStr];
        }
    }
    
    RX_CommonRequest *request = [[RX_CommonRequest alloc] initWithApiName:urlStr andParams:nil requsetMethod:RequestMethod_Post];
    request.baseUrl = [RXConfig sharedManager].apiDomain;
    request.headParams = [RX_CommonNetworkExcuteManager headParams];
    
    return request;
}

/**
 * 申请注销账号
 * @param IDCard 身份证  必须
 * @param realname 真实姓名  必须
 * @param cpdata CP自定义数据 非必须
 */
+ (RX_CommonRequest *)destroyAccountWithIDCard:(NSString *)IDCard
                                     realname:(NSString *)realname
                                       cpdata:(NSString * _Nullable)cpdata
{
    NSMutableDictionary *dic = [NSMutableDictionary dictionary];
    [dic setValue:IDCard forKey:@"idcard"];
    [dic setValue:realname forKey:@"realname"];
    [dic setValue:cpdata forKey:@"cpdata"];
    
    RX_CommonRequest *request = [[RX_CommonRequest alloc] initWithApiName:[RXCommonApiManager getDestroyAccountUrl] andParams:dic requsetMethod:RequestMethod_Post];
    request.baseUrl = [RXConfig sharedManager].apiDomain;
    request.headParams = [RX_CommonNetworkExcuteManager headParams];
    
    return request;
}

/**
 * 撤销注销申请
 */
+ (RX_CommonRequest *)repealDestroyAccount
{
    NSMutableDictionary *dic = [NSMutableDictionary dictionary];
    [dic setValue:[RXUserUtility sharedManager].openId forKey:@"openid"];
    
    RX_CommonRequest *request = [[RX_CommonRequest alloc] initWithApiName:[RXCommonApiManager getRepealDestroyAccountUrl] andParams:dic requsetMethod:RequestMethod_Post];
    request.baseUrl = [RXConfig sharedManager].apiDomain;
    request.headParams = [RX_CommonNetworkExcuteManager headParams];
    
    return request;
}

/**
 * 上传deviceToken
 * @param deviceToken APNS返回的设备码
 */
+ (RX_CommonRequest *)uploadPushInfoWithDeviceToken:(NSString *)deviceToken
{
    NSMutableDictionary *dic = [NSMutableDictionary dictionary];
    [dic setValue:deviceToken forKey:@"device_code"];
    [dic setValue:@"IOS" forKey:@"type"];
    RX_CommonRequest *request = [[RX_CommonRequest alloc] initWithApiName:[RXCommonApiManager getUploadPushInfoUrl] andParams:dic requsetMethod:RequestMethod_Post];
    request.baseUrl = [RXConfig sharedManager].apiDomain;
    return request;
}

/**
 * 绑定别名
 * @param alias 别名  必须
 */
+ (RX_CommonRequest *)bindingAlias:(NSString *)alias
{
    NSMutableDictionary *dic = [NSMutableDictionary dictionary];
    [dic setValue:alias forKey:@"alias"];
    
    RX_CommonRequest *request = [[RX_CommonRequest alloc] initWithApiName:[RXCommonApiManager getBindingPushAliasUrl] andParams:dic requsetMethod:RequestMethod_Post];
    request.baseUrl = [RXConfig sharedManager].apiDomain;
    request.headParams = [RX_CommonNetworkExcuteManager headParams];
    
    return request;
}

/**
 * 增加用户标签
 * @param tags 标签数组 一个用户最多绑定10个标签  必须
 */
+ (RX_CommonRequest *)addTags:(NSArray *)tags
{
    NSMutableDictionary *dic = [NSMutableDictionary dictionary];
    [dic setValue:tags forKey:@"tags"];
    
    RX_CommonRequest *request = [[RX_CommonRequest alloc] initWithApiName:[RXCommonApiManager getAddTagsPushUrl] andParams:dic requsetMethod:RequestMethod_Post];
    request.baseUrl = [RXConfig sharedManager].apiDomain;
    request.headParams = [RX_CommonNetworkExcuteManager headParams];
    
    return request;
}

/**
 * 移除用户标签
 * @param tags 标签数组
 */
+ (RX_CommonRequest *)deleteTags:(NSArray *)tags
{
    NSMutableDictionary *dic = [NSMutableDictionary dictionary];
    [dic setValue:tags forKey:@"tags"];
    
    RX_CommonRequest *request = [[RX_CommonRequest alloc] initWithApiName:[RXCommonApiManager getDeleteTagsPushUrl] andParams:dic requsetMethod:RequestMethod_Post];
    request.baseUrl = [RXConfig sharedManager].apiDomain;
    request.headParams = [RX_CommonNetworkExcuteManager headParams];
    
    return request;
}

/**
 * 解绑用户与渠道SDK的关联
 */
+ (RX_CommonRequest *)reliveBindingPushDevice
{
    NSMutableDictionary *dic = [NSMutableDictionary dictionary];
    [dic setValue:[RXUserUtility sharedManager].deviceToken forKey:@"deviceToken"];
    [dic setValue:@"IOS" forKey:@"type"];
    
    RX_CommonRequest *request = [[RX_CommonRequest alloc] initWithApiName:[RXCommonApiManager getReliveBindingPushDeviceUrl] andParams:dic requsetMethod:RequestMethod_Post];
    request.baseUrl = [RXConfig sharedManager].apiDomain;
    request.headParams = [RX_CommonNetworkExcuteManager headParams];
    
    return request;
}

/**
 * 上报推送日志
 * @param taskId 消息id  必须
 * @param status 上报状态 1 消息已接收 2 消息已到达展示 3 消息已点击  必须
 */
+ (RX_CommonRequest *)reportPushLogWithTaskId:(NSString *)taskId
                                      status:(NSInteger)status
{
    NSMutableDictionary *dic = [NSMutableDictionary dictionary];
    [dic setValue:taskId forKey:@"taskID"];
    [dic setValue:@(status) forKey:@"status"];
    [dic setValue:[RXUserUtility sharedManager].deviceToken forKey:@"deviceToken"];
    [dic setValue:@"IOS" forKey:@"type"];
    
    RX_CommonRequest *request = [[RX_CommonRequest alloc] initWithApiName:[RXCommonApiManager getReportPushLogUrl] andParams:dic requsetMethod:RequestMethod_Post];
    request.baseUrl = [RXConfig sharedManager].apiDomain;
    request.headParams = [RX_CommonNetworkExcuteManager headParams];
    
    return request;
}

/**
 * 上报埋点日志
 */
+ (RX_CommonRequest *)reportLogWithLogArr:(NSArray *)logArr
{
    NSError *parseError = nil;
    NSData *jsonData = [NSJSONSerialization dataWithJSONObject:logArr options:NSJSONWritingPrettyPrinted  error:&parseError];
    NSString *jsonstr =[[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];
    NSData *objectData = [jsonstr dataUsingEncoding:NSUTF8StringEncoding];
    NSDictionary *jsonDic = [NSJSONSerialization JSONObjectWithData:objectData
                                                            options:NSJSONReadingMutableContainers
                                                              error:&parseError];
    
    RX_CommonRequest *request = [[RX_CommonRequest alloc] initWithApiName:[RXCommonApiManager getReportLogUrl] andParams:jsonDic requsetMethod:RequestMethod_Post];
//    request.isGzip = YES;
//    request.gzipParam = param;
    request.baseUrl = [RXConfig sharedManager].apiDomain;
    request.headParams = @{@"Content-Type" : @"application/json",
                           @"ruixue-datacount" : [NSString stringWithFormat:@"%d", logArr.count],
    };
    
    return request;
}

/**
 * 下单
 */
+ (RX_CommonRequest *)payOrderWithOrderInfo:(NSDictionary *)orderInfo
{
    NSMutableDictionary *dic = [NSMutableDictionary dictionaryWithDictionary:orderInfo];
    [dic setValue:@(1) forKey:@"callback_from"];
    [dic setValue:@"appstore" forKey:@"pay_type"];
    [dic setValue:[RXUserUtility sharedManager].openId forKey:@"openid"];
    [dic setValue:[RXUserUtility sharedManager].source forKey:@"source"];
    [dic setValue:[RXUserUtility sharedManager].subchannelid forKey:@"sub_channel_id"];
    [dic setValue:@([RXUserUtility sharedManager].age) forKey:@"age"];
    
    RX_CommonRequest *request = [[RX_CommonRequest alloc] initWithApiName:[RXCommonApiManager getPayOrderInfoUrl] andParams:dic requsetMethod:RequestMethod_Post];
    request.baseUrl = [RXConfig sharedManager].apiDomain;
    request.headParams = [RX_CommonNetworkExcuteManager headParams];

    return request;
}

#pragma mark -- <自定义请求>
/**
 * 自定义请求
 * @param url 接口名
 * @param header 请求头
 * @param body 请求参数
 */
+ (RX_CommonRequest *)requestWithUrl:(NSString *)url
                             header:(NSMutableDictionary * _Nullable)header
                               body:(NSMutableDictionary * _Nullable)body
{
    NSMutableDictionary *headParams = [NSMutableDictionary dictionary];
    headParams = [RX_CommonNetworkExcuteManager headParams];
    for (int i = 0; i < header.allKeys.count; i++) {
        [headParams setValue:header.allValues[i] forKey:header.allKeys[i]];
    }
    
    RX_CommonRequest *request = [[RX_CommonRequest alloc] initWithApiName:url andParams:body requsetMethod:RequestMethod_Post];
    request.baseUrl = [RXConfig sharedManager].apiDomain;
    request.headParams = headParams;
    
    return request;
}

/**
 * 获取通路配置
 */
+ (RX_CommonRequest *)requestGetSharePlatforms
{
    RX_CommonRequest *request = [[RX_CommonRequest alloc] initWithApiName:[RXCommonApiManager getSharePlatformsUrl] andParams:nil requsetMethod:RequestMethod_Get];
    request.baseUrl = [RXConfig sharedManager].apiDomain;
    request.headParams = [RX_CommonNetworkExcuteManager headParams];
    
    return request;
}

/**
 * 用户激活
 * @param sourceAd 扩展信息
 * ！sourceAd参数说明：
 * ！source_ad 客户端采集到的广告相关的信息    #NSDictionary类型
 * ！user_agent 一种方式获取的 user_agent，若为空，则取 user-agent header 的值    #NSString类型
 * ！user_agent1 其他方式获取的 user_agent    #NSString类型
 * ！user_agent2 其他方式获取的 user_agent    #NSString类型
 */
+ (RX_CommonRequest *)requestActivatedWithSouceAd:(NSDictionary *)sourceAd
{
    NSMutableDictionary *dic = [NSMutableDictionary dictionary];
    [dic setValue:[RXCommonTool getDistinct_id] forKey:@"distinct_id"];
    
    NSDictionary *source_ad = sourceAd[@"source_ad"];
    if (source_ad && source_ad.allKeys.count > 0) {
        [dic setValue:sourceAd forKey:@"source_ad"];
    } else {
        NSMutableDictionary *adDic = [RXUserUtility sharedManager].pasteboardDic;
        NSMutableDictionary *sourceAdDic = [NSMutableDictionary dictionary];
        if (adDic.allKeys.count > 0 && [adDic.allKeys[0] isEqualToString:@"ad"]) {
            if (adDic[@"ad"] && [adDic[@"ad"] isKindOfClass:[NSDictionary class]]) {
                NSDictionary *ad = adDic[@"ad"];
                for (int i = 0; i < ad.allKeys.count; i++) {
                    [sourceAdDic setValue:ad.allValues[i] forKey:ad.allKeys[i]];
                }
            }
        }
        [dic setValue:sourceAdDic forKey:@"source_ad"];
    }
    
    NSMutableDictionary *deviceDic = [NSMutableDictionary dictionary];
    [deviceDic setValue:[RXCommonTool getIDFA] forKey:@"idfa"];
    
    NSString *user_agent = sourceAd[@"user_agent"];
    NSString *user_agent1 = sourceAd[@"user_agent1"];
    NSString *user_agent2 = sourceAd[@"user_agent2"];
    
    if ([NSString rx_isNullToString:user_agent].length > 0) {
        [deviceDic setValue:user_agent forKey:@"user_agent"];
    } else {
        [deviceDic setValue:[[RXCommonTool sharedSDK] rx_getUserAgent] forKey:@"user_agent"];
    }
    
    if ([NSString rx_isNullToString:user_agent1].length > 0) {
        [deviceDic setValue:user_agent1 forKey:@"user_agent1"];
    }
    
    if ([NSString rx_isNullToString:user_agent2].length > 0) {
        [deviceDic setValue:user_agent2 forKey:@"user_agent2"];
    }
    
    NSString *ip = sourceAd[@"ip"];
    if ([NSString rx_isNullToString:ip].length > 0) {
        [deviceDic setValue:ip forKey:@"ipv4"];
    }
    
    [dic setValue:deviceDic forKey:@"device"];
    
    RX_CommonRequest *request = [[RX_CommonRequest alloc] initWithApiName:[RXCommonApiManager getActivatedUrl] andParams:dic requsetMethod:RequestMethod_Post];
    request.baseUrl = [RXConfig sharedManager].apiDomain;
    request.headParams = [RX_CommonNetworkExcuteManager headParams];
    
    return request;
}

/**
 * 判断两用户是否为好友
 * @param target 目标openId  必须
 */
+ (RX_CommonRequest *)requestIsFriendWithTarget:(NSString *)target
{
    NSMutableDictionary *dic = [NSMutableDictionary dictionary];
    [dic setValue:target forKey:@"target"];
    
    RX_CommonRequest *request = [[RX_CommonRequest alloc] initWithApiName:[RXCommonApiManager getIsfriendUrl] andParams:dic requsetMethod:RequestMethod_Post];
    request.baseUrl = [RXConfig sharedManager].apiDomain;
    request.headParams = [RX_CommonNetworkExcuteManager headParams];
    
    return request;
}

/**
 * 判断两用户是否存在某自定关系
 * @param target 目标openId  必须
 * @param type CP 自定义关系类型  必须
 */
+ (RX_CommonRequest *)requestHasRelationWithTarget:(NSString *)target
                                              type:(NSString *)type
{
    NSMutableDictionary *dic = [NSMutableDictionary dictionary];
    [dic setValue:target forKey:@"target"];
    [dic setValue:type forKey:@"type"];
    
    RX_CommonRequest *request = [[RX_CommonRequest alloc] initWithApiName:[RXCommonApiManager getHasRelationUrl] andParams:dic requsetMethod:RequestMethod_Post];
    request.baseUrl = [RXConfig sharedManager].apiDomain;
    request.headParams = [RX_CommonNetworkExcuteManager headParams];
    
    return request;
}

/**
 * 获取ip
 */
+ (RX_CommonRequest *)requestGetIP
{
    // ipv4
    
    
    NSString *url = [RXConfig sharedManager].apiDomain;
    NSArray *urlArr = [url componentsSeparatedByString:@"."];
    // 取出一段拼接-ipv4
    NSString *url1 = [NSString stringWithFormat:@"%@-ipv4", urlArr[0]];
    for (int i = 0; i < urlArr.count; i++) {
        if (i == 0) {
            url = [NSString stringWithFormat:@"%@", url1];
        } else {
            url = [NSString stringWithFormat:@"%@.%@", url, urlArr[i]];
        }
    }
    
    RX_CommonRequest *request = [[RX_CommonRequest alloc] initWithApiName:[RXCommonApiManager getIP] andParams:nil requsetMethod:RequestMethod_Get];
    request.baseUrl = url;
    request.headParams = [RX_CommonNetworkExcuteManager headParams];
    
    return request;
}

@end
