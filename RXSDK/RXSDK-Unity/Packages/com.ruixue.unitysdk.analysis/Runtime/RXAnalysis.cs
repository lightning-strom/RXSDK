using System.Collections.Generic;
using RuiXue.Analysis.Impl;

namespace RuiXue.Analysis
{
    public static class RXAnalysis
    {
#if UNITY_ANDROID
        private static readonly IRXAnalysis _sdk = new RXAnalysisAndroid();
#elif UNITY_IOS
        private static readonly IRXAnalysis _sdk = new RXAnalysisIOS();
#elif UNITY_WEBGL
        private static readonly IRXAnalysis _sdk = new RXAnalysisWebGL();
#else
        private static readonly IRXAnalysis _sdk = new RXAnalysisNotSupport();
#endif

        /// <summary>
        /// 埋点数据上报
        /// </summary>
        /// <param name="eventName"></param>
        /// <param name="distinctId"></param>
        /// <param name="properties"></param>
        /// <returns></returns>
        public static void DataTrack(string eventName, string distinctId, Dictionary<string, object> properties, 
            RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            _sdk.DataTrack(eventName, distinctId, properties, onResponse, onError);
        }

        /// <summary>
        /// 设置公共属性
        /// </summary>
        /// <param name="publicProperties"></param>
        public static void SetPublicProperties(Dictionary<string, object> publicProperties)
        {
            _sdk.SetPublicProperties(publicProperties);
        }

        /// <summary>
        /// 修改公共属性
        /// </summary>
        /// <param name="key"></param>
        /// <param name="value"></param>
        public static void UpdatePublicProperties(string key, object value)
        {
            _sdk.UpdatePublicProperties(key, value);
        }

        /// <summary>
        /// 删除公共属性
        /// </summary>
        /// <param name="key"></param>
        public static void DeletePublicProperties(string key)
        {
            _sdk.DeletePublicProperties(key);
        }

    }
}