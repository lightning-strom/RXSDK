using System.Collections.Generic;
using System.Runtime.InteropServices;
using RuiXue.Impl;
#if UNITY_WEBGL
namespace RuiXue.Feedback.Impl
{
    public class RXFeedbackWebGL:JsCallBackHandlerBase, IRXFeedback
    {
        public void GetFeedbackKindList(RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            RegisterJsCallBack("rx_getFeedbackKindList", onResponse, onError);
            rx_getFeedbackKindList();
        }

        public void CreateFeedback(Dictionary<string, object> hashMap, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            string json = RXJsonUtil.ToJson(hashMap);
            
            RegisterJsCallBack("rx_createFeedback", onResponse, onError);
            rx_createFeedback(json);
        }

        public void SatisfactionEvaluation(Dictionary<string, object> hashMap, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            string json = RXJsonUtil.ToJson(hashMap);
            
            RegisterJsCallBack("rx_satisfactionEvaluation", onResponse, onError);
            rx_satisfactionEvaluation(json);
        }

        public void ReportFeedbackLog(byte[] data, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            LogUtil.WarningNotSupport("ReportFeedbackLog");
        }
        
        [DllImport("__Internal")]
        private static extern void rx_getFeedbackKindList();
        
        [DllImport("__Internal")]
        private static extern void rx_createFeedback(string json);
        
        [DllImport("__Internal")]
        private static extern void rx_satisfactionEvaluation(string json);
    }
}
#endif