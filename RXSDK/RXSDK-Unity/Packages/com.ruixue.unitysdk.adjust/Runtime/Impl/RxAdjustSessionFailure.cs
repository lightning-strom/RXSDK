using System;
using RuiXueLitJson;

namespace RuiXue.Adjust
{
    [Serializable]
    public class RxAdjustSessionFailure
    {
        public bool willRetry;
        public string adid;
        public string message;
        public string timestamp;
        public JsonData jsonResponse;
    }
}