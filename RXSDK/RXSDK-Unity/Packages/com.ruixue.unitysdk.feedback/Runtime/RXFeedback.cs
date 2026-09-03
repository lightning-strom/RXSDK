using System.Collections.Generic;
using RuiXue.Feedback.Impl;

namespace RuiXue.Feedback
{
    public static class RXFeedback
    {
#if UNITY_ANDROID
        private static readonly IRXFeedback _sdk = new RXFeedbackAndroid();
#elif UNITY_IOS
        private static readonly IRXFeedback _sdk = new RXFeedbackIOS();
#elif UNITY_WEBGL
        private static readonly IRXFeedback _sdk = new RXFeedbackWebGL();        
#else
        private static readonly IRXFeedback _sdk = new RXFeedbackNotSupport();
#endif
        
        /// <summary>
        /// 获取意见反馈类型
        /// </summary>
        /// <param name="onResponse"></param>
        /// <param name="onError"></param>
        public static void GetFeedbackKindList(RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            _sdk.GetFeedbackKindList(onResponse, onError);
        }

        /// <summary>
        /// 创建意见反馈
        /// </summary>
        /// <param name="dic"></param>
        /// <param name="onResponse"></param>
        /// <param name="onError"></param>
        public static void CreateFeedback(Dictionary<string, object> dic,
            RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            _sdk.CreateFeedback(dic, onResponse, onError);
        }

        /// <summary>
        /// 满意度评价
        /// </summary>
        /// <param name="dic"></param>
        /// <param name="onResponse"></param>
        /// <param name="onError"></param>
        public static void SatisfactionEvaluation(Dictionary<string, object> dic,
            RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            _sdk.SatisfactionEvaluation(dic, onResponse, onError);
        }

        /// <summary>
        /// 上报反馈日志
        /// </summary>
        /// <param name="data"></param>
        /// <param name="onResponse"></param>
        /// <param name="onError"></param>
        public static void ReportFeedbackLog(byte[] data,
            RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            _sdk.ReportFeedbackLog(data, onResponse, onError);
        }
    }
}