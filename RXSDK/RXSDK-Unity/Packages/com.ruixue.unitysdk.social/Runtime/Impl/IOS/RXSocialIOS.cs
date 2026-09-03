using System.Collections.Generic;
using System.Runtime.InteropServices;

#if UNITY_IOS
namespace RuiXue.Social.Impl
{
    internal class RXSocialIOS : IRXSocial
    {
        public void LbsRadius(string type, float lon, float lat, float radius, int count, int page, int page_size,
            RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            RuiXueSdkDriver.RegisterIOSCallBack("ios_social_getRadiusAccountWithLon", new IOSCallBackWrapper
            {
                onResponse = onResponse,
                onError = onError
            });

            ios_social_getRadiusAccountWithLon(lon, lat, (int)radius, count, page, page_size, type,
                RuiXueSdkDriver.IOSCallBackOnResponse, RuiXueSdkDriver.IOSCallBackOnError);
        }

        public void UserSetCustom(string custom, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            RuiXueSdkDriver.RegisterIOSCallBack("ios_social_setUserCustomWithCustom", new IOSCallBackWrapper
            {
                onResponse = onResponse,
                onError = onError
            });

            ios_social_setUserCustomWithCustom(custom, RuiXueSdkDriver.IOSCallBackOnResponse, RuiXueSdkDriver.IOSCallBackOnError);
        }

        public void LbsUpdate(string[] types, float lon, float lat, RequestResponseDelegate onResponse,
            RequestErrorDelegate onError)
        {
            RuiXueSdkDriver.RegisterIOSCallBack("ios_social_lbsUpdateWithLon", new IOSCallBackWrapper
            {
                onResponse = onResponse,
                onError = onError
            });

            var jsonTypeArray = RXJsonUtil.ToJson(types);
            ios_social_lbsUpdateWithLon(lon, lat, jsonTypeArray, RuiXueSdkDriver.IOSCallBackOnResponse, RuiXueSdkDriver.IOSCallBackOnError);
        }

        public void LbsDelete(string[] types, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            RuiXueSdkDriver.RegisterIOSCallBack("ios_social_deleteLocationWithTypes", new IOSCallBackWrapper
            {
                onResponse = onResponse,
                onError = onError
            });
            
            var jsonTypeArray = RXJsonUtil.ToJson(types);

            ios_social_deleteLocationWithTypes(jsonTypeArray, RuiXueSdkDriver.IOSCallBackOnResponse, RuiXueSdkDriver.IOSCallBackOnError);
        }

        public void RelationAdd(string target, Dictionary<string, object> types, string target_remarks,
            string user_remarks,
            RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            RuiXueSdkDriver.RegisterIOSCallBack("ios_social_addRelationWithTarget", new IOSCallBackWrapper
            {
                onResponse = onResponse,
                onError = onError
            });
            
            var jsonTypeDic = RXJsonUtil.ToJson(types);
            ios_social_addRelationWithTarget(target, jsonTypeDic, target_remarks, user_remarks,
                RuiXueSdkDriver.IOSCallBackOnResponse, RuiXueSdkDriver.IOSCallBackOnError);
        }

        public void RelationDelete(string target, Dictionary<string, object> types, RequestResponseDelegate onResponse,
            RequestErrorDelegate onError)
        {
            RuiXueSdkDriver.RegisterIOSCallBack("ios_social_deleteRelationWithTarget", new IOSCallBackWrapper
            {
                onResponse = onResponse,
                onError = onError
            });

            var jsonTypeDic = RXJsonUtil.ToJson(types);
            ios_social_deleteRelationWithTarget(target, jsonTypeDic, RuiXueSdkDriver.IOSCallBackOnResponse, RuiXueSdkDriver.IOSCallBackOnError);
        }

        public void UpdateRemarks(string target, string type, string target_remarks, RequestResponseDelegate onResponse,
            RequestErrorDelegate onError)
        {
            RuiXueSdkDriver.RegisterIOSCallBack("ios_social_updateRemarksWithTarget", new IOSCallBackWrapper
            {
                onResponse = onResponse,
                onError = onError
            });

            ios_social_updateRemarksWithTarget(target, type, target_remarks, RuiXueSdkDriver.IOSCallBackOnResponse, RuiXueSdkDriver.IOSCallBackOnError);
        }

        public void RelationList(string type, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            RuiXueSdkDriver.RegisterIOSCallBack("ios_social_getRelationListWithType", new IOSCallBackWrapper
            {
                onResponse = onResponse,
                onError = onError
            });

            ios_social_getRelationListWithType(type, RuiXueSdkDriver.IOSCallBackOnResponse, RuiXueSdkDriver.IOSCallBackOnError);
        }

        public void HasRelation(string target, string type, RequestResponseDelegate onResponse,
            RequestErrorDelegate onError)
        {
            RuiXueSdkDriver.RegisterIOSCallBack("ios_social_requestHasRelationWithTarget", new IOSCallBackWrapper
            {
                onResponse = onResponse,
                onError = onError
            });

            ios_social_requestHasRelationWithTarget(target, type, RuiXueSdkDriver.IOSCallBackOnResponse, RuiXueSdkDriver.IOSCallBackOnError);
        }

        public void AddFriends(string target, string target_remarks, string user_remarks,
            RequestResponseDelegate onResponse,
            RequestErrorDelegate onError)
        {
            RuiXueSdkDriver.RegisterIOSCallBack("ios_social_addFriendWithTarget", new IOSCallBackWrapper
            {
                onResponse = onResponse,
                onError = onError
            });

            ios_social_addFriendWithTarget(target, target_remarks, user_remarks, RuiXueSdkDriver.IOSCallBackOnResponse, RuiXueSdkDriver.IOSCallBackOnError);
        }

