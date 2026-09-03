//
//  RXUserUtility.h
//  RXSDK
//
//  Created by 陈汉 on 2021/9/29.
//

#import <Foundation/Foundation.h>
#import "RXCommonTool.h"
//#import "RXLegalModel.h"
#import "RXService.h"
#import "RX_CommonRequestError.h"

NS_ASSUME_NONNULL_BEGIN

// 初始化
static NSString *const keyUserData_initRes = @"rx_initRes";
static NSString *const keyUserData_initVersions = @"rx_initVersions";
static NSString *const keyUserData_agreePrivacy = @"rx_agreePrivacy";

static NSString *const keyUserData_openId = @"rx_openId";
static NSString *const keyUserData_topinviterOpenid = @"rx_topinviterOpenid";
static NSString *const keyUserData_loginOpenId = @"rx_loginOpenId";
static NSString *const keyUserData_productId = @"rx_productId";
static NSString *const keyUserData_channelId = @"rx_channelId";
static NSString *const keyUserData_cpId = @"rx_cpId";
static NSString *const keyUserData_baseUrlList = @"rx_baseUrlList";
static NSString *const keyUserData_localUserInfo = @"rx_localUserInfo";
static NSString *const keyUserData_hasShowLimits = @"rx_hasShowLimits";
static NSString *const keyUserData_access = @"rx_access";
static NSString *const keyUserData_refresh = @"rx_refresh";
static NSString *const keyUserData_accessExpire = @"rx_accessExpire";
static NSString *const keyUserData_refreshTime = @"rx_refreshTime";
static NSString *const keyUserData_method = @"rx_method";
static NSString *const keyUserData_methodenum = @"rx_methodenum";
static NSString *const keyUserData_sourceChannel = @"rx_sourceChannel";
static NSString *const keyUserData_deviceToken = @"rx_deviceToken";
static NSString *const keyUserData_isFirstLogin = @"rx_isFirstLogin";
static NSString *const keyUserData_isFirstReportLoginLog = @"rx_isFirstReportLoginLog";
static NSString *const keyUserData_isFirstOpen = @"rx_isFirstOpen";
static NSString *const keyUserData_legal = @"rx_legal";
static NSString *const keyUserData_universallink = @"rx_universallink";
static NSString *const keyUserData_logArr = @"rx_logArr";
static NSString *const keyUserData_subchannelid = @"rx_subchannelid";
static NSString *const keyUserData_source = @"rx_source";
static NSString *const keyUserData_orderInfo = @"rx_orderInfo";
static NSString *const keyUserData_selectProductID = @"rx_selectProductID";
static NSString *const keyUserData_sanboxNum = @"rx_sanboxNum";
static NSString *const keyUserData_isDebug = @"rx_isDebug";
static NSString *const keyUserData_distinct_id = @"rx_distinct_id";
static NSString *const keyUserData_adjust_distinct_id = @"rx_adjust_distinct_id";
static NSString *const keyUserData_ipv4 = @"rx_ipv4";
static NSString *const keyUserData_ipv4Url = @"rx_ipv4Url";
static NSString *const keyUserData_activity = @"rx_activity";
static NSString *const keyUserData_activityDevice = @"rx_activityDevice";
static NSString *const keyUserData_idfa = @"rx_idfa";
static NSString *const keyUserData_pasteInfo = @"rx_pasteInfo";
static NSString *const keyUserData_ua = @"rx_ua";
static NSString *const keyUserData_creatOrder = @"rx_createOrder"; // 记录当前下单时间
static NSString *const keyUserData_orderFinished = @"rx_orderFinished"; // 记录当前订单是否结束
static NSString *const keyUserData_getBusinessDate = @"rx_getBusinessDate"; // 记录当前获取商业化数据的时间
static NSString *const keyUserData_initProfile = @"rx_initProfile"; // 初始化配置
static NSString *const keyUserData_loginData = @"rx_loginData"; // 登录数据
static NSString *const keyUserData_setLanguage = @"rx_setLanguage"; // 设置的语言
static NSString *const keyUserData_simplePassword = @"rx_simplePassword"; // 密码强度设置
static NSString *const keyUserData_pwdPattern = @"rx_pwdPattern"; // 密码正则
static NSString *const keyUserData_closeEmailRegister = @"rx_closeEmailRegister"; // 是否关闭邮箱注册配置
static NSString *const keyUserData_uploadNet = @"rx_uploadNet"; // 是否关闭上报网络状态，默认关闭
static NSString *const keyUserData_uploadMod = @"rx_uploadMod"; // 是否关闭上报设备型号，默认关闭
static NSString *const keyUserData_loginSuccessTime = @"rx_loginSuccessTime"; // 登录成功时间
static NSString *const keyUserData_loginOpenidExpire = @"rx_loginOpenidExpire"; // login_openid 有效期
static NSString *const keyUserData_ulink = @"rxwx_universallink";

