//
//  RXApiManager.h
//  RXSDK
//
//  Created by 陈汉 on 2021/9/29.
//

#import <Foundation/Foundation.h>
#import "RX_CommonNetworkExcuteManager.h"
#import "RXService.h"
#import "RXApiService.h"

NS_ASSUME_NONNULL_BEGIN

@interface RXApiManager : NSObject

/**
 * 获取法务信息
 */
+ (RX_CommonRequest *)getCommonConfig;

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
                         migrate_args:(id _Nullable)migrate_args;

/**
 * 二次登录
 * @param loginOpenId 登录返回的login_openid
 * @param sign_fields 指定对登录成功后返回的特定字段, 使用 CPKEY 计算签名. CP 服务器可重新计算签名并与登录返回的签名比对, 作为对瑞雪登录数据的校验. 支持的字段包括: nickname, avatar, openid, region, sex, age, 计算签名的逻辑会对指定字段进行排序, 此处传参与顺序无关。类型为字符串数组 @[@"nickname",@"avatar"]  非必须
 * @param extDic 扩展字段，可传nil
 */
+ (RX_CommonRequest *)loginWithLoginOpenId:(NSString *)loginOpenId
                               sign_fields:(NSArray * _Nullable)sign_fields
                                    extDic:(NSMutableDictionary * __nullable)extDic;

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
                          migrate_args:(id _Nullable)migrate_args;

/**
 * 刷新token
 */
+ (RX_CommonRequest *)refreshTokenRequest;

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
                                     migrate_args:(id _Nullable)migrate_args;

/**
 * 解绑邮箱
 * @param captchaCode 验证码
 * @param email 邮箱
 */
+ (RX_CommonRequest *)reliveBindingEmailWithCaptchaCode:(NSString *)captchaCode
                                                 email:(NSString *)email;

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
                                     migrate_args:(id _Nullable)migrate_args;

/**
 * 解绑手机
 * @param captchaCode 验证码
 * @param phone 手机号
 */
+ (RX_CommonRequest *)reliveBindingPhoneWithCaptchaCode:(NSString *)captchaCode
                                                 phone:(NSString *)phone;

/**
 * 获取验证码
 * @param type 验证码类型
 * @param target 发送的目标（手机或邮箱）
 * @param purpose 用途
 */
+ (RX_CommonRequest *)getCaptchaCodeWithType:(CaptchaType)type
                                     target:(NSString *)target
                                    purpose:(NSString *)purpose;

/**
 * 实名认证
 * @param realName 真实姓名
 * @param idCard 身份证
 */
+ (RX_CommonRequest *)approveWithRealName:(NSString *)realName
                                  idCard:(NSString *)idCard;

/**
 * 获取用户信息
 */
+ (RX_CommonRequest *)getUserInfo;

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
                                     w_avatarurl:(NSString *)w_avatarurl;

/**
 * 修改密码
 * @param oldPwd 旧密码
 * @param newPwd 新密码
 */
+ (RX_CommonRequest *)updatePasswordWithOldPwd:(NSString *)oldPwd
                                       newPwd:(NSString *)newPwd;

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

/**
 * 上报位置信息
 * @param lon 经度
 * @param lat 纬度
 * @param types 用户类型定义
 */
+ (RX_CommonRequest *)reportLocationWithLon:(double)lon
                                       lat:(double)lat
                                     types:(NSArray *)types;

/**
 * 删除位置信息
 * @param types 用户类型定义
 */
+ (RX_CommonRequest *)deleteLocationWithTypes:(NSArray *)types;

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
                                        type:(NSString *)type;

/**
 * 设置用户自定义信息
 * @param custom 自定义信息，最大长度为 512 字节
 */
+ (RX_CommonRequest *)setUserCustomWithCustom:(NSString *)custom;

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
                              user_remarks:(NSString * _Nullable)user_remarks;

/**
 * 删除自定义关系
 * @param target 目标openId  必须
 * @param types 自定义关系类型列表，value必须为BOOL  必须
 */
+ (RX_CommonRequest *)deleteRelationWithTarget:(NSString *)target
                                        types:(NSDictionary *)types;

/**
 * 更新用户自定义关系备注
 * @param target 目标openId  必须
 * @param target_remarks 用户给Target设置的备注信息（最长512字符） 必须
 * @param type 自定义关系类型  必须
 */
+ (RX_CommonRequest *)updateRemarksWithTarget:(NSString *)target
                              target_remarks:(NSString *)target_remarks
                                        type:(NSString *)type;

/**
 * 获取自定关系列表
 * @param type 自定义关系类型  必须
 */
+ (RX_CommonRequest *)getRelationListWithType:(NSString *)type;

/**
 * 添加好友
 * @param target 目标openId  必须
 * @param target_remarks 用户给Target设置的备注信息（最长512字符） 非必须
 * @param user_remarks Target给用户设置的备注信息（最长512字符） 非必须
 */
+ (RX_CommonRequest *)addFriendWithTarget:(NSString *)target
                          target_remarks:(NSString * _Nullable)target_remarks
                            user_remarks:(NSString * _Nullable)user_remarks;