        public void RemoveFriends(string target, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            RuiXueSdkDriver.RegisterIOSCallBack("ios_social_deleteFriendWithTarget", new IOSCallBackWrapper
            {
                onResponse = onResponse,
                onError = onError
            });

            ios_social_deleteFriendWithTarget(target, RuiXueSdkDriver.IOSCallBackOnResponse, RuiXueSdkDriver.IOSCallBackOnError);
        }

        public void UpdateFriendRemarks(string target, string target_remarks, RequestResponseDelegate onResponse,
            RequestErrorDelegate onError)
        {
            RuiXueSdkDriver.RegisterIOSCallBack("ios_social_updateFriendRemarkWithTarget", new IOSCallBackWrapper
            {
                onResponse = onResponse,
                onError = onError
            });

            ios_social_updateFriendRemarkWithTarget(target, target_remarks, RuiXueSdkDriver.IOSCallBackOnResponse, RuiXueSdkDriver.IOSCallBackOnError);
        }

        public void RelationFriends(RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            RuiXueSdkDriver.RegisterIOSCallBack("ios_social_getFriendListWithComplete", new IOSCallBackWrapper
            {
                onResponse = onResponse,
                onError = onError
            });

            ios_social_getFriendListWithComplete(RuiXueSdkDriver.IOSCallBackOnResponse, RuiXueSdkDriver.IOSCallBackOnError);
        }

        public void IsFriend(string target, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            RuiXueSdkDriver.RegisterIOSCallBack("ios_social_requestIsFriendWithTarget", new IOSCallBackWrapper
            {
                onResponse = onResponse,
                onError = onError
            });
            
            ios_social_requestIsFriendWithTarget(target, RuiXueSdkDriver.IOSCallBackOnResponse, RuiXueSdkDriver.IOSCallBackOnError);
        }

        // 获取指定半径内的其他用户信息
        [DllImport("__Internal")]
        public static extern void ios_social_getRadiusAccountWithLon(double lon,
            double lat,
            int radius,
            int count,
            int page,
            int page_size,
            string type,
            IOSCallBackCommonDelegate onSuccess,
            IOSCallBackCommonDelegate onError);

// 设置用户自定义信息
        [DllImport("__Internal")]
        public static extern void ios_social_setUserCustomWithCustom(string custom,
            IOSCallBackCommonDelegate onSuccess,
            IOSCallBackCommonDelegate onError);

// 上报/更新经纬度坐标
        [DllImport("__Internal")]
        public static extern void ios_social_lbsUpdateWithLon(double lon,
            double lat,
            string typesArryJson,
            IOSCallBackCommonDelegate onSuccess,
            IOSCallBackCommonDelegate onError);

// 删除经纬度坐标
        [DllImport("__Internal")]
        public static extern void ios_social_deleteLocationWithTypes(string typesArryJson,
            IOSCallBackCommonDelegate onSuccess,
            IOSCallBackCommonDelegate onError);


// 添加自定义关系
        [DllImport("__Internal")]
        public static extern void ios_social_addRelationWithTarget(string target,
            string typesDicJson,
            string target_remarks,
            string user_remarks,
            IOSCallBackCommonDelegate onSuccess,
            IOSCallBackCommonDelegate onError);

        // 删除自定义关系
        [DllImport("__Internal")]
        public static extern void ios_social_deleteRelationWithTarget(string target,
            string typesDicJson,
            IOSCallBackCommonDelegate onSuccess,
            IOSCallBackCommonDelegate onError);


// 更新用户自定义关系备注
        [DllImport("__Internal")]
        public static extern void ios_social_updateRemarksWithTarget(string target,
            string target_reamks,
            string type,
            IOSCallBackCommonDelegate onSuccess,
            IOSCallBackCommonDelegate onError);

// 获取自定义关系列表
        [DllImport("__Internal")]
        public static extern void ios_social_getRelationListWithType(string type,
            IOSCallBackCommonDelegate onSuccess,
            IOSCallBackCommonDelegate onError);

        // 判断两用户是否存在某自定关系
        [DllImport("__Internal")]
        public static extern void ios_social_requestHasRelationWithTarget(string target,
            string type,
            IOSCallBackCommonDelegate onSuccess,
            IOSCallBackCommonDelegate onError);

// 添加好友
        [DllImport("__Internal")]
        public static extern void ios_social_addFriendWithTarget(string target,
            string target_remarks,
            string user_remarks,
            IOSCallBackCommonDelegate onSuccess,
            IOSCallBackCommonDelegate onError);

// 删除好友
        [DllImport("__Internal")]
        public static extern void ios_social_deleteFriendWithTarget(string target,
            IOSCallBackCommonDelegate onSuccess,
            IOSCallBackCommonDelegate onError);

// 更新好友备注
        [DllImport("__Internal")]
        public static extern void ios_social_updateFriendRemarkWithTarget(string target,
            string target_remarks,
            IOSCallBackCommonDelegate onSuccess,
            IOSCallBackCommonDelegate onError);

// 获取好友列表
        [DllImport("__Internal")]
        public static extern void ios_social_getFriendListWithComplete(IOSCallBackCommonDelegate onSuccess,
            IOSCallBackCommonDelegate onError);

// 判断两用户是否为好友
        [DllImport("__Internal")]
        public static extern void ios_social_requestIsFriendWithTarget(string target,
            IOSCallBackCommonDelegate onSuccess,
            IOSCallBackCommonDelegate onError);
    }
}
#endif