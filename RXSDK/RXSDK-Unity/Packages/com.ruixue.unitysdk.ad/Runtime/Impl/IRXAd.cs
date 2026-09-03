using UnityEngine;
namespace RuiXue.Ad.Impl
{
    internal interface IRXAd
    {
        /// <summary>
        /// 激励广告
        /// </summary>
        /// <param name="adUnitId"></param>
        /// <param name="isCheck"></param>
        /// <param name="onResponse"></param>
        /// <param name="onError"></param>
        public void RewardedVideoAd(string adUnitId, bool isCheck, RequestResponseDelegate onResponse, RequestErrorDelegate onError);

    
        /// <summary>
        /// banner广告
        /// </summary>
        /// <param name="adUnitId"></param>
        /// <param name="pos"></param>
        /// <param name="adIntervals"></param>
        /// <param name="isCheck"></param>
        /// <param name="onResponse"></param>
        /// <param name="onError"></param>
        public void BannerAd(string adUnitId, Rect pos, float adIntervals, bool isCheck, RequestResponseDelegate onResponse, RequestErrorDelegate onError);
    
    
        /// <summary>
        /// 插入广告
        /// </summary>
        /// <param name="adUnitId"></param>
        /// <param name="isCheck"></param>
        /// <param name="onResponse"></param>
        /// <param name="onError"></param>
        public void InterstitialAd(string adUnitId, bool isCheck, RequestResponseDelegate onResponse, RequestErrorDelegate onError);
    }
}

