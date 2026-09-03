namespace RuiXue.Bytedance.Impl
{
    public static class RXBytedance
    {
#if UNITY_ANDROID
        private static readonly IRXBytedance _sdk = new RXBytedanceAndroid();
#else
        private static readonly IRXBytedance _sdk = null;
#endif

        /// <summary>
        /// 初始化, 在登录之前调用。
        /// </summary>
        public static void SetContext()
        {
            _sdk?.SetContext();
        }
    }
}