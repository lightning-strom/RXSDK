using System.Collections.Generic;

namespace RuiXue.Feedback.Impl
{
    internal class RXFeedbackNotSupport:IRXFeedback
    {
        public void GetFeedbackKindList(RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            LogUtil.WarningNotSupport("GetFeedbackKindList");
        }

        public void CreateFeedback(Dictionary<string, object> hashMap, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            LogUtil.WarningNotSupport("CreateFeedback");
        }

        public void SatisfactionEvaluation(Dictionary<string, object> hashMap, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            LogUtil.WarningNotSupport("SatisfactionEvaluation");
        }

        public void ReportFeedbackLog(byte[] data, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            LogUtil.WarningNotSupport("ReportFeedbackLog");
        }
    }
}