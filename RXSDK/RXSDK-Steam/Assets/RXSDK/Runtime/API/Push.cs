
using System;
using System.Collections.Generic;

namespace RXSDK
{
    public enum ReportType
    {
        Arrived = 2,
        Click
    }

    public interface IPushAPI
    {
        void ReportNotifyStatus(string brandName, string deviceToken, string taskId, ReportType reportType);

        void AddTags(string[] alias);

        void DelTags(string[] alias);

        void BindAlias(string alias);

        void UnbindDevice(string brandName, string deviceToken, Action<int, object, string> callback);

        void BindDevice(string brandName, string deviceToken, Action<int, object, string> callback);
    }

    class PushAPI : Singleton<PushAPI>, IPushAPI
    {
        static string BIND_DEVICE = "v1/pusher/device/bind_device";
        static string BIND_ALIAS = "v1/pusher/device/bind_alias";
        static string ADD_TAGS = "v1/pusher/device/add_tags";
        static string DEL_TAGS = "v1/pusher/device/del_tags";
        static string UNBIND_DEVICE = "v1/pusher/device/unbind_device";
        static string NOTIFY_REPORT = "v1/pusher/notify/device";
        public void AddTags(string[] alias)
        {
            Dictionary<string, object> args = new()
            {
                { "tags", alias },

            };
            API.Post(ADD_TAGS, args);

        }

        public void BindAlias(string alias)
        {

            Dictionary<string, object> args = new()
            {
                { "alias", alias },

            };
            API.Post(BIND_ALIAS, args);
        }

        public void BindDevice(string brandName, string deviceToken, Action<int, object, string> callback)
        {
            Dictionary<string, object> args = new()
            {
                { "device_code", deviceToken },
                { "type", brandName }

            };
            API.Post(BIND_DEVICE, args);
        }

        public void DelTags(string[] alias)
        {
            Dictionary<string, object> args = new()
            {
                { "tags", alias }

            };
            API.Post(DEL_TAGS, args);
        }

        public void ReportNotifyStatus(string brandName, string deviceToken, string taskId, ReportType reportType)
        {
            Dictionary<string, object> args = new()
            {
                { "task_id", taskId },
                { "device_code", deviceToken },
                { "openid", PassportManager.Instance.GetDistinctId() },
                { "type", brandName },
                { "status", reportType }
            };
            API.PostUnAuth(NOTIFY_REPORT, args);
        }

        public void UnbindDevice(string brandName, string deviceToken, Action<int, object, string> callback)
        {
            Dictionary<string, object> args = new()
            {
                { "device_code", deviceToken },
                { "type", brandName }
            };
            API.Post(UNBIND_DEVICE, args);
        }
    }
}