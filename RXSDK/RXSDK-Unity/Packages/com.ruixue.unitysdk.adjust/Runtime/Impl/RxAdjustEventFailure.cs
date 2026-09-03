using System;
using RuiXueLitJson;

namespace RuiXue.Adjust
{
    [Serializable]
    public class RxAdjustEventFailure
    {
        public bool willRetry;
        public string adid;
        public string message;
        public string timestamp;
        public string eventToken;
        public string callbackId;
        public JsonData jsonResponse;
    }
}