//asa
static NSString *const keyUserData_asa = @"rx_asaInfo"; // asa

// cid
static NSString *const keyUserData_bootSecTime = @"rx_bootSecTime"; // 启动时间
static NSString *const keyUserData_countryCode = @"rx_countryCode"; // 国家
static NSString *const keyUserData_language = @"rx_language"; // 语言
static NSString *const keyUserData_deviceName = @"rx_deviceName"; // 设备名称
static NSString *const keyUserData_systemVersion = @"rx_systemVersion"; // 系统版本
static NSString *const keyUserData_machine = @"rx_machine"; // Machine
static NSString *const keyUserData_carrierInfo = @"rx_carrierInfo"; // 运营商
static NSString *const keyUserData_physicalMemory = @"rx_physicalMemory"; // 物理内存
static NSString *const keyUserData_disk = @"rx_disk"; // 硬盘容量
static NSString *const keyUserData_sysFileTime = @"rx_sysFileTime"; // 系统更新时间
static NSString *const keyUserData_model = @"rx_model"; // model
static NSString *const keyUserData_timeZone = @"rx_timeZone"; // 时区
static NSString *const keyUserData_mnt_id = @"rx_mnt_id"; // mnt_id
static NSString *const keyUserData_fileInitTime = @"rx_fileInitTime"; // 设备初始化时间
static NSString *const keyUserData_cidVersion = @"rx_cidVersion"; // cid版本号
static NSString *const keyUserData_cids = @"rx_cids";

// 大数据
static NSString *const keyUserData_publicProperties = @"rx_publicProperties";
static NSString *const keyUserData_publicVersion = @"rx_publicVersion";
static NSString *const keyUserData_publicData = @"rx_publicData";

// 商业化
static NSString *const keyUserData_busData = @"rx_busData";
static NSString *const keyUserData_busVersion = @"rx_busVersion";

// 分享
static NSString *const keyUserData_shareData = @"rx_shareData";

// iap
static NSString *const keyUserData_iapFailInfo = @"rx_iapFailInfo";

// 投放
static NSString *const keyUserData_adjustAdid = @"rx_adjustAdid";  // adjust adid
static NSString *const keyUserData_adjustAdidReported = @"rx_adjustAdidReported";  // adjust adid 是否上报过
static NSString *const keyUserData_socketUUID = @"rx_socketUUID";  // 上报事件唯一 id

// 日志
static NSString *const keyUserData_localLog = @"rx_localLog";
static NSString *const keyUserData_localLogInfo = @"rx_localLogInfo";
static NSString *const keyUserData_userActionLog = @"rx_userActionLog";
static NSString *const keyUserData_userActionLog_firstTime = @"rx_userActionLog_firstTime";
static NSString *const keyUserData_userActionLog_stop = @"rx_userActionLog_stop";

// 已安装应用
static NSString *const keyUserData_appsInfo = @"rx_appsInfo";
static NSString *const keyUserData_appsInfo_reportTS = @"rx_appsInfo_reportTS";

// 语言
static NSString *const keyUserData_configLanguage = @"rx_config_language";

