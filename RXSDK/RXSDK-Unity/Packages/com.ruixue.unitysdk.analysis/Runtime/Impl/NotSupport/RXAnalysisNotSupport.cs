using System.Collections.Generic;
using UnityEngine;

namespace RuiXue.Analysis.Impl
{
    internal class RXAnalysisNotSupport:IRXAnalysis
    {
        public void DataTrack(string eventName, string distinctId, Dictionary<string, object> properties, 
            RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            LogUtil.WarningNotSupport("DataTrack");
        }

        public void SetPublicProperties(Dictionary<string, object> publicProperties)
        {
            LogUtil.WarningNotSupport("SetPublicProperties");
        }

        public void UpdatePublicProperties(string key, object value)
        {
            LogUtil.WarningNotSupport("UpdatePublicProperties");
        }

        public void DeletePublicProperties(string key)
        {
            LogUtil.WarningNotSupport("DeletePublicProperties");
        }
    }
}