
#import <Foundation/Foundation.h>

//added in v2.7.0 用于分享统计接口中的分享平台（sharePlatform）
typedef NSString *RuixueOI_SharePlatform NS_STRING_ENUM;

/**
 * 微信好友
 */
extern RuixueOI_SharePlatform const RuixueOI_SharePlatform_WechatSession;
/**
 * 微信朋友圈
 */
extern RuixueOI_SharePlatform const RuixueOI_SharePlatform_WechatTimeline;
/**
 * 微信收藏
 */
extern RuixueOI_SharePlatform const RuixueOI_SharePlatform_WechatFavorite;
/**
 * 企业微信，国际版WeCom，原名WechatWork
 */
extern RuixueOI_SharePlatform const RuixueOI_SharePlatform_WeCom;
/**
 * QQ好友
 */
extern RuixueOI_SharePlatform const RuixueOI_SharePlatform_QQ;
/**
 * QQ空间
 */
extern RuixueOI_SharePlatform const RuixueOI_SharePlatform_Qzone;
/**
 * 新浪微博
 */
extern RuixueOI_SharePlatform const RuixueOI_SharePlatform_Sina;
/**
 * 腾讯微博
 */
extern RuixueOI_SharePlatform const RuixueOI_SharePlatform_TencentWb;
/**
 * 腾讯Tim
 */
extern RuixueOI_SharePlatform const RuixueOI_SharePlatform_TencentTim;
/**
 * 支付宝好友
 */
extern RuixueOI_SharePlatform const RuixueOI_SharePlatform_APSession;
/**
 * 钉钉
 */
extern RuixueOI_SharePlatform const RuixueOI_SharePlatform_DingDing;
/**
 * 抖音国内版
 */
extern RuixueOI_SharePlatform const RuixueOI_SharePlatform_DouYin;
/**
 * 抖音海外版（TikTok）
 */
extern RuixueOI_SharePlatform const RuixueOI_SharePlatform_TikTok;
/**
 * 快手
 */
extern RuixueOI_SharePlatform const RuixueOI_SharePlatform_Kuaishou;
/**
 * 快手国际版（Kwai）
 */
extern RuixueOI_SharePlatform const RuixueOI_SharePlatform_Kwai;
/**
 * 西瓜视频
 */
extern RuixueOI_SharePlatform const RuixueOI_SharePlatform_WatermelonVideo;
/**
 * 西瓜视频国际版（BuzzVideo）
 */
extern RuixueOI_SharePlatform const RuixueOI_SharePlatform_BuzzVideo;
/**
 * 人人网
 */
extern RuixueOI_SharePlatform const RuixueOI_SharePlatform_Renren;
/**
 * 豆瓣
 */
extern RuixueOI_SharePlatform const RuixueOI_SharePlatform_Douban;
/**
 * 邮箱
 */
extern RuixueOI_SharePlatform const RuixueOI_SharePlatform_Email;
/**
 * 短信
 */
extern RuixueOI_SharePlatform const RuixueOI_SharePlatform_Sms;
/**
 * Facebook
 */
extern RuixueOI_SharePlatform const RuixueOI_SharePlatform_Facebook;
/**
 * Facebook Messenger
 */
extern RuixueOI_SharePlatform const RuixueOI_SharePlatform_FacebookMessenger;
/**
 * Facebook账户系统
 */
extern RuixueOI_SharePlatform const RuixueOI_SharePlatform_FacebookAccount;
/**
 * 推特（Twitter）
 */
extern RuixueOI_SharePlatform const RuixueOI_SharePlatform_Twitter;
/**
 * Instragram
 */
extern RuixueOI_SharePlatform const RuixueOI_SharePlatform_Instagram;
/**
 * Whatsapp
 */
extern RuixueOI_SharePlatform const RuixueOI_SharePlatform_Whatsapp;
/**
 * youtube
 */
extern RuixueOI_SharePlatform const RuixueOI_SharePlatform_Youtube;
/**
 * SnapChat
 */
extern RuixueOI_SharePlatform const RuixueOI_SharePlatform_SnapChat;

/**
 * 易信好友
 */
