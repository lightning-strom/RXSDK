using System.Runtime.InteropServices;
using RuiXue;
using RuiXue.Impl;
using RuiXueLitJson;
using UnityEngine;
#if UNITY_WEBGL
namespace RuiXue.Ad.Impl
{
    internal class RXAdWebGL:JsCallBackHandlerBase,IRXAd
    {
        public void RewardedVideoAd(string adUnitId, bool isCheck, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            var data = new JsonData
            {
                ["adUnitId"] = adUnitId,
                ["isCheck"] = isCheck
            };
            
            RegisterJsCallBack("rx_rewardedVideoAd", onResponse, onError);
            rx_rewardedVideoAd(data.ToJson());
        }

        public void BannerAd(string adUnitId, Rect pos, float adIntervals, bool isCheck, RequestResponseDelegate onResponse,
            RequestErrorDelegate onError)
        {
            var data = new JsonData
            {
                ["adUnitId"] = adUnitId,
                ["left"] = pos.x,
                ["top"] = pos.y,
                ["width"] = pos.width,
                ["height"] = pos.height,
                ["adIntervals"] = adIntervals,
                ["isCheck"] = isCheck,
            };
            
            RegisterJsCallBack("rx_bannerAd", onResponse, onError);
            rx_bannerAd(data.ToJson());
        }

        public void InterstitialAd(string adUnitId, bool isCheck, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            var data = new JsonData
            {
                ["adUnitId"] = adUnitId,
                ["isCheck"] = isCheck
            };
            
            RegisterJsCallBack("rx_interstitialAd", onResponse, onError);
            rx_interstitialAd(data.ToJson());
        }
        
        [DllImport("__Internal")]
        private static extern void rx_rewardedVideoAd(string data);
        
        [DllImport("__Internal")]
        private static extern void rx_bannerAd(string data);
        
        [DllImport("__Internal")]
        private static extern void rx_interstitialAd(string data);
    }
}
#endif