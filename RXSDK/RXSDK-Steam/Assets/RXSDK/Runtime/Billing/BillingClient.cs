
using System;
using System.Collections.Generic;
using System.Linq;
using Newtonsoft.Json.Linq;
using RXSDK.Net;
using UnityEngine;

namespace RXSDK
{

    abstract class BillingClient
    {
        
        public abstract string BrandName { get; }
        public abstract void DoPay(OrderData orderData, RXCallback<object> callback, MonoBehaviour mono);
        public BillingCallbackType CallbackFrom { get; protected set; } = 0;
        public virtual void Order(MonoBehaviour mono, PayArgs args, RXCallback<OrderData> callback)
        {
            Order(mono, args.ToDictionary(), callback);
        }


        public virtual void Order(MonoBehaviour mono, Dictionary<string, object> keyValuePairs, RXCallback<OrderData> callback)
        {
            keyValuePairs ??= new Dictionary<string, object>();
            if (!keyValuePairs.ContainsKey("pay_type") && !keyValuePairs.ContainsKey("hq_type"))
            {
                keyValuePairs.Add("pay_type", BrandName);
            }
            string currency = "CNY";
            keyValuePairs.TryAdd("currency", currency);
            string openid = PassportManager.Instance.CurrentLoginData?.openid;
            keyValuePairs.TryAdd("openid", openid);

            keyValuePairs.TryAdd("age", PassportManager.Instance.CurrentLoginData?.age);

            if (keyValuePairs.ContainsKey("callback_from"))
            {
                CallbackFrom = ObjectUtility.To<BillingCallbackType>(keyValuePairs["callback_from"]);
            }

            RXWebRequest rXWebRequest = RXWebRequest.Create(APIPath.ORDER);
            rXWebRequest.SetPostData(keyValuePairs);
            rXWebRequest.PostAsync(mono, callback);
        }

        public virtual void Pay(MonoBehaviour mono, Dictionary<string, object> keyValuePairs, RXCallback<object> callback)
        {

            Order(mono, keyValuePairs, (ret, e) =>
            {
                var code = ret.code;
                var orderData = ret.data;
                var msg = ret.msg;
                if (code != 0)
                {
                    // callback?.Invoke(new RXResult<object> { code = code, data = orderData?.ToJson(), msg = msg });
                    RXUtility.InvokeCallback(callback, code, orderData?.ToJson(), msg);
                }
                else
                {
                    DoPay(orderData, callback, mono);
                    // Log.D("Application.platform:" + Application.platform);
                    // // callback?.Invoke(new RXResult<object> { code = code, data = orderData?.ToJson(), msg = msg });
                    // RXUtility.InvokeCallback(callback, code, orderData?.ToJson(), msg);

                }
            });
        }
        public virtual void RestorePurchase(MonoBehaviour mono, string notifyUrl = null, RXCallback<object> callback = null)
        {
            RXUtility.InvokeCallback(callback, (int)RXErrorCode.Success);

        }

        public virtual void VerifyPayment(MonoBehaviour mono, string notifyUrl, Dictionary<string, object> keyValuePairs, RXCallback<object> callback)
        {
            if (string.IsNullOrEmpty(notifyUrl))
            {
                RXUtility.InvokeCallback(callback, (int)RXErrorCode.PayError, null, "notify url null error");
                return;
            }

            keyValuePairs ??= new Dictionary<string, object>();
            RXWebRequest rXWebRequest = RXWebRequest.Create(notifyUrl);
            rXWebRequest.SetPostData(keyValuePairs);
            // rXWebRequest.Headers = SDKConfig.Instance.GetDefaultHeader();
            rXWebRequest.PostAsync<object>(mono, (ret, e) =>
            {
                var code = ret.code;
                var data = ret.data;
                var msg = ret.msg;
                if (code == 302402 || code == 302408 || code == 302409 || code == 302414)
                {
                    code = 0;
                }
                RXUtility.InvokeCallback(callback, code, data, msg);
            });
        }

    }
}