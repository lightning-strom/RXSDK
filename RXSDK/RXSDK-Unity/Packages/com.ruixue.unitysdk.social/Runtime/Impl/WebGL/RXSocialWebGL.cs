using System.Collections.Generic;
using System.Runtime.InteropServices;
using RuiXue.Impl;
using RuiXueLitJson;

#if UNITY_WEBGL
namespace RuiXue.Social.Impl
{
    public class RXSocialWebGL: JsCallBackHandlerBase, IRXSocial
    {
        public void LbsRadius(string type, float lon, float lat, float radius, int count, int page, int page_size,
            RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            var data = new JsonData
            {
                ["type"] = type,
                ["lon"] = lon,
                ["lat"] = lat,
                ["radius"] = radius,
                ["count"] = count,
                ["page"] = page,
                ["page_size"] = page_size
            };

            RegisterJsCallBack("rx_getNearlyPersonByRadius", onResponse, onError);
            rx_getNearlyPersonByRadius(data.ToJson());
        }

        public void UserSetCustom(string custom, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            RegisterJsCallBack("rx_userSetCustom", onResponse, onError);
            rx_userSetCustom(custom);
        }

        public void LbsUpdate(string[] types, float lon, float lat, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            var data = new JsonData
            {
                ["types"] = JsonMapper.ToObject(JsonMapper.ToJson(types)),
            };
            
            RegisterJsCallBack("rx_reportLocationUpdate", onResponse, onError);
            rx_reportLocationUpdate(data.ToJson());
        }

        public void LbsDelete(string[] types, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            var data = new JsonData
            {
                ["types"] = JsonMapper.ToObject(JsonMapper.ToJson(types)),
            };
            
            RegisterJsCallBack("rx_deleteReportLocation", onResponse, onError);
            rx_deleteReportLocation(data.ToJson());
        }

        public void RelationAdd(string target, Dictionary<string, object> types, string target_remarks, string user_remarks,
            RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            var data = new JsonData
            {
                ["target"] = target,
                ["types"] = JsonMapper.ToObject(JsonMapper.ToJson(types)),
            };
            if (!string.IsNullOrEmpty(target_remarks))
            {
                data["target_remarks"] = target_remarks;
            }

            if (!string.IsNullOrEmpty(user_remarks))
            {
                data["user_remarks"] = user_remarks;
            }
            
            RegisterJsCallBack("rx_addRelation", onResponse, onError);
            rx_addRelation(data.ToJson());
        }

        public void RelationDelete(string target, Dictionary<string, object> types, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            var data = new JsonData
            {
                ["target"] = target,
                ["types"] = JsonMapper.ToObject(JsonMapper.ToJson(types)),
            };
            
            RegisterJsCallBack("rx_deleteRelation", onResponse, onError);
            rx_deleteRelation(data.ToJson());
        }

        public void UpdateRemarks(string target, string type, string target_remarks, RequestResponseDelegate onResponse,
            RequestErrorDelegate onError)
        {
            var data = new JsonData
            {
                ["target"] = target,
                ["type"] = type,
                ["target_remarks"] = target_remarks,
            };
            RegisterJsCallBack("rx_updateRemarks", onResponse, onError);
            rx_updateRemarks(data.ToJson());
        }

        public void RelationList(string type, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            var data = new JsonData
            {
                ["type"] = type
            };
            
            RegisterJsCallBack("rx_relationList", onResponse, onError);
            rx_relationList(data.ToJson());
        }

        public void HasRelation(string target, string type, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            var data = new JsonData
            {
                ["target"] = target,
                ["type"] = type
            };
            
            RegisterJsCallBack("rx_hasRelation", onResponse, onError);
            rx_hasRelation(data.ToJson());
        }

        public void AddFriends(string target, string target_remarks, string user_remarks, RequestResponseDelegate onResponse,
            RequestErrorDelegate onError)
        {
            var data = new JsonData
            {
                ["target"] = target,
            };

            if (!string.IsNullOrEmpty(target_remarks))
            {
                data["target_remarks"] = target_remarks;
            }

            if (!string.IsNullOrEmpty(user_remarks))
            {
                data["user_remarks"] = user_remarks;
            }
            
            RegisterJsCallBack("rx_addFriend", onResponse, onError);
            rx_addFriend(data.ToJson());
        }

        public void RemoveFriends(string target, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            var data = new JsonData
            {
                ["target"] = target
            };
            
            RegisterJsCallBack("rx_deleteFriend", onResponse, onError);
            rx_deleteFriend(data.ToJson());
        }

        public void UpdateFriendRemarks(string target, string target_remarks, RequestResponseDelegate onResponse,
            RequestErrorDelegate onError)
        {
            var data = new JsonData
            {
                ["target"] = target,
                ["target_remarks"] = target_remarks
            };
            
            RegisterJsCallBack("rx_updateFriendRemarks", onResponse, onError);
            rx_updateFriendRemarks(data.ToJson());
        }

        public void RelationFriends(RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            RegisterJsCallBack("rx_friends", onResponse, onError);
            rx_friends();
        }

        public void IsFriend(string target, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            var data = new JsonData
            {
                ["target"] = target,
            };
            
            RegisterJsCallBack("rx_isFriend", onResponse, onError);
            rx_isFriend(data.ToJson());
        }
        
        [DllImport("__Internal")]
        private static extern void rx_getNearlyPersonByRadius(string json);
        
        [DllImport("__Internal")]
        private static extern void rx_reportLocationUpdate(string json);
        
        [DllImport("__Internal")]
        private static extern void rx_userSetCustom(string str);
        
        [DllImport("__Internal")]
        private static extern void rx_deleteReportLocation(string json);

        [DllImport("__Internal")]
        private static extern void rx_addRelation(string json);
        
        [DllImport("__Internal")]
        private static extern void rx_deleteRelation(string json);
        
        [DllImport("__Internal")]
        private static extern void rx_updateRemarks(string json);
        
        [DllImport("__Internal")]
        private static extern void rx_relationList(string json);
        
        [DllImport("__Internal")]
        private static extern void rx_hasRelation(string json);
        
        [DllImport("__Internal")]
        private static extern void rx_addFriend(string json);
        
        [DllImport("__Internal")]
        private static extern void rx_deleteFriend(string json);
        
        [DllImport("__Internal")]
        private static extern void rx_updateFriendRemarks(string json);
        
        [DllImport("__Internal")]
        private static extern void rx_isFriend(string json);
        
        [DllImport("__Internal")]
        private static extern void rx_friends();
    }
}
#endif