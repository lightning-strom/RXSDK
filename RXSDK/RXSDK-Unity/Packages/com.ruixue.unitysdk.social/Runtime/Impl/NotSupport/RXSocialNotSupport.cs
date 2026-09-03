using System.Collections.Generic;

namespace RuiXue.Social.Impl
{
    internal class RXSocialNotSupport:IRXSocial
    {
        public void LbsRadius(string type, float lon, float lat, float radius, int count, int page, int page_size,
            RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            LogUtil.WarningNotSupport("LbsRadius");
        }

        public void UserSetCustom(string custom, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            LogUtil.WarningNotSupport("UserSetCustom");
        }

        public void LbsUpdate(string[] types, float lon, float lat, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            LogUtil.WarningNotSupport("LbsUpdate");
        }

        public void LbsDelete(string[] types, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            LogUtil.WarningNotSupport("LbsDelete");
        }

        public void RelationAdd(string target, Dictionary<string, object> types, string target_remarks, string user_remarks,
            RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            LogUtil.WarningNotSupport("RelationAdd");
        }

        public void RelationDelete(string target, Dictionary<string, object> types, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            LogUtil.WarningNotSupport("RelationDelete");
        }

        public void UpdateRemarks(string target, string type, string target_remarks, RequestResponseDelegate onResponse,
            RequestErrorDelegate onError)
        {
            LogUtil.WarningNotSupport("UpdateRemarks");
        }

        public void RelationList(string type, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            LogUtil.WarningNotSupport("RelationList");
        }

        public void HasRelation(string target, string type, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            LogUtil.WarningNotSupport("HasRelation");
        }

        public void AddFriends(string target, string target_remarks, string user_remarks, RequestResponseDelegate onResponse,
            RequestErrorDelegate onError)
        {
            LogUtil.WarningNotSupport("AddFriends");
        }

        public void RemoveFriends(string target, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            LogUtil.WarningNotSupport("RemoveFriends");
        }

        public void UpdateFriendRemarks(string target, string target_remarks, RequestResponseDelegate onResponse,
            RequestErrorDelegate onError)
        {
            LogUtil.WarningNotSupport("UpdateFriendRemarks");
        }

        public void RelationFriends(RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            LogUtil.WarningNotSupport("RelationFriends");
        }

        public void IsFriend(string target, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            LogUtil.WarningNotSupport("IsFriend");
        }
    }
}