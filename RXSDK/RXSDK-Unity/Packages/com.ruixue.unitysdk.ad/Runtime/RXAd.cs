using RuiXue.Ad.Impl;
using UnityEngine;

namespace RuiXue.Ad
{
    public static class RXAd
    {
        #if UNITY_ANDROID
        private static readonly IRXAd _sdk = new RXAdAndroid();
        #elif UNITY_IOS
        private static readonly IRXAd _sdk = new RXAdIOS();
        #elif UNITY_WEBGL
        private static readonly IRXAd _sdk = new RXAdWebGL();
        #else
        private static readonly IRXAd _sdk = new RXAdNotSupport();
        #endif
        
        /// <summary>
        /// 激励广告
        /// </summary>
        /// <param name="adUnitId"></param>
        /// <param name="isCheck"></param>
        /// <param name="onResponse"></param>
        /// <param name="onError"></param>
        public static void RewardedVideoAd(string adUnitId, bool isCheck, RequestResponseDelegate onResponse,
            RequestErrorDelegate onError)
        {
            _sdk.RewardedVideoAd(adUnitId, isCheck, onResponse, onError);
        }


        /// <summary>
        /// banner广告
        /// </summary>
        /// <param name="adUnitId"></param>
        /// <param name="pos"></param>
        /// <param name="adIntervals"></param>
        /// <param name="isCheck"></param>
        /// <param name="onResponse"></param>
        /// <param name="onError"></param>
        public static void BannerAd(string adUnitId, Rect pos, float adIntervals, bool isCheck,
            RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            _sdk.BannerAd(adUnitId, pos, adIntervals, isCheck, onResponse, onError);
        }


        /// <summary>
        /// 插入广告
        /// </summary>
        /// <param name="adUnitId"></param>
        /// <param name="isCheck"></param>
        /// <param name="onResponse"></param>
        /// <param name="onError"></param>
        public static void InterstitialAd(string adUnitId, bool isCheck, RequestResponseDelegate onResponse,
            RequestErrorDelegate onError)
        {
            _sdk.InterstitialAd(adUnitId, isCheck, onResponse, onError);
        }
    }
}

