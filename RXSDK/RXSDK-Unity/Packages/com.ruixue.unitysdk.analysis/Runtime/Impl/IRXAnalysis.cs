using System.Collections.Generic;
namespace RuiXue.Analysis.Impl
{
    internal interface IRXAnalysis
    {
        /// <summary>
        /// 埋点数据上报
        /// </summary>
        /// <param name="eventName"></param>
        /// <param name="distinctId"></param>
        /// <param name="properties"></param>
        /// <returns></returns>
        public void DataTrack(string eventName, string distinctId, Dictionary<string, object> properties, 
            RequestResponseDelegate onResponse, RequestErrorDelegate onError);

        /// <summary>
        /// 设置公共属性
        /// </summary>
        /// <param name="publicProperties"></param>
        public void SetPublicProperties(Dictionary<string, object> publicProperties);

        /// <summary>
        /// 修改公共属性
        /// </summary>
        /// <param name="key"></param>
        /// <param name="value"></param>
        public void UpdatePublicProperties(string key, object value);

        /// <summary>
        /// 删除公共属性
        /// </summary>
        /// <param name="key"></param>
        public void DeletePublicProperties(string key);
    }
}
