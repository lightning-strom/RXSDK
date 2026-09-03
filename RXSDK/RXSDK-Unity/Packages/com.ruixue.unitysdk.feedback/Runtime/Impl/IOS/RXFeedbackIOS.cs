using System.Collections.Generic;
using System.Runtime.InteropServices;
#if UNITY_IOS
namespace RuiXue.Feedback.Impl
{
    internal class RXFeedbackIOS: IRXFeedback
    {
        public void GetFeedbackKindList(RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            RuiXueSdkDriver.RegisterIOSCallBack("ios_getFeedbackKindList", new IOSCallBackWrapper
            {
                onResponse = onResponse,
                onError = onError
            });

            ios_getFeedbackKindList(RuiXueSdkDriver.IOSCallBackOnResponse,
                RuiXueSdkDriver.IOSCallBackOnError);
        }

        public void CreateFeedback(Dictionary<string, object> hashMap, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            string jsonDic = RXJsonUtil.ToJson(hashMap);
            
            RuiXueSdkDriver.RegisterIOSCallBack("ios_createFeedbackWithParams", new IOSCallBackWrapper
            {
                onResponse = onResponse,
                onError = onError
            });
            
            ios_createFeedbackWithParams(jsonDic, RuiXueSdkDriver.IOSCallBackOnResponse,
                RuiXueSdkDriver.IOSCallBackOnError);
        }

        public void SatisfactionEvaluation(Dictionary<string, object> hashMap, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            string jsonDic = RXJsonUtil.ToJson(hashMap);
            
            RuiXueSdkDriver.RegisterIOSCallBack("ios_satisfactionEvaluationWithParams", new IOSCallBackWrapper
            {
                onResponse = onResponse,
                onError = onError
            });
            
            ios_satisfactionEvaluationWithParams(jsonDic, RuiXueSdkDriver.IOSCallBackOnResponse,
                RuiXueSdkDriver.IOSCallBackOnError);
        }

        public void ReportFeedbackLog(byte[] data, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            RuiXueSdkDriver.RegisterIOSCallBack("ios_reportFeedbackLogWithData", new IOSCallBackWrapper
            {
                onResponse = onResponse,
                onError = onError
            });
            
            ios_reportFeedbackLogWithData(data, data.Length, RuiXueSdkDriver.IOSCallBackOnResponse,
                RuiXueSdkDriver.IOSCallBackOnError);
        }
        
// 获取意见反馈类型
        [DllImport("__Internal")]
        private static extern void ios_getFeedbackKindList(IOSCallBackCommonDelegate onSuccess,
            IOSCallBackCommonDelegate onError);

// 创建意见反馈
        [DllImport("__Internal")]
        private static extern void  ios_createFeedbackWithParams(string paramDicJson, IOSCallBackCommonDelegate onSuccess,
            IOSCallBackCommonDelegate onError);

// 满意度评价
        [DllImport("__Internal")]
        private static extern void ios_satisfactionEvaluationWithParams(string paramDicJson, IOSCallBackCommonDelegate onSuccess,
            IOSCallBackCommonDelegate onError);

// 上报反馈日志
        [DllImport("__Internal")]
        private static extern void ios_reportFeedbackLogWithData(byte[] byteData, int length,
            IOSCallBackCommonDelegate onSuccess,
            IOSCallBackCommonDelegate onError);
    }
}
#endif