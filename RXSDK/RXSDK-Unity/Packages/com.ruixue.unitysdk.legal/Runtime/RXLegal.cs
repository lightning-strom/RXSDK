using RuiXue.Legal.Impl;

namespace RuiXue.Legal
{
    public static class RXLegal
    {
#if UNITY_ANDROID
        private static readonly IRXLegal _sdk = new RXLegalAndroid();
#elif UNITY_IOS
        private static readonly IRXLegal _sdk = new RXLegalIOS();
#else
        private static readonly IRXLegal _sdk = new RXLegalNotSupport();
#endif

        /// <summary>
        /// 获取法务配置
        /// </summary>
        /// <param name="onResponse"></param>
        /// <param name="onError"></param>
        public static void Legal(RequestResponseDelegate onResponse,
            RequestErrorDelegate onError)
        {
            _sdk.Legal(onResponse, onError);
        }
    }
}