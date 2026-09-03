#if UNITY_ANDROID
using UnityEngine;
namespace RuiXue.Ad.Impl
{
    internal class RXAdAndroid:IRXAd
    {
        public void RewardedVideoAd(string adUnitId, bool isCheck, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            LogUtil.WarningNotSupport("RewardedVideoAd");
        }

        public void BannerAd(string adUnitId, Rect pos, float adIntervals, bool isCheck, RequestResponseDelegate onResponse,
            RequestErrorDelegate onError)
        {
            LogUtil.WarningNotSupport("BannerAd");
        }

        public void InterstitialAd(string adUnitId, bool isCheck, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            LogUtil.WarningNotSupport("InterstitialAd");
        }
    }
}
#endif