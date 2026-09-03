#if UNITY_ANDROID
using System.Collections.Generic;
using RuiXueLitJson;
using UnityEngine;

namespace RuiXue.Social.Impl
{
    internal class RXSocialAndroid : IRXSocial
    {
        
        private static AndroidJavaClass _unityPlayer;
        private static AndroidJavaObject _rxSdkObj;
        private static AndroidJavaObject _contextObj;
        private static AndroidJavaObject _rxApiObj;
        private static AndroidJavaClass _jSONUtil;

        public RXSocialAndroid()
        {
            _unityPlayer = new AndroidJavaClass("com.unity3d.player.UnityPlayer");
            _rxSdkObj = new AndroidJavaClass("com.ruixue.RuiXueSdk");
            _contextObj = _unityPlayer.GetStatic<AndroidJavaObject>("currentActivity");
            _rxApiObj = _rxSdkObj.CallStatic<AndroidJavaObject>("getRXSdkApi");
            _jSONUtil = new AndroidJavaClass("com.ruixue.utils.JSONUtil");
        }
        
        public void LbsRadius(string type, float lon, float lat, float radius, int count, int page, int page_size,
            RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            _rxApiObj.Call("lbsRadius", type, lon, lat, radius, count, page, page_size, 
                new JsonCallbackJavaProxy(onResponse, onError));
        }

        public void UserSetCustom(string custom, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            _rxApiObj.Call("userSetCustom", custom, new JsonCallbackJavaProxy(onResponse, onError));
        }

        public void LbsUpdate(string[] types, float lon, float lat, 
            RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            AndroidJavaObject list = JavaArrayListExtensionMethod.CreateJavaArrayList();
            AndroidJavaObject[] javaArr = null;
            if (types != null)
            {
                foreach (var item in types)
                {
                    list.Add(item);
                }
                javaArr = list.Call<AndroidJavaObject[]>("toArray");
            }
            _rxApiObj.Call("lbsUpdate", javaArr, lon, lat, 
                new JsonCallbackJavaProxy(onResponse, onError));
        }

        public void LbsDelete(string[] types, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            AndroidJavaObject list = JavaArrayListExtensionMethod.CreateJavaArrayList();
            AndroidJavaObject[] javaArr = null;
            if (types != null)
            {
                foreach (var item in types)
                {
                    list.Add(item);
                }
                javaArr = list.Call<AndroidJavaObject[]>("toArray");
            }

            _rxApiObj.Call("lbsDelete", javaArr, new JsonCallbackJavaProxy(onResponse, onError));
        }

        public void RelationAdd(string target, Dictionary<string, object> types, string target_remarks, string user_remarks,
            RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            AndroidJavaObject typeJavaObj = null;
            if (types != null)
            {
                string jsonStr = JsonMapper.ToJson(types);
                typeJavaObj = _jSONUtil.CallStatic<AndroidJavaObject>("toMap", jsonStr);
            }
            _rxApiObj.Call("relationAdd", target, typeJavaObj, target_remarks, user_remarks, 
                new JsonCallbackJavaProxy(onResponse, onError));
        }

        public void RelationDelete(string target, Dictionary<string, object> types, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            AndroidJavaObject typeJavaObj = null;
            if (types != null)
            {
                string jsonStr = JsonMapper.ToJson(types);
                typeJavaObj = _jSONUtil.CallStatic<AndroidJavaObject>("toMap", jsonStr);
            }

            _rxApiObj.Call("relationDelete", target, typeJavaObj, 
                new JsonCallbackJavaProxy(onResponse, onError));
        }

        public void UpdateRemarks(string target, string type, string target_remarks, RequestResponseDelegate onResponse,
            RequestErrorDelegate onError)
        {
            _rxApiObj.Call("updateRemarks", target, type, target_remarks, 
                new JsonCallbackJavaProxy(onResponse, onError));
        }

        public void RelationList(string type, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            _rxApiObj.Call("relationList", type, new JsonCallbackJavaProxy(onResponse, onError));
        }

        public void HasRelation(string target, string type, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            _rxApiObj.Call("hasRelation", target, type, 
                new JsonCallbackJavaProxy(onResponse, onError));
        }

        public void AddFriends(string target, string target_remarks, string user_remarks, RequestResponseDelegate onResponse,
            RequestErrorDelegate onError)
        {
            _rxApiObj.Call("addFriends", target, target_remarks, user_remarks, 
                new JsonCallbackJavaProxy(onResponse, onError));
        }

        public void RemoveFriends(string target, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            _rxApiObj.Call("removeFriends", 
                target, new JsonCallbackJavaProxy(onResponse, onError));
        }

        public void UpdateFriendRemarks(string target, string target_remarks, RequestResponseDelegate onResponse,
            RequestErrorDelegate onError)
        {
            _rxApiObj.Call("updateFriendRemarks", target, target_remarks,
                new JsonCallbackJavaProxy(onResponse, onError));
        }

        public void RelationFriends(RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            _rxApiObj.Call("relationFriends", new JsonCallbackJavaProxy(onResponse, onError));
        }

        public void IsFriend(string target, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            _rxApiObj.Call("isFriend", target, new JsonCallbackJavaProxy(onResponse, onError));
        }
    }
}
#endif