using System;
using System.Collections.Generic;

namespace RuiXue.Adjust
{
    [Serializable]
    public class RxAdjustEvent
    {
        public string eventToken;
        public double revenue = -1;
        public string currency;
        public Dictionary<string, string> callbackParameters;
        public Dictionary<string, string> partnerParameters;
        public string orderId;
        public string callbackId;
        
        
        /**
     * 实例化事件
     * @param var1 事件码
     */
        public RxAdjustEvent(string var1) {
            this.eventToken = var1;
        }

        /**
         * 设置收入
         * @param var1 收入数值
         * @param var3 收入单位
         */
        public void setRevenue(double var1, string var3) {
            this.revenue = var1;
            this.currency = var3;
        }

        /**
         * 添加回传参数
         * @param key 参数key
         * @param value 参数value
         */
        public void addCallbackParameter(string key, string value) {
            
            if (callbackParameters == null) {
                callbackParameters = new Dictionary<string, string>();
            }

            callbackParameters.Add(key, value);

        }

        /**
         * 添加合作伙伴回传参数
         * @param key 参数key
         * @param value 参数value
         */
        public void addPartnerParameter(string key, string value) {
            if (partnerParameters == null) {
                partnerParameters = new Dictionary<string, string>();
            }
            partnerParameters.Add(key, value);

        }

        /**
         * 设置交易ID
         * @param var1  交易ID
         */
        public void setOrderId(string var1) {
            this.orderId = var1;
        }

        /**
         * 回传标识符
         * @param var1 标识符
         */
        public void setCallbackId(string var1) {
            this.callbackId = var1;
        }
        
    }
}