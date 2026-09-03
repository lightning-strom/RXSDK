
using System;
using System.Collections.Generic;
using System.Linq;
using Newtonsoft.Json.Linq;
using RXSDK.Net;
using UnityEngine;

namespace RXSDK
{

    public interface IPay
    {
        string BrandName { get; }
        void Pay(MonoBehaviour mono, PayArgs args, RXCallback<object> callback);
        void Pay(MonoBehaviour mono, string payType, string goodsTag, Dictionary<string, object> keyValuePairs, RXCallback<object> callback);
    }

    public enum BillingCallbackType
    {
        Server,
        Client,
    }


    public partial class BillingManager : Singleton<BillingManager>
    {
        BillingClient mBillingClient;

        public BillingManager()
        {
#if !UNITY_OPENHARMONY && !DISABLESTEAMWORKS
            mBillingClient = new SteamIapImpl();
#elif UNITY_OPENHARMONY
            mBillingClient = new HMSIapImpl();
#else
               
#endif

        }
        public string BrandName { get { return mBillingClient?.BrandName; } }

        public void Pay(MonoBehaviour mono, PayArgs args, RXCallback<object> callback)
        {
            Pay(mono, args.ToDictionary(), callback);
        }

        public void Pay(MonoBehaviour mono, string payType, string goodsTag, Dictionary<string, object> keyValuePairs, RXCallback<object> callback)
        {
            keyValuePairs ??= new Dictionary<string, object>();
            keyValuePairs.TryAdd("pay_type", payType);
            keyValuePairs.TryAdd("goods_tag", goodsTag);
            Pay(mono, keyValuePairs, callback);
        }

        public void Pay(MonoBehaviour mono, Dictionary<string, object> keyValuePairs, RXCallback<object> callback)
        {
            mBillingClient?.Pay(mono, keyValuePairs, callback);

        }
        public void RestorePurchase(MonoBehaviour mono, string notifyUrl = null, RXCallback<object> callback = null)
        {
            mBillingClient?.RestorePurchase(mono, notifyUrl, callback);
        }
        public void VerifyPayment(MonoBehaviour mono, string notifyUrl, Dictionary<string, object> keyValuePairs, RXCallback<object> callback)
        {
            mBillingClient?.VerifyPayment(mono, notifyUrl, keyValuePairs, callback);
        }

    }
}