// 通讯录
static NSString *const keyUserData_ABList = @"rx_ab_list";
static NSString *const keyUserData_ABHash = @"rx_ab_hash";
static NSString *const keyUserData_ABReported = @"rx_ab_reported";
static NSString *const keyUserData_ABReportTS = @"rx_ab_reportTS";
static NSString *const keyUserData_deviceUab = @"rx_device_uab";

// channel
static NSString *const keyUserData_channel = @"rx_channel";
static NSString *const keyUserData_iifaaVisible = @"rx_iifaa_visible";
static NSString *const keyUserData_iifaaScheme = @"rx_iifaa_scheme";

// 获取推送信息
static NSString *keyUserData_pushInfo = @"RXNotiKey_pushInfo";

//gpm
static NSString *const keyUserData_gpmType = @"rx_gpmType"; //gpm种类，uwa、sdk、both两个都用，默认both
static NSString *const keyUserData_sdk_ts = @"rx_sdk_ts"; //gpm上报时间间隔，默认60s，0不上报
static NSString *const keyUserData_uwa_ts = @"rx_uwa_ts"; //uwa上报时间间隔，默认60s，0不上报
//公告是否已读记录
static NSString *const keyUserData_announce_list = @"rx_announce_list";//本地存储字典，公告本地数据是否已读记录,key为公告id，value为BOOL值，是否已读，YES已读，NO未读

// openinstall
static NSString *keyUserData_oi_clickTime = @"RXNotiKey_oi_clickTime";

typedef void(^LoginCompleteBlock)(NSDictionary * _Nullable response, RX_CommonRequestError *error);

@interface RXUserUtility : NSObject

#pragma mark -- <本地保存>
+ (instancetype)sharedManager;

+ (void)setValue:(id)value ForKey:(NSString *)key;

+ (void)setBool:(BOOL)value ForKey:(NSString *)key;

+ (BOOL)boolForKey:(NSString *)key;

+ (id)valueForKey:(NSString *)key;

#pragma mark -- <非本地保存>
@property (nonatomic, strong) NSDictionary *activitySource;
@property (nonatomic, strong) NSDictionary *configData;
@property (nonatomic, strong) NSArray *baseUrlList; // 域名
@property (nonatomic, assign) NSInteger baseUrlCount; // 当前使用的域名位置
@property (nonatomic, assign) NSInteger requestFailCount; // 请求失败次数
@property (nonatomic, assign) NSInteger age;
@property (nonatomic, assign) NSInteger feedbackLogLimit; // 意见反馈上传文件大小限制
@property (nonatomic, copy) NSString *cpid;
@property (nonatomic, assign) BOOL isUseDNS;//是否打开DNS开关
@property (nonatomic, copy) NSString *subChannelId;
@property (nonatomic, copy) NSString *password;
@property (nonatomic, copy) NSString *aliAuthToken;
@property (nonatomic, copy) NSString *wLoginAppId;
@property (nonatomic, copy) NSString *wUserCode;
@property (nonatomic, strong) NSMutableDictionary *extDic;
@property (nonatomic, strong) NSMutableDictionary *adDic;
@property (nonatomic, strong) NSMutableDictionary *sharePlatformsDic; // 通路配置
@property (nonatomic, strong) NSMutableDictionary *shareSchedulList;
@property (nonatomic, strong) NSMutableDictionary *loginData;
@property (nonatomic, copy) LoginCompleteBlock loginCompleteBlock;
@property (nonatomic, assign) BOOL isLogin;
@property (nonatomic, assign) BOOL isGZip;
@property (nonatomic, assign) BOOL isGetSharePlatformSuccess;
@property (nonatomic, assign) BOOL isBusSuccess;
@property (nonatomic, assign) BOOL isInit;
@property (nonatomic, assign) BOOL isSetInit;
@property (nonatomic, assign) BOOL isOpenAdSwitch; // 是否开启投放
@property (nonatomic, assign) BOOL isSetLanguage; // 是否设置了语言
@property (nonatomic, assign) BOOL closeEmailRegister; // 是否隐藏邮箱注册
@property (nonatomic, assign) BOOL uploadNet; // 是否关闭上报网络状态，默认关闭
@property (nonatomic, assign) BOOL uploadMod; // 是否关闭上报设备型号，默认关闭
@property (nonatomic, assign) BOOL sk2;
@property (nonatomic, strong) NSMutableArray *busRequestList;
@property (nonatomic, strong) NSMutableArray *loginMethods;
@property (nonatomic, assign) long loginOpenidExpire; // login_openid 有效期

