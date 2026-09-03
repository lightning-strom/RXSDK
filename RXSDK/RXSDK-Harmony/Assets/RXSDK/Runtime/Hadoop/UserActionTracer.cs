
using System;
using System.Collections.Generic;
using RXSDK.Platform;

namespace RXSDK
{
    class UserActionTracer
    {
        public static RXCallback<object> CheckUpdateIntercept(Action<int, object, string> callback)
        {
            return (ret, e) =>
            {
                string message = !string.IsNullOrEmpty(ret.msg) ? ret.msg : e?.Message;
                TraceVersionCheck(ret);
                callback?.Invoke(ret.code, ret.data, message);
            };
        }
        private static void TraceVersionCheck(RXResult<object> data)
        {
            var dic = new Dictionary<string, object>
            {
                { "scene", "version_check" }
            };
            if (data?.Code == 0)
            {
                dic.Add("action", "success");
            }
            else
            {
                dic.Add("action", "fail");
            }
            TrackUserAction(dic);
        }


        public static void TrackUserAction(Dictionary<string, object> trackData, string distinctId = null)
        {
            if (distinctId != null)
            {
                trackData = new Dictionary<string, object>(trackData) { ["distinct_id"] = distinctId };
            }
            PlatformProvider.Current.TrackUserAction(RXUtility.ObjectToJson(trackData));
        }

        public static void StopTrackUserAction()
        {
            PlatformProvider.Current.StopTrackUserAction();
        }

    }
}