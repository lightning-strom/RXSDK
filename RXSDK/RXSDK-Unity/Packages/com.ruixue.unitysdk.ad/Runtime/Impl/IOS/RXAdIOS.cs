#if UNITY_IOS
using UnityEngine;
namespace RuiXue.Ad.Impl
{
    internal class RXAdIOS:IRXAd
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