/** 登录 **/
@property (nonatomic, strong) NSString *wxAppid;
@property (nonatomic, strong) NSString *quickphoneKey;
@property (nonatomic, strong) NSString *googleClientid;

@property (nonatomic, strong) NSMutableDictionary *productInfoDic; // 商品信息（币种、金额）
@property (nonatomic, strong) NSMutableDictionary *allProductInfo; // 初始化获取的所有计费点

@property (nonatomic, strong) NSString *adjustAppToken;
@property (nonatomic, strong) NSString *adjustRegistToken;
@property (nonatomic, strong) NSString *adjustActivateToken;
@property (nonatomic, assign) NSInteger AdjustReConnectTime; // 重试间隔
@property (nonatomic, assign) BOOL adjustSwitch; // 归因回传开关

@property (nonatomic, strong) NSString *gdtSid;
@property (nonatomic, strong) NSString *gdtKey;
@property (nonatomic, assign) BOOL gdtSwitch; // 是否开启上报

@property (nonatomic, assign) BOOL oceanengineSwitch; // 是否开启上报

@property (nonatomic, strong) NSArray *wsList;
@property (nonatomic, strong) NSString *wsMethod;

@property (nonatomic, strong) NSString *userAgent;
@property (nonatomic, strong) NSString *currencySymbol;

@property (nonatomic, copy) NSString *gpmType;//gpm种类，uwa、sdk、both两个都用，默认both
@property (nonatomic, copy) NSString *sdk_ts;//gpm上报时间间隔，默认60s，0不上报
@property (nonatomic, copy) NSString *uwa_ts;//uwa上报时间间隔，默认60s，0不上报
@property (nonatomic, strong) NSMutableDictionary *sdkPropertyDic;//gpm获取的用户属性
@property (nonatomic, strong) NSMutableDictionary *uwaPropertyDic;//uwa获取的用户属性

//定义主播标识
@property (nonatomic, assign) BOOL isAnchor;//是否为主播，YES是，NO不是
@property (nonatomic, copy) NSString *cp_user_id;//登录下发的cp_user_id，用于请求福利码

//初始化后获取的公告列表
@property (nonatomic, strong) NSArray *announceArray;

// 是否加密
@property (nonatomic, assign) BOOL needEncrypt;

// 商品 id
@property (nonatomic, strong) NSString *iapProductId;
// 获取商品超时时间
@property (nonatomic, assign) NSInteger iapTimeout;
// 游戏角色 id
@property (nonatomic, strong) NSString *cpRoleId;
// 游戏区服标识
@property (nonatomic, strong) NSString *cpRegionTag;
// 地区
@property (nonatomic, strong) NSString *area;

@property (nonatomic, assign) BOOL openRacing; // 是否开启竞速
// 启动参数
@property (nonatomic, strong) NSDictionary *launchOptions;
// 启动参数 SceneDelegate
@property (nonatomic, strong) UISceneConnectionOptions *connectOptions;

// 服务器时间偏移量（毫秒）：serverTime - deviceTime
@property (nonatomic, copy) NSString *stOffset;

// openistall 开关
@property (nonatomic, assign) BOOL openOI;
@property (nonatomic, strong) NSString *oiDomain;
@property (nonatomic, strong) NSString *oiAppKey;
// openistall 透传参数
@property (nonatomic, strong) NSDictionary *oiParams;

@end

NS_ASSUME_NONNULL_END
