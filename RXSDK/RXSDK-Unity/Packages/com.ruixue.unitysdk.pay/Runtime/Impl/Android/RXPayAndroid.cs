#if UNITY_ANDROID
using System;
using System.Collections.Generic;
using System.Linq;
using RuiXueLitJson;
using UnityEngine;

namespace RuiXue.Pay.Impl
{
    internal class RXPayAndroid : IRXPay
    {
        private static AndroidJavaClass _unityPlayer;
        private static AndroidJavaObject _rxSdkObj;
        private static AndroidJavaObject _contextObj;
        private static AndroidJavaObject _rxApiObj;
        private static AndroidJavaClass _jSONUtil;

        private static AndroidJavaClass _hqSdkObj;
        private static AndroidJavaObject _hqSdkInstanceObj;
        
        private static List<string> _hqHandleList = new List<string>()
        {
            "ht", // ruixue_h5_trade
            "pm", // payermax
            "jh", // jdjh（京东支付）
            "aph", // alipayh5（支付宝h5）
            "up",  // unipin
            "a", // aums（银联）
            "wch", // wechath5（微信 h5）
            "ap", // realipay（支付宝原生）
            "xsa", // xsolla_inapp（xsolla 应用内支付）
            "co" // checkout
        };
    
        public RXPayAndroid()
        {
            _unityPlayer = new AndroidJavaClass("com.unity3d.player.UnityPlayer");
            _rxSdkObj = new AndroidJavaClass("com.ruixue.RuiXueSdk");
            _contextObj = _unityPlayer.GetStatic<AndroidJavaObject>("currentActivity");
            _rxApiObj = _rxSdkObj.CallStatic<AndroidJavaObject>("getRXSdkApi");
            _jSONUtil = new AndroidJavaClass("com.ruixue.utils.JSONUtil");
            try
            {
                _hqSdkObj = new AndroidJavaClass("com.ruixue.hq.HQSdkWrapper");
                _hqSdkInstanceObj = _hqSdkObj.CallStatic<AndroidJavaObject>("getInstance");
            }
            catch (Exception ignore)
            {
                LogUtil.WarningNotSupport("H5Pay");
            }
        }

        public void Pay(Dictionary<string, object> dic, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            string jsonStr = JsonMapper.ToJson(dic);
            AndroidJavaObject hashMap = _jSONUtil.CallStatic<AndroidJavaObject>("toMap", jsonStr);
            if (_IsHQSdkHandle(dic))
            {
                try
                {
                    _hqSdkInstanceObj?.Call<bool>("doPay", _contextObj, hashMap,
                        new JsonCallbackJavaProxy(onResponse, onError));
                }
                catch (Exception e)
                {
                    LogUtil.Log("H5Pay", e.Message);
                    LogUtil.WarningNotSupport("H5Pay");
                }
            }
            else
            {
                _rxApiObj.Call("pay", _contextObj, hashMap, new JsonCallbackJavaProxy(onResponse, onError));
            }
        }

        private bool _IsHQSdkHandle(Dictionary<string, object> dic)
        {
            var hqType = dic?.GetValueOrDefault("hq_type") as string ?? "";
            LogUtil.Log("H5Pay", "hq type:" + hqType);
            return _hqHandleList.Any(item => item.Equals(hqType));
        }
    }
}
#endif
