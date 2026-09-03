using RuiXue.Review.Impl;

namespace RuiXue.Review
{
    public static class RXReview
    {
#if UNITY_ANDROID
        private static readonly IRXReview _sdk = new RXReviewAndroid();
#elif UNITY_IOS
        private static readonly IRXReview _sdk = new RXReviewIOS();
#else
        private static readonly IRXReview _sdk = new RXReviewNotSupport();
#endif

        /// <summary>
        /// 跳转应用商店
        /// </summary>
        /// <returns></returns>
        public static bool JumpToAppStore()
        {
            return _sdk.JumpToAppStore();
        }
    }
}