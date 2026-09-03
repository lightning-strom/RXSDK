using System.Collections.Generic;

namespace RuiXue.Google.Impl
{
    public interface IRXGoogle
    {
        /// <summary>
        /// 注册ClientID,
        /// </summary>
        /// <param name="clientID"></param>
        public void Regist(string clientID);
        
        /// <summary>
        /// Google 商品详情查询
        /// </summary>
        /// <param name="skusList"></param>
        /// <param name="onResponse"></param>
        /// <param name="channelCallback"></param>
        public void QueryProductDetailsAsync(List<string> skusList, 
            RequestResponseDelegate onResponse, RequestErrorDelegate errorDelegate);
    }
}
