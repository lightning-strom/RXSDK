using System.Collections.Generic;
using RuiXue.Social.Impl;

namespace RuiXue.Social
{
    public static class RXSocial
    {
#if UNITY_ANDROID
        private static readonly IRXSocial _sdk = new RXSocialAndroid();
#elif UNITY_IOS
        private static readonly IRXSocial _sdk = new RXSocialIOS();
#elif UNITY_WEBGL
        private static readonly IRXSocial _sdk = new RXSocialWebGL();
#else
        private static readonly IRXSocial _sdk = new RXSocialNotSupport();
#endif
        /// <summary>
        /// 获取附近人
        /// </summary>
        /// <param name="types"></param>
        /// <param name="lon"></param>
        /// <param name="lat"></param>
        /// <param name="radius"></param>
        /// <param name="count"></param>
        /// <param name="page"></param>
        /// <param name="page_size"></param>
        /// <param name="onResponse"></param>
        /// <param name="onError"></param>
        public static void LbsRadius(string type, float lon, float lat, float radius, int count, int page,
            int page_size, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            _sdk.LbsRadius(type, lon, lat, radius, count, page, page_size, onResponse, onError);
        }

        /// <summary>
        /// 设置用户自定义信息
        /// </summary>
        /// <param name="custom"></param>
        /// <param name="onResponse"></param>
        /// <param name="onError"></param>
        public static void UserSetCustom(string custom, RequestResponseDelegate onResponse,
            RequestErrorDelegate onError)
        {
            _sdk.UserSetCustom(custom, onResponse, onError);
        }

        /// <summary>
        /// 上报/更新经纬度坐标
        /// </summary>
        /// <param name="types"></param>
        /// <param name="lon"></param>
        /// <param name="lat"></param>
        /// <param name="onResponse"></param>
        /// <param name="onError"></param>
        public static void LbsUpdate(string[] types, float lon, float lat,
            RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            _sdk.LbsUpdate(types, lon, lat, onResponse, onError);
        }

        /// <summary>
        /// 删除经纬度坐标
        /// </summary>
        /// <param name="types"></param>
        /// <param name="onResponse"></param>
        /// <param name="onError"></param>
        public static void LbsDelete(string[] types, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            _sdk.LbsDelete(types, onResponse, onError);
        }

        /// <summary>
        /// 设置自定义关系
        /// </summary>
        /// <param name="target"></param>
        /// <param name="types"></param>
        /// <param name="target_remarks"></param>
        /// <param name="user_remarks"></param>
        /// <param name="onResponse"></param>
        /// <param name="onError"></param>
        public static void RelationAdd(string target, Dictionary<string, object> types, string target_remarks,
            string user_remarks, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            _sdk.RelationAdd(target, types, target_remarks, user_remarks, onResponse, onError);
        }

        /// <summary>
        /// 删除自定义关系
        /// </summary>
        /// <param name="target"></param>
        /// <param name="types"></param>
        /// <param name="onResponse"></param>
        /// <param name="onError"></param>
        public static void RelationDelete(string target, Dictionary<string, object> types,
            RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            _sdk.RelationDelete(target, types, onResponse, onError);
        }

        /// <summary>
        /// 更新用户自定义关系备注
        /// </summary>
        /// <param name="target"></param>
        /// <param name="type"></param>
        /// <param name="target_remarks"></param>
        /// <param name="onResponse"></param>
        /// <param name="onError"></param>
        public static void UpdateRemarks(string target, string type, string target_remarks,
            RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            _sdk.UpdateRemarks(target, type, target_remarks, onResponse, onError);
        }

        /// <summary>
        /// 获取自定关系列表
        /// </summary>
        /// <param name="type"></param>
        /// <param name="onResponse"></param>
        /// <param name="onError"></param>
        public static void RelationList(string type, RequestResponseDelegate onResponse,
            RequestErrorDelegate onError)
        {
            _sdk.RelationList(type, onResponse, onError);
        }

        /// <summary>
        /// 判断两用户是否存在某自定关系
        /// </summary>
        /// <param name="target"></param>
        /// <param name="type"></param>
        /// <param name="onResponse"></param>
        /// <param name="onError"></param>
        public static void HasRelation(string target, string type,
            RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            _sdk.HasRelation(target, type, onResponse, onError);
        }

        /// <summary>
        /// 设置好友关系
        /// </summary>
        /// <param name="target"></param>
        /// <param name="target_remarks"></param>
        /// <param name="user_remarks"></param>
        /// <param name="onResponse"></param>
        /// <param name="onError"></param>
        public static void AddFriends(string target, string target_remarks, string user_remarks,
            RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            _sdk.AddFriends(target, target_remarks, user_remarks, onResponse, onError);
        }

        /// <summary>
        /// 删除好友
        /// </summary>
        /// <param name="target"></param>
        /// <param name="onResponse"></param>
        /// <param name="onError"></param>
        public static void RemoveFriends(string target, RequestResponseDelegate onResponse,
            RequestErrorDelegate onError)
        {
            _sdk.RemoveFriends(target, onResponse, onError);
        }

        /// <summary>
        /// 更新好友备注
        /// </summary>
        /// <param name="target"></param>
        /// <param name="target_remarks"></param>
        /// <param name="onResponse"></param>
        /// <param name="onError"></param>
        public static void UpdateFriendRemarks(string target, string target_remarks, RequestResponseDelegate onResponse,
            RequestErrorDelegate onError)
        {
            _sdk.UpdateFriendRemarks(target, target_remarks, onResponse, onError);
        }

        /// <summary>
        /// 获取好友列表
        /// </summary>
        /// <param name="onResponse"></param>
        /// <param name="onError"></param>
        public static void RelationFriends(RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            _sdk.RelationFriends(onResponse, onError);
        }

        /// <summary>
        /// 判断两用户是否为好友
        /// </summary>
        /// <param name="target"></param>
        /// <param name="onResponse"></param>
        /// <param name="onError"></param>
        public static void IsFriend(string target, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            _sdk.IsFriend(target, onResponse, onError);
        }
    }
}