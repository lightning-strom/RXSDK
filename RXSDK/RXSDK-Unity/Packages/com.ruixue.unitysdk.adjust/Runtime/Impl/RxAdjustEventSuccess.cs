using System;
using RuiXueLitJson;

namespace RuiXue.Adjust
{
    [Serializable]
    public class RxAdjustEventSuccess
    {
        public string adid;
        public string message;
        public string timestamp;
        public string eventToken;
        public string callbackId;
        
        public JsonData jsonResponse;
    }
}