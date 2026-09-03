using System.Collections.Generic;

namespace RuiXue.Feedback.Impl
{
    internal interface IRXFeedback
    {
        /// <summary>
        /// 获取意见反馈类型
        /// </summary>
        /// <param name="onResponse"></param>
        /// <param name="onError"></param>
        public void GetFeedbackKindList(RequestResponseDelegate onResponse, RequestErrorDelegate onError);

        /// <summary>
        /// 创建意见反馈
        /// </summary>
        /// <param name="hashMap"></param>
        /// <param name="onResponse"></param>
        /// <param name="onError"></param>
        public void CreateFeedback(Dictionary<string, object> hashMap, 
            RequestResponseDelegate onResponse, RequestErrorDelegate onError);

        /// <summary>
        /// 满意度评价
        /// </summary>
        /// <param name="hashMap"></param>
        /// <param name="onResponse"></param>
        /// <param name="onError"></param>
        public void SatisfactionEvaluation(Dictionary<string, object> hashMap, 
            RequestResponseDelegate onResponse, RequestErrorDelegate onError);

        /// <summary>
        /// 上报反馈日志
        /// </summary>
        /// <param name="data"></param>
        /// <param name="onResponse"></param>
        /// <param name="onError"></param>
        public void ReportFeedbackLog(byte[] data, 
            RequestResponseDelegate onResponse, RequestErrorDelegate onError);
    }
}
