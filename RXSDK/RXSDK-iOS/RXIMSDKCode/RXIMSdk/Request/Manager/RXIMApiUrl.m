//
//  RXApiManager.m
//  OverseaSocialApp
//
//  Created by 陈汉 on 2021/4/15.
//

#import "RXIMApiUrl.h"
#import "RXIMUserUtility.h"

@implementation RXIMApiUrl

+ (NSString *)getLoginUrl
{
    return @"/v1/ims/user/debuglogin";
}

+ (NSString *)getInitUrl
{
    return @"/v1/ims/user/init";
}

+ (NSString *)getRefreshTokenUrl
{
    return [RXIMUserUtility sharedManager].isBusiness ? @"/v1/imsbusiness/refreshtoken":@"/v1/ims/user/refreshtoken";
}

+ (NSString *)creatSessionUrl
{
    return [RXIMUserUtility sharedManager].isBusiness ? @"/v1/imsbusiness/createconversation" : @"/v1/ims/conversation/create";
}

+ (NSString *)updateSessionUrl
{
    return [RXIMUserUtility sharedManager].isBusiness ? @"/v1/imsbusiness/updateconversation" : @"/v1/ims/conversation/update";
}

+ (NSString *)deleteSessionUrl
{
    return [RXIMUserUtility sharedManager].isBusiness ? @"/v1/imsbusiness/deleteconversation" : @"/v1/ims/conversation/delete";
}

+ (NSString *)getSessionUrl
{
    return [RXIMUserUtility sharedManager].isBusiness ? @"/v1/imsbusiness/getconversation" : @"/v1/ims/conversation/get";
}

+ (NSString *)joinSessionUrl
{
    return [RXIMUserUtility sharedManager].isBusiness ? @"/v1/imsbusiness/joinconversation" : @"/v1/ims/conversation/join";
}

+ (NSString *)leaveSessionUrl
{
    return [RXIMUserUtility sharedManager].isBusiness ? @"/v1/imsbusiness/leaveconversation" : @"/v1/ims/conversation/leave";
}

+ (NSString *)updateUserDataSessionUrl
{
    return [RXIMUserUtility sharedManager].isBusiness ? @"/v1/imsbusiness/updateuserdata" : @"/v1/ims/conversation/updateuserdata";
}

+ (NSString *)getSessionListUrl
{
    return [RXIMUserUtility sharedManager].isBusiness ? @"/v1/imsbusiness/conversationlist" : @"/v1/ims/conversation/list";
}

+ (NSString *)deleteSessionMsgUrl
{
    return @"/v1/imsbusiness/deletemsg";
}

+ (NSString *)updateMsgExtUrl
{
    return @"/v1/imsbusiness/updatemsg";
}

+ (NSString *)topConversationMsgUrl
{
    return @"/v1/imsbusiness/conversationtopmsg";
}

+ (NSString *)setGroupManagersUrl
{
    return @"/v1/imsbusiness/setmanager";
}

+ (NSString *)groupkickMembersUrl
{
    return @"/v1/imsbusiness/kickmember";
}
+ (NSString *)groupInviteMembersUrl
{
    return @"/v1/imsbusiness/invite";
}

+ (NSString *)addCollectionUrl
{
    return @"/v1/imsbusiness/addcollection";
}

+ (NSString *)deleteCollectionUrl
{
    return @"/v1/imsbusiness/delcollection";
}

+ (NSString *)getCollectionListUrl
{
    return @"/v1/imsbusiness/collectionlist";
}

+ (NSString *)getCollectionMsgsUrl
{
    return @"/v1/imsbusiness/collectionmsg";
}

+ (NSString *)setNicknameInConvUrl
{
    return @"/v1/imsbusiness/updatename";
}

+ (NSString *)getRtcAutoInfoUrl
{
    return @"/v1/imsbusiness/getrtctoken";
}

+ (NSString *)searchMessageUrl
{
    return @"/v1/imsbusiness/search";
}

+ (NSString *)setGroupNameUrl
{
    return @"/v1/imsbusiness/setconvername";
}

+ (NSString *)setGroupDescUrl
{
    return @"/v1/imsbusiness/setconverdesc";
}

@end