extern RuixueOI_SharePlatform const RuixueOI_SharePlatform_YXSession;
/**
 * 易信朋友圈
 */
extern RuixueOI_SharePlatform const RuixueOI_SharePlatform_YXTimeline;
/**
 * 易信收藏夹
 */
extern RuixueOI_SharePlatform const RuixueOI_SharePlatform_YXFavorite;
/**
 * 明道
 */
extern RuixueOI_SharePlatform const RuixueOI_SharePlatform_MingDao;
/**
 * 来往好友
 */
extern RuixueOI_SharePlatform const RuixueOI_SharePlatform_LWSession;
/**
 * 来往朋友圈
 */
extern RuixueOI_SharePlatform const RuixueOI_SharePlatform_LWTimeline;
/**
 * 分享到Line
 */
extern RuixueOI_SharePlatform const RuixueOI_SharePlatform_Line;
/**
 * 领英
 */
extern RuixueOI_SharePlatform const RuixueOI_SharePlatform_Linkedin;
/**
 * Reddit
 */
extern RuixueOI_SharePlatform const RuixueOI_SharePlatform_Reddit;
/**
 * Tumblr
 */
extern RuixueOI_SharePlatform const RuixueOI_SharePlatform_Tumblr;
/**
 * Pinterest
 */
extern RuixueOI_SharePlatform const RuixueOI_SharePlatform_Pinterest;
/**
 * Kakao Talk
 */
extern RuixueOI_SharePlatform const RuixueOI_SharePlatform_KakaoTalk;
/**
 * Kakao story
 */
extern RuixueOI_SharePlatform const RuixueOI_SharePlatform_KakaoStory;
/**
 * Flickr
 */
extern RuixueOI_SharePlatform const RuixueOI_SharePlatform_Flickr;
/**
 * 有道云笔记
 */
extern RuixueOI_SharePlatform const RuixueOI_SharePlatform_YouDaoNote;
/**
 * 印象笔记
 */
extern RuixueOI_SharePlatform const RuixueOI_SharePlatform_YinxiangNote;
/**
 * 印象笔记国际版
 */
extern RuixueOI_SharePlatform const RuixueOI_SharePlatform_EverNote;
/**
 * google+
 */
extern RuixueOI_SharePlatform const RuixueOI_SharePlatform_googlePlus;
/**
 *  Pocket
 */
extern RuixueOI_SharePlatform const RuixueOI_SharePlatform_Pocket;
/**
 *  dropbox
 */
extern RuixueOI_SharePlatform const RuixueOI_SharePlatform_dropbox;
/**
 *  vkontakte
 */
extern RuixueOI_SharePlatform const RuixueOI_SharePlatform_vkontakte;
/**
 * Instapaper
 */
extern RuixueOI_SharePlatform const RuixueOI_SharePlatform_Instapaper;
/**
 * Oasis
 */
extern RuixueOI_SharePlatform const RuixueOI_SharePlatform_Oasis;
/**
 * Apple
 */
extern RuixueOI_SharePlatform const RuixueOI_SharePlatform_AppleAccount;
/**
 * copy
 */
extern RuixueOI_SharePlatform const RuixueOI_SharePlatform_Copy;
/**
 *  其它平台
 */
extern RuixueOI_SharePlatform const RuixueOI_SharePlatform_Other;

//added in v2.7.0 用于安装参数返回时的超时判断
typedef NS_ENUM(NSUInteger,RuixueOI_Codes) {
    RuixueOICode_normal = 0,//初始化结束，并返回参数，自然安装下参数为空
    RuixueOICode_timeout = 1,//获取参数超时，可在合适时机再去获取（可设置全局标识）
};

extern NSString *const app_Idfa_Id;
extern NSString *const app_ASA_Token;
extern NSString *const app_ASA_isDev;//added in v2.5.6

@interface RuixueOIData : NSObject<NSCopying>

- (instancetype)initWithData:(NSDictionary *)data
                 channelCode:(NSString *)channelCode;
                

@property (nonatomic,strong) NSDictionary *data;//动态参数
@property (nonatomic,copy) NSString *channelCode;//渠道编号
@property (nonatomic,assign) RuixueOI_Codes opCode;// (added in v2.7.0)

@end
