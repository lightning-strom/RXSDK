using System.Collections.Generic;
using System.Runtime.InteropServices;
#if UNITY_IOS
namespace RuiXue.Analysis.Impl
{
    internal class RXAnalysisIOS: IRXAnalysis
    {
        private Dictionary<string, int> _trackResult = new Dictionary<string, int>();

        public void DataTrack(string eventName, string distinctId, Dictionary<string, object> properties, RequestResponseDelegate onResponse,
            RequestErrorDelegate onError)
        {
            string jsonDic = RXJsonUtil.ToJson(properties);
            bool result = ios_analysis_addLogSingleWithEvent(eventName, distinctId, jsonDic);
            if (result)
            {
                _trackResult["code"] = 0;
                string json = RXJsonUtil.ToJson(_trackResult);
                onResponse?.Invoke(json);
            }
            else
            {
                _trackResult["code"] = -1;
                string json = RXJsonUtil.ToJson(_trackResult);
                onError?.Invoke(json);
            }
        }

        public void SetPublicProperties(Dictionary<string, object> publicProperties)
        {
            string jsonDic = RXJsonUtil.ToJson(publicProperties);
            ios_analysis_setPublicProperties(jsonDic);
        }

        public void UpdatePublicProperties(string key, object value)
        {
            var dict = new Dictionary<string, object>();
            dict.Add(key, value);
            string jsonDic = RXJsonUtil.ToJson(dict);
            ios_analysis_updatePublicProperties(jsonDic);
        }

        public void DeletePublicProperties(string key)
        {
            string[] keys = new string[1] { key };
            string arrayJson = RXJsonUtil.ToJson(keys);
            ios_analysis_deletePublicProperties(arrayJson);
        }
        
// 数据埋点（逐条上报）
        [DllImport("__Internal")]
       
        private static extern bool ios_analysis_addLogSingleWithEvent(string evt, string distinctId, string jsonDicProperties);

// 设置公共属性
        [DllImport("__Internal")]
       
        private static extern void ios_analysis_setPublicProperties(string jsonDicProperties);

// 修改公共属性
        [DllImport("__Internal")]
       
        private static extern void ios_analysis_updatePublicProperties(string jsonDicProperties);

// 删除公共属性
        [DllImport("__Internal")]
       
        private static extern void ios_analysis_deletePublicProperties(string jsonArrayPropterties);
    }
}
#endif