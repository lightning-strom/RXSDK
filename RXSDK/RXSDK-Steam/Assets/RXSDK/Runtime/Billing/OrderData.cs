
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using Newtonsoft.Json;
using RXSDK.Data;
using RXSDK.Net;
using UnityEngine;

namespace RXSDK
{
    public class OrderData : DataBean
    {
        /**
        * 金额 （单位分）
        */
        public int price;

        //出现任意一个时均可以得到正确的结果。
        //注：当多种情况同时出时，以最后一个出现的值为准。
        public string goods_tag;


        public string goods_name;

        /**
         * 订单号
         */
        public string order_no;

        /**
         * 商户订单号
         */


        public string trade_no;


        public string pay_type;


        public string notify_url;


        public string transmit_args;
        public Dictionary<string, object> ext;

        public string GetDeveloperPayload()
        {
            return string.Concat(order_no, ",", price, ",", notify_url);
            // return order_no + "," + amount + "," + notify_url;
        }
        public static OrderData FromDeveloperPayload(string payload)
        {
            if (!string.IsNullOrEmpty(payload))
            {
                string[] arr = payload.Split(",");
                if (arr != null && arr.Length >= 3)
                {
                    OrderData orderData = new()
                    {
                        order_no = arr[0],
                        notify_url = arr[2]
                    };
                    int.TryParse(arr[1], out orderData.price);
                    return orderData;
                }
            }

            return null;
        }

    }




}