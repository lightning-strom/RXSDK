using System.Collections.Generic;
using System.Runtime.InteropServices;
using RuiXue;
using RuiXue.Impl;
using RuiXueLitJson;

#if UNITY_WEBGL
namespace RuiXue.Analysis.Impl
{
    public class RXAnalysisWebGL:JsCallBackHandlerBase, IRXAnalysis
    {
        public void DataTrack(string eventName, string distinctId, Dictionary<string, object> properties, 
            RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            var data = new JsonData
            {
                ["event"] = eventName,
                ["distinctId"] = distinctId,
            };

            if (properties != null && properties.Count > 0)
            {
                data["properties"] = JsonMapper.ToObject(JsonMapper.ToJson(properties));
            }
            RegisterJsCallBack("rx_track", onResponse, onError);
            rx_track(data.ToJson());
        }

        public void SetPublicProperties(Dictionary<string, object> publicProperties)
        {
            string json = RXJsonUtil.ToJson(publicProperties);
            rx_setPublicProperties(json);
        }

        public void UpdatePublicProperties(string key, object value)
        {
            Dictionary<string, object> dic = new Dictionary<string, object>()
            {
                {key, value}
            };
            
            string json = RXJsonUtil.ToJson(dic);
            rx_updatePublicProperties(json);
        }

        public void DeletePublicProperties(string key)
        {
            string[] keys = new[] { key };
            string arrayJson = RXJsonUtil.ToJson(keys);
            rx_deletePublicProperties(arrayJson);
        }
        
        [DllImport("__Internal")]
        private static extern void rx_track(string json);
        
        [DllImport("__Internal")]
        private static extern void rx_setPublicProperties(string json);
        
        [DllImport("__Internal")]
        private static extern void rx_updatePublicProperties(string json);
        
        [DllImport("__Internal")]
        private static extern void rx_deletePublicProperties(string json);
    }
}
#endif