/**
 * 删除好友
 * @param target 目标openId  必须
 */
+ (RX_CommonRequest *)deleteFriendWithTarget:(NSString *)target;

/**
 * 更新好友备注
 * @param target 目标openId  必须
 * @param target_remarks 用户给Target设置的备注信息（最长512字符） 必须
 */
+ (RX_CommonRequest *)updateFriendRemarkWithTarget:(NSString *)target
                                   target_remarks:(NSString *)target_remarks;

/**
 * 获取好友列表
 */
+ (RX_CommonRequest *)getFriendList;

/**
 * 创建排行榜
 * @param rankId 类型 1:日榜 3:月榜 4:季榜 5:半年榜 6:年榜 99:长期榜单  必须
 */
+ (RX_CommonRequest *)createRankWithRankId:(NSString *)rankId;

/**
 * 获取排行榜
 * @param rankId  必须
 * @param userId  必须
 */
+ (RX_CommonRequest *)getRankListWithRankId:(NSString *)rankId
                                    userId:(NSInteger)userId;

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
                                        userId:(NSInteger)userId;

/**
 * 获取openId
 * @param userId 用户userId  必须
 */
+ (RX_CommonRequest *)getOpenIdWithUserId:(NSInteger)userId;

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
                                transmits:(NSString * _Nullable)transmits;

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
                                          isGet:(BOOL)isGet;

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
                                                      json:(NSString *)json;

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
                                             json:(NSString *)json;

/**
 * 申请注销账号
 * @param IDCard 身份证  必须
 * @param realname 真实姓名  必须
 * @param cpdata CP自定义数据 非必须
 */
+ (RX_CommonRequest *)destroyAccountWithIDCard:(NSString *)IDCard
                                      realname:(NSString *)realname
                                        cpdata:(NSString * _Nullable)cpdata;

/**
 * 撤销注销申请
 */
+ (RX_CommonRequest *)repealDestroyAccount;

/**
 * 上传deviceToken
 * @param deviceToken APNS返回的设备码  必须
 */
+ (RX_CommonRequest *)uploadPushInfoWithDeviceToken:(NSString *)deviceToken;

/**
 * 绑定别名
 * @param alias 别名  必须
 */
+ (RX_CommonRequest *)bindingAlias:(NSString *)alias;

/**
 * 增加用户标签
 * @param tags 标签数组 一个用户最多绑定10个标签  必须
 */
+ (RX_CommonRequest *)addTags:(NSArray *)tags;

/**
 * 移除用户标签
 * @param tags 标签数组
 */
+ (RX_CommonRequest *)deleteTags:(NSArray *)tags;

/**
 * 解绑用户与渠道SDK的关联
 */
+ (RX_CommonRequest *)reliveBindingPushDevice;

/**
 * 上报推送日志
 * @param taskId 消息id  必须
 * @param status 上报状态 1 消息已接收 2 消息已到达展示 3 消息已点击  必须
 */
+ (RX_CommonRequest *)reportPushLogWithTaskId:(NSString *)taskId
                                      status:(NSInteger)status;

/**
 * 上报埋点日志
 */
+ (RX_CommonRequest *)reportLogWithLogArr:(NSArray *)logArr;

/**
 * 下单
 */
+ (RX_CommonRequest *)payOrderWithOrderInfo:(NSDictionary *)orderInfo;

#pragma mark -- <自定义请求>
/**
 * 自定义请求
 * @param url 接口名
 * @param header 请求头
 * @param body 请求参数
 */
+ (RX_CommonRequest *)requestWithUrl:(NSString *)url
                             header:(NSMutableDictionary * _Nullable)header
                               body:(NSMutableDictionary * _Nullable)body;

/**
 * 获取通路配置
 */
+ (RX_CommonRequest *)requestGetSharePlatforms;

/**
 * 用户激活
 * @param sourceAd 扩展信息
 * ！sourceAd参数说明：
 * ！source_ad 客户端采集到的广告相关的信息    #NSDictionary类型
 * ！user_agent 一种方式获取的 user_agent，若为空，则取 user-agent header 的值    #NSString类型
 * ！user_agent1 其他方式获取的 user_agent    #NSString类型
 * ！user_agent2 其他方式获取的 user_agent    #NSString类型
 */
+ (RX_CommonRequest *)requestActivatedWithSouceAd:(NSDictionary *)sourceAd;

/**
 * 判断两用户是否为好友
 * @param target 目标openId  必须
 */
+ (RX_CommonRequest *)requestIsFriendWithTarget:(NSString *)target;

/**
 * 判断两用户是否存在某自定关系
 * @param target 目标openId  必须
 * @param type CP 自定义关系类型  必须
 */
+ (RX_CommonRequest *)requestHasRelationWithTarget:(NSString *)target
                                              type:(NSString *)type;

/**
 * 获取ip
 */
+ (RX_CommonRequest *)requestGetIP;

@end

NS_ASSUME_NONNULL_END
