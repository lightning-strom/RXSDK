using System;
using Newtonsoft.Json.Linq;
using RXSDK.Platform;
using UnityEngine;

namespace RXSDK
{

    public interface IPush
    {
        string BrandName { get; }
        string DeivceToken { get; }
        void AddTags(string[] alias);
        void DelTags(string[] alias);

        void BindAlias(string alias);

        void RegisterToken(Action<int, object, string> callback);

        void UnRegisterToken(Action<int, object, string> callback);

        void ReportNotifyStatus(string taskId);
    }


    public class PushManager : Singleton<PushManager>, IPush
    {
        public static readonly string HMS_PUSH_TOKEN_KEY = "hms_push_token";
        private string _deviceToken;
        public string DeivceToken
        {
            get
            {
                _deviceToken ??= PlayerPrefs.GetString(HMS_PUSH_TOKEN_KEY);
                return _deviceToken;
            }
            private set
            {
                _deviceToken = value;
                PlayerPrefs.SetString(HMS_PUSH_TOKEN_KEY, _deviceToken);
            }
        }

        public string BrandName { get { return "harmonypush"; } }

        public void AddTags(string[] alias)
        {
            PushAPI.Instance.AddTags(alias);
        }
        public void DelTags(string[] alias)
        {
            PushAPI.Instance.DelTags(alias);
        }

        public void BindAlias(string alias)
        {
            PushAPI.Instance.BindAlias(alias);
        }

        public void RegisterToken(Action<int, object, string> callback)
        {
            PlatformProvider.Current.RegisterToken((resp) =>
            {
                JObject jsonObject = JObject.Parse(resp);
                // 检查code是否为0表示成功  
                int code = (int)jsonObject["code"];
                if (code == 0)
                {
                    // 安全地获取data字段中的token  
                    string token = (string)jsonObject["data"]["token"];
                    // 使用token  
                    DeivceToken = token;
                    Log.D("token= " + token);
                    PushAPI.Instance.BindDevice(BrandName, DeivceToken, callback);
                }
                else
                {
                    // 处理非零code的情况  
                    Log.D("操作失败，code: " + code);
                    callback.Invoke(code, null, (string)jsonObject["message"]);
                }
            });
        }

        public void UnRegisterToken(Action<int, object, string> callback)
        {
            PlatformProvider.Current.UnRegisterToken((resp) =>
            {
                JObject jsonObject = JObject.Parse(resp);
                // 检查code是否为0表示成功  
                int code = (int)jsonObject["code"];
                if (code == 0)
                {
                    //使用token  
                    PushAPI.Instance.UnbindDevice(BrandName, DeivceToken, callback);
                }
                else
                {
                    // 处理非零code的情况  
                    Log.D("操作失败，code: " + code);
                    callback.Invoke(code, null, (string)jsonObject["message"]);
                }
            });

        }

        public void ReportNotifyStatus(string taskId)
        {
            PushAPI.Instance.ReportNotifyStatus(BrandName, DeivceToken, taskId, ReportType.Click);
        }

    }
}