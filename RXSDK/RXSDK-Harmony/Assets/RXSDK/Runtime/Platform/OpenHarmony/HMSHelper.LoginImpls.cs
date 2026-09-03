using System;
using System.Collections.Generic;
using Newtonsoft.Json;
using UnityEngine;

namespace RXSDK
{
    public class HMSLoginImpl : Singleton<HMSLoginImpl>, ILoginHandler
    {
        public void DoLogin(string method, Dictionary<string, object> parm, Action<int, Dictionary<string, object>, string> callback)
        {
#if UNITY_OPENHARMONY && (!UNITY_EDITOR)
            HMSAPI.LoginOnUI((json) =>
            {
                Log.D(json);
                var res = JsonConvert.DeserializeObject<Dictionary<string, object>>(json);
                int code = (int)(res.TryGetValue("code", out object codeObj) && codeObj is long v ? v : -1);
                var jData = res.ContainsKey("data") ? res["data"] as Newtonsoft.Json.Linq.JObject : null;
                var data = jData?.ToObject<Dictionary<string, object>>();
                if (code == 0 && data != null)
                {
                    data.Add("openid", data["openID"]);
                    data.Add("unionid", data["unionID"]);
                    data.Add("serverAuthCode", data["authorizationCode"]);
                    data.Remove("authorizationCode");
                    data.Remove("openID");
                    data.Remove("unionID");
                }
                string message = res.ContainsKey("message") ? res["message"] as string : null;
                callback?.Invoke(code, data, message);
            });
#else
            callback?.Invoke(-1, null, $"currnet platform {Application.platform} not impl " + method);
#endif
        }
    }

    public class HMSUnionLoginImpl : Singleton<HMSUnionLoginImpl>, ILoginHandler
    {
        public void DoLogin(string method, Dictionary<string, object> parm, Action<int, Dictionary<string, object>, string> callback)
        {
            Log.D("harmony: " + RXUtility.ObjectToJson(parm));
            HMSAPI.UnionLoginOnUI(RXUtility.ObjectToJson(parm), (json) =>
            {
                var res = JsonConvert.DeserializeObject<Dictionary<string, object>>(json);
                int code = (int)(res.TryGetValue("code", out object codeObj) && codeObj is long v ? v : -1);
                Dictionary<string, object> data = null;
                if (code == 0 && res.ContainsKey("data"))
                {
                    var jData = res["data"] as Newtonsoft.Json.Linq.JObject;
                    data = jData?.ToObject<Dictionary<string, object>>();
                    if (data != null) data["version"] = "api12+";
                }
                string message = res.ContainsKey("message") ? res["message"] as string : null;
                callback?.Invoke(code, data, message);
            });
        }
    }

    class HMSUnionLogin2Impl : Singleton<HMSUnionLogin2Impl>, ILogin
    {
        public void DoLogin(UnionLoginArgs unionLoginArgs, RXCallback<LoginData> callback)
        {
            string loginParm = unionLoginArgs.ToJson();
            Log.D("harmony2: " + loginParm);
            HMSAPI.RXLogin(loginParm, (json) =>
            {
                var jsonData = JsonConvert.DeserializeObject<RXResult<LoginData>>(json);
                RXUtility.InvokeCallback(callback, jsonData.code, jsonData.Data, jsonData.Msg);
            });
        }
    }
}
