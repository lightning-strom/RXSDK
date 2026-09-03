using System;
using RuiXueLitJson;

namespace RuiXue.Adjust
{
    [Serializable]
    public class RxAdjustSessionSuccess
    {
        public string adid;
        public string message;
        public string timestamp;
        public JsonData jsonResponse;
